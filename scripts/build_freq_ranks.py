# -*- coding: utf-8 -*-
"""Rebuild FREQ_RANK in Deutsch_Wortschatz_Excel_Sheet.html.

Frequency source: hermitdave/FrequencyWords, OpenSubtitles 2018, German top 50k word forms
(https://github.com/hermitdave/FrequencyWords, content licensed CC-BY-SA-4.0).

The list counts word *forms*, so each entry's count is the sum of its real forms from our data
(verb: infinitive + Präteritum + participle; noun: singular + plural; adjective: base + common
endings + comparative + superlative). Phrase entries ("fertig sein", "führen zu", "sich bemühen")
ignore their own preposition/"sich", and are capped at their rarest content word. That total is
converted to the position it would take in the 50k list. 0 means "not among the 50,000 most
frequent forms".

Run after adding words:  python3 scripts/build_freq_ranks.py
"""
import bisect, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, 'Deutsch_Wortschatz_Excel_Sheet.html')
URL = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_50k.txt'


def load_counts():
    with urllib.request.urlopen(URL, timeout=60) as r:
        text = r.read().decode('utf-8')
    counts = {}
    for line in text.splitlines():
        if ' ' in line:
            w, c = line.rsplit(' ', 1)
            counts[w] = int(c)
    return counts


def array(html, name):
    m = f'const {name} = ['
    s = html.index(m) + len(m) - 1
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
                return json.loads(html[s:i + 1])


REFLEXIVE = {'sich'}
FILLER = {'etw.', 'etw', 'etwas', 'jmdn.', 'jmdm.', 'jmdn', 'jmdm', 'jemanden', 'jemandem', 'ugs.'}
PREPOSITIONS = {'zu', 'auf', 'für', 'von', 'über', 'mit', 'an', 'in', 'um', 'aus', 'bei', 'nach', 'vor', 'gegen'}
ARTICLES = {'eine', 'einen', 'einem', 'einer'}


def words(t):
    """Lower-cased tokens with (notes) removed; 'a = b' keeps a; 'x/y/z' yields all variants."""
    t = re.sub(r'\(.*?\)', ' ', (t or '').lower()).split('=')[0]
    return [w for w in re.split(r'[\s/]+', t) if re.fullmatch(r"[a-zäöüß-]+\.?", w)]


def verb_count(v, count):
    inf = words(v['inf'])
    own_preps = {w for w in inf if w in PREPOSITIONS} if len(inf) > 1 else set()
    drop = REFLEXIVE | FILLER | own_preps
    core = [w for w in inf if w not in drop]
    if not core:
        return 0
    verb, content = core[-1], core[:-1]            # "fertig sein" -> verb sein, content fertig
    drop_all = drop | ARTICLES | set(content)
    forms = {verb}
    perfekt = [w for w in words(v.get('perfekt'))[1:] if w not in drop_all]
    if perfekt:
        forms.add(perfekt[-1])                      # participle
    praet = [w for w in words(v.get('praeteritum')) if w not in drop_all]
    if len(praet) == 1:                             # separable verbs split in text ("kam ... zurück"): skip
        forms.add(praet[0])
    total = sum(count(f) for f in forms)
    # a phrase can't be more frequent than its rarest content word
    return min([total] + [count(c) for c in content])


def noun_count(n, count):
    forms = set(words(n['sg']))
    if n.get('pl') and n['pl'] not in ('—', '-'):
        forms |= set(words(n['pl']))
    return sum(count(f) for f in forms)


def adj_count(a, count):
    forms = set()
    for w in words(a['w']):
        forms.add(w)
        stem = w[:-4] + 'eur' if w.endswith('euer') else w[:-2] + 'l' if w.endswith('el') else w
        forms |= {w + e for e in ('n', 'r', 's', 'm')} if w.endswith('e') else {stem + e for e in ('e', 'en', 'er', 'es', 'em')}
    forms |= set(words(a.get('komp') or a.get('comp') or ''))
    sup = words(a.get('sup'))
    if sup:
        forms.add(sup[-1])
    return sum(count(f) for f in forms)


def main():
    counts = load_counts()
    ascending = sorted(counts.values())
    html = open(PAGE, encoding='utf-8').read()
    count = lambda w: counts.get(w, 0)
    ranks = {}
    for prefix, name, key, fn in (('v', 'VERBS', 'inf', verb_count), ('n', 'NOUNS', 'sg', noun_count), ('a', 'ADJS', 'w', adj_count)):
        for e in array(html, name):
            total = fn(e, count)
            ranks[f'{prefix}|{e[key]}'] = (len(ascending) - bisect.bisect_right(ascending, total) + 1) if total else 0
    line = 'const FREQ_RANK = ' + json.dumps(ranks, ensure_ascii=False, separators=(',', ':')) + ';'
    new_html, n = re.subn(r'const FREQ_RANK = \{.*?\};', lambda _: line, html, count=1, flags=re.S)
    if n != 1:
        sys.exit('FREQ_RANK declaration not found in page')
    open(PAGE, 'w', encoding='utf-8').write(new_html)
    found = sum(1 for r in ranks.values() if r)
    print(f'FREQ_RANK: {len(ranks)} entries, {found} found in top-50k, {len(ranks) - found} rarer')


if __name__ == '__main__':
    main()
