/* Meine Fehler (Task 63): ONE mistake notebook for all practice pages.
   A page calls DCMistakes.add({...}) when an answer is wrong; Meine_Fehler.html brings every mistake back with spaced
   review (box 0 → 1 → 2 → 3 → 4 → learnt: again after 0 / 1 / 3 / 7 / 14 days); a wrong review puts it back to box 0.
   item: { id, src, href, kind: 'type' | 'choice', q (question / English sentence), hint, answer, alts[], options[],
           given (the learner's wrong answer), why (rule / explanation), box, due (ms), wrong (times), added, done }
   Stored only in this browser (localStorage dc_mistakes). */
(function () {
  const KEY = 'dc_mistakes', MAX = 500, DAYS = [0, 1, 3, 7, 14], DAY = 864e5;
  const SRC = { text: '📝 Text-Trainer', satzbau: '🧱 Satzbau', grammar: '📘 Grammatik', zeitreise: '🕰️ Zeitreise',
                wz: '👯 Wort-Zwillinge', crash: '⚡ Crashkurs', bild: '🎬 Bild-Quiz' };
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
  window.DCMistakes = {
    SRC, add, grade, check, all: load,
    due: () => load().filter(x => !x.done && x.due <= Date.now()),
    remove: id => save(load().filter(x => x.id !== id)),
    clearLearnt: () => save(load().filter(x => !x.done)),
    stats: () => { const a = load(), now = Date.now(); return { total: a.length, open: a.filter(x => !x.done).length, due: a.filter(x => !x.done && x.due <= now).length, learnt: a.filter(x => x.done).length }; }
  };
})();
