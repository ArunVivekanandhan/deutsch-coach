# -*- coding: utf-8 -*-
"""Check js/word-pictures.js: every key "n|…" / "v|…" / "a|…" must be a word of js/word-data.js (NOUNS.sg, VERBS.inf,
ADJS.w) and every value a short non-empty picture. Run: python3 scripts/check_word_pictures.py"""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = subprocess.check_output(['node', '-e', """
global.window = global; require('./js/word-data.js'); require('./js/word-pictures.js'); const W = DC_WORDS;
process.stdout.write(JSON.stringify({pics: DC_WORD_PICS, n: W.NOUNS.map(x => x.sg), v: W.VERBS.map(x => x.inf), a: W.ADJS.map(x => x.w)}));"""], cwd=ROOT, text=True)
d = json.loads(out); words = {k: set(d[k]) for k in 'nva'}; errs = []
for key, pic in d['pics'].items():
    c, _, w = key.partition('|')
    if c not in words or w not in words[c]:
        errs.append(f'{key}: not in js/word-data.js')
    if not pic or len(pic) > 12:
        errs.append(f'{key}: bad picture {pic!r}')
if errs:
    print(f'Word pictures: {len(errs)} problem(s)'); [print('  ' + e) for e in errs]; sys.exit(1)
print(f"OK: word pictures valid ({len(d['pics'])} words with a picture).")
