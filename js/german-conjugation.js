/* German conjugation helpers shared by Thema_Sprech_Trainer.html and
   Deutsch_Wortschatz_Excel_Sheet.html (moved out of Thema_Sprech_Trainer.html unchanged).
   Präsens is derived from the infinitive; separable prefixes and "sich" are taken from the
   Präteritum field (e.g. "nahm ab", "bemühte sich"), which keeps them in the same position. */

const PERSONS = ['ich','du','er/sie/es','wir','ihr','sie (Pl.)'];
const SUBJ = {'ich':'Ich','du':'Du','er/sie/es':'Er','wir':'Wir','ihr':'Ihr','sie (Pl.)':'Sie'};
const REFLEXIVE_PRONOUN = {'ich':'mich','du':'dich','er/sie/es':'sich','wir':'uns','ihr':'euch','sie (Pl.)':'sich'};

const HABEN = {'ich':'habe','du':'hast','er/sie/es':'hat','wir':'haben','ihr':'habt','sie (Pl.)':'haben'};
const SEIN = {'ich':'bin','du':'bist','er/sie/es':'ist','wir':'sind','ihr':'seid','sie (Pl.)':'sind'};

// Fully irregular Praesens tables (bare, unprefixed forms).
const IRREGULAR_PRAES = {
  'sein':   {'ich':'bin','du':'bist','er/sie/es':'ist','wir':'sind','ihr':'seid','sie (Pl.)':'sind'},
  'haben':  {'ich':'habe','du':'hast','er/sie/es':'hat','wir':'haben','ihr':'habt','sie (Pl.)':'haben'},
  'werden': {'ich':'werde','du':'wirst','er/sie/es':'wird','wir':'werden','ihr':'werdet','sie (Pl.)':'werden'},
  'wissen': {'ich':'weiß','du':'weißt','er/sie/es':'weiß','wir':'wissen','ihr':'wisst','sie (Pl.)':'wissen'},
  'tun':    {'ich':'tue','du':'tust','er/sie/es':'tut','wir':'tun','ihr':'tut','sie (Pl.)':'tun'},
  'mögen':  {'ich':'mag','du':'magst','er/sie/es':'mag','wir':'mögen','ihr':'mögt','sie (Pl.)':'mögen'},
  'wollen': {'ich':'will','du':'willst','er/sie/es':'will','wir':'wollen','ihr':'wollt','sie (Pl.)':'wollen'},
  'können': {'ich':'kann','du':'kannst','er/sie/es':'kann','wir':'können','ihr':'könnt','sie (Pl.)':'können'},
  'müssen': {'ich':'muss','du':'musst','er/sie/es':'muss','wir':'müssen','ihr':'müsst','sie (Pl.)':'müssen'},
  'dürfen': {'ich':'darf','du':'darfst','er/sie/es':'darf','wir':'dürfen','ihr':'dürft','sie (Pl.)':'dürfen'},
  'sollen': {'ich':'soll','du':'sollst','er/sie/es':'soll','wir':'sollen','ihr':'sollt','sie (Pl.)':'sollen'}
};

