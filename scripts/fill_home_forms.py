# -*- coding: utf-8 -*-
"""Fill EMPTY grammatical forms on the home flashcards (deutsch-coach.html) from the canonical lists.

The textbook/A1 cards were written before the master lists existed, so many verbs have no
Präteritum/Perfekt ("entscheiden", "bleiben") and many nouns no plural ("Himmel", "Licht"),
although VERBS / NOUNS have them. Without them the card can't show the forms, the verb-tense and
plural quizzes skip the card, and the memory tips have nothing to check.

Only EMPTY fields are filled, only on an exact word match (for nouns: a missing article is added, a
plural only when the article matches);
a form the card already has is never changed. Nouns whose master plural is "—" (no plural) stay empty. Adjectives get comp/sup (Steigerung).
Idempotent.   Run: python3 scripts/fill_home_forms.py [--check]
"""
import os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_vocab_sync import load, CANON, ROOT  # noqa: E402

HOME = os.path.join(ROOT, 'deutsch-coach.html')
OBJ_RE = re.compile(r'\{[^{}]*\}')


def field(obj, key):
    m = re.search(r'(?:"%s"|\b%s)\s*:\s*"((?:[^"\\]|\\.)*)"' % (key, key), obj)
    return m.group(1) if m else None


def set_field(obj, key, value):
    quoted = obj.lstrip('{').lstrip().startswith('"')
    val = value.replace('\\', '\\\\').replace('"', '\\"')
    pat = re.compile(r'((?:"%s"|\b%s)\s*:\s*)"(?:[^"\\]|\\.)*"' % (key, key))
    if pat.search(obj):
        return pat.sub(lambda m: m.group(1) + '"' + val + '"', obj, count=1)
    k = '"%s": ' % key if quoted else '%s:' % key
    sep = ', ' if quoted else ','
    return obj[:-1].rstrip() + sep + k + '"' + val + '"}'


def main():
    check = '--check' in sys.argv
    verbs = {v['inf']: v for v in load(*CANON['v'][:2])}
    adjs = {a['w']: a for a in load(*CANON['a'][:2])}
    nouns = {}
    for n in load(*CANON['n'][:2]):
        nouns.setdefault(n['sg'], n)
    html = open(HOME, encoding='utf-8').read()
    start = html.index('const SYNCED_WORDS')          # SYNCED_WORDS come from the lists already
    head, tail = html[:start], html[start:]
    changes = []

    def fix(m):
        obj = m.group(0)
        w, cat = field(obj, 'w'), field(obj, 'cat')
        if not w or cat not in ('v', 'n', 'adj'):
            return obj
        if cat == 'adj' and w in adjs:
            a = adjs[w]
            for key, val in (('comp', a.get('komp') or a.get('comp')), ('sup', a.get('sup'))):
                if val and val not in ('—', '-') and not (field(obj, key) or '').strip():
                    obj = set_field(obj, key, val); changes.append((w, key, val))
        if cat == 'v' and w in verbs:
            v = verbs[w]
            for key, src in (('pr', 'praeteritum'), ('pp', 'perfekt')):
                if not (field(obj, key) or '').strip() and v.get(src):
                    obj = set_field(obj, key, v[src]); changes.append((w, key, v[src]))
        if cat == 'n':
            sg = re.sub(r'\([^)]*\)', '', w).strip()
            n = nouns.get(sg)
            if n and n['a'] and not (field(obj, 'a') or '').strip():      # A1 starter nouns have no article
                obj = set_field(obj, 'a', n['a']); changes.append((w, 'a', n['a']))
            if n and n['a'] == (field(obj, 'a') or '') and not (field(obj, 'p') or '').strip() and n['pl'] not in ('—', '-', ''):
                obj = set_field(obj, 'p', n['pl']); changes.append((w, 'p', n['pl']))
        return obj

    new_head = OBJ_RE.sub(fix, head)
    if check:
        if changes:
            print('Home cards with empty forms the master lists have (run scripts/fill_home_forms.py):')
            for c in changes[:20]:
                print('  ', c)
            sys.exit(1)
        print('OK: no home card is missing a form the master lists have.')
        return
    if changes:
        open(HOME, 'w', encoding='utf-8').write(new_head + tail)
    print('filled %d fields (%d verb forms, %d articles/plurals, %d comparison forms)' % (
        len(changes), sum(1 for c in changes if c[1] in ('pr', 'pp')), sum(1 for c in changes if c[1] in ('p', 'a')),
        sum(1 for c in changes if c[1] in ('comp', 'sup'))))
    for c in changes[:12]:
        print('  ', c)


if __name__ == '__main__':
    main()
