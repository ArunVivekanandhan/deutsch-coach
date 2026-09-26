# -*- coding: utf-8 -*-
"""Check js/confusables.js (Wort-Zwillinge page): unique ids, known type, ≥ 2 words per group, every word with German,
English, Tamil (in Tamil script), picture and example; articles der/die/das or empty; tip + Tamil tip.
Run: python3 scripts/check_confusables.py"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.loads(subprocess.check_output(['node', '-e', "global.window = global; require('./js/confusables.js'); process.stdout.write(JSON.stringify(DC_CONFUSABLES))"], cwd=ROOT, text=True))
TA = re.compile('[஀-௿]'); errs = []; ids = set()
for g in data:
    gid = g.get('id')
    if gid in ids: errs.append(f'{gid}: duplicate id')
    ids.add(gid)
    if g.get('type') not in ('look', 'sound', 'article', 'false', 'meaning'): errs.append(f'{gid}: bad type')
    if not g.get('tip') or not TA.search(g.get('tip_ta', '')): errs.append(f'{gid}: tip / Tamil tip missing')
    if len(g.get('words', [])) < 2: errs.append(f'{gid}: needs at least 2 words')
    for w in g.get('words', []):
        for f in ('de', 'en', 'ta', 'pic', 'ex', 'ex_en'):
            if not str(w.get(f, '')).strip(): errs.append(f'{gid}/{w.get("de")}: missing {f}')
        if w.get('art') not in ('', 'der', 'die', 'das'): errs.append(f'{gid}/{w.get("de")}: bad article')
        if w.get('ta') and not TA.search(w['ta']): errs.append(f'{gid}/{w.get("de")}: Tamil not in Tamil script')
if errs:
    print(f'Wort-Zwillinge: {len(errs)} problem(s)'); [print('  ' + e) for e in errs]; sys.exit(1)
print(f'OK: Wort-Zwillinge valid ({len(data)} groups, {sum(len(g["words"]) for g in data)} words).')
