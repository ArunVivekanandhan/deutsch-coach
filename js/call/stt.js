/* Speech-to-text providers for the KI-Sprechpartner (Task 48). Same interface:
     start() · stop() · onPartial(text) · onFinal(text, confidence) · onError(code, message) · interim (bool)
   browser  Web Speech API (Chrome/Edge/Safari), continuous with interim results, restarts itself (Chrome ends
            sessions after ~60 s). Streaming, free; Chrome sends the audio to Google's recogniser.
   openai   gpt-4o-mini-transcribe per utterance: our VAD cuts the utterance (incl. 0.4 s pre-roll), the WAV is sent
            with the lesson vocabulary as prompt. Works in every browser with a microphone (also Firefox); no interim text. */
(function () {
  const DCCall = window.DCCall = window.DCCall || {};
  const SR = () => window.SpeechRecognition || window.webkitSpeechRecognition;

  const L = (...a) => DCCall.log && DCCall.log(...a);

  /* onTrouble(kind, n): the recogniser keeps ending right after it starts without hearing anything ("quick-end"), or
     reports it can't get the microphone ("audio-capture"). On Android Chrome this happens when our own getUserMedia
     stream holds the microphone — the engine then releases it (see ConversationEngine.sttTrouble). */
  class BrowserSTT {
    constructor() { this.id = 'browser'; this.interim = true; this.active = false; this.restarts = []; this.quick = 0; this.sessions = 0; }
    static supported() { return !!SR(); }
    start() {
      if (this.active) return; this.active = true; this.quick = 0; L('stt', 'start (browser speech recognition)'); this.open();
    }
    open() {
      const R = SR(); if (!R) { this.onError && this.onError('unsupported', 'Spracherkennung wird von diesem Browser nicht unterstützt.'); return; }
      const rec = this.rec = new R(), n = ++this.sessions;
      rec.lang = 'de-DE'; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 3;
      this.openedAt = performance.now(); this.heard = false; let lastInterimLog = 0;
      rec.onstart = () => L('stt', `session #${n} listening`);
      rec.onaudiostart = () => L('stt', `session #${n} audio start`);
      rec.onspeechstart = () => L('stt', `session #${n} speech detected`);
      rec.onresult = ev => {
        this.heard = true; this.quick = 0;
        let interim = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const r = ev.results[i];
          if (r.isFinal) { const best = r[0]; L('stt', 'final', { text: best.transcript, conf: Math.round((best.confidence || 0) * 100) / 100 }); this.onFinal && this.onFinal(best.transcript.trim(), best.confidence, [...r].map(a => a.transcript)); }
          else interim += r[0].transcript;
        }
        if (interim.trim()) {
          const now = performance.now(); if (now - lastInterimLog > 700) { lastInterimLog = now; L('stt', 'interim', { text: interim.trim() }); }
          if (this.onPartial) this.onPartial(interim.trim());
        }
      };
      rec.onerror = ev => {
        const code = ev.error;
        L('stt', `session #${n} error: ${code}`, ev.message ? { message: ev.message } : undefined);
        if (code === 'no-speech' || code === 'aborted') return;
        if (code === 'not-allowed' || code === 'service-not-allowed') { this.active = false; this.onError && this.onError('denied', 'Mikrofon/Spracherkennung nicht erlaubt.'); }
        else if (code === 'network') this.onError && this.onError('network', 'Spracherkennung: keine Verbindung.');
        else if (code === 'audio-capture') {
          if (this.onTrouble && this.onTrouble('audio-capture', 1)) return;          // engine frees the microphone and retries
          this.active = false; this.onError && this.onError('nomic', 'Kein Mikrofon gefunden.');
        }
        else if (code === 'language-not-supported') { this.active = false; this.onError && this.onError('unsupported', 'Diese Spracherkennung kann kein Deutsch.'); }
        else this.onError && this.onError(code, 'Spracherkennung: ' + code);
      };
      rec.onend = () => {
        const dur = Math.round(performance.now() - this.openedAt);
        L('stt', `session #${n} ended after ${dur} ms` + (this.heard ? '' : ' (nothing heard)'));
        if (!this.active) return;
        if (dur < 1500 && !this.heard) this.quick++; else if (this.heard) this.quick = 0;
        if (this.quick >= 3 && this.onTrouble) this.onTrouble('quick-end', this.quick);
        if (!this.active) return;
        if (this.quick >= 8) {                                              // give up instead of an endless on/off loop
          this.active = false; L('stt', 'stopped: recogniser keeps ending without hearing anything');
          this.onError && this.onError('stalled', 'Die Spracherkennung startet immer wieder neu, hört aber nichts.');
          return;
        }
        const now = Date.now(); this.restarts = this.restarts.filter(t => now - t < 10000); this.restarts.push(now);
        const wait = this.quick >= 3 ? 1500 : this.restarts.length > 4 ? 1000 : 120;    // don't spin (mic icon flickering)
        setTimeout(() => { if (this.active) this.open(); }, wait);
      };
      try { rec.start(); } catch (e) { L('stt', 'start() threw', { message: e.message }); }
    }
    stop() { if (this.active) L('stt', 'stop'); this.active = false; try { this.rec && this.rec.abort(); } catch (e) {} }
  }

  class OpenAISTT {
    constructor(mic) { this.id = 'openai'; this.interim = false; this.mic = mic; this.active = false; }
    static supported() { return !!(window.AudioWorkletNode && DCCall.keys && DCCall.keys.openai()); }
    async start() { await this.mic.enableCapture(); this.active = true; }
    stop() { this.active = false; }
    begin() { if (this.active) this.mic.beginUtterance(); }
    /* returns the transcript of the utterance recorded since begin() */
    async end(prompt, signal) {
      const { samples, rate } = this.mic.endUtterance();
      if (samples.length < rate * 0.3) return '';
      const wav = DCCall.encodeWav(DCCall.resample(samples, rate, 16000), 16000);
      const fd = new FormData();
      fd.append('file', wav, 'utterance.wav'); fd.append('model', 'gpt-4o-mini-transcribe'); fd.append('language', 'de');
      if (prompt) fd.append('prompt', prompt.slice(0, 600));
      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', body: fd, signal,
        headers: { Authorization: 'Bearer ' + DCCall.keys.openai() } });
      if (!res.ok) { const e = new Error('Transkription: HTTP ' + res.status); e.status = res.status; L('stt', 'OpenAI transcription failed', { status: res.status }); throw e; }
      const j = await res.json();
      L('stt', 'OpenAI transcription', { seconds: Math.round(samples.length / rate * 10) / 10, text: j.text });
      return String(j.text || '').trim();
    }
  }

  DCCall.STT = { browser: BrowserSTT, openai: OpenAISTT };
})();
