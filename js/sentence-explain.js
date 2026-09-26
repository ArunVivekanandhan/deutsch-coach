/* Satz erklärt (Task 69): explain a German sentence after a mistake — which grammar it follows (word order, tense,
   reflexive, separable verb, subordinate clause, negation, prepositions + case) and every word with its meaning and form.
   Used by Zeitreise, Text-Trainer, Satzbau, Meine Fehler and the "Jetzt üben" practice (js/mistakes.js).
   DCExplain.into(element, sentence) fills the element (async: js/lexicon.js + js/german-conjugation.js are loaded the
   first time they are needed). Loaded on every page by js/app-shell.js. Rule-based — no AI, no guessing of meanings:
   a word that is not in the word lists is shown without a meaning. */
(function () {
  const FUNC = {
    ich: ['I', 'Subjekt'], du: ['you', 'Subjekt'], er: ['he', 'Subjekt'], sie: ['she / they / you (Sie)', 'Pronomen'], es: ['it', 'Subjekt / Pronomen'], wir: ['we', 'Subjekt'], ihr: ['you (plural)', 'Subjekt'], man: ['one, you (general)', 'Subjekt'],
    mich: ['me / myself', 'Akkusativ (reflexiv bei ich)'], dich: ['you / yourself', 'Akkusativ (reflexiv bei du)'], sich: ['himself / herself / themselves', 'Reflexivpronomen'], uns: ['us / ourselves', 'Akk./Dat.'], euch: ['you / yourselves', 'Akk./Dat.'],
    mir: ['(to) me', 'Dativ'], dir: ['(to) you', 'Dativ'], ihn: ['him', 'Akkusativ'], ihm: ['(to) him', 'Dativ'], ihnen: ['(to) them', 'Dativ'], Ihnen: ['(to) you (formal)', 'Dativ'],
    mein: ['my', 'Possessiv'], meine: ['my', 'Possessiv'], meinen: ['my', 'Possessiv (Akk. m. / Dat. Pl.)'], meinem: ['my', 'Possessiv (Dativ)'], meiner: ['my', 'Possessiv (Dat. f.)'], dein: ['your', 'Possessiv'], deine: ['your', 'Possessiv'], deiner: ['your', 'Possessiv (Dat. f.)'],
    unser: ['our', 'Possessiv'], unsere: ['our', 'Possessiv'], ihre: ['her / their', 'Possessiv'], seine: ['his', 'Possessiv'], seinen: ['his', 'Possessiv (Akk.)'],
    der: ['the', 'Artikel (Nom. m. / Dat. f.)'], die: ['the', 'Artikel (f. / Plural)'], das: ['the / that', 'Artikel (n.)'], den: ['the', 'Artikel (Akk. m. / Dat. Pl.)'], dem: ['the', 'Artikel (Dativ m./n.)'], des: ['of the', 'Artikel (Genitiv)'],
    ein: ['a / an', 'unbest. Artikel'], eine: ['a / an', 'unbest. Artikel (f.)'], einen: ['a / an', 'unbest. Artikel (Akk. m.)'], einem: ['a / an', 'unbest. Artikel (Dativ)'], einer: ['a / an', 'unbest. Artikel (Dat. f.)'],
    kein: ['no / not a', 'Negation vor Nomen'], keine: ['no / not any', 'Negation vor Nomen'], keinen: ['no', 'Negation vor Nomen (Akk.)'], nicht: ['not', 'Negation'],
    und: ['and', 'Konnektor (Position 0)'], oder: ['or', 'Konnektor (Position 0)'], aber: ['but', 'Konnektor (Position 0)'], denn: ['because', 'Konnektor (Position 0)'], sondern: ['but rather', 'Konnektor (Position 0)'],
    weil: ['because', 'Konnektor → Verb ans Ende'], dass: ['that', 'Konnektor → Verb ans Ende'], ob: ['whether / if', 'Konnektor → Verb ans Ende'], wenn: ['when / if', 'Konnektor → Verb ans Ende'], als: ['when (once, past) / than', 'Konnektor → Verb ans Ende'],
    obwohl: ['although', 'Konnektor → Verb ans Ende'], damit: ['so that', 'Konnektor → Verb ans Ende'], bevor: ['before', 'Konnektor → Verb ans Ende'], nachdem: ['after', 'Konnektor → Verb ans Ende'], während: ['while', 'Konnektor → Verb ans Ende'],
    deshalb: ['therefore', 'Adverb (Position 1 → Verb sofort)'], trotzdem: ['nevertheless', 'Adverb (Position 1 → Verb sofort)'], dann: ['then', 'Adverb'], danach: ['after that', 'Adverb'], zuerst: ['first', 'Adverb'],
    auch: ['also', 'Adverb'], nur: ['only', 'Adverb'], noch: ['still / yet', 'Adverb'], schon: ['already', 'Adverb'], sehr: ['very', 'Adverb (verstärkt)'], gern: ['gladly (like to)', 'Adverb'], gerne: ['gladly (like to)', 'Adverb'],
    immer: ['always', 'Adverb (Zeit)'], oft: ['often', 'Adverb (Zeit)'], nie: ['never', 'Adverb (Zeit)'], jetzt: ['now', 'Adverb (Zeit)'], heute: ['today', 'Adverb (Zeit)'], gestern: ['yesterday', 'Adverb (Zeit)'], morgen: ['tomorrow', 'Adverb (Zeit)'], hier: ['here', 'Adverb (Ort)'], dort: ['there', 'Adverb (Ort)'],
    zusammen: ['together', 'Adverb'], wieder: ['again', 'Adverb'], jeden: ['every', 'Begleiter (Akk. m.)'], jede: ['every', 'Begleiter'],
    wo: ['where', 'Fragewort'], wohin: ['where to', 'Fragewort'], woher: ['where from', 'Fragewort'], was: ['what', 'Fragewort'], wer: ['who', 'Fragewort'], wann: ['when', 'Fragewort'], warum: ['why', 'Fragewort'], wie: ['how', 'Fragewort'],
    in: ['in / into', 'Präposition (Wo? Dat. · Wohin? Akk.)'], im: ['in the', 'in + dem (Dativ)'], ins: ['into the', 'in + das (Akkusativ)'], an: ['at / on', 'Präposition / Vorsilbe'], am: ['at the / on the', 'an + dem (Dativ)'], auf: ['on / onto', 'Präposition / Vorsilbe'],
    aus: ['out of / from', 'Präposition + Dativ'], bei: ['at / with', 'Präposition + Dativ'], beim: ['at the', 'bei + dem'], mit: ['with', 'Präposition + Dativ'], nach: ['to / after', 'Präposition + Dativ'], von: ['from / of', 'Präposition + Dativ'], vom: ['from the', 'von + dem'],
    zu: ['to / too', 'Präposition + Dativ / zu + Infinitiv'], zum: ['to the', 'zu + dem'], zur: ['to the', 'zu + der'], seit: ['since / for', 'Präposition + Dativ'], für: ['for', 'Präposition + Akkusativ'], ohne: ['without', 'Präposition + Akkusativ'],
    durch: ['through', 'Präposition + Akkusativ'], gegen: ['against', 'Präposition + Akkusativ'], um: ['at (time) / around', 'Präposition + Akkusativ'], über: ['over / about', 'Präposition'], unter: ['under', 'Präposition'], vor: ['before / in front of', 'Präposition'],
    hinter: ['behind', 'Präposition'], neben: ['next to', 'Präposition'], zwischen: ['between', 'Präposition'], trotz: ['despite', 'Präposition + Genitiv'], wegen: ['because of', 'Präposition + Genitiv'], bis: ['until', 'Präposition'], uhr: ["o'clock", 'Nomen (Zeit)'],
    bin: ['am', 'sein · Präsens (ich)'], bist: ['are', 'sein · Präsens (du)'], ist: ['is', 'sein · Präsens (er/sie/es)'], sind: ['are', 'sein · Präsens (wir/sie)'], seid: ['are', 'sein · Präsens (ihr)'],
    war: ['was', 'sein · Präteritum (ich/er)'], warst: ['were', 'sein · Präteritum (du)'], waren: ['were', 'sein · Präteritum (wir/sie)'],
    habe: ['have', 'haben · Präsens (ich) / Hilfsverb'], hast: ['have', 'haben · Präsens (du)'], hat: ['has', 'haben · Präsens (er/sie/es)'], haben: ['have', 'haben (wir/sie) / Hilfsverb'], habt: ['have', 'haben · Präsens (ihr)'],
    hatte: ['had', 'haben · Präteritum (ich/er)'], hatten: ['had', 'haben · Präteritum (wir/sie)'],
    werde: ['will', 'werden · Futur-Hilfsverb (ich)'], wirst: ['will', 'werden (du)'], wird: ['will / becomes', 'werden (er/sie/es)'], werden: ['will', 'werden (wir/sie)'],
    kann: ['can', 'Modalverb können (ich/er)'], kannst: ['can', 'können (du)'], können: ['can', 'können (wir/sie)'], muss: ['must', 'Modalverb müssen (ich/er)'], musst: ['must', 'müssen (du)'], müssen: ['must', 'müssen (wir/sie)'],
    will: ['want(s)', 'Modalverb wollen (ich/er)'], willst: ['want', 'wollen (du)'], möchte: ['would like', 'Modalverb möchten (ich/er)'], möchtest: ['would like', 'möchten (du)'], möchten: ['would like', 'möchten (wir/sie)'],
    darf: ['may', 'Modalverb dürfen'], soll: ['should', 'Modalverb sollen'], konnte: ['could', 'können · Präteritum'], musste: ['had to', 'müssen · Präteritum'], wollte: ['wanted', 'wollen · Präteritum']
  };
  const SUB = new Set(['weil', 'dass', 'ob', 'wenn', 'als', 'obwohl', 'damit', 'bevor', 'nachdem', 'während', 'bis', 'seit', 'sobald', 'falls', 'da']);
  const SUBJ = new Set(['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'man']);
  const HABEN = new Set(['habe', 'hast', 'hat', 'haben', 'habt']), SEIN = new Set(['bin', 'bist', 'ist', 'sind', 'seid']), WERDEN = new Set(['werde', 'wirst', 'wird', 'werden', 'werdet']);
  const MODAL = /^(kann|kannst|können|könnt|muss|musst|müssen|müsst|will|willst|wollen|wollt|möchte|möchtest|möchten|möchtet|darf|darfst|dürfen|dürft|soll|sollst|sollen|sollt)$/;
  const REFL = { ich: 'mich', du: 'dich', er: 'sich', sie: 'sich', es: 'sich', wir: 'uns', ihr: 'euch', man: 'sich' };
  const SEP = new Set(['an', 'auf', 'aus', 'ein', 'mit', 'zu', 'ab', 'vor', 'zurück', 'weg', 'los', 'fern', 'her', 'hin', 'fest', 'teil', 'nach', 'um', 'zusammen', 'weiter']);
  const PREP_CASE = { mit: 'Dativ', bei: 'Dativ', zu: 'Dativ', von: 'Dativ', aus: 'Dativ', nach: 'Dativ', seit: 'Dativ', für: 'Akkusativ', ohne: 'Akkusativ', durch: 'Akkusativ', gegen: 'Akkusativ', um: 'Akkusativ' };
  const WECHSEL = new Set(['in', 'an', 'auf', 'über', 'unter', 'vor', 'hinter', 'neben', 'zwischen']);
  // verbs with a fixed preposition: the case never changes (sprechen über + Akk, warten auf + Akk, träumen von + Dat …)
  const VP = { sprechen: { über: 'Akk', mit: 'Dat' }, reden: { über: 'Akk', mit: 'Dat' }, erzählen: { von: 'Dat', über: 'Akk' }, denken: { an: 'Akk' }, warten: { auf: 'Akk' },
    freuen: { auf: 'Akk', über: 'Akk' }, interessieren: { für: 'Akk' }, ärgern: { über: 'Akk' }, nachdenken: { über: 'Akk' }, träumen: { von: 'Dat' }, teilnehmen: { an: 'Dat' },
    fragen: { nach: 'Dat' }, suchen: { nach: 'Dat' }, bitten: { um: 'Akk' }, kümmern: { um: 'Akk' }, erinnern: { an: 'Akk' }, gewöhnen: { an: 'Akk' }, antworten: { auf: 'Akk' }, achten: { auf: 'Akk' }, lachen: { über: 'Akk' }, diskutieren: { über: 'Akk' } };
  /* WHY each rule exists — short, learner-friendly reasons (English; the rule names stay German) */
  const WHY = [
    [/Inversion|Verb auf Position 2|Aussagesatz/, 'German main clauses have a fixed slot for the conjugated verb: <b>position 2</b>. Position 1 is free — you put there what you want to stress (time, place, an object) — but the verb never leaves slot 2, so the subject has to move <b>behind</b> it. English says "Today <i>we meet</i>", German says "Heute <i>treffen wir</i>". (Tamil is free here, German is strict.)'],
    [/Nebensatz mit/, 'weil / dass / ob / wenn start a <b>side clause</b> that cannot stand alone. German marks such a clause by sending its verb to the <b>end</b> — exactly like Tamil, where the verb always comes last (…நான் உடம்பு சரியில்லாமல் <b>இருக்கிறேன்</b>).'],
    [/Nebensatz zuerst/, 'The whole side clause counts as <b>position 1</b> of the main sentence — so the main verb must come right after the comma (slot 2): "…, <b>bleibe</b> ich".'],
    [/Ja\/Nein-Frage/, 'Moving the verb to the front is the German <b>question signal</b> (like English "<i>Are</i> you…?", but German does it with every verb).'],
    [/W-Frage/, 'The question word takes position 1 — and the verb keeps its fixed slot 2.'],
    [/Perfekt/, 'German builds a <b>verb bracket</b> (Satzklammer): the helper verb (haben / sein) stays in slot 2 and the participle closes the sentence at the end — everything else sits inside. sein is used when you move from A to B or change state (gehen, fahren, einschlafen); all others — including reflexive verbs like sich freuen — use haben.'],
    [/Futur I/, 'Same bracket as the Perfekt: werden (slot 2) opens it, the infinitive closes it at the end. With a time word (morgen) German often just uses the present tense.'],
    [/Modalverb/, 'A modal verb (können, müssen, möchten …) takes slot 2 and pushes the main verb as an <b>infinitive to the end</b> — the verb bracket again.'],
    [/Präteritum von/, 'war / hatte are much shorter than "bin gewesen / habe gehabt", so Germans use them even when speaking.'],
    [/Präteritum:/, 'The simple past is the <b>written</b> past (books, news). In speaking, Germans mostly use the Perfekt.'],
    [/Trennbares Verb/, 'The prefix works like the English particle in "get <i>up</i>", "call <i>up</i>": it belongs to the verb, but in German it goes to the <b>end</b> of the bracket while the verb stays in slot 2.'],
    [/Reflexives Verb/, 'The action goes back to the <b>same person</b> (I make <i>myself</i> happy), so German needs the small word mich / dich / sich / uns / euch — it must match the subject.'],
    [/kein verneint/, 'kein = "nicht + ein" melted into one word — so you negate a noun with kein, never with "nicht ein".'],
    [/nicht verneint/, 'nicht negates actions and descriptions (verbs, adjectives, places); nouns with ein / no article use kein.'],
    [/fester Präposition/, 'This is <b>vocabulary</b>, not logic: the verb chooses its preposition and case. Learn them as a pair: sprechen über + Akk, warten auf + Akk, träumen von + Dat.'],
    [/Wechselpräposition/, 'These 9 prepositions can take both cases: movement <b>to a goal</b> (Wohin?) → Akkusativ; a <b>place</b> where something is (Wo?) → Dativ. The question Wo or Wohin decides.'],
    [/\+ (Dativ|Akkusativ)/, 'Each preposition "orders" a case: mit, bei, zu, von, aus, nach, seit → always Dativ; für, ohne, durch, gegen, um → always Akkusativ.'],
    [/zu \+ Infinitiv/, 'zu marks a "to-verb" (English "to speak"); like every second verb it closes the sentence at the end.'],
    [/Präsens/, 'Präsens = what happens now or regularly. German has no extra "-ing" form: „wir treffen uns“ = we meet / we are meeting. With a time word (morgen, nächste Woche) it also means the near future.']
  ];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const low = w => w.toLowerCase();

  /* ---------- word forms from js/lexicon.js (loaded once, on demand) ---------- */
  let FORMS = null, loading = null;
  function loadScript(src) { return new Promise(res => { const s = document.createElement('script'); s.src = src; s.onload = s.onerror = () => res(); document.head.appendChild(s); }); }
  function ready() {
    if (FORMS) return Promise.resolve();
    if (!loading) loading = (async () => {
      if (!window.DC_LEXICON) await loadScript('js/lexicon.js');
      if (typeof window.praesensPhrase !== 'function' && typeof praesensPhrase !== 'function') await loadScript('js/german-conjugation.js');
      const pp = typeof praesensPhrase === 'function' ? praesensPhrase : null, PER = typeof PERSONS !== 'undefined' ? PERSONS : ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie (Pl.)'];
      FORMS = new Map();
      const add = (f, e, label) => { const k = low(String(f || '').trim()); if (!k || k.includes(' ')) return; if (!FORMS.has(k)) FORMS.set(k, { e, label }); };
      (window.DC_LEXICON || []).forEach(e => {
        const base = e.w.replace(/^sich\s+/, '');
        if (e.c === 'v') {
          add(base, e, 'Infinitiv');
          if (e.pp) { const t = e.pp.split(' '); add(t[t.length - 1], e, 'Partizip II (Perfekt)'); }
          if (e.pr) add(e.pr.split(' ')[0], e, 'Präteritum');
          if (pp) PER.forEach(p => { try { const ph = pp(e.w, e.pr || '', p); add(ph.split(' ')[0], e, 'Präsens (' + p + ')'); } catch (x) {} });
        } else if (e.c === 'n') { add(e.w, e, 'Nomen' + (e.a ? ' (' + e.a + ')' : '')); if (e.pl && !/^[—-]$/.test(e.pl)) add(e.pl, e, 'Nomen · Plural'); }
        else if (e.c === 'adj') { add(e.w, e, 'Adjektiv'); if (e.komp) add(e.komp, e, 'Komparativ'); if (e.sup) add(e.sup.replace(/^am\s+/, ''), e, 'Superlativ'); }
        else add(e.w, e, '');
      });
    })();
    return loading;
  }
  const look = w => FORMS && (FORMS.get(low(w)) || null);
  const isPart = w => { const f = look(w); return (f && /Partizip/.test(f.label)) || /^(ge\w+(t|en)|\w+iert)$/i.test(w); };
  const isInf = w => { const f = look(w); return (f && f.label === 'Infinitiv') || (/en$/.test(w) && w === low(w) && !FUNC[low(w)]); };

  /* ---------- grammar points ---------- */
  function analyse(sentence) {
    const words = (sentence.match(/[\p{L}\p{N}-]+|[,.!?]/gu) || []);
    const toks = words.filter(w => /[\p{L}\p{N}]/u.test(w)), L = toks.map(low), pts = [], role = {};
    const q = /\?\s*$/.test(sentence);
    // clauses split at commas; a clause starting with weil/dass/… is a subordinate clause
    const clauses = []; let cur = [];
    words.forEach(w => { if (w === ',') { if (cur.length) clauses.push(cur); cur = []; } else if (/[\p{L}\p{N}]/u.test(w)) cur.push(w); });
    if (cur.length) clauses.push(cur);
    const main = clauses.find(c => !SUB.has(low(c[0]))) || clauses[0] || [];
    clauses.filter(c => SUB.has(low(c[0]))).forEach(c => {
      const last = c[c.length - 1];
      pts.push(`🔗 <b>Nebensatz mit „${esc(c[0])}“</b>: das konjugierte Verb steht am <b>Ende</b> („${esc(last)}“).`);
      role[low(last) + '|end'] = 'Verb am Ende (Nebensatz)';
    });
    if (clauses.length > 1 && SUB.has(low(clauses[0][0])) && main.length) pts.push(`↪️ <b>Nebensatz zuerst</b> → der Hauptsatz beginnt sofort mit dem Verb („${esc(main[0])} ${esc(main[1] || '')}“).`);
    const m0 = main.map(low);
    let finIdx = -1;
    if (q && main.length && !FUNC[m0[0]] || (q && /Präsens|Präteritum/.test((look(main[0]) || {}).label || ''))) { finIdx = 0; pts.push('❓ <b>Ja/Nein-Frage</b>: das Verb steht auf <b>Position 1</b>.'); }
    else if (q && FUNC[m0[0]] && FUNC[m0[0]][1] === 'Fragewort') { finIdx = 1; pts.push(`❓ <b>W-Frage</b>: „${esc(main[0])}“ auf Position 1, Verb auf <b>Position 2</b>.`); }
    else if (main.length > 1) {
      if (clauses.length > 1 && SUB.has(low(clauses[0][0]))) finIdx = 0;
      else {
        // position 1 can be several words (am Wochenende, meine Schwester): the finite verb is the first known verb form
        finIdx = m0.findIndex((w, i) => i > 0 && (HABEN.has(w) || SEIN.has(w) || WERDEN.has(w) || MODAL.test(w) || /^(war|waren|warst|hatte|hatten)$/.test(w) || /Präsens|Präteritum/.test((look(main[i]) || {}).label || '')
          || (/Infinitiv/.test((look(main[i]) || {}).label || '') && (/^(wir|sie|Sie)$/.test(main[i + 1] || '') || /^(wir|sie)$/.test(m0[i - 1] || '')))));   // wir/sie-form = infinitive (treffen wir)
        if (finIdx > 0) {
          const first = main.slice(0, finIdx).join(' ');
          if (SUBJ.has(m0[0]) && finIdx === 1) pts.push(`2️⃣ <b>Aussagesatz</b>: Subjekt „${esc(main[0])}“ – Verb „${esc(main[1])}“ auf <b>Position 2</b>.`);
          else if (SUBJ.has(m0[finIdx + 1])) pts.push(`2️⃣ <b>Inversion</b>: „${esc(first)}“ steht auf Position 1 → Verb „${esc(main[finIdx])}“ bleibt auf <b>Position 2</b>, das Subjekt „${esc(main[finIdx + 1])}“ kommt <b>danach</b>.`);
          else pts.push(`2️⃣ <b>Verb auf Position 2</b>: „${esc(first)}“ ist Position 1, dann „${esc(main[finIdx])}“.`);
        }
      }
    }
    const fin = finIdx >= 0 ? m0[finIdx] : '', last = main[main.length - 1] || '', lastL = low(last);
    const POS = finIdx === 0 ? 'Position 1' : 'Position 2';
    if (fin) role[fin + '|fin'] = finIdx === 0 ? 'Verb (Position 1)' : 'Verb (Position 2)';
    // tense / verb bracket
    if ((HABEN.has(fin) || SEIN.has(fin)) && main.length > 2 && isPart(last)) {
      const f = look(last), inf = f && f.e ? f.e.w : '';
      pts.push(`⏪ <b>Perfekt</b> mit <b>${HABEN.has(fin) ? 'haben' : 'sein'}</b>: „${esc(main[finIdx])}“ (${POS}) + Partizip II „${esc(last)}“ am <b>Ende</b>${inf ? ` (von ${esc(inf)})` : ''}. ${SEIN.has(fin) ? 'sein bei Bewegung / Zustandswechsel (fahren, gehen, kommen).' : 'Die meisten Verben – auch alle reflexiven – bilden das Perfekt mit haben.'}`);
      role[lastL + '|end'] = 'Partizip II (Satzende)';
    } else if (WERDEN.has(fin) && isInf(last)) { pts.push(`⏩ <b>Futur I</b>: „${esc(main[finIdx])}“ (werden, ${POS}) + Infinitiv „${esc(last)}“ am <b>Ende</b>.`); role[lastL + '|end'] = 'Infinitiv (Satzende)'; }
    else if (MODAL.test(fin) && isInf(last)) { pts.push(`💪 <b>Modalverb</b> „${esc(main[finIdx])}“ auf ${POS} + Infinitiv „${esc(last)}“ am <b>Ende</b> (Satzklammer).`); role[lastL + '|end'] = 'Infinitiv (Satzende)'; }
    else if (/^(war|waren|warst|hatte|hatten)$/.test(fin)) pts.push(`⏪ <b>Präteritum</b> von ${fin.startsWith('war') ? 'sein' : 'haben'} („${esc(main[finIdx])}“) — bei sein, haben und Modalverben sagt man das auch im Gespräch.`);
    else if (fin && /Präteritum/.test((look(main[finIdx]) || {}).label || '')) pts.push(`⏪ <b>Präteritum</b>: „${esc(main[finIdx])}“ (vor allem geschriebene Sprache; gesprochen meist Perfekt).`);
    else if (fin) pts.push(`▶️ <b>Präsens</b>: „${esc(main[finIdx])}“${/^(morgen|nächste|nächsten|am)$/.test(m0[0]) ? ' — mit Zeitwort für die Zukunft reicht Präsens.' : '.'}`);
    if (SEP.has(lastL) && main.length > 2 && fin && !HABEN.has(fin) && !SEIN.has(fin) && !WERDEN.has(fin) && !MODAL.test(fin) && !PREP_CASE[low(main[main.length - 2])]) {
      pts.push(`✂️ <b>Trennbares Verb</b>: die Vorsilbe „${esc(last)}“ steht am Ende, „${esc(main[finIdx])}“ auf Position 2 (${esc(lastL + (look(main[finIdx]) && look(main[finIdx]).e ? look(main[finIdx]).e.w.replace(/^sich\s+/, '') : '…'))}).`);
      role[lastL + '|end'] = 'Vorsilbe (trennbares Verb)';
    }
    // reflexive pronoun that matches the subject
    const subj = L.find(w => SUBJ.has(w));
    const refl = L.find(w => ['mich', 'dich', 'sich', 'uns', 'euch'].includes(w));
    if (refl && subj && REFL[subj] === refl) {
      const v = toks.map(look).find(f => f && f.e && /^sich /.test(f.e.w));
      pts.push(`🔄 <b>Reflexives Verb</b>${v ? ` (${esc(v.e.w)})` : ''}: das Pronomen passt zum Subjekt — ${esc(subj)} → <b>${esc(refl)}</b>.`);
    }
    if (L.includes('nicht')) pts.push('🚫 <b>nicht</b> verneint das Verb / Adjektiv / den Ort (kein Nomen).');
    if (L.some(w => /^kein(e|en|em|er)?$/.test(w))) pts.push('🚫 <b>kein</b> verneint ein Nomen (statt „nicht ein“).');
    const lemmas = toks.map(look).filter(f => f && f.e && f.e.c === 'v').map(f => f.e.w.replace(/^sich\s+/, ''));
    const fixedPrep = w => { for (const v of lemmas) if (VP[v] && VP[v][w]) return [v, VP[v][w]]; return null; };
    const snip = i => { const out = [toks[i]]; for (let k = i + 1; k < toks.length && out.length < 3 && !SUB.has(L[k]) && !/[,.]/.test(toks[k]) && !(L[k] === 'zu' && isInf(toks[k + 1] || '')); k++) out.push(toks[k]); return out.join(' '); };
    L.forEach((w, i) => {
      const nx = L[i + 1] || '';
      if (w === 'zu' && nx === 'hause') pts.push('🏠 <b>zu Hause</b> = at home (fester Ausdruck; nach Hause = home, Richtung).');
      else if (w === 'zu' && isInf(toks[i + 1] || '') && !PREP_CASE[L[i - 1]]) pts.push(`➡️ <b>zu + Infinitiv</b> „zu ${esc(toks[i + 1])}“ steht ganz am <b>Ende</b> (nach versuchen, anfangen, vergessen, Lust haben …).`);
      else if (fixedPrep(w) && nx) { const [v, c] = fixedPrep(w); pts.push(`🔗 <b>${esc(v)} ${esc(w)} + ${c === 'Akk' ? 'Akkusativ' : 'Dativ'}</b> (Verb mit fester Präposition — der Fall ändert sich nie): „${esc(snip(i))}“.`); }
      else if (PREP_CASE[w] && nx) pts.push(`🧭 <b>${esc(toks[i])} + ${PREP_CASE[w]}</b>: „${esc(snip(i))}“.`);
      else if (WECHSEL.has(w) && /^(den|die|das|dem|der|einen|einem|einer|eine|ein|meinen|meinem|meiner|meine|ins|im)$/.test(nx)) pts.push(`🧭 <b>${esc(toks[i])}</b> = Wechselpräposition: ${/^(dem|einem|meinem)$/.test(nx) || (nx === 'der' && i > 1) ? 'Wo? → <b>Dativ</b>' : /^(den|einen|meinen)$/.test(nx) ? 'Wohin? → <b>Akkusativ</b>' : 'Wo? → Dativ · Wohin? → Akkusativ'} („${esc(snip(i))}“).`);
      else if (w === 'im' || w === 'ins' || w === 'am' || w === 'zum' || w === 'zur' || w === 'beim' || w === 'vom') pts.push(`🔗 <b>${esc(toks[i])}</b> = ${esc(FUNC[w][1])}.`);
    });
    const withWhy = [...new Set(pts)].map(p => { const w = WHY.find(([re]) => re.test(p)); return w ? p + `<div class="dcx-why">🤔 <b>Warum?</b> ${w[1]}</div>` : p; });
    return { toks, pts: withWhy, role, finIdx: finIdx >= 0 ? toks.indexOf(main[finIdx]) : -1, subj };
  }

  function row(w, i, A) {
    const lw = low(w), f = FUNC[lw] || FUNC[w], lx = !f && look(w);
    let en = f ? f[0] : lx && lx.e ? String(lx.e.en || '').split(/[;]/)[0] : '', info = f ? f[1] : lx ? lx.label + (lx.e && lx.e.w && low(lx.e.w) !== lw ? ' von ' + lx.e.w : '') : '';
    if (i === A.finIdx) info = (info ? info + ' · ' : '') + '<b>' + (A.finIdx === 0 ? 'Position 1' : 'Position 2') + '</b>';
    if (A.finIdx > 0 && i < A.finIdx) info = (info ? info + ' · ' : '') + 'Position 1';
    if (i === A.toks.length - 1 && A.role[lw + '|end']) info = (info ? info + ' · ' : '') + '<b>' + A.role[lw + '|end'] + '</b>';
    if (lx && lx.e && lx.e.ta) en += ` <span class="dcx-ta" lang="ta">${esc(String(lx.e.ta).split(' (')[0])}</span>`;
    return `<tr><td><b>${esc(w)}</b></td><td>${en || '<span class="dcx-q">–</span>'}</td><td>${info}</td></tr>`;
  }
  function css() {
    if (document.getElementById('dcxCss')) return;
    const st = document.createElement('style'); st.id = 'dcxCss';
    st.textContent = `.dcx{margin-top:8px;border:1px solid var(--color-border,#ddd);border-radius:12px;padding:8px 12px;background:var(--color-bg,#f8fafc);color:var(--color-ink,#111);font-size:14px;line-height:1.5;text-align:left}
.dcx summary{cursor:pointer;font-weight:700}.dcx .dcx-s{font-size:16px;font-weight:800;margin:6px 0}.dcx ul{margin:4px 0 8px;padding-left:18px}.dcx li{margin:3px 0}
.dcx table{border-collapse:collapse;width:100%;font-size:13.5px}.dcx td{border-top:1px solid var(--color-border,#ddd);padding:4px 6px;vertical-align:top}.dcx td:first-child{white-space:nowrap}
.dcx-fb{border-color:#f59e0b !important}.dcx .dcx-mine{font-size:15px;margin-bottom:4px}.dcx .dcx-why{font-size:12.8px;color:var(--color-ink-soft,#555);margin:2px 0 4px;border-left:3px solid #f59e0b;padding-left:8px}.dcx .dcx-q{color:var(--color-ink-soft,#777)}.dcx .dcx-ta{color:var(--color-ink-soft,#666);font-size:12.5px;margin-left:4px}.dcx .dcx-scroll{overflow-x:auto}`;
    document.head.appendChild(st);
  }
  async function into(el, sentence, opts) {
    if (!el || !sentence) return;
    css();
    el.innerHTML = `<details class="dcx" ${opts && opts.closed ? '' : 'open'}><summary>🔎 Satz erklärt: Grammatik + Wort für Wort</summary><div class="dcx-b">⏳ …</div></details>`;
    await ready();
    const A = analyse(sentence);
    const b = el.querySelector('.dcx-b'); if (!b) return;
    b.innerHTML = `<div class="dcx-s">${esc(sentence)}</div>${A.pts.length ? `<div><b>Grammatik in diesem Satz:</b></div><ul>${A.pts.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
      <div><b>Wort für Wort:</b></div><div class="dcx-scroll"><table>${A.toks.map((w, i) => row(w, i, A)).join('')}</table></div>`;
  }
  /* ---------- word-order feedback for ANY sentence-making exercise (Task 71) ----------
     orderTips(got, target): which rule the learner's sentence breaks — missing / extra words, verb position,
     subject after the verb, reflexive pronoun, verb at the end of a weil/dass clause, 2nd verb part at the end. */
  const wordsOf = x => (Array.isArray(x) ? x.join(' ') : String(x || '')).match(/[\p{L}\p{N}-]+/gu) || [];
  function orderTips(got, target) {
    const G = wordsOf(got), T = wordsOf(target), g = G.map(low), t = T.map(low), tips = [];
    if (!G.length) return tips;
    const bag = a => a.slice().sort().join(' ');
    const miss = t.filter((w, i) => t.slice(0, i).filter(x => x === w).length >= g.filter(x => x === w).length);
    const extra = g.filter((w, i) => g.slice(0, i).filter(x => x === w).length >= t.filter(x => x === w).length);
    // a different word with the same beginning = wrong form (Endung, Artikel, Verbform)
    const pairs = []; miss.slice().forEach(m => { const cat = w => FUNC[w] && (/Artikel/.test(FUNC[w][1]) ? 'art' : /Possessiv/.test(FUNC[w][1]) ? 'pos' : /Subjekt|Pronomen|Akkusativ|Dativ|Reflexiv/.test(FUNC[w][1]) ? 'pro' : '');
    const k = miss.length > t.length / 2 ? -1 : extra.findIndex(x => (x.length > 3 && x.slice(0, 4) === m.slice(0, 4)) || (cat(x) && cat(x) === cat(m))); /* same stem or same word class (den/dem, mich/mir) */ if (k >= 0) { pairs.push([extra[k], m]); extra.splice(k, 1); miss.splice(miss.indexOf(m), 1); } });
    pairs.forEach(([x, m]) => tips.push(`✏️ <b>„${esc(x)}“ → „${esc(m)}“</b>: ${FUNC[m] ? esc(FUNC[m][1]) : 'andere Form (Endung / Verbform / Artikel)'}.`));
    if (miss.length) tips.push(`➕ Es fehlt: <b>${miss.map(esc).join(', ')}</b>.`);
    if (extra.length) tips.push(`➖ Nicht im Satz: ${extra.map(esc).join(', ')}.`);
    if (bag(g) !== bag(t) && (miss.length || extra.length)) return tips;          // wrong words first — order comes after
    const A = analyse(Array.isArray(target) ? T.join(' ') + '.' : String(target));
    const fi = A.finIdx, v = fi >= 0 ? t[fi] : '';
    if (v && g.indexOf(v) !== fi) {
      if (fi === 0) tips.push(`❓ In dieser Frage steht das Verb <b>„${esc(T[0])}“ ganz vorne</b> (Position 1).`);
      else if (SUB.has(t[0])) tips.push(`↪️ Der ganze Nebensatz „${esc(T.slice(0, fi).join(' '))}“ ist <b>Position 1</b> → danach kommt <b>sofort das Verb „${esc(T[fi])}“</b>, erst dann „${esc(T[fi + 1] || '')}“.`);
      else { const first = T.slice(0, fi).join(' '); tips.push(`2️⃣ Das Verb <b>„${esc(T[fi])}“</b> gehört auf <b>Position 2</b> — direkt nach „${esc(first)}“${g[fi] ? `, nicht „${esc(G[fi])}“` : ''}.${SUBJ.has(t[fi + 1]) && !SUBJ.has(t[0]) ? ` Das Subjekt „${esc(T[fi + 1])}“ kommt <b>danach</b>.` : ''}`); }
    } else if (fi > 0 && SUBJ.has(t[fi + 1]) && g[fi + 1] !== t[fi + 1]) tips.push(`👤 Nach dem Verb kommt das Subjekt: ${esc(T[fi])} <b>${esc(T[fi + 1])}</b> …`);
    // a weil/dass/seit … word opens a clause only at the start of the sentence or right after a comma (seit drei Jahren = preposition)
    const starts = new Set([0]); { let k = 0; String(Array.isArray(target) ? target.join(' ') : target).split(',').slice(0, -1).forEach(part => { k += wordsOf(part).length; starts.add(k); }); }
    const sub = t.findIndex((w, i) => SUB.has(w) && starts.has(i));
    if (sub >= 0) {
      let e = t.length - 1; for (let k = sub + 1; k < t.length; k++) { if (String(target).split(/\s+/).map(low)[k] && /,$/.test(String(target).split(/\s+/)[k] || '')) { e = k; break; } }
      const vEnd = t[e]; const gs = g.indexOf(t[sub]);
      if (gs >= 0 && g.indexOf(vEnd) !== e) tips.push(`🔗 Nach <b>„${esc(T[sub])}“</b> steht das Verb <b>„${esc(T[e])}“ am Ende</b> dieses Satzteils.`);
    }
    const refl = t.find(w => /^(mich|dich|sich|uns|euch)$/.test(w));
    if (refl && g.indexOf(refl) !== t.indexOf(refl)) tips.push(`🔄 Das Reflexivpronomen <b>„${esc(refl)}“</b> steht direkt nach dem Verb/Subjekt: „${esc(T.slice(Math.max(0, t.indexOf(refl) - 2), t.indexOf(refl) + 1).join(' '))}“.`);
    const last = t[t.length - 1], role = A.role[last + '|end'];
    if (role && g[g.length - 1] !== last && !(sub >= 0 && tips.some(x => x.includes('am Ende</b> dieses')))) tips.push(`🔚 <b>„${esc(T[T.length - 1])}“</b> (${esc(role.replace(/\s*\(.*\)/, ''))}) gehört ganz ans <b>Ende</b>.`);
    if (!tips.length) { const k = g.findIndex((w, i) => w !== t[i]); if (k >= 0) tips.push(`📍 An Stelle ${k + 1} gehört <b>„${esc(T[k])}“</b>, nicht „${esc(G[k])}“.`); }
    return tips;
  }
  function mineHTML(got, target) {
    const G = wordsOf(got), t = wordsOf(target).map(low);
    return G.map((w, k) => low(w) === t[k] ? esc(w) : `<b style="color:#dc2626;text-decoration:underline wavy;">${esc(w)}</b>`).join(' ');
  }
  /* full feedback: "Du hast …" + the broken rules + the explained correct sentence (grammar, Warum?, word by word) */
  async function feedbackInto(el, got, target, opts) {
    if (!el || !target) return;
    css(); await ready();
    const tips = wordsOf(got).length ? orderTips(got, target) : [];
    const head = wordsOf(got).length && !(opts && opts.noMine) ? `<div class="dcx-mine">Du hast: ${mineHTML(got, target)}</div>` : '';
    el.innerHTML = (head || tips.length ? `<div class="dcx dcx-fb">${head}${tips.length ? `<ul>${tips.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}</div>` : '') + '<div class="dcx-x"></div>';
    into(el.querySelector('.dcx-x'), String(target).trim(), opts);
  }
  function feedback(got, target, opts) { const id = 'dcx' + (++n); setTimeout(() => feedbackInto(document.getElementById(id), got, target, opts), 0); return `<div id="${id}"></div>`; }

  // convenience: returns a placeholder and fills it once it is in the page
  function html(sentence, opts) { const id = 'dcx' + (++n); setTimeout(() => into(document.getElementById(id), sentence, opts), 0); return `<div id="${id}"></div>`; }
  let n = 0;
  window.DCExplain = { into, html, feedback, feedbackInto, orderTips: (g, t) => ready().then(() => orderTips(g, t)), analyse: s => ready().then(() => analyse(s)), ready };
})();
