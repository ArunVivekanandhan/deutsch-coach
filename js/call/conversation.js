/* Conversation engine of the KI-Sprechpartner video call (Task 48).

   Pipeline:  mic → VAD + STT (streaming) → turn-taking (end-of-turn with hesitation tolerance) → page handler
              (guided lesson or LLM) → sentence stream → TTS stream → avatar (lip-synced) → back to LISTENING.
   - Streaming: dcStreamAI tokens are cut into sentences; sentence 1 is synthesised + spoken while the LLM is still
     writing sentence 2; TTS chunks go to the avatar as they arrive (the next sentence is prefetched).
   - Barge-in: while the tutor talks the VAD runs in a stricter mode (louder + longer, echo-cancelled mic) and the
     browser STT's interim text is checked against what the tutor is saying (echo guard). Learner speech → the LLM
     stream is aborted, TTS requests cancelled, audio faded out within ~50 ms, state INTERRUPTED → USER_SPEAKING;
     the partial tutor sentence goes into the history so the model can react to the interruption.
   - Turn-taking: the learner's turn ends after a silence whose length depends on the level and on what was said —
     "Ich möchte … äh …", a trailing "und/weil/zum" or an article extends the wait (natural hesitation).
   - Failures: timeouts, HTTP 5xx/429 and network errors are retried with back-off (state RECONNECTING, message
     "Verbindung wird wiederhergestellt…"); offline/online events pause/resume; a failing premium voice falls back to
     the browser voice for that sentence; a failing photoreal avatar falls back to the illustrated tutor. */
