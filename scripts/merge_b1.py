# -*- coding: utf-8 -*-
"""Merge the textbook levels B1.1 / B1.2 into B1 in every word list (Task 34, user request: "keep B1").

The old level is kept as "srcLevel" (the textbook part, B1.1 or B1.2), because saved progress in the
Nomen / Adjektiv trainers is keyed 'n|<level>|<word>' — those pages build the key from srcLevel || level,
so every existing key stays byte-identical. Idempotent.   Run: python3 scripts/merge_b1.py [--check]
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_freq_ranks import array_spans, data_files, dump_entries  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD = ('B1.1', 'B1.2')


def main():
    check, found, total = '--check' in sys.argv, [], 0
    for fname in data_files():
        path = os.path.join(ROOT, fname)
        html = open(path, encoding='utf-8').read()
        changed = False
        for name, s, e in sorted(array_spans(html), key=lambda x: -x[1]):
            try:
                entries = json.loads(html[s:e])
            except ValueError:
                continue
            n = 0
            for entry in entries:
                if isinstance(entry, dict) and entry.get('level') in OLD:
                    found.append(f'{fname}:{name}')
                    entry['srcLevel'] = entry['level']
                    entry['level'] = 'B1'
                    n += 1
            if n and not check:
                html = html[:s] + dump_entries(entries, html[s:e]) + html[e:]
                changed = True
                total += n
                print(f'{fname}: {name} {n} entries B1.1/B1.2 -> B1')
        if changed:
            open(path, 'w', encoding='utf-8').write(html)
    if check:
        if found:
            print('Word lists still use B1.1/B1.2 (run scripts/merge_b1.py):', ', '.join(sorted(set(found))))
            sys.exit(1)
        print('OK: no B1.1/B1.2 levels left in the word lists.')
    else:
        print(f'{total} entries merged into B1.')


if __name__ == '__main__':
    main()
