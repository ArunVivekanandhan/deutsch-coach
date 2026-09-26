# -*- coding: utf-8 -*-
"""Check js/text-drills.js (Text-Trainer): unique text ids; every sentence has en/de/skel/focus, alts is a list, German
ends with . ? or !, Tamil (when present) is Tamil script; DC_CRASH quiz items have a known area, >= 2 unique options and
an explanation; join items have a/b/c/de/why and alts is a list.
Run: python3 scripts/check_text_drills.py"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.loads(subprocess.check_output(['node', '-e', """global.window = global; require('./js/text-drills.js');
process.stdout.write(JSON.stringify({t: DC_TEXT_DRILLS, c: DC_CRASH}));"""], cwd=ROOT, text=True))
TA = re.compile('[஀-௿]'); errs = []; ids = set(); n = 0
for t in d['t']:
    i = t.get('id')
    if not i or i in ids: errs.append(f'{i}: missing or duplicate id')
    ids.add(i)
    for f in ('title', 'en_title'):
        if not t.get(f): errs.append(f'{i}: {f} missing')
    for k, s in enumerate(t.get('sentences', [])):
        n += 1
        for f in ('en', 'de', 'skel', 'focus'):
            if not s.get(f): errs.append(f'{i}#{k + 1}: {f} missing')
        if not isinstance(s.get('alts'), list): errs.append(f'{i}#{k + 1}: alts must be a list')
        if s.get('de') and s['de'][-1] not in '.?!': errs.append(f'{i}#{k + 1}: German needs final punctuation')
        if s.get('ta') and not TA.search(s['ta']): errs.append(f'{i}#{k + 1}: ta is not Tamil script')
        if s.get('de') in (s.get('alts') or []): errs.append(f'{i}#{k + 1}: model repeated in alts')
for k, q in enumerate(d['c']['quiz']):
    if q.get('a') not in ('kon', 'satz', 'kasus'): errs.append(f'quiz #{k + 1}: unknown area')
    o = q.get('o', [])
    if len(o) < 2 or len(set(o)) != len(o): errs.append(f'quiz #{k + 1}: needs >= 2 unique options')
    if not q.get('p') or not q.get('exp'): errs.append(f'quiz #{k + 1}: p/exp missing')
for k, j in enumerate(d['c']['join']):
    for f in ('a', 'b', 'c', 'de', 'why'):
        if not j.get(f): errs.append(f'join #{k + 1}: {f} missing')
    if not isinstance(j.get('alts'), list): errs.append(f'join #{k + 1}: alts must be a list')
if errs:
    print(f'Text-Trainer: {len(errs)} problem(s)'); [print('  ' + e) for e in errs]; sys.exit(1)
print(f"OK: Text-Trainer data valid ({len(d['t'])} texts, {n} sentences, {len(d['c']['quiz'])} quiz items, {len(d['c']['join'])} join items).")
