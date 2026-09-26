/* Audio layer for the KI-Sprechpartner video call (Task 48): microphone + voice activity detection (VAD), gapless
   streaming playback of PCM audio (with an analyser for lip-sync), resampling and WAV encoding. Browser APIs only. */
(function () {
  const DCCall = window.DCCall = window.DCCall || {};
  const L = (...a) => DCCall.log && DCCall.log(...a);
  let sharedCtx = null;
  DCCall.audioContext = function () {
    if (!sharedCtx) {
      sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
      L('audio', 'AudioContext ' + sharedCtx.state, { sampleRate: sharedCtx.sampleRate });
      sharedCtx.onstatechange = () => L('audio', 'AudioContext ' + sharedCtx.state);
      /* Safari/iOS (and Chrome after a long await) start it suspended: resume on the next tap anywhere */
      const wake = () => { if (sharedCtx.state !== 'running') sharedCtx.resume().catch(() => {}); };
      ['pointerdown', 'keydown', 'touchend'].forEach(ev => document.addEventListener(ev, wake, { passive: true }));
    }
    if (sharedCtx.state === 'suspended') sharedCtx.resume().catch(() => {});
    return sharedCtx;
  };

  /* ---------- helpers ---------- */
  DCCall.resample = function (input, fromRate, toRate) {
    if (fromRate === toRate) return input;
    const ratio = fromRate / toRate, out = new Float32Array(Math.floor(input.length / ratio));
    for (let i = 0; i < out.length; i++) {
      const x = i * ratio, i0 = Math.floor(x), f = x - i0;
      out[i] = (input[i0] || 0) * (1 - f) + (input[i0 + 1] !== undefined ? input[i0 + 1] : input[i0] || 0) * f;
    }
    return out;
  };
  /* little-endian signed 16-bit bytes → Float32 (keeps an odd trailing byte for the next chunk) */
  DCCall.pcm16BytesToFloat = function (bytes, carry) {
    let b = bytes;
    if (carry && carry.length) { b = new Uint8Array(carry.length + bytes.length); b.set(carry, 0); b.set(bytes, carry.length); }
    const n = Math.floor(b.length / 2), out = new Float32Array(n), dv = new DataView(b.buffer, b.byteOffset, n * 2);
    for (let i = 0; i < n; i++) out[i] = dv.getInt16(i * 2, true) / 32768;
    return { samples: out, carry: b.length % 2 ? b.slice(b.length - 1) : null };
  };
  DCCall.floatToPcm16Bytes = function (f32) {
    const out = new Uint8Array(f32.length * 2), dv = new DataView(out.buffer);
    for (let i = 0; i < f32.length; i++) dv.setInt16(i * 2, Math.max(-32768, Math.min(32767, Math.round(f32[i] * 32767))), true);
    return out;
  };
  DCCall.encodeWav = function (f32, rate) {
    const pcm = DCCall.floatToPcm16Bytes(f32), buf = new ArrayBuffer(44 + pcm.length), dv = new DataView(buf);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); dv.setUint32(4, 36 + pcm.length, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true);
    dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true);
    dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, pcm.length, true);
    new Uint8Array(buf, 44).set(pcm);
    return new Blob([buf], { type: 'audio/wav' });
  };

  /* ---------- microphone + VAD ---------- */
  class MicInput {
    constructor() { this.stream = null; this.analyser = null; this.capture = null; this.ring = []; this.ringMax = 0; this.recording = null; this.muted = false; }
    async start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { const e = new Error('Dieser Browser erlaubt keinen Mikrofonzugriff.'); e.code = 'unsupported'; throw e; }
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
      } catch (err) {
        L('mic', 'getUserMedia failed', { name: err && err.name, message: err && err.message });
        const e = new Error(err && err.name === 'NotAllowedError' ? 'Mikrofon nicht erlaubt.' : err && err.name === 'NotReadableError' ? 'Mikrofon wird von einer anderen App benutzt.' : 'Kein Mikrofon gefunden.');
        e.code = err && err.name === 'NotAllowedError' ? 'denied' : err && err.name === 'NotReadableError' ? 'busy' : 'nomic'; throw e;
      }
      const track = this.stream.getAudioTracks()[0];
      if (track) {
        let st = {}; try { st = track.getSettings(); } catch (x) {}
        L('mic', 'microphone open', { label: track.label, echoCancellation: st.echoCancellation, noiseSuppression: st.noiseSuppression, autoGainControl: st.autoGainControl, sampleRate: st.sampleRate });
        track.addEventListener('ended', () => L('mic', 'track ended (device removed or taken by another app)'));
        track.addEventListener('mute', () => L('mic', 'track muted by the system'));
        track.addEventListener('unmute', () => L('mic', 'track unmuted by the system'));
      }
      const ctx = DCCall.audioContext();
      this.source = ctx.createMediaStreamSource(this.stream);
      this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 1024; this.analyser.smoothingTimeConstant = 0.2;
      this.source.connect(this.analyser);
      this.rate = ctx.sampleRate; this.ringMax = Math.round(this.rate * 0.4 / 2048) + 1;      // 0.4 s pre-roll
      this.buf = new Float32Array(this.analyser.fftSize);
    }
    /* PCM capture through an AudioWorklet (only needed by the OpenAI transcription STT) */
    async enableCapture() {
      if (this.capture) return;
      const ctx = DCCall.audioContext();
      await ctx.audioWorklet.addModule('js/call/pcm-capture-worklet.js');
      this.capture = new AudioWorkletNode(ctx, 'dc-pcm-capture');
      this.capture.port.onmessage = e => {
        if (this.muted) return;
        if (this.recording) this.recording.push(e.data);
        this.ring.push(e.data); if (this.ring.length > this.ringMax) this.ring.shift();
      };
      this.source.connect(this.capture);
      const sink = ctx.createGain(); sink.gain.value = 0; this.capture.connect(sink); sink.connect(ctx.destination);
    }
    beginUtterance() { this.recording = this.ring.slice(); }
    endUtterance() {
      const parts = this.recording || []; this.recording = null;
      let n = 0; parts.forEach(p => { n += p.length; });
      const out = new Float32Array(n); let o = 0; parts.forEach(p => { out.set(p, o); o += p.length; });
      return { samples: out, rate: this.rate };
    }
    level() {                                                     // dBFS of the current frame
      if (!this.analyser || this.muted) return -100;
      this.analyser.getFloatTimeDomainData(this.buf);
      let s = 0; for (let i = 0; i < this.buf.length; i++) s += this.buf[i] * this.buf[i];
      return 10 * Math.log10(s / this.buf.length + 1e-12);
    }
    setMuted(m) { this.muted = m; if (this.stream) this.stream.getAudioTracks().forEach(t => { t.enabled = !m; }); L('mic', m ? 'muted (button)' : 'unmuted (button)'); }
    stop() {
      if (this.stream) L('mic', 'microphone released');
      try { if (this.stream) this.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
      try { if (this.source) this.source.disconnect(); if (this.capture) this.capture.disconnect(); } catch (e) {}
      this.stream = null; this.capture = null;
    }
  }

  /* Energy VAD with an adaptive noise floor. "start" after minSpeechMs of voice (short gaps allowed);
     silenceMs() tells the conversation engine how long the learner has been quiet (turn-taking decides, not the VAD).
     bargeIn mode (while the tutor speaks) needs a louder and longer signal, so echo leftovers don't cut the tutor off. */
  class VAD {
    constructor(mic, opts) {
      this.mic = mic; this.opts = Object.assign({ minSpeechMs: 140, bargeInMinMs: 320, gapMs: 90 }, opts || {});
      this.noise = -60; this.speaking = false; this.bargeIn = false; this.aboveSince = 0; this.lastVoice = 0; this.lastDb = -100;
      this.onStart = null; this.onStop = null; this.onLevel = null; this.timer = null; this.hist = []; this.n = 0; this.peak = -100;
    }
    threshold() { return this.bargeIn ? Math.max(this.noise + 18, -38) : Math.max(this.noise + 11, -50); }
    start() {
      this.stopTimer(); const tick = 30;
      this.timer = setInterval(() => {
        const now = performance.now(), db = this.mic.level(); this.lastDb = db;
        /* noise floor = 15th percentile of the last ~6 s: follows a fan/street/AC hum upwards as well (a floor that only
           adapted while it was quiet stayed low in a noisy room, so the noise counted as "speaking" forever) */
        this.hist.push(Math.max(-100, db)); if (this.hist.length > 200) this.hist.shift();
        if (++this.n % 10 === 0 && this.hist.length >= 20) {
          const srt = this.hist.slice().sort((a, b) => a - b);
          this.noise = Math.min(-30, Math.max(-78, srt[Math.floor(srt.length * 0.15)]));
        }
        this.peak = Math.max(this.peak, db);
        if (this.n % 100 === 0) { L('vad', 'level', { peak: Math.round(this.peak), noise: Math.round(this.noise), thr: Math.round(this.threshold()), speaking: this.speaking, bargeIn: this.bargeIn }); this.peak = -100; }
        const thr = this.threshold();
        if (db > thr) {
          if (!this.aboveSince) this.aboveSince = now;
          this.lastVoice = now;
          const need = this.bargeIn ? this.opts.bargeInMinMs : this.opts.minSpeechMs;
          if (!this.speaking && now - this.aboveSince >= need) { this.speaking = true; L('vad', 'voice start', { db: Math.round(db), thr: Math.round(thr), bargeIn: this.bargeIn }); if (this.onStart) this.onStart({ bargeIn: this.bargeIn, db }); }
        } else {
          if (this.aboveSince && now - this.lastVoice > this.opts.gapMs) this.aboveSince = 0;
          if (db < this.noise) this.noise = Math.max(-78, db);                      // got quieter: follow at once
          if (this.speaking && now - this.lastVoice > 260) { this.speaking = false; L('vad', 'voice stop'); if (this.onStop) this.onStop(); }
        }
        if (this.onLevel) this.onLevel(Math.max(0, Math.min(1, (db - this.noise) / 30)), this.speaking);
      }, tick);
    }
    silenceMs() { return this.lastVoice ? performance.now() - this.lastVoice : Infinity; }
    setBargeIn(on) { this.bargeIn = on; this.aboveSince = 0; if (on) this.speaking = false; }
    stopTimer() { if (this.timer) clearInterval(this.timer); this.timer = null; }
  }

  /* Gapless playback of streamed PCM chunks. Everything goes through one analyser (lip-sync of the illustrated tutor). */
  class AudioPlayer {
    constructor() {
      const ctx = this.ctx = DCCall.audioContext();
      this.gain = ctx.createGain(); this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 1024; this.analyser.smoothingTimeConstant = 0.35;
      this.gain.connect(this.analyser); this.analyser.connect(ctx.destination);
      this.sources = new Set(); this.t = 0; this.volume = 1;
    }
    /* schedules samples right after what is already queued; returns the AudioContext start time */
    enqueue(f32, rate) {
      if (!f32 || !f32.length) return this.t || this.ctx.currentTime;
      const buf = this.ctx.createBuffer(1, f32.length, rate); buf.copyToChannel(f32, 0);
      const src = this.ctx.createBufferSource(); src.buffer = buf; src.connect(this.gain);
      const start = Math.max(this.ctx.currentTime + 0.02, this.t);
      src.start(start); this.t = start + buf.duration;
      this.sources.add(src); src.onended = () => this.sources.delete(src);
      return start;
    }
    get busy() { return this.t > this.ctx.currentTime + 0.01; }
    remaining() { return Math.max(0, this.t - this.ctx.currentTime); }
    /* stop with a short fade (a hard cut clicks) */
    stop(fadeMs) {
      const now = this.ctx.currentTime, f = (fadeMs == null ? 50 : fadeMs) / 1000;
      try { this.gain.gain.cancelScheduledValues(now); this.gain.gain.setValueAtTime(this.gain.gain.value, now); this.gain.gain.linearRampToValueAtTime(0, now + f); } catch (e) {}
      const srcs = [...this.sources]; this.sources.clear(); this.t = 0;
      setTimeout(() => { srcs.forEach(s => { try { s.stop(); } catch (e) {} }); try { this.gain.gain.setValueAtTime(this.volume, this.ctx.currentTime); } catch (e) {} }, f * 1000 + 10);
    }
    setVolume(v) { this.volume = v; try { this.gain.gain.setValueAtTime(v, this.ctx.currentTime); } catch (e) {} }
  }

  DCCall.MicInput = MicInput;
  DCCall.VAD = VAD;
  DCCall.AudioPlayer = AudioPlayer;
})();
