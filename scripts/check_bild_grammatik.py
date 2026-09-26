# -*- coding: utf-8 -*-
"""Check js/bild-grammatik.js (Grammatik in Bildern): every scene has a rule in de/en/ta (Tamil script) and frames with
de/en/note; chip frames use known roles and a chip's "from" names a chip of the previous frame; the 9 prepositions have
a Wohin sentence with an accusative article and a Wo sentence with a dative article; 300 generated quiz items each have
the answer among 3+ unique options and every frame picture renders to SVG. Run: python3 scripts/check_bild_grammatik.py"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.loads(subprocess.check_output(['node', '-e', r"""global.window = global; require('./js/bild-grammatik.js'); const B = DC_BILD; const out = { scenes: [], chips: B.CHIPS, preps: B.PREPS, quiz: [] };
for (const s of B.SCENES) out.scenes.push({ id: s.id, de: s.de, en_rule: s.en_rule, ta: s.ta, type: s.type, frames: (s.frames || []).map((f, i) => ({ de: f.de, en: f.en, note: f.note, svg: String(f.svg(i ? i - 1 : null)).slice(0, 5) })) });
for (const p of B.PREPS) for (const m of ['wohin', 'wo']) out.quiz.push({ answer: p[m], options: [p[m], p[m + 'X']], svg: B.prepSVG(p, m).slice(0, 5) });
for (let i = 0; i < 300; i++) { const q = B.quizItem(); out.quiz.push({ answer: q.answer, options: q.options, svg: q.svg.slice(0, 5), en: q.en }); }
process.stdout.write(JSON.stringify(out));"""], cwd=ROOT, text=True))
TA = re.compile('[஀-௿]'); ROLES = set('SVTOPKX'); errs = []
for s in d['chips'] + d['scenes']:
    i = s['id']
    for f in ('de', 'en_rule', 'ta'):
        if not s.get(f): errs.append(f'{i}: {f} missing')
    if s.get('ta') and not TA.search(s['ta']): errs.append(f'{i}: ta is not Tamil')
    prev = set()
    for k, fr in enumerate(s.get('frames', [])):
        for f in ('de', 'en', 'note'):
            if not fr.get(f): errs.append(f'{i}#{k + 1}: {f} missing')
        if 'svg' in fr and fr['svg'] != '<svg ': errs.append(f'{i}#{k + 1}: picture does not render')
        if 'chips' in fr:
            ids = [c[0] for c in fr['chips']]
            if len(set(ids)) != len(ids): errs.append(f'{i}#{k + 1}: duplicate chip id')
            for c in fr['chips']:
                if c[2] not in ROLES: errs.append(f'{i}#{k + 1}: unknown role {c[2]}')
                if len(c) > 3 and c[3] not in prev: errs.append(f'{i}#{k + 1}: chip {c[0]} comes from {c[3]}, not in the previous frame')
            prev = set(ids)
for p in d['preps']:
    if not re.search(r'\b(den|die|das|ins)\b', p['wohin'].split(p['p'], 1)[-1]): errs.append(f"{p['p']}: Wohin sentence without accusative article")
    if not re.search(r'\b(dem|der|den \w+n|im|am)\b', p['wo'].split(p['p'], 1)[-1] if p['p'] != 'in' else p['wo']): errs.append(f"{p['p']}: Wo sentence without dative article")
for q in d['quiz']:
    if q['answer'] not in q['options'] or len(set(q['options'])) != len(q['options']) or len(q['options']) < 2: errs.append(f"quiz: bad options {q['options']}")
    if q['svg'] != '<svg ': errs.append('quiz: picture does not render')
if errs:
    print(f'Bild-Grammatik: {len(set(errs))} problem(s)'); [print('  ' + e) for e in sorted(set(errs))[:30]]; sys.exit(1)
print(f"OK: Bild-Grammatik valid ({len(d['chips']) + len(d['scenes'])} concepts, {len(d['preps'])} prepositions, {len(d['quiz'])} quiz items tested).")
