# -*- coding: utf-8 -*-
"""Check the shared word lists (js/word-data.js) and that no page carries its own copy again.

Since Task 38 VERBS/NOUNS/ADJS live only in js/word-data.js (DC_WORDS.VERBS / NOUNS / ADJS); every page
that uses them loads that file. Before, the lists were copied into 8 pages and had to be kept in sync.
Checks: the three lists parse and have no duplicate words; no page defines a non-empty VERBS / ALL_VERBS /
VERBS_ALL / NOUNS / ADJS array of its own; every page that reads DC_WORDS loads js/word-data.js; the home
flashcards contain every word (in their own lessons or in SYNCED_WORDS).

Exit code 1 (with a report) if anything is wrong.  Run: python3 scripts/check_vocab_sync.py
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORD_DATA = 'js/word-data.js'
CANON = {
    'v': (WORD_DATA, 'VERBS', 'inf'),
    'n': (WORD_DATA, 'NOUNS', 'sg'),
    'a': (WORD_DATA, 'ADJS', 'w'),
}
COPIES = {'v': [], 'n': [], 'a': []}   # no copies any more (Task 38)
PAGE_ARRAYS = ('VERBS', 'ALL_VERBS', 'VERBS_ALL', 'NOUNS', 'ADJS')
HOME_CAT = {'v': 'v', 'n': 'n', 'a': 'adj'}


def load(fname, name):
    html = open(os.path.join(ROOT, fname), encoding='utf-8').read()
    m = re.search(r'(?:(?:const|let|var) |DC_WORDS\.)' + name + r' = \[', html)
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
        entries = load(cfile, cname)
        if entries is None or entries == 'unparseable':
            problems.append(f'{cfile}: {cname} ' + ('not found' if entries is None else 'is not a JSON list'))
            continue
        words = [e[key] for e in entries]
        dup = sorted({w for w in words if words.count(w) > 1})
        if dup:
            problems.append(f'{cfile}:{cname} has duplicate words, e.g. {dup[:5]}')
        lacking = [w for w in words if re.sub(r'^(der|die|das)\s+', '', w.strip().lower()) not in home]
        if lacking:
            problems.append(f'deutsch-coach.html flashcards lack {len(lacking)} {cname} words, e.g. {lacking[:5]}')
    for fname in sorted(f for f in os.listdir(ROOT) if f.endswith('.html')):
        html = open(os.path.join(ROOT, fname), encoding='utf-8').read()
        for name in PAGE_ARRAYS:
            own = load(fname, name)
            if isinstance(own, list) and own:
                problems.append(f'{fname} defines its own {name} ({len(own)} words) - use DC_WORDS.{name} from {WORD_DATA}')
        if 'DC_WORDS' in html and WORD_DATA not in html:
            problems.append(f'{fname} reads DC_WORDS but does not load {WORD_DATA}')
    if problems:
        print('Word lists have problems:\n  ' + '\n  '.join(problems))
        sys.exit(1)
    print('Word lists OK (' + WORD_DATA + '): ' + ', '.join(f'{CANON[k][1]} {len(load(*CANON[k][:2]))}' for k in CANON))


if __name__ == '__main__':
    main()
