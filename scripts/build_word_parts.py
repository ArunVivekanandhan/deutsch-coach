# -*- coding: utf-8 -*-
"""Generate js/word-parts.js: syllables + meaningful parts ("Wortaufbau") for every word in the app.

  Abtreibung -> "Ab·trei·bung", parts: ab- (away, off, down) + treiben (to drive …) + -ung (noun from a verb)

Words: the canonical VERBS / NOUNS / ADJS lists plus every card of the home flashcards.
Syllables: pyphen with the LibreOffice de_DE hyphenation patterns (standard: no single letter split off).
Parts: MemoryTips.wordParts() from js/memory-tips.js, run in Node with ALL words as the lexicon plus a root
dictionary from Ding (scripts/ding_roots.py, GPL-2+) — a word is split only where the root is a real word:
one of the app's words (its learner meaning is used) or a common Ding headword (its dictionary gloss).

Run after changing words:   python3 scripts/build_word_parts.py        (needs: pip install pyphen, node)
Check (used by build.py):   python3 scripts/build_word_parts.py --check
"""
import json, os, re, subprocess, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_vocab_sync import load, CANON, ROOT  # noqa: E402
from fill_home_forms import OBJ_RE, field      # noqa: E402
import ding_roots                              # noqa: E402

OUT = os.path.join(ROOT, 'js', 'word-parts.js')
HOME = os.path.join(ROOT, 'deutsch-coach.html')

NODE_RUNNER = r"""
const fs = require('fs');
const inp = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
require(process.argv[3]);
MemoryTips.init(inp.lexicon);
const out = {};
for (const [cat, w, a, p, en] of inp.queries) {
  const parts = MemoryTips.wordParts(cat, { w, a, p, en });
  out[cat + '|' + w] = parts ? MemoryTips.encodeParts(parts) : 0;
}
process.stdout.write(JSON.stringify(out));
"""


def clean(w):
    w = re.sub(r'\([^)]*\)', ' ', w or '')
    w = re.sub(r'^(der|die|das)\s+', '', w.strip(), flags=re.I)
    return re.sub(r'\s+', ' ', w).strip()


def collect():
    lex = {'verbs': [], 'nouns': [], 'adjs': []}
    queries = {}
    rank = lambda f: f if f else 10 ** 8

    for v in load(*CANON['v'][:2]):
        lex['verbs'].append({'w': v['inf'], 'pr': v.get('praeteritum', ''), 'pp': v.get('perfekt', ''), 'en': v.get('en', ''), 'rank': rank(v.get('freq'))})
        queries[('v', clean(v['inf']))] = ('', '', v.get('en', ''))
    for n in load(*CANON['n'][:2]):
        lex['nouns'].append({'w': n['sg'], 'a': n['a'], 'p': n['pl'], 'en': n.get('en', ''), 'rank': rank(n.get('freq'))})
        queries[('n', clean(n['sg']))] = (n['a'], n['pl'], n.get('en', ''))
    for a in load(*CANON['a'][:2]):
        lex['adjs'].append({'w': a['w'], 'comp': a.get('komp') or a.get('comp', ''), 'sup': a.get('sup', ''), 'en': a.get('en', ''), 'rank': rank(a.get('freq'))})
        queries[('adj', clean(a['w']))] = ('', '', a.get('en', ''))

    html = open(HOME, encoding='utf-8').read()
    for m in OBJ_RE.finditer(html):
        obj = m.group(0)
        w, cat = field(obj, 'w'), field(obj, 'cat')
        if not w or cat not in ('v', 'n', 'adj', 'p'):
            continue
        a, p, en = field(obj, 'a') or '', field(obj, 'p') or '', field(obj, 'en') or ''
        if cat == 'v':
            lex['verbs'].append({'w': w, 'pr': field(obj, 'pr') or '', 'pp': field(obj, 'pp') or '', 'en': en, 'rank': 10 ** 7})
        elif cat == 'n':
            lex['nouns'].append({'w': w, 'a': a, 'p': p, 'en': en, 'rank': 10 ** 7})
        elif cat == 'adj':
            lex['adjs'].append({'w': w, 'comp': field(obj, 'comp') or '', 'sup': field(obj, 'sup') or '', 'en': en, 'rank': 10 ** 7})
        key = (cat, clean(w))
        if key[1] and key not in queries:
            queries[key] = (a, p, en)
    return lex, queries


