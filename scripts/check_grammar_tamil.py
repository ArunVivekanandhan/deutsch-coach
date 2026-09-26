# -*- coding: utf-8 -*-
"""Validate js/grammar-tamil.js (Tamil ↔ German grammar bridges shown in Grammatik_Regel_Trainer.html):
every key is a rule id of the page, every item has kind/title/German/Tamil/gloss/explanations, the Tamil fields
contain Tamil script, the German example and the gloss don't, table rows have 3 cells. Run: python3 scripts/check_grammar_tamil.py"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TA = re.compile('[஀-௿]')
js = open(os.path.join(ROOT, 'js', 'grammar-tamil.js'), encoding='utf-8').read()
data = json.loads(subprocess.check_output(['node', '-e', 'global.window = {};' + js + ';process.stdout.write(JSON.stringify(window.DC_GRAMMAR_TAMIL))'], text=True))
page = open(os.path.join(ROOT, 'Grammatik_Regel_Trainer.html'), encoding='utf-8').read()
rule_ids = set(re.findall(r'^\s*id: "(r\d+_[a-z_]+)"', page, re.M))
extra = open(os.path.join(ROOT, 'js', 'grammar-rules-extra.js'), encoding='utf-8').read()
rule_ids |= set(re.findall(r"\{ id: '([a-z0-9_]+)'", extra))
errs = []
for key, items in data.items():
    if key not in rule_ids:
        errs.append(f'{key}: no such rule in Grammatik_Regel_Trainer.html')
    for i, it in enumerate(items):
        w = f'{key}[{i}]'
        if it.get('k') not in ('bridge', 'trap'):
            errs.append(f'{w}: k must be bridge/trap')
        for f in ('t', 'de', 'ta', 'gloss', 'why', 'why_ta'):
            if not str(it.get(f, '')).strip():
                errs.append(f'{w}: missing {f}')
        for f in ('ta', 'why_ta'):
            if it.get(f) and not TA.search(it[f]):
                errs.append(f'{w}: {f} has no Tamil script')
        for f in ('de', 'gloss'):
            if TA.search(str(it.get(f, ''))):
                errs.append(f'{w}: {f} should not contain Tamil script')
        for r in it.get('table', []):
            if len(r) != 3 or not TA.search(r[1]):
                errs.append(f'{w}: table row {r} needs [German, Tamil, English]')
if errs:
    print('Grammar Tamil bridges: ' + str(len(errs)) + ' problem(s)'); [print('  ' + e) for e in errs]; sys.exit(1)
print(f'OK: grammar Tamil bridges valid ({sum(len(v) for v in data.values())} items for {len(data)} of {len(rule_ids)} rules).')
