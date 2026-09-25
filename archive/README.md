# Archive

Files moved out of the production surface during the repository cleanup
pass, none of which are referenced by any shipped page, `manifest.json`,
or `sw.js` (verified before moving). Kept here rather than deleted, per
project policy, in case any contains logic worth referencing later.

- `patch_*.py`, `fix_*.py`, `restore_*.py`, `update_html.py`,
  `update_nomen.py`, `bulk_cleanup.py`, `bump_sw.py`, `debug_wmg.py`,
  `extract_json.py`, `implement_ai_state.py`, `inject_srs.py`, `inline.py`,
  `reorder.py`, `reorder_csv.py`, `refactor_grammar.py`,
  `update_dialog.py`, `smoke_test.py` - one-off scripts from earlier
  editing sessions, each targeting a single file/bug that's already
  fixed. Not reusable tooling (see `scripts/` at the repo root for that).
- `test_click.js`, `test_dc.js`, `test_dc2.js`, `test_dom.js`,
  `test_vault.js` - ad hoc test scripts from earlier debugging, not a
  real test suite.
- `old_nat.html`, `old_vtt.html`, `old_nat.txt` - superseded backup
  copies of `Nomen_Adjektiv_Trainer.html` / `Verb_Transformation_Trainer.html`.
- `WMG_remote.html` - a byte-for-byte duplicate of
  `Wortschatz_Master_Grid.html`, never linked from any nav, README, or
  `manifest.json`.
- `test_inline.html` - a diverged scratch copy of `deutsch-coach.html`,
  never linked anywhere.
- `simple_mode.css` - unreferenced stylesheet.
- `diff.txt`, `refactor_diff.txt` - stray diff output, not source.
- `A1 Document.docx` - the source document an earlier session used to
  generate A1 vocabulary; not read by any code.

Reusable maintenance tooling that's still actually used lives in
`/scripts` (`build.py`, `sync_data.py`) at the repo root, not here.

- `data_old_json/` + `sync_data_old.py` (archived in Task 38): an old 503-verb JSON copy of the word lists and the script that pasted it into every page. Replaced by `js/word-data.js`; running the old script would have overwritten newer data.