// Known present-tense stem-changing strong verbs (bare, unprefixed du/er forms).
// Matched against the (prefix-stripped) infinitive by longest suffix, so
// prefixed/compound verbs (aufgeben, vergessen, besprechen, ...) inherit the
// same pattern as their base verb.
const STEM_CHANGE_BASES = {
  // e -> i
  'helfen':   {du:'hilfst', er:'hilft'},
  'nehmen':   {du:'nimmst', er:'nimmt'},
  'geben':    {du:'gibst',  er:'gibt'},
  'sprechen': {du:'sprichst', er:'spricht'},
  'treffen':  {du:'triffst', er:'trifft'},
  'werfen':   {du:'wirfst', er:'wirft'},
  'brechen':  {du:'brichst', er:'bricht'},
  'essen':    {du:'isst',   er:'isst'},
  'fressen':  {du:'frisst', er:'frisst'},
  'messen':   {du:'misst',  er:'misst'},
  'treten':   {du:'trittst', er:'tritt'},
  'sterben':  {du:'stirbst', er:'stirbt'},
  'verderben':{du:'verdirbst', er:'verdirbt'},
  'gelten':   {du:'giltst', er:'gilt'},
  'erschrecken': {du:'erschrickst', er:'erschrickt'},
  // e -> ie
  'lesen':    {du:'liest',  er:'liest'},
  'sehen':    {du:'siehst', er:'sieht'},
  'befehlen': {du:'befiehlst', er:'befiehlt'},
  'empfehlen':{du:'empfiehlst', er:'empfiehlt'},
  'stehlen':  {du:'stiehlst', er:'stiehlt'},
  'geschehen':{du:'geschiehst', er:'geschieht'},
  // a -> ä
  'fahren':   {du:'fährst', er:'fährt'},
  'schlafen': {du:'schläfst', er:'schläft'},
  'tragen':   {du:'trägst', er:'trägt'},
  'waschen':  {du:'wäschst', er:'wäscht'},
  'lassen':   {du:'lässt',  er:'lässt'},
  'fangen':   {du:'fängst', er:'fängt'},
  'halten':   {du:'hältst', er:'hält'},
  'raten':    {du:'rätst',  er:'rät'},
  'braten':   {du:'brätst', er:'brät'},
  'fallen':   {du:'fällst', er:'fällt'},
  'schlagen': {du:'schlägst', er:'schlägt'},
  'wachsen':  {du:'wächst', er:'wächst'},
  'laden':    {du:'lädst',  er:'lädt'},
  'graben':   {du:'gräbst', er:'gräbt'},
  'backen':   {du:'bäckst', er:'bäckt'},
  'empfangen':{du:'empfängst', er:'empfängt'},
  'blasen':   {du:'bläst',  er:'bläst'},
  // au -> äu
  'laufen':   {du:'läufst', er:'läuft'},
  'saufen':   {du:'säufst', er:'säuft'},
  // o -> ö
  'stoßen':   {du:'stößt',  er:'stößt'}
};

// Applies the standard regular person-endings to a bare verb stem, with
// d/t-epenthesis, s/ß/z/x/tz-ending contraction, and -eln e-drop for ich.
function regularEndingForm(stem, person){
  const epenthetic = /[dt]$/.test(stem);
  const sibilant = /[sßzx]$/.test(stem) || stem.endsWith('tz');
  switch(person){
    case 'ich':
      if (/[^aeiouäöüAEIOUÄÖÜ]el$/.test(stem)) return stem.slice(0,-2) + 'le';
      return stem + 'e';
    case 'du': return stem + (epenthetic ? 'est' : (sibilant ? 't' : 'st'));
    case 'er/sie/es': return stem + (epenthetic ? 'et' : 't');
    case 'wir': return stem + 'en';
    case 'ihr': return stem + (epenthetic ? 'et' : 't');
    case 'sie (Pl.)': return stem + 'en';
  }
}

function praeteritumWordForm(ichForm, person){
  if (person === 'ich' || person === 'er/sie/es') return ichForm;
  if (ichForm.endsWith('e')) {
    // Weak/mixed '-te' forms AND the rare bare-vowel case (werden's
    // 'wurde') - both already end in a vowel, so no epenthesis is needed.
    if (person === 'du') return ichForm + 'st';
    if (person === 'wir' || person === 'sie (Pl.)') return ichForm + 'n';
    if (person === 'ihr') return ichForm + 't';
  } else {
    const epDu = /[dtsßzx]$/.test(ichForm);
    const epIhr = /[dt]$/.test(ichForm);
    if (person === 'du') return ichForm + (epDu ? 'est' : 'st');
    if (person === 'wir' || person === 'sie (Pl.)') return ichForm + 'en';
    if (person === 'ihr') return ichForm + (epIhr ? 'et' : 't');
  }
}

function substituteReflexive(words, person){
  const idx = words.indexOf('sich');
  if (idx === -1) return words;
  const copy = words.slice();
  copy[idx] = REFLEXIVE_PRONOUN[person];
  return copy;
}

