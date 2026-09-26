# -*- coding: utf-8 -*-
"""Check js/grammar-scenarios.js (Grammatik-Regeln: sentence types with examples): every rule id exists in
Grammatik_Regel_Trainer.html or js/grammar-rules-extra.js; every type has a title, a why-line (German + English)
and >= 3 examples;
each example has de + en, balanced [ ] markers, final punctuation (. ! ?), matches the type's `must` pattern (JS regex,
flag u) and is not repeated within the rule; every A1 rule of the page has types (phase 1 of Task 80).
Run: python3 scripts/check_grammar_scenarios.py"""
import os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = r"""
global.window = global; require('./js/grammar-scenarios.js');
const fs = require('fs');
const src = fs.readFileSync('Grammatik_Regel_Trainer.html', 'utf8') + (fs.existsSync('js/grammar-rules-extra.js') ? fs.readFileSync('js/grammar-rules-extra.js', 'utf8') : '');
const ids = new Set([...src.matchAll(/id:\s*["']([a-z0-9_]+)["']/g)].map(m => m[1]));
const a1 = [...src.matchAll(/id:\s*["'](a1_[a-z0-9_]+|r1_wordorder)["']/g)].map(m => m[1]);
const errs = []; let nt = 0, ne = 0;
for (const [rid, types] of Object.entries(DC_GRAMMAR_SC)) {
  if (!ids.has(rid)) errs.push(`${rid}: no such rule`);
  const seen = new Set();
  types.forEach((t, i) => {
    nt++; const tag = `${rid} / ${t.t || '#' + (i + 1)}`;
    if (!t.t || !t.d) errs.push(`${tag}: title or why-line missing`);
    if (!t.t_en || !t.d_en) errs.push(`${tag}: English title / why-line missing (t_en, d_en)`);
    if (!Array.isArray(t.ex) || t.ex.length < 3) errs.push(`${tag}: only ${(t.ex || []).length} examples (need 3)`);
    let re = null; try { re = t.must ? new RegExp(t.must, 'u') : null; } catch (e) { errs.push(`${tag}: bad must regex`); }
    (t.ex || []).forEach((x, k) => {
      ne++; const de = x.de || '', plain = de.replace(/[\[\]]/g, '');
      if (!de || !x.en) errs.push(`${tag} #${k + 1}: de/en missing`);
      if ((de.match(/\[/g) || []).length !== (de.match(/\]/g) || []).length || !de.includes('[')) errs.push(`${tag} #${k + 1}: [ ] markers missing or unbalanced`);
      if (!/[.!?]$/.test(plain)) errs.push(`${tag} #${k + 1}: final punctuation`);
      if (re && !re.test(plain)) errs.push(`${tag} #${k + 1}: does not show this type (${t.must}): ${plain}`);
      if (seen.has(plain)) errs.push(`${tag} #${k + 1}: duplicate: ${plain}`); seen.add(plain);
    });
  });
}
for (const id of a1) if (!DC_GRAMMAR_SC[id]) errs.push(`${id}: A1 rule without sentence types`);
process.stdout.write(JSON.stringify({ errs, nr: Object.keys(DC_GRAMMAR_SC).length, nt, ne }));
"""
import json
r = json.loads(subprocess.check_output(['node', '-e', JS], cwd=ROOT, text=True))
if r['errs']:
    print(f"Grammar sentence types: {len(r['errs'])} problem(s)"); [print('  ' + e) for e in r['errs']]; sys.exit(1)
print(f"OK: grammar sentence types valid ({r['nr']} rules, {r['nt']} types, {r['ne']} examples, >= 3 per type).")
