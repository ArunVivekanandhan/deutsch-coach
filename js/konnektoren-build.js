/* Konnektoren — 🧩 Sätze bauen (Task 76): make whole sentences with a connector.
   Sentences are not new: they come from the word-order-checked Satzbau data (js/satzbau-data.js — topics Konnektoren,
   Nebensatz, Nebensatz zuerst, trotzdem/obwohl, temporale Nebensätze, Doppelkonnektoren) and from the Crashkurs
   "zwei Sätze verbinden" items (js/text-drills.js). Input = the shared box from js/mistakes.js (🟢 Leicht word tiles /
   🟡 Mittel first letters / 🔴 Schwer), wrong answers go to the mistake notebook, js/sentence-explain.js explains them. */
(function () {
  const TOPICS = ['konnektoren', 'nebensatz', 'nebensatzerst', 'trotzdemobwohl', 'temporal', 'doppelkonnektoren'];
  const GRP = {
    grp1: ['🔴', 'Nebensatz (Verb am Ende)', 'var(--red)'],
    grp2: ['🟡', 'Position 1 (Verb sofort)', 'var(--gold)'],
    grp3: ['🟣', 'Position 0 (ADUSO)', 'var(--purple)'],
    grp4: ['🔵', 'Zweiteilig', 'var(--blue)'],
    grp5: ['🟢', 'zu + Infinitiv', 'var(--green)']
  };
  const GRP_EN = { grp1: 'Subordinate clause (verb at the end)', grp2: 'Position 1 (verb right after)', grp3: 'Position 0 (ADUSO)', grp4: 'Two-part', grp5: 'zu + infinitive' };
  const RULE = {
    grp1: 'Nebensatz-Konnektor → das konjugierte Verb steht am ENDE des Nebensatzes (…, weil ich krank bin).',
    grp2: 'Position-1-Konnektor → er besetzt selbst Position 1, das Verb folgt SOFORT, dann das Subjekt (…, deshalb bleibe ich …).',
    grp3: 'ADUSO (aber, denn, und, sondern, oder) = Position 0 → danach normale Reihenfolge: Subjekt + Verb (…, denn ich bin krank).',
    grp4: 'Zweiteiliger Konnektor → beide Teile gehören zusammen (entweder … oder, weder … noch, sowohl … als auch, nicht nur … sondern auch, zwar … aber, je … desto).',
    grp5: 'um … zu / versuchen … zu → „zu + Infinitiv“ steht ganz am ENDE, ohne eigenes Subjekt (…, um ihnen zu danken).'
  };
  const RULE_EN = {
    grp1: 'Subordinating connector → the conjugated verb goes to the END of the clause (…, weil ich krank bin).',
    grp2: 'Position-1 connector → it takes position 1 itself, the verb follows RIGHT AFTER it, then the subject (…, deshalb bleibe ich …).',
    grp3: 'ADUSO (aber, denn, und, sondern, oder) = position 0 → normal order afterwards: subject + verb (…, denn ich bin krank).',
    grp4: 'Two-part connector → both parts belong together (entweder … oder, weder … noch, sowohl … als auch, nicht nur … sondern auch, zwar … aber, je … desto).',
    grp5: 'um … zu / versuchen … zu → “zu + infinitive” goes to the very END, with no subject of its own (…, um ihnen zu danken).'
  };
  const bi = (de, en) => `<span class="l-de">${esc(de)}</span><span class="l-en">${esc(en || de)}</span>`;   // 🌐 DE/EN (Task 81)
  const SUB = ['weil', 'dass', 'obwohl', 'wenn', 'als', 'ob', 'nachdem', 'bevor', 'damit', 'während', 'bis', 'seit', 'seitdem', 'sobald'];
  const POS1 = ['deshalb', 'deswegen', 'darum', 'trotzdem', 'dann', 'danach', 'außerdem', 'sonst', 'zuerst'];
  const ADUSO = ['aber', 'denn', 'und', 'sondern', 'oder'];
  const PREF = 'kb_prefs_v1';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const $ = id => document.getElementById(id);
  const prefs = (() => { try { return Object.assign({ mode: 'en', lv: 'alle', grp: 'alle' }, JSON.parse(localStorage.getItem(PREF)) || {}); } catch (e) { return { mode: 'en', lv: 'alle', grp: 'alle' }; } })();
  const savePrefs = () => { try { localStorage.setItem(PREF, JSON.stringify(prefs)); } catch (e) {} };

  function grpOf(word) { const w = word.toLowerCase(); if (/… zu$/.test(w)) return 'grp5'; return SUB.includes(w) ? 'grp1' : POS1.includes(w) ? 'grp2' : ADUSO.includes(w) ? 'grp3' : 'grp2'; }

  /* English → German items from the Satzbau data: the connector is the K/A/N chunk after a comma (else the first one) */
  function satzbauItems() {
    const D = window.SATZBAU_DATA; if (!D) return [];
    const out = [];
    D.grammar.filter(t => TOPICS.includes(t.id)).forEach(t => t.sentences.forEach(s => {
      if (s.ai || !s.en) return;
      const de = s.t.map((c, i) => i === 0 ? cap(c[0]) : c[0]).join(' ') + (s.end || '.');
      let con = '', grp;
      if (t.id === 'doppelkonnektoren') {
        const m = de.match(/\b(entweder|weder|sowohl|nicht nur|zwar|je)\b/i);
        con = m ? { entweder: 'entweder … oder', weder: 'weder … noch', sowohl: 'sowohl … als auch', 'nicht nur': 'nicht nur … sondern auch', zwar: 'zwar … aber', je: 'je … desto' }[m[1].toLowerCase()] : '';
        grp = 'grp4';
      } else {
        const idx = s.t.findIndex((c, i) => 'KAN'.includes(c[1]) && i > 0 && /,$/.test(s.t[i - 1][0]));
        const c = s.t[idx >= 0 ? idx : s.t.findIndex(c => 'KAN'.includes(c[1]))];
        if (!c) return;
        con = c[0].toLowerCase();
        grp = c[1] === 'N' ? 'grp1' : c[1] === 'K' ? 'grp3' : 'grp2';
      }
      out.push({ mode: 'en', q: s.en, ta: s.ta || '', answer: de, alts: [], con, grp, lv: s.lv || t.level, why: RULE[grp], why_en: RULE_EN[grp], topic: t.title });
    }));
    return out;
  }
  /* "join two sentences" items from the Crashkurs */
  function joinItems() {
    const J = (window.DC_CRASH && window.DC_CRASH.join) || [];
    return J.map(j => {
      const grp = grpOf(j.c);
      return { mode: 'join', a: j.a, b: j.b, q: `${j.a} + ${j.b}`, answer: j.de, alts: j.alts || [], con: j.c, grp,
               lv: ADUSO.includes(j.c.toLowerCase()) ? 'A1' : 'A2', why: (j.why ? j.why + ' — ' : '') + RULE[grp], why_en: (j.why ? j.why + ' — ' : '') + RULE_EN[grp], topic: 'Crashkurs' };
    });
  }
  const ALL = () => [...satzbauItems(), ...joinItems()];

  let K = null;   // session: { list, k, right, total, answered }
  function pool() {
    return ALL().filter(x => x.mode === prefs.mode && (prefs.lv === 'alle' || x.lv === prefs.lv) && (prefs.grp === 'alle' || x.grp === prefs.grp));
  }
  function start() { K = { list: shuffle(pool()), k: 0, right: 0, total: 0, answered: false }; draw(); }

  function chip(key, val, label, cur) {
    return `<button type="button" class="kb-chip${cur === val ? ' on' : ''}" data-kb="${key}" data-v="${esc(val)}" aria-pressed="${cur === val}">${label}</button>`;
  }
  function bar() {
    const all = ALL(), n = f => all.filter(f).length;
    const lvls = ['alle', 'A1', 'A2', 'B1', 'B2'].filter(l => l === 'alle' || n(x => x.mode === prefs.mode && x.lv === l));
    if (!lvls.includes(prefs.lv)) prefs.lv = 'alle';
    return `<div class="kb-row">${chip('mode', 'en', '🇬🇧→🇩🇪 Satz bauen', prefs.mode)}${chip('mode', 'join', '🔗 Zwei Sätze verbinden', prefs.mode)}</div>
      <div class="kb-row"><span class="kb-lab">Level</span>${lvls.map(l => chip('lv', l, l === 'alle' ? 'Alle' : l, prefs.lv)).join('')}</div>
      <div class="kb-row"><span class="kb-lab">Art</span>${chip('grp', 'alle', 'Alle', prefs.grp)}${Object.entries(GRP).filter(([g]) => n(x => x.mode === prefs.mode && x.grp === g)).map(([g, [ic, l]]) => chip('grp', g, ic + ' ' + l, prefs.grp)).join('')}</div>`;
  }

  function draw() {
    const box = $('kbCard'); if (!box) return;
    $('kbBar').innerHTML = bar();
    if (!K.list.length) { box.innerHTML = `<div class="kb-empty">${bi('Für diese Auswahl gibt es keine Sätze — wähle ein anderes Level oder „Alle“.', 'No sentences for this choice — pick another level or “All”.')}</div>`; return; }
    if (K.k >= K.list.length) {
      box.innerHTML = `<div style="text-align:center;"><div class="kb-score">${K.right} / ${K.total}</div><div>${bi('Sätze richtig gebaut', 'sentences built correctly')}</div>
        <div class="kb-row" style="justify-content:center;margin-top:12px;"><button type="button" class="kb-btn p" id="kbAgain">↺ Neue Runde</button><a class="kb-btn" href="Meine_Fehler.html" style="text-decoration:none;">📒 Fehlerheft</a></div></div>`;
      $('kbAgain').onclick = start; return;
    }
    const it = K.list[K.k], [ic, gl, col] = GRP[it.grp]; K.answered = false;
    const prompt = it.mode === 'join'
      ? `<div class="kb-join"><div>1️⃣ ${esc(it.a)}</div><div>2️⃣ ${esc(it.b)}</div></div><div class="kb-en">${bi('Verbinde beide Sätze zu einem Satz.', 'Join both sentences into one sentence.')}</div>`
      : `<div class="kb-q">🇬🇧 ${esc(it.q)}</div>${it.ta ? `<div class="kb-ta" lang="ta">${esc(it.ta)} <span title="Tamil KI-unterstützt">🤖</span></div>` : ''}`;
    box.innerHTML = `<div class="kb-badge">Satz ${K.k + 1} / ${K.list.length} · ✅ ${K.right} · ${esc(it.lv)}</div>
      ${prompt}
      <div class="kb-hint" style="border-color:${col}">${bi('mit', 'with')} <b>${esc(it.con)}</b> · ${ic} ${bi(gl, GRP_EN[it.grp])}</div>
      ${window.DCMistakes ? DCMistakes.inputHTML(it.answer, 'kbIn') : '<textarea id="kbIn" class="kb-in" placeholder="Auf Deutsch …"></textarea>'}
      <div class="kb-row" id="kbBtns"><button type="button" class="kb-btn p" id="kbChk">Prüfen</button><button type="button" class="kb-btn" id="kbShow">👁 Lösung</button><button type="button" class="kb-btn" id="kbSkip" title="Ein anderer Satz — zählt nicht, kommt am Ende noch einmal">⏭ Anderer Satz</button></div>
      <div id="kbRes" aria-live="polite"></div>`;
    const ta = $('kbIn');
    if (ta) ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } });
    $('kbChk').onclick = check;
    $('kbShow').onclick = () => { if (!K.answered) result(false, ta ? ta.value.trim() : '', true); };
    $('kbSkip').onclick = () => { if (K.answered) return; const x = K.list.splice(K.k, 1)[0]; if (!x.skipped) K.list.push(Object.assign({}, x, { skipped: true })); draw(); };
  }
  function check() {
    if (K.answered) return;
    const ta = $('kbIn'), v = ta ? ta.value.trim() : ''; if (!v) { if (ta) ta.focus(); return; }
    const it = K.list[K.k], r = window.DCMistakes ? DCMistakes.check(v, it) : { ok: v === it.answer, note: '' };
    result(r.ok, v, false, r.note);
  }
  function result(ok, given, shown, note) {
    const it = K.list[K.k]; K.answered = true; K.total++; if (ok) K.right++;
    const ta = $('kbIn'); if (ta) ta.disabled = true;
    $('kbBtns').hidden = true;
    if (!ok && window.DCMistakes) DCMistakes.add({ src: 'konn', kind: 'type', q: it.mode === 'join' ? `${it.a} + ${it.b} → ${it.con}` : it.q, answer: it.answer, alts: it.alts, given, hint: `mit ${it.con}`, why: it.why, href: 'konnektoren_referenz.html' });
    const expl = !ok && window.DCExplain ? DCExplain.feedback(shown ? '' : given, it.answer) : '';
    $('kbRes').innerHTML = `<div class="kb-fb ${ok ? 'ok' : 'no'}">${ok ? '✅ Richtig!' : shown ? '👁 Lösung:' : '❌ Nicht ganz. Richtig:'}
        <div class="kb-sol">${esc(it.answer)} <button type="button" class="kb-say" data-kbsay="${esc(it.answer)}" aria-label="vorlesen">🔊</button></div>
        ${it.alts && it.alts.length ? `<div class="kb-alt">Auch richtig: ${it.alts.map(esc).join(' · ')}</div>` : ''}
        ${note ? `<div class="kb-alt">${esc(note)}</div>` : ''}
        <div class="kb-why">💡 ${bi(it.why, it.why_en)}</div></div>${expl}
      <div class="kb-row"><button type="button" class="kb-btn p" id="kbNext">Weiter →</button></div>`;
    $('kbNext').onclick = () => { K.k++; draw(); }; $('kbNext').focus();
  }

  document.addEventListener('click', e => {
    const c = e.target.closest && e.target.closest('[data-kb],[data-kbsay]'); if (!c) return;
    if (c.dataset.kbsay) { if (typeof window.speak === 'function') window.speak(c.dataset.kbsay); return; }
    prefs[c.dataset.kb] = c.dataset.v; savePrefs(); start();
  });
  document.addEventListener('dcmf-level', () => { if (K && !K.answered && $('kbCard') && $('viewBuild') && $('viewBuild').style.display !== 'none') draw(); });

  window.KBuild = { start, items: ALL, get state() { return K; } };
})();
