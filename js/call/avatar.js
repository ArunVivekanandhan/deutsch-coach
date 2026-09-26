/* Avatar providers for the KI-Sprechpartner video call (Task 48).

   AvatarProvider interface (both implementations):
     connect(host) · disconnect() · speakChunk(samples, rate, alignment?) → queue audio for lip-synced playback
     speakNative(text) → timeline for a voice we cannot access (browser TTS) · finish() → Promise (speech done)
     stop()/interrupt() · setExpression(name) · setState(callState) · onUserVoice(level) · getStatus()

   SimliAvatar       photorealistic face; lip-sync + synchronised audio are rendered by Simli from our PCM audio
                     (native, audio-driven). Needs a Simli API key + face ID. js/vendor/simli-client.bundle.js on demand.
   IllustratedAvatar built-in drawn tutor (no key, offline). Mouth shapes (visemes) come from
                     (1) ElevenLabs per-character timestamps → German grapheme→viseme timeline (timing-exact),
                     (2) the real audio signal (analyser: loudness → jaw, spectrum → rounded/spread/fricative),
                     (3) browser TTS word-boundary events (approximate — the browser gives no audio access).
                     Expressions (listening, thinking, speaking, smile, surprised, confused), random blinking, eye
                     saccades and non-repeating idle head motion. Honest limit: it is an illustration, not a photo. */