(function () {
  const DCCall = window.DCCall = window.DCCall || {};
  /* the learner is probably not finished: filler ("äh"), conjunction, article/preposition, pronoun or modal at the end, or "…".
     (JS \\b is ASCII-only — it would never match before "äh"/"für", hence the explicit Unicode letter boundary) */
  const HESITATION = new RegExp('(?:^|[^\\p{L}])(?:äh+m?|ähm|öhm|hm+|mhm|also|na ja|naja|und|aber|oder|weil|dass|wenn|denn|damit|ob|der|die|das|den|dem|des|'
    + 'ein|eine|einen|einem|einer|zu|zum|zur|mit|nach|von|vom|bei|beim|für|auf|in|im|an|am|ich|du|er|sie|wir|ihr|mein|meine|dein|deine|'
    + 'möchte|möchtest|möchten|würde|würdest|hätte|hättest)[\\s.…]*$|,\\s*$|…\\s*$|\\.\\.\\.\\s*$', 'iu');
  const BASE_HANG = { A1: 1150, A2: 1000, B1: 880, B2: 780 };
  const L = (...a) => DCCall.log && DCCall.log(...a);
  const words = s => String(s || '').toLowerCase().replace(/[^a-zäöüß0-9\s]/gi, ' ').split(/\s+/).filter(Boolean);
  const ABBR = /^(?:z|d|u|o|s|bzw|usw|vgl|Dr|Nr|ca|Str|evtl|ggf|inkl|bspw|Hr|Fr|Mio|Mrd|Jh|etc)\.$/i;
  /* complete sentences in text[from..]; a sentence ends at . ! ? … followed by whitespace (the stream may still grow).
     Abbreviations ("z. B.", "Dr.") and ordinals ("3.") don't end a sentence. */
  function takeSentences(text, from) {
    const out = []; let i = from, start = from;
    while (i < text.length) {
      if ('.!?…'.includes(text[i])) {
        let j = i + 1; while (j < text.length && '.!?…"“”»«)'.includes(text[j])) j++;
        if (j >= text.length) break;
        if (/\s/.test(text[j])) {
          const cand = text.slice(start, j).trim(), last = cand.split(/\s+/).pop();
          if (text[i] === '.' && (ABBR.test(last) || /^\d+\.$/.test(last) || /^[a-zäöü]\.$/i.test(last))) { i = j; continue; }
          if (cand) out.push(cand);
          start = j;
        }
        i = j; continue;
      }
      i++;
    }
    return { sentences: out, next: start };
  }

  class ConversationEngine {
    /* o: { tutor, level, host, settings(), ui:{state, captionUser, captionAI, notice, metrics, avatarChanged},
            onUserTurn: async (text, info) => void, sttPrompt(): string } */
    constructor(o) {
      this.o = o; this.sm = new DCCall.CallStateMachine();
      this.utter = { finals: [], interim: '', last: 0, alts: [] };
      this.metrics = []; this.turnId = 0; this.speaking = null; this.handlers = [];
      this.sm.on((to, from, info) => {
        L('state', from + ' → ' + to, info && info.reason ? { reason: info.reason } : undefined);
        if (to === 'USER_SPEAKING') this.userSince = performance.now();
        if (this.avatar) this.avatar.setState(to);
        if (this.vad) this.vad.setBargeIn(to === 'AI_SPEAKING');
        if (this.o.ui.state) this.o.ui.state(to, from);
      });
    }
    get state() { return this.sm.state; }
    settings() { return this.o.settings(); }

    /* ---------------- lifecycle ---------------- */
    async start() {
      const ui = this.o.ui, notice = ui.notice;
      ui.notice = (msg, kind, retry) => { if (msg) L('notice', msg, { kind }); return notice(msg, kind, retry); };
      this.sm.go('CONNECTING');
      const s = this.settings();
      L('call', 'providers requested', { voice: s.voice, avatar: s.avatar, stt: s.stt, level: this.o.level() });
      this.tts = this.makeTTS(s.voice);
      this.browserTTS = new DCCall.TTS.browser();
      await this.connectAvatar(s.avatar);
      L('call', 'tts provider: ' + this.tts.id + ', avatar: ' + (this.avatar && this.avatar.id));
      /* microphone (+ VAD). Android Chrome's speech recogniser cannot share the microphone with our own audio stream
         (it ends at once / audio-capture error → mic icon flickers, nothing is heard), so there the browser STT runs
         alone ("stt-only": barge-in and turn-taking from the recognised words, no level meter). */
      const sttOnly = s.stt !== 'openai' && DCCall.STT.browser.supported() && (/Android/i.test(navigator.userAgent) || s.micMode === 'stt-only');
      this.micMode = sttOnly ? 'stt-only' : 'full';
      if (sttOnly) { this.mic = undefined; L('mic', 'mode stt-only: microphone is left to the speech recogniser', { android: /Android/i.test(navigator.userAgent) }); }
      else await this.openMic();
      await this.startSTT(s.stt);
      this.turnTimer = setInterval(() => this.checkTurnEnd(), 90);
      this.onOffline = () => { if (this.sm.live()) { this.abortCurrent('offline'); this.sm.go('RECONNECTING'); this.o.ui.notice('📡 Verbindung wird wiederhergestellt …', 'reconnect'); } };
      this.onOnline = () => { if (this.sm.is('RECONNECTING')) { this.o.ui.notice(''); this.sm.go('LISTENING'); if (this.pendingTurn) this.retryTurn(); } };
      window.addEventListener('offline', this.onOffline); window.addEventListener('online', this.onOnline);
      this.sm.go('LISTENING');
    }
    async openMic() {
      this.mic = new DCCall.MicInput();
      try {
        await this.mic.start();
        this.vad = new DCCall.VAD(this.mic);
        this.vad.onStart = info => this.onVoiceStart(info);
        this.vad.onLevel = (lv, sp) => { if (this.avatar && this.sm.is('USER_SPEAKING', 'LISTENING')) this.avatar.onUserVoice(lv, sp); if (this.o.ui.level) this.o.ui.level(lv, sp); };
        this.vad.start();
        if (this.muted) this.mic.setMuted(true);
      } catch (e) {
        this.mic = null; this.vad = null;
        this.o.ui.notice(e.code === 'denied' ? '🎙️ Mikrofon nicht erlaubt — erlaube es in den Browser-Einstellungen (🔒 neben der Adresse) oder schreib unten (💬).' : '🎙️ ' + e.message + ' — du kannst schreiben (💬).', 'warn');
      }
    }
    /* the browser recogniser can't get the microphone while our stream holds it → release ours, keep the recogniser */
    sttTrouble(kind, n) {
      L('stt', 'trouble: ' + kind, { count: n, micMode: this.micMode });
      if (this.micMode !== 'full' || !this.mic) return false;
      this.micMode = 'stt-only';
      try { this.vad && this.vad.stopTimer(); } catch (e) {}
      try { this.mic.stop(); } catch (e) {}
      this.mic = undefined; this.vad = null;
      if (this.o.ui.level) this.o.ui.level(0, false);
      L('mic', 'switched to stt-only: released our microphone stream for the speech recogniser');
      if (kind !== 'setting') this.o.ui.notice('🎙️ Die Spracherkennung bekam das Mikrofon nicht — ich habe umgeschaltet. Sprich einfach weiter.', 'warn');
      if (this.stt) { this.stt.quick = 0; if (kind === 'audio-capture') setTimeout(() => { if (this.stt && this.stt.active) this.stt.open(); }, 300); }
      return true;
    }
    makeTTS(id) {
      const T = DCCall.TTS[id] || DCCall.TTS.browser, t = new T();
      return t.available() ? t : new DCCall.TTS.browser();
    }
    async connectAvatar(kind) {
      const s = this.settings();
      if (kind === 'simli' && !this.tts.native) {
        try {
          this.avatar = new DCCall.SimliAvatar(this.o.tutor, { apiKey: DCCall.keys.simli(), faceId: s.simliFace });
          this.avatar.on('error', e => this.avatarFailed(e));
          await this.avatar.connect(this.o.host);
          if (this.o.ui.avatarChanged) this.o.ui.avatarChanged(this.avatar);
          return;
        } catch (e) { this.o.ui.notice('🎭 Fotorealistischer Tutor nicht verfügbar (' + e.message + ') — illustrierter Tutor.', 'warn'); }
      } else if (kind === 'simli') this.o.ui.notice('🎭 Der fotorealistische Tutor braucht eine KI-Stimme (OpenAI oder ElevenLabs) — illustrierter Tutor.', 'warn');
      this.avatar = new DCCall.IllustratedAvatar(this.o.tutor);
      await this.avatar.connect(this.o.host);
      this.avatar.setVolume(this.volume == null ? 1 : this.volume);
      if (this.o.ui.avatarChanged) this.o.ui.avatarChanged(this.avatar);
    }
    async avatarFailed(e) {
      if (this.avatar && this.avatar.id === 'simli') {
        this.o.ui.notice('🎭 Verbindung zum fotorealistischen Tutor verloren — illustrierter Tutor übernimmt.', 'warn');
        try { await this.avatar.disconnect(); } catch (x) {}
        this.avatar = new DCCall.IllustratedAvatar(this.o.tutor); await this.avatar.connect(this.o.host);
        this.avatar.setState(this.state); if (this.o.ui.avatarChanged) this.o.ui.avatarChanged(this.avatar);
      }
    }
    async startSTT(kind) {
      const useOpenAI = kind === 'openai' && DCCall.STT.openai.supported() && this.mic;
      if (kind === 'openai' && !useOpenAI) L('stt', 'OpenAI transcription not possible (key, AudioWorklet or microphone missing) — using the browser recogniser');
      if (useOpenAI) { this.stt = new DCCall.STT.openai(this.mic); await this.stt.start(); L('stt', 'provider: OpenAI transcription'); }
      else if (DCCall.STT.browser.supported() && this.mic !== null) {
        this.stt = new DCCall.STT.browser();
        this.stt.onPartial = t => this.onPartial(t);
        this.stt.onFinal = (t, c, alts) => this.onFinal(t, c, alts);
        this.stt.onError = (code, msg) => this.onSTTError(code, msg);
        this.stt.onTrouble = (k, n) => this.sttTrouble(k, n);
        if (!this.muted) this.stt.start();
      } else {
        L('stt', 'no speech recognition', { supported: DCCall.STT.browser.supported(), mic: this.mic === null ? 'failed' : 'ok' });
        this.stt = null;
        if (this.mic) this.o.ui.notice('🎙️ Dieser Browser hat keine Spracherkennung — nutze Chrome/Edge/Safari, wähle „OpenAI“ als Spracherkennung (⚙) oder schreib (💬).', 'warn');
      }
    }
    onSTTError(code, msg) {
      if (code === 'network') { if (navigator.onLine === false) this.onOffline(); else this.o.ui.notice('🎙️ ' + msg + ' Ich versuche es weiter …', 'warn'); }
      else if (code === 'denied' || code === 'nomic' || code === 'unsupported') this.o.ui.notice('🎙️ ' + msg + ' Du kannst schreiben (💬). Details: ⚙ → 🩺 Diagnose.', 'warn');
      else if (code === 'stalled') this.o.ui.notice('🎙️ ' + msg + ' Tipp: anderen Browser (Chrome/Edge) oder ⚙ → Spracherkennung „OpenAI“ — oder schreib (💬). Details: ⚙ → 🩺 Diagnose.', 'error', () => { this.stt.quick = 0; this.stt.start(); });
    }
    async end() {
      L('call', 'end', { metrics: this.metrics.slice(-5) });
      this.abortCurrent('end');
      clearInterval(this.turnTimer);
      window.removeEventListener('offline', this.onOffline); window.removeEventListener('online', this.onOnline);
      try { this.stt && this.stt.stop(); } catch (e) {}
      try { this.vad && this.vad.stopTimer(); } catch (e) {}
      try { this.mic && this.mic.stop(); } catch (e) {}
      try { this.avatar && await this.avatar.disconnect(); } catch (e) {}
      this.sm.go('SESSION_ENDED');
    }
    pause() {
      if (this.sm.is('PAUSED', 'SESSION_ENDED')) return;
      L('call', 'pause');
      this.abortCurrent('pause'); this.resetUtter();
      try { this.stt && this.stt.stop(); } catch (e) {}
      this.sm.go('PAUSED');
    }
    resume() {
      if (!this.sm.is('PAUSED')) return;
      L('call', 'resume');
      this.sm.go('LISTENING');
      if (this.stt && !this.muted) this.stt.start();
    }
    setMuted(m) {
      this.muted = m;
      L('mic', m ? 'mute (button)' : 'unmute (button)', { micMode: this.micMode, state: this.state });
      if (this.mic) this.mic.setMuted(m);
      if (this.stt) { if (m) this.stt.stop(); else if (!this.sm.is('PAUSED')) this.stt.start(); }
      if (m) { this.resetUtter(); if (this.sm.is('USER_SPEAKING')) this.sm.go('LISTENING'); }
    }
    setVolume(v) { this.volume = v; if (this.avatar && this.avatar.setVolume) this.avatar.setVolume(v); }

    /* ---------------- learner speech / turn-taking ---------------- */
    resetUtter() { this.utter = { finals: [], interim: '', last: 0, alts: [] }; if (this.o.ui.captionUser) this.o.ui.captionUser('', false); }
    utterText() { return (this.utter.finals.join(' ') + ' ' + this.utter.interim).replace(/\s+/g, ' ').trim(); }
    onVoiceStart(info) {
      if (this.muted) return;
      if (info.bargeIn && this.sm.is('AI_SPEAKING')) {
        // VAD barge-in only counts if the STT confirms real words soon (or there is no interim STT) — protects against echo/noise
        if (!this.stt || !this.stt.interim) this.bargeIn('vad');
        else this.bargeCandidate = performance.now();
        return;
      }
      if (this.sm.is('LISTENING')) {
        this.sm.go('USER_SPEAKING');
        if (this.stt && this.stt.begin) this.stt.begin();
      }
    }
    echoOf(text) {                                       // does the recognised text just repeat what the tutor says?
      if (!this.speaking) return false;
      const heard = words(text), said = new Set(words(this.speaking.text + ' ' + (this.speaking.nextText || '')));
      if (!heard.length) return true;
      return heard.filter(w => said.has(w)).length / heard.length >= 0.5;
    }
    onPartial(text) {
      if (this.muted || this.sm.is('PAUSED', 'SESSION_ENDED', 'RECONNECTING')) return;
      if (this.sm.is('AI_SPEAKING', 'PROCESSING')) {
        const n = words(text).length, vadRecent = this.bargeCandidate && performance.now() - this.bargeCandidate < 1500;
        if (!this.echoOf(text) && (n >= 2 || (n >= 1 && vadRecent))) { this.bargeIn('stt'); this.utter.interim = text; }
        else { if (text !== this.lastIgnored) { this.lastIgnored = text; L('turn', 'ignored while tutor talks (echo or too short)', { text }); } return; }
      }
      if (this.sm.is('LISTENING', 'INTERRUPTED')) this.sm.go('USER_SPEAKING');
      this.utter.interim = text; this.utter.last = performance.now();
      if (this.o.ui.captionUser) this.o.ui.captionUser(this.utterText(), false);
    }
    onFinal(text, conf, alts) {
      if (this.muted || !text || this.sm.is('PAUSED', 'SESSION_ENDED', 'RECONNECTING')) return;
      if (this.sm.is('AI_SPEAKING', 'PROCESSING')) {
        if (this.echoOf(text)) { L('turn', 'final ignored: echo of the tutor', { text }); return; }
        this.bargeIn('stt');
      }
      if (this.sm.is('LISTENING', 'INTERRUPTED')) this.sm.go('USER_SPEAKING');
      this.utter.finals.push(text); this.utter.interim = ''; this.utter.last = performance.now();
      if (alts) this.utter.alts.push(alts);
      this.utter.conf = conf;
      if (this.o.ui.captionUser) this.o.ui.captionUser(this.utterText(), false);
    }
    endOfTurnMs(text) {
      let ms = BASE_HANG[this.o.level()] || 950;
      if (HESITATION.test(text.trim())) ms += 1400;                  // "Ich möchte … äh" / "… und" / "… zum"
      if (words(text).length < 2) ms += 350;
      return ms;
    }
    async checkTurnEnd() {
      if (!this.sm.is('USER_SPEAKING') || this.finalizing) return;
      const now = performance.now();
      if (this.stt && !this.stt.interim) {                            // OpenAI STT: VAD decides, then transcribe
        const sil = this.vad ? this.vad.silenceMs() : Infinity;
        const soFar = this.utterText();
        if (sil < (soFar ? this.endOfTurnMs(soFar) : 700)) return;
        this.finalizing = true;
        try {
          const t = await this.stt.end(this.o.sttPrompt ? this.o.sttPrompt() : '');
          if (t) this.utter.finals.push(t);
          const all = this.utterText();
          if (this.o.ui.captionUser) this.o.ui.captionUser(all, false);
          if (all && HESITATION.test(all) && !this.utter.extended) {    // incomplete: listen a bit longer
            this.utter.extended = true; this.finalizing = false;
            if (this.vad && this.vad.speaking) { this.stt.begin(); return; }
            await new Promise(r => setTimeout(r, 1300));
            if (this.vad && this.vad.silenceMs() < 1300) { this.stt.begin(); return; }
          }
          this.finalizing = false;
          if (all) this.finalizeTurn(); else { this.resetUtter(); this.sm.go('LISTENING'); }
        } catch (e) {
          L('turn', 'OpenAI transcription error', { message: e.message });
          this.finalizing = false; this.resetUtter(); this.sm.go('LISTENING');
          this.o.ui.notice('🎙️ Spracherkennung (OpenAI) fehlgeschlagen: ' + e.message, 'warn');
        }
        return;
      }
      const text = this.utterText();
      const vadQuiet = this.vad ? this.vad.silenceMs() : Infinity, textQuiet = now - (this.utter.last || now);
      if (!text) {
        /* voice detected but no words: back to listening after 2.5 s of quiet — or after 6 s even if the VAD still
           "hears" something (steady noise must not block the call in "Du sprichst …") */
        if (vadQuiet > 2500 || now - (this.userSince || now) > 6000) { L('turn', 'no words recognised — back to listening', { vadQuiet: Math.round(Math.min(vadQuiet, 1e6)) }); this.sm.go('LISTENING'); }
        return;
      }
      const hang = this.endOfTurnMs(text);
      /* normal: both the VAD and the recogniser are quiet; safety: no new words for hang + 1.8 s even if the VAD
         still reports sound (background noise) */
      if (Math.min(vadQuiet, textQuiet) >= hang || textQuiet >= hang + 1800) {
        L('turn', 'end of turn', { text, hang, textQuiet: Math.round(textQuiet), vadQuiet: vadQuiet === Infinity ? 'n/a' : Math.round(vadQuiet), by: Math.min(vadQuiet, textQuiet) >= hang ? 'silence' : 'no new words' });
        this.finalizeTurn();
      }
    }
    finalizeTurn() {
      const text = this.utterText(), conf = this.utter.conf, alts = this.utter.alts;
      this.resetUtter();
      if (!text) { this.sm.go('LISTENING'); return; }
      this.submitTurn(text, { conf, alts, spoken: true });
    }
    /* typed text uses the same path as speech */
    sendText(text) {
      text = String(text || '').trim(); if (!text) return;
      L('turn', 'typed', { text });
      if (this.sm.is('AI_SPEAKING', 'PROCESSING')) this.bargeIn('typed');
      if (this.sm.is('PAUSED')) this.resume();
      this.resetUtter();
      this.submitTurn(text, { spoken: false });
    }
    async submitTurn(text, info) {
      const id = ++this.turnId;
      L('turn', 'learner turn', { text, spoken: info && info.spoken });
      this.pendingTurn = { text, info };
      this.turnT0 = performance.now(); this.cur = { id, t0: this.turnT0 };
      this.sm.go('PROCESSING');
      try {
        await this.o.onUserTurn(text, Object.assign({ id }, info));
        if (id === this.turnId) this.pendingTurn = null;
      } catch (e) {
        if (id !== this.turnId || (e.name === 'AbortError' && this.abortReason !== 'offline')) return;
        this.handleError(e);
        return;
      }
      if (id === this.turnId && this.sm.is('PROCESSING', 'AI_SPEAKING')) this.sm.go('LISTENING');
    }
    /* a turn the tutor starts (greeting, next guided line) — same error/retry handling as a learner turn */
    async tutorTurn(fn) {
      const id = ++this.turnId;
      this.pendingTurn = { tutor: fn };
      this.cur = { id, t0: performance.now() };
      this.sm.go('PROCESSING');
      try {
        await fn();
        if (id === this.turnId) this.pendingTurn = null;
      } catch (e) {
        if (id !== this.turnId || (e.name === 'AbortError' && this.abortReason !== 'offline')) return;
        this.handleError(e);
        return;
      }
      if (id === this.turnId && this.sm.is('PROCESSING', 'AI_SPEAKING')) this.sm.go('LISTENING');
    }
    retryTurn() {
      const p = this.pendingTurn; if (!p) return;
      this.o.ui.notice('');
      if (this.sm.is('ERROR', 'RECONNECTING')) this.sm.go('LISTENING');
      if (p.tutor) this.tutorTurn(p.tutor); else this.submitTurn(p.text, p.info);
    }
    handleError(e) {
      const offline = navigator.onLine === false;
      L('error', 'turn failed', { name: e.name, status: e.status, message: e.message, offline });
      if (offline) { this.sm.go('RECONNECTING'); this.o.ui.notice('📡 Verbindung wird wiederhergestellt …', 'reconnect', () => this.retryTurn()); return; }
      const auth = e.status === 401 || e.status === 403;
      this.sm.go('ERROR');
      this.o.ui.notice(auth ? '🔑 Der KI-Schlüssel wurde abgelehnt — bitte in AI Config & Settings prüfen.' : '⚠️ ' + (e.message || 'Fehler') + ' ', 'error', auth ? null : () => this.retryTurn());
    }

    /* ---------------- tutor speech ---------------- */
    /* Speak text (guided lessons, short feedback). Resolves {interrupted, spoken} */
    say(text, opts) {
      const sp = this.newSpeech(opts);
      String(text).split(/(?<=[.!?…])\s+/).filter(Boolean).forEach(s => sp.push(s));
      sp.close();
      return sp.done;
    }
    /* Stream an LLM reply (messages for dcStreamAI) and speak it sentence by sentence.
       Text after the line "###META" is not spoken; it is returned as meta (JSON). Retries with back-off. */
    async respond(messages, opts) {
      opts = opts || {};
      for (let attempt = 0; ; attempt++) {
        const ctrl = new AbortController(); this.llmCtrl = ctrl; this.abortReason = null;
        L('ai', attempt ? 'request (retry ' + attempt + ')' : 'request', { messages: messages.length });
        const sp = this.newSpeech(opts);
        let spokenUpTo = 0, full = '', metaAt = -1, firstTok = 0, moodSent = false;
        /* "[happy] Super, …" → mood for the face, the tag is not spoken */
        const body = txt => {
          const mt = txt.match(/^\s*\[([a-zäöü]+)\]\s*/i);
          if (mt) { if (!moodSent) { moodSent = true; if (opts.onMood) opts.onMood(mt[1].toLowerCase()); } return txt.slice(mt[0].length); }
          return /^\s*\[[a-zäöü]*$/i.test(txt) ? '' : txt;
        };
        const firstTokenTimer = setTimeout(() => ctrl.abort(new DOMException('timeout', 'TimeoutError')), 20000);
        try {
          await dcStreamAI(messages, { signal: ctrl.signal, temperature: opts.temperature, onDelta: (piece, all) => {
            if (!firstTok) { firstTok = performance.now(); clearTimeout(firstTokenTimer); this.mark('firstToken'); L('ai', 'first token'); }
            full = all;
            if (metaAt < 0) { const m = all.indexOf('###'); if (m >= 0 && /###\s*M?E?T?A?/.test(all.slice(m, m + 7))) metaAt = m; }
            const speakable = body(metaAt >= 0 ? all.slice(0, metaAt) : all);
            const r = takeSentences(speakable, spokenUpTo);
            r.sentences.forEach(x => sp.push(x)); spokenUpTo = r.next;
            if (!sp.count && spokenUpTo === 0) {                     // long first clause: start speaking at a comma
              const c = speakable.indexOf(', ', 60);
              if (c > 0) { sp.push(speakable.slice(0, c + 1).trim()); spokenUpTo = c + 2; }
            }
          } });
          clearTimeout(firstTokenTimer);
          const speakable = body(metaAt >= 0 ? full.slice(0, metaAt) : full);
          L('ai', 'reply complete', { chars: full.length, meta: metaAt >= 0 });
          const rest = speakable.slice(spokenUpTo).trim();
          if (rest) sp.push(rest);
          sp.close();
          const r = await sp.done;
          let meta = null;
          if (metaAt >= 0) { const js = full.slice(metaAt).replace(/^###\s*META\s*:?/i, ''); try { meta = JSON.parse(js.slice(js.indexOf('{'), js.lastIndexOf('}') + 1)); } catch (e) {} }
          return { text: speakable.trim(), meta, interrupted: r.interrupted, spoken: r.spoken };
        } catch (e) {
          clearTimeout(firstTokenTimer); sp.cancel();
          L('ai', 'reply stopped', { reason: this.abortReason || e.name, status: e.status, message: e.message });
          if (this.abortReason === 'offline') { const x = new Error('offline'); x.name = 'OfflineError'; throw x; }
          if (this.interruptedTurn === this.turnId || ['barge', 'pause', 'end'].includes(this.abortReason)) {
            return { text: '', meta: null, interrupted: true, spoken: sp.spokenText() };
          }
          const retryable = e.name === 'TimeoutError' || e.name === 'AbortError' || e instanceof TypeError || e.status >= 500 || e.status === 429;
          if (!retryable || attempt >= 2 || this.sm.is('SESSION_ENDED', 'PAUSED')) throw e;
          this.sm.go('RECONNECTING');
          this.o.ui.notice('📡 Verbindung wird wiederhergestellt …', 'reconnect');
          await new Promise(r => setTimeout(r, attempt ? 3000 : 1000));
          if (navigator.onLine === false) throw e;
          this.o.ui.notice('');
          this.sm.go('PROCESSING');
        }
      }
    }
    mark(name) {
      if (!this.cur || this.cur[name]) return;
      this.cur[name] = performance.now();
      if (name === 'firstAudio') {
        const m = { endToFirstToken: this.cur.firstToken ? Math.round(this.cur.firstToken - this.cur.t0) : null, endToFirstAudio: Math.round(this.cur.firstAudio - this.cur.t0) };
        L('tts', 'first audio', m);
        this.metrics.push(m); if (this.o.ui.metrics) this.o.ui.metrics(m, this.metrics);
      }
    }
    /* A speech = ordered sentences → TTS (prefetch next) → avatar. push()/close()/cancel(), done → {interrupted, spoken} */
    newSpeech(opts) {
      opts = opts || {};
      const eng = this, items = [], ctrl = new AbortController();
      let closed = false, cancelled = false, wake = null, spoken = [];
      const sp = {
        count: 0,
        push(text) { if (cancelled) return; items.push(eng.startSynth(text, ctrl.signal)); sp.count++; if (wake) { wake(); wake = null; } },
        close() { closed = true; if (wake) { wake(); wake = null; } },
        cancel() { cancelled = true; ctrl.abort(); if (wake) { wake(); wake = null; } },
        spokenText() { return spoken.join(' '); }
      };
      this.speaking = { sp, text: '', nextText: '' };
      sp.done = (async () => {
        let i = 0;
        try {
          if (this.avatar.newUtterance) this.avatar.newUtterance();
          for (;;) {
            if (cancelled) break;
            if (i >= items.length) { if (closed) break; await new Promise(r => { wake = r; }); continue; }
            const it = items[i++], k = i;
            if (items[i]) items[i].prime();                                    // prefetch the next sentence
            /* audio is queued ahead of time: caption, echo guard and "what the learner heard" follow the sentence that is
               actually audible now, not the one being synthesised */
            const audible = () => {
              if (cancelled) return;
              spoken.push(it.text);
              if (this.speaking && this.speaking.sp === sp) { this.speaking.text = it.text; this.speaking.nextText = items[k] ? items[k].text : ''; }
              if (this.o.ui.captionAI) this.o.ui.captionAI(it.text, opts);
            };
            const wait = this.avatar.player ? this.avatar.player.remaining() * 1000 : 0;
            if (wait > 30) setTimeout(audible, wait); else audible();
            await this.playItem(it, () => { if (this.sm.is('PROCESSING', 'CONNECTING', 'INTERRUPTED')) this.sm.go('AI_SPEAKING'); this.mark('firstAudio'); });
            if (cancelled) break;
          }
          if (!cancelled) await this.avatar.finish();
        } catch (e) { if (!cancelled) throw e; }
        if (this.speaking && this.speaking.sp === sp) this.speaking = null;
        return { interrupted: cancelled, spoken: spoken.join(' ') };
      })();
      this.currentSpeech = sp;
      return sp;
    }
    /* starts TTS for one sentence; chunks are buffered so playback can begin with the first chunk */
    startSynth(text, signal) {
      const eng = this, tts = this.tts;
      const it = { text, chunks: [], done: false, error: null, waiters: [], started: false,
        prime() { if (it.started || tts.native) return; it.started = true;
          (async () => {
            try {
              const sub = new AbortController(); signal.addEventListener('abort', () => sub.abort());
              const to = setTimeout(() => sub.abort(), 15000);
              for await (const ch of tts.stream(text, { signal: sub.signal, level: eng.o.level(), persona: eng.o.tutor })) {
                clearTimeout(to); it.chunks.push(ch); it.waiters.splice(0).forEach(w => w());
              }
              clearTimeout(to);
            } catch (e) { it.error = e; if (e.name !== 'AbortError') L('tts', 'voice request failed', { provider: tts.id, status: e.status, message: e.message }); }
            it.done = true; it.waiters.splice(0).forEach(w => w());
          })();
        } };
      if (!this.speaking || !this.speaking.sp || this.speaking.sp.count === 0) it.prime();   // first sentence: start now
      return it;
    }
    async playItem(it, onFirstAudio) {
      if (this.tts.native || (it.error && !it.chunks.length)) return this.playNative(it.text, onFirstAudio, !!it.error);
      it.prime();
      let n = 0;
      for (;;) {
        if (n < it.chunks.length) {
          const ch = it.chunks[n++];
          if (n === 1) { onFirstAudio(); if (this.avatar.newSegment) this.avatar.newSegment(); }
          this.avatar.speakChunk(ch.samples, ch.rate, ch.alignment);
          continue;
        }
        if (it.done) break;
        await new Promise(r => it.waiters.push(r));
      }
      if (it.error && n === 0) return this.playNative(it.text, onFirstAudio, true);
    }
    playNative(text, onFirstAudio, fallback) {
      if (fallback) L('tts', 'browser voice fallback for one sentence');
      if (fallback && !this.warnedTTS) { this.warnedTTS = true; this.o.ui.notice('🔊 KI-Stimme nicht erreichbar — Browser-Stimme übernimmt.', 'warn'); }
      if (this.avatar.id === 'simli') { this.avatarFailed(new Error('no audio')); }
      return new Promise(res => {
        const av = this.avatar;
        this.nativeHandle = this.browserTTS.speak(text, { level: this.o.level(), persona: this.o.tutor,
          onStart: () => { onFirstAudio(); if (av.speakNative) av.speakNative(text, DCCall.pace(this.o.level()).rate); },
          onBoundary: i => av.nativeBoundary && av.nativeBoundary(i),
          onEnd: () => { av.nativeEnd && av.nativeEnd(); res(); },
          onError: () => { av.nativeEnd && av.nativeEnd(); res(); } });
      });
    }
    abortCurrent(reason) {
      this.abortReason = reason || 'abort';
      if (this.llmCtrl) try { this.llmCtrl.abort(); } catch (e) {}
      if (this.currentSpeech) this.currentSpeech.cancel();
      if (this.nativeHandle) this.nativeHandle.cancel();
      if (this.avatar) this.avatar.stop();
    }
    /* the learner speaks while the tutor talks/thinks */
    bargeIn(reason) {
      if (!this.sm.is('AI_SPEAKING', 'PROCESSING')) return;
      const t = performance.now();
      this.interruptedTurn = this.turnId;
      const partial = this.speaking ? this.speaking.text : '';
      this.abortCurrent('barge');
      if (this.avatar.interrupt) this.avatar.interrupt();
      this.sm.go('INTERRUPTED', { reason, partial });
      this.bargeCandidate = 0;
      this.lastInterruption = { reason, partial, stopMs: Math.round(performance.now() - t) + 50 };
      L('turn', 'barge-in: learner interrupted the tutor', { by: reason, during: partial });
      if (this.o.ui.interrupted) this.o.ui.interrupted(this.lastInterruption);
      this.sm.go('USER_SPEAKING');
      if (this.stt && this.stt.begin) this.stt.begin();
    }
  }
  DCCall.ConversationEngine = ConversationEngine;
  DCCall.HESITATION = HESITATION;
})();
