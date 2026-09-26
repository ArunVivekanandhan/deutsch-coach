(() => {
  const PRESET = window.__PRESET = JSON.parse(%PRESET%);
  if (!sessionStorage.getItem('__preset_done')) {
    Object.entries(PRESET.ls).forEach(([k, v]) => localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)));
    sessionStorage.setItem('__preset_done', '1');
  }
  /* ---- fake microphone: a sawtooth whose gain the test controls ---- */
  window.__setMic = () => {};
  const md = navigator.mediaDevices || {};
  window.__gumCalls = 0; window.__micBase = 0;
  md.getUserMedia = async c => {
    window.__gumCalls++;
    if (PRESET.micDenied) throw new DOMException('Permission denied', 'NotAllowedError');
    const ctx = new AudioContext(); const osc = ctx.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 190;
    const g = ctx.createGain(); g.gain.value = 0; const dst = ctx.createMediaStreamDestination();
    osc.connect(g); g.connect(dst); osc.start(); ctx.resume();
    window.__setMic = v => { g.gain.setTargetAtTime(v, ctx.currentTime, 0.01); };
    window.__setMic(window.__micBase);
    return dst.stream;
  };
  /* ---- fake Web Speech recogniser ---- */
  /* __srQuickEnd > 0: the recogniser ends right after start without hearing anything (Android mic conflict) */
  window.__srQuickEnd = 0; window.__srStarts = 0;
  class FakeSR {
    constructor() { window.__sr = this; this.running = false; }
    start() {
      this.running = true; window.__sr = this; window.__srStarts++;
      if (window.__srQuickEnd > 0) { window.__srQuickEnd--; setTimeout(() => { if (!this.running) return; this.running = false; this.onend && this.onend(); }, 60); }
    }
    stop() { this.running = false; setTimeout(() => this.onend && this.onend(), 0); }
    abort() { this.stop(); }
  }
  window.SpeechRecognition = window.webkitSpeechRecognition = FakeSR;
  window.__emit = (text, final) => {
    const r = window.__sr; if (!r || !r.running || !r.onresult) return false;
    const res = [{ transcript: text, confidence: 0.91 }]; res.isFinal = !!final;
    r.onresult({ resultIndex: 0, results: [res] }); return true;
  };
  /* learner speaks: mic on, words arrive as interim results, final at the end, mic off */
  window.__speak = async (text, o) => {
    o = o || {}; const ws = text.split(' ');
    window.__setMic(o.gain || 0.35);
    await new Promise(r => setTimeout(r, o.lead || 200));
    for (let i = 1; i <= ws.length; i++) { window.__emit(ws.slice(0, i).join(' '), false); await new Promise(r => setTimeout(r, o.wordMs || 180)); }
    if (o.final !== false) window.__emit(text, true);
    await new Promise(r => setTimeout(r, 120));
    window.__setMic(window.__micBase); window.__speechEnd = performance.now();
  };
  /* ---- state history ---- */
  window.__states = [];
  const hook = setInterval(() => {
    if (window.ENG_HOOKED !== window.__eng && typeof ENG !== 'undefined' && ENG && ENG.sm) {
      window.__eng = ENG; window.ENG_HOOKED = ENG;
      ENG.sm.on((to, from) => window.__states.push({ to, from, t: performance.now() }));
    }
  }, 5);
  /* ---- network mocks (LLM SSE, OpenAI TTS PCM, ElevenLabs) ---- */
  const realFetch = window.fetch.bind(window);
  window.__reqs = []; window.__llmDelay = 30; window.__llmFail = 0; window.__llmStatus = 0; window.__ttsFail = false;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  window.__reply = msgs => {
    const last = msgs[msgs.length - 1].content;
    const meta = o => '\n###META\n' + JSON.stringify(Object.assign({ en: '', correction: null, vocab: [], goals_done: [], suggestions: ['Ich möchte einen Kaffee.', 'Ein Brötchen, bitte.', 'Was kostet das?'], mission_complete: false }, o));
    if (/Der Anruf beginnt/.test(last)) return '[happy] Hallo und herzlich willkommen im Café Sonne! Was möchtest du trinken?' + meta({ en: 'Hello and welcome to Café Sonne! What would you like to drink?' });
    if (/^\[unterbricht\]/.test(last)) return '[surprised] Oh, natürlich! Sag mal, was brauchst du?' + meta({ en: 'Oh, of course! Tell me, what do you need?' });
    if (/erzähl/i.test(last)) return '[happy] Gern! Unser Café gibt es schon seit zwanzig Jahren in dieser Straße. Jeden Morgen backen wir frische Brötchen und Kuchen. Am Wochenende kommen viele Familien zum Frühstück. Und im Sommer sitzen alle draußen in der Sonne.' + meta({ en: 'Gladly! ...' });
    if (/ein Kaffee/.test(last)) return '[happy] Gern, einen Kaffee. Möchtest du auch etwas essen?' + meta({ en: 'Sure, a coffee. Would you also like something to eat?', correction: { wrong: 'ein Kaffee', right: 'Ich möchte einen Kaffee.', why: 'Kaffee is masculine: accusative "einen".', why_ta: 'ஆண்பால் சொல்: "einen".' }, vocab: [{ de: 'der Kuchen', en: 'cake' }], goals_done: ['g0'] });
    if (/Brotchen|Brötchen/.test(last)) return '[happy] Sehr gern, ein Brötchen. Sonst noch etwas?' + meta({ en: 'Sure, a bread roll. Anything else?', goals_done: ['g1'] });
    return '[neutral] Alles klar. Möchtest du noch etwas?' + meta({ en: 'Alright. Would you like anything else?' });
  };
  window.fetch = async (input, init) => {
    init = init || {};
    const url = typeof input === 'string' ? input : input.url;
    if (/api\.simli\.ai/.test(url)) { window.__reqs.push({ kind: 'simli', url }); return new Response('{"detail":"Invalid API key"}', { status: 401 }); }
    if (!/chat\/completions|audio\/speech|audio\/transcriptions|elevenlabs\.io/.test(url)) return realFetch(input, init);
    const t = performance.now(), sig = init.signal;
    if (navigator.onLine === false) throw new TypeError('Failed to fetch');
    if (sig && sig.aborted) throw new DOMException('aborted', 'AbortError');
    const enc = new TextEncoder();
    if (/chat\/completions/.test(url)) {
      const j = JSON.parse(init.body); window.__reqs.push({ kind: 'llm', t, body: j, url });
      if (window.__llmStatus) { const s = window.__llmStatus; window.__llmStatus = 0; return new Response('{"error":{"message":"invalid key"}}', { status: s }); }
      if (window.__llmFail > 0) { window.__llmFail--; await sleep(100); return new Response('{"error":"overloaded"}', { status: 503 }); }
      const text = window.__reply(j.messages);
      if (!j.stream) return new Response(JSON.stringify({ choices: [{ message: { content: text } }] }), { headers: { 'Content-Type': 'application/json' } });
      const toks = text.match(/\S+\s*/g);
      const stream = new ReadableStream({ async start(ctl) {
        const onAbort = () => { try { ctl.error(new DOMException('aborted', 'AbortError')); } catch (e) {} };
        if (sig) sig.addEventListener('abort', onAbort);
        await sleep(150);                                    // "time to first token"
        for (const tk of toks) {
          if (sig && sig.aborted) return;
          try { ctl.enqueue(enc.encode('data: ' + JSON.stringify({ choices: [{ delta: { content: tk } }] }) + '\n\n')); } catch (e) { return; }
          window.__lastTok = performance.now();
          await sleep(window.__llmDelay);
        }
        try { ctl.enqueue(enc.encode('data: [DONE]\n\n')); ctl.close(); } catch (e) {}
      } });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }
    if (/audio\/speech/.test(url)) {
      const j = JSON.parse(init.body); window.__reqs.push({ kind: 'tts', t, body: j });
      if (window.__ttsFail) { await sleep(80); return new Response('fail', { status: 500 }); }
      const n = Math.round(24000 * Math.max(0.6, j.input.length * 0.05));
      const pcm = new Int16Array(n);
      for (let i = 0; i < n; i++) { const env = 0.55 + 0.45 * Math.sin(2 * Math.PI * 3.5 * i / 24000); pcm[i] = Math.round(9000 * env * Math.sin(2 * Math.PI * 170 * i / 24000)); }
      const bytes = new Uint8Array(pcm.buffer); const parts = 5, step = Math.ceil(bytes.length / parts / 2) * 2 + 1;   // odd chunk size: tests the byte carry
      const stream = new ReadableStream({ async start(ctl) {
        await sleep(120);
        for (let o = 0; o < bytes.length; o += step) { if (sig && sig.aborted) { try { ctl.error(new DOMException('aborted', 'AbortError')); } catch (e) {} return; } ctl.enqueue(bytes.slice(o, o + step)); await sleep(40); }
        ctl.close();
      } });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'application/octet-stream' } });
    }
    if (/elevenlabs\.io/.test(url)) {
      const j = JSON.parse(init.body); window.__reqs.push({ kind: 'eleven', t, body: j, url });
      const chars = [...j.text], per = 0.065, n = Math.round(16000 * chars.length * per);
      const pcm = new Int16Array(n);
      for (let i = 0; i < n; i++) { const env = 0.55 + 0.45 * Math.sin(2 * Math.PI * 3.5 * i / 16000); pcm[i] = Math.round(9000 * env * Math.sin(2 * Math.PI * 170 * i / 16000)); }
      const bytes = new Uint8Array(pcm.buffer), parts = 3, cs = Math.ceil(chars.length / parts);
      const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s); };
      const objs = [];
      for (let k = 0; k < parts; k++) {
        const c0 = k * cs, c1 = Math.min(chars.length, c0 + cs); if (c0 >= c1) break;
        const b0 = Math.round(c0 * per * 16000) * 2, b1 = k === parts - 1 ? bytes.length : Math.round(c1 * per * 16000) * 2;
        objs.push(JSON.stringify({ audio_base64: b64(bytes.slice(b0, b1)), alignment: { characters: chars.slice(c0, c1),
          character_start_times_seconds: chars.slice(c0, c1).map((_, i) => (c0 + i) * per), character_end_times_seconds: chars.slice(c0, c1).map((_, i) => (c0 + i + 1) * per) } }));
      }
      const stream = new ReadableStream({ async start(ctl) { await sleep(100); for (const o of objs) { ctl.enqueue(enc.encode(o + '\n')); await sleep(50); } ctl.close(); } });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (/audio\/transcriptions/.test(url)) {
      const f = init.body.get('file'); window.__reqs.push({ kind: 'stt', t, size: f.size, model: init.body.get('model'), lang: init.body.get('language'), prompt: init.body.get('prompt') });
      await sleep(200);
      return new Response(JSON.stringify({ text: window.__sttText || '' }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('not mocked', { status: 500 });
  };
})();
