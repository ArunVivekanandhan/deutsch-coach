/* Konnektoren-Referenz (Task 79): one line per example that says WHY each verb stands where it stands.
   Works on the [connector] / {verb} markup of js/konnektoren-examples.js. Examples:
   "Weil der Bus nicht {kam}, {bin} ich zu spät zur Arbeit gekommen." →
   ① „Weil der Bus nicht kam,“ = der ganze Nebensatz ist Position 1 (Verb „kam“ am Ende) → ② „bin“ = Verb auf Position 2
   → ③ Subjekt „ich“ · Satzklammer „bin … gekommen“: Hilfsverb auf Position 2, Partizip II ans Ende.
   Markup: [connector] {conjugated verb} |second verb part at the clause end|. */
(function () {
  const PERF = ['habe', 'hast', 'hat', 'haben', 'habt', 'bin', 'bist', 'ist', 'sind', 'seid', 'war', 'waren', 'hatte', 'hatten', 'wurde', 'wurden', 'hätte', 'hätten', 'wäre', 'wären'];
  const MOD = ['muss', 'musst', 'müssen', 'musste', 'mussten', 'kann', 'kannst', 'können', 'konnte', 'konnten', 'darf', 'darfst', 'dürfen',
    'will', 'willst', 'wollen', 'wollte', 'möchte', 'möchtest', 'möchten', 'soll', 'sollst', 'sollen', 'werde', 'wirst', 'wird', 'werden'];
  const PART = ['an', 'ab', 'auf', 'aus', 'ein', 'mit', 'zu', 'los', 'vor', 'zurück'];
  const PRON = ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'man', 'Sie'];
  const ART = /^(der|die|das|den|dem|ein|eine|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|niemand)$/i;
  const w = t => t.replace(/[\[\]{}|]/g, '');
  const q = t => `„${t}“`;
  function note(de, g) {
    const T = de.match(/\[[^\]]+\]|\{[^}]+\}|\|[^|]+\||[^\s,.?!|]+|[,.?!]/g) || [];
    const isV = t => t[0] === '{', isC = t => t[0] === '[', isP = t => ',.?!'.includes(t);
    const ci = T.findIndex(isC); if (ci < 0 || g === 'grp4') return '';
    const end = i => { let j = i; while (j < T.length && !isP(T[j])) j++; return j; };
    const subj = i => { if (!T[i] || isP(T[i])) return ''; const a = w(T[i]), nx = T[i + 1] && !isP(T[i + 1]) ? w(T[i + 1]) : '';
      return ART.test(a) && /^[A-ZÄÖÜ]/.test(nx) ? a + ' ' + nx : PRON.includes(a) ? a : ART.test(a) && nx ? a + ' ' + nx : a; };   // „ihr Antrag“ vs. „ihr“
    /* |x| marks the second verb part at the clause end (Partizip II, Infinitiv or separable prefix) */
    const klammer = vi => {
      const e = end(vi), last = T[e - 1]; if (!last || last[0] !== '|') return '';
      const v = w(T[vi]), l = w(last), vl = v.toLowerCase();
      if (PERF.includes(vl) && !PART.includes(l.toLowerCase())) return ` · Satzklammer ${q(v + ' … ' + l)}: Hilfsverb auf Position 2, Partizip II ans Ende`;
      if (MOD.includes(vl)) return ` · Satzklammer ${q(v + ' … ' + l)}: ${/^(werde|wirst|wird|werden)$/.test(vl) ? 'werden' : 'Modalverb'} auf Position 2, Infinitiv ans Ende`;
      return ` · trennbares Verb ${q(v + ' … ' + l)}: Vorsilbe ans Ende`;
    };
    const C = w(T[ci]);
    if (g === 'grp1') {
      const sv = (() => { let j = end(ci) - 1; return isV(T[j]) ? w(T[j]) : ''; })();
      if (ci === 0) {                                       // Nebensatz first → it IS position 1
        const c = end(ci), vi = T.findIndex((t, i) => i > c && isV(t)); if (vi < 0) return '';
        const sub = T.slice(0, c).map(w).join(' ') + ',';
        return `① ${q(sub)} = der ganze Nebensatz ist Position 1 (Verb ${q(sv)} am Ende) → ② ${q(w(T[vi]))} = Verb auf Position 2 → ③ Subjekt ${q(subj(vi + 1))}${klammer(vi)}`;
      }
      return `Hauptsatz zuerst (normale Wortstellung) → ${q(C)}-Teil: konjugiertes Verb ${q(sv)} ganz am Ende`;
    }
    const vi = T.findIndex((t, i) => i > ci && isV(t)); if (vi < 0) return '';
    if (g === 'grp2') return `${q(C)} = Position 1 → ② Verb ${q(w(T[vi]))} sofort danach → ③ Subjekt ${q(subj(vi + 1))}${klammer(vi)}`;
    if (vi === ci + 1) return `${q(C)} = Position 0 → danach eine Frage: Verb ${q(w(T[vi]))} zuerst${klammer(vi)}`;
    const p1 = T.slice(ci + 1, vi).map(w).join(' ');
    return `${q(C)} = Position 0 (zählt nicht) → ① ${q(p1)} → ② Verb ${q(w(T[vi]))}${klammer(vi)}`;
  }
  window.DCKonnNote = note;
})();
