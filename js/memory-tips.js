/* Memory tips ("Merkhilfen") derived from the word lists themselves.
   Every tip is checked against the word's real forms before it is shown:
   - a prefix counts as separable only if the Präteritum shows it at the end ("stand auf"),
     as inseparable only if the participle has no extra ge- (besucht, not *gebesucht);
   - a gender-ending rule is quoted with its real hit rate in this word list, and a noun that
     breaks the rule gets an "Ausnahme" tip instead of a wrong rule;
   - plural, Präteritum and comparison patterns come from the stored forms, with the most
     frequent words that follow the same pattern as memory anchors.
   Used by deutsch-coach.html (flashcard back) and Deutsch_Wortschatz_Excel_Sheet.html (Merkhilfe).
   Optional: js/german-conjugation.js (praesensPhrase) for Präsens examples.

   MemoryTips.init({verbs:[{w,pr,pp,en,rank}], nouns:[{w,a,p,en,rank}], adjs:[{w,comp,sup,en,rank}]})
   MemoryTips.forWord(cat, entry)  ->  [{id, icon, title, html, text, ta?}]   (cat: 'v' | 'n' | 'adj' | 'p')
*/
(function (global) {
  'use strict';

  const VOWEL_RE = /(äu|eu|au|ei|ai|ie|aa|ee|oo|[aeiouäöüy])/g;
  const INSEP = ['miss', 'emp', 'ent', 'zer', 'ver', 'be', 'er', 'ge'];
  const DUAL = ['wieder', 'hinter', 'unter', 'durch', 'wider', 'über', 'voll', 'um'];   // separable OR inseparable
  const PREPS = new Set(['zu', 'auf', 'von', 'über', 'für', 'mit', 'an', 'in', 'um', 'aus', 'bei', 'nach', 'vor', 'gegen', 'unter', 'durch', 'als']);
  const FILLER = new Set(['etw.', 'etw', 'etwas', 'jmdn.', 'jmdm.', 'jmdn', 'jmdm', 'jemanden', 'jemandem', 'sich']);
  const AUX = new Set(['hat', 'ist', 'hat/ist', 'ist/hat', 'haben', 'sein']);
  const PARTICLES = new Set(['aus', 'ein', 'an', 'auf', 'ab', 'vor', 'nach', 'mit', 'zu', 'um', 'über', 'unter', 'bei', 'durch', 'gegen', 'hinter', 'neben', 'zwischen', 'rück', 'zurück', 'fort', 'ober', 'innen', 'außen']);
  const IRREG_PRAES = new Set(['sein', 'haben', 'werden', 'wissen', 'tun', 'mögen', 'wollen', 'können', 'müssen', 'dürfen', 'sollen']);
  const GENDER_SUFFIXES = ['schaft', 'ismus', 'heit', 'keit', 'ling', 'chen', 'lein', 'tion', 'sion', 'ment', 'ette', 'ung', 'tät', 'tum', 'nis', 'eur', 'ant', 'ent', 'ist', 'ade', 'age', 'anz', 'enz', 'ik', 'ie', 'ei', 'ur', 'in', 'um', 'ma', 'or', 'ich', 'ig', 'ing', 'el', 'en', 'e', 'o'];   // -er left out: der Lehrer but das Zimmer/Fenster/Wasser
  const ART_COLOR = { der: '#1d4ed8', die: '#b91c1c', das: '#15803d' };

  let V = new Map(), N = new Map(), A = new Map();       // lower-case key -> entry (+ derived info)
  let RV = new Map(), RN = new Map(), RA = new Map();    // Ding root dictionary (Wortaufbau build only): key -> [gloss, rank] / [Word, art, gloss, rank]
  let VLIST = [], NLIST = [], ALIST = [];
  let SUFFIX_STATS = {}, PLURAL_BY_ART = {};

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lastVowel = s => { const m = String(s).toLowerCase().match(VOWEL_RE); return m ? m[m.length - 1] : ''; };
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const byRank = (a, b) => (a.rank || 1e9) - (b.rank || 1e9);
  const tagless = h => String(h).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  const shortEn = en => String(en || '').split(/[\/;,(]/)[0].trim();
  const art = a => `<b style="color:${ART_COLOR[a] || 'inherit'}">${a}</b>`;

  function umlaut(s) {
    const m = [...s.matchAll(VOWEL_RE)];
    for (let i = m.length - 1; i >= 0; i--) {
      const v = m[i][0], at = m[i].index;
      const rep = { a: 'ä', o: 'ö', u: 'ü', au: 'äu', aa: 'ä' }[v];
      if (rep) return s.slice(0, at) + rep + s.slice(at + v.length);
      if (v !== 'e') return null;              // "Garten" -> the stem vowel is a, skip the unstressed e
    }
    return null;
  }

  /* ---------------- verbs ---------------- */
  function verbToken(w) {
    const toks = String(w || '').replace(/\([^)]*\)/g, ' ').trim().split(/\s+/).filter(Boolean);
    while (toks.length > 1 && (PREPS.has(toks[toks.length - 1]) || FILLER.has(toks[toks.length - 1]))) toks.pop();
    return (toks.pop() || '').toLowerCase();
  }
  function governedPreps(w) {
    const toks = String(w || '').replace(/\([^)]*\)/g, ' ').trim().split(/\s+/);
    const out = [];
    while (toks.length > 1 && (PREPS.has(toks[toks.length - 1]) || FILLER.has(toks[toks.length - 1]))) {
      const t = toks.pop(); if (PREPS.has(t)) out.unshift(t);
    }
    return out;
  }
  function participle(pp) {
    const toks = String(pp || '').replace(/\([^)]*\)/g, ' ').trim().split(/\s+/).filter(t => t && !AUX.has(t) && t !== 'sich');
    while (toks.length > 1 && (PREPS.has(toks[toks.length - 1]) || FILLER.has(toks[toks.length - 1]))) toks.pop();
    return (toks.pop() || '').toLowerCase();
  }
  function auxOf(pp) { const f = String(pp || '').trim().split(/\s+/)[0]; return f === 'ist' ? 'sein' : (f === 'hat' ? 'haben' : (/ist|hat/.test(f) ? 'both' : '')); }

  function analyzeVerb(e) {
    const tok = verbToken(e.w);
    const prTok = String(e.pr || '').trim().split(/\s+/).filter(Boolean);
    const praet = (prTok[0] || '').toLowerCase();
    const part = participle(e.pp);
    const info = { tok, praet, part, aux: auxOf(e.pp), sep: null, insep: null, root: tok };
    if (!tok || !praet || !part) return info;
    // Separable: the Präteritum ends with the particle the infinitive starts with ("stand auf").
    // (several particles are joined: "stellte wieder her" -> wiederherstellen)
    const rest = prTok.slice(1).map(t => t.toLowerCase()).filter(t => t !== 'sich');
    while (rest.length && PREPS.has(rest[rest.length - 1]) && !tok.startsWith(rest[rest.length - 1])) rest.pop();
    for (let j = 0; j < rest.length; j++) {
      const t = rest.slice(j).join('');
      if (tok.startsWith(t) && tok.length > t.length + 2) { info.sep = t; info.root = tok.slice(t.length); break; }
    }
    if (!info.sep) {
      // Inseparable: the prefix stays on the participle and no ge- is added (besucht, gehört — while gehen/geben keep their own ge: ge-gangen).
      for (const p of INSEP.concat(DUAL)) {
        if (!tok.startsWith(p) || tok.length < p.length + 3) continue;
        const ok = part.startsWith(p) && (p === 'ge' ? !part.startsWith('geg') : !part.startsWith('ge'));
        if (ok) { info.insep = p; info.root = tok.slice(p.length); }
        break;
      }
    }
    const weak = /te$/.test(praet);
    const rootStem = info.root.replace(/e?n$/, '');
    info.iv = lastVowel(rootStem);
    info.pv = lastVowel(weak ? praet.replace(/e?te$/, '') : praet);
    info.ppv = lastVowel(part.replace(/(en|n|t)$/, ''));
    info.cls = !weak ? 'strong' : ((info.iv !== info.pv && /t$/.test(part)) ? 'mixed' : 'weak');
    info.chain = `${info.iv} → ${info.pv} → ${info.ppv}`;
    return info;
  }
  const forms = e => `${esc(e.w)} – ${esc(String(e.pr || '').split(/\s+/)[0])} – ${esc(e.pp)}`;

  function verbTips(e) {
    const x = e._x || analyzeVerb(e);
    const tips = [];
    if (!x.part) return tips;
    const conj = typeof global.praesensPhrase === 'function' ? global.praesensPhrase : null;
    const ph = (person) => { try { return conj ? conj(e.w, e.pr || '', person) : ''; } catch (_) { return ''; } };
    const rootEntry = V.get(x.root);

    if (x.sep) {
      const ich = ph('ich');
      tips.push({
        id: 'sep', icon: '🚀', title: `Trennbar: ${x.sep}|${x.root}`,
        html: `<b>${esc(x.sep)}-</b> jumps to the end of the sentence: <i>ich ${esc(ich.replace(new RegExp('\\s' + x.sep + '$'), ''))} … <b>${esc(x.sep)}</b></i> (Präteritum: <i>${esc(e.pr)}</i>). ` +
          (x.part.startsWith(x.sep + 'ge') ? `In the Perfekt, ge- goes inside: <i>${esc(x.part)}</i>.` : `Perfekt: <i>${esc(x.part)}</i> — no ge-, because ${esc(x.root)} itself takes none.`) + (rootEntry && rootEntry.w !== e.w ? ` Built on <b>${esc(rootEntry.w)}</b> (${esc(shortEn(rootEntry.en))}).` : ''),
        ta: 'வாக்கியத்தின் இறுதியில் Prefix பிரியும்! Perfekt-ல் இடையில் \'-ge-\' இணையும்.'
      });
    } else if (x.insep) {
      const dual = DUAL.includes(x.insep);
      tips.push({
        id: 'insep', icon: '🛡️', title: `Untrennbar: ${x.insep}-${x.root}`,
        html: `<b>${esc(x.insep)}-</b> never splits off and the Perfekt gets <b>no extra ge-</b>: <i>${esc(e.pp)}</i> (not <i>*ge${esc(x.part)}</i>).` +
          (dual ? ` (${esc(x.insep)}- can be separable in other verbs — here it stays.)` : '') +
          (rootEntry && rootEntry.w !== e.w ? ` Built on <b>${esc(rootEntry.w)}</b> (${esc(shortEn(rootEntry.en))}).` : ''),
        ta: 'இந்த முன்னொட்டு ஒருபோதும் பிரியாது, Perfekt-ல் \'ge-\' சேர்க்கப்படாது!'
      });
    }

    if (/ieren$/.test(x.tok) && /iert$/.test(x.part) && !/^ge/.test(x.sep ? x.part.slice(x.sep.length) : x.part)) {
      tips.push({
        id: 'ieren', icon: '⚡', title: '-ieren: kein ge-',
        html: `Verbs ending in <b>-ieren</b> are regular and take <b>no ge-</b> in the Perfekt: <i>${esc(e.pp)}</i>. Same as ${['studiert', 'telefoniert', 'repariert', 'probiert'].filter(f => !x.part.endsWith(f)).slice(0, 3).map(f => `<i>${f}</i>`).join(', ')}.`,
        ta: '-ieren என முடியும் வினைகள் Perfekt-ல் \'ge-\' எடுக்காது!'
      });
    }

    if (x.aux === 'sein' || x.aux === 'both') {
      tips.push({
        id: 'sein', icon: '🚶', title: x.aux === 'both' ? 'Perfekt mit sein oder haben' : 'Perfekt mit sein',
        html: x.aux === 'both'
          ? `<i>${esc(e.pp)}</i>: <b>sein</b> when it means movement/change (ich bin nach Berlin gefahren), <b>haben</b> with a direct object (ich habe das Auto gefahren).`
          : `<i>${esc(e.pp)}</i> — <b>sein</b>, not haben: the verb means movement from A to B or a change of state (or it is sein, bleiben, werden, passieren).`,
        ta: 'இடம் மாறுதல் (A→B) அல்லது நிலை மாறுதல் இருந்தால் SEIN, மற்றவற்றிற்கு HABEN!'
      });
    }

    // Präsens: irregular table or du/er vowel change (only when the conjugation engine is loaded).
    if (conj) {
      const ich = ph('ich').split(' ')[0], du = ph('du').split(' ')[0], er = ph('er/sie/es').split(' ')[0];
      const base = IRREG_PRAES.has(x.root) ? x.root : null;
      if (base && ich && du && er) {
        tips.push({ id: 'praes-irr', icon: '🧩', title: 'Präsens unregelmäßig',
          html: `Irregular present — learn the three forms as a chant: <i>ich ${esc(ich)} · du ${esc(du)} · er/sie/es ${esc(er)}</i>.` });
      } else if (er && ich && lastVowel(er.replace(/t$/, '')) !== lastVowel(ich.replace(/e$/, '')) && x.cls === 'strong') {
        tips.push({ id: 'praes-sc', icon: '🔀', title: `Präsens: ${lastVowel(ich.replace(/e$/, ''))} → ${lastVowel(er.replace(/t$/, ''))}`,
          html: `The vowel changes <b>only for du and er/sie/es</b>: <i>du ${esc(du)}, er ${esc(er)}</i> — but <i>ich ${esc(ich)}, wir ${esc(ph('wir').split(' ')[0])}</i>.` });
      }
    }

    // Präteritum/Perfekt pattern, with the most frequent verbs that follow the same pattern.
    if (x.cls === 'strong') {
      const group = VLIST.filter(o => o._x.cls === 'strong' && o._x.chain === x.chain && o._x.root !== x.root);
      const seen = new Set(), buddies = [];
      for (const o of group.sort((a, b) => (a._x.root === a._x.tok ? 0 : 1) - (b._x.root === b._x.tok ? 0 : 1) || byRank(a, b))) {
        if (seen.has(o._x.root)) continue; seen.add(o._x.root); buddies.push(o); if (buddies.length === 3) break;
      }
      tips.push({
        id: 'ablaut', icon: '🎵', title: `Vokal-Melodie ${x.chain}`,
        html: buddies.length
          ? `Strong verb — sing the vowel melody <b>${esc(x.chain)}</b>: <i>${forms(e)}</i>. Same melody: ${buddies.map(o => `<i>${forms(o)}</i>`).join(' · ')}.`
          : `Strong verb with its own vowel melody <b>${esc(x.chain)}</b>: <i>${forms(e)}</i> — learn the three forms as one chant.`
      });
    } else if (x.cls === 'mixed') {
      const buddies = VLIST.filter(o => o._x.cls === 'mixed' && o._x.root !== x.root && o._x.root === o._x.tok && !IRREG_PRAES.has(o._x.tok)).sort(byRank).slice(0, 3);
      tips.push({
        id: 'mixed', icon: '🧬', title: 'Mischverb',
        html: `Mixed verb: the vowel changes like a strong verb, but the endings are weak (-te, -t): <i>${forms(e)}</i>.` +
          (buddies.length ? ` Same club: ${buddies.map(o => `<i>${forms(o)}</i>`).join(' · ')}.` : '')
      });
    } else {
      const looksStrong = /ei|ie/.test(x.iv) && !/ieren$/.test(x.tok);
      const extraE = /ete$/.test(x.praet) && /[dt]$|[^aeiouäöülrh][mn]$/.test(x.root.replace(/e?n$/, ''));
      if (looksStrong && !extraE) {
        const buddies = VLIST.filter(o => o._x.cls === 'weak' && o._x.iv === x.iv && o._x.root !== x.root && o._x.root === o._x.tok && !/ieren$/.test(o._x.tok)).sort(byRank).slice(0, 3);
        const strongTwin = VLIST.filter(o => o._x.cls === 'strong' && o._x.iv === x.iv && o._x.root === o._x.tok && !IRREG_PRAES.has(o._x.tok)).sort(byRank)[0];
        tips.push({
          id: 'weak-trap', icon: '⚠️', title: `Falle: -${x.iv}- aber schwach`,
          html: `Looks like a strong -${esc(x.iv)}- verb${strongTwin ? ` (${forms(strongTwin)})` : ''}, but it is <b>regular</b>: <i>${forms(e)}</i>.` +
            (buddies.length ? ` Also regular: ${buddies.map(o => `<i>${esc(o.w)}</i>`).join(', ')}.` : '')
        });
      } else if (extraE) {
        tips.push({ id: 'weak-ete', icon: '➕', title: 'Extra -e-: -ete / -et',
          html: `Regular verb whose stem ends in <b>${esc(x.root.replace(/e?n$/, '').slice(-1))}</b>, so it adds an extra <b>-e-</b> to be pronounceable: <i>${forms(e)}</i>${x.tok === 'arbeiten' ? '' : ' (like <i>arbeiten – arbeitete – gearbeitet</i>)'}.` });
      } else if (!/ieren$/.test(x.tok)) {
        tips.push({ id: 'weak', icon: '✅', title: 'Regelmäßig (schwach)',
          html: `Regular verb — no vowel change, nothing extra to memorise: stem + <b>-te</b>, <b>ge-</b> … <b>-t</b>: <i>${forms(e)}</i>.` });
      }
    }

    const preps = governedPreps(e.w);
    if (preps.length) {
      const ich = ph('ich');
      tips.push({ id: 'prep', icon: '🔗', title: `Immer mit „${preps.join(' / ')}"`,
        html: `This verb comes with a fixed partner word — learn them as one chunk: <b>${esc(e.w)}</b>${ich ? ` → <i>ich ${esc(ich)} …</i>` : ''}.` });
    }
    return tips;
  }

  /* ---------------- nouns ---------------- */
  const cleanNoun = w => String(w || '').replace(/\([^)]*\)/g, '').replace(/^(der|die|das)\s+/i, '').trim();
  // "—" (master lists) = no plural. A bare "-" is ambiguous in the A1 cards (das Zimmer "-" = die Zimmer,
  // das Geld "-" = none), so it counts as unknown; "-n"/"-en"/"-se" shorthand is expanded.
  const pluralKnown = p => !!p && !/^[—–-]$/.test(p.trim());
  const pluralNone = p => !!p && /^[—–]$/.test(p.trim());
  function expandPlural(sg, p) {
    p = String(p || '').replace(/^die\s+/, '').trim();
    if (p === '-' || /^\(/.test(p)) return '';
    if (/^-[a-zäöüß]+$/.test(p)) return sg + p.slice(1);
    return p;
  }

  // der/die Deutsche, der/die Erwachsene, der/die Angestellte: nouns made from adjectives/participles.
  const ADJ_NOUN_RE = /(ige|liche|ische|sche|ende|ene|gte|lte|zte|nte|dte|hte)$/;
  const isAdjNoun = (sg, a, pl) => a === 'der' && ADJ_NOUN_RE.test(sg.toLowerCase()) && /n$/.test(String(pl || ''));

  function suffixOf(sg, pl, a) {
    const l = sg.toLowerCase();
    if (a && isAdjNoun(sg, a, pl)) return null;
    if (/ee$/.test(l)) return null;                     // der Tee, der See: -ee is not the -e ending
    if (/^ge/.test(l) && /e$/.test(l) && l.length > 5) return 'Ge…e';
    for (const s of GENDER_SUFFIXES) {
      if (!l.endsWith(s) || l.length < s.length + 2) continue;
      if (s === 'in') return /innen$/.test(String(pl || '').toLowerCase()) ? 'in' : null;
      return s;
    }
    return null;
  }

  function pluralClass(sg, pl) {
    if (pluralNone(pl)) return 'none';
    if (!pluralKnown(pl)) return null;
    const s = sg.toLowerCase(), p = pl.trim().toLowerCase().replace(/^die\s+/, '');
    if (p === s) return '–';
    const u = umlaut(s);
    for (const end of ['nen', 'en', 'er', 'e', 'n', 's']) {
      if (p === s + end) return '-' + end;
      if (u && p === u + end) return '¨' + end;
    }
    if (u && p === u) return '¨';
    return 'other';
  }
  const PLURAL_LABEL = { '–': 'no ending', '¨': 'umlaut only', '-e': '-e', '¨e': 'umlaut + -e', '-er': '-er', '¨er': 'umlaut + -er',
    '-n': '-n', '-en': '-en', '-nen': '-nen', '-s': '-s', 'none': 'no plural', 'other': 'special' };

  function recognizeHead(head, useRoots) {
    const h = head.toLowerCase();
    if (PARTICLES.has(h) || h === 'haupt' || h === 'neben') return { de: h, en: '' };
    const app = recognizeIn(h, k => N.get(k), k => V.get(k), k => A.get(k));
    if (app || !useRoots) return app;
    return recognizeIn(h, k => gN(k, 20000), k => gV(k, 20000), k => gA(k, 20000));
  }
  function recognizeIn(h, Nf, Vf, Af) {
    if (h.length < 3) return null;
    if (INSEP.includes(h)) return null;                  // Ent-haltung is ent- + halten, not Ente + Haltung
    const hit = (o, kind, glue) => o ? { de: o.w, en: shortEn(o.en), glue, kind } : null;
    // exact word, then verb stem (Sehn|sucht = sehnen), then a linking letter, then a dropped -e (Schul|e)
    const cands = [[Nf(h), 'n', h], [Af(h), 'adj', h]];
    if (h.length >= 4) for (const suf of ['en', 'n']) cands.push([Vf(h + suf), 'v', h + suf]);
    const found = cands.filter(c => c[0]);
    if (found.length) {
      const rk = c => c[0]._root ? ((c[1] === 'n' ? (RN.get(c[2]) || [])[3] : c[1] === 'v' ? (RV.get(c[2]) || [])[1] : (RA.get(c[2]) || [])[1]) || 1e9) : 0;
      found.sort((a, b) => rk(a) - rk(b));
      return hit(found[0][0], found[0][1], '');
    }
    let r;
    for (const [k, glue] of [[h.replace(/s$/, ''), 's'], [h.replace(/n$/, ''), 'n'], [h.replace(/en$/, ''), 'en'], [h.replace(/es$/, ''), 'es'], [h.replace(/er$/, ''), 'er'], [h.replace(/e$/, ''), 'e']]) {
      if (k.length < 3 || k === h) continue;
      r = hit(Nf(k), 'n', glue) || hit(Af(k), 'adj', glue);
      if (r) return r;
    }
    const e = Nf(h + 'e');                                  // Schul|e — only app words (Ding: Irr|e 'whacko')
    return e && !e._root ? hit(e, 'n', '') : null;
  }

  // Last-part split, only when the last part is a real noun with the SAME article and the first part is a real word.
  function splitCompound(w, a, useRoots) {
    const sg = cleanNoun(w), l = sg.toLowerCase();
    if (!/^[a-zäöüß]+$/.test(l) || l.length < 6) return null;
    for (let i = 2; i <= l.length - 3; i++) {
      const tail = useRoots ? gN(l.slice(i)) : N.get(l.slice(i));
      if (!tail) continue;
      if (a && tail.a !== a) return null;
      const head = recognizeHead(l.slice(0, i), useRoots);
      if (!head) continue;
      if (!head.kind && /ung$/.test(l)) continue;         // Ab-stimmung comes from abstimmen, not ab + Stimmung
      let glue = head.glue || '';
      return { head, glue, tail, headRaw: sg.slice(0, i - glue.length) };
    }
    return null;
  }

  function nounTips(e) {
    const sg = cleanNoun(e.w), a = (e.a || '').trim();
    const tips = [];
    if (!sg || !/^(der|die|das)$/.test(a)) return tips;
    const pl = expandPlural(sg, e.p);
    const cls = pluralClass(sg, pl);

    const comp = splitCompound(sg, a);
    if (comp) {
      const t = comp.tail;
      const plFits = pluralKnown(t.p) && pluralKnown(pl) && pl.toLowerCase().endsWith(t.p.toLowerCase());
      tips.push({
        id: 'compound', icon: '👑', title: `Letztes Wort ist der Boss: ${a} ${t.w}`,
        html: `<b>${esc(comp.head.kind ? comp.head.de : cap(comp.head.de))}</b>${comp.glue ? ` + <b>-${esc(comp.glue)}-</b>` : ''} + <b>${esc(t.w)}</b> = <b>${esc(sg)}</b>` +
          (comp.head.en ? ` (${esc(comp.head.en)} + ${esc(shortEn(t.en))})` : '') +
          `. The last part decides everything: ${art(t.a)} ${esc(t.w)} → ${art(a)} ${esc(sg)}` +
          (plFits ? `, and the plural too: die ${esc(t.p)} → die ${esc(pl)}.` : '.'),
        ta: 'கூட்டுப் பெயர்களில் கடைசி சொல்லே Article மற்றும் Plural-ஐ தீர்மானிக்கும்!'
      });
    }

    const suf = comp ? null : suffixOf(sg, pl, a);
    const st = suf && SUFFIX_STATS[suf];
    if (st && st.total >= 5 && st.share >= 0.75) {
      const label = suf === 'Ge…e' ? 'Ge-…-e' : '-' + suf;
      if (st.top === a) {
        tips.push({ id: 'gender', icon: '🎯', title: `Endung ${label} → ${a}`,
          html: `Words ending in <b>${esc(label)}</b> are ${art(a)}: ${st.counts[a]} of ${st.total} in this word list` +
            (st.examples[a] ? ` (${st.examples[a].filter(x => x.toLowerCase() !== sg.toLowerCase()).slice(0, 3).map(x => `${a} ${esc(x)}`).join(', ')})` : '') + '.' });
      } else {
        tips.push({ id: 'gender-exc', icon: '⚠️', title: `Ausnahme! ${a} ${sg}`,
          html: `Most <b>${esc(label)}</b> words are ${art(st.top)} (${st.counts[st.top]} of ${st.total}), but this one is ${art(a)} <b>${esc(sg)}</b>. Exceptions stick when you notice them — say „${esc(a + ' ' + sg)}" three times.` });
      }
    }

    if (isAdjNoun(sg, a, pl)) {
      tips.push({ id: 'adj-noun', icon: '🎭', title: 'Adjektiv als Nomen',
        html: `Made from an adjective/participle, so it keeps adjective endings and works for both sexes: <i>der ${esc(sg)} · die ${esc(sg)} · ein ${esc(sg)}r · die ${esc(sg)}n</i>.` });
    } else if (a === 'der' && /e$/.test(sg) && cls === '-n') {
      tips.push({ id: 'n-dekl', icon: '🔔', title: 'n-Deklination',
        html: `Masculine in -e with plural -n → it also takes <b>-n</b> in the singular after Akkusativ/Dativ: <i>den ${esc(sg)}n, dem ${esc(sg)}n</i> (only the Nominativ is „der ${esc(sg)}").` });
    }

    if (cls) {
      const mates = NLIST.filter(o => o._cls === cls && o.a === a && o._sg.toLowerCase() !== sg.toLowerCase() &&
        !o._sg.toLowerCase().endsWith(sg.toLowerCase()) && !sg.toLowerCase().endsWith(o._sg.toLowerCase())).sort(byRank);
      const seenTail = new Set(), buddies = [];
      for (const o of mates) { const k = o._sg.toLowerCase().slice(-4); if (seenTail.has(k)) continue; seenTail.add(k); buddies.push(o); if (buddies.length === 2) break; }
      const show = o => cls === 'none' ? `${o.a} ${esc(o._sg)}` : `${o.a} ${esc(o._sg)} → die ${esc(o.p)}`;
      const typical = PLURAL_BY_ART[a] && PLURAL_BY_ART[a][0] === cls;
      if (cls === 'none') {
        tips.push({ id: 'plural', icon: '📦', title: 'Kein Plural',
          html: `Normally used only in the singular (a mass or abstract noun)` + (buddies.length ? `, like ${buddies.map(show).join(', ')}` : '') + '.' });
      } else if (cls === 'other') {
        tips.push({ id: 'plural', icon: '📦', title: 'Besonderer Plural',
          html: `Special plural — learn the pair by heart: ${art(a)} ${esc(sg)} → die <b>${esc(pl)}</b>.` });
      } else {
        tips.push({ id: 'plural', icon: '📦', title: `Plural: ${PLURAL_LABEL[cls]}`,
          html: `${art(a)} ${esc(sg)} → die <b>${esc(pl)}</b> (${esc(PLURAL_LABEL[cls])}` +
            (typical ? `, the most common plural for ${a}-nouns here` : '') + ').' +
            (buddies.length ? ` Same pattern: ${buddies.map(show).join(' · ')}.` : '') });
      }
    }
    return tips;
  }

  /* ---------------- adjectives ---------------- */
  function adjClass(e) {
    const w = String(e.w || '').trim().toLowerCase();
    const comp = String(e.comp || '').trim().toLowerCase(), sup = String(e.sup || '').trim().toLowerCase().replace(/^am\s+/, '');
    if (!w || !comp || /^[—–-]$/.test(comp) || !/^[a-zäöüß]+$/.test(w)) return null;
    const u = umlaut(w);
    const drop = /(el|er)$/.test(w) ? w.slice(0, -2) + w.slice(-1) : null;
    let c;
    if (comp === w + 'er' || (/e$/.test(w) && comp === w + 'r')) c = 'regular';
    else if (u && comp === u + 'er') c = 'umlaut';
    else if (drop && comp === drop + 'er') c = 'drop';
    else c = 'irregular';
    return { c, w, comp, sup, extraE: /esten$/.test(sup) && !/e$/.test(w) && c !== 'irregular' };
  }

  // Real derivations whose meaning drifted too far for a "base + suffix" tip to help.
  const NO_DERIVATION = new Set(['verträglich', 'vergeblich', 'scheinbar', 'unvergesslich', 'ehrlich', 'möglich']);
  function wordBuild(w) {
    const l = w.toLowerCase();
    if (NO_DERIVATION.has(l)) return null;
    const SUF = [
      ['los', 'without', 'English -less'], ['voll', 'full of', 'English -ful'], ['reich', 'rich in', ''], ['frei', 'free of', 'English -free'],
      ['bar', 'usually: can be …-ed', 'English -able'], ['lich', '', ''], ['ig', '', ''], ['isch', '', ''], ['haft', 'like', ''], ['sam', '', '']
    ];
    for (const [s, gloss, eng] of SUF) {
      if (!l.endsWith(s) || l.length < s.length + 3) continue;
      const part = l.slice(0, -s.length);
      const cands = [part, part.replace(/s$/, ''), part.replace(/es$/, ''), part.replace(/en$/, ''), part.replace(/n$/, ''), part.replace(/e$/, ''), part + 'e',
        part.replace(/ä/, 'a').replace(/ö/, 'o').replace(/ü/, 'u')].filter(k => k.length >= 3);
      if (s === 'bar') { for (const k of [part + 'en', part + 'n']) { const v = V.get(k); if (v) return { s, gloss, eng, base: v.w, baseEn: shortEn(v.en) }; } continue; }
      for (const k of cands) { const n = N.get(k); if (n) return { s, gloss, eng, base: `${n.a} ${n.w}`, baseEn: shortEn(n.en) }; }
      if (!gloss) for (const k of [part + 'en', part + 'n']) { const v = V.get(k); if (v) return { s, gloss, eng, base: v.w, baseEn: shortEn(v.en) }; }
      return null;
    }
    return null;
  }

  function adjTips(e) {
    const tips = [];
    const w = String(e.w || '').trim();
    const x = e._c !== undefined ? e._c : adjClass(e);
    if (x) {
      const buddies = ALIST.filter(o => o._c && o._c.c === x.c && o.w !== w).sort(byRank).slice(0, 3)
        .map(o => `<i>${esc(o.w)} → ${esc(o._c.comp)}</i>`);
      const line = `<i>${esc(w)} → ${esc(x.comp)} → am ${esc(x.sup)}</i>`;
      const TXT = {
        umlaut: [`Steigerung mit Umlaut`, `Short word with a/o/u gets an <b>umlaut</b>: ${line}.`],
        drop: [`-e- fällt weg`, `The <b>-e-</b> of -el/-er drops: ${line}.`],
        irregular: [`Unregelmäßig`, `Irregular — learn by heart: ${line}.`],
        regular: [`Regelmäßig`, `Regular: + <b>-er</b>, am … <b>-sten</b>: ${line}.`]
      }[x.c];
      tips.push({ id: 'comp', icon: x.c === 'regular' ? '✅' : '📈', title: TXT[0],
        html: TXT[1] + (x.extraE ? ` Extra <b>-e-</b> in „am ${esc(x.sup)}" because the word ends in ${esc(w.slice(-1))}.` : '') +
          (buddies.length && x.c !== 'regular' ? ` Same: ${buddies.join(' · ')}.` : '') });
    }
    const l = w.toLowerCase();
    if (/^un/.test(l) && l.length > 5) {
      const base = NO_DERIVATION.has(l) ? null : A.get(l.slice(2));
      if (base) tips.push({ id: 'un', icon: '🔄', title: 'un- = Gegenteil',
        html: `<b>un</b> + <b>${esc(base.w)}</b> (${esc(shortEn(base.en))}) → the opposite, like English un-. Learn them as a pair.` });
    }
    const b = wordBuild(w);
    if (b) tips.push({ id: 'suffix', icon: '🧱', title: `Wortbildung: -${b.s}`,
      html: `<b>${esc(b.base)}</b> (${esc(b.baseEn)}) + <b>-${esc(b.s)}</b> → <b>${esc(w)}</b>` +
        (b.gloss ? `. -${esc(b.s)} = „${esc(b.gloss)}"${b.eng ? ` (${esc(b.eng)})` : ''}.` : `. Know the base word and you get this one for free.`) });
    return tips;
  }

  /* ---------------- public ---------------- */
  function fallback(cat, e) {
    if (cat === 'n' && e.a) return { id: 'chunk', icon: '🧠', title: 'Lerntechnik: Artikel + Wort',
      html: `Never learn the bare noun — say it as one block with its article: ${art(e.a)} <b>${esc(cleanNoun(e.w))}</b>. The card colour matches the article (der blue · die red · das green).` };
    if (cat === 'p') return { id: 'chunk', icon: '🧠', title: 'Lerntechnik: ganzer Ausdruck',
      html: `Learn the whole expression as one unit and say it aloud in a sentence of your own — chunks are recalled faster than single words.` };
    return { id: 'say', icon: '🧠', title: 'Lerntechnik: laut + Bild',
      html: `Say <b>${esc(e.w)}</b> aloud in a short sentence about your own life and picture it — spoken, personal sentences are remembered much better than the word alone.` };
  }

  function forWord(cat, e, opt) {
    if (!e || !e.w) return [];
    let tips = [];
    try {
      if (cat === 'v') { const k = verbToken(e.w); const known = V.get(k); tips = verbTips(known && known.w === e.w && known.pr === e.pr ? known : e); }
      else if (cat === 'n') tips = nounTips(e);
      else if (cat === 'adj') { const known = A.get(String(e.w).trim().toLowerCase()); tips = adjTips(known && known.comp ? known : e); }
    } catch (err) { tips = []; }
    if (!tips.length && !(opt && opt.noFallback)) tips.push(fallback(cat, e));
    for (const t of tips) t.text = tagless(t.html);
    return tips;
  }

  function init(data) {
    V = new Map(); N = new Map(); A = new Map();
    const R = data.roots || {};
    RV = new Map(Object.entries(R.v || {})); RN = new Map(Object.entries(R.n || {})); RA = new Map(Object.entries(R.adj || {}));
    VLIST = []; NLIST = []; ALIST = [];
    for (const e of (data.verbs || [])) {
      if (!e || !e.w || !e.pr || !e.pp) continue;
      const o = Object.assign({}, e); o._x = analyzeVerb(o);
      if (!o._x.part) continue;
      if (!V.has(o._x.tok) || byRank(o, V.get(o._x.tok)) < 0) V.set(o._x.tok, o);
      VLIST.push(o);
    }
    for (const e of (data.nouns || [])) {
      if (!e || !e.w || !/^(der|die|das)$/.test((e.a || '').trim())) continue;
      const sg = cleanNoun(e.w);
      if (!/^[A-Za-zÄÖÜäöüß]+$/.test(sg)) continue;
      const o = Object.assign({}, e, { a: e.a.trim(), p: expandPlural(sg, e.p) });
      o._sg = sg; o.w = sg; o._cls = pluralClass(sg, o.p);
      const k = sg.toLowerCase();
      if (!N.has(k) || (!N.get(k)._cls && o._cls)) N.set(k, o);
    }
    NLIST = [...N.values()];
    for (const e of (data.adjs || [])) {
      if (!e || !e.w) continue;
      const o = Object.assign({}, e); o._c = adjClass(o);
      const k = String(e.w).trim().toLowerCase();
      if (!A.has(k) || (!A.get(k)._c && o._c)) A.set(k, o);
    }
    ALIST = [...A.values()];
    // Gender-ending statistics over this word list (unique nouns).
    SUFFIX_STATS = {};
    for (const o of NLIST) {
      const s = suffixOf(o._sg, o.p, o.a); if (!s) continue;
      const st = SUFFIX_STATS[s] || (SUFFIX_STATS[s] = { counts: { der: 0, die: 0, das: 0 }, total: 0, examples: { der: [], die: [], das: [] }, _ex: { der: [], die: [], das: [] } });
      st.counts[o.a]++; st.total++; st._ex[o.a].push(o);
    }
    for (const s in SUFFIX_STATS) {
      const st = SUFFIX_STATS[s];
      st.top = ['der', 'die', 'das'].sort((x, y) => st.counts[y] - st.counts[x])[0];
      st.share = st.counts[st.top] / st.total;
      for (const a of ['der', 'die', 'das']) st.examples[a] = st._ex[a].sort(byRank).slice(0, 4).map(o => o._sg);
      delete st._ex;
    }
    PLURAL_BY_ART = {};
    for (const a of ['der', 'die', 'das']) {
      const c = {};
      for (const o of NLIST) if (o.a === a && o._cls && o._cls !== 'none' && o._cls !== 'other') c[o._cls] = (c[o._cls] || 0) + 1;
      PLURAL_BY_ART[a] = Object.keys(c).sort((x, y) => c[y] - c[x]);
    }
    return { verbs: VLIST.length, nouns: NLIST.length, adjs: ALIST.length };
  }

  function verbInfo(w, pr, pp) { return analyzeVerb({ w, pr, pp }); }

  /* ---------- extra rule tips that need no data ---------- */
  const DOGFU = ['durch', 'ohne', 'gegen', 'für', 'um', 'bis'];
  const DATIV = ['aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'gegenüber'];
  const WECHSEL = ['an', 'auf', 'hinter', 'in', 'neben', 'über', 'unter', 'vor', 'zwischen'];
  function ruleTips(w) {
    const l = String(w || '').trim().toLowerCase().replace(/^sich\s+/, '');
    const out = [];
    if (l === 'wissen' || l === 'kennen') out.push({ id: 'wissen-kennen', icon: '🧙', title: 'wissen oder kennen?',
      html: `<b>wissen</b> = know a fact (followed by <i>dass, wo, wie, was…</i>): <i>Ich weiß, wo er wohnt.</i> <b>kennen</b> = be familiar with a person/place/thing: <i>Ich kenne Tom / Berlin.</i>`,
      ta: 'kennen = ஆட்கள்/ஊர்கள்; wissen = உண்மைகள்/தகவல்கள்.' });
    if (DOGFU.includes(l)) out.push({ id: 'case', icon: '🎯', title: `${l} + Akkusativ`,
      html: `<b>${esc(l)}</b> always takes the <b>Akkusativ</b> (den/die/das): remember <b>DOGFU(B)</b> — durch, ohne, gegen, für, um (bis).`,
      ta: 'Durch, Ohne, Gegen, Für, Um எப்போதும் Akkusativ!' });
    else if (DATIV.includes(l)) out.push({ id: 'case', icon: '🎯', title: `${l} + Dativ`,
      html: `<b>${esc(l)}</b> always takes the <b>Dativ</b> (dem/der/dem): sing it — <i>aus, bei, mit, nach, seit, von, zu</i> (+ gegenüber).`,
      ta: 'Aus, bei, mit, nach, seit, von, zu வந்தால் எப்போதும் Dativ!' });
    else if (WECHSEL.includes(l)) out.push({ id: 'case', icon: '🔀', title: `${l}: Wo? oder Wohin?`,
      html: `Two-way preposition: <b>Wo?</b> (location) → Dativ: <i>Das Buch liegt ${esc(l)} dem Tisch.</i> <b>Wohin?</b> (movement) → Akkusativ: <i>Ich lege das Buch ${esc(l)} den Tisch.</i>` });
    return out;
  }

  /* ---------- adapters for pages that render the old "cheat code" boxes ---------- */
  const BADGE = { sep: 'Trennbar', insep: 'Untrennbar', ieren: 'kein ge-', sein: 'Perfekt: sein', ablaut: 'Stark', mixed: 'Mischverb', weak: 'Schwach',
    'weak-trap': 'Ausnahme', 'weak-ete': '-ete', 'praes-sc': 'Präsens', 'praes-irr': 'Präsens', prep: 'Chunk', compound: 'Kompositum', gender: 'Artikel',
    'gender-exc': 'Ausnahme', 'n-dekl': 'n-Deklination', 'adj-noun': 'Adj. als Nomen', plural: 'Plural', comp: 'Steigerung', un: 'Gegenteil', suffix: 'Wortbildung',
    chunk: 'Lerntechnik', say: 'Lerntechnik', 'wissen-kennen': 'Falle', case: 'Kasus' };

  function entryFrom(w, cat, o) {
    o = o || {};
    const e = { w: String(w || o.w || o.inf || o.sg || '').trim(), en: o.en, a: o.a, rank: o.freq,
      pr: o.pr || o.praeteritum, pp: o.pp || o.perfekt, p: o.p != null && o.p !== '' ? o.p : o.pl,
      comp: o.comp || o.komp, sup: o.sup };
    if (cat === 'adj' && !e.comp && o.mn) {            // home cards keep "Steigerung: a → b → am c" in mn
      const m = String(o.mn).replace(/<[^>]+>/g, '').match(/Steigerung:\s*\S+\s*→\s*(\S+)\s*→\s*(am \S+)/);
      if (m) { e.comp = m[1]; e.sup = m[2]; }
    }
    return e;
  }

  // [{num, title, badge, rule, tamil, id}] — sep/insep are left out when the page shows the prefix table instead.
  function cheatCodes(w, cat, opt, options) {
    const e = entryFrom(w, cat, opt);
    let tips = ruleTips(e.w);
    if (cat === 'v' || cat === 'n' || cat === 'adj') tips = tips.concat(forWord(cat, e, { noFallback: !!tips.length || !!(options && options.noFallback) }));
    const skip = new Set((options && options.skip) || []);
    return tips.filter(t => !skip.has(t.id)).map(t => ({ id: t.id, num: t.icon, title: `${t.icon} ${t.title}`, badge: BADGE[t.id] || 'Merkhilfe',
      rule: t.html, tamil: t.ta ? `💡 <b>Tamil:</b> ${t.ta}` : '' }));
  }

  const SEP_MEANING = { ab: ['off / away / down', 'விலகி / கீழே'], an: ['at / on / start', 'மீது / தொடக்கம்'], auf: ['up / open', 'மேலே / திறந்து'],
    aus: ['out / off', 'வெளியே / அணைத்து'], bei: ['by / along', 'சேர்த்து / கூட'], ein: ['in / into', 'உள்ளே'], fern: ['far', 'தொலைவில்'],
    fest: ['firm / fixed', 'உறுதியாக'], mit: ['with / along', 'கூட / உடன்'], nach: ['after / re-', 'பின்னால் / மீண்டும்'], vor: ['in front / before', 'முன்னால்'],
    weg: ['away', 'விலகி'], weiter: ['further / on', 'தொடர்ந்து'], zu: ['to / shut', 'நோக்கி / மூடி'], zurück: ['back', 'திரும்பி'],
    zusammen: ['together', 'ஒன்றாக'], her: ['here (towards me)', 'இங்கே'], hin: ['there (away)', 'அங்கே'], um: ['around / re-', 'சுற்றி'],
    los: ['off / start', 'தொடங்கு'], statt: ['place', 'இடம்'], teil: ['part', 'பங்கு'], kennen: ['know', 'அறிமுகம்'] };
  const INSEP_MEANING = { be: ['makes the verb take a direct object', 'நேரடி இலக்கு'], ge: ['(old prefix, meaning faded)', ''], er: ['achieve / result', 'முயற்சியின் விளைவு'],
    ver: ['change / wrong / away', 'மாற்றம் / தவறு'], zer: ['to pieces', 'உடைத்தல்'], ent: ['away / remove', 'நீக்குதல்'], emp: ['receive / feel', 'உணர்தல்'],
    miss: ['wrongly (mis-)', 'தவறான'] };

  // Same shape as the pages' old analyzeGermanLinguistics() verb result, but only for a prefix the forms confirm.
  function verbLinguistics(w, opt) {
    const e = entryFrom(w, 'v', opt);
    const x = analyzeVerb(e);
    if (!x.sep && !x.insep) return null;
    const pfx = x.sep || x.insep, root = x.root;
    const mean = (x.sep ? SEP_MEANING : INSEP_MEANING)[pfx] || ['', ''];
    const rootEntry = V.get(root);
    const literal = `${mean[0] || pfx} + ${rootEntry ? shortEn(rootEntry.en) : root}`;
    const actual = `${e.en || e.w}${opt && opt.ta ? ` (${opt.ta})` : ''}`;
    if (x.sep) {
      let ich = '';
      try { ich = typeof global.praesensPhrase === 'function' ? global.praesensPhrase(e.w, e.pr || '', 'ich') : ''; } catch (_) { ich = ''; }
      const verbPart = ich ? ich.replace(new RegExp('\\s' + pfx + '$'), '') : root.replace(/en$/, 'e');
      return { type: 'separable_verb', word: e.w, prefix: pfx, root, pfxInfo: { en: mean[0], ta: mean[1] },
        title: '🚀 Separable Verb (Trennbare Verben / வாக்கியத்தில் பிரியும் வினைகள்)', badge: 'Splits in Sentence', literal, actual,
        formula: `<b>Dictionary:</b> <code>${esc(e.w)}</code><br>• 🗣️ <b>Sentence (Präsens):</b> <i>„Ich ${esc(verbPart)} … <b style="color:var(--stamp-red, #b91c1c);">${esc(pfx)}</b>."</i><br>• 📦 <b>Perfekt:</b> <i>„${esc(e.pp)}"</i>${x.part.startsWith(pfx + 'ge') ? ' (<b>-ge-</b> goes in the middle)' : ''}`,
        tamilInsight: `💡 <b>Tamil Word-Splitting Hack:</b> அகராதியில் ஒன்றாக இருக்கும் சொல், வாக்கியத்தில் இரண்டாகப் பிளந்து, அதன் முதல் பாதி (<b>${esc(pfx)}</b>) வாக்கியத்தின் இறுதிக்குச் சென்றுவிடும்!` };
    }
    return { type: 'inseparable_verb', word: e.w, prefix: pfx, root, pfxInfo: { en: mean[0], ta: mean[1] },
      title: `🛡️ Inseparable Prefix (${pfx.toUpperCase()}- never splits)`, badge: 'Inseparable: No ge-', literal, actual,
      formula: `<b>Dictionary:</b> <code>${esc(e.w)}</code><br>• 🛡️ <b>${esc(pfx)}-</b> stays attached in every sentence and the Perfekt has <b>no extra ge-</b>: <i>${esc(e.pp)}</i>.`,
      tamilInsight: `💡 <b>Memory:</b> இந்த முன்னொட்டு ஒருபோதும் பிரியாது, Perfekt-ல் 'ge-' சேர்க்கப்படாது!` };
  }

  /* ================= Wortaufbau: syllables + meaningful parts =================
     A word is split only where every part is real: the root must be a word in the lexicon
     (its meaning comes from that word's own entry), the suffix must fit the word class/article
     (-ung → die-noun from a verb, -er → der-noun from a verb, -lich → adjective …). Otherwise the
     word is shown as a Grundwort. Precomputed for every word by scripts/build_word_parts.py
     into js/word-parts.js; pages render it with MemoryTips.partsHTML(). */
  const PREFIX_MEANING = {
    ab: 'away, off, down', an: 'at, on; start', auf: 'up, open', aus: 'out, off', bei: 'by, with, along',
    ein: 'in, into', mit: 'with, along', nach: 'after; again', vor: 'before, in front', weg: 'away',
    zu: 'to, towards; closed', zurück: 'back', zusammen: 'together', her: 'towards here', hin: 'towards there',
    fort: 'away, onward', los: 'off; start', um: 'around; change', durch: 'through', über: 'over, across',
    unter: 'under, among', wieder: 'again, back', weiter: 'further, on', fest: 'firm, fixed', vorbei: 'past, by',
    heraus: 'out (towards here)', hinaus: 'out (away)', herein: 'in (towards here)', hinein: 'in (away)',
    herunter: 'down', hinunter: 'down (away)', herauf: 'up', hinauf: 'up (away)', hinzu: 'in addition',
    auseinander: 'apart', entgegen: 'towards, against', gegen: 'against', gegenüber: 'opposite', statt: 'place',
    teil: 'part', dar: 'there, forth', empor: 'upwards', nieder: 'down', voran: 'ahead', voraus: 'ahead, in advance',
    kennen: 'know', frei: 'free', hoch: 'high, up', wahr: 'true', bereit: 'ready', fern: 'far',
    be: 'makes the verb act on something', ent: 'away, removal (un-)', emp: 'receive (= ent- before f)',
    er: 'achieve, reach a result', ge: '(old prefix, meaning faded)', miss: 'wrongly (mis-)',
    ver: 'change; wrongly; away', zer: 'apart, to pieces', un: 'not, the opposite (un-)', ur: 'original, very old',
    haupt: 'main', neben: 'beside; side-', hinter: 'behind', zwischen: 'between', rück: 'back',
    ober: 'upper, top', innen: 'inside, inner', 'außen': 'outside, outer', aufrecht: 'upright', dazu: 'in addition, to it',
    weh: 'pain, sore', wider: 'against', voll: 'fully, completely', herbei: 'here, over here', vorher: 'before, in advance',
    'überein': 'in agreement'
  };
  // Tamil for the prefixes / suffixes (AI-assisted translation, reviewed; see scripts/word_parts_meanings.tsv for roots)
  const PREFIX_TA = {
    ab: 'விலகி, கீழே', an: 'மீது; தொடக்கம்', auf: 'மேலே, திறந்து', aus: 'வெளியே, அணைத்து', bei: 'அருகில், உடன்',
    ein: 'உள்ளே', mit: 'உடன், கூட', nach: 'பின்னால்; மீண்டும்', vor: 'முன்னால்', weg: 'விலகி, அப்பால்',
    zu: 'நோக்கி; மூடி', zurück: 'திரும்பி', zusammen: 'ஒன்றாக', her: 'இங்கே (பேசுபவரை நோக்கி)', hin: 'அங்கே (விலகி)',
    fort: 'விலகி, தொடர்ந்து', los: 'விடுபட்டு; தொடங்கி', um: 'சுற்றி; மாற்றி', durch: 'ஊடாக', über: 'மேலாக, கடந்து',
    unter: 'கீழே, இடையே', wieder: 'மீண்டும்', weiter: 'மேலும், தொடர்ந்து', fest: 'உறுதியாக', vorbei: 'கடந்து',
    heraus: 'வெளியே (இங்கே)', hinaus: 'வெளியே (அங்கே)', herein: 'உள்ளே (இங்கே)', hinein: 'உள்ளே (அங்கே)',
    herunter: 'கீழே', hinunter: 'கீழே (அங்கே)', herauf: 'மேலே', hinauf: 'மேலே (அங்கே)', hinzu: 'கூடுதலாக',
    auseinander: 'பிரிந்து', entgegen: 'எதிராக, நோக்கி', gegen: 'எதிராக', 'gegenüber': 'எதிரே', statt: 'இடம் (நடைபெறு)',
    teil: 'பங்கு', dar: 'அங்கே, முன்வைத்து', empor: 'மேல்நோக்கி', nieder: 'கீழே', voran: 'முன்னோக்கி', voraus: 'முன்கூட்டியே',
    kennen: 'அறி', frei: 'விடுதலையாக', hoch: 'உயரே', wahr: 'உண்மையாக', bereit: 'தயாராக', fern: 'தொலைவில்',
    be: 'ஒரு பொருளின் மீது செயல்', ent: 'நீக்கம், விலகல்', emp: 'பெறுதல் (f-க்கு முன் ent-)', er: 'அடைதல், விளைவு',
    ge: '(பழைய முன்னொட்டு)', miss: 'தவறாக', ver: 'மாற்றம்; தவறு; விலகல்', zer: 'துண்டுகளாக', un: 'இல்லை, எதிர்மறை',
    ur: 'மூல, மிகப் பழைய', haupt: 'முக்கிய', neben: 'அருகே; துணை', hinter: 'பின்னால்', zwischen: 'இடையில்', 'rück': 'திரும்பி',
    ober: 'மேல், உயர்', innen: 'உள்', 'außen': 'வெளி', aufrecht: 'நிமிர்ந்து', dazu: 'அதனுடன்', voll: 'முழுமையாக',
    wider: 'எதிராக', weh: 'வலி', herbei: 'அருகே', vorher: 'முன்பே', 'überein': 'ஒத்து'
  };
  const SUFFIX_TA = {
    ung: 'வினையிலிருந்து பெயர்ச்சொல்: செயல் / விளைவு', heit: 'பெயரடையிலிருந்து பெயர்ச்சொல்: தன்மை',
    keit: 'பெயரடையிலிருந்து பெயர்ச்சொல்: தன்மை', igkeit: 'பெயரடையிலிருந்து பெயர்ச்சொல்: தன்மை',
    schaft: 'குழு அல்லது நிலை', nis: 'விளைவு அல்லது நிலை', tum: 'நிலை, மண்டலம்', er: 'செய்பவர் அல்லது கருவி',
    in: 'பெண்பால் வடிவம்', chen: 'சிறிய (எப்போதும் das)', lein: 'சிறிய (எப்போதும் das)', ling: 'நபர்',
    ation: 'செயல் (ஆங்கில -ation போல)', 'ität': 'தன்மை (ஆங்கில -ity போல)', ismus: 'கொள்கை (ஆங்கில -ism போல)',
    ei: 'இடம் அல்லது செயல்', lich: 'பெயரடை ஆக்கும் (-ஆன)', ig: 'பெயரடை ஆக்கும்: …உள்ள', isch: 'பெயரடை ஆக்கும் (-ஆன)',
    bar: 'செய்யக்கூடிய', los: 'இல்லாத, அற்ற', voll: 'நிறைந்த', sam: 'இயல்புடைய', haft: 'போன்ற', reich: 'நிறைந்த, வளமான',
    frei: 'இல்லாத (-free)', 'mäßig': 'ஏற்ப, முறைப்படி', end: 'நிகழ்கால வினையெச்சம்: …கின்ற', ieren: 'வினைச்சொல் முடிவு (பெரும்பாலும் அயல்மொழி)'
  };
  const SUFFIX_MEANING = {
    ung: 'turns a verb into a noun: the act or result (like English -ing / -tion)',
    heit: 'turns an adjective into a noun: the state of being … (-ness / -hood)',
    keit: 'turns an adjective into a noun: the quality of being … (-ness / -ity)',
    igkeit: 'turns an adjective into a noun: the quality of being … (-ness)',
    schaft: 'a group or a state (-ship / -hood)', nis: 'result or state (-ness / -ment)', tum: 'state, realm (-dom)',
    er: 'person or tool that does it (like English -er)', in: 'female form of a person',
    chen: 'small / cute — always das', lein: 'small / cute — always das', ling: 'a person (like -ling)',
    ation: 'like English -ation', 'ität': 'like English -ity', ismus: 'like English -ism', ei: 'place or activity',
    lich: 'makes an adjective (like -ly / -like)', ig: 'makes an adjective: having … (like -y)',
    isch: 'makes an adjective (like -ish / -ic)', bar: 'can be …-ed (like -able)', los: 'without (like -less)',
    voll: 'full of (like -ful)', sam: 'tending to (like -some)', haft: 'like, having the nature of',
    reich: 'rich in', frei: 'free of (-free)', 'mäßig': 'according to', end: 'present participle: …-ing',
    ieren: 'verb ending (mostly foreign roots)'
  };
  // suffix, word class of the word, base classes tried in order, extra check
  const SUFFIX_RULES = [
    ['igkeit', 'n', ['adj'], e => e.a === 'die'], ['schaft', 'n', ['n', 'adj'], e => e.a === 'die'],
    ['ismus', 'n', ['n', 'adj'], e => e.a === 'der'], ['ation', 'n', ['v-ieren'], e => e.a === 'die'],
    ['heit', 'n', ['adj', 'n'], e => e.a === 'die'], ['keit', 'n', ['adj'], e => e.a === 'die'],
    ['chen', 'n', ['n'], e => e.a === 'das'], ['lein', 'n', ['n'], e => e.a === 'das'],
    ['ling', 'n', ['v', 'adj', 'n'], e => e.a === 'der'], ['ität', 'n', ['adj'], e => e.a === 'die'],
    ['ung', 'n', ['v'], e => e.a === 'die'], ['nis', 'n', ['v', 'adj'], e => e.a === 'die' || e.a === 'das'],
    ['tum', 'n', ['adj', 'v', 'n'], () => true], ['ei', 'n', ['n', 'v'], e => e.a === 'die'],
    ['er', 'n', ['v'], e => e.a === 'der'], ['in', 'n', ['n'], e => e.a === 'die' && /innen$/.test(String(e.p || ''))],
    ['mäßig', 'adj', ['n'], () => true], ['lich', 'adj', ['n', 'v', 'adj'], () => true], ['isch', 'adj', ['n'], () => true],
    ['haft', 'adj', ['n', 'adj'], () => true], ['reich', 'adj', ['n'], () => true], ['frei', 'adj', ['n'], () => true],
    ['voll', 'adj', ['n'], () => true], ['los', 'adj', ['n', 'v'], () => true], ['bar', 'adj', ['v', 'n'], () => true],
    ['sam', 'adj', ['v', 'n', 'adj'], () => true], ['end', 'adj', ['v'], () => true], ['ig', 'adj', ['n', 'v'], () => true],
    ['ieren', 'v', ['n', 'adj'], () => true]
  ];
  const ALL_PREFIXES = Object.keys(PREFIX_MEANING).filter(p => !['un', 'ur', 'haupt', 'neben', 'hinter', 'zwischen', 'rück'].includes(p))
    .sort((a, b) => b.length - a.length);
  const deUmlaut = s => s.replace(/äu/g, 'au').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u');
  const gloss = en => { const g = String(en || '').replace(/\([^)]*\)/g, '').split(/;/)[0].replace(/\s*\/\s*/g, ', ').trim(); return g.length > 48 ? g.slice(0, 46).replace(/,[^,]*$/, '') : g; };

  // App words first (with their learner meaning), then Ding roots within a frequency limit.
  const gV = (k, maxRank) => V.get(k) || (RV.has(k) && RV.get(k)[1] <= (maxRank || 1e9) ? { w: k, en: RV.get(k)[0], _root: true } : null);
  const gN = (k, maxRank) => N.get(k) || (RN.has(k) && RN.get(k)[3] <= (maxRank || 1e9) ? { w: RN.get(k)[0], _sg: RN.get(k)[0], a: RN.get(k)[1], en: RN.get(k)[2], p: '', _root: true } : null);
  const gA = (k, maxRank) => A.get(k) || (RA.has(k) && RA.get(k)[1] <= (maxRank || 1e9) ? { w: k, en: RA.get(k)[0], _root: true } : null);
  // Words that look derived but aren't (Mädchen is not Made + -chen, Zucker is not zucken + -er).
  const NO_SPLIT = new Set(['mädchen', 'märchen', 'kaninchen', 'veilchen', 'zucker', 'bürger', 'körper', 'sommer', 'wetter', 'messer',
    'mutter', 'vater', 'bruder', 'schwester', 'tochter', 'butter', 'feuer', 'wasser', 'fenster', 'zimmer', 'theater', 'ufer', 'meer',
    'heimat', 'monat', 'arbeit', 'schlauberger', 'wichtig', 'topisch', 'offenbar', 'hochzeit', 'mahlzeit', 'ereignis', 'gebäude', 'bedingung', 'verein', 'vergnügen']);
  // The app's learner meaning first, plus Ding's main sense when it adds something (treiben: "do, chase; to drive").
  const dingGloss = w => { const k = String(w).toLowerCase(); return (RV.get(k) || [])[0] || (RN.get(k) || [])[2] || (RA.get(k) || [])[0] || ''; };
  const normG = g => String(g).toLowerCase().replace(/\bto\s+/g, '').replace(/[^a-zäöüß ]/g, ' ').replace(/\s+/g, ' ').trim();
  function mergeGloss(appEn, ding) {
    const a = gloss(appEn), first = String(ding || '').split(',')[0].trim();
    if (!a) return gloss(ding);
    return first && !normG(a).includes(normG(first)) && !normG(first).includes(normG(a)) ? `${a}; ${first}` : a;
  }
  const root = (w, en) => ({ t: w, k: 'root', m: mergeGloss(en, dingGloss(w)) });
  const pre = p => ({ t: p + '-', k: 'prefix' });
  const suf = s => ({ t: '-' + s, k: 'suffix' });

  function findVerb(stem, maxRank) {
    if (stem.length < 2) return null;
    const c = [stem + 'en', stem + 'n', stem.replace(/([^aeiouäöü])([lr])$/, '$1e$2') + 'n'];
    const du = deUmlaut(stem); if (du !== stem) c.push(du + 'en', du + 'n');
    for (const k of c) { const v = V.get(k); if (v && k.length >= 4) return { key: k, v }; }
    for (const k of c) { const v = gV(k, maxRank); if (v && k.length >= 4) return { key: k, v }; }
    return null;
  }
  function findNoun(stem) {
    // closest spelling first (nöt|ig -> Not, not Note); per variant an app word beats a Ding root
    const c = [stem, deUmlaut(stem), stem.replace(/s$/, ''), stem.replace(/es$/, ''), stem.replace(/n$/, ''), stem.replace(/en$/, ''), stem + 'e', deUmlaut(stem) + 'e'];
    for (const k of c) { if (k.length >= 3 && (N.get(k) || gN(k, 20000))) return N.get(k) || gN(k, 20000); }
    return null;
  }
  function findAdj(stem) {
    const c = [stem, stem + 'e', stem.replace(/([^aeiouäöü])([lr])$/, '$1e$2')].filter(k => k.length >= 3);
    for (const k of c) { if (A.get(k)) return A.get(k); }
    for (const k of c) { if (gA(k)) return gA(k); }
    return null;
  }

  // Parts of a verb infinitive token (lower case), e.g. "abtreiben" -> ab- + treiben.
  function verbTokenParts(tok, depth) {
    const e = V.get(tok);
    if (e && e._x && (e._x.sep || e._x.insep)) {
      const px = e._x.sep || e._x.insep, rootEntry = V.get(e._x.root);
      if (rootEntry) return prefixParts(px).concat(verbTokenParts(e._x.root, depth + 1));
    }
    for (const p of ALL_PREFIXES) {                        // morphological: prefix + a real verb
      if (!tok.startsWith(p) || tok.length - p.length < 4) continue;
      const rest = tok.slice(p.length);
      if (gV(rest)) return prefixParts(p).concat(verbTokenParts(rest, depth + 1));
    }
    const ve = e || gV(tok);
    return [root(tok, ve ? ve.en : '')];
  }
  function prefixParts(px) {                               // "wiederher" -> wieder- + her-
    if (PREFIX_MEANING[px]) return [pre(px)];
    for (const p of ALL_PREFIXES) if (px.startsWith(p) && PREFIX_MEANING[px.slice(p.length)]) return [pre(p), pre(px.slice(p.length))];
    return [pre(px)];
  }
  function stemVerbParts(stem, depth, maxRank) {           // stem of a derived word -> verb parts
    const f = findVerb(stem, maxRank);
    if (f) return verbTokenParts(f.key, depth);
    for (const p of ALL_PREFIXES) {
      if (!stem.startsWith(p) || stem.length - p.length < 3) continue;
      const g = findVerb(stem.slice(p.length), maxRank);
      if (g) return prefixParts(p).concat(verbTokenParts(g.key, depth + 1));
    }
    return null;
  }

  function derive(l, cat, e, depth) {
    for (const [sx, wc, bases, ok] of SUFFIX_RULES) {
      if (wc !== cat || !l.endsWith(sx) || l.length < sx.length + 3 || !ok(e)) continue;
      const stem = l.slice(0, -sx.length);
      for (const b of bases) {
        let parts = null;
        if (b === 'v') parts = stemVerbParts(stem, depth, sx === 'er' ? 12000 : 0);   // -er: only common verbs
        else if (b === 'v-ieren') { const v = gV(stem + 'ieren'); if (v) parts = [root(stem + 'ieren', v.en)]; }
        else if (b === 'n') { const n = findNoun(stem); if (n) parts = nounParts(n, depth + 1); }
        else if (b === 'adj') {
          let a = findAdj(stem);
          if (!a && sx === 'igkeit') a = null;
          if (a) parts = adjParts(a, depth + 1);
        }
        if (parts) return parts.concat(suf(sx));
      }
    }
    return null;
  }
  function nounParts(n, depth) { const r = depth <= 3 ? decomposeNoun(n._sg || n.w, n.a, n.p, n.en, depth) : null; return r || [root(n._sg || n.w, n.en)]; }
  function adjParts(a, depth) { const r = depth <= 3 ? decomposeAdj(String(a.w).toLowerCase(), a.en, depth) : null; return r || [root(String(a.w).toLowerCase(), a.en)]; }

  function headParts(head, depth) {
    if (!head.kind) return [pre(head.de)];
    if (head.kind === 'n') { const n = gN(head.de.toLowerCase()); return n ? nounParts(n, depth + 1) : [root(head.de, head.en)]; }
    if (head.kind === 'v') { const tok = head.de.toLowerCase().replace(/^sich\s+/, ''); return verbTokenParts(verbToken(tok), depth + 1); }
    const a = gA(head.de.toLowerCase()); return a ? adjParts(a, depth + 1) : [root(head.de, head.en)];
  }

  function decomposeNoun(sg, a, p, en, depth) {
    const l = sg.toLowerCase();
    if (NO_SPLIT.has(l)) return null;
    const d = derive(l, 'n', { a, p }, depth);
    if (d) return d;
    const c = splitCompound(sg, a, true);
    if (c) {
      const tail = nounParts(c.tail, depth + 1);
      return headParts(c.head, depth).concat(c.glue ? [{ t: c.glue, k: 'glue' }] : [], tail);
    }
    // noun from a verb without a suffix: der Besuch – besuchen, der Kauf – kaufen
    const f = depth === 0 ? findVerb(l) : null;          // inside a compound, Teil stays Teil (not ~teilen)
    if (f && f.key !== l && !f.v._root) return verbTokenParts(f.key, depth).map(x => x.k === 'root' ? Object.assign({}, x, { k: 'related' }) : x);
    return null;
  }
  function decomposeAdj(l, en, depth) {
    if (NO_SPLIT.has(l)) return null;
    const d = derive(l, 'adj', {}, depth);
    if (d) return d;
    if (/^un/.test(l) && l.length > 5 && gA(l.slice(2))) return [pre('un')].concat(adjParts(gA(l.slice(2)), depth + 1));
    // participles used as adjectives: gebraucht – brauchen, verheiratet – heiraten
    const pv = VLIST.find(o => o._x.part === l && !/\s/.test(o.w));
    if (pv) return verbTokenParts(pv._x.tok, depth).map(x => x.k === 'root' ? Object.assign({}, x, { k: 'related', note: 'Partizip II' }) : x);
    // adjective compounds: umwelt|freundlich, hilfs|bereit
    for (let i = 3; i <= l.length - 3; i++) {
      if (SUFFIX_MEANING[l.slice(i)]) continue;            // furcht|bar is Furcht + -bar, not + bar 'cash'
      const tailA = gA(l.slice(i)); if (!tailA) continue;
      const head = recognizeHead(l.slice(0, i), true); if (!head) continue;
      return headParts(head, depth).concat(head.glue ? [{ t: head.glue, k: 'glue' }] : [], adjParts(tailA, depth + 1));
    }
    return null;
  }

  // Hand-checked splits where the automatic rules pick a wrong root (Aus|sage is aussagen, not Sage 'legend').
  const PARTS_OVERRIDE = {
    'n|Aussage': [pre('aus'), root('sagen', 'to say')], 'n|Umzugskarton': [root('Umzug', 'move'), { t: 's', k: 'glue' }, root('Karton', 'cardboard box')],
    'n|Bohrplattform': [root('bohren', 'to drill'), root('Plattform', 'platform')], 'v|fotografieren': [root('Fotograf', 'photographer'), suf('ieren')],
    'adj|einsam': [root('ein', 'one'), suf('sam')], 'n|Alleingang': [root('allein', 'alone'), root('Gang', 'walk, course')]
  };

  // -> {parts:[{t,k,m}], simple} for one entry; cat 'v' | 'n' | 'adj' | 'p'
  function wordParts(cat, e) {
    const raw = String(e.w || '').replace(/\([^)]*\)/g, ' ').trim();
    if (!raw || cat === 'p') return null;
    const ov = PARTS_OVERRIDE[cat + '|' + raw];
    if (ov) return ov.map(x => Object.assign({}, x));
    let parts = null;
    try {
      if (cat === 'v') {
        const toks = raw.split(/\s+/), tok = verbToken(raw);
        let vp = verbTokenParts(tok, 0);
        if (/ieren$/.test(tok) && vp.length === 1) vp = derive(tok, 'v', {}, 1) || vp;
        parts = [];
        for (const t of toks) {                              // keep the phrase's word order
          const lt = t.toLowerCase();
          if (lt === tok) parts.push(...vp);
          else if (lt === 'sich') parts.push({ t: 'sich', k: 'word', m: 'oneself (reflexive)' });
          else if (PREPS.has(lt)) parts.push({ t, k: 'word', m: 'fixed preposition' });
          else if (FILLER.has(lt) || /^(etw|jdn|jdm|jds)\./.test(lt)) continue;   // "etw." is a placeholder, not a part
          else { const o = N.get(lt) || A.get(lt) || V.get(lt); parts.push({ t, k: 'word', m: o ? gloss(o.en) : '' }); }
        }
        if (parts.length === 1) parts = null;
      } else if (cat === 'n') {
        const sg = cleanNoun(raw);
        if (/^[A-Za-zÄÖÜäöüß]+$/.test(sg)) parts = decomposeNoun(sg, (e.a || '').trim(), expandPlural(sg, e.p), e.en, 0);
      } else if (cat === 'adj') {
        const l = raw.toLowerCase();
        if (/^[a-zäöüß]+$/.test(l)) parts = decomposeAdj(l, e.en, 0);
      }
    } catch (_) { parts = null; }
    if (parts && parts.length < 2 && !(parts[0] && parts[0].k === 'related')) parts = null;
    return parts;
  }

  // Compact storage used by js/word-parts.js: "ab-", "-ung", "+s", "treiben=to drive", "~kaufen=to buy"
  function encodeParts(parts) {
    return parts.map(x => x.k === 'prefix' || x.k === 'suffix' ? x.t : x.k === 'glue' ? '+' + x.t
      : (x.k === 'related' ? '~' : '') + x.t + (x.m ? '=' + x.m : ''));
  }
  function decodePart(s) {
    if (/^-/.test(s)) { const k = s.slice(1); return { t: s, k: 'suffix', m: SUFFIX_MEANING[k] || '', ta: SUFFIX_TA[k] || '' }; }
    if (/-$/.test(s)) { const k = s.slice(0, -1); return { t: s, k: 'prefix', m: PREFIX_MEANING[k] || '', ta: PREFIX_TA[k] || '' }; }
    if (/^\+/.test(s)) return { t: '-' + s.slice(1) + '-', k: 'glue', m: 'linking letter(s) between the two words', ta: 'இணைப்பு எழுத்து' };
    const rel = s[0] === '~', body = rel ? s.slice(1) : s, i = body.indexOf('=');
    const rest = i < 0 ? '' : body.slice(i + 1), j = rest.indexOf('@');
    return { t: i < 0 ? body : body.slice(0, i), k: rel ? 'related' : 'root', m: j < 0 ? rest : rest.slice(0, j), ta: j < 0 ? '' : rest.slice(j + 1) };
  }

  const cleanKey = w => String(w || '').replace(/\([^)]*\)/g, ' ').replace(/^(der|die|das)\s+/i, '').replace(/\s+/g, ' ').trim();
  function lookupParts(cat, w) {
    const data = global.WORD_PARTS || {};
    const k = cleanKey(w);
    const hit = data[cat + '|' + k] || data['v|' + k] || data['n|' + k] || data['adj|' + k] || data['p|' + k];
    if (!hit) return null;
    return { word: k, syl: hit[0] || k, parts: hit[1] ? hit[1].map(decodePart) : null };
  }
  function partsText(cat, w) {
    const r = lookupParts(cat, w);
    if (!r) return '';
    return r.syl + (r.parts ? ' — ' + r.parts.map(p => p.t + (p.m || p.ta ? ` (${[p.m, p.ta].filter(Boolean).join(' / ')})` : '')).join(' + ') : '');
  }
  function partsHTML(cat, w) {
    const r = lookupParts(cat, w);
    if (!r) return '';
    const items = r.parts ? r.parts.map(p => `<li><b>${esc(p.t)}</b>${p.m ? ` <span style="opacity:.8">(${esc(p.m)})</span>` : ''}${p.ta ? ` · <span lang="ta" style="color:var(--gold, #b98a2e);">${esc(p.ta)}</span>` : ''}${p.k === 'related' ? ' <i style="opacity:.7">— related word</i>' : ''}</li>`).join('') : '';
    return `<div class="wordparts" style="margin:8px 0; padding:8px 10px; border:1px solid var(--line, #e2e8f0); border-left:3px solid var(--blue, #2563eb); border-radius:6px; font-size:13px; line-height:1.5; text-align:left;">
      <div><b>🧩 Wortaufbau:</b> <span style="font-size:15px; letter-spacing:.3px;">${esc(r.syl)}</span></div>
      ${items ? `<div style="margin-top:3px;">Related parts:</div><ul style="margin:2px 0 0 18px; padding:0;">${items}</ul>
        <div style="margin-top:3px; font-size:10.5px; opacity:.6;">Tamil for the parts: AI-assisted translation, reviewed.</div>`
        : (cat === 'p' || /\s/.test(r.word) ? '' : `<div style="opacity:.8; margin-top:2px;">Grundwort — a basic word, not built from smaller parts.</div>`)}
    </div>`;
  }

  global.MemoryTips = { PREFIX_TA, SUFFIX_TA, wordParts, encodeParts, lookupParts, partsHTML, partsText, cleanKey, PREFIX_MEANING, SUFFIX_MEANING,
    init, forWord, cheatCodes, verbLinguistics, splitCompound, verbInfo, pluralClass, entryFrom,
    ready: () => VLIST.length + NLIST.length + ALIST.length > 0, suffixStats: () => SUFFIX_STATS, _lex: () => ({ V, N, A }) };
})(typeof window !== 'undefined' ? window : globalThis);
