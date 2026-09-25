# -*- coding: utf-8 -*-
"""Root-word dictionary for the Wortaufbau build (scripts/build_word_parts.py).

Source: Ding German-English dictionary, (c) Frank Richter, TU Chemnitz, GPL-2+ (https://dict.tu-chemnitz.de/),
taken from the Debian/Ubuntu package trans-de-en 1.9-7 (Ding "devel 2023-04-13"). Only the meaning glosses
of root words that actually appear as parts end up in js/word-parts.js.

Roots are limited to words in the 50k most frequent German words (OpenSubtitles 2018 list by hermitdave,
CC-BY-SA-4.0 — the same list scripts/build_freq_ranks.py uses), so rare homographs don't produce false splits.
Both files are cached in ~/.cache/deutsch-coach/.
"""
import os, re, shutil, subprocess, tempfile, urllib.request

CACHE = os.path.join(os.path.expanduser('~'), '.cache', 'deutsch-coach')
DING_PKG = 'trans-de-en=1.9-7'
FREQ_URL = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/{lang}/{lang}_50k.txt'
TAG_KIND = {'m': 'n', 'f': 'n', 'n': 'n', 'vt': 'v', 'vi': 'v', 'vr': 'v', 'v': 'v', 'adj': 'adj'}
ART = {'m': 'der', 'f': 'die', 'n': 'das'}


def ding_path():
    path = os.path.join(CACHE, 'ding-de-en-1.9-7.txt')
    if os.path.exists(path):
        return path
    try:
        os.makedirs(CACHE, exist_ok=True)
        with tempfile.TemporaryDirectory() as d:
            subprocess.run(['apt-get', 'download', DING_PKG], cwd=d, check=True, capture_output=True)
            deb = [f for f in os.listdir(d) if f.endswith('.deb')][0]
            subprocess.run(['dpkg-deb', '-x', deb, 'x'], cwd=d, check=True, capture_output=True)
            shutil.copy(os.path.join(d, 'x', 'usr', 'share', 'trans', 'de-en'), path)
        return path
    except Exception:
        return None


def freq_ranks(lang='de'):
    """word -> rank in the OpenSubtitles 50k list for de/en (cached)."""
    path = os.path.join(CACHE, lang + '_50k.txt')
    if not os.path.exists(path):
        try:
            os.makedirs(CACHE, exist_ok=True)
            with urllib.request.urlopen(FREQ_URL.format(lang=lang), timeout=60) as r:
                open(path, 'wb').write(r.read())
        except Exception:
            return None
    ranks = {}
    for i, line in enumerate(open(path, encoding='utf-8')):
        if ' ' in line:
            ranks.setdefault(line.rsplit(' ', 1)[0], i + 1)
    return ranks


def clean_gloss(g):
    g = re.sub(r'\[[^\]]*\]|\([^)]*\)|<[^>]*>', '', g)
    g = re.sub(r'\b(sth\.|sb\.|sth|sb|so\.|sb\./sth\.)(?=\s|$)', '', g)
    g = re.sub(r'\s/\S*', '', g)                               # "square /Sq." abbreviations
    return re.sub(r'\s+', ' ', g).strip(' ,;/')


FUNCTION_WORDS = {'sich', 'mit', 'an', 'auf', 'für', 'über', 'von', 'zu', 'in', 'um', 'aus', 'bei', 'nach', 'vor', 'gegen',
                  'einen', 'eine', 'ein', 'einem', 'einer', 'den', 'die', 'das', 'dem', 'der', 'etw.', 'jdn.', 'jdm.', 'jds.', 'jdn./etw.', 'etw./jdn.'}


def rest_ok(h, word):
    # the word must be the head's last word (before its {tag}): "mit etw. füllen {vt}" yes, "füllen und kühlen" no
    return re.search(re.escape(word) + r'(?:\s*\{[a-z]+\})?(?:\s*\([^)]*\))*\s*(?:\[[^\]]*\]\s*)*$', h) is not None


STOP = {'to', 'a', 'an', 'the', 'be', 'of', 'oneself', 'up', 'out', 'off', 'on', 'in', 'for', 'with', 'into', 'at', 'down', 'away', 'from'}


def commonness(gloss, en_rank):
    """rank of the rarest content word (lower = more common)."""
    words = [w for w in re.findall(r"[a-z']+", gloss.lower()) if w not in STOP]
    if not words:
        return 10 ** 6
    return max(en_rank.get(w, 10 ** 6) for w in words) + 50 * (len(words) - 1)


