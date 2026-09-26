# -*- coding: utf-8 -*-
"""Check DC_SITEMAP in js/app-shell.js: every listed page exists, no page is listed twice, and every real page (not a
redirect stub) is listed, so no page is left out of the menu / home page. Run: python3 scripts/check_sitemap.py"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, 'js', 'app-shell.js'), encoding='utf-8').read()
block = src[src.index('window.DC_SITEMAP = ['):src.index('// the menu entry a page belongs to')]
sm = json.loads(subprocess.check_output(['node', '-e', 'const window = {};' + block + 'process.stdout.write(JSON.stringify(window.DC_SITEMAP));'], text=True))
errs, seen = [], set()
for g in sm:
    for p in g['pages']:
        h = p['href']
        if h in seen: errs.append(f'{h}: listed twice')
        seen.add(h)
        if not os.path.exists(os.path.join(ROOT, h)): errs.append(f'{h}: file missing')
        if not p.get('t') or not p.get('d') or not p.get('icon'): errs.append(f'{h}: t/d/icon missing')
        views = [v[0] for v in p.get('views', [])]
        if views and h not in views: errs.append(f'{h}: must be the first of its views')
        for v in views:
            if v == h: continue
            if v in seen: errs.append(f'{v}: listed twice')
            seen.add(v)
            if not os.path.exists(os.path.join(ROOT, v)): errs.append(f'{v}: file missing')
for f in sorted(os.listdir(ROOT)):
    if not f.endswith('.html') or f in seen: continue
    html = open(os.path.join(ROOT, f), encoding='utf-8', errors='ignore').read()
    if re.search(r'http-equiv=["\']refresh|location\.replace\(', html): continue   # redirect stub
    errs.append(f'{f}: not in DC_SITEMAP (add it to a group in js/app-shell.js)')
if errs:
    print(f'Site map: {len(errs)} problem(s)'); [print('  ' + e) for e in errs]; sys.exit(1)
print(f'OK: site map valid ({len(sm)} groups, {len(seen)} pages).')
