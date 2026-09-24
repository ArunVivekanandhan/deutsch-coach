# -*- coding: utf-8 -*-
"""Check that every copy of the word lists matches its canonical trainer list.

The app has no shared data module: VERBS/NOUNS/ADJS are copied into several pages. Canonical:
  VERBS -> Verb_Transformation_Trainer.html   NOUNS -> Nomen_Trainer.html
  ADJS  -> Adjektiv_Adverb_Trainer.html
Each copy must contain exactly the same words with the same field values (a copy may carry
extra page-specific fields, e.g. ADJS "comp"). The home flashcards must contain every word,
either in their own lessons or in SYNCED_WORDS.

Exit code 1 (with a report) if anything differs.  Run: python3 scripts/check_vocab_sync.py
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON = {
    'v': ('Verb_Transformation_Trainer.html', 'VERBS', 'inf'),
    'n': ('Nomen_Trainer.html', 'NOUNS', 'sg'),
    'a': ('Adjektiv_Adverb_Trainer.html', 'ADJS', 'w'),
}
COPIES = {
    'v': [('Continuous_Verb_Speaker.html', 'ALL_VERBS'), ('Deutsch_Wortschatz_Excel_Sheet.html', 'VERBS'),
          ('Verben_Hoeren_EN_DE.html', 'VERBS'), ('Wortschatz_Master_Grid.html', 'VERBS'),
          ('Thema_Sprech_Trainer.html', 'VERBS_ALL')],
    'n': [('Deutsch_Wortschatz_Excel_Sheet.html', 'NOUNS'), ('Wortschatz_Master_Grid.html', 'NOUNS')],
    'a': [('Deutsch_Wortschatz_Excel_Sheet.html', 'ADJS'), ('Wortschatz_Master_Grid.html', 'ADJS')],
}
HOME_CAT = {'v': 'v', 'n': 'n', 'a': 'adj'}


def load(fname, name):
    html = open(os.path.join(ROOT, fname), encoding='utf-8').read()
    m = re.search(r'(?:const|let|var) ' + name + r' = \[', html)
    if not m:
        return None
    s = m.end() - 1
    depth, in_str, esc = 0, False, False
    for i in range(s, len(html)):
        c = html[i]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == '"': in_str = False
        elif c == '"': in_str = True
        elif c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(html[s:i + 1])
                except ValueError:
                    return 'unparseable'


def home_words():
    """Words the home flashcards already have: every  w  in the page plus SYNCED_WORDS."""
    html = open(os.path.join(ROOT, 'deutsch-coach.html'), encoding='utf-8').read()
    words = set()
    for w in re.findall(r'"w":\s*"([^"]+)"', html) + re.findall(r'\bw:"([^"]+)"', html):
        words.add(re.sub(r'^(der|die|das)\s+', '', w.strip().lower()))
    return words


def main():
    problems = []
    home = home_words()
    for kind, (cfile, cname, key) in CANON.items():
        canon = {e[key]: e for e in load(cfile, cname)}
        for fname, name in COPIES[kind]:
            copy = load(fname, name)
            if copy is None or copy == 'unparseable':
                problems.append(f'{fname}: {name} ' + ('not found' if copy is None else 'is not a JSON list'))
                continue
            keys = {e[key] for e in copy}
            missing, extra = set(canon) - keys, keys - set(canon)
            if missing:
                problems.append(f'{fname}:{name} missing {len(missing)} words, e.g. {sorted(missing)[:5]}')
            if extra:
                problems.append(f'{fname}:{name} has {len(extra)} words not in {cfile}, e.g. {sorted(extra)[:5]}')
            differ = [e[key] for e in copy if e[key] in canon
                      and any(canon[e[key]].get(f) != v for f, v in e.items() if f in canon[e[key]])]
            if differ:
                problems.append(f'{fname}:{name} {len(differ)} words differ from {cfile}, e.g. {differ[:5]}')
        lacking = [w for w in canon if re.sub(r'^(der|die|das)\s+', '', w.strip().lower()) not in home]
        if lacking:
            problems.append(f'deutsch-coach.html flashcards lack {len(lacking)} {cname} words, e.g. {lacking[:5]}')
    if problems:
        print('Vocabulary copies are out of sync:\n  ' + '\n  '.join(problems))
        sys.exit(1)
    print('Vocabulary copies in sync: ' + ', '.join(f'{CANON[k][1]} {len(load(*CANON[k][:2]))}' for k in CANON))


if __name__ == '__main__':
    main()
