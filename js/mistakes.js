/* Meine Fehler (Task 63): ONE mistake notebook for all practice pages.
   A page calls DCMistakes.add({...}) when an answer is wrong; Meine_Fehler.html brings every mistake back with spaced
   review (box 0 → 1 → 2 → 3 → 4 → learnt: again after 0 / 1 / 3 / 7 / 14 days); a wrong review puts it back to box 0.
   item: { id, src, href, kind: 'type' | 'choice', q (question / English sentence), hint, answer, alts[], options[],
           given (the learner's wrong answer), why (rule / explanation), box, due (ms), wrong (times), added, done }
   Stored only in this browser (localStorage dc_mistakes). */
(function () {
  const KEY = 'dc_mistakes', MAX = 500, DAYS = [0, 1, 3, 7, 14], DAY = 864e5;
  const SRC = { text: '📝 Text-Trainer', satzbau: '🧱 Satzbau', grammar: '📘 Grammatik', zeitreise: '🕰️ Zeitreise',
                wz: '👯 Wort-Zwillinge', crash: '⚡ Crashkurs', bild: '🎬 Bild-Quiz', words: '🃏 Wörter', hoeren: '🎧 Diktat', ki: '🤖 KI-Übung' };
  const load = () => { try { const a = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const save = a => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* storage full / blocked */ } };
  const strip = s => String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  function add(m) {
    const q = strip(m.q), answer = strip(m.answer);
    if (!q || !answer) return null;
    const a = load(), id = (m.src || 'x') + '|' + hash(q + '|' + answer), now = Date.now();
    let it = a.find(x => x.id === id);
    if (it) { it.box = 0; it.due = now; it.wrong = (it.wrong || 1) + 1; it.done = false; it.given = strip(m.given) || it.given; }
    else {
      it = { id, src: m.src || '', href: m.href || '', kind: m.kind === 'choice' && (m.options || []).length > 1 ? 'choice' : 'type',
             q, hint: strip(m.hint), answer, alts: (m.alts || []).map(strip).filter(Boolean), options: (m.options || []).map(strip),
             given: strip(m.given), why: strip(m.why), box: 0, due: now, wrong: 1, added: now, done: false };
      a.push(it);
    }
    // keep the notebook small: drop the oldest learnt items first
    while (a.length > MAX) { const k = a.findIndex(x => x.done); a.splice(k >= 0 ? k : 0, 1); }
    save(a);
    if (!m.silent) nudge(it);
    return it;
  }
  function grade(id, ok) {
    const a = load(), it = a.find(x => x.id === id); if (!it) return null;
    if (ok) { it.box = (it.box || 0) + 1; if (it.box >= DAYS.length) { it.done = true; it.due = 0; } else it.due = Date.now() + DAYS[it.box] * DAY; }
    else { it.box = 0; it.due = Date.now(); it.wrong = (it.wrong || 0) + 1; }
    it.last = Date.now(); save(a); return it;
  }
  const fold = w => w.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  const toks = s => (String(s).match(/[A-Za-zÄÖÜäöüß0-9-]+/g) || []);
  /* typed answer: right when the words (umlaut-folded, case-insensitive, punctuation ignored) equal the answer or an
     alternative; small spelling notes (capitals, ä/ae) are shown but still count as right */
  function check(given, it) {
    const g = toks(given), gf = g.map(fold).join(' ');
    const refs = [it.answer, ...(it.alts || [])];
    const hit = refs.find(r => toks(r).map(fold).join(' ') === gf);
    if (hit) {
      const exact = toks(hit).join(' ') === g.join(' ');
      return { ok: true, note: exact ? '' : 'Achte auf Groß-/Kleinschreibung und ä/ö/ü/ß: ' + hit };
    }
    return { ok: false, note: '' };
  }
  /* ---------- right after a mistake (Task 69): a small panel "Jetzt üben?" and a quick practice on the same page ----------
     dc_mf_mode: 'ask' (default: panel with 🔁 Jetzt üben / Später) · 'now' (practice opens by itself) · 'off' (only saved) */
  const MODE_KEY = 'dc_mf_mode';
  const mode = () => { try { return localStorage.getItem(MODE_KEY) || 'ask'; } catch (e) { return 'ask'; } };
  const escH = x => String(x == null ? '' : x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let PENDING = [], timerNow = null, P = null;
  function css() {
    if (document.getElementById('dcMfCss')) return;
    const st = document.createElement('style'); st.id = 'dcMfCss';
    st.textContent = `
#dcMfSheet{position:fixed;left:50%;bottom:14px;transform:translate(-50%,140%);width:min(560px,calc(100% - 24px));z-index:3000;background:var(--color-surface,#fff);color:var(--color-ink,#111);border:2px solid #f59e0b;border-radius:16px;box-shadow:0 10px 30px rgb(0 0 0/.25);padding:12px 14px;transition:transform .35s cubic-bezier(.2,.9,.3,1.2);font-size:14px;line-height:1.45}
#dcMfSheet.on{transform:translate(-50%,0)}
#dcMfSheet .t{font-weight:800;font-size:15px}#dcMfSheet .a{margin:4px 0}#dcMfSheet .w{color:#b45309;font-size:13px;max-height:3.9em;overflow:hidden}
#dcMfSheet .r,#dcMfBox .r{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.dcmf-b{font:inherit;font-size:14px;padding:7px 13px;border-radius:10px;cursor:pointer;border:1px solid var(--color-border,#ccc);background:var(--color-surface,#fff);color:var(--color-ink,#111)}
.dcmf-b.p{background:var(--color-primary,#2563eb);border-color:var(--color-primary,#2563eb);color:#fff;font-weight:700}
#dcMfSheet .set{display:none;margin-top:8px;font-size:13px;gap:10px;flex-wrap:wrap}#dcMfSheet .set.on{display:flex}#dcMfSheet .set label{display:inline-flex;gap:4px;align-items:center;cursor:pointer}
#dcMfOv{position:fixed;inset:0;z-index:3100;background:rgb(15 23 42/.55);display:flex;align-items:center;justify-content:center;padding:12px}
#dcMfBox{background:var(--color-surface,#fff);color:var(--color-ink,#111);border-radius:16px;padding:16px;width:min(560px,100%);max-height:92vh;overflow:auto;box-shadow:0 20px 50px rgb(0 0 0/.35);display:flex;flex-direction:column;gap:10px}
#dcMfBox .q{font-size:19px;font-weight:800}
.dcmf-lv{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.dcmf-chip{font:inherit;font-size:13px;padding:5px 11px;border-radius:999px;cursor:pointer;border:1.5px solid var(--color-border,#ccc);background:var(--color-surface,#fff);color:var(--color-ink,#111)}
.dcmf-chip.on{background:var(--color-primary,#2563eb);border-color:var(--color-primary,#2563eb);color:#fff}.dcmf-lvh{font-size:12.5px;color:var(--color-ink-soft,#666)}
.dcmf-tiles{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.dcmf-tile{font:inherit;font-size:16px;padding:7px 11px;border-radius:9px;cursor:pointer;border:1.5px solid var(--color-border,#ccc);background:var(--color-bg,#f8fafc);color:var(--color-ink,#111)}
.dcmf-tile:disabled{opacity:.3;cursor:default}.dcmf-pat{font-family:ui-monospace,monospace;font-size:14.5px;letter-spacing:.5px;padding:8px 10px;border-radius:9px;background:color-mix(in srgb,var(--color-primary,#2563eb) 10%,transparent);overflow-wrap:anywhere}
textarea.dcmf-in{font:inherit;font-size:17px;width:100%;min-height:60px;padding:10px;border-radius:10px;border:1.5px solid var(--color-border,#ccc);background:var(--color-bg,#f8fafc);color:inherit;box-sizing:border-box}#dcMfBox .h{font-size:13px;color:var(--color-ink-soft,#555)}
#dcMfBox textarea{font:inherit;font-size:17px;width:100%;min-height:64px;padding:10px;border-radius:10px;border:1.5px solid var(--color-border,#ccc);background:var(--color-bg,#f8fafc);color:inherit;box-sizing:border-box}
#dcMfBox .o{display:block;width:100%;text-align:left;font:inherit;font-size:16px;padding:10px 12px;margin:5px 0;border-radius:10px;border:1.5px solid var(--color-border,#ccc);background:var(--color-bg,#f8fafc);color:inherit;cursor:pointer}
#dcMfBox .o.ok,#dcMfBox .res.ok{border-color:#15803d;background:color-mix(in srgb,#15803d 12%,transparent)}#dcMfBox .o.no,#dcMfBox .res.no{border-color:#dc2626;background:color-mix(in srgb,#dc2626 10%,transparent)}
#dcMfBox .res{border:1.5px solid;border-radius:10px;padding:10px}#dcMfBox .why{color:#b45309;font-size:13.5px}
@media (prefers-reduced-motion:reduce){#dcMfSheet{transition:none}}`;
    document.head.appendChild(st);
  }
  /* ---------- answer input with 3 levels (Task 72): 🟢 Leicht = tap the words (+ up to 3 trap words) · 🟡 Mittel = type
     with the first letters shown · 🔴 Schwer = type, no help. Choice in dc_mf_level; used by the quick practice and Meine_Fehler. */
  const LV_KEY = 'dc_mf_level';
  const level = () => { try { return localStorage.getItem(LV_KEY) || 'easy'; } catch (e) { return 'easy'; } };
  const TRAPS = { den: 'dem', dem: 'den', der: 'den', die: 'der', das: 'dem', einen: 'einem', einem: 'einen', eine: 'einer', einer: 'eine', ein: 'einen',
    meine: 'meinen', meinen: 'meinem', meiner: 'meine', mein: 'meinen', deine: 'deiner', deiner: 'deine', mir: 'mich', mich: 'mir', dir: 'dich', dich: 'dir',
    ihnen: 'sie', ihm: 'ihn', ihn: 'ihm', weil: 'denn', denn: 'weil', ob: 'wenn', wenn: 'als', als: 'wenn', dass: 'das', deshalb: 'weil', trotzdem: 'obwohl',
    obwohl: 'trotzdem', habe: 'bin', bin: 'habe', ist: 'hat', hat: 'ist', sind: 'haben', haben: 'sind', nur: 'noch', bis: 'seit', seit: 'bis', am: 'im', im: 'am', zum: 'zur', zur: 'zum' };
  const WORDS = x => String(x || '').match(/[\p{L}\p{N}-]+/gu) || [];
  function tilesFor(answer) {
    const w = WORDS(answer), have = new Set(w.map(x => x.toLowerCase())), traps = [];
    w.forEach(x => { const t = TRAPS[x.toLowerCase()]; if (t && !have.has(t) && traps.length < 3 && !traps.includes(t)) traps.push(x[0] === x[0].toUpperCase() ? t[0].toUpperCase() + t.slice(1) : t); });
    return [...w, ...traps].map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  }
  const firstLetters = a => String(a).replace(/\p{L}+/gu, w => w[0] + '_'.repeat(w.length - 1));
  const STACK = {};
  function inputHTML(answer, id) {
    css(); const L = level(); STACK[id] = [];
    const chips = `<div class="dcmf-lv" role="group" aria-label="Schwierigkeit">${[['easy', '🟢 Leicht'], ['mid', '🟡 Mittel'], ['hard', '🔴 Schwer']].map(([k, l]) => `<button type="button" class="dcmf-chip${L === k ? ' on' : ''}" data-mflv="${k}" aria-pressed="${L === k}">${l}</button>`).join('')}
      <span class="dcmf-lvh">${L === 'easy' ? 'Wörter antippen' : L === 'mid' ? 'selbst tippen + Anfangsbuchstaben' : 'ohne Hilfe'}</span></div>`;
    const ta = `<textarea id="${id}" class="dcmf-in" placeholder="${L === 'easy' ? 'Wörter unten antippen …' : 'Auf Deutsch … (Enter = prüfen)'}" spellcheck="false" autocapitalize="sentences"${L === 'easy' ? ' readonly inputmode="none"' : ''}></textarea>`;
    if (L === 'easy') return chips + ta + `<div class="dcmf-tiles" data-for="${id}">${tilesFor(answer).map(w => `<button type="button" class="dcmf-tile" data-mft="${escH(w)}">${escH(w)}</button>`).join('')}</div>
      <div class="r"><button type="button" class="dcmf-b" data-mfu="${id}">⌫ letztes Wort</button><button type="button" class="dcmf-b" data-mfc="${id}">🗑 leeren</button>${tilesFor(answer).length > WORDS(answer).length ? '<span class="dcmf-lvh">⚠️ Vorsicht: ein paar Fallen-Wörter sind dabei!</span>' : ''}</div>`;
    if (L === 'mid') return chips + `<div class="dcmf-pat">🔤 ${escH(firstLetters(answer))}</div>` + ta;
    return chips + ta;
  }
  /* ---------- 🤖 more questions like this one (Task 72): the AI writes 3 new sentences on the SAME grammar point ----------
     needs an AI key (dcAIConfigured / dcCallAI from app-shell). New items are temporary (marked 🤖); a wrong one is saved. */
  const aiOn = () => typeof window.dcAIConfigured === 'function' && window.dcAIConfigured();
  async function aiSimilar(it) {
    const sys = 'You are a careful German teacher for a Tamil-speaking learner (level A1–B1). Write 3 NEW short practice sentences that train EXACTLY the same grammar point as the example (same structure, different words and situation). German must be correct and natural, 4–12 words. Answer ONLY with a JSON array: [{"en":"English sentence","de":"German sentence","why":"the grammar rule in max 14 words"}]';
    const user = `Example (English): ${it.q}\nCorrect German: ${it.answer}\nRule / hint: ${it.why || it.hint || ''}`;
    const out = await window.dcCallAI([{ role: 'system', content: sys }, { role: 'user', content: user }]);
    const txt = String(out || ''); const arr = JSON.parse(txt.slice(txt.indexOf('['), txt.lastIndexOf(']') + 1));
    const items = (Array.isArray(arr) ? arr : []).filter(x => x && typeof x.en === 'string' && typeof x.de === 'string' && WORDS(x.de).length >= 2 && WORDS(x.de).length <= 25).slice(0, 3)
      .map((x, i) => ({ id: 'ki|' + Date.now() + i, src: 'ki', kind: 'type', q: strip(x.en), hint: '🤖 Ähnliche Frage (KI) — übt dieselbe Regel', answer: strip(x.de), alts: [], options: [], why: strip(x.why || it.why || ''), temp: true }));
    if (!items.length) throw new Error('Die KI hat keine brauchbaren Sätze geliefert — bitte nochmal.');
    return items;
  }
  function aiButton(label) {
    return aiOn() ? `<button type="button" class="dcmf-b" data-mfai="1">🤖 ${label || '3 ähnliche Fragen (KI)'}</button>`
      : `<a class="dcmf-b" href="Einstellungen_Setup.html" style="text-decoration:none;" title="KI-Schlüssel in den Einstellungen eintragen">🤖 Mehr Fragen mit KI (Schlüssel einrichten)</a>`;
  }
  async function practiseAI(it, btn) {
    if (!it || !aiOn()) return;
    if (btn) { btn.disabled = true; btn.textContent = '⏳ KI schreibt 3 Fragen …'; }
    try {
      const items = await aiSimilar(it);
      if (P && document.getElementById('dcMfBox') && P.k < P.q.length) { P.q.splice(P.k + 1, 0, ...items); if (btn) btn.textContent = `✅ ${items.length} neue Fragen kommen als Nächstes`; }
      else openWith(items);
    } catch (e) { if (btn) { btn.disabled = false; btn.textContent = '⚠️ ' + (e.message || 'KI-Fehler') + ' — nochmal?'; } }
  }
  function openWith(items) {
    hideSheet(); css();
    P = { q: items, k: 0, right: 0, again: new Set() };
    let ov = document.getElementById('dcMfOv');
    if (!ov) { ov = document.createElement('div'); ov.id = 'dcMfOv'; ov.innerHTML = '<div id="dcMfBox" role="dialog" aria-modal="true" aria-label="Fehler üben"></div>'; document.body.appendChild(ov); }
    draw();
  }
  function nudge(it) {
    if (typeof document === 'undefined' || !document.body) return;
    if (!PENDING.includes(it.id)) PENDING.push(it.id);
    const m = mode(); if (m === 'off') return;
    if (m === 'now') { clearTimeout(timerNow); timerNow = setTimeout(() => practise(), 1600); return; }
    css();
    let sh = document.getElementById('dcMfSheet');
    if (!sh) { sh = document.createElement('div'); sh.id = 'dcMfSheet'; sh.setAttribute('role', 'status'); sh.setAttribute('aria-live', 'polite'); document.body.appendChild(sh); }
    const n = PENDING.length;
    sh.innerHTML = `<div class="t">✏️ Fehler gemerkt${n > 1 ? ` · ${n} in dieser Runde` : ''}</div>
      <div class="a">Richtig: <b>${escH(it.answer)}</b></div>${it.why ? `<div class="w">💡 ${escH(it.why)}</div>` : ''}
      <div class="r"><button type="button" class="dcmf-b p" data-mf="go">🔁 Jetzt üben${n > 1 ? ` (${n})` : ''}</button><button type="button" class="dcmf-b" data-mf="later">Später</button>
        <button type="button" class="dcmf-b" data-mf="set" aria-label="Einstellung">⚙️</button><a class="dcmf-b" href="Meine_Fehler.html" style="text-decoration:none;">📒 Fehlerheft</a></div>
      <div class="set"><b>Nach einem Fehler:</b>${[['ask', 'fragen'], ['now', 'sofort üben'], ['off', 'nur speichern']].map(([k, l]) => `<label><input type="radio" name="dcmfmode" value="${k}" ${m === k ? 'checked' : ''}> ${l}</label>`).join('')}</div>`;
    requestAnimationFrame(() => sh.classList.add('on'));
  }
  function hideSheet() { const sh = document.getElementById('dcMfSheet'); if (sh) sh.classList.remove('on'); }
  /* quick practice of this round's mistakes, right here: type the answer or pick the option; wrong ones come back once more */
  function practise() {
    hideSheet(); css();
    const byId = new Map(load().map(x => [x.id, x]));
    const q = PENDING.map(id => byId.get(id)).filter(Boolean);
    if (!q.length) return;
    P = { q, k: 0, right: 0, again: new Set() };
    let ov = document.getElementById('dcMfOv');
    if (!ov) { ov = document.createElement('div'); ov.id = 'dcMfOv'; ov.innerHTML = '<div id="dcMfBox" role="dialog" aria-modal="true" aria-label="Fehler üben"></div>'; document.body.appendChild(ov); }
    draw();
  }
  function close() { const ov = document.getElementById('dcMfOv'); if (ov) ov.remove(); P = null; }
  function draw() {
    const box = document.getElementById('dcMfBox'); if (!box || !P) return;
    if (P.k >= P.q.length) {
      const n = P.q.length - P.again.size;
      box.innerHTML = `<div class="q">✅ Geübt!</div><div>${P.right} von ${P.q.length} Antworten richtig. Die Fehler bleiben im Fehlerheft und kommen morgen wieder (1 → 3 → 7 → 14 Tage).</div>
        <div class="r"><button type="button" class="dcmf-b p" data-mf="close">Weiter mit der Übung</button>${aiButton('3 weitere ähnliche Fragen (KI)')}<a class="dcmf-b" href="Meine_Fehler.html" style="text-decoration:none;">📒 Fehlerheft</a></div>`;
      PENDING = []; box.querySelector('[data-mf="close"]').focus(); return;
    }
    const it = P.q[P.k], opts = it.kind === 'choice' && it.options.length > 1 ? it.options.slice().sort(() => Math.random() - .5) : null;
    box.innerHTML = `<div class="h">🔁 ${it.temp ? 'Mehr üben' : 'Sofort üben'} · ${P.k + 1} / ${P.q.length} · ${escH(SRC[it.src] || '')}</div>${it.hint ? `<div class="h">${escH(it.hint)}</div>` : ''}
      <div class="q">${escH(it.q)}</div>
      ${opts ? `<div>${opts.map(o => `<button type="button" class="o" data-mfo="${escH(o)}">${escH(o)}</button>`).join('')}</div>`
             : `${inputHTML(it.answer, 'dcMfIn')}
                <div class="r"><button type="button" class="dcmf-b p" data-mf="chk">Prüfen</button><button type="button" class="dcmf-b" data-mf="dunno">👁 Weiß ich nicht</button><button type="button" class="dcmf-b" data-mf="skip">⏭ Anderer Satz</button><button type="button" class="dcmf-b" data-mf="close">Schließen</button></div>`}
      <div id="dcMfRes"></div>`;
    const ta = document.getElementById('dcMfIn');
    if (ta) { if (!ta.readOnly) ta.focus(); ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); result(check(ta.value, it), ta.value); } }); }
  }
  function result(r, given) {
    const it = P.q[P.k]; if (P.shown === P.k) return; P.shown = P.k;
    if (r.ok) P.right++; else if (!P.again.has(it.id)) { P.again.add(it.id); P.q.push(it); }     // wrong → once more at the end
    P.last = it;
    if (!r.ok && it.temp) add({ src: 'ki', q: it.q, hint: it.hint, answer: it.answer, why: it.why, given, silent: true });   // a wrong AI question goes to the notebook
    const ta = document.getElementById('dcMfIn'); if (ta) ta.disabled = true;
    document.querySelectorAll('#dcMfBox .o').forEach(b => { b.disabled = true; if (b.dataset.mfo === it.answer) b.classList.add('ok'); else if (b.dataset.mfo === given) b.classList.add('no'); });
    document.getElementById('dcMfRes').innerHTML = `<div class="res ${r.ok ? 'ok' : 'no'}">${r.ok ? '🌟 <b>Richtig!</b>' : '✏️ <b>So ist es richtig:</b>'} <b>${escH(it.answer)}</b>
      ${r.note ? `<div class="h">✏️ ${escH(r.note)}</div>` : ''}${it.why ? `<div class="why">💡 ${escH(it.why)}</div>` : ''}</div>
      ${!r.ok && / /.test(it.answer) && window.DCExplain ? DCExplain.feedback(it.kind === 'type' ? given : '', it.answer) : ''}
      <div class="r"><button type="button" class="dcmf-b p" data-mf="next">Weiter →</button>${aiButton()}</div>`;
    document.querySelector('#dcMfBox [data-mf="next"]').focus();
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('[data-mft],[data-mfu],[data-mfc],[data-mflv]');
      if (t) {
        if (t.dataset.mflv) { try { localStorage.setItem(LV_KEY, t.dataset.mflv); } catch (x) {} if (P && document.getElementById('dcMfBox')) { P.shown = -1; draw(); } document.dispatchEvent(new CustomEvent('dcmf-level')); return; }
        const id = t.dataset.mfu || t.dataset.mfc || (t.closest('.dcmf-tiles') || {}).dataset.for, ta = document.getElementById(id); if (!ta || ta.disabled) return;
        const st = STACK[id] = STACK[id] || [];
        if (t.dataset.mft != null) { ta.value = (ta.value.trim() + ' ' + t.dataset.mft).trim(); t.disabled = true; st.push(t); }
        else if (t.dataset.mfu) { const last = st.pop(); if (last) { last.disabled = false; ta.value = ta.value.trim().split(' ').slice(0, -1).join(' '); } }
        else { st.forEach(x => { x.disabled = false; }); st.length = 0; ta.value = ''; }
        return;
      }
      const b = e.target.closest && e.target.closest('[data-mf],[data-mfo],[data-mfai]'); if (!b) return;
      const a = b.dataset.mf;
      if (b.dataset.mfo != null) return result({ ok: b.dataset.mfo === P.q[P.k].answer, note: '' }, b.dataset.mfo);
      if (b.dataset.mfai) return practiseAI((P && (P.q[P.k] || P.last)) || window.__dcMfLast, b);
      if (a === 'go') return practise();
      if (a === 'later') { hideSheet(); return; }
      if (a === 'set') { const s2 = document.querySelector('#dcMfSheet .set'); if (s2) s2.classList.toggle('on'); return; }
      if (a === 'close') { close(); return; }
      if (a === 'chk') { const ta = document.getElementById('dcMfIn'); if (ta && ta.value.trim()) result(check(ta.value, P.q[P.k]), ta.value); return; }
      if (a === 'dunno') return result({ ok: false, note: '' }, '');
      if (a === 'next') { P.k++; P.shown = -1; return draw(); }
      if (a === 'skip') { if (P.shown === P.k) return; const it = P.q.splice(P.k, 1)[0]; if (!it.skipped) P.q.push(Object.assign({}, it, { skipped: true })); P.shown = -1; return draw(); }
    });
    document.addEventListener('change', e => { if (e.target && e.target.name === 'dcmfmode') { try { localStorage.setItem(MODE_KEY, e.target.value); } catch (x) {} if (e.target.value === 'off') setTimeout(hideSheet, 400); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (document.getElementById('dcMfOv')) close(); else hideSheet(); } });
  }
  /* a word card answered wrong (flashcards, Verben/Nomen/Adjektiv trainers) → notebook item "English → German word" */
  function addWord(w, href) {
    if (!w) return null;
    const cat = w.cat === 'v' || w.inf ? 'v' : w.cat === 'adj' || (w.w && !w.sg && w.komp !== undefined) ? 'a' : 'n';
    const word = w.inf || w.sg || w.w || '', art = w.a || '', en = String(w.en || '').split(/[;/]/)[0].trim();
    if (!word || !en) return null;
    const forms = cat === 'v' ? [w.praeteritum || w.pr, w.perfekt || w.pp].filter(Boolean).join(' · ')
      : cat === 'n' ? (w.pl || w.p ? 'Plural: die ' + (w.pl || w.p) : '') : [w.komp || w.comp, w.sup].filter(Boolean).join(' → ');
    return add({ src: 'words', href: href || '', q: en, hint: cat === 'v' ? 'Welches Verb? (Infinitiv)' : cat === 'n' ? 'Nomen mit Artikel (der / die / das)' : 'Welches Adjektiv?',
      answer: (art && cat === 'n' ? art + ' ' : '') + word, why: forms ? word + (forms ? ' — ' + forms : '') : '' });
  }
  window.DCMistakes = {
    SRC, add, addWord, grade, check, all: load, practise, inputHTML, level, practiseAI, aiButton, aiOn, pending: () => PENDING.slice(),
    mode, setMode: v => { try { localStorage.setItem(MODE_KEY, v); } catch (e) {} },
    due: () => load().filter(x => !x.done && x.due <= Date.now()),
    remove: id => save(load().filter(x => x.id !== id)),
    clearLearnt: () => save(load().filter(x => !x.done)),
    stats: () => { const a = load(), now = Date.now(); return { total: a.length, open: a.filter(x => !x.done).length, due: a.filter(x => !x.done && x.due <= now).length, learnt: a.filter(x => x.done).length }; }
  };
})();