(function () {
  const DCCall = window.DCCall = window.DCCall || {};

  /* ---------- visemes ---------- */
  const V = {                       // open (jaw), width, round, teeth (lower lip under teeth / visible teeth)
    rest: [0.03, 1, 0, 0], AA: [0.78, 1.04, 0, 0.3], E: [0.42, 1.14, 0, 0.5], I: [0.26, 1.2, 0, 0.6], O: [0.55, 0.78, 0.7, 0.1],
    OE: [0.38, 0.8, 0.65, 0.2], U: [0.3, 0.64, 1, 0], MBP: [0, 0.96, 0.1, 0], FV: [0.12, 1.02, 0, 1], SZ: [0.13, 1.1, 0.1, 1],
    SCH: [0.2, 0.8, 0.6, 0.8], TDN: [0.24, 1.02, 0, 0.5], KG: [0.34, 1, 0, 0.3], R: [0.3, 0.96, 0.1, 0.3], CH: [0.24, 1.06, 0, 0.6], PAUSE: [0.02, 1, 0, 0]
  };
  const DIGRAPHS = [['sch', ['SCH']], ['tsch', ['TDN', 'SCH']], ['ch', ['CH']], ['ei', ['AA', 'I']], ['ai', ['AA', 'I']], ['ie', ['I']], ['au', ['AA', 'U']],
    ['eu', ['O', 'I']], ['äu', ['O', 'I']], ['pf', ['MBP', 'FV']], ['ph', ['FV']], ['qu', ['KG', 'U']], ['ng', ['KG']], ['ck', ['KG']], ['tz', ['TDN', 'SZ']],
    ['th', ['TDN']], ['ß', ['SZ']]];
  const SINGLE = { a: 'AA', ä: 'E', e: 'E', i: 'I', o: 'O', ö: 'OE', u: 'U', ü: 'U', y: 'U', b: 'MBP', m: 'MBP', p: 'MBP', f: 'FV', v: 'FV', w: 'FV',
    s: 'SZ', z: 'SZ', x: 'SZ', c: 'SZ', d: 'TDN', t: 'TDN', n: 'TDN', l: 'TDN', g: 'KG', k: 'KG', h: 'KG', j: 'I', q: 'KG', r: 'R' };
  /* one viseme per character position (digraphs share their characters) */
  function charVisemes(text) {
    const s = String(text).toLowerCase(), out = new Array(s.length).fill(null);
    for (let i = 0; i < s.length;) {
      const d = DIGRAPHS.find(([g]) => s.startsWith(g, i));
      if (d) { const [g, vs] = d; for (let k = 0; k < g.length; k++) out[i + k] = vs[Math.min(vs.length - 1, Math.floor(k * vs.length / g.length))]; i += g.length; continue; }
      const c = s[i]; out[i] = SINGLE[c] || (/[.,;:!?…\-–]/.test(c) ? 'PAUSE' : c === ' ' ? null : 'rest'); i++;
    }
    return out;
  }
  DCCall.charVisemes = charVisemes;

  /* ---------- provider base ---------- */
  class AvatarProvider {
    constructor(tutor) { this.tutor = tutor; this.state = 'IDLE'; this.expression = 'neutral'; this.listeners = {}; }
    on(ev, f) { (this.listeners[ev] = this.listeners[ev] || []).push(f); }
    emit(ev, d) { (this.listeners[ev] || []).forEach(f => { try { f(d); } catch (e) {} }); }
    setState(s) { this.state = s; }
    setExpression(e) { this.expression = e; }
    onUserVoice() {}
    getStatus() { return { id: this.id, connected: !!this.connected, capabilities: this.capabilities }; }
  }

  /* ---------- illustrated tutor ---------- */
  function svgDefs(t, uid) {
    const L = t.look, sk = L.skin, hr = L.hair;
    const hairBack = L.style === 'long' ? `<path d="M52 92 Q48 40 100 36 Q152 40 148 92 L152 160 Q100 150 48 160 Z" fill="${hr}"/>`
      : L.style === 'bun' ? `<circle cx="100" cy="30" r="18" fill="${hr}"/>` : '';
    const hairTop = L.style === 'curly' ? `<g fill="${hr}">${[62, 76, 90, 104, 118, 132].map((x, i) => `<circle cx="${x + 4}" cy="${52 - (i % 2) * 6}" r="16"/>`).join('')}</g>`
      : L.style === 'side' ? `<path d="M58 78 Q60 42 102 42 Q140 42 144 70 Q118 56 84 64 Q70 68 58 84 Z" fill="${hr}"/>`
      : L.style === 'short' ? `<path d="M58 80 Q58 40 100 40 Q142 40 142 80 Q126 58 100 58 Q74 58 58 80 Z" fill="${hr}"/>`
      : `<path d="M56 86 Q56 40 100 40 Q144 40 144 86 Q138 60 100 58 Q62 60 56 86 Z" fill="${hr}"/>`;
    const brow = hr === '#e5e7eb' ? '#9ca3af' : hr;
    return `<svg viewBox="0 0 200 200" class="av-svg" role="img" aria-label="${t.name}">
      <defs><clipPath id="mc-${uid}"><path class="mclip"/></clipPath></defs>
      ${hairBack}
      <path d="M36 200 Q42 150 100 146 Q158 150 164 200 Z" fill="${L.shirt}"/>
      ${L.tie ? '<path d="M96 150 L104 150 L108 186 L100 196 L92 186 Z" fill="#b91c1c"/>' : ''}
      <rect x="88" y="126" width="24" height="26" rx="8" fill="${sk}"/>
      <g class="head">
        <ellipse cx="100" cy="92" rx="44" ry="50" fill="${sk}"/>
        <ellipse cx="56" cy="96" rx="7" ry="11" fill="${sk}"/><ellipse cx="144" cy="96" rx="7" ry="11" fill="${sk}"/>
        ${hairTop}
        <g class="eye" data-x="82"><ellipse cx="82" cy="92" rx="7.5" ry="7" fill="#fff"/><g class="pupil"><circle cx="82" cy="92" r="4.6" fill="#3b2a1e"/><circle cx="82" cy="92" r="2.2" fill="#0b0b0b"/><circle cx="83.6" cy="90.4" r="1.2" fill="#fff"/></g></g>
        <g class="eye" data-x="118"><ellipse cx="118" cy="92" rx="7.5" ry="7" fill="#fff"/><g class="pupil"><circle cx="118" cy="92" r="4.6" fill="#3b2a1e"/><circle cx="118" cy="92" r="2.2" fill="#0b0b0b"/><circle cx="119.6" cy="90.4" r="1.2" fill="#fff"/></g></g>
        <g class="lids" fill="${sk}"><rect class="lid" x="73" y="83" width="18" height="18" rx="7"/><rect class="lid" x="109" y="83" width="18" height="18" rx="7"/></g>
        <path class="brow bl" d="M73 79 Q82 73 91 77" stroke="${brow}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
        <path class="brow br" d="M109 77 Q118 73 127 79" stroke="${brow}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
        ${L.glasses ? '<g fill="none" stroke="#374151" stroke-width="2.4"><circle cx="82" cy="92" r="12"/><circle cx="118" cy="92" r="12"/><path d="M94 92 L106 92"/></g>' : ''}
        ${L.bindi ? '<circle cx="100" cy="74" r="3" fill="#dc2626"/>' : ''}
        <path d="M100 98 Q96 110 101 112" stroke="#00000033" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle class="cheek" cx="74" cy="112" r="7" fill="#f87171" opacity=".16"/><circle class="cheek" cx="126" cy="112" r="7" fill="#f87171" opacity=".16"/>
        ${L.beard ? `<path d="M64 110 Q70 146 100 146 Q130 146 136 110 Q124 132 100 132 Q76 132 64 110 Z" fill="${hr}" opacity=".85"/>` : ''}
        <path class="minner" fill="#4a0f12"/>
        <g clip-path="url(#mc-${uid})"><rect class="teeth" x="84" y="114" width="32" height="7" rx="2" fill="#f8fafc"/><ellipse class="tongue" cx="100" cy="134" rx="9" ry="5" fill="#be4b55"/></g>
        <path class="lips" fill="none" stroke="#a3443f" stroke-width="2.6" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }
  let uidN = 0;
  const lerp = (a, b, k) => a + (b - a) * k;
  const EXPR = {                       // browL/R lift, brow tilt (inner up), smile, lid (0 open → 1 closed), gazeY bias
    neutral: [0, 0, 0.1, 0.05, 0], listening: [1, 0.3, 0.3, 0.02, 0], thinking: [-0.4, -0.6, 0.02, 0.18, -3],
    speaking: [0.4, 0, 0.15, 0.04, 0], happy: [1.2, 0.2, 0.75, 0.12, 0], surprised: [3, 0.4, 0.1, -0.05, 0], confused: [1.6, -0.9, 0, 0.1, 0]
  };
  class IllustratedAvatar extends AvatarProvider {
    constructor(tutor) {
      super(tutor);
      this.id = 'illustrated';
      this.capabilities = { photoreal: false, nativeLipSync: false, visemes: 'audio + timestamps', expressions: true };
      this.player = null; this.timeline = []; this.nativeTL = null;
      this.m = { open: 0.03, width: 1, round: 0, teeth: 0 }; this.e = { bl: 0, tilt: 0, smile: 0.1, lid: 0.05, gy: 0 };
      this.head = { yaw: 0, pitch: 0, roll: 0, nod: 0, nodV: 0 }; this.gaze = { x: 0, y: 0, tx: 0, ty: 0, next: 0 };
      this.blinkAt = performance.now() + 1500; this.blinkT = -1; this.phase = [Math.random() * 6, Math.random() * 6, Math.random() * 6];
      this.userLevel = 0; this.lastUserPeak = 0; this.speaking = false;
    }
    async connect(host) {
      this.uid = ++uidN;
      host.innerHTML = `<div class="av-illu">${svgDefs(this.tutor, this.uid)}</div>`;
      const q = s => host.querySelector(s);
      this.el = { head: q('.head'), pupils: host.querySelectorAll('.pupil'), lids: host.querySelectorAll('.lid'), bl: q('.bl'), br: q('.br'),
        inner: q('.minner'), lips: q('.lips'), clip: q('.mclip'), teeth: q('.teeth'), tongue: q('.tongue') };
      this.player = new DCCall.AudioPlayer();
      this.fbuf = new Uint8Array(this.player.analyser.frequencyBinCount); this.tbuf = new Float32Array(this.player.analyser.fftSize);
      this.connected = true; this.last = performance.now();
      const loop = now => { if (!this.connected) return; this.frame(now); this.raf = requestAnimationFrame(loop); };
      this.raf = requestAnimationFrame(loop);
    }
    disconnect() { this.connected = false; cancelAnimationFrame(this.raf); this.stop(); }
    /* audio chunk of the current segment (= one TTS request, one sentence). ElevenLabs alignment times count from the start
       of the request or of the chunk — both are handled: times that jump back below the segment's last end are chunk-relative. */
    speakChunk(samples, rate, alignment) {
      const t0 = this.player.enqueue(samples, rate);
      if (!this.utterStart) { this.utterStart = t0; this.segEnd = 0; this.chunkRel = false; }
      if (alignment && alignment.chars && alignment.chars.length) {
        const text = alignment.chars.join(''), vis = charVisemes(text), last = alignment.chars.length - 1;
        if (!this.chunkRel && alignment.starts[0] + 0.02 < this.segEnd) this.chunkRel = true;
        const base = this.chunkRel ? t0 : this.utterStart;
        for (let i = 0; i <= last; i++) if (vis[i]) this.timeline.push({ t: base + alignment.starts[i], e: base + alignment.ends[i], v: vis[i] });
        this.segEnd = alignment.ends[last];
      }
      this.speaking = true;
    }
    newUtterance() { this.utterStart = 0; }
    newSegment() { this.utterStart = 0; }
    /* browser voice: we only get word-boundary events → per-word viseme spread (approximate, labelled in the UI) */
    speakNative(text, rate) {
      this.nativeTL = { text, vis: charVisemes(text), rate: rate || 1, wordStart: -1, t0: performance.now() };
      this.speaking = true;
    }
    nativeBoundary(charIndex) { if (this.nativeTL) { this.nativeTL.wordStart = charIndex; this.nativeTL.t0 = performance.now(); } }
    nativeEnd() { this.nativeTL = null; this.speaking = false; }
    finish() {
      return new Promise(res => {
        const check = () => { if (!this.player || !this.player.busy) { this.speaking = false; this.timeline = []; this.utterStart = 0; res(); } else setTimeout(check, 60); };
        check();
      });
    }
    stop() { if (this.player) this.player.stop(40); this.timeline = []; this.utterStart = 0; this.nativeTL = null; this.speaking = false; }
    interrupt() { this.stop(); this.setExpression('listening'); }
    setVolume(v) { if (this.player) this.player.setVolume(v); }
    setState(s) {
      super.setState(s);
      const map = { LISTENING: 'listening', USER_SPEAKING: 'listening', PROCESSING: 'thinking', AI_SPEAKING: 'speaking', INTERRUPTED: 'listening', PAUSED: 'neutral', RECONNECTING: 'thinking', ERROR: 'confused' };
      if (map[s] && !(s === 'AI_SPEAKING' && ['happy', 'surprised', 'confused'].includes(this.expression))) this.expression = map[s];
      if (s === 'PROCESSING') { this.gaze.tx = -3.2; this.gaze.ty = -2.4; this.gaze.next = performance.now() + 900; }
    }
    onUserVoice(level, speaking) {                          // listening: small nods when the learner stresses something
      const now = performance.now();
      if (speaking && level > 0.55 && now - this.lastUserPeak > 1800 && Math.random() < 0.35) { this.head.nodV -= 0.9; this.lastUserPeak = now; }
      this.userLevel = level;
    }
    /* ---- per-frame animation ---- */
    frame(now) {
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      const k = tau => 1 - Math.exp(-dt / tau);
      // mouth target
      let tgt = V.rest, env = 0;
      if (this.player && this.player.busy) {
        const an = this.player.analyser; an.getFloatTimeDomainData(this.tbuf); an.getByteFrequencyData(this.fbuf);
        let s = 0; for (let i = 0; i < this.tbuf.length; i++) s += this.tbuf[i] * this.tbuf[i];
        env = Math.min(1, Math.sqrt(s / this.tbuf.length) * 5.5);
        const ctxT = this.player.ctx.currentTime - (this.player.ctx.outputLatency || this.player.ctx.baseLatency || 0);
        const seg = this.timeline.find(x => ctxT >= x.t && ctxT < x.e);
        if (seg) tgt = V[seg.v];                                              // timestamps: exact viseme
        else if (env > 0.06) {                                                // audio-driven shape
          const bin = hz => Math.round(hz / (this.player.ctx.sampleRate / 2) * this.fbuf.length);
          let lo = 0, hi = 0; for (let i = bin(250); i < bin(1100); i++) lo += this.fbuf[i]; for (let i = bin(3000); i < bin(7000); i++) hi += this.fbuf[i];
          const ratio = hi / (lo + hi + 1);
          tgt = ratio > 0.42 ? V.SZ : env > 0.55 ? V.AA : ratio < 0.12 ? V.O : V.E;
        } else tgt = V.MBP;
        while (this.timeline.length && this.timeline[0].e < ctxT - 0.5) this.timeline.shift();
      } else if (this.nativeTL) {                                             // browser voice (approximate)
        const tl = this.nativeTL, cps = 13 * tl.rate;                       // characters per second
        const idx = tl.wordStart >= 0 ? tl.wordStart + Math.floor((now - tl.t0) / 1000 * cps) : Math.floor((now - tl.t0) / 1000 * cps);
        let v = null; for (let i = idx; i >= Math.max(0, idx - 2) && !v; i--) v = tl.vis[i];
        tgt = idx < tl.vis.length ? V[v || 'rest'] : V.rest; env = idx < tl.vis.length ? 0.8 : 0;
      }
      const openScale = (this.player && this.player.busy && env) ? 0.45 + 0.55 * env : 1;
      this.m.open = lerp(this.m.open, tgt[0] * openScale, k(0.035));
      this.m.width = lerp(this.m.width, tgt[1], k(0.06)); this.m.round = lerp(this.m.round, tgt[2], k(0.06)); this.m.teeth = lerp(this.m.teeth, tgt[3], k(0.05));
      // expression
      const ex = EXPR[this.expression] || EXPR.neutral;
      this.e.bl = lerp(this.e.bl, ex[0] + (this.speaking ? env * 0.8 : 0), k(0.18)); this.e.tilt = lerp(this.e.tilt, ex[1], k(0.25));
      this.e.smile = lerp(this.e.smile, ex[2], k(0.3)); this.e.gy = lerp(this.e.gy, ex[4], k(0.3));
      // blink (random intervals, sometimes double)
      if (this.blinkT < 0 && now >= this.blinkAt) this.blinkT = now;
      let blink = 0;
      if (this.blinkT >= 0) {
        const p = (now - this.blinkT) / 150; blink = p < 1 ? Math.sin(p * Math.PI) : 0;
        if (p >= 1) { this.blinkT = -1; this.blinkAt = now + (Math.random() < 0.12 ? 180 : 1400 + -Math.log(1 - Math.random()) * 2600); }
      }
      const lid = Math.max(0, Math.min(1, ex[3] + blink));
      // gaze: saccades (look away briefly while speaking/thinking, mostly eye contact while listening)
      if (now > this.gaze.next) {
        const listening = this.expression === 'listening', thinking = this.expression === 'thinking';
        const away = thinking ? 0.9 : listening ? 0.12 : 0.3;
        if (Math.random() < away) { this.gaze.tx = (Math.random() * 2 - 1) * 3; this.gaze.ty = (Math.random() * 2 - 1.2) * 2 + (thinking ? -1.5 : 0); }
        else { this.gaze.tx = (Math.random() - 0.5) * 0.8; this.gaze.ty = (Math.random() - 0.5) * 0.6; }
        this.gaze.next = now + 500 + Math.random() * (listening ? 2600 : 1800);
      }
      this.gaze.x = lerp(this.gaze.x, this.gaze.tx, k(0.045)); this.gaze.y = lerp(this.gaze.y, this.gaze.ty + this.e.gy, k(0.045));
      // head: smooth non-repeating drift (incommensurate frequencies) + speech emphasis + nods (damped spring)
      const t = now / 1000, P = this.phase;
      const drift = a => Math.sin(t * 0.37 + P[0] + a) * 0.6 + Math.sin(t * 0.113 + P[1] + a * 2) * 0.9 + Math.sin(t * 0.0517 + P[2] + a * 3) * 0.7;
      this.head.nodV += (-this.head.nod * 60 - this.head.nodV * 9) * dt; this.head.nod += this.head.nodV * dt * 10;
      const roll = drift(0) * (this.expression === 'confused' ? 2.5 : 1) + (this.expression === 'listening' ? 1.4 : 0);
      const pitch = drift(1.3) * 0.6 + this.head.nod * 3 + (this.speaking ? env * 1.6 : 0);
      const yaw = drift(2.1) * 1.2;
      this.render(lid, roll, pitch, yaw);
    }
    render(lid, roll, pitch, yaw) {
      const E = this.el; if (!E.head) return;
      E.head.setAttribute('transform', `translate(${yaw.toFixed(2)} ${pitch.toFixed(2)}) rotate(${roll.toFixed(2)} 100 140)`);
      E.pupils.forEach(p => p.setAttribute('transform', `translate(${this.gaze.x.toFixed(2)} ${this.gaze.y.toFixed(2)})`));
      E.lids.forEach(l => { l.setAttribute('height', (18 * lid).toFixed(2)); l.setAttribute('y', 83); });
      const bl = this.e.bl, tilt = this.e.tilt;
      E.bl.setAttribute('d', `M73 ${79 - bl} Q82 ${73 - bl - tilt * 1.4} 91 ${77 - bl - tilt * 2}`);
      E.br.setAttribute('d', `M109 ${77 - bl - tilt * 2} Q118 ${73 - bl - tilt * 1.4} 127 ${79 - bl}`);
      // mouth
      const m = this.m, w = 13 * m.width * (1 - 0.3 * m.round), cy = 123, sm = this.e.smile * (1 - m.open) * 3.2;
      const top = cy - 1.6 - m.open * 2 - m.round * 1.2, bot = cy + 1 + m.open * 15 + m.round * 2;
      const lx = 100 - w, rx = 100 + w, cyc = cy - sm;
      const d = `M${lx.toFixed(2)} ${cyc.toFixed(2)} Q100 ${(top - m.round * 3).toFixed(2)} ${rx.toFixed(2)} ${cyc.toFixed(2)} Q100 ${(bot + m.round * 2).toFixed(2)} ${lx.toFixed(2)} ${cyc.toFixed(2)} Z`;
      E.inner.setAttribute('d', d); E.clip.setAttribute('d', d); E.lips.setAttribute('d', d);
      E.teeth.setAttribute('y', (top + 0.2).toFixed(2)); E.teeth.setAttribute('opacity', Math.min(1, m.teeth * 0.6 + m.open).toFixed(2));
      E.tongue.setAttribute('cy', (bot + 1.5).toFixed(2));
    }
  }

  /* ---------- photorealistic tutor (Simli) ---------- */
  function loadScript(src) {
    return new Promise((res, rej) => {
      if (window.SimliSDK) return res();
      const s = document.createElement('script'); s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error('Simli-SDK konnte nicht geladen werden.'));
      document.head.appendChild(s);
    });
  }
  class SimliAvatar extends AvatarProvider {
    constructor(tutor, cfg) {
      super(tutor);
      this.id = 'simli'; this.cfg = cfg;
      this.capabilities = { photoreal: true, nativeLipSync: true, visemes: 'native (Simli, audio-driven)', expressions: false };
      this.talking = false; this.pending = 0;
    }
    async connect(host) {
      if (!this.cfg.apiKey || !this.cfg.faceId) throw new Error('Simli: API-Schlüssel und Face-ID fehlen (⚙ Einstellungen).');
      await loadScript('js/vendor/simli-client.bundle.js');
      host.innerHTML = '<div class="av-video"><video autoplay playsinline></video><audio autoplay></audio></div>';
      this.video = host.querySelector('video'); this.audio = host.querySelector('audio');
      const SDK = window.SimliSDK;
      /* the SDK rejects with Errors, Responses or plain objects — turn all of them into a readable message */
      const why = x => x instanceof Error ? x.message : x && (x.detail || x.message || (x.status && 'HTTP ' + x.status)) || String(x);
      const step = (p, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(what + ': Zeitüberschreitung')), 15000))])
        .catch(e => { throw new Error(what + ' — ' + why(e)); });
      const token = await step(SDK.generateSimliSessionToken({ apiKey: this.cfg.apiKey,
        config: { faceId: this.cfg.faceId, handleSilence: true, maxSessionLength: 3600, maxIdleTime: 600, model: 'fasttalk' } }), 'Simli-Sitzung');
      if (!token || !token.session_token) throw new Error('Simli-Sitzung — kein Token (Schlüssel/Face-ID prüfen)');
      const ice = await step(SDK.generateIceServers(this.cfg.apiKey), 'Simli-Verbindung');
      this.client = new SDK.SimliClient(token.session_token, this.video, this.audio, ice, SDK.LogLevel.ERROR, 'p2p');
      this.client.on('speaking', () => { this.talking = true; this.emit('speaking'); });
      this.client.on('silent', () => { this.talking = false; this.emit('silent'); });
      this.client.on('error', d => this.emit('error', new Error('Simli: ' + d)));
      this.client.on('startup_error', d => this.emit('error', new Error('Simli: ' + d)));
      this.client.on('stop', () => { this.connected = false; this.emit('disconnected'); });
      await step(this.client.start(), 'Simli-Video');
      this.connected = true;
    }
    async disconnect() { this.connected = false; try { if (this.client) await this.client.stop(); } catch (e) {} }
    newUtterance() { this.sentAt = performance.now(); this.sentSec = 0; }
    speakChunk(samples, rate) {                          // Simli wants PCM16 mono 16 kHz; it renders lips + plays the audio
      const s16 = DCCall.resample(samples, rate, 16000), bytes = DCCall.floatToPcm16Bytes(s16);
      for (let o = 0; o < bytes.length; o += 6000) this.client.sendAudioData(bytes.subarray(o, Math.min(bytes.length, o + 6000)));
      this.sentSec = (this.sentSec || 0) + s16.length / 16000;
    }
    speakNative() { throw new Error('Simli braucht eine Stimme mit Audiodaten (OpenAI oder ElevenLabs).'); }
    finish() {                                           // done when Simli reports silence after the audio we sent
      return new Promise(res => {
        const until = (this.sentAt || performance.now()) + (this.sentSec || 0) * 1000 + 250;
        const check = () => { if (!this.talking && performance.now() > until) res(); else setTimeout(check, 80); };
        setTimeout(check, 200);
      });
    }
    stop() { try { this.client && this.client.ClearBuffer(); } catch (e) {} this.talking = false; this.sentSec = 0; }
    interrupt() { this.stop(); }
    setVolume(v) { if (this.audio) this.audio.volume = v; }
  }

  DCCall.AvatarProvider = AvatarProvider;
  DCCall.IllustratedAvatar = IllustratedAvatar;
  DCCall.SimliAvatar = SimliAvatar;
  DCCall.VISEMES = V;
  /* static thumbnail (tutor cards, report) */
  DCCall.avatarThumb = function (t) { return svgDefs(t, 'th' + (++uidN)); };
})();
