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
  /* phrases in German and English (Task 81) — note(de, g, 'en') for the English UI */
  const P = {
    de: { perf: 'Satzklammer {x}: Hilfsverb auf Position 2, Partizip II ans Ende', mod: 'Satzklammer {x}: Modalverb auf Position 2, Infinitiv ans Ende',
          wer: 'Satzklammer {x}: werden auf Position 2, Infinitiv ans Ende', sep: 'trennbares Verb {x}: Vorsilbe ans Ende',
          front: '① {sub} = der ganze Nebensatz ist Position 1 (Verb {sv} am Ende) → ② {v} = Verb auf Position 2 → ③ Subjekt {s}',
          back: 'Hauptsatz zuerst (normale Wortstellung) → {c}-Teil: konjugiertes Verb {sv} ganz am Ende',
          p1: '{c} = Position 1 → ② Verb {v} sofort danach → ③ Subjekt {s}', q0: '{c} = Position 0 → danach eine Frage: Verb {v} zuerst',
          p0: '{c} = Position 0 (zählt nicht) → ① {p} → ② Verb {v}' },
    en: { perf: 'sentence bracket {x}: auxiliary in position 2, past participle at the end', mod: 'sentence bracket {x}: modal verb in position 2, infinitive at the end',
          wer: 'sentence bracket {x}: werden in position 2, infinitive at the end', sep: 'separable verb {x}: prefix goes to the end',
          front: '① {sub} = the whole subordinate clause is position 1 (verb {sv} at its end) → ② {v} = verb in position 2 → ③ subject {s}',
          back: 'Main clause first (normal word order) → {c} clause: conjugated verb {sv} at the very end',
          p1: '{c} = position 1 → ② verb {v} right after it → ③ subject {s}', q0: '{c} = position 0 → then a question: verb {v} first',
          p0: '{c} = position 0 (does not count) → ① {p} → ② verb {v}' }
  };
  const fill = (t, o) => t.replace(/\{(\w+)\}/g, (_, k) => o[k]);
  function note(de, g, lang) {
    const L = P[lang === 'en' ? 'en' : 'de'];
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
      const x = q(v + ' … ' + l);
      if (PERF.includes(vl) && !PART.includes(l.toLowerCase())) return ' · ' + fill(L.perf, { x });
      if (MOD.includes(vl)) return ' · ' + fill(/^(werde|wirst|wird|werden)$/.test(vl) ? L.wer : L.mod, { x });
      return ' · ' + fill(L.sep, { x });
    };
    const C = w(T[ci]);
    if (g === 'grp1') {
      const sv = (() => { let j = end(ci) - 1; return isV(T[j]) ? w(T[j]) : ''; })();
      if (ci === 0) {                                       // Nebensatz first → it IS position 1
        const c = end(ci), vi = T.findIndex((t, i) => i > c && isV(t)); if (vi < 0) return '';
        const sub = T.slice(0, c).map(w).join(' ') + ',';
        return fill(L.front, { sub: q(sub), sv: q(sv), v: q(w(T[vi])), s: q(subj(vi + 1)) }) + klammer(vi);
      }
      return fill(L.back, { c: q(C), sv: q(sv) });
    }
    const vi = T.findIndex((t, i) => i > ci && isV(t)); if (vi < 0) return '';
    if (g === 'grp2') return fill(L.p1, { c: q(C), v: q(w(T[vi])), s: q(subj(vi + 1)) }) + klammer(vi);
    if (vi === ci + 1) return fill(L.q0, { c: q(C), v: q(w(T[vi])) }) + klammer(vi).replace('auf Position 2', 'vorne').replace('in position 2', 'in front');   // question: verb first
    return fill(L.p0, { c: q(C), p: q(T.slice(ci + 1, vi).map(w).join(' ')), v: q(w(T[vi])) }) + klammer(vi);
  }
  window.DCKonnNote = note;
})();
