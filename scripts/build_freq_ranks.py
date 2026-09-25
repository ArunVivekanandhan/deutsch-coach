# -*- coding: utf-8 -*-
"""Write word-frequency ranks and frequency-estimated levels into every word list in the app.

Frequency source: hermitdave/FrequencyWords, OpenSubtitles 2018, German top 50k word forms
(https://github.com/hermitdave/FrequencyWords, content licensed CC-BY-SA-4.0).

The list counts word *forms*, so each entry's count is the sum of its real forms from our data
(verb: infinitive + Präteritum + participle; noun: singular + plural; adjective: base + common
endings + comparative + superlative). Phrase entries ("fertig sein", "führen zu", "sich bemühen")
ignore their own preposition/"sich", and are capped at their rarest content word. That total is
converted to the position it would take in the 50k list.

Every entry gets  freq  (that position; 0 = rarer than the 50,000 most frequent forms).
Entries with no textbook level ("?"/missing), or a previous estimate, get
  level     A1 <= 1,000 < A2 <= 2,000 < B1 <= 15,000 < B2 <= 50,000 < C1
  levelEst  true
Textbook levels are never changed. Cut-offs were calibrated against the ~1,180 entries that have a
textbook level (82% same level or one off, 46% exact).

Run after adding or changing words:  python3 scripts/build_freq_ranks.py
"""
import bisect, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
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


FREQ_LEVELS = (('A1', 1000), ('A2', 2000), ('B1', 15000), ('B2', 50000))

# array name -> (kind, key field). SYNCED_WORDS (home flashcards) holds all three kinds, by "cat".
ARRAYS = {
    'VERBS': ('v', 'inf'), 'ALL_VERBS': ('v', 'inf'), 'VERBS_ALL': ('v', 'inf'),
    'NOUNS': ('n', 'sg'), 'ADJS': ('a', 'w'), 'SYNCED_WORDS': (None, 'w'),
}


def level_from_rank(rank):
    if not rank:
        return 'C1'
    for level, limit in FREQ_LEVELS:
        if rank <= limit:
            return level
    return 'C1'


def as_standard(entry, kind):
    """SYNCED_WORDS uses flashcard field names; map them to the list field names."""
    if kind == 'v' and 'pr' in entry:
        return {'inf': entry['w'], 'praeteritum': entry.get('pr'), 'perfekt': entry.get('pp')}
    if kind == 'n' and 'sg' not in entry:
        return {'sg': entry['w'], 'pl': entry.get('p')}
    return entry


def data_files():
    """Files holding word arrays: the shared js/word-data.js and the pages (home SYNCED_WORDS …)."""
    return ['js/word-data.js'] + sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))


def dump_entries(entries, old):
    """JSON for a rewritten array, keeping the file's layout (js/word-data.js has one entry per line)."""
    if '\n{' in old:
        return '[\n' + ',\n'.join(json.dumps(e, ensure_ascii=False, separators=(',', ':')) for e in entries) + '\n]'
    return json.dumps(entries, ensure_ascii=False, separators=(',', ':'))


def array_spans(html):
    for name in ARRAYS:
        for m in re.finditer(r'(?:(?:const|let|var) |DC_WORDS\.)' + name + r' = \[', html):
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
                        yield name, s, i + 1
                        break


def main():
    counts = load_counts()
    ascending = sorted(counts.values())
    count = lambda w: counts.get(w, 0)
    counters = {'v': verb_count, 'n': noun_count, 'a': adj_count}
    kind_of_cat = {'v': 'v', 'n': 'n', 'adj': 'a'}
    report = []
    for fname in data_files():
        path = os.path.join(ROOT, fname)
        html = open(path, encoding='utf-8').read()
        spans = sorted(array_spans(html), key=lambda x: -x[1])   # rewrite from the end backwards
        changed = False
        for name, s, e in spans:
            try:
                entries = json.loads(html[s:e])
            except ValueError:
                continue                                          # not a JSON word list
            if not entries or not isinstance(entries[0], dict):
                continue
            estimated = 0
            for entry in entries:
                kind = ARRAYS[name][0] or kind_of_cat.get(entry.get('cat'))
                if not kind:
                    continue
                total = counters[kind](as_standard(entry, kind), count)
                rank = (len(ascending) - bisect.bisect_right(ascending, total) + 1) if total else 0
                entry['freq'] = rank
                if entry.get('levelEst') or entry.get('level') in (None, '', '?'):
                    entry['level'] = level_from_rank(rank)
                    entry['levelEst'] = True
                    estimated += 1
            html = html[:s] + dump_entries(entries, html[s:e]) + html[e:]
            changed = True
            report.append(f'{fname}: {name} {len(entries)} entries, {estimated} estimated levels')
        if changed:
            open(path, 'w', encoding='utf-8').write(html)
    print('\n'.join(report))


if __name__ == '__main__':
    main()
