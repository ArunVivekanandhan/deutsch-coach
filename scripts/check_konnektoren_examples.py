# -*- coding: utf-8 -*-
"""Check js/konnektoren-examples.js against konnektoren_referenz.html: every connector chip on the page has >= 3
examples; each example has de/en/ta (ta in Tamil script), balanced [connector] / {verb} markers, final punctuation,
and follows its group's word-order rule:
  grp1 Nebensatz   — the marked verb after [conn] is the last word of that clause (before , . ? !)
  grp2 Position 1  — the word right after [conn] is the marked {verb}
  grp3 Position 0  — the word right after [conn] is NOT the verb (subject / Position-1 word first), except in questions
  grp4 two-part    — at least two [..] parts
Run: python3 scripts/check_konnektoren_examples.py"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.loads(subprocess.check_output(['node', '-e', """global.window = global; require('./js/konnektoren-examples.js');
process.stdout.write(JSON.stringify(DC_KONN_EX));"""], cwd=ROOT, text=True))
page = open(os.path.join(ROOT, 'konnektoren_referenz.html'), encoding='utf-8').read()
TA = re.compile('[஀-௿]'); errs = []; n = 0; chips = 0
for g in ('grp1', 'grp2', 'grp3', 'grp4'):
    i = page.index(f'id="card-{g}"'); j = page.find('id="card-grp', i + 20); blk = page[i:j if j > 0 else len(page)]
    for label in re.findall(r'class="conn-chip"[^>]*>([^<]+)<', blk):
        chips += 1
        key = label.split()[0].lower()
        e = d.get(key)
        if not e: errs.append(f'{g} chip "{label}": no examples (key {key})'); continue
        if e.get('lv') not in ('A1', 'A2', 'B1', 'B2'): errs.append(f'{key}: bad level')
        exs = e.get('ex', [])
        if len(exs) < 3: errs.append(f'{key}: only {len(exs)} examples (need 3)')
        for k, x in enumerate(exs):
            n += 1; de = x.get('de', ''); tag = f'{key}#{k + 1}'
            if not x.get('en') or not de: errs.append(f'{tag}: de/en missing'); continue
            if not x.get('ta') or not TA.search(x['ta']): errs.append(f'{tag}: ta missing or not Tamil')
            if de.count('[') != de.count(']') or de.count('{') != de.count('}') or '[' not in de: errs.append(f'{tag}: unbalanced markers'); continue
            if de[-1] not in '.?!': errs.append(f'{tag}: final punctuation')
            toks = re.findall(r'\[[^\]]+\]|\{[^}]+\}|[^\s,.?!]+|[,.?!]', de)
            ci = next(t for t, w in enumerate(toks) if w.startswith('['))
            nxt = toks[ci + 1] if ci + 1 < len(toks) else ''
            if g == 'grp1':
                end = next((t for t in range(ci + 1, len(toks)) if toks[t] in ',.?!'), len(toks))
                if not toks[end - 1].startswith('{'): errs.append(f'{tag}: verb not at the end of the {key}-clause: {de}')
            elif g == 'grp2':
                if not nxt.startswith('{'): errs.append(f'{tag}: verb must follow {key} directly: {de}')
            elif g == 'grp3':
                if nxt.startswith('{') and not de.endswith('?'): errs.append(f'{tag}: after {key} comes the subject, not the verb: {de}')
                if '{' not in de[de.index(']'):]: errs.append(f'{tag}: mark the verb after {key}')
            elif g == 'grp4' and de.count('[') < 2: errs.append(f'{tag}: two-part connector needs both parts marked')
if errs:
    print(f'Konnektoren examples: {len(errs)} problem(s)'); [print('  ' + e) for e in errs]; sys.exit(1)
print(f'OK: Konnektoren examples valid ({chips} connectors, {n} examples, all >= 3).')