def load_roots():
    """-> {'v': {inf: gloss}, 'n': {lower: [Word, article, gloss]}, 'adj': {lower: gloss}} or None."""
    path, de_rank, en_rank = ding_path(), freq_ranks('de'), freq_ranks('en')
    if not path or not de_rank or not en_rank:
        return None
    cand = {}
    with open(path, encoding='utf-8') as f:
        for idx, line in enumerate(f):
            if line.startswith('#') or '::' not in line:
                continue
            line = re.sub(r'\{[^}]*;[^}]*\}', '', line)        # irregular forms "{stood; stood}"
            de, en = line.split('::', 1)
            de0, en0 = de.split('|')[0], en.split('|')[0]
            en0 = re.sub(r'\[[^\]]*\]|\([^)]*\)|<[^>]*>', '', en0)   # brackets may contain ";"
            glosses = [g for g in (clean_gloss(x) for x in en0.split(';')) if g]
            if not glosses:
                continue
            heads = [x.strip() for x in de0.split(';')]
            # "kaufen; einkaufen {vt}": an untagged word takes the tag of the next tagged one
            tags = [None] * len(heads)
            nxt = None
            for i in range(len(heads) - 1, -1, -1):
                m = re.search(r'\{([a-z]+)\}', heads[i])
                nxt = m.group(1) if m else nxt
                tags[i] = nxt
            solo = len(heads) == 1
            for pos, h in enumerate(heads):
                # "mit etw. füllen", "sich (mit etw.) füllen", "jdn./etw. aufhalten": drop leading function words
                toks = re.sub(r'\([^)]*\)', ' ', h).split()
                while len(toks) > 1 and (toks[0] in FUNCTION_WORDS or re.fullmatch(r'(?:etw|jdm|jdn|jds)\.(?:/\s*(?:etw|jdm|jdn)\.)?|/', toks[0])):
                    toks = toks[1:]
                h2 = ' '.join(toks)
                m = re.match(r'^([A-Za-zÄÖÜäöüß]+)(?: \{[a-z]+\})?(.*)$', h2)
                if m and not rest_ok(h, m.group(1)):
                    m = None
                if not m or not tags[pos]:
                    continue
                word, rest = m.groups()
                kind = TAG_KIND.get(tags[pos])
                if not kind or word.lower() not in de_rank:
                    continue
                if (kind == 'n') != word[0].isupper():
                    continue
                # The main sense is the word's own entry ("stehen {vi} | …", not a synonym group) and the richest
                # one (plural, examples, idioms follow after "|"); domain-tagged senses ([techn.], [zool.]) lose.
                score = (6 if solo else 0) + (2 if pos == 0 else 0) + min(de.count('|'), 8) - (4 if '[' in rest else 0)
                cand.setdefault((kind, word), []).append((score, idx, tags[pos], glosses))
    roots = {'v': {}, 'n': {}, 'adj': {}}
    for (kind, word), lines in cand.items():
        # A main sense recurs across the word's entries ("to hinder" in several synonym groups, "to embarrass"
        # once); the word's own top-ranked entry breaks ties; rare English words and names come last.
        best = max(l[0] for l in lines)
        stats = {}
        for score, idx, tag, gl in lines:
            for j, g in enumerate(gl):
                st = stats.setdefault(g, [0, 0, idx, j])
                st[0] += 1
                if score == best:
                    st[1] = 1
                st[2], st[3] = min(st[2], idx), min(st[3], j) if st[2] == idx else st[3]
        def key(item):
            g, (count, top, idx, j) = item
            c = commonness(g, en_rank)
            tier = 3 if g[:1].isupper() else 0 if c <= 3000 else 1 if c <= 20000 else 2
            return (tier > 1, -(count + top), tier, idx, j)
        out = [g for g, _ in sorted(stats.items(), key=key)[:2]]
        gloss = ', '.join(out)
        if kind == 'n':
            tag = sorted(lines, key=lambda l: (-l[0], l[1]))[0][2]
            roots['n'].setdefault(word.lower(), [word, ART[tag], gloss])
        elif kind == 'v':
            roots['v'].setdefault(word, gloss)
        else:
            roots['adj'].setdefault(word, gloss)
    return roots


if __name__ == '__main__':
    r = load_roots()
    print({k: len(v) for k, v in r.items()})
    for w in ['treiben', 'lehren', 'melden', 'spannen', 'kaufen', 'stehen', 'fahren', 'suchen', 'handeln', 'schließen']:
        print(w, '|', r['v'].get(w))
    for w in ['frei', 'möglich', 'krank', 'fähig', 'übel']:
        print(w, '|', r['adj'].get(w))
    for w in ['karte', 'umwelt', 'schutz', 'hof', 'kauf', 'made', 'bahn', 'haus', 'zug']:
        print(w, '|', r['n'].get(w))
