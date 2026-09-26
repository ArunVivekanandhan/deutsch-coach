/* Text-to-speech providers for the KI-Sprechpartner (Task 48). Keys stay in this browser (localStorage) and go only
   to the provider. Every streaming provider yields chunks { samples: Float32Array, rate, alignment? } as they arrive,
   so the tutor starts talking before the whole sentence is synthesised.
     openai      gpt-4o-mini-tts, raw PCM 24 kHz streamed; "instructions" set persona + pace (natural German voice)
     elevenlabs  eleven_flash_v2_5 via /stream/with-timestamps, PCM 16 kHz + per-character timing (→ exact visemes)
     browser     speechSynthesis — fallback, no audio access (lip-sync only approximate) */
(function () {
  const DCCall = window.DCCall = window.DCCall || {};
  const LS = k => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } };
  DCCall.keys = {
    openai: () => LS('dc_call_openai_key') || LS('de_ai_key_openai'),
    elevenlabs: () => LS('dc_call_eleven_key'),
    simli: () => LS('dc_call_simli_key')
  };
  /* pace per level: slower + clearer for A1, native speed for B2 — never artificially slow for everyone */
  const PACE = {
    A1: { rate: 0.86, text: 'Speak slowly and very clearly, with short natural pauses between phrases, like a patient teacher with a beginner.' },
    A2: { rate: 0.94, text: 'Speak calmly and clearly, a little slower than normal conversation.' },
    B1: { rate: 1.0, text: 'Speak at a natural everyday conversational pace.' },
    B2: { rate: 1.06, text: 'Speak at natural native conversational speed.' }
  };
  DCCall.pace = lv => PACE[lv] || PACE.A2;

  async function httpError(res) {
    let t = ''; try { t = await res.text(); } catch (e) {}
    const e = new Error(`HTTP ${res.status}${t ? ': ' + t.slice(0, 140) : ''}`); e.status = res.status; return e;
  }

  class OpenAITTS {
    constructor() { this.id = 'openai'; this.label = 'OpenAI (natürliche Stimme)'; this.rate = 24000; }
    available() { return !!DCCall.keys.openai(); }
    async *stream(text, o) {
      const res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST', signal: o.signal,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + DCCall.keys.openai() },
        body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice: o.persona.openaiVoice || 'coral', input: text, response_format: 'pcm',
          instructions: `${o.persona.voiceStyle} The text is German; use standard German pronunciation. ${DCCall.pace(o.level).text} Sound conversational and warm, not like an audiobook.` })
      });
      if (!res.ok) throw await httpError(res);
      const reader = res.body.getReader(); let carry = null;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const r = DCCall.pcm16BytesToFloat(value, carry); carry = r.carry;
        if (r.samples.length) yield { samples: r.samples, rate: this.rate };
      }
    }
  }

  /* incremental parser for a stream of JSON objects (NDJSON or concatenated) */
  function jsonObjectStream() {
    let buf = '', depth = 0, inStr = false, esc = false, start = -1, pos = 0;
    return function push(text) {
      buf += text; const out = [];
      for (; pos < buf.length; pos++) {
        const c = buf[pos];
        if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
        if (c === '"') inStr = true;
        else if (c === '{') { if (depth === 0) start = pos; depth++; }
        else if (c === '}') { depth--; if (depth === 0 && start >= 0) { try { out.push(JSON.parse(buf.slice(start, pos + 1))); } catch (e) {} start = -1; } }
      }
      if (depth === 0) { buf = ''; pos = 0; }
      return out;
    };
  }
  class ElevenLabsTTS {
    constructor() { this.id = 'elevenlabs'; this.label = 'ElevenLabs (natürliche Stimme + Lippen-Timing)'; this.rate = 16000; }
    available() { return !!DCCall.keys.elevenlabs(); }
    async *stream(text, o) {
      const voice = LS('dc_call_eleven_voice_' + o.persona.id) || LS('dc_call_eleven_voice') || o.persona.elevenVoice;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}/stream/with-timestamps?output_format=pcm_16000`, {
        method: 'POST', signal: o.signal,
        headers: { 'Content-Type': 'application/json', 'xi-api-key': DCCall.keys.elevenlabs() },
        body: JSON.stringify({ text, model_id: 'eleven_flash_v2_5', language_code: 'de',
          voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true, speed: Math.max(0.7, Math.min(1.2, DCCall.pace(o.level).rate)) } })
      });
      if (!res.ok) throw await httpError(res);
      const reader = res.body.getReader(), dec = new TextDecoder(), parse = jsonObjectStream();
      let carry = null;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const obj of parse(dec.decode(value, { stream: true }))) {
          if (!obj.audio_base64) continue;
          const bin = atob(obj.audio_base64), bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          const r = DCCall.pcm16BytesToFloat(bytes, carry); carry = r.carry;
          const a = obj.alignment;
          yield { samples: r.samples, rate: this.rate,
            alignment: a && a.characters ? { chars: a.characters, starts: a.character_start_times_seconds, ends: a.character_end_times_seconds } : null };
        }
      }
    }
  }

  /* Browser voice: prefers the neural "Natural/Online" German voices of Edge, then Google Deutsch, then any German voice. */
  class BrowserTTS {
    constructor() { this.id = 'browser'; this.label = 'Browser-Stimme'; this.native = true; this.voice = null; this.pick(); }
    available() { return 'speechSynthesis' in window; }
    pick(gender) {
      try {
        const vs = speechSynthesis.getVoices().filter(v => /^de(-|_|$)/i.test(v.lang));
        const score = v => (/natural|neural|online/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 2 : 0) + (/de-DE/i.test(v.lang) ? 1 : 0)
          + (gender && new RegExp(gender === 'm' ? 'conrad|killian|florian|stefan|male|mann' : 'katja|amala|seraphina|anna|petra|female|frau', 'i').test(v.name) ? 3 : 0);
        this.voice = vs.sort((a, b) => score(b) - score(a))[0] || null;
      } catch (e) { this.voice = null; }
      return this.voice;
    }
    isNatural() { return !!(this.voice && /natural|neural|online/i.test(this.voice.name)); }
    speak(text, o) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE'; const v = this.pick(o.persona.gender); if (v) u.voice = v;
      u.rate = DCCall.pace(o.level).rate * (o.rateFactor || 1);
      let done = false; const fin = err => { if (done) return; done = true; clearTimeout(guard); err ? o.onError && o.onError(err) : o.onEnd && o.onEnd(); };
      u.onstart = () => o.onStart && o.onStart();
      u.onboundary = e => o.onBoundary && o.onBoundary(e.charIndex, e.charLength || 0);
      u.onend = () => fin(); u.onerror = e => fin(e.error === 'interrupted' || e.error === 'canceled' ? null : new Error(e.error || 'tts'));
      const guard = setTimeout(() => fin(), 4000 + text.length * 140 / u.rate);    // some browsers never fire onend
      try { speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { fin(e); }
      return { cancel: () => { done = true; clearTimeout(guard); try { speechSynthesis.cancel(); } catch (e) {} } };
    }
  }
  if ('speechSynthesis' in window) try { speechSynthesis.onvoiceschanged = () => {}; speechSynthesis.getVoices(); } catch (e) {}

  DCCall.TTS = { openai: OpenAITTS, elevenlabs: ElevenLabsTTS, browser: BrowserTTS };
  DCCall.jsonObjectStream = jsonObjectStream;
})();
