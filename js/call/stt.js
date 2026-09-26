/* Speech-to-text providers for the KI-Sprechpartner (Task 48). Same interface:
     start() · stop() · onPartial(text) · onFinal(text, confidence) · onError(code, message) · interim (bool)
   browser  Web Speech API (Chrome/Edge/Safari), continuous with interim results, restarts itself (Chrome ends
            sessions after ~60 s). Streaming, free; Chrome sends the audio to Google's recogniser.
   openai   gpt-4o-mini-transcribe per utterance: our VAD cuts the utterance (incl. 0.4 s pre-roll), the WAV is sent
            with the lesson vocabulary as prompt. Works in every browser with a microphone (also Firefox); no interim text. */
(function () {
  const DCCall = window.DCCall = window.DCCall || {};
  const SR = () => window.SpeechRecognition || window.webkitSpeechRecognition;

  class BrowserSTT {
    constructor() { this.id = 'browser'; this.interim = true; this.active = false; this.restarts = []; }
    static supported() { return !!SR(); }
    start() {
      if (this.active) return; this.active = true; this.open();
    }
    open() {
      const R = SR(); if (!R) { this.onError && this.onError('unsupported', 'Spracherkennung wird von diesem Browser nicht unterstützt.'); return; }
      const rec = this.rec = new R();
      rec.lang = 'de-DE'; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 3;
      rec.onresult = ev => {
        let interim = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const r = ev.results[i];
          if (r.isFinal) { const best = r[0]; this.onFinal && this.onFinal(best.transcript.trim(), best.confidence, [...r].map(a => a.transcript)); }
          else interim += r[0].transcript;
        }
        if (interim.trim() && this.onPartial) this.onPartial(interim.trim());
      };
      rec.onerror = ev => {
        const code = ev.error;
        if (code === 'no-speech' || code === 'aborted') return;
        if (code === 'not-allowed' || code === 'service-not-allowed') { this.active = false; this.onError && this.onError('denied', 'Mikrofon/Spracherkennung nicht erlaubt.'); }
        else if (code === 'network') this.onError && this.onError('network', 'Spracherkennung: keine Verbindung.');
        else if (code === 'audio-capture') { this.active = false; this.onError && this.onError('nomic', 'Kein Mikrofon gefunden.'); }
        else this.onError && this.onError(code, 'Spracherkennung: ' + code);
      };
      rec.onend = () => {
        if (!this.active) return;
        const now = Date.now(); this.restarts = this.restarts.filter(t => now - t < 10000); this.restarts.push(now);
        const wait = this.restarts.length > 4 ? 1500 : 120;                // don't spin if the service keeps failing
        setTimeout(() => { if (this.active) this.open(); }, wait);
      };
      try { rec.start(); } catch (e) { /* already started */ }
    }
    stop() { this.active = false; try { this.rec && this.rec.abort(); } catch (e) {} }
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
      if (!res.ok) { const e = new Error('Transkription: HTTP ' + res.status); e.status = res.status; throw e; }
      const j = await res.json();
      return String(j.text || '').trim();
    }
  }

  DCCall.STT = { browser: BrowserSTT, openai: OpenAISTT };
})();