def hyphenate(word, dic):
    # the patterns sometimes leave a lone consonant ("Ge·brauch·s·taug…"): a syllable needs a vowel
    out = []
    for piece in dic.inserted(word, '·').split('·'):
        if out and not re.search(r'[aeiouyäöüAEIOUYÄÖÜ]', piece):
            out[-1] += piece
        else:
            out.append(piece)
    return '·'.join(out)


def syllables(text, dic):
    return ' '.join('-'.join(hyphenate(part, dic) for part in tok.split('-')) for tok in text.split(' '))


def generate():
    try:
        import pyphen
    except ImportError:
        return None
    dic = pyphen.Pyphen(lang='de_DE', left=2, right=2)
    lex, queries = collect()
    roots = ding_roots.load_roots()
    if roots is None:
        return None
    rank = ding_roots.freq_ranks('de')
    lex['roots'] = {'v': {k: [g, rank.get(k, 10 ** 6)] for k, g in roots['v'].items()},
                    'n': {k: v + [rank.get(k, 10 ** 6)] for k, v in roots['n'].items()},
                    'adj': {k: [g, rank.get(k, 10 ** 6)] for k, g in roots['adj'].items()}}
    with tempfile.TemporaryDirectory() as d:
        inp, runner = os.path.join(d, 'in.json'), os.path.join(d, 'run.js')
        json.dump({'lexicon': lex, 'queries': [[c, w, a, p, en] for (c, w), (a, p, en) in queries.items()]},
                  open(inp, 'w', encoding='utf-8'), ensure_ascii=False)
        open(runner, 'w', encoding='utf-8').write(NODE_RUNNER)
        res = subprocess.run(['node', runner, inp, os.path.join(ROOT, 'js', 'memory-tips.js')],
                             capture_output=True, text=True, encoding='utf-8')
        if res.returncode:
            sys.exit('node failed: ' + res.stderr[:500])
        parts = json.loads(res.stdout)
    data = {}
    for (c, w) in sorted(queries):
        data[c + '|' + w] = [syllables(w, dic), parts.get(c + '|' + w, 0) if c != 'p' else 0]
    split = sum(1 for v in data.values() if v[1])
    body = ',\n'.join(json.dumps(k, ensure_ascii=False) + ':' + json.dumps(v, ensure_ascii=False, separators=(',', ':'))
                      for k, v in data.items())
    text = ('/* GENERATED by scripts/build_word_parts.py — do not edit by hand.\n'
            '   Wortaufbau for every word: [syllables, parts]. Syllables from the LibreOffice de_DE hyphenation\n'
            '   patterns (pyphen); parts from MemoryTips.wordParts() with all words + Ding roots (TU Chemnitz, GPL-2+) ("ab-" prefix,\n'
            '   "-ung" suffix, "+s" linking letter, "treiben=meaning" root, "~kaufen=meaning" related word, 0 = Grundwort).\n'
            '   %d words, %d split into parts. */\n'
            'window.WORD_PARTS = {\n%s\n};\n') % (len(data), split, body)
    return text, len(data), split


def main():
    gen = generate()
    if gen is None:
        print('WARNING: pyphen / Ding / frequency list unavailable (pip install pyphen; apt + network) — js/word-parts.js not checked.')
        return
    text, n, split = gen
    if '--check' in sys.argv:
        cur = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
        if cur != text:
            print('js/word-parts.js is out of date — run: python3 scripts/build_word_parts.py')
            sys.exit(1)
        print('OK: js/word-parts.js up to date (%d words, %d with parts).' % (n, split))
        return
    open(OUT, 'w', encoding='utf-8').write(text)
    print('wrote js/word-parts.js: %d words, %d split into parts, %d KB' % (n, split, len(text.encode('utf-8')) // 1024))


if __name__ == '__main__':
    main()
