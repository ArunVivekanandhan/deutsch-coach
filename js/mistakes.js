/* Meine Fehler (Task 63): ONE mistake notebook for all practice pages.
   A page calls DCMistakes.add({...}) when an answer is wrong; Meine_Fehler.html brings every mistake back with spaced
   review (box 0 → 1 → 2 → 3 → 4 → learnt: again after 0 / 1 / 3 / 7 / 14 days); a wrong review puts it back to box 0.
   item: { id, src, href, kind: 'type' | 'choice', q (question / English sentence), hint, answer, alts[], options[],
           given (the learner's wrong answer), why (rule / explanation), box, due (ms), wrong (times), added, done }
   Stored only in this browser (localStorage dc_mistakes). */
(function () {
  const KEY = 'dc_mistakes', MAX = 500, DAYS = [0, 1, 3, 7, 14], DAY = 864e5;
  const SRC = { text: '📝 Text-Trainer', satzbau: '🧱 Satzbau', grammar: '📘 Grammatik', zeitreise: '🕰️ Zeitreise',
                wz: '👯 Wort-Zwillinge', crash: '⚡ Crashkurs', bild: '🎬 Bild-Quiz', words: '🃏 Wörter', hoeren: '🎧 Diktat' };
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
#dcMfBox .q{font-size:19px;font-weight:800}#dcMfBox .h{font-size:13px;color:var(--color-ink-soft,#555)}
#dcMfBox textarea{font:inherit;font-size:17px;width:100%;min-height:64px;padding:10px;border-radius:10px;border:1.5px solid var(--color-border,#ccc);background:var(--color-bg,#f8fafc);color:inherit;box-sizing:border-box}
#dcMfBox .o{display:block;width:100%;text-align:left;font:inherit;font-size:16px;padding:10px 12px;margin:5px 0;border-radius:10px;border:1.5px solid var(--color-border,#ccc);background:var(--color-bg,#f8fafc);color:inherit;cursor:pointer}
#dcMfBox .o.ok,#dcMfBox .res.ok{border-color:#15803d;background:color-mix(in srgb,#15803d 12%,transparent)}#dcMfBox .o.no,#dcMfBox .res.no{border-color:#dc2626;background:color-mix(in srgb,#dc2626 10%,transparent)}
#dcMfBox .res{border:1.5px solid;border-radius:10px;padding:10px}#dcMfBox .why{color:#b45309;font-size:13.5px}
@media (prefers-reduced-motion:reduce){#dcMfSheet{transition:none}}`;
    document.head.appendChild(st);
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
        <div class="r"><button type="button" class="dcmf-b p" data-mf="close">Weiter mit der Übung</button><a class="dcmf-b" href="Meine_Fehler.html" style="text-decoration:none;">📒 Fehlerheft</a></div>`;
      PENDING = []; box.querySelector('[data-mf="close"]').focus(); return;
    }
    const it = P.q[P.k], opts = it.kind === 'choice' && it.options.length > 1 ? it.options.slice().sort(() => Math.random() - .5) : null;
    box.innerHTML = `<div class="h">🔁 Sofort üben · ${P.k + 1} / ${P.q.length} · ${escH(SRC[it.src] || '')}</div>${it.hint ? `<div class="h">${escH(it.hint)}</div>` : ''}
      <div class="q">${escH(it.q)}</div>
      ${opts ? `<div>${opts.map(o => `<button type="button" class="o" data-mfo="${escH(o)}">${escH(o)}</button>`).join('')}</div>`
             : `<textarea id="dcMfIn" placeholder="Auf Deutsch … (Enter = prüfen)" spellcheck="false" autocapitalize="sentences"></textarea>
                <div class="r"><button type="button" class="dcmf-b p" data-mf="chk">Prüfen</button><button type="button" class="dcmf-b" data-mf="dunno">👁 Weiß ich nicht</button><button type="button" class="dcmf-b" data-mf="close">Schließen</button></div>`}
      <div id="dcMfRes"></div>`;
    const ta = document.getElementById('dcMfIn');
    if (ta) { ta.focus(); ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); result(check(ta.value, it), ta.value); } }); }
  }
  function result(r, given) {
    const it = P.q[P.k]; if (P.shown === P.k) return; P.shown = P.k;
    if (r.ok) P.right++; else if (!P.again.has(it.id)) { P.again.add(it.id); P.q.push(it); }     // wrong → once more at the end
    const ta = document.getElementById('dcMfIn'); if (ta) ta.disabled = true;
    document.querySelectorAll('#dcMfBox .o').forEach(b => { b.disabled = true; if (b.dataset.mfo === it.answer) b.classList.add('ok'); else if (b.dataset.mfo === given) b.classList.add('no'); });
    document.getElementById('dcMfRes').innerHTML = `<div class="res ${r.ok ? 'ok' : 'no'}">${r.ok ? '🌟 <b>Richtig!</b>' : '✏️ <b>So ist es richtig:</b>'} <b>${escH(it.answer)}</b>
      ${r.note ? `<div class="h">✏️ ${escH(r.note)}</div>` : ''}${it.why ? `<div class="why">💡 ${escH(it.why)}</div>` : ''}</div>
      ${!r.ok && / /.test(it.answer) && window.DCExplain ? DCExplain.feedback(it.kind === 'type' ? given : '', it.answer) : ''}
      <div class="r"><button type="button" class="dcmf-b p" data-mf="next">Weiter →</button></div>`;
    document.querySelector('#dcMfBox [data-mf="next"]').focus();
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('[data-mf],[data-mfo]'); if (!b) return;
      const a = b.dataset.mf;
      if (b.dataset.mfo != null) return result({ ok: b.dataset.mfo === P.q[P.k].answer, note: '' }, b.dataset.mfo);
      if (a === 'go') return practise();
      if (a === 'later') { hideSheet(); return; }
      if (a === 'set') { const s2 = document.querySelector('#dcMfSheet .set'); if (s2) s2.classList.toggle('on'); return; }
      if (a === 'close') { close(); return; }
      if (a === 'chk') { const ta = document.getElementById('dcMfIn'); if (ta && ta.value.trim()) result(check(ta.value, P.q[P.k]), ta.value); return; }
      if (a === 'dunno') return result({ ok: false, note: '' }, '');
      if (a === 'next') { P.k++; P.shown = -1; return draw(); }
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
    SRC, add, addWord, grade, check, all: load, practise, pending: () => PENDING.slice(),
    mode, setMode: v => { try { localStorage.setItem(MODE_KEY, v); } catch (e) {} },
    due: () => load().filter(x => !x.done && x.due <= Date.now()),
    remove: id => save(load().filter(x => x.id !== id)),
    clearLearnt: () => save(load().filter(x => !x.done)),
    stats: () => { const a = load(), now = Date.now(); return { total: a.length, open: a.filter(x => !x.done).length, due: a.filter(x => !x.done && x.due <= now).length, learnt: a.filter(x => x.done).length }; }
  };
})();
