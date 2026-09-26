/* Diagnostic log of the KI-Sprechpartner video call (Task 49).
   A ring buffer of timestamped events (call state, microphone, voice detection, speech recognition, turn decisions,
   AI/voice requests, notices) so a problem like "the tutor does not hear me" can be traced afterwards.
   - never contains API keys (only whitelisted settings are logged; strings that look like keys are masked)
   - the last session is kept in localStorage (dc_call_log_last) and can be viewed, copied or downloaded in ⚙ → 🩺
   - DCCall.log.echo = true (or localStorage dc_call_debug = 1) also prints every event to the console */
(function () {
  const DCCall = window.DCCall = window.DCCall || {};
  const MAX = 900, KEY = 'dc_call_log_last', TEST_KEY = 'dc_call_log_test';
  let buf = [], t0 = performance.now(), session = null, saveTimer = null, key = KEY;
  const listeners = new Set();
  const mask = s => String(s).replace(/\b(sk-[A-Za-z0-9_-]{6})[A-Za-z0-9_-]+/g, '$1…').replace(/\b([A-Za-z0-9_-]{4})[A-Za-z0-9_-]{28,}\b/g, '$1…');
  function clean(v, depth) {
    if (v == null || typeof v === 'number' || typeof v === 'boolean') return v;
    if (typeof v === 'string') return mask(v.length > 240 ? v.slice(0, 240) + '…' : v);
    if (v instanceof Error) return mask(v.name + ': ' + v.message);
    if ((depth || 0) > 2) return '…';
    if (Array.isArray(v)) return v.slice(0, 12).map(x => clean(x, (depth || 0) + 1));
    if (typeof v === 'object') { const o = {}; Object.keys(v).slice(0, 20).forEach(k => { o[k] = clean(v[k], (depth || 0) + 1); }); return o; }
    return String(v);
  }
  let echo = false;
  try { echo = localStorage.getItem('dc_call_debug') === '1'; } catch (e) {}

  function log(cat, msg, data) {
    const e = { t: Math.round(performance.now() - t0), c: cat, m: mask(msg) };
    if (data !== undefined) e.d = clean(data);
    buf.push(e); if (buf.length > MAX) buf.splice(0, buf.length - MAX);
    listeners.forEach(f => { try { f(e); } catch (x) {} });
    if (log.echo) console.debug('[call]', cat, msg, data === undefined ? '' : data);
    if (session && !saveTimer) saveTimer = setTimeout(() => { saveTimer = null; log.save(); }, 2500);
  }
  log.echo = echo;
  log.on = f => { listeners.add(f); return () => listeners.delete(f); };
  log.entries = () => buf.slice();
  /* kind 'call' (default) or 'test' (microphone test) — kept separately so a test never overwrites the call log */
  log.begin = (info, kind) => {
    if (session) log.save();
    buf = []; t0 = performance.now(); key = kind === 'test' ? TEST_KEY : KEY;
    session = { started: new Date().toISOString(), info: clean(info) };
    log('call', 'session start', info);
    env().then(e => { session.env = e; log('env', 'environment', e); });
  };
  log.end = () => { log('call', 'session end'); log.save(); session = null; };
  log.save = () => {
    if (!session) return;
    try { localStorage.setItem(key, JSON.stringify({ session, entries: buf })); } catch (e) {}
  };
  log.last = kind => { try { return JSON.parse(localStorage.getItem(kind === 'test' ? TEST_KEY : KEY)); } catch (e) { return null; } };
  log.current = () => session ? { session, entries: buf.slice() } : null;
  /* plain-text report (for copy / download / sending to support) */
  const one = (rec, title) => {
    const s = rec.session, pad = n => (n / 1000).toFixed(2).padStart(8);
    const head = [`=== ${title} · ${s.started}`, 'Session: ' + JSON.stringify(s.info || {}), 'Umgebung: ' + JSON.stringify(s.env || {}), ''];
    return head.concat(rec.entries.map(e => `${pad(e.t)}s  ${e.c.padEnd(6)} ${e.m}${e.d !== undefined ? '  ' + JSON.stringify(e.d) : ''}`)).join('\n');
  };
  /* full report: the running (or last) call + the last microphone test */
  log.text = () => {
    const cur = log.current(), call = cur && key === KEY ? cur : log.last(), test = cur && key === TEST_KEY ? cur : log.last('test');
    const parts = [];
    if (call) parts.push(one(call, 'KI-Sprechpartner Anruf-Protokoll'));
    if (test) parts.push(one(test, 'Mikrofontest'));
    return parts.length ? parts.join('\n\n') : 'Kein Protokoll vorhanden — starte einen Anruf oder den Mikrofontest.';
  };
  log.download = () => {
    const blob = new Blob([log.text()], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'ki-sprechpartner-protokoll-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.txt';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  /* browser / device facts that matter for microphone + speech problems */
  async function env() {
    const e = {
      ua: navigator.userAgent, lang: navigator.language, online: navigator.onLine, secure: window.isSecureContext,
      android: /Android/i.test(navigator.userAgent), ios: /iPhone|iPad|iPod/i.test(navigator.userAgent),
      speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition), speechSynthesis: 'speechSynthesis' in window,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia), audioWorklet: !!window.AudioWorkletNode
    };
    try { e.micPermission = (await navigator.permissions.query({ name: 'microphone' })).state; } catch (x) { e.micPermission = 'unbekannt'; }
    try { const ds = await navigator.mediaDevices.enumerateDevices(); e.audioInputs = ds.filter(d => d.kind === 'audioinput').length; e.audioOutputs = ds.filter(d => d.kind === 'audiooutput').length; } catch (x) {}
    try { e.germanVoices = speechSynthesis.getVoices().filter(v => /^de/i.test(v.lang)).map(v => v.name).slice(0, 8); } catch (x) {}
    try { const c = DCCall.audioContext && DCCall.audioContext(); if (c) { e.audioContext = c.state; e.sampleRate = c.sampleRate; } } catch (x) {}
    return e;
  }
  log.env = env;
  window.addEventListener('pagehide', () => log.save());
  DCCall.log = log;
})();
