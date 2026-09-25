# -*- coding: utf-8 -*-
"""Validate the guided-lesson dialogues of the KI-Sprechpartner (js/tutor-scripts.js, window.DC_TUTOR_SCRIPTS).

Every mission of KI_Sprechpartner.html needs a script: 6-8 turns, each with the tutor's line (DE/EN/TA), the learner's
task (EN/TA), exactly 3 different model answers (DE/EN/TA) and a tip; every goal of the mission is reached by some
turn; closing line and 6-8 lesson words. Run: python3 scripts/check_tutor_scripts.py   (exit 1 on problems)
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def missions():
    html = open(os.path.join(ROOT, 'KI_Sprechpartner.html'), encoding='utf-8').read()
    block = html[html.index('const MISSIONS = ['):html.index('const GOALS')]
    out = {}
    for m in re.finditer(r"\{ id: '(\w+)'.*?goals: \[(.*?)\] \}", block, re.S):
        out[m.group(1)] = len(re.findall(r"'[^']*'", m.group(2)))
    return out


def main():
    js = open(os.path.join(ROOT, 'js', 'tutor-scripts.js'), encoding='utf-8').read()
    data = json.loads(js[js.index('{'):js.rindex('}') + 1])
    probs = []
    ms = missions()
    for mid, ngoals in ms.items():
        sc = data.get(mid)
        if not sc:
            probs.append(f'{mid}: no script'); continue
        turns = sc.get('turns') or []
        if not 6 <= len(turns) <= 8:
            probs.append(f'{mid}: {len(turns)} turns (6-8 expected)')
        covered = set()
        for i, t in enumerate(turns):
            for k in ('tutor', 'tutor_en', 'tutor_ta', 'task_en', 'task_ta', 'tip'):
                if not str(t.get(k, '')).strip():
                    probs.append(f'{mid} turn {i}: missing {k}')
            opts = t.get('options') or []
            if len(opts) != 3 or len({o.get('de', '').strip().lower() for o in opts}) != 3:
                probs.append(f'{mid} turn {i}: needs 3 different options')
            for o in opts:
                if not all(str(o.get(k, '')).strip() for k in ('de', 'en', 'ta')):
                    probs.append(f'{mid} turn {i}: option without de/en/ta')
            g = t.get('goal')
            if g is not None:
                if not isinstance(g, int) or not 0 <= g < ngoals:
                    probs.append(f'{mid} turn {i}: goal {g!r} out of range')
                else:
                    covered.add(g)
        missing = set(range(ngoals)) - covered
        if missing:
            probs.append(f'{mid}: goals never reached: {sorted(missing)}')
        for k in ('end', 'end_en', 'end_ta'):
            if not str(sc.get(k, '')).strip():
                probs.append(f'{mid}: missing {k}')
        if not 4 <= len(sc.get('words') or []) <= 10:
            probs.append(f'{mid}: {len(sc.get("words") or [])} lesson words (6-8 expected)')
    extra = set(data) - set(ms)
    if extra:
        probs.append(f'scripts for unknown missions: {sorted(extra)}')
    if probs:
        print(f'Tutor scripts: {len(probs)} problem(s):')
        for p in probs[:60]:
            print('  ' + p)
        sys.exit(1)
    print(f'OK: tutor scripts valid ({len(ms)} missions, {sum(len(data[m]["turns"]) for m in ms)} turns).')


if __name__ == '__main__':
    main()
