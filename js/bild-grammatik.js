/* Grammatik in Bildern (Task 67): grammar concepts as animated pictures.
   Two kinds of scene:
   · chips — a sentence as coloured word blocks that MOVE between frames (verb position 2, separable verb, modal,
     Perfekt, weil, questions). chip = [id, text, role, fromId?]; a chip keeps its id → it slides to its new place;
     fromId → a new chip flies out of that chip (auf out of aufstehen).
   · svg — emoji pictures in an SVG stage; .mv moves an object from (--fx, --fy) to its place, .bob keeps it moving,
     .pop pops it in, .dash animates an arrow (CSS in Bild_Grammatik.html).
   Every frame: de (sentence, read aloud), en, note (the rule in one line). Scene: rule in de / en / ta (Tamil 🤖).
   Checked by scripts/check_bild_grammatik.py. */
(function () {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // emoji at (x, y); cls: '', 'mv' (+ from dx/dy), 'bob', 'pop', 'fall'; size in px
  const E = (e, x, y, size, cls, from, extra) => `<text x="${x}" y="${y}" font-size="${size || 40}" text-anchor="middle" dominant-baseline="central" class="${cls || ''}"${from ? ` style="--fx:${from[0] - x}px;--fy:${from[1] - y}px"` : ''}${extra || ''}>${e}</text>`;
  const L = (t, x, y, color, size) => `<text x="${x}" y="${y}" font-size="${size || 13}" font-weight="700" text-anchor="middle" fill="${color || 'currentColor'}" class="lbl">${esc(t)}</text>`;
  const FLOOR = `<line x1="0" y1="186" x2="320" y2="186" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>`;
  const TABLE = (x, y, w) => `<g fill="#b45309"><rect x="${x}" y="${y}" width="${w}" height="9" rx="2"/><rect x="${x + 6}" y="${y + 9}" width="7" height="${186 - y - 9}"/><rect x="${x + w - 13}" y="${y + 9}" width="7" height="${186 - y - 9}"/></g>`;
  const ARROW = (x1, y1, x2, y2, color) => {           // stops ~28 px before the target so the arrowhead does not cover it
    const d = Math.hypot(x2 - x1, y2 - y1) || 1; x2 = Math.round(x2 - (x2 - x1) * 28 / d); y2 = Math.round(y2 - (y2 - y1) * 28 / d);
    return `<path d="M${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 40} ${x2} ${y2}" fill="none" stroke="${color || '#e11d48'}" stroke-width="3" stroke-dasharray="7 6" class="dash" marker-end="url(#bgArr)"/>`; };
  const DEFS = `<defs><marker id="bgArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#e11d48"/></marker></defs>`;
  const svg = inner => `<svg viewBox="0 0 320 200" class="stage-svg" role="img">${DEFS}${inner}</svg>`;

  /* ---------- the 9 two-way prepositions: Wohin? (movement → Akkusativ) vs Wo? (place → Dativ) ---------- */
  const PREPS = [
    { p: 'auf', en: 'on (top)', ta: 'மேல்', m: '🐱', to: [160, 98], from: [40, 165], back: TABLE(110, 120, 100), front: '',
      wohin: 'Die Katze springt auf den Tisch.', wohinEn: 'The cat jumps onto the table.', wohinX: 'Die Katze springt auf dem Tisch.',
      wo: 'Die Katze sitzt auf dem Tisch.', woEn: 'The cat is sitting on the table.', woX: 'Die Katze sitzt auf den Tisch.' },
    { p: 'unter', en: 'under', ta: 'கீழ்', m: '🐶', to: [160, 164], from: [30, 164], back: TABLE(105, 110, 110), front: '',
      wohin: 'Der Hund läuft unter den Tisch.', wohinEn: 'The dog runs under the table.', wohinX: 'Der Hund läuft unter dem Tisch.',
      wo: 'Der Hund liegt unter dem Tisch.', woEn: 'The dog is lying under the table.', woX: 'Der Hund liegt unter den Tisch.' },
    { p: 'über', en: 'above (not touching)', ta: 'மேலே (தொடாமல்)', m: '💡', to: [160, 62], from: [160, -30], back: TABLE(110, 120, 100) + `<line x1="160" y1="0" x2="160" y2="46" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/>`, front: '',
      wohin: 'Ich hänge die Lampe über den Tisch.', wohinEn: 'I hang the lamp above the table.', wohinX: 'Ich hänge die Lampe über dem Tisch.',
      wo: 'Die Lampe hängt über dem Tisch.', woEn: 'The lamp is hanging above the table.', woX: 'Die Lampe hängt über den Tisch.' },
    { p: 'neben', en: 'next to', ta: 'அருகில்', m: '🐶', to: [238, 166], from: [330, 166], back: E('🛋️', 125, 152, 78), front: '',
      wohin: 'Der Hund läuft neben das Sofa.', wohinEn: 'The dog runs next to the sofa.', wohinX: 'Der Hund läuft neben dem Sofa.',
      wo: 'Der Hund liegt neben dem Sofa.', woEn: 'The dog is lying next to the sofa.', woX: 'Der Hund liegt neben das Sofa.' },
    { p: 'vor', en: 'in front of', ta: 'முன்னால்', m: '🐕', to: [160, 166], from: [30, 166], back: `<rect x="118" y="40" width="84" height="146" rx="4" fill="#92400e"/><circle cx="188" cy="118" r="5" fill="#fbbf24"/>`, front: '',
      wohin: 'Der Hund läuft vor die Tür.', wohinEn: 'The dog runs in front of the door.', wohinX: 'Der Hund läuft vor der Tür.',
      wo: 'Der Hund sitzt vor der Tür.', woEn: 'The dog is sitting in front of the door.', woX: 'Der Hund sitzt vor die Tür.' },
    { p: 'hinter', en: 'behind', ta: 'பின்னால்', m: '🐱', to: [182, 122], from: [30, 166], back: '', front: E('🌳', 160, 120, 130),
      wohin: 'Die Katze läuft hinter den Baum.', wohinEn: 'The cat runs behind the tree.', wohinX: 'Die Katze läuft hinter dem Baum.',
      wo: 'Die Katze sitzt hinter dem Baum.', woEn: 'The cat is sitting behind the tree.', woX: 'Die Katze sitzt hinter den Baum.' },
    { p: 'zwischen', en: 'between', ta: 'இடையில்', m: '🐱', to: [160, 164], from: [160, 20], back: E('🪑', 92, 150, 64) + E('🪑', 228, 150, 64), front: '',
      wohin: 'Die Katze springt zwischen die Stühle.', wohinEn: 'The cat jumps between the chairs.', wohinX: 'Die Katze springt zwischen den Stühlen.',
      wo: 'Die Katze sitzt zwischen den Stühlen.', woEn: 'The cat is sitting between the chairs.', woX: 'Die Katze sitzt zwischen die Stühle.' },
    { p: 'in', en: 'in, inside', ta: 'உள்ளே', m: '🐱', to: [160, 136], from: [30, 166], back: `<rect x="115" y="120" width="90" height="66" fill="#d97706" opacity=".45"/>`, front: `<rect x="115" y="146" width="90" height="40" fill="#b45309"/><text x="160" y="170" font-size="12" text-anchor="middle" fill="#fff" font-weight="700">KARTON</text>`,
      wohin: 'Die Katze springt in den Karton.', wohinEn: 'The cat jumps into the box.', wohinX: 'Die Katze springt im Karton.',
      wo: 'Die Katze sitzt im Karton.', woEn: 'The cat is sitting in the box.', woX: 'Die Katze sitzt in den Karton.' },
    { p: 'an', en: 'on (a wall), at', ta: 'ஒட்டி (சுவரில்)', m: '🖼️', to: [160, 72], from: [60, 170], back: `<rect x="20" y="10" width="280" height="176" fill="#94a3b8" opacity=".25"/>`, front: '',
      wohin: 'Ich hänge das Bild an die Wand.', wohinEn: 'I hang the picture on the wall.', wohinX: 'Ich hänge das Bild an der Wand.',
      wo: 'Das Bild hängt an der Wand.', woEn: 'The picture is hanging on the wall.', woX: 'Das Bild hängt an die Wand.' }
  ];
  function prepSVG(pr, mode) {
    const moving = mode === 'wohin';
    const mover = moving ? E(pr.m, pr.to[0], pr.to[1], 42, 'mv', pr.from) : E(pr.m, pr.to[0], pr.to[1], 42, 'bob');
    const head = moving ? L('➡️ Wohin? → Akkusativ (Bewegung)', 160, 16, '#e11d48') : L('📍 Wo? → Dativ (Ort, keine Bewegung)', 160, 16, '#2563eb');
    return svg(FLOOR + pr.back + (moving ? ARROW(pr.from[0], pr.from[1], pr.to[0], pr.to[1]) : '') + mover + pr.front + head);
  }

  /* ---------- sentence-block scenes ---------- */
  const CHIPS = [
    { id: 'v2', icon: '2️⃣', level: 'A1', title: 'Das Verb steht auf Position 2', en: 'The verb is always in position 2', rule: 'r1_wordorder',
      de: 'Im Hauptsatz steht das konjugierte Verb immer auf Position 2. Steht etwas anderes auf Position 1 (Zeit, Ort), springt das Subjekt hinter das Verb.',
      en_rule: 'In a main clause the conjugated verb is always the 2nd element. If something else comes first (time, place), the subject jumps behind the verb.',
      ta: 'தமிழில் வினை கடைசியில் வரும்; ஜெர்மனில் முதன்மை வாக்கியத்தில் வினை எப்போதும் 2-ஆம் இடத்தில் இருக்கும்.',
      frames: [
        { chips: [['s', 'Ich', 'S'], ['v', 'gehe', 'V'], ['t', 'heute', 'T'], ['p', 'ins Kino', 'P']], de: 'Ich gehe heute ins Kino.', en: 'I am going to the cinema today.', note: 'Subject – VERB – time – place.' },
        { chips: [['t', 'Heute', 'T'], ['v', 'gehe', 'V'], ['s', 'ich', 'S'], ['p', 'ins Kino', 'P']], de: 'Heute gehe ich ins Kino.', en: 'Today I am going to the cinema.', note: 'Time comes first → the verb STAYS in position 2, "ich" jumps behind it.' },
        { chips: [['t', 'Am Wochenende', 'T'], ['v', 'gehe', 'V'], ['s', 'ich', 'S'], ['p', 'ins Kino', 'P']], de: 'Am Wochenende gehe ich ins Kino.', en: 'At the weekend I go to the cinema.', note: 'Position 1 can be long ("Am Wochenende") — it still counts as ONE position.' }] },
    { id: 'trennbar', icon: '✂️', level: 'A1', title: 'Trennbare Verben: die Vorsilbe springt ans Ende', en: 'Separable verbs: the prefix jumps to the end', rule: 'a1_trennbar',
      de: 'Bei trennbaren Verben (aufstehen, anrufen, einkaufen) steht der Verbteil auf Position 2 und die Vorsilbe ganz am Ende.',
      en_rule: 'With separable verbs (aufstehen, anrufen, einkaufen) the verb part is in position 2 and the prefix goes to the very end.',
      ta: 'aufstehen = auf + stehen: வாக்கியத்தில் "stehe" 2-ஆம் இடத்திலும் "auf" கடைசியிலும் செல்லும்.',
      frames: [
        { chips: [['s', 'Ich', 'S'], ['v', 'aufstehen', 'V'], ['t', 'um 7 Uhr', 'T']], de: 'aufstehen', en: 'to get up (infinitive)', note: 'aufstehen = auf + stehen — not a sentence yet.' },
        { chips: [['s', 'Ich', 'S'], ['v', 'stehe', 'V'], ['t', 'um 7 Uhr', 'T'], ['x', 'auf', 'V', 'v']], de: 'Ich stehe um 7 Uhr auf.', en: 'I get up at 7 o’clock.', note: '"stehe" stays in position 2, "auf" flies to the end.' },
        { chips: [['s', 'Ich', 'S'], ['v', 'rufe', 'V'], ['o', 'meine Mutter', 'O'], ['x', 'an', 'V']], de: 'Ich rufe meine Mutter an.', en: 'I call my mother.', note: 'anrufen: rufe … an. Same with einkaufen: Ich kaufe heute ein.' }] },
    { id: 'modal', icon: '💪', level: 'A1', title: 'Modalverb: der Infinitiv geht ans Ende', en: 'Modal verb: the infinitive goes to the end', rule: 'r16_modalverb',
      de: 'Mit können, müssen, wollen, möchten … steht das Modalverb auf Position 2, das zweite Verb (Infinitiv) ganz am Ende. Das ist die Satzklammer.',
      en_rule: 'With können, müssen, wollen, möchten … the modal verb is in position 2 and the second verb (infinitive) at the very end — the "sentence bracket".',
      ta: 'முதல் வினை (kann) 2-ஆம் இடம், இரண்டாவது வினை (kochen) கடைசியில் — தமிழ் போல இறுதியில் வினை!',
      frames: [
        { chips: [['s', 'Ich', 'S'], ['v', 'koche', 'V'], ['a', 'gut', 'X']], de: 'Ich koche gut.', en: 'I cook well.', note: 'One verb → position 2.' },
        { chips: [['s', 'Ich', 'S'], ['m', 'kann', 'V'], ['a', 'gut', 'X'], ['v', 'kochen', 'V']], de: 'Ich kann gut kochen.', en: 'I can cook well.', note: '"kann" takes position 2 — "kochen" moves to the end.' },
        { chips: [['s', 'Ich', 'S'], ['m', 'möchte', 'V'], ['t', 'heute', 'T'], ['o', 'Pizza', 'O'], ['v', 'essen', 'V']], de: 'Ich möchte heute Pizza essen.', en: 'I would like to eat pizza today.', note: 'Everything else goes BETWEEN the two verbs.' }] },
    { id: 'perfekt', icon: '⏪', level: 'A1', title: 'Perfekt: haben/sein … Partizip am Ende', en: 'Perfect tense: haben/sein … participle at the end', rule: 'a2_perfekt',
      de: 'Im Perfekt steht haben oder sein auf Position 2 und das Partizip (gegessen, gefahren) am Ende. Bewegung von A nach B → sein.',
      en_rule: 'In the perfect tense haben or sein is in position 2 and the participle (gegessen, gefahren) at the end. Movement from A to B → sein.',
      ta: 'Perfekt: habe/bin 2-ஆம் இடம், gegessen/gefahren கடைசியில். இடம் மாறும் இயக்கம் (fahren, gehen) → sein.',
      frames: [
        { chips: [['s', 'Ich', 'S'], ['v', 'esse', 'V'], ['o', 'Pizza', 'O']], de: 'Ich esse Pizza.', en: 'I eat pizza.', note: 'Present tense.' },
        { chips: [['s', 'Ich', 'S'], ['h', 'habe', 'V'], ['o', 'Pizza', 'O'], ['v', 'gegessen', 'V']], de: 'Ich habe Pizza gegessen.', en: 'I ate / have eaten pizza.', note: '"habe" in position 2, "gegessen" to the end.' },
        { chips: [['s', 'Ich', 'S'], ['h', 'bin', 'V'], ['o', 'nach Berlin', 'P'], ['v', 'gefahren', 'V']], de: 'Ich bin nach Berlin gefahren.', en: 'I went to Berlin.', note: 'Movement (fahren, gehen, fliegen) → sein: bin gefahren.' }] },
    { id: 'weil', icon: '🔗', level: 'A2', title: 'weil / dass: das Verb geht ans Ende', en: 'weil / dass: the verb goes to the end', rule: 'r9_connectors',
      de: 'Nach weil, dass, ob, wenn, obwohl steht das konjugierte Verb am Ende. Steht der Nebensatz vorne, kommt danach sofort das Verb des Hauptsatzes.',
      en_rule: 'After weil, dass, ob, wenn, obwohl the conjugated verb goes to the end. If that clause comes first, the main clause starts with its verb.',
      ta: 'weil (ஏனென்றால்) வந்தால் வினை கடைசிக்குச் செல்லும் — தமிழ் வாக்கியம் போலவே!',
      frames: [
        { chips: [['s1', 'Ich', 'S'], ['v1', 'bleibe', 'V'], ['p', 'zu Hause', 'P'], ['dot', '.', 'X'], ['s2', 'Ich', 'S'], ['v2', 'bin', 'V'], ['a', 'krank', 'X']], de: 'Ich bleibe zu Hause. Ich bin krank.', en: 'I am staying at home. I am ill.', note: 'Two main clauses.' },
        { chips: [['s1', 'Ich', 'S'], ['v1', 'bleibe', 'V'], ['p', 'zu Hause', 'P'], ['dot', ',', 'X'], ['k', 'weil', 'K'], ['s2', 'ich', 'S'], ['a', 'krank', 'X'], ['v2', 'bin', 'V']], de: 'Ich bleibe zu Hause, weil ich krank bin.', en: 'I am staying at home because I am ill.', note: '"weil" pushes "bin" to the END.' },
        { chips: [['k', 'Weil', 'K'], ['s2', 'ich', 'S'], ['a', 'krank', 'X'], ['v2', 'bin', 'V'], ['dot', ',', 'X'], ['v1', 'bleibe', 'V'], ['s1', 'ich', 'S'], ['p', 'zu Hause', 'P']], de: 'Weil ich krank bin, bleibe ich zu Hause.', en: 'Because I am ill, I am staying at home.', note: 'Clause first → "bin, bleibe": verb, comma, verb.' }] },
    { id: 'fragen', icon: '❓', level: 'A1', title: 'Fragen: das Verb nach vorne', en: 'Questions: the verb moves forward', rule: 'a1_fragen',
      de: 'Ja/Nein-Frage: das Verb steht auf Position 1. W-Frage: W-Wort auf Position 1, Verb auf Position 2.',
      en_rule: 'Yes/no question: the verb is in position 1. W-question: question word first, verb second.',
      ta: 'ஆம்/இல்லை கேள்வி: வினை முதலில். W-கேள்வி (Wo, Was, Wann): கேள்விச்சொல் முதலில், வினை இரண்டாவது.',
      frames: [
        { chips: [['s', 'Du', 'S'], ['v', 'wohnst', 'V'], ['p', 'in Berlin', 'P'], ['e', '.', 'X']], de: 'Du wohnst in Berlin.', en: 'You live in Berlin.', note: 'Statement.' },
        { chips: [['v', 'Wohnst', 'V'], ['s', 'du', 'S'], ['p', 'in Berlin', 'P'], ['e', '?', 'X']], de: 'Wohnst du in Berlin?', en: 'Do you live in Berlin?', note: 'Yes/no question → the verb jumps to position 1.' },
        { chips: [['w', 'Wo', 'K'], ['v', 'wohnst', 'V'], ['s', 'du', 'S'], ['e', '?', 'X']], de: 'Wo wohnst du?', en: 'Where do you live?', note: 'W-question → W-word first, verb second.' }] }
  ];

  /* ---------- picture scenes ---------- */
  const CLOCK = (h, m, ph, pm) => {           // hands rotate from the previous time (ph:pm) to h:m
    const ang = (hh, mm) => [((hh % 12) + mm / 60) * 30, mm * 6];
    const [a1, b1] = ang(ph == null ? h : ph, pm == null ? m : pm), [a2, b2] = ang(h, m);
    const ticks = Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return `<text x="${160 + 68 * Math.sin(a)}" y="${100 - 68 * Math.cos(a)}" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="currentColor">${i || 12}</text>`; }).join('');
    return svg(`<circle cx="160" cy="100" r="84" fill="none" stroke="currentColor" stroke-width="4"/>${ticks}
      <line x1="160" y1="100" x2="160" y2="56" stroke="#2563eb" stroke-width="7" stroke-linecap="round" class="hand" style="--from:${a1}deg;--to:${a2}deg"/>
      <line x1="160" y1="100" x2="160" y2="30" stroke="#e11d48" stroke-width="4" stroke-linecap="round" class="hand" style="--from:${b1 + (b2 < b1 ? -360 : 0)}deg;--to:${b2}deg"/>
      <circle cx="160" cy="100" r="6" fill="currentColor"/>`);
  };
  const WORD = ['zwölf', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];
  function timePhrase(h, m) {                // colloquial German time
    const n = WORD[h % 12 || 12], nx = WORD[(h % 12) + 1];
    const uhr = h % 12 === 1 ? 'ein' : n;
    return { 0: uhr + ' Uhr', 5: 'fünf nach ' + n, 10: 'zehn nach ' + n, 15: 'Viertel nach ' + n, 20: 'zwanzig nach ' + n, 25: 'fünf vor halb ' + nx,
      30: 'halb ' + nx, 35: 'fünf nach halb ' + nx, 40: 'zwanzig vor ' + nx, 45: 'Viertel vor ' + nx, 50: 'zehn vor ' + nx, 55: 'fünf vor ' + nx }[m];
  }
  const CLOCK_FRAMES = [[7, 0], [7, 15], [7, 30], [7, 45], [7, 10], [7, 25]];
  const TL = (i, p) => {                      // timeline: gestern · heute · morgen, the person walks to the marker
    const X = [60, 160, 260, 260], lab = ['gestern', 'heute', 'morgen / nächste Woche'];
    return svg(`<line x1="20" y1="150" x2="300" y2="150" stroke="currentColor" stroke-width="3" stroke-opacity=".5" marker-end="url(#bgArr)"/>
      ${[0, 1, 2].map(k => `<circle cx="${X[k]}" cy="150" r="7" fill="${k === Math.min(i, 2) ? '#e11d48' : 'currentColor'}" opacity="${k === Math.min(i, 2) ? 1 : .35}"/>${L(lab[k], X[k], 178, k === Math.min(i, 2) ? '#e11d48' : 'currentColor', 12)}`).join('')}
      ${E(['🚗', '🏙️', '🧳', '✈️'][i], X[i], 105, 46, 'mv', [X[p == null ? i : p], 105])}
      ${L(['Vergangenheit → Perfekt', 'Gegenwart → Präsens', 'Zukunft → Präsens + Zeitwort', 'Zukunft → werden + Infinitiv'][i], 160, 22, '#2563eb')}`);
  };
  const SCENES = [
    { id: 'wowohin', icon: '📦', level: 'A1–A2', title: 'Wo? oder Wohin? — die 9 Wechselpräpositionen', en: 'Where? or where to? — the 9 two-way prepositions', rule: 'r3_prepositions', type: 'prep',
      de: 'in, an, auf, über, unter, vor, hinter, neben, zwischen: Bewegung zu einem Ziel (Wohin?) → Akkusativ. Ort ohne Ortswechsel (Wo?) → Dativ.',
      en_rule: 'in, an, auf, über, unter, vor, hinter, neben, zwischen: movement to a goal (where to?) → accusative. A place, no change of place (where?) → dative.',
      ta: 'தமிழில் "மேஜைக்கு" (எங்கே செல்கிறது, -க்கு) ↔ "மேஜையில்" (எங்கே இருக்கிறது, -இல்). ஜெர்மனில்: Wohin → den/die/das, Wo → dem/der/dem.' },
    { id: 'geben', icon: '🎁', level: 'A2', title: 'Dativ und Akkusativ: wem? und was?', en: 'Dative and accusative: to whom? and what?', rule: 'r2_cases', type: 'svg',
      de: 'Die Person, die etwas bekommt (wem?), steht im Dativ. Die Sache (was?) steht im Akkusativ. Verben: geben, schenken, zeigen, bringen, schicken.',
      en_rule: 'The person who receives something (to whom?) is dative; the thing (what?) is accusative. Verbs: geben, schenken, zeigen, bringen, schicken.',
      ta: 'யாருக்கு (wem?) → Dativ (dem Kind); எதை (was?) → Akkusativ (den Ball). தமிழில் "-க்கு" மற்றும் "-ஐ" போல!',
      frames: [
        { svg: () => svg(FLOOR + E('🧑', 60, 140, 70) + E('👧', 262, 146, 58) + E('⚽', 228, 112, 34, 'mv', [96, 112]) + L('was? → den Ball (Akk.)', 160, 70, '#e11d48') + L('wem? → dem Kind (Dat.)', 236, 36, '#2563eb')),
          de: 'Ich gebe dem Kind den Ball.', en: 'I give the child the ball.', note: 'wem? dem Kind (Dativ) · was? den Ball (Akkusativ).' },
        { svg: () => svg(FLOOR + E('🧑', 60, 140, 70) + E('👩', 262, 140, 66) + E('💐', 226, 112, 38, 'mv', [96, 112]) + L('was? → Blumen (Akk.)', 160, 70, '#e11d48') + L('wem? → meiner Mutter (Dat.)', 222, 36, '#2563eb')),
          de: 'Ich schenke meiner Mutter Blumen.', en: 'I give my mother flowers.', note: 'die Mutter → meiner Mutter (Dativ, feminine).' },
        { svg: () => svg(FLOOR + E('🧑', 60, 140, 70) + E('🧔', 262, 140, 66) + E('📱', 226, 110, 34, 'mv', [96, 110]) + L('was? → das Foto (Akk.)', 160, 70, '#e11d48') + L('wem? → dir (Dat.)', 246, 36, '#2563eb')),
          de: 'Ich zeige dir das Foto.', en: 'I show you the photo.', note: 'du → dir (Dativ) · das Foto (Akkusativ = like the nominative for das).' }] },
    { id: 'reflexiv', icon: '🚿', level: 'A2', title: 'sich waschen: mich oder das Auto?', en: 'sich waschen: myself or the car?', rule: 'r10_reflexiv', type: 'svg',
      de: 'Reflexiv = die Handlung geht zurück zur Person: Ich wasche mich. Gibt es noch ein Objekt (die Hände), wird das Pronomen Dativ: Ich wasche mir die Hände.',
      en_rule: 'Reflexive = the action goes back to the person: Ich wasche mich. If there is another object (the hands), the pronoun becomes dative: Ich wasche mir die Hände.',
      ta: 'நான் காரைக் கழுவுகிறேன் (das Auto) ↔ நான் என்னைக் கழுவுகிறேன் (mich) ↔ நான் என் கைகளைக் கழுவுகிறேன் (mir die Hände).',
      frames: [
        { svg: () => svg(FLOOR + E('🧍', 60, 140, 76) + E('🚗', 250, 158, 64) + E('💧', 210, 130, 22, 'mv', [90, 110]) + E('💧', 225, 150, 22, 'mv', [90, 120]) + L('Akkusativ-Objekt: das Auto', 160, 30, '#e11d48')),
          de: 'Ich wasche das Auto.', en: 'I wash the car.', note: 'The action goes to something else → normal object.' },
        { svg: () => svg(FLOOR + E('🚿', 160, 40, 46) + E('💧', 150, 80, 20, 'fall') + E('💧', 172, 92, 20, 'fall', null, ' style="animation-delay:.5s"') + E('🧍', 160, 140, 80) + E('🔄', 232, 110, 34, 'spin') + L('sich → mich (Akk.)', 160, 196, '#2563eb')),
          de: 'Ich wasche mich.', en: 'I wash (myself).', note: 'The action comes back to me → mich.' },
        { svg: () => svg(FLOOR + E('🚰', 160, 50, 44) + E('💧', 160, 84, 20, 'fall') + E('🙌', 160, 128, 58, 'bob') + L('mir (Dat.) + die Hände (Akk.)', 160, 190, '#2563eb')),
          de: 'Ich wasche mir die Hände.', en: 'I wash my hands.', note: 'Extra object (die Hände) → the pronoun becomes dative: mir.' }] },
    { id: 'kein', icon: '🚫', level: 'A1', title: 'nicht oder kein?', en: 'nicht or kein?', rule: 'a1_negation', type: 'svg',
      de: 'kein verneint ein Nomen (ein Auto → kein Auto, Zeit → keine Zeit). nicht verneint alles andere: Verb, Adjektiv, Ort, Zeit.',
      en_rule: 'kein negates a noun (ein Auto → kein Auto, Zeit → keine Zeit). nicht negates everything else: verb, adjective, place, time.',
      ta: 'பெயர்ச்சொல் இல்லை → kein ("கார் இல்லை" = kein Auto). வினை/பண்பு இல்லை → nicht ("தூங்கவில்லை" = nicht schlafen).',
      frames: [
        { svg: () => svg(FLOOR + E('🚗', 160, 140, 90, 'bob') + L('ein Auto', 160, 40, '#16a34a', 16)), de: 'Ich habe ein Auto.', en: 'I have a car.', note: 'ein + Nomen.' },
        { svg: () => svg(FLOOR + E('🚗', 160, 140, 90) + E('❌', 160, 130, 110, 'pop') + L('ein Auto → kein Auto', 160, 40, '#e11d48', 16)), de: 'Ich habe kein Auto.', en: 'I don’t have a car.', note: 'Negating a NOUN → kein (not "nicht ein").' },
        { svg: () => svg(FLOOR + E('🛏️', 160, 150, 80) + E('😳', 150, 112, 46, 'bob') + E('💤', 215, 70, 36) + E('❌', 215, 70, 50, 'pop') + L('schlafen → nicht schlafen', 160, 30, '#e11d48', 16)), de: 'Ich schlafe nicht.', en: 'I am not sleeping.', note: 'Negating a VERB → nicht.' },
        { svg: () => svg(FLOOR + E('🍲', 160, 130, 86) + E('🌶️', 230, 80, 40) + E('❌', 230, 80, 54, 'pop') + L('scharf → nicht scharf', 160, 30, '#e11d48', 16)), de: 'Die Suppe ist nicht scharf.', en: 'The soup is not spicy.', note: 'Negating an ADJECTIVE → nicht.' }] },
    { id: 'zeit', icon: '🕰️', level: 'A1–A2', title: 'gestern · heute · morgen', en: 'yesterday · today · tomorrow', rule: 'a2_perfekt', type: 'svg',
      de: 'Vergangenheit: Perfekt (bin gefahren, habe gegessen). Gegenwart: Präsens. Zukunft: Präsens + Zeitwort (morgen fahre ich) oder werden + Infinitiv.',
      en_rule: 'Past: Perfekt (bin gefahren, habe gegessen). Present: Präsens. Future: present + time word (morgen fahre ich) or werden + infinitive.',
      ta: 'நேற்று போனேன் (bin gefahren) · இன்று இருக்கிறேன் (bin) · நாளை போவேன் (fahre morgen / werde fahren).',
      frames: [
        { svg: p => TL(0, p), de: 'Gestern bin ich nach Chennai gefahren.', en: 'Yesterday I went to Chennai.', note: 'Past → Perfekt: bin … gefahren.' },
        { svg: p => TL(1, p), de: 'Heute bin ich in Chennai.', en: 'Today I am in Chennai.', note: 'Present → Präsens: bin.' },
        { svg: p => TL(2, p), de: 'Morgen fahre ich nach Berlin.', en: 'Tomorrow I am going to Berlin.', note: 'Future with a time word → Präsens is enough.' },
        { svg: p => TL(3, p), de: 'Nächste Woche werde ich nach Berlin fahren.', en: 'Next week I will go to Berlin.', note: 'Future → werden (position 2) + infinitive at the end.' }] },
    { id: 'uhr', icon: '⏰', level: 'A1', title: 'Die Uhrzeit (Achtung: halb acht = 7:30!)', en: 'Telling the time (careful: halb acht = 7:30!)', rule: 'a1_zahlen_zeit', type: 'svg',
      de: 'Viertel nach / Viertel vor, und „halb“ zählt zur NÄCHSTEN Stunde: 7:30 = halb acht. Offiziell: sieben Uhr dreißig.',
      en_rule: 'Viertel nach / Viertel vor — and "halb" counts towards the NEXT hour: 7:30 = halb acht ("half to eight"). Officially: sieben Uhr dreißig.',
      ta: '7:30 = "halb acht" (எட்டுக்கு அரை மணி முன்) — ஆங்கில "half past seven" போல அல்ல!',
      frames: CLOCK_FRAMES.map(([h, m], i) => ({ svg: () => CLOCK(h, m, i ? CLOCK_FRAMES[i - 1][0] : null, i ? CLOCK_FRAMES[i - 1][1] : null),
        de: 'Es ist ' + timePhrase(h, m) + '.', en: `It is ${h}:${String(m).padStart(2, '0')}.`,
        note: m === 30 ? 'halb ACHT = 7:30 — half way TO eight.' : m === 25 ? '7:25 = five before half eight.' : m === 15 ? '7:15 = a quarter past seven.' : m === 45 ? '7:45 = a quarter to eight.' : m === 0 ? '7:00' : '7:10 = ten past seven.' })) },
    { id: 'komparativ', icon: '📏', level: 'A1–A2', title: 'groß · größer · am größten', en: 'big · bigger · biggest', rule: 'a2_komparation', type: 'svg',
      de: 'Komparativ: + er (größer, schneller). Superlativ: am … -sten (am größten). Kurze Wörter mit a/o/u bekommen oft einen Umlaut. gut → besser → am besten.',
      en_rule: 'Comparative: + er (größer, schneller). Superlative: am … -sten (am größten). Short words with a/o/u often get an umlaut. gut → besser → am besten.',
      ta: 'பெரிய → இன்னும் பெரிய → மிகப் பெரிய: groß → größer → am größten.',
      frames: [
        { svg: () => svg(FLOOR + E('🌲', 70, 162, 40, 'grow') + E('🌲', 160, 142, 80, 'grow', null, ' style="animation-delay:.4s"') + E('🌲', 250, 112, 140, 'grow', null, ' style="animation-delay:.8s"') + L('groß', 70, 198, '', 13) + L('größer', 160, 198, '', 13) + L('am größten', 250, 198, '#e11d48', 13)),
          de: 'Der Baum ist groß, der zweite ist größer, der dritte ist am größten.', en: 'The tree is big, the second is bigger, the third is the biggest.', note: 'groß → größer → am größten (umlaut, no -e- after ß).' },
        { svg: () => svg(FLOOR + E('👍', 70, 150, 40, 'grow') + E('👍👍', 160, 150, 40, 'grow', null, ' style="animation-delay:.4s"') + E('🏆', 250, 136, 80, 'grow', null, ' style="animation-delay:.8s"') + L('gut', 70, 198, '', 13) + L('besser', 160, 198, '', 13) + L('am besten', 250, 198, '#e11d48', 13)),
          de: 'Gut, besser, am besten!', en: 'Good, better, best!', note: 'gut is irregular: besser, am besten.' },
        { svg: () => svg(FLOOR + E('🐢', 70, 160, 46, 'move') + E('🚲', 160, 158, 50, 'move') + E('🚀', 250, 130, 70, 'fly') + L('schnell', 70, 198, '', 13) + L('schneller', 160, 198, '', 13) + L('am schnellsten', 250, 198, '#e11d48', 13)),
          de: 'Das Fahrrad ist schneller als die Schildkröte.', en: 'The bike is faster than the tortoise.', note: 'Comparison with "als": schneller als …' }] }
  ];

  /* ---------- picture quiz (question = picture + English, answer = German sentence) ---------- */
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function quizItem() {
    const kind = pick(['prep', 'prep', 'prep', 'uhr', 'zeit', 'geben', 'reflexiv', 'kein']);
    if (kind === 'prep') {
      const pr = pick(PREPS), mode = Math.random() < .5 ? 'wohin' : 'wo', other = pick(PREPS.filter(x => x !== pr));
      return { svg: prepSVG(pr, mode), en: pr[mode + 'En'], answer: pr[mode], options: [pr[mode], pr[mode + 'X'], other[mode]],
        why: (mode === 'wohin' ? 'Movement to a goal (Wohin?) → Akkusativ: ' : 'A place, no movement (Wo?) → Dativ: ') + pr[mode] };
    }
    if (kind === 'uhr') {
      const h = 1 + Math.floor(Math.random() * 11), m = pick([0, 15, 30, 45, 10, 20, 25, 50]), right = timePhrase(h, m);
      const trap = m === 30 ? 'halb ' + WORD[h % 12 || 12] : m === 15 ? 'Viertel vor ' + WORD[(h % 12) + 1] : m === 45 ? 'Viertel nach ' + WORD[h % 12 || 12] : timePhrase(h, (m + 30) % 60);
      const other = timePhrase((h % 12) + 1, m);
      return { svg: CLOCK(h, m), en: `What time is it? (${h}:${String(m).padStart(2, '0')})`, answer: 'Es ist ' + right + '.', options: ['Es ist ' + right + '.', 'Es ist ' + trap + '.', 'Es ist ' + other + '.'],
        why: 'halb = half TO the next hour; Viertel nach = quarter past; Viertel vor = quarter to.' };
    }
    if (kind === 'zeit') {
      const i = Math.floor(Math.random() * 3), W = ['Gestern', 'Heute', 'Morgen'][i], places = ['nach Chennai', 'in Chennai', 'nach Berlin'];
      const opts = [[`${W} bin ich nach Chennai gefahren.`, `${W} fahre ich nach Chennai.`, `${W} werde ich nach Chennai fahren.`],
        [`${W} bin ich in Chennai.`, `${W} war ich in Chennai gewesen.`, `${W} werde ich in Chennai gewesen.`],
        [`${W} fahre ich nach Berlin.`, `${W} bin ich nach Berlin gefahren.`, `${W} ich fahre nach Berlin.`]][i];
      return { svg: TL(i), en: ['Yesterday I went to Chennai.', 'Today I am in Chennai.', 'Tomorrow I am going to Berlin.'][i], answer: opts[0], options: opts,
        why: ['Past → Perfekt: bin … gefahren.', 'Present → Präsens.', 'Future with a time word → Präsens; the verb stays in position 2.'][i] };
    }
    const sc = SCENES.find(s => s.id === kind), k = Math.floor(Math.random() * sc.frames.length), f = sc.frames[k];
    const WRONG = { geben: [['Ich gebe das Kind den Ball.', 'Ich gebe dem Kind dem Ball.'], ['Ich schenke meine Mutter Blumen.', 'Ich schenke meiner Mutter den Blumen.'], ['Ich zeige dich das Foto.', 'Ich zeige dir dem Foto.']],
      reflexiv: [['Ich wasche mich das Auto.', 'Ich wasche mir das Auto.'], ['Ich wasche mir.', 'Ich wasche ich.'], ['Ich wasche mich die Hände.', 'Ich wasche meine Hände mich.']],
      kein: [['Ich habe kein ein Auto.', 'Ich habe nicht Auto.'], ['Ich habe nicht ein Auto.', 'Ich habe nicht Auto.'], ['Ich schlafe kein.', 'Ich nicht schlafe.'], ['Die Suppe ist kein scharf.', 'Die Suppe nicht ist scharf.']] }[kind][k];
    return { svg: f.svg(), en: f.en, answer: f.de, options: [f.de, ...WRONG], why: f.note };
  }
  window.DC_BILD = { CHIPS, SCENES, PREPS, prepSVG, timePhrase, quizItem, shuffle };
})();
