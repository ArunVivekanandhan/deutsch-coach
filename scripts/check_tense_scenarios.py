# -*- coding: utf-8 -*-
"""Check js/tense-scenarios.js (Zeitreise-Trainer): 3 German/English/Tamil sentences per scenario, each German sentence
starts with its time word and ends with a full stop, the Tamil is Tamil script, the typical mistake differs from all
three correct sentences, every DC_TENSE_EN verb exists in js/word-data.js with 3 English forms.
Run: python3 scripts/check_tense_scenarios.py"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.loads(subprocess.check_output(['node', '-e', """global.window = global; require('./js/word-data.js'); require('./js/tense-scenarios.js');
process.stdout.write(JSON.stringify({sc: DC_TENSE_SCENARIOS, en: DC_TENSE_EN, verbs: DC_WORDS.VERBS.map(v => v.inf)}));"""], cwd=ROOT, text=True))
TA = re.compile('[஀-௿]'); errs = []; ids = set(); verbs = set(d['verbs'])
for s in d['sc']:
    i = s.get('id')
    if i in ids: errs.append(f'{i}: duplicate id')
    ids.add(i)
    for f in ('de', 'en', 'ta', 'time'):
        if len(s.get(f, [])) != 3: errs.append(f'{i}: {f} needs 3 entries')
    for k, de in enumerate(s.get('de', [])):
        if not de.startswith(s['time'][k] + ' '): errs.append(f'{i}: "{de}" does not start with "{s["time"][k]}"')
        if not de.endswith('.'): errs.append(f'{i}: "{de}" needs a full stop')
    if any(not TA.search(t) for t in s.get('ta', [])): errs.append(f'{i}: Tamil missing')
    if not s.get('wrong') or s['wrong'] in s['de'] or not s.get('why'): errs.append(f'{i}: wrong/why missing or equal to a correct sentence')
    if s.get('past') not in ('perfekt', 'praet'): errs.append(f'{i}: past must be perfekt/praet')
for v, forms in d['en'].items():
    if v not in verbs and 'sich ' + v not in verbs: errs.append(f'DC_TENSE_EN: {v} not in js/word-data.js')
    if len(forms) != 3: errs.append(f'DC_TENSE_EN: {v} needs 3 forms')
if errs:
    print(f'Zeitreise: {len(errs)} problem(s)'); [print('  ' + e) for e in errs]; sys.exit(1)
print(f"OK: Zeitreise data valid ({len(d['sc'])} scenarios, {len(d['en'])} verbs with English forms).")