function matchTableSuffix(token, table){
  let best = null;
  for (const key in table) {
    if (token.endsWith(key) && (!best || key.length > best.length)) best = key;
  }
  return best;
}

// Praesens is always derived from the INFINITIVE (never from the given
// Praeteritum field, whose stem may be ablauted for strong/mixed verbs).
// `restWords` (the words after the first one in the Praeteritum field, e.g.
// ['ab'] for 'nahm ab', or ['eine','Verbindung','her'] for 'stellte eine
// Verbindung her') tells us which trailing word - if any - is the separable
// prefix, since German keeps that same word/position across Praesens and
// Praeteritum. If the infinitive's last token starts with that trailing
// word, we strip it before conjugating and let the caller re-append
// restWords verbatim; otherwise the token is treated as a single (possibly
// inseparably-prefixed) unit.
// Entries like "führen zu", "achten auf", "zwingen zu etw.", "wegschmeißen (ugs.)" carry the
// governed preposition / a placeholder / a note after the verb; the verb is what's left.
const GOVERNED_PREPOSITIONS = new Set(['zu','auf','von','über','für','mit','an','in','um','aus','bei','nach','vor','gegen']);
const INFINITIVE_FILLER = new Set(['etw.','etw','etwas','jmdn.','jmdm.','jmdn','jmdm','jemanden','jemandem']);
function verbCoreInfinitive(inf){
  const toks = inf.replace(/\([^)]*\)/g, ' ').trim().split(/\s+/);
  while (toks.length > 1 && (GOVERNED_PREPOSITIONS.has(toks[toks.length - 1]) || INFINITIVE_FILLER.has(toks[toks.length - 1]))) toks.pop();
  return toks.join(' ');
}
// praetMain (optional): first word of the Präteritum. A weak "-te" Präteritum means the verb
// is weak, so the stem-change table must not fire on a lookalike ending
// (schalten is not halten, beauftragen is not tragen, veranlassen is not lassen).
function praesensWordForm(inf, restWords, person, praetMain){
  const lastTok = verbCoreInfinitive(inf).split(' ').pop();
  let workingTok = lastTok;
  let separated = false;
  if (restWords.length > 0) {
    const lastRest = restWords[restWords.length - 1];
    if (lastRest && lastTok.startsWith(lastRest) && lastTok.length > lastRest.length) {
      workingTok = lastTok.slice(lastRest.length);
      separated = true;
    }
  }

  let key = IRREGULAR_PRAES[workingTok] ? workingTok : matchTableSuffix(workingTok, IRREGULAR_PRAES);
  if (key) {
    const form = IRREGULAR_PRAES[key][person];
    if (separated || key === workingTok) return form;
    return workingTok.slice(0, workingTok.length - key.length) + form;
  }

  const weakPraet = !!praetMain && /te$/.test(praetMain);
  if ((person === 'du' || person === 'er/sie/es') && !weakPraet) {
    const scKey = matchTableSuffix(workingTok, STEM_CHANGE_BASES);
    if (scKey) {
      const form = STEM_CHANGE_BASES[scKey][person === 'du' ? 'du' : 'er'];
      if (separated || scKey === workingTok) return form;
      return workingTok.slice(0, workingTok.length - scKey.length) + form;
    }
  }

  // Fully regular fallback - correctly covers true weak verbs, mixed verbs
  // (denken, bringen, kennen, nennen, senden: irregular Praeteritum stem
  // but fully regular Praesens), and non-stem-changing strong verbs alike,
  // since it always works from the infinitive.
  const stem = workingTok.endsWith('en') ? workingTok.slice(0, -2) : workingTok.slice(0, -1);
  return regularEndingForm(stem, person);
}


// Plain "fährt ab" / "bemüht sich" Präsens phrase for one person (no subject, no HTML).
function praesensPhrase(inf, praeteritumField, person){
  const words = (praeteritumField || '').split(' ');
  const restRaw = words.slice(1);
  return [praesensWordForm(inf, restRaw, person, words[0]), ...substituteReflexive(restRaw, person)].join(' ');
}
