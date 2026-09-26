# -*- coding: utf-8 -*-
"""Check the adjective comparison forms in js/word-data.js (DC_WORDS.ADJS) against German rules:
komp = stem + er (dunkel → dunkler, teuer → teurer, umlaut for alt/kurz/…), sup = am + stem + sten, -esten after d/t/s/ß/x/z/sch,
but -sten for present participles (spannendsten) and unstressed -isch (praktischsten); gut/viel/gern/hoch/nah/groß irregular.
typ must be regular | umlaut | irregular | none; "none" (not comparable: tot, verheiratet, kostenlos …) has empty forms.
Run: python3 scripts/check_adjectives.py"""
import json, os, subprocess, sys
IRR = {'gut': ('besser', 'am besten'), 'viel': ('mehr', 'am meisten'), 'gern': ('lieber', 'am liebsten'),
       'hoch': ('höher', 'am höchsten'), 'nah': ('näher', 'am nächsten'), 'groß': ('größer', 'am größten'),
       'wenig': ('weniger', 'am wenigsten'), 'bald': ('eher', 'am ehesten'), 'oft': ('öfter', 'am öftesten')}
UML = {'alt', 'arm', 'dumm', 'grob', 'hart', 'jung', 'kalt', 'klug', 'krank', 'kurz', 'lang', 'scharf', 'schwach',
       'stark', 'warm', 'fromm', 'krumm', 'schwarz', 'rot', 'gesund', 'nass', 'schmal', 'glatt', 'blass', 'bang', 'karg',
       'grob', 'stumm', 'ungesund'}
# words where both forms are correct (Duden): umlaut optional
UML_OPT = {'rot', 'gesund', 'nass', 'schmal', 'glatt', 'blass', 'bang', 'karg', 'fromm', 'krumm', 'stumm', 'ungesund'}
# stressed final -sch / monosyllables that take -esten
SCH_E = {'frisch', 'hübsch', 'rasch', 'falsch', 'barsch', 'lasch', 'forsch', 'harsch', 'krass', 'wüst'}
VOWELS = 'aeiouäöüy'

def komp_of(w, stem):
    if w.endswith('el'): return w[:-2] + 'ler'                       # dunkel → dunkler
    if w.endswith('er') and len(w) > 3 and w[-3] in 'uiy' and w[-4:-2] in ('eu', 'au', 'ai', 'ei', 'äu'): return w[:-2] + 'rer'  # teuer, sauer
    return stem + 'er'

def sup_suffix(stem, w):
    """-esten or -sten (returns list of accepted suffixes)."""
    if w.endswith('end') and len(w) > 5: return ['sten']              # spannend (Partizip I)
    if w.endswith('isch') and w not in SCH_E: return ['sten']         # praktisch (unstressed)
    if w in SCH_E: return ['esten']
    if stem[-1] in 'dtsßxz' or stem.endswith('sch'): return ['esten']
    if stem[-1] in VOWELS or stem.endswith('h') and stem[-2] in VOWELS: return ['esten', 'sten']   # neu, frei, froh
    return ['sten']

ALT = {'fit': ('fitter', 'am fittesten')}          # regular, but the loanword doubles its consonant

def expected(w):
    if w in IRR: return [IRR[w]]
    if w in ALT: return [ALT[w]]
    if w.endswith('e'):                                               # leise, müde, marode
        return [(w + 'r', 'am ' + w + ('sten' if w[-2] not in 'dtsßxz' else 'sten'))]
    out = []
    stems = [w]
    if w in UML:
        um = w.replace('au', 'äu', 1) if 'au' in w else None
        if um is None:
            for i, c in enumerate(w):
                if c in 'aou':
                    um = w[:i] + {'a': 'ä', 'o': 'ö', 'u': 'ü'}[c] + w[i + 1:]; break
        stems = [um] + ([w] if w in UML_OPT else [])
    for st in stems:
        k = komp_of(st, st)
        for suf in sup_suffix(st, w):
            base = st[:-2] + 'el' if False else st
            out.append((k, 'am ' + base + suf))
    return out

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if __name__ == '__main__':
    A = json.loads(subprocess.check_output(['node', '-e', "global.window=global;require('./js/word-data.js');process.stdout.write(JSON.stringify(DC_WORDS.ADJS))"], cwd=ROOT))
    errs, seen = [], set()
    for a in A:
        w, k, s, t = a['w'], a.get('komp', ''), a.get('sup', ''), a.get('typ')
        if w in seen: errs.append(f'{w}: duplicate')
        seen.add(w)
        if not w or any(c in w for c in '()=/'): errs.append(f'{w!r}: word must be a plain adjective (no notes in "w")')
        if t not in ('regular', 'umlaut', 'irregular', 'none'): errs.append(f'{w}: unknown typ {t!r}')
        if t == 'none':
            if k or s: errs.append(f'{w}: typ none but has forms {k}, {s}')
            continue
        if (k, s) not in expected(w): errs.append(f'{w}: {k}, {s} — expected {" or ".join(" / ".join(x) for x in expected(w))}')
        want = 'irregular' if w in IRR else ('umlaut' if any(c in k and c not in w for c in 'äöü') else 'regular')
        if t != want: errs.append(f'{w}: typ {t} — expected {want}')
    if errs:
        print(f'Adjectives: {len(errs)} problem(s)'); [print('  ' + e) for e in errs[:40]]; sys.exit(1)
    print(f"OK: adjective forms valid ({len(A)} adjectives, {sum(1 for a in A if a.get('typ') == 'none')} not comparable).")
