# -*- coding: utf-8 -*-
"""Validate the Satzbau-Trainer sentence data (js/satzbau-data.js, or a JSON file given as argument).

Every sentence is a list of chunks, each tagged with its grammatical role:
  S Subjekt · V finites Verb (Hauptsatz) · E Verbende im Hauptsatz (Partizip II, Infinitiv, Präfix, Passiv-Partizip)
  Q W-Fragewort · K Konnektor Position 0 (und, aber, denn, sondern, oder, doch)
  A Adverb-Konnektor Position 1 (deshalb, trotzdem, dann, danach, außerdem, sonst ...)
  N Einleiter eines Nebensatzes / Infinitivsatzes / Relativsatzes (weil, dass, wenn, ob, als, der/die/das, wo, um ...)
  v finites Verb im Nebensatz · e Verb-Teil im Nebensatz vor v (Infinitiv, Partizip, "zu"-Infinitiv am Ende von um...zu)
  T Zeit · C Grund (kausal) · M Art und Weise (modal) · L Ort / Richtung · O Akkusativ-Objekt · D Dativ-Objekt
  P Präpositional-Objekt · R Reflexivpronomen · X Negation (nicht, nie) · W weitere Ergänzung (Prädikativ, Adjektiv ...)

Checks (German word order, per clause):
  * roles are known; German, English and Tamil text present
  * main clause: the finite verb V is the 2nd chunk (one chunk before it; a K connector at the start does not
    count; a preceding subordinate clause IS that chunk) — except in topics with verb-first sentences
    (ja/nein questions, imperative, conditional without "wenn")
  * subordinate clause (starts with N): its last chunk is the finite verb v, or for zu-infinitive clauses (um/ohne/
    statt/anstatt ... zu) the infinitive e; every e comes before the v (except the Ersatzinfinitiv topic)

Run: python3 scripts/check_satzbau.py [file.json]      (exit 1 on problems)
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROLES = set('SVEQKANveTCMLODPRXW')
V1_TOPICS = {'janein', 'imperativ'}               # verb-first sentences allowed
EMBED_TOPICS = {'relativsatz'}                    # relative clause may sit inside the main clause
ERSATZ_TOPICS = {'ersatzinfinitiv'}               # "dass er hat kommen müssen": finite verb before the infinitives
ZU_INTRO = {'um', 'ohne', 'statt', 'anstatt'}


def load(path=None):
    if path and path.endswith('.json'):
        return json.load(open(path, encoding='utf-8'))
    js = open(path or os.path.join(ROOT, 'js', 'satzbau-data.js'), encoding='utf-8').read()
    return json.loads(js[js.index('{'):js.rindex('}') + 1])


def clauses(tokens):
    """Split into clauses: a new clause starts at N, at K, and after a chunk ending with a comma."""
    out, cur = [], []
    for i, (txt, role) in enumerate(tokens):
        if cur and (role in 'NK' or tokens[i - 1][0].rstrip().endswith(',')):
            out.append(cur); cur = []
        cur.append((txt, role))
    if cur:
        out.append(cur)
    return out


def check_sentence(topic, s):
    errs = []
    toks = s.get('t') or []
    if not toks or not all(isinstance(t, list) and len(t) == 2 and t[0].strip() for t in toks):
        return ['bad token list']
    for txt, role in toks:
        if role not in ROLES:
            errs.append(f'unknown role {role!r} on {txt!r}')
    for k in ('en', 'ta'):
        if not str(s.get(k, '')).strip():
            errs.append(f'missing {k}')
    if errs:
        return errs
    tid = topic.get('id', '')
    cls = clauses(toks)
    prev_sub = False
    for ci, cl in enumerate(cls):
        roles = [r for _, r in cl]
        words = [t for t, _ in cl]
        if roles[0] == 'N':                                    # subordinate / infinitive / relative clause
            intro = words[0].lower().strip(',')
            last = roles[-1]
            if intro in ZU_INTRO:
                if last != 'e':
                    errs.append(f'zu-infinitive clause must end with the infinitive (e): {" ".join(words)}')
            elif tid not in ERSATZ_TOPICS:
                if last != 'v':
                    errs.append(f'verb must be last in the subordinate clause: {" ".join(words)}')
                if 'v' in roles and 'e' in roles and max(i for i, r in enumerate(roles) if r == 'e') > roles.index('v'):
                    errs.append(f'infinitive/participle must come before the finite verb: {" ".join(words)}')
            prev_sub = True
            continue
        body = roles[1:] if roles[0] == 'K' else roles
        if 'V' not in body:
            if tid in EMBED_TOPICS or (ci + 1 < len(cls) and cls[ci + 1][0][1] == 'N'):
                prev_sub = False
                continue                                       # e.g. "Der Mann, [der dort steht,] ist ..."
            errs.append(f'main clause without finite verb V: {" ".join(words)}')
            continue
        vi = body.index('V')
        allowed = {1} | ({0} if (prev_sub or tid in V1_TOPICS or tid in EMBED_TOPICS) else set())
        if tid in EMBED_TOPICS and ci > 0 and prev_sub:
            allowed |= {0}
        if vi not in allowed:
            errs.append(f'finite verb must be the 2nd chunk (found at {vi + 1}): {" ".join(words)}')
        prev_sub = False
    return errs


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else None
    data = load(path)
    problems, n, ids = [], 0, set()
    for group in ('grammar', 'thematic'):
        for topic in data.get(group, []):
            tid = topic.get('id')
            if not tid or tid in ids:
                problems.append(f'topic id missing or duplicate: {tid}')
            ids.add(tid)
            for k in ('title', 'title_en', 'rule', 'rule_en', 'rule_ta', 'level'):
                if not str(topic.get(k, '')).strip():
                    problems.append(f'{tid}: missing {k}')
            seen = set()
            for s in topic.get('sentences', []):
                n += 1
                key = ' '.join(t[0] for t in s.get('t', [])).lower()
                if key in seen:
                    problems.append(f'{tid}: duplicate sentence {key}')
                seen.add(key)
                for e in check_sentence(topic, s):
                    problems.append(f'{tid}: {e}')
    if problems:
        print(f'Satzbau data: {len(problems)} problem(s) in {n} sentences:')
        for p in problems[:80]:
            print('  ' + p)
        sys.exit(1)
    print(f'OK: Satzbau data valid ({len(ids)} topics, {n} sentences).')


if __name__ == '__main__':
    main()
