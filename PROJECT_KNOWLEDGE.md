# PROJECT KNOWLEDGE

> **This is a living document.** Every AI (Claude, GPT, Gemini, Qwen, DeepSeek, etc.) working on this
> project must read this file before making changes, inspect the relevant source files directly, make
> only justified changes, and update this file afterward per the rules in Sections 27–29. If this file
> ever conflicts with the source code, **the source code wins** — correct this file and log the
> correction under AI-Discovered Knowledge or AI Change History.

---

## 1. Project Overview

"Dein Deutsch-Coach" is a German-vocabulary and grammar learning suite for a single named learner
(Arun) who is learning German with English/Tamil as base languages, targeting CEFR levels A1 through
B1.2, following the textbooks **"Auf jeden Fall!"** (A2/B1.1/B1.2) and **"Einfach gut! B1"**. There is
no single unified application — the project is a collection of **five independent, self-contained
single-file HTML apps** plus two supporting reference/data-generation deliverables (Excel workbooks,
an audio player + transcript). Each HTML app embeds its own vocabulary as inline JSON; there is no
shared backend, build system, or database.

## 2. Current Status (rewritten — most of this section was severely stale)

**This entire section, and much of Sections 3-5 below, described a pre-git, 5-file, no-shared-code
snapshot of the project that stopped being true a long time before this rewrite. If you are an AI
agent reading this file: verify claims against the actual source before trusting them, per the header
above — this file has drifted from reality before and will again.**

As of this rewrite (branch `feature/production-learning-platform`, off `main`), the real state is:

- **23 HTML pages** (`ls *.html` — this count has drifted before; re-verify rather than trust it),
  git-tracked, hosted on GitHub Pages from `main`
  (`github.com/ArunVivekanandhan/deutsch-coach`, live at
  `https://arunvivekanandhan.github.io/deutsch-coach/`). Includes
  `A1_Sprech_Pruefungs_Simulator.html`, added in a later session (see Section 28) alongside the B1
  `Sprech_Pruefungs_Simulator.html` it mirrors.
- **A real git history** with three lines of work that converged: `main` (the deployed branch),
  `master` (an older, now-orphaned line with a different, pre-refactor architecture — not deployed,
  do not assume it reflects current reality), and feature branches. Multiple AI sessions (this one and
  at least one other working directly on `main` in parallel) have touched this repo; expect to find
  work that looks unfamiliar and verify before assuming it's broken or correct.
- **A shared-code layer now exists** and is loaded on nearly every page: `css/design-system.css`,
  `js/app-shell.js` (sidebar/header shell, injected at runtime — see Section 5), `js/srs-engine.js`
  (the `SRSEngine.Engine` class — a real, shared spaced-repetition engine), `js/icon-svgs.js`,
  `js/tamil-dict.js`, `js/tts-engine.js` (shared text-to-speech), `js/progress-aggregator.js` (added
  this session — see Section 14), `js/german-conjugation.js` (Präsens engine + person/auxiliary
  tables, used by Thema_Sprech_Trainer and the Excel sheet — Task 29), `js/memory-tips.js` (memory tips
  checked against each word's real forms — home flashcards, Verb/Adjektiv trainers, Excel Merkhilfe — Task 30; plus the
  Wortaufbau renderer), `js/word-parts.js` (GENERATED syllables + word parts for every word — Task 31). This directly supersedes the old "no shared code, everything
  copy-pasted" claim in the original Section 25 below (kept below for historical context but no
  longer accurate as a blanket statement).
- **Word lists are unified (Task 38); grammar/practice content is not.**
  **Since Task 38 the word lists have ONE source: `js/word-data.js`** (`DC_WORDS.VERBS` 719, `DC_WORDS.NOUNS`
  1,089, `DC_WORDS.ADJS` 671). The pages that used to carry copies (Verb/Nomen/Adjektiv trainers, Excel sheet,
  Master Grid, Verben Hören, Continuous Speaker, Thema-Sprech-Trainer) load it and alias it
  (`const VERBS = DC_WORDS.VERBS;`). The old `data/*.json` snapshot and `sync_data.py` were moved to `archive/`.
  Home flashcards cover every word via their lessons + `SYNCED_WORDS`. **After changing words: edit `js/word-data.js`, run
  `python3 scripts/build_freq_ranks.py`, `python3 scripts/fill_home_forms.py` and `python3 scripts/build_word_parts.py`
  (needs `pip install pyphen`, node, apt access for the Ding package) and `python3 scripts/build_lexicon.py`, then `python3 scripts/build.py`** — the build runs
  `scripts/check_vocab_sync.py`, `fill_home_forms.py --check`, `build_word_parts.py --check`, `fix_tamil.py --check`,
  `merge_b1.py --check` and `build_lexicon.py --check` and fails on any drift. A new root word used as a word part needs a line (English + Tamil) in `scripts/word_parts_meanings.tsv`.
  **Levels**: `A1`/`A2`/`B1`/`B2`/`C1` (B1.1/B1.2 were merged into B1 in Task 34; the textbook part is kept as `srcLevel`) from textbooks, plus frequency estimates for entries with
  no textbook level (`level` A1–C1 with `levelEst: true`; every entry has `freq` = rank in the
  OpenSubtitles-2018 top-50k list, 0 = rarer). Display estimates with "≈"; check a given array's actual
  distinct `level` values before writing level-filtering logic against it.
- **Progress storage is genuinely fragmented across 9 localStorage keys with 4 incompatible shapes**
  (real vocabulary SRS data vs. streak counters vs. completion counters vs. dead/unused keys) — see
  Section 14 for the full breakdown and why `js/progress-aggregator.js` only aggregates 3 of the 9.
- **Repository hygiene**: `/archive` holds ~70 one-off scripts and dead file duplicates moved out of
  the production surface this session (see `archive/README.md` for what and why — none were deleted).
  `/scripts` holds the two still-useful maintenance tools (`build.py` regenerates `sw.js`'s cache list
  and runs a basic smoke test; the old `sync_data.py` is archived — `js/word-data.js` is the single word source).
- **A real, if partial, UX/IA transformation is in progress** (this session, per an explicit product
  brief) — see the changelog entry in Section 28 for exactly what was and wasn't completed. The
  honest summary: bug fixes, progress unification, and an accessibility/mobile pass are done and
  verified; the larger "unify 21 tools into Vocabulary/Grammar/Practice sections" navigation rebuild
  is NOT done — `deutsch-coach.html` already has a reasonably capable dashboard/session UI, and the
  shared sidebar nav exists, but the tools remain 21 separate pages, not one coherent flow.

## 3. Technology Stack

- **Languages:** Vanilla HTML5, CSS3 (custom properties / CSS variables), vanilla JavaScript (ES6+,
  no transpilation, no modules — everything in inline `<script>` tags).
- **No framework, no build tool, no package manager.** No `package.json` exists anywhere in the project.
- **Fonts:** Google Fonts (`Fjalla One`, `IBM Plex Mono`, `IBM Plex Sans`), loaded via `<link>` — apps
  will not render their intended typography offline/without internet on first load.
- **Browser APIs used:** `localStorage` (progress persistence), `SpeechSynthesis`/`SpeechSynthesisUtterance`
  (TTS across all apps), `SpeechRecognition` (main app's Sprechen/speaking view only），`Wake Lock API`
  and `Media Session API` (audio player only, `Verben_Hoeren_EN_DE.html`), Service Worker + Web App
  Manifest (main app only, for PWA installability).
- **Excel generation:** the four `.xlsx` workbooks are OOXML files; the generating Python pipeline
  (presumably `openpyxl`) is **not part of the delivered project files** — only the output workbooks
  exist in the project folder. Regenerating or editing them programmatically would require
  rebuilding that pipeline from scratch.

## 4. Project Structure

All files are flat in the project root directory (`C:\Users\arunr\OneDrive\Documents\Projects\AIDrive\Deutsch_Coach_Project` — previously `/mnt/user-data/outputs/` in Linux sandbox) — there are no subfolders.

```
Deutsch_Coach_Project/
├── index.html                              # Main PWA — diverged (index is UI, coach is legacy data payload) to deutsch-coach.html
├── deutsch-coach.html                      # Main PWA (updated with Suite Hub & 6 reading passages)
├── KI_Human_Partner.html                   # 1-on-1 Interactive Video Call Coach with Animated Realistic Human Persona, Lip-sync & Live Grammar Feedback
├── KI_German_Coach.html                    # Real-time AI German Conversation Coach & Live Grammar Partner (Multi-AI: DeepSeek/OpenAI/Gemini/Groq/Ollama)
├── manifest.json                           # PWA manifest (name, icons, colors, start_url)
├── sw.js                                   # Service worker (v4) — caches all suite apps offline
├── icon-192.png, icon-512.png              # PWA icons
├── Grammatik_Regel_Trainer.html            # 42 grammar rules A1–B2 (+ js/grammar-rules-extra.js): tables, pictures, audio, drills, Tamil bridges (js/grammar-tamil.js)
├── Sprech_Pruefungs_Simulator.html         # Oral Exam Simulator (Teil 1-3), Spoken Redemittel Vault & Letter Builder
├── German_A2_Practice_Studio.html          # Interactive 7-module A2 learning studio with Suite Hub
├── German_B1_Practice_Studio.html          # Interactive 7-module B1 learning studio with Suite Hub
├── Verb_Transformation_Trainer.html        # Standalone verb Präsens→Vergangenheit trainer with Suite Hub
├── Nomen_Trainer.html                      # Standalone noun-plural trainer with Suite Hub (split from Nomen_Adjektiv_Trainer.html)
├── Adjektiv_Adverb_Trainer.html            # Standalone adjective-comparison trainer, grouped by semantic category, with Suite Hub (split from Nomen_Adjektiv_Trainer.html)
├── Zeitreise_Trainer.html                  # Past / present / future practice + verb time machine (data: js/tense-scenarios.js)
├── Bild_Grammatik.html                    # Grammar concepts as animated pictures + picture quiz (js/bild-grammatik.js)
├── Mein_Fortschritt.html                  # Weekly practice time per skill + results (dc_activity)
├── Meine_Fehler.html                      # Shared mistake notebook with spaced review (js/mistakes.js)
├── Text_Trainer.html                       # Exam-style EN→DE paragraph translation + ⚡ Crashkurs (data: js/text-drills.js)
├── Wort_Zwillinge.html                     # Look-alike / sound-alike words (Küche/Kuchen): learn cards + quiz (data: js/confusables.js)
├── Satzbau_Trainer.html                    # Word-order trainer (data: js/satzbau-data.js, check: scripts/check_satzbau.py)
├── KI_Sprechpartner.html                   # Real-time AI video-call tutor (Task 48; engine in js/call/*, Simli SDK in js/vendor/)
├── Continuous_Verb_Speaker.html            # Standalone audio loop verb speaker with Suite Hub
├── Verben_Hoeren_EN_DE.html                # Standalone audio listen-and-repeat player with Suite Hub
├── konnektoren_referenz.html               # Static connector-grammar reference page with Suite Hub
├── German_A2_Practice_Template.xlsx        # Practice drill template (A2 course curriculum template)
├── Wortschatzliste_B1.1_B1.2.xlsx          # Vocabulary workbook (Auf jeden Fall! B1.1/B1.2)
├── Deutsch_Uebungsvorlage_B1.1_B1.2.xlsx   # Grammar drill workbook (same source)
├── Einfach_gut_B1_Wortschatzliste.xlsx     # Vocabulary workbook (Einfach gut! B1)
├── Einfach_gut_B1_Uebungsvorlage.xlsx      # Grammar drill workbook (same source)
├── A2_Verben_01-50_Audio.mp3               # Companion audio for the first 50 A2 verbs
└── A2_Verben_01-50_Begleittext.md          # Transcript/script for that audio file
```

`index.html` and `deutsch-coach.html` are **confirmed diverged (index is UI, coach is legacy data payload)** (`diff` returns empty). Only
`index.html` is referenced by `manifest.json`'s `start_url` and by `sw.js`'s cache list — treat
`index.html` as canonical and `deutsch-coach.html` as a redundant copy that must be kept in sync
manually if `index.html` is edited (there is no build step that copies one to the other).

## 5. Architecture

Every app (except `konnektoren_referenz.html`, which is static) follows the **same self-contained
single-page pattern**:

1. One `<style>` block defining CSS custom properties (`--paper`, `--ink`, `--red`, `--gold`, `--green`,
   `--blue`, `--purple`, etc. — a consistent "vintage travel-document / stamped paper" visual theme
   reused verbatim across all 5 apps) and component classes.
2. One or more `<script>` blocks (the main app splits its ~1300 lines of JS across **10 separate
   `<script>` tags** — see Section 12; the standalone trainers use a single `<script>` block).
3. A large inline `const DATA_ARRAY = [...]` (or several) holding every vocabulary item as a JSON
   literal directly in the JS source — this is the entire "database." There is no fetch, no external
   JSON file, no API call for content.
4. Global mutable state variables (`let curLevel`, `let session`, etc. — see Section 13).
5. Pure render functions that rebuild `innerHTML` of specific containers on every state change
   (no virtual DOM, no diffing — direct string-template `innerHTML` replacement throughout).
6. A `localStorage`-backed spaced-repetition progress store, duplicated with near-identical logic in
   each app that has one (see Section 6 and Section 25 — **this logic is copy-pasted, not shared**).

There is **no shared JS file, no shared component library, and no shared data file** across the 5 apps.
Every architectural pattern (icon SVG library, Tamil-translation dictionary, spaced-repetition box
schedule, diff-highlighting algorithm) that appears in more than one app was **independently
copy-pasted and, in places, extended differently per app** — see Section 25 for the concrete risk this
creates.

## 6. Application Data Flow

Pattern shared by all interactive trainers (main app + 4 standalone trainers):

```
DATA_ARRAY (embedded JSON)
   → pool()/poolForLevel() (filter by user-selected level/type/topic chips)
   → buildQueue()/buildSmartQueue() (prioritize: overdue > difficult > recently-seen-weak > new > mastered)
   → session[] + sessionIdx (current study queue and cursor)
   → renderCard() (builds prompt HTML, wires "Show answer" button)
   → user reveals answer → renderCard()'s reveal handler shows the form + rule explanation
   → user self-rates (Again / Knew it / Know it well)
   → recordAnswer(uid, correct) mutates PROGRESS[uid] (box number, next-due date, timesWrong)
   → saveProgress(PROGRESS) writes the whole PROGRESS object to localStorage
   → advance() moves sessionIdx forward and re-renders
```

The main app (`deutsch-coach.html`) additionally has non-card views (Dashboard, Sprechen/speaking,
Schreiben/writing, Prüfung/exam-readiness) that read from `ALL_CARDS` and `PROGRESS` but do not
themselves feed back into the spaced-repetition queue in the same way.

## 7. Data Models

**Main app card object** (from `LEGACY_DATA`, flattened into `ALL_CARDS`):
```
{ a, w, p, en, ex, cat, mn, pr, pp, level, topic, uid }
```
`a`=Artikel, `w`=word, `p`=plural, `en`=English gloss, `ex`=example sentence(s), `cat`=word type
(`n`/`v`/`adj`/`p`=phrase), `mn`=mnemonic (HTML string, often a "sound-alike" trick), `pr`=Präteritum
(verbs only), `pp`=Perfekt (verbs only). `uid` is assigned during flattening via:
`base = (c.level+"|"+c.topic+"|"+c.w).replace(/\s+/g,"_")` with collision avoidance:
`while(seenUid[uid]){ uid = base+"__"+(++n); }` (verified in `index.html` lines 1784-1791).

**Verb_Transformation_Trainer.html verb object:**
```
{ inf, en, perfekt, praeteritum, noun, level, source, typ, icon, ta, ta_translit, uid }
```
`typ` ∈ `{weak, strong, mixed}` (German verb-family classification). `source` ∈ `{"your own list",
"Einfach gut! B1", "Auf jeden Fall!"}`. `noun` is a manually-curated related noun for every one of the
503 verbs (100% coverage, added as an explicit fix — see Section 28 history). `uid` is generated as:
`v.uid = v.level + '|' + v.inf` (verified in `Verb_Transformation_Trainer.html` line 268).

**Nomen_Trainer.html noun object** (split from the former `Nomen_Adjektiv_Trainer.html` — see Section 28 Task 22):
```
{ sg, pl, a, en, ta, ta_translit, icon, level, topic, typ, uid }
```
`typ` ∈ `{en, e, er, s, unchanged, umlaut_only}` (plural-formation family). `uid` is generated as:
`v.uid = 'n|' + v.level + '|' + v.sg`.

**Adjektiv_Adverb_Trainer.html adjective object** (split from the former `Nomen_Adjektiv_Trainer.html` — see Section 28 Task 22; the 99 non-adjective entries the combined page's `ADJS` array previously carried were dropped during the split, not migrated):
```
{ w, komp, sup, en, ta, ta_translit, icon, source, typ, cat, uid }
```
`typ` ∈ `{regular, umlaut, irregular}` (comparison-formation family). `cat` ∈ 13 semantic categories
(e.g. `zeit`, `charakter`, `gefuehle`, `gesundheit` — see `ADJ_CATEGORIES`), added during the Task 22
split for the category-filter UI; every one of the 246 real entries was hand-classified into exactly one
category. `uid` is generated as: `v.uid = 'a|' + v.w`. `komp`/`sup` (Komparativ/Superlativ) were
**generated programmatically** by a rules engine (regular suffixation + a hand-curated umlaut-word list +
a tiny irregular-word dict for `nah→näher→am nächsten`), **not sourced from a textbook** — treat these
forms as good-faith derivations, not verified textbook data (unlike the noun plurals, which are sourced
from the original glossary).

**Satzbau_Trainer.html** (since Task 43): data in `js/satzbau-data.js` → `window.SATZBAU_DATA = { grammar: [...], thematic: [...] }`.
A topic = `{id, level, title, title_en, rule, rule_en, rule_ta, formula:[[label, role]], tip, mistake, sentences}`;
a sentence = `{t: [[chunk, role], ...], end, en, ta, lv?}` — the chunks (Satzglieder) in correct German order, each with
a role letter (S V E Q K A N v e T C M L O D P R X W, see the file header). `scripts/check_satzbau.py` (run by build.py)
checks every sentence's word order (V on position 2, v last in a Nebensatz, zu-infinitive last …).

**Verben_Hoeren_EN_DE.html:** `{ w, en, level }` — minimal, audio-playback-only, no progress tracking.

## 8. Important Functions

(Only the load-bearing, hardest-to-reconstruct functions — full inventories are in the grep output any
AI can reproduce with `grep -n "^function "` on each file.)

- **`buildQueue(pool, limit)` / `buildSmartQueue(pool, limit)`** (every trainer) — the prioritization
  heart of the app: overdue-and-seen first, then difficult (≥2 wrong answers), then recently-seen weak
  cards (box ≤2), then a shuffled slice of brand-new cards (up to ~50% of the session), then a small
  slice of mastered cards for long-term retention, then anything left. Getting this wrong silently
  breaks the "smart" part of every trainer's core promise.
- **`recordAnswer(uid, correct[, qType])`** (every trainer) — Leitner box state machine: correct → box
  = min(5, box+1); wrong → box = 1 and `timesWrong++`. Next-due date comes from `BOX_SCHEDULE`
  `{1:0, 2:1, 3:3, 4:7, 5:14}` days.
- **`diffHighlight(a, b)`** (Verb_Transformation_Trainer.html, Nomen_Adjektiv_Trainer.html) — computes
  the common prefix/suffix between two German word forms and wraps the differing middle in
  `<span class="diffchar">`, used for the visual transformation diagram. Pure string algorithm, no
  linguistic awareness — it will visually "highlight" separable-prefix or umlaut changes correctly only
  because German morphology usually keeps a shared prefix/suffix, not because it understands grammar.
- **`updateLiveRuleRef(v)`** (Verb_Transformation_Trainer.html only) — added this session; keeps the
  static "3 Verb-Familien" reference table synced to the currently displayed word (highlights the
  matching row, injects the word's own live example). **This function directly manipulates DOM elements
  by hardcoded id** (`rowref-weak`, `ex-weak`, etc.) — if the table's HTML ids are ever renamed, this
  silently stops updating with no error.
- **`vowelChangeNote(v)`** (Verb_Transformation_Trainer.html) — best-effort heuristic that finds the
  last vowel of the infinitive and of the Präteritum and reports the shift (e.g. "e → a") for display
  in the rule box. It is a naive last-vowel diff, not a real Ablaut-family lookup — it can misfire on
  words with unusual internal structure. **Treat its output as illustrative, not authoritative.**
- **`generate_comparison(adj)`** (Python, used at data-prep time, not present at runtime in the HTML —
  only its *output* `komp`/`sup` fields are embedded) — the rules engine behind adjective comparison
  forms. Not reachable from the shipped HTML; if new adjectives need comparison forms, this logic must
  be re-implemented or re-run outside the browser.

## 9. Business Logic

- **Leitner-style spaced repetition** is the single unifying pedagogical mechanism across every
  interactive trainer: 5 boxes, correct advances a box, wrong resets to box 1, due dates computed from
  a fixed day-schedule per box.
- **"Smart Learn" queue ordering** (Section 8) encodes a specific pedagogical priority: rescue overdue
  material first, hammer on demonstrably-difficult words, keep drip-feeding new material, and lightly
  revisit mastered material so it doesn't decay. This ordering is a deliberate design decision, not
  incidental — see Section 24.
- **Verb-family / plural-family / comparison-family classification** (`typ` field, present in all three
  vocabulary-transformation trainers) exists specifically to let the learner filter by *difficulty*
  (e.g. "only Strong verbs today") rather than by topic — this is the pedagogical core of those three
  apps and the reason the reveal screens always show *why* a word behaves the way it does, not just
  *what* the correct form is.
- **Bidirectional recall direction** (`curDir`, `de2en`/`en2de`) was added to force **production**
  recall (see meaning, produce German) as a harder, more diagnostic test than **recognition** recall
  (see German, produce the transformed form) — this is a deliberate pedagogical upgrade, present in
  `Verb_Transformation_Trainer.html` and `Nomen_Adjektiv_Trainer.html` only (not yet in the main app or
  Satzbau).

## 10. Features

### Feature: Main vocabulary trainer (Dashboard / Lernen / Sprechen / Schreiben / Prüfung)
- **Status:** Complete, in active use. Contains 1,219 cards total across Nouns, Adjectives, Expressions, and 522 Verbs (covering 100% of the 503 master verbs from `Verb_Transformation_Trainer.html`).
- **Implementation location:** `index.html` / `deutsch-coach.html` (2939 lines), all logic in the 10 `<script>` blocks.
- **Related files:** `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.
- **Important logic:** `renderView()` dispatches on `currentView`; 6 different question-type renderers
  (`renderRecallMeaning`, `renderMcDe2En`, `renderMcEn2De`, `renderArticle`, `renderPlural`,
  `renderVerbTense`, `renderFillGap`) are randomly selected per card via `pickQType(card)`, constrained
  by `validTypesFor(card)` (e.g. `renderArticle` only valid for nouns).
- **Dependencies:** browser `SpeechRecognition` (Sprechen view) and `SpeechSynthesis` (multiple views) —
  both are optional-enhancement, not required for the app to function.
- **Known limitations:** A1 level has "no real source vocabulary beyond one example word" (per an
  in-source comment); PWA install/offline only works when served over `https://` or `localhost`, not
  from a local `file://` open or a chat-preview sandbox.

### Feature: German A2 Practice Studio (`German_A2_Practice_Studio.html`)
- **Status:** Complete, interactive multi-module application modeling all 7 sheets of `German_A2_Practice_Template.xlsx`.
- **Implementation location:** `German_A2_Practice_Studio.html` (~218 KB, single-file HTML/CSS/JS).
- **Related files:** `German_A2_Practice_Template.xlsx` (template source reference copied to root).
- **Important logic:**
  1. *Verben-Labor:* Complete 503-verb repository (219 A2 verbs + 284 B1 verbs) with full 6-person conjugation matrix, ending highlights, 4 tense/mood forms (Präsens, Perfekt, Präteritum, Konjunktiv II), weak/strong/mixed classification, and related noun bridge. Level filtering enables toggling between All 503, A2-Fokus, and B1-Aufbau.
  2. *Reflexiv-Spiegel:* Pronoun mirror mapping (ich→mich, du→dich, etc.) with prepositions and Perfekt.
  3. *Trennbar-Detacher:* Visual prefix detachment diagram showing main clause separation and Perfekt `-ge-` insertion.
  4. *der·das·die Vault:* Tri-color gender columns (blue/amber/red) with English cognate notes and noun rules.
  5. *Adjektiv-Endungen Kompass:* Interactive dynamic calculator for mixed, weak, and strong adjective endings with live rule explanations and sentence generator.
  6. *Imperativ-Schmiede:* 3-form command generator (du, ihr, Sie) with real context example sentences.
  7. *Kategorieller Wortschatz:* Thematic drawer for personality, emotions, time/frequency, particles, and conjunctions.
  8. *Smart-Drill Quiz:* Multi-topic rapid-fire quiz testing across all 7 dimensions pulling from the complete 503-verb pool.
- **Dependencies:** Web Speech API (`speechSynthesis`) for native German audio pronunciation.
- **Persistence:** LocalStorage key `'a2_studio_progress_v1'`.

### Feature: Präsens→Vergangenheit verb trainer
- **Status:** Complete, English UI, most recently modified file.
- **Implementation location:** `Verb_Transformation_Trainer.html`.
- **Related files:** none (fully self-contained, including its own copy of a 48-icon SVG library and
  Tamil dictionary).
- **Important logic:** weak/strong/mixed classification with a **live-updating** reference table
  (Section 8); every verb also drills its related noun (100% coverage after a fix — see Section 28);
  bidirectional recall direction.
- **Dependencies:** none beyond the browser APIs listed in Section 3.
- **Known limitations:** the 289 nouns added to reach 100% coverage are the developer's own derivations
  from German word-formation patterns, not sourced from a dictionary — flagged to the user as such.
  `localStorage` key `vt_progress_v1` is **not shared** with any other app's progress store.

### Feature: Nomen (plural) / Adjektiv (Steigerung) trainer
- **Status:** Complete, **German UI** (not yet translated to English — see Section 19/24).
- **Implementation location:** `Nomen_Adjektiv_Trainer.html`.
- **Related files:** none (self-contained).
- **Important logic:** two independent modes sharing one shell (`curMode` toggle); noun plurals are
  textbook-sourced (375/482 candidate nouns had real plural data; ~358 made it into the final app data
  after dropping ambiguous/singular-only entries); adjective comparison forms are **generated**, not
  sourced (Section 7).
- **Dependencies:** none beyond browser APIs.
- **Known limitations:** UI language inconsistency with `Verb_Transformation_Trainer.html` (Section 24);
  a handful of adjectives (e.g. categorical/binary ones like `vegan`, `verpackt`) will generate
  grammatically valid but rarely-used comparison forms — flagged to the user, not fixed, since German
  grammar does technically permit it.

### Feature: Satzbau (sentence-building) trainer
- **Status:** Complete, German UI.
- **Implementation location:** `Satzbau_Trainer.html`.
- **Related files:** none.
- **Important logic (Task 43 rewrite):** 928 role-tagged sentences in 41 topics (27 grammar A1–B2 × 24 + 14 everyday × 20
  themes with per-sentence levels), only whole pre-validated sentences are used. 8 exercise modes driven by the
  roles (build, choice, type, Verb-Detektiv, Fehler finden, Hören & Bauen, Sprechen, Umbau); wrong options are
  generated only by moving verbs (a moved verb is always wrong) — see Task 43 in Section 28.
- **Dependencies:** `js/satzbau-data.js`, app-shell (dcCallAI for the optional AI explanation), tts-engine.
- **Progress:** `sb_progress_v1` (correct count per sentence: ≥1 gemeistert, ≥3 Experte), `sb_review_v1` (missed sentences = review queue), `sb_ai_v1` (AI-made sentences, Task 44),
  `sb_day_v1`, `sb_level_v1`, `sb_mode_v1`, `sb_color_v1`, `sb_ta_v1`. No SRS intervals.

### Feature: Audio listen-and-repeat player
- **Status:** Complete, covers only the first 50 A2 verbs.
- **Implementation location:** `Verben_Hoeren_EN_DE.html`.
- **Related files:** `A2_Verben_01-50_Audio.mp3` (a *separate*, pre-recorded audio track — the HTML
  player's own `SpeechSynthesis` calls are a live TTS fallback/alternative, not the same audio),
  `A2_Verben_01-50_Begleittext.md` (human-readable transcript of the recorded track's pacing).
- **Important logic:** Wake Lock (keeps screen on during playback) and Media Session API (lock-screen
  playback controls) — both best-effort, silently no-op if unsupported.
- **Dependencies:** relies on the device having at least one German (`de-*`) TTS voice installed for its
  own live-speech mode; the bundled MP3 does not have this dependency.
- **Known limitations:** covers verbs 1–50 only; user has no equivalent audio for verbs 51+ (a
  previously-noted pending item — see Section 26).

### Feature: Konnektoren (connector word-order) reference
- **Status:** Complete, static.
- **Implementation location:** `konnektoren_referenz.html`.
- **Related files:** none.
- **Important logic:** none — pure static HTML/CSS explaining subordinating (weil/wenn/dass),
  Position-1-adverb (deshalb/trotzdem), and coordinating (sondern/aber/und/oder/denn) connector rules.
- **Dependencies:** none.
- **Known limitations:** no interactivity, no quiz — reference only.

### Feature: Excel vocabulary + grammar-drill workbooks (×4)
- **Status:** Complete, generated once, not regenerable from within this project's delivered files.
- **Implementation location:** the four `.xlsx` files themselves; no generating script is present.
- **Related files:** none delivered.
- **Important logic:** N/A (data files, not code) — sheet structure documented in Section 4.
- **Dependencies:** N/A.
- **Known limitations:** any future correction to vocabulary must be made by hand in Excel; there is no
  way to regenerate these from the HTML apps' embedded JSON or vice versa — **the three are not kept in
  sync by any mechanism.**

## 11. User Flows

**Typical study session (any trainer):** open app → adjust level/type/direction/language filter chips
→ press "Start practicing" → see prompt → think → press "Show answer" → read reveal (forms, rule
explanation, transformation diagram) → self-rate (Again/Knew it/Know it well) → next card → repeat
until session queue exhausted → "Fertig!"/"Done!" screen.

**Main app's non-drill flows:** Dashboard (progress overview) → Lernen (topic-first vocabulary study,
distinct from the standalone trainers' level-first approach) → Sprechen (speaking practice with
SpeechRecognition scoring) → Schreiben (writing practice) → Prüfung (exam-readiness check, pulls only
B1.1/B1.2 cards).

## 12. UI Architecture

- Every interactive app uses the same visual language: a chip-based filter bar at the top, a live
  dashboard (due/difficult/new/mastered counts) below it, a large "Start" button, then a study card with
  a colored top stripe encoding difficulty/type, an icon, the prompt word, a dashed "Show answer"
  button, and (after reveal) a form breakdown + transformation diagram + rule explanation + 3 rating
  buttons.
- The main app additionally has a persistent bottom nav bar (`NAV_ITEMS`) switching between its 5 views,
  and a level/category filter bar at the top shared across all views.
- **No component reuse across files** — every button, chip, and card is redefined with its own CSS
  class names and its own near-identical (but not identical) markup in each file. A visual tweak (e.g.
  changing the "Show answer" button style) must be made up to 5 times by hand.
- The main app's script is split across **10 separate `<script>` tags** interleaved with markup — this
  appears to be an artifact of how the file was built up incrementally over many sessions rather than a
  deliberate modularization (there is no `type="module"`, no IIFE boundary reasoning visible; all 10
  blocks share one global scope). Treat it as one script for editing purposes.

## 13. State Management

All state is **plain global mutable variables**, re-rendered imperatively — there is no reactive
framework, no state-management library, no event-driven store. Representative state variables:

| App | Key state variables |
|---|---|
| Main app | `ALL_CARDS`, `PROGRESS`, `META`, `currentLevel`, `currentCat`, `currentView`, `currentTopic`, `session`, `sessionIdx`, `sessionStats`, `currentQType`, `revealed`, `practiceTopic`, `recognitionObj`, `recognizing`, `readingIdx` |
| Verb_Transformation_Trainer | `VERBS`(const), `curLevel`, `curType`, `curDir`, `nounMode`, `meaningLang`, `PROGRESS`, `session`, `sessionIdx` |
| Nomen_Trainer / Adjektiv_Adverb_Trainer | `curMode` (fixed per page since the Task 22 split), `curFilt1`, `curFilt2`, `curDir`, `meaningLang`, `PROGRESS`, `session`, `sessionIdx` |
| Satzbau_Trainer | `DATA`, `ALL_TOPICS`, `PROG`, `REVIEW`, `DAY`, `curLevel`, `curTab`, `MODE`, `S` (session), `W` (current item) |
| Verben_Hoeren | `VERBS` (data), `deVoices`, `enVoices`, `currentIdx`, `isPlaying`, `isPaused`, `playAllMode`, `voicePollAttempts`, `wakeLock` |

State is mutated directly by event handlers, which then call the relevant `render*()` function(s) to
resync the DOM. There is no single "re-render everything" entry point in most apps — callers must know
which specific render functions to call after a given state change (e.g. `setLevel()` explicitly calls
`renderLevelBar(); renderCatBar(); updateHeaderStats(); renderView();` — miss one and the UI goes stale).

## 14. Storage and Persistence (rewritten — verified against actual source, not assumed)

- **`localStorage` only** — no backend, no IndexedDB, no cookies, no server-side storage anywhere.
- **9 known progress-related keys exist, in 4 incompatible shapes.** The authoritative list is
  `deutsch-coach.html`'s own "reset all data" feature (`grep -n "const keys = \['dc_progress_v1'" deutsch-coach.html`),
  which is the closest thing this app has to a canonical inventory of its own learning data:

  | Key | Shape | Owner page | Real vocabulary SRS data? |
  |---|---|---|---|
  | `dc_progress_v1` + `dc_meta_v1` | `{uid: {box, nextDue, timesSeen, timesWrong}}` via `SRSEngine.Engine`; meta = `{streak, lastStudyDate, totalReviewed}` | `deutsch-coach.html` | **Yes** |
  | `na_progress_v1` | same SRS shape, via `SRSEngine.Engine` | `Nomen_Trainer.html` + `Adjektiv_Adverb_Trainer.html` (shared key since the Task 22 split — `n\|`/`a\|` uid prefixes keep the two pages' entries from colliding, same as when they were one page) | **Yes** |
  | `vt_progress_v1` | same SRS shape, via `SRSEngine.Engine` | `Verb_Transformation_Trainer.html` | **Yes** |
  | `gp_progress_v1` | `{currentStreak, bestStreak}` — a grammar-quiz streak counter, NOT vocabulary data | `Grammatik_Regel_Trainer.html` | No |
  | `sb_progress_v1` | `{sentenceKey: count}` — a sentence-building completion counter | `Satzbau_Trainer.html` | No |
  | `a2_studio_progress_v2` | `{completed: {moduleId: true}}` — module-completion flags | `German_A2_Practice_Studio.html` | No |
  | `b1_studio_progress_v1` | same completion-flag shape | `German_B1_Practice_Studio.html` | No |
  | `wmg_progress_v1` | referenced (read) by `index.html`'s old dashboard code | **nothing ever writes it — always empty** | N/A, dead key |
  | `sps_progress_v1` | referenced only in the reset-list array | **nothing ever reads or writes it — dead key** | N/A, dead key |

- **These stores are independent and were never designed as one system.** Progress made in one
  vocabulary trainer does not carry over to another, even for the same word, because they're
  different keys with different `uid` schemes (`level|topic|word` in `dc_progress_v1`,
  `level|inf` in `vt_progress_v1`, `n|level|sg` / `a|w` in `na_progress_v1` — see each page's
  `.forEach(v => v.uid = ...)` line for the exact scheme).
- **`js/progress-aggregator.js` (added this session)** provides a safe, read-only unified view: it
  only aggregates the 3 genuine SRS stores (`dc`/`na`/`vt`) for due/difficult/mastered/reviewed
  counts — reusing `SRSEngine.Engine`, no schema changes, no writes of its own — and separately
  surfaces lesson-completion (`a2`/`b1` studio) and streak (`dc_meta_v1`) as distinct, honestly
  labeled figures. It deliberately does NOT blend `gp`/`sb` progress into the vocabulary numbers,
  since they measure fundamentally different things; doing so would misrepresent the data. See
  `js/progress-aggregator.js`'s own header comment for the full reasoning. This is loaded on every
  page that loads `js/app-shell.js` (23 of 26) and powers the shared header/sidebar stats.
  **If you add a new progress-tracking page, add its key to `VOCAB_STORES` in that file only if it
  genuinely uses the same `{uid: {box, nextDue, timesWrong}}` shape — otherwise you will produce
  fake statistics, which this codebase has a documented history of shipping (see Section 28).**
- All persistence is best-effort (`try{...}catch(e){}` around every localStorage call) — a
  quota-exceeded or privacy-mode-blocked browser silently loses progress with no user-facing error.
  This was not changed this session; still a known gap.

## 15. External APIs and Dependencies

- **Google Fonts** (`fonts.googleapis.com`) — required at load time for correct typography; no local
  font fallback bundled.
- **Browser built-ins only** otherwise: `SpeechSynthesis`, `SpeechRecognition` (main app), `Wake Lock`,
  `Media Session` (audio player). No third-party JS libraries, no CDN scripts, no analytics, no
  telemetry, no external API calls of any kind for content or logic.
- **No network dependency for vocabulary data** — by design, so the apps work offline after first load
  (aside from the Google Fonts request).

## 16. Configuration

There is no environment-variable or config-file layer. The only "configuration" artifacts are:
- `manifest.json` — PWA metadata (name, colors, icons, `start_url: "./index.html"`, `scope: "./"`).
- `sw.js`'s `APP_SHELL` array (v2) — caches the entire application suite (`index.html`, `deutsch-coach.html`, `Grammatik_Regel_Trainer.html`, `Sprech_Pruefungs_Simulator.html`, `German_A2_Practice_Studio.html`, `Verb_Transformation_Trainer.html`, `Nomen_Adjektiv_Trainer.html`, `Satzbau_Trainer.html`, `Verben_Hoeren_EN_DE.html`, `konnektoren_referenz.html`, manifest, and icons), ensuring 100% offline availability across all tools.

## 17. Testing

**There is no automated test suite in the delivered project.** All verification during development was
done ad hoc via headless `jsdom` simulation scripts run in the sandbox terminal (not saved as part of
the deliverables) — these scripts loaded each HTML file, simulated clicks through filter combinations,
and asserted on rendered `innerHTML` contents and `console` error absence. None of that harness ships
with the project; any future AI wanting the same confidence must rebuild equivalent jsdom scripts from
scratch. There is no CI configuration (no `.github/workflows`, no `Makefile`, no `package.json` test
script) anywhere in the repository.

## 18. Known Bugs (rewritten — the "none open" claim was false; real bugs found by actually testing)

**Open, discovered this session, not yet fixed:**
- **RESOLVED (Task 35):** `js/app-shell.js` now sets every theme marker (`.dark`, `.dark-theme`, `data-theme`) and follows page toggles. (Original report:) **Page-local dark-theme class never set by the real toggle.** `A1_Sprech_Pruefungs_Simulator.html`
  has its own `applyTheme()` that sets `document.body.classList.add('dark')`, and (not independently
  re-verified, but built from the same template) `Sprech_Pruefungs_Simulator.html` likely has the same
  pattern. `css/design-system.css` never reads a `.dark` class — the real, shared theme button
  (injected by `js/app-shell.js`) sets `data-theme="dark"` on `<body>` instead. Net effect: the real
  theme toggle correctly darkens the shared shell/body, but every one of these pages' own
  custom-styled elements stays light-themed. The identical bug was found and fixed in the new
  `Thema_Sprech_Trainer.html` this session (see Section 28's 2026-09-22 changelog entry) by making the
  page's own dark-mode CSS respond to `body[data-theme="dark"]` and deleting the now-redundant
  page-local theme-init code — the same fix (add `body[data-theme="dark"]` to whatever selector gates
  each page's dark CSS variables, then delete the dead local toggle/init functions) would apply to
  these two files but was not done, since they weren't otherwise touched this session.
- **RESOLVED (Task 38):** 186 unused old-menu rules (`hub-*` / `suite-*`) removed from 16 pages, verified by before/after screenshots. (Original report:) `js/app-shell.js` orphaned CSS: ~13 pages still carry unused `.suite-hub`/`.hub-links`/`.hub-banner`
  CSS rules in their `<style>` blocks even though the actual HTML elements were already removed by an
  earlier pass. Cosmetic dead weight, not a functional bug — deliberately left alone this session to
  avoid the regression risk of touching 13 files' CSS without visually verifying each one.
- **RESOLVED (Task 22 split, see Section 28):** the former `Nomen_Adjektiv_Trainer.html`'s `ADJS` array
  had ~99 of 345 entries (~29%) that either weren't real adjectives (verbs/nouns like "entschuldigen"
  got mixed in) or were missing the `komp` field the comparative/superlative practice mode needs. When
  the page was split into `Nomen_Trainer.html` + `Adjektiv_Adverb_Trainer.html`, these 99 malformed
  entries were dropped rather than carried forward — `Adjektiv_Adverb_Trainer.html`'s `ADJS` now has
  exactly the 246 genuine, complete adjective entries. `diffHighlight()` was separately hardened against
  malformed input during an earlier merge-conflict resolution (see that changelog entry below), which
  remains true defensively but is no longer load-bearing for this specific data now that the source data
  is clean.
- Streak (`dc_meta_v1`) only advances when studying through `deutsch-coach.html` — no other trainer
  bumps it, even though `js/progress-aggregator.js` now surfaces it app-wide. A learner who only uses
  e.g. `Verb_Transformation_Trainer.html` will see a streak stuck at 0 despite real daily practice.
  Not fixed this session — changing what bumps the streak is a real behavior change to existing users'
  data and needs a deliberate decision, not a silent patch.
- The mobile hamburger menu button (`#menuBtn`) never worked on any page, on any viewport, because its
  click handler looked up the sidebar via the wrong id (`app-sidebar`, actually its CSS class — the
  real id is `sidebar`). **Fixed this session** (see changelog) — listed here so future agents know
  this class of bug (wrong id used in `getElementById`) has precedent in this codebase and is worth
  double-checking elsewhere.
- `Sprech_Pruefungs_Simulator.html`'s exam timer bar calls `setExamTimer()`/`toggleTimer()`/
  `resetTimer()`, but none of those functions are defined anywhere in the file or in `js/app-shell.js`
  — the timer buttons have silently done nothing since whenever that markup was added. **Not fixed**
  (out of scope for the session that found it — see Section 28's A1 changelog entry). The new
  `A1_Sprech_Pruefungs_Simulator.html` has its own working timer implementation and is not affected;
  only the original B1 file has this bug.
- `js/icon-svgs.js`'s `getIcon()` has always had a `|| ICON_SVGS['abstract']` fallback, but no
  `'abstract'` key was ever defined in `ICON_SVGS` — every vocabulary entry tagged `icon:"abstract"`
  (several hundred, across every level, in both `VERBS` and `NOUNS`) silently rendered `undefined`
  instead of an icon. **Fixed this session** (see Section 28's B2 changelog entry) — a real `'abstract'`
  SVG was added.
- `Grammatik_Regel_Trainer.html`'s `checkAnswer()` (the gap-fill/multiple-choice drill handler)
  referenced a variable `buildOrder` that only exists in the separate sentence-builder drill mode —
  answering a gap-fill question INCORRECTLY threw an uncaught `ReferenceError` mid-render, silently
  breaking the whole feedback box (no explain button, no next-question button appeared). Getting a
  gap-fill question right worked fine; only the wrong-answer path was broken, which is presumably why
  this went unnoticed. **Fixed this session** (see Section 28's practice-depth changelog entry).
- `Grammatik_Regel_Trainer.html`'s `explainWrongAnswerAI()` (the "🤖 KI-Erklärung" wrong-answer AI
  explainer) referenced a variable `currentRule` that is never declared anywhere in the file — clicking
  that button always threw before the AI call was even made, so this advertised feature never actually
  worked. **Fixed this session** — now looks up the rule from the current question's `ruleId` instead.
- `Verb_Transformation_Trainer.html` and `Nomen_Adjektiv_Trainer.html` each have their own
  `document.addEventListener('keydown', ...)` for N/T/L/1/2/3/S, but never called
  `e.stopPropagation()`, so the event also reached `js/app-shell.js`'s separate window-level keydown
  handler (loaded on every page). That handler treats N the same as Enter: click a
  `.actbtn.check`/`.actbtn.next` button if one exists, else fall back to clicking `#startReviewBtn`
  — which navigates to `deutsch-coach.html`. Both files use a `next-bold` class instead of `next` for
  their Next button, so the selector never matched and **every single N press silently navigated away**
  from the trainer, discarding whatever the page's own handler had just done. User-reported ("pressing
  N moved different pages instead of advancing"); root-caused with a live headless-browser repro rather
  than guessed. **Fixed this session** — `e.stopPropagation()` added alongside every `e.preventDefault()`
  in both files' handlers. `Grammatik_Regel_Trainer.html`/`Satzbau_Trainer.html`/`deutsch-coach.html`
  were unaffected (no local keydown handler of their own, or their buttons already use the exact
  `.actbtn.check`/`.actbtn.next` classes app-shell.js looks for) — not touched.

**Bugs found and fixed during earlier development** (kept for historical awareness):
- Satzbau_Trainer: an early version independently rolled each sentence slot rather than picking whole
  pre-verified sentences, which could produce ungrammatical output (e.g. `*"Du kaufe"`); fixed before
  shipping by switching to whole-variant selection (Section 25).
- Verb comparison/plural data: several specific generation-rule bugs were caught and fixed during
  development of `Nomen_Adjektiv_Trainer.html`'s adjective engine — `alt→älter` (umlaut list was
  initially incomplete), `komfortabel→komfortabler` (missing -el-ending contraction), `sauer→saurer`
  (missing vowel-adjacent -er contraction). All three are now fixed in the shipped `ADJS` data.

## 19. Technical Debt

- **UI language inconsistency:** `Verb_Transformation_Trainer.html` has a fully English UI;
  `Nomen_Adjektiv_Trainer.html`, `Satzbau_Trainer.html`, `Verben_Hoeren_EN_DE.html`,
  `konnektoren_referenz.html`, and the main app all still have German UI chrome. The user explicitly
  asked for an English UI (since they are learning English→German) and was offered — but had not yet
  confirmed — the same translation pass for the other apps as of the last recorded exchange in this
  project's history.
- **No shared code.** The icon SVG library, the Tamil-translation dictionary, the diff-highlighting
  algorithm, and the entire spaced-repetition engine exist as separately-maintained, independently-
  drifted copies across up to 3 files each. A bug fix or improvement made in one is **not** propagated
  to the others automatically — see Section 25 for the concrete risk.
- **Duplicate main-app file** (`index.html` == `deutsch-coach.html`) must be kept in sync by hand.
- **Excel workbooks are a dead-end fork** of the same vocabulary data — no mechanism keeps them
  consistent with the HTML apps' embedded JSON.
- **No git remote** — there is no real version control safety net for this project; the *only* record
  of prior decisions is this file plus the chat history that produced it.

## 20. Performance Considerations

Every card render fully rebuilds `innerHTML` for its container rather than patching the DOM — with
data sets in the hundreds (max ~503 verbs), this is not a measured performance problem, but the pattern
would not scale to a much larger dataset without noticeable jank. The main app's 2915-line single file
and the two ~500-word trainers' large embedded JSON literals (verb/noun/adjective arrays each several
hundred KB of inline JSON) mean **initial parse time and file size are non-trivial** — no lazy-loading
or code-splitting exists anywhere (impossible without a build step, given the single-file-only
architecture). No explicit performance profiling was recorded for any of these apps.

## 21. Security Considerations

Low surface area: no user accounts, no server, no external data submission, no `eval()` usage observed
in this pass, no `innerHTML`-injection risk from *untrusted* input. All rendered HTML strings are
built from the app's own trusted embedded data, not from arbitrary user text. The one place users type
free text, the Schreiben/writing view's `#writeArea`, was inspected in `index.html` lines 2699-2703:
input text is only used to calculate word and character counts, set via `.textContent` into `#wordCount`,
and is never injected into `innerHTML` or rendered back to the DOM as HTML — confirmed XSS safe.
`localStorage` contents are per-origin and not shared or transmitted anywhere. No secrets, API keys, or
credentials of any kind exist in any file.

## 22. Accessibility

Not systematically evaluated in this pass. Observed relevant facts: color is not the sole differentiator
for verb-type/noun-type/etc. (a text label like "Weak"/"Strong"/"Mixed" or "-en/-n" always accompanies
the colored dot/stripe), which helps colorblind users. No `aria-*` attributes, no explicit focus
management, and no keyboard-navigation testing were observed in the source — **treat accessibility as
unverified and likely incomplete** until a dedicated pass is done.

## 23. Browser Compatibility

Relies on modern browser APIs (`SpeechSynthesis`, `SpeechRecognition`, `Wake Lock`, `Media Session`,
CSS custom properties, template literals, arrow functions, `Array.prototype` methods like `.flatMap`
where used) — no transpilation or polyfilling exists, so this targets **current evergreen browsers
only** (recent Chrome/Edge/Safari/Firefox). `SpeechRecognition` in particular has historically had
uneven cross-browser support (best on Chrome-family browsers) — the main app's Sprechen view should be
assumed Chrome-first until verified otherwise. All speech-related features degrade gracefully (feature-
detected with `'speechSynthesis' in window` etc.) rather than throwing when unsupported.

## 24. Important Design Decisions

- **Single-file-per-app, zero build tooling:** a deliberate choice favoring instant portability (email
  one HTML file, open it anywhere) over maintainability. This is the root cause of most items in
  Section 19.
- **Own-data-takes-priority merge rule:** wherever the user's own hand-verified vocabulary list
  (`"eigene Liste"` / `"your own list"`) overlaps with a textbook-derived source, the user's own data
  wins. This rule is stated explicitly in the main app's footer text and in
  `Verb_Transformation_Trainer.html`'s footer.
- **Never invent unsourced curriculum:** an explicit in-source comment states A1 has "no real source
  vocabulary beyond one example word" rather than the developer fabricating A1 content to fill a gap —
  this is a stated content-integrity principle for the project, not an oversight.
- **Bidirectional recall as a deliberate pedagogical upgrade** (Section 9) — added specifically because
  recognition (see German, produce transformation) is an easier and less diagnostic test than production
  (see meaning only, produce German from scratch).
- **Live-syncing the static reference table to the current card** (`updateLiveRuleRef`, Section 8) was
  a deliberate response to user feedback that a purely static grammar-family table felt disconnected
  from what was actually being studied.

## 25. Regression-Sensitive Areas

- **The `buildQueue`/`buildSmartQueue` priority ordering.** Any refactor of this function must preserve
  the overdue > difficult > recently-weak > new > mastered ordering, or the "smart" learning promise
  silently degrades to "random."
- **The 3 independently-copied spaced-repetition engines** (main app, Verb trainer, Nomen/Adjektiv
  trainer) — a fix made to one (e.g. a Leitner-schedule tweak) will not automatically apply to the
  others. Any AI asked to "fix the spaced repetition" must clarify or check **which app(s)** are in
  scope, and apply the fix to each independently if the answer is "all of them."
  intended.
- **Satzbau's whole-variant-only sentence selection.** Do not reintroduce independent per-slot
  randomization (see Section 18's historical bug) — always select and scramble one complete
  pre-verified `variant`, never assemble a new sentence from independently-chosen words.
- **The `diffHighlight` common-prefix/suffix algorithm.** It is a naive string algorithm with no
  linguistic model; if asked to "improve" it, verify against separable-prefix verbs (`aufstehen` →
  `stand auf`) and umlaut-only plurals (`Vogel` → `Vögel`), which are the cases most likely to break a
  naive rewrite.
- **The `ICON_SVGS` dictionaries and Tamil dictionaries.** These are separately maintained per app.
  Adding a new vocabulary item to one app's data array without also adding a matching icon/Tamil entry
  will silently fall back to the generic `"abstract"` icon and/or blank Tamil field — this is expected,
  graceful degradation, not a bug, but worth knowing before assuming "coverage" numbers are commitments
  rather than best-effort snapshots.

## 26. Future Work (rewritten — prioritized backlog for the "premium platform" transformation)

The product brief this session worked from asked for a full transformation of 26 disconnected pages
into one coherent Home/Learn/Vocabulary/Grammar/Practice/Progress product. This session completed
stabilization, progress unification, and repo cleanup (see the Section 28 changelog entry) but not
the larger IA/content-unification work. In priority order for whoever picks this up next:

**P0 (do first — small, no design decisions required):**
- Clean the ~13 pages' orphaned `.suite-hub`/`.hub-links`/`.hub-banner` CSS rules (dead, unused, but
  touching 13 files' `<style>` blocks needs visual verification per page — deliberately skipped this
  session, see Section 18).
- ~~Decide what to do about the `ADJS` data contamination (~30% non-adjective/incomplete entries) in
  `Nomen_Adjektiv_Trainer.html`~~ — **done, Task 22:** the 99 malformed entries were dropped when the
  page was split into `Nomen_Trainer.html` + `Adjektiv_Adverb_Trainer.html`.

**P1 (the actual product transformation — each is a real multi-page rebuild, not a small patch):**
- Rebuild the primary navigation around Home/Learn/Vocabulary/Grammar/Practice/Progress instead of the
  current flat "Navigation" list in `js/app-shell.js`'s sidebar (Home/Lernen/Prüfung/AI Coach/Tools).
  `deutsch-coach.html` already has a genuinely reasonable dashboard + session UI (level breakdown,
  Smart Learn CTA, multiple-choice cards) — the strongest starting point for "Home"/"Learn" rather than
  building from scratch.
- Unify the vocabulary experience: one entry point over `Verb_Transformation_Trainer.html` +
  `Nomen_Trainer.html` + `Adjektiv_Adverb_Trainer.html` + `Wortschatz_Master_Grid.html`'s separate
  due/new/mastered/search UIs,
  in learner-friendly language (no "SRS boxes," no localStorage key names visible).
- Consolidate grammar: `Grammatik_Regel_Trainer.html`, `Satzbau_Trainer.html`,
  `konnektoren_referenz.html`, `German_Grammar_Cheat_Codes.html` into one coherent flow instead of 4
  separate link destinations.
- Consolidate practice: `Sprech_Pruefungs_Simulator.html`, `Hoerverstehen_Diktat_Trainer.html`,
  `Brief_Schreiben_Trainer.html`, `Dialog_Schatten_Trainer.html`, the audio players, and the AI coach
  pages into one Practice section (speaking/listening/writing/dialogues/exam-prep/AI-assisted), with
  AI positioned as part of practice rather than a standalone "AI Coach" nav item.
- DONE (Task 38): word lists consolidated into `js/word-data.js`; `data/*.json` + `sync_data.py` archived. (Old note:) Finish (or abandon and remove) the `data/*.json` + `scripts/sync_data.py` consolidation — it's
  currently a stale, disconnected snapshot (see Section 2) that risks misleading whoever finds it next
  if left as-is.
- Build a B2 practice/exam-prep studio on top of the B2 vocabulary + grammar added in Section 28's
  latest changelog entry (mirroring `German_B1_Practice_Studio.html`'s 7-module shape, or a B2 oral
  exam simulator mirroring `Sprech_Pruefungs_Simulator.html`/`A1_Sprech_Pruefungs_Simulator.html`) —
  deliberately not attempted in that session since the explicit scope was "content foundation first."
**P1.5 (done — kept here only as a pointer to the changelog, per the "don't delete history" convention):**
The difficulty-tiered offline practice + AI weak-spot follow-up pattern (see Section 28's changelog
entries, starting with `Grammatik_Regel_Trainer.html`) was extended to every page with a genuine
right/wrong mechanic: both vocabulary trainers, `Satzbau_Trainer.html`, the A2/B1 Practice Studios'
drill chapters, `Hoerverstehen_Diktat_Trainer.html`, `konnektoren_referenz.html`'s Drill tab, and the
graded sub-sections of both exam simulators. `Brief_Schreiben_Trainer.html`, `Dialog_Schatten_Trainer.html`,
`Wortschatz_Master_Grid.html`, and `Wortfamilien_Explorer.html` were deliberately excluded (checked, not
skipped — none has a right/wrong mechanic to tier). If future work wants quizzes on those pages, that's
a new feature to design, not an extension of this pattern.

**P2 (polish, after P1 exists to polish):**
- Full accessibility pass across the 21 individual trainer pages (only the shared shell got one this
  session).
- Full responsive verification at mobile/tablet/laptop/large-desktop for every page, not just the
  shared shell (which was verified at 375px this session).
- UI language consistency — still split arbitrarily by page (English-only in
  `Verb_Transformation_Trainer.html`, German-only elsewhere).

**P3 (only after the above; do not start here):**
- Streak should arguably advance from any trainer, not only `deutsch-coach.html` — a real behavior
  change to think through carefully (see Section 18), not a quick patch.
- Audio coverage for verbs 51+ (only verbs 1–50 have a recorded MP3 companion) — unchanged from the
  previous version of this document.
- Reconciling the `.xlsx` workbooks with the HTML apps' embedded vocabulary data — no mechanism exists;
  would need to be built from scratch if ever wanted.

## 27. AI Development Rules

1. **Read this file (`PROJECT_KNOWLEDGE.md`) in full before touching any source file.**
2. **Read the specific source file(s) you intend to change** — do not rely on this document's summaries
   for anything you are about to edit; summaries can go stale, the source cannot.
3. **Check Section 28 (AI Change History)** for prior work in the area you're about to touch.
4. **Make only the changes requested or clearly justified** — do not "clean up" unrelated code, do not
   silently fix unrelated bugs you notice (mention them instead, e.g. under a new Section 18 entry or to
   the user directly).
5. **After any change, update this file**: Section 28 (new change-history entry), Section 29 if you
   learned something non-obvious, and any other section whose facts your change invalidated (Sections
   2, 10, 18, 19, 25 are the most commonly affected).
6. **Never assume this file is complete or current** — its author (each AI in turn) may have missed
   things. Prefer verifying against source over trusting a summary when the two could plausibly diverge.
7. **Do not invent facts.** If you cannot verify something from source in the time available, write
   "UNKNOWN — requires verification" rather than a plausible-sounding guess — this document already
   contains several such flags; add more rather than silently guessing.

## 28. AI Change History

### 2026-09-26 (Task 68) — Satzbau: complete level test (A1 / A2 / B1, all topics together)
Request: "complete test of grammar for sentence making … not only one topic, complete A1 together".
- Satzbau-Trainer home: **📝 Level-Test** panel with A1-, A2-, B1-Test and a format choice (🧩 Bauen · ✍️ Schreiben
  like the exam · 🎲 Gemischt = all exercise types), stored in `sb_test_fmt`.
- A test = about 30 sentences of exactly that level from **every** grammar topic of the level (2–3 each: A1 7×3,
  A2 9×2, B1 11×2) plus 1 sentence from randomly chosen everyday topics, shuffled; no topic name shown during the
  test and no re-queuing (the first answer counts). Wrong sentences still go to "Fehler wiederholen" and Meine Fehler.
- Result: % with pass line 60 %, previous results, table per topic (📘 grammar / 💬 everyday, x / n, coloured bar,
  "Üben" opens the topic), "Das solltest du als Nächstes üben" (grammar gaps first). History `sb_tests_v1`
  (last result shown on each level button).

### 2026-09-26 (Task 67) — Animated pictures everywhere + "Grammatik in Bildern" (learn concepts by picture)
Request: "all the images need to be animated and also implement image to learn concept".
- **Animation layer** (css/design-system.css `.dc-anim[data-anim=…]` + js/app-shell.js `dcAnimatePics`): every word
  picture / icon (.wpic, .wz-pic, .wordicon, .verb-icon, .module-icon, [data-pic]) pops in and then moves by meaning —
  move (🏃🚗), fly (🐦✈️), spin (🌀☀️), pulse (❤️⭐ colours), shake (😂⏰), flicker (🔥), bounce (⚽🎉), fall (💧🌧️),
  breathe (😴🛋️), wave (🌊🌳), else float; wiggle on hover/tap. MutationObserver decorates new pictures. Off with OS
  "reduce motion" or `localStorage dc_anim = 'off'` (switch on Bild_Grammatik.html; `dcSetAnim()` / `dcAnimOn()`).
  Grammatik-Regel-Trainer: the preposition balls fly to their place (SMIL loop), Wohin arrow runs and a dot travels
  into the room, Wo dot bobs inside.
- **`Bild_Grammatik.html`** + **`js/bild-grammatik.js`** (menu: Grammatik & Satzbau): 13 animated concepts —
  word blocks that slide to their new position between frames (Verb Position 2, Fragen, trennbare Verben (auf flies out
  of aufstehen), Modalverb, Perfekt, weil / Nebensatz zuerst), picture scenes (9 Wechselpräpositionen with Wohin =
  moving + arrow → Akk / Wo = resting → Dat, geben: wem? Dativ / was? Akkusativ, sich waschen: das Auto / mich / mir die
  Hände, nicht vs kein, gestern · heute · morgen timeline, clock with turning hands incl. "halb acht = 7:30",
  groß · größer · am größten). Each: rule de/en/ta 🤖, frames with sentence + English + one-line rule, ▶ play / step /
  replay / 🔊. **Bild-Quiz**: 10 pictures → choose the German sentence (case traps, halb-trap, tense, reflexive,
  kein/nicht); wrong ones go to Meine Fehler (source 🎬 Bild-Quiz).
- Grammatik-Regel-Trainer: "🎬 Diese Regel als bewegtes Bild ansehen" on 13 rules; deep link `#rule=<id>`.
- `scripts/check_bild_grammatik.py` (build step 18): rules incl. Tamil, frames, chip roles / "from" ids, Wohin =
  accusative and Wo = dative article, 300 generated quiz items valid.

### 2026-09-26 (Task 66) — Interface language German ⇄ English
Request: "all label to english <-> option".
- **`js/ui-i18n.js`** (loaded by app-shell on every page) + **🌐 DE / 🌐 EN** button in the header (app-shell and
  index). Choice in `localStorage dc_ui_lang`. Switching is instant and reversible (original text kept per node in a
  WeakMap, attributes in `data-i18n-*`).
- Only interface labels are translated: text in buttons, links, tabs, chips, headings, menu, hints, plus placeholder /
  title / aria-label — and only by an EXACT match of the whole label (`DICT`, ~330 labels: menu + home + all
  DC_SITEMAP titles/descriptions, common buttons, Text-Trainer, Meine Fehler, Mein Fortschritt, categories) or a
  pattern (`PATTERNS`: "X anhören", frequency-rank tooltips, "Satz 3 / 15", counts). A leading emoji and a trailing
  "(123)" are kept around a known label. Quiz options / word tiles (`.opt`, `button.tile`, `[data-opt]`, `[data-w]`…),
  textareas, Tamil and `[data-no-i18n]` are skipped, so German learning content never changes.
- After the first switch a MutationObserver translates only added/changed nodes (fast on big pages). Labels not in the
  dictionary stay German; add them to DICT when seen. (Bug found in testing: every page is `<html lang="de">`, so a
  `[lang="de"]` skip rule skipped everything — removed.)

### 2026-09-26 (Task 65) — Mein Fortschritt: practice time per skill and day
- **Time tracking** (js/app-shell.js `dcTrackTime`): every 15 s a practice page is visible and was used in the last
  60 s adds 15 s to `localStorage dc_activity[YYYY-MM-DD][skill]` (skill = menu group; flashcards → woerter, notebook →
  fehler; 120 days kept). Counting starts now — no back-filled numbers.
- **`Mein_Fortschritt.html`** (menu: Start): 4 stat tiles (minutes in 7 days vs previous week, days practised,
  mistakes learnt, words mastered), advice (least-practised skill with a link, due notebook items), stacked bar chart
  of minutes per day per skill (7 days / 4 weeks; HTML/CSS bars with 2 px gaps and 4 px rounded tops, recessive
  gridlines, legend with totals, hover/focus tooltip, table view), per-skill bars and results (Text-Trainer exam
  history, Zeitreise accuracy, notebook, flashcards). 7 categorical colours validated with the dataviz validator in
  light (#ffffff) and dark (#1e293b) — contrast warning covered by legend + table view.

### 2026-09-26 (Task 64) — Overlapping pages merged into one entry with a view switch
- DC_SITEMAP entries can have `views: [[href, label], …]`: **Wortschatz: Raster & Tabelle** (Wortschatz_Master_Grid |
  Deutsch_Wortschatz_Excel_Sheet) and **Sprechprüfung simulieren (A1 · B1)** (A1_Sprech_Pruefungs_Simulator |
  Sprech_Pruefungs_Simulator). One menu/home card each; app-shell puts a segmented switch at the top of both pages
  (`.dc-views`), the menu entry stays highlighted on either view, "Zuletzt geübt" and "Mehr in …" understand views.
  The pages themselves are unchanged (no code risk, saved progress kept). `check_sitemap.py` validates views.

### 2026-09-26 (Task 63) — Meine Fehler: one mistake notebook for all practice pages
- **`js/mistakes.js`** (`window.DCMistakes`): `add()` is called on every wrong answer in Text-Trainer (sentence,
  exam, ⚡ quiz, Sätze verbinden), Satzbau (build/type modes), Grammatik-Regel-Trainer (multiple choice + sentence
  building), Zeitreise and Wort-Zwillinge. Item = question (English sentence / gap sentence), answer + alternatives,
  options for multiple choice, the learner's wrong answer, the rule/explanation, source page. Same question again →
  back to box 0. Spaced review: box 0 → 1 → 2 → 3 → 4 → learnt after 0 / 1 / 3 / 7 / 14 days; wrong in review →
  box 0. `localStorage dc_mistakes` (max 500, learnt ones dropped first).
- **`Meine_Fehler.html`** (menu: Start → Meine Fehler): due / open / learnt counters, filter by source, review session
  (type the German sentence — umlaut/case-tolerant check with a note — or pick the option), shows rule + "damals
  hattest du …", list view with delete and "Gelernte entfernen". Home daily plan step 2 = due notebook items.

### 2026-09-26 (Task 62) — Adjective data: correct Steigerung, "nicht steigerbar", 123 missing core adjectives
Request: "yes fix all open" (the Komparativ/Superlativ check from the user's class table).
- **Forms**: every ADJS entry checked against the German rules (`scripts/check_adjectives.py`, build step 17):
  65 wrong forms corrected (mostly present participles and unstressed -isch: *am spannendesten → am spannendsten*,
  *am romantischesten → am romantischsten*); typ labels fixed (lang/kurz irregular → umlaut, stolz umlaut → regular,
  groß → irregular because of *am größten*).
- **Not comparable**: 197 adjectives get `typ: "none"` and empty komp/sup (tot, schwanger, verheiratet, kostenlos,
  täglich-type words, nationalities, colours like rosa/lila, past participles such as *annektiert*, adverbs such as
  *bedauerlicherweise*) — they had invented forms like *am annulliertesten*. Adjektiv- and Nomen-Trainer: new filter
  "Nicht steigerbar", rule box, "— nicht steigerbar" in the form rows, quiz accepts the word itself, and the old
  "(kleiner, am am kleinsten)" double-"am" label is fixed. Übersetzer shows "Steigerung: nicht steigerbar".
- Cleaned entries: "stinksauer (ugs.)" → stinksauer, "bio (=biologisch)" → bio, "(voll)autonom" → autonom,
  "defekt = kaputt" → defekt, "letzter/letzte/letztes" → letzte; duplicate "ernsthaft = ernst" removed.
- **123 missing core adjectives added** (breit, eng, laut, leise, müde, nett, freundlich, einfach, schwierig,
  interessant, all colours, verheiratet/ledig/geschieden, pünktlich, kaputt, …) with English, Tamil 🤖, example
  sentences 🤖 and 66 pictures; home deck (SYNCED_WORDS) synced, lexicon / word parts / frequency ranks regenerated
  (+20 root meanings). `fill_home_forms.py` now also corrects home-card comparison forms to the checked master.

### 2026-09-26 (Task 61) — Organise the pages: one site map, grouped menu, home = daily plan
Request: "Lots of pages are scattered — find and organise them, and check what learning/practice enhancements are needed."
- **`DC_SITEMAP`** (top of `js/app-shell.js`): every page once, in 8 groups by skill — Start · Wörter · Grammatik &
  Satzbau · Schreiben & Übersetzen · Hören & Lesen · Sprechen · Prüfung · Einstellungen — with icon, title, one-line
  description, level and `ai` flag. Redirect stubs (Verben_Hoeren_EN_DE, Wortfamilien_Explorer) are left out.
  `scripts/check_sitemap.py` (build step 16) fails when a page is missing, listed twice or points to no file.
- **Sidebar menu** (`dcNavHTML()`, all pages incl. index): search box + collapsible groups; the current page's group is
  open and the page highlighted. Replaces the flat list of 10 hand-picked links (3 pages were not linked anywhere).
- **"Mehr in <Bereich>"** footer on every wrapped page: the sibling pages of the same group + link to all areas.
- **Home** (`index.html`): "Heute" = a daily plan from real data (due cards or first words → stored mistakes from
  Text-Trainer / grammar vault / Wort-Zwillinge → one rotating grammar step → one speaking/listening/writing step),
  "Zuletzt geübt" (`dc_recent`, written by app-shell on each page visit), a 6-step beginner path, then one card section
  per group (level badge, "🤖 KI — Schlüssel nötig" instead of hiding AI pages). Old anchors #lernen/#coach/#tools kept.
- **Mobile header**: the 4 counters are one compact row (header 221 px → 102 px on a 390 px phone).

### 2026-09-26 (Task 60) — Text-Trainer: no automatic speech unless switched on
Request: "Why does clicking Prüfen speak the sentence, and why do the word tiles speak?"
- Cause: Satz für Satz, Blitz-Quiz and Sätze verbinden read the model sentence right after checking; on Android the
  voice starts 1–2 s late, so it sounded while the learner was already tapping word tiles.
- Fix: auto-read is opt-in (`dc_tt_autosay`, default off; switch "🔇/🔊 Nach „Prüfen“ vorlesen" under the tabs).
  🔊 buttons still always play. A capture-phase click listener cancels speech still playing when a tile, check, next
  or quiz option is tapped (runs before the button's own handler, so a new read-out is not cut off).

### 2026-09-26 (Task 59) — Text-Trainer exam: English text on top, answer boxes numbered only
Request: "Big sentence is fine, only the answer split into multiple sentences."
- Per-sentence mode no longer repeats the English sentence above each box: the English paragraph (numbered with `<sup>`)
  is a sticky panel (`.para.stick`, top = app-header height, max 30vh / 22vh on phones, scrolls itself to the current
  sentence); boxes show only the number. `scrollToStep()` + `scroll-margin-top` keep the active box just below the panel.

### 2026-09-26 (Task 58) — Text-Trainer exam: Leicht / Mittel / Schwer
Request: "Option for easy, medium and harder. Easy: word pick and suggestions."
- Per-sentence exam has 3 levels (`dc_tt_level`, default easy):
  **🟢 Leicht** = grammar tip shown up front + word tiles (model words + up to 3 trap words from `TRAPS`, e.g. dem↔den,
  mir↔mich, weil↔denn, ob↔wenn, habe↔bin) tapped into a read-only box, ⌫ last word / 🗑 clear.
  **🟡 Mittel** = type yourself with a first-letter pattern (`W___ m____ F______ …`, shows word count + length) and a
  "💡 Regel zeigen" button. **🔴 Schwer** = no help.
- Score history stores `lvl`; "vorher" compares only runs at the same level; ≥ 90 % offers the next level.
- Answer boxes auto-grow (`fit()`).

### 2026-09-26 (Task 57) — Text-Trainer exam: one box per sentence + "what went wrong" explanations
Request: "Instead of one box have multiple boxes to type one sentence, then check correct or if not explain what missed."
- Exam tab has two modes (`dc_tt_exam_mode`): **🧩 one box per sentence** (default) and 📄 one big box (old behaviour).
  Per-sentence mode: English paragraph on top (current sentence highlighted, click a sentence → jump to its box; turns
  green/orange after checking), one textarea per sentence, Enter = check. Wrong → diff + explanation + rule (`focus`);
  perfect → focus moves to the next box. First attempt counts; when all are checked the score goes to `dc_tt_exams`.
- `explain(r)` (used by every diff on the page): lists words in the wrong place (same word missing + extra), wrong
  forms/endings (article↔article, pronoun↔pronoun or same 4-letter stem, e.g. „den“ → „dem“, „mich“ → „mir“,
  „meine“ → „meinen“), missing words, extra words and capitalisation/umlaut notes.

### 2026-09-26 (Task 56) — Text-Trainer: translate an English paragraph for the test
Request: "Tomorrow I have a test: translate a text like this into German. How can I practise?" + "I have only one day: connectors,
A1 sentence concepts, Akk and Dativ".
- **`Text_Trainer.html`** (sidebar + home Tools) + **`js/text-drills.js`**: `DC_TEXT_DRILLS` = 4 texts / 48 sentences
  (the learner's family test text + Freunde, Wohnung, Alltag), each sentence `{en, de, alts, skel, focus, ta}`.
  Tabs: ⚡ Crashkurs · 📖 read & listen (EN/DE/TA side by side) · 🧩 sentence by sentence (hints: skeleton → word tiles →
  solution; wrong ones stored in `dc_tt_wrong`, "only the wrong ones again") · 🫥 vanishing text (0/25/50/75/100 % of words
  hidden, tap to peek) · ⏱️ exam simulation (timer, whole text, sentences aligned greedily and diffed; history `dc_tt_exams`)
  · ➕ own text (teacher's English text → AI model translation 🤖, stored in `dc_tt_own`, needs an AI key).
- Answer check `compare()`: LCS over umlaut-folded tokens against the model and every alt; best = highest score, then fewest
  capitalisation/umlaut notes (so "… Deshalb …" after a full stop matches the alt, not the "…, deshalb" model).
- **⚡ Crashkurs** (`DC_CRASH`): cheat sheet (connectors by verb position 0 / 1 / end, V2, Satzklammer, questions, kein/nicht,
  TeKaMoLo, Akk/Dat article + pronoun tables, prepositions, Dativ verbs, Wechselpräpositionen), Blitz-Quiz (55 items in
  kon/satz/kasus, 15 per round, area filter, retry wrong) and "Sätze verbinden" (16 join-two-sentences items, typed, diffed).
- `scripts/check_text_drills.py` (build step 15). Browser-tested at 1100/390 px: every model + alt scores perfect, exam with the
  model text = 100 %, no horizontal scroll, no JS errors.

### 2026-09-26 (Task 55) — trotzdem vs. obwohl (nevertheless)

User: "Do we have Nevertheless with connector". trotzdem was covered (Konnektoren page, rule 1 drills, 4 Satzbau
sentences, Cheat Codes); dennoch only once, nichtsdestotrotz never, and no direct obwohl ↔ trotzdem comparison.
Added Satzbau topic **`trotzdemobwohl`** (A2, 12 sentences: each idea with obwohl / trotzdem / trotz + Genitiv, plus
dennoch, nichtsdestotrotz, "aber … trotzdem" in the middle field, obwohl-clause at the end) with rule, Tamil rule
(-ஆலும் = obwohl → verb at the end; இருந்தாலும் = trotzdem → verb right after) and typical mistakes; Wort-Zwillinge
group "obwohl / trotzdem / trotz" (40 groups, 97 words).

---

### 2026-09-26 (Task 54) — Zeitreise-Trainer (past · present · future), 22 missing core verbs, Satzbau "Nebensatz zuerst + zu-Infinitiv"

#### Task
User: "Need one type of practice which contains past, present, future. Eg i went to Chennai, i am in Chennai and i
will go Chennai next week. Also I had, have etc" + class sentence "Weil meine Familie für mich sehr wichtig ist,
versuche ich jeden Tag mit ihnen zu sprechen" ("Do you have this kind of question also?").

#### Done
- **`Zeitreise_Trainer.html`** (sidebar + home Tools) + **`js/tense-scenarios.js`**: 32 situations, each as three
  sentences that start with their time word (Gestern / Jetzt / Nächste Woche → verb in position 2), English + Tamil,
  past = Perfekt (or Präteritum for sein/haben/modals), a typical mistake with explanation, `same` flag → "Morgen fahre
  ich …" (Präsens + future time word) also accepted. Tabs: 🕰️ Zeitstrahl (timeline cards, verb parts in red, 🔊, Tamil
  bridge: போனேன் / போகிறேன் / போவேன் vs bin gefahren / fahre / werde fahren) · 🎯 Sätze üben (Welche Zeit? · choose the
  right sentence incl. the typical mistake · build from word tiles · transform by typing, with first-difference hint;
  score in `dc_zr_stat`) · 🔁 Verb-Zeitmaschine (any of ~740 verbs, any person: Plusquamperfekt, Präteritum, Perfekt,
  Präsens, Futur I built with js/german-conjugation.js + the Perfekt field; English "I had / have / will have" for 40
  frequent verbs incl. he-forms; quiz English → German form).
- **22 core verbs were missing from js/word-data.js** (anrufen, anfangen, einladen, abholen, ausgehen, aufräumen,
  mitbringen, vorbereiten, ausfüllen, einsteigen, aussteigen, anziehen, sitzen, passieren, rennen, springen, setzen,
  ziehen, schieben, zählen, lehren, korrigieren) — added with forms, Tamil 🤖, examples, pictures; home cards, lexicon,
  word parts regenerated (+ root "Pass"); fill_home_forms.py filled the existing "sitzen" lesson card.
- Satzbau: new topic **`nebensatzzu`** (B1, 10 sentences) — "Weil meine Familie für mich sehr wichtig ist, versuche ich
  jeden Tag mit ihnen zu sprechen" and similar: subordinate clause first → verb + subject → zu-infinitive at the end.
- `scripts/check_tense_scenarios.py` in build.py.

#### Verified
All 4 practice types answered correctly 12/12, alternative future accepted, verb quiz 12/12, forms for all verbs × 6
persons without gaps, verb highlighting checked for all 96 sentences, 1100 + 390 px without horizontal scroll, no JS errors.

---

### 2026-09-26 (Task 53) — Wort-Zwillinge: page for confusing words

#### Task
User: "Need one page to get comfort on confusing word. Example Kitchen and Cake similar in german".

#### Done
- **`Wort_Zwillinge.html`** (linked in the sidebar and home Tools) + **`js/confusables.js`** (`DC_CONFUSABLES`,
  39 groups, 94 words): look alike (Küche/Kuchen/kochen, Kirche/Kirsche, schön/schon, zahlen/zählen/erzählen,
  drücken/drucken, Tasche/Tasse/Taste …), sound alike (Stadt/Staat/statt, Rat/Rad, mehr/Meer/Mehl, vier/für,
  Tür/Tier …), same word other article (der/die See, der/die Leiter, das/die/der Band, der/das Teil), English false
  friends (bekommen, Gift, wer/wo, also, Handy, Chef), similar meaning (kennen/wissen/können, lernen/lehren,
  leihen/mieten, stellen/stehen/legen/liegen …). Each word: picture, article colour, English, Tamil, example (🔊);
  each group: "🔊 Unterschied hören" (all words one after the other) and a tip in English + Tamil.
- Quiz: picture + English/Tamil → pick the word, or (35 %) listen → pick the written word; options = the group's
  words; mistakes stored in `dc_wz_hard` (group → count; a right answer lowers it), half of the questions come from
  the difficult groups, filter "🔥 Schwierig"; keys 1–4 answer.
- `scripts/check_confusables.py` (build.py): ids, types, ≥ 2 words, all fields, Tamil script.

---

### 2026-09-26 (Task 52) — All missing grammar concepts added (42 rules, A1 → B2)

#### Task
User: "You have to include all german concept" (after the grammar gap review, Task 50).

#### Done
- **`js/grammar-rules-extra.js`** (`DC_GRAMMAR_EXTRA`, 21 rules, 184 practice questions): A1 Präsens + du/Sie ·
  Personalpronomen & Possessivartikel · Negation nicht/kein/doch · Fragen (W-, Ja/Nein, welcher, was für ein) ·
  Zahlen, Uhrzeit (6 analog clock pictures), Datum · Modalverben · trennbare/untrennbare Verben · Imperativ;
  A2 Perfekt · Komparativ/Superlativ (spelling-rule table from the class sheet, bar picture) · Dativ-Verben ·
  Verben/Adjektive mit Präpositionen · Zeit- & Ortsangaben (seit/vor, nach/zu/in/bei/aus) · man/jemand/dieser/es gibt ·
  Wortbildung; B1 Plusquamperfekt & Futur I · Konjunktiv II Vergangenheit · lassen · Modalpartikeln · Zustandspassiv ·
  Nomen-Verb-Verbindungen. Each: summary, formula, table, 3 examples (🔊), question bank.
- Grammatik-Regel-Trainer: `mergeExtraRules()` appends them, registers an endless generator per rule (options
  shuffled), gives every rule a `level`, sorts A1 → B2 and renumbers (progress is keyed by id, so nothing is lost);
  rule chips grouped under level headings; drills show the new rule number.
- Tamil bridges for 11 of the new rules (du/Sie, person endings, என்னை/எனக்கு, இல்லை/Doch trap, -ஆ question trap,
  einundzwanzig and halb drei traps, போக வேண்டும், வா/வாருங்கள், -ஐ விட, எனக்குப் பிடிக்கும், போயிருந்தான், -க்க வை) →
  39 items for 30 of 42 rules. check_grammar_tamil.py also reads the extra rule ids.

#### Verified
42 rules render in study + drill mode at 1100 and 390 px, 8 generated questions per rule all valid, no JS errors.

---

### 2026-09-26 (Task 51) — Word pictures, Wohin/Wo pictures, preposition contractions

#### Task
User (class sketch "kitchen – die Küche", arrow into the room): "try to explain most of the word by image like this";
class note "ich gehe ins Kino (in + das)".

#### Done
- **`js/word-pictures.js`** (`DC_WORD_PICS`, `dcWordPic(cat, word)`): a picture (emoji — offline, every device) for
  1,113 words that can be pictured (577 nouns, 324 verbs, 212 adjectives; almost all A1/A2 nouns). Abstract words
  have no entry on purpose. `getIcon()` in js/icon-svgs.js and `promptIconHTML()` on the home cards show the picture
  (`wordPicHTML`), else the old category icon. Loaded on the 6 pages that load icon-svgs.js.
  `scripts/check_word_pictures.py` (build.py) checks every key is a real word.
- Grammatik-Regel-Trainer rule 3: `wohinWoPictureHTML()` — "Ich gehe in die Küche" (arrow into the room → Akkusativ)
  vs. "Ich koche in der Küche" (inside → Dativ), Tamil -க்கு / -இல்; `contractionTableHTML()` — ins, im, ans, am, zum,
  zur, beim, vom with examples, when not to contract, Kino ≠ Theater; 3 new drills (ins Kino, in der Küche, zum Arzt).

---

### 2026-09-26 (Task 50) — Grammar gap research, Tamil ↔ German bridges, grammar fixes, reflexive verbs, preposition pictures

#### Task
User: "Deep research on what are missing in grammar and what needs to implement. Some time tamil to German some place
is easy those place add tamil also" + class material (reflexive pronoun table; sich waschen / freuen / fühlen; picture
sheet of vor / hinter / auf / unter / an / über …). Report: artifact "German Grammar Gap Map".

#### Research findings (coverage vs. Goethe/telc A1–B1)
Covered: word order, cases, prepositions, adjective endings, Konj. II (present), passive, relative clauses, infinitive,
connectors, reflexive, n-declination, participles, Konj. I, nominalisation (Grammatik-Regel-Trainer 21 rules, Satzbau 27
topics, Cheat Codes, Studios, Konnektoren). **Missing / partial (roadmap, in priority order):** personal pronouns +
possessive articles; present tense endings / stem change / du–Sie; numbers, dates, time (halb drei); comparison rule +
adjective data fix; dative verbs, verbs/adjectives with prepositions; negation nicht/kein/doch; Plusquamperfekt,
Konj. II past, Futur I; man/jemand/niemand, dieser, welcher/was für ein, lassen, modal particles; noun-verb phrases.
Drill variety: the "infinite" drills repeat 214 unique questions (7–18 per rule).
Open data issues (not yet fixed, need OK): 88 wrong superlatives after -end/-isch (am spannendesten → am spannendsten),
~60 non-comparable adjectives with invented forms, stolz/kurz typ labels, 30 common adjectives missing.

#### Done
- **`js/grammar-tamil.js`** (`DC_GRAMMAR_TAMIL`, 24 items for 19 of 21 rules): ✅ "Leicht durch Tamil" bridges and
  ⚠️ "Tamil-Falle" traps with German example (🔊), Tamil sentence, word-by-word gloss, English + Tamil explanation;
  optional table (rule 10: mich/mir = என்னை/எனக்கு …). Rendered in the study view under the rule table
  (`tamilBridgeHTML`), switchable (`localStorage.dc_grammar_ta`), labelled 🤖. Rules 11 and 13 have none on purpose.
  `scripts/check_grammar_tamil.py` (run by build.py) validates keys/fields/Tamil script.
- Grammar fixes: adjective-ending table (zero article Dativ -em/-er, plural -e, Genitiv rows were wrong/missing; now 11
  rows); explanation "nach + Genitiv" → Dativ; rule-1 generator produced nonsense ("because we can work") with wrong
  English; "ich hätte gern einen Termin vereinbart" ≠ "would like"; doubled gap text (Mit ein___ + "einem", dem neu___ +
  "Praktikanten"); "16 rules" labels → 21; reflexive table got English (myself …).
- Rule 3: picture grid of the 9 two-way prepositions (`prepPictureGridHTML`, inline SVG table + ball, English, Tamil
  postposition, Wo?/Wohin? example with 🔊).
- **23 everyday reflexive verbs** were missing from `js/word-data.js` (sich freuen, fühlen, waschen, anziehen,
  ausziehen, umziehen, setzen, beeilen, interessieren, treffen, ausruhen, vorstellen, unterhalten, ärgern, kämmen,
  verlieben, bewerben, konzentrieren, langweilen, erkälten, anmelden, verabschieden, gewöhnen) — added with forms, level,
  Tamil (🤖), examples; home flashcards (SYNCED_WORDS), lexicon, word parts (+ wohl- prefix, 11 root meanings)
  regenerated; English of treffen / duschen fixed.

#### Verified
All 21 rules render in desktop + 390 px with no JS errors, toggle works, 15 drills per rule generated without errors;
build.py (incl. new check) + smoke_pages; call tests unaffected.

---

### 2026-09-26 (Task 49) — KI-Sprechpartner: microphone fixes + diagnostic call log

#### Task
User: "KI-Sprechpartner not able to speak microphone enable and disable. Do we have log for tracking" — there was no
persistent log (only the in-memory state history).

#### Likely causes found in the code (not reproducible in headless Chromium, so fixed + made visible in the log)
- **Android Chrome:** the Web Speech recogniser cannot share the microphone with our own `getUserMedia` stream (VAD).
  It ends right after starting (or reports `audio-capture`) → restarted every 120 ms → mic icon flickers on/off,
  nothing is heard. Now: on Android the call runs **"stt-only"** (no getUserMedia; barge-in and turn end from the
  recognised words). On other systems `BrowserSTT` counts sessions that end < 1.5 s without a result; after 3 the
  engine releases its own stream (`ConversationEngine.sttTrouble`, notice) and keeps the recogniser; after 8 more it
  stops the loop with a help message + retry instead of an endless on/off cycle. Restarts back off (1–1.5 s).
- **Noisy room:** the VAD noise floor only adapted while it was quiet, so steady noise (fan, street, AC) counted as
  "speaking" forever → stuck in USER_SPEAKING, turn never ended. Now the floor = 15th percentile of the last ~6 s
  (follows noise up and down). Turn-end safety: no new recognised words for hang + 1.8 s ends the turn even if the VAD
  still hears sound; voice without words returns to LISTENING after 6 s.
- Muting while USER_SPEAKING now returns to LISTENING; `NotReadableError` (mic used by another app) has its own
  message; the AudioContext is resumed on the next tap (Safari/iOS).
- ⚙ **Mikrofon: Automatisch | Nur Spracherkennung** (`dc_call_settings_v1.micMode`) — switches live during a call.

#### Diagnostic log (`js/call/call-log.js`, `DCCall.log`)
Ring buffer (900 events) with time since call start, category and data: `call` (session, providers, pause/end),
`env` (browser, Android/iOS, secure context, mic permission, number of inputs/outputs, German voices, AudioContext),
`mic` (open + track settings, released, muted, system mute/ended), `vad` (voice start/stop, level/noise/threshold
every 3 s), `stt` (every recogniser session: listening, audio start, speech, interim (≤ 1.4/s), final + confidence,
errors, end + duration, trouble), `turn` (end of turn with hang / quiet times / reason, ignored echo, barge-in, typed),
`state` (every transition, also rejected ones), `ai` (request, first token, complete, stopped), `tts` (first audio
latency, failures, browser fallback), `notice`, `ui`. Keys are never logged (whitelisted settings; key-like strings
masked). Last call → `dc_call_log_last`, last microphone test → `dc_call_log_test` (saved every 2.5 s + on end/pagehide).
UI: ⚙ → 🩺 Diagnose: **🎙️ Mikrofontest** (1. raw level via getUserMedia, 2. German recogniser — one after the other,
with verdicts and tips), 👁 Protokoll anzeigen (live), 📋 Kopieren, ⬇️ Herunterladen (.txt with call + test), live
status line during a call. `localStorage.dc_call_debug = '1'` also echoes all events to the console.

#### Verified
`scripts/test_call.py` Test I (19 checks): log content + no keys, mute/unmute (recogniser stopped/restarted, speech
ignored while muted), steady background noise (not stuck, turn still ends), saved log + download + viewer, mic test,
quick-end loop → stt-only switch and learner heard, never-working recogniser → loop stops with message, Android UA →
no getUserMedia + barge-in + turn end from words. Full suite 79/79, 0 console errors; build.py + smoke_pages 28/28.

---

### 2026-09-26 (Task 48) — KI-Sprechpartner v3: real-time conversational video call (existing page upgraded, not a prototype)

#### Task
User spec "Upgrade Existing AI Video Call into a Natural, Real-Time AI German Conversation Experience": no Speak/Wait
buttons, barge-in, hesitation-tolerant turn-taking, explicit call states, avatar with real lip sync, level-adapted
natural voice, streaming, gentle recasts, pronunciation feedback, graceful failures, mobile — and **do not fake**
capabilities the technology doesn't provide.

#### Architecture (page = content + learning layer; engine = `js/call/*`, plain scripts on `window.DCCall`)
```
mic ─► MicInput (echoCancellation/noiseSuppression/AGC) ─► VAD (adaptive noise floor; stricter "barge-in" mode)
  └─► STT: BrowserSTT (Web Speech, continuous + interim)  |  OpenAISTT (VAD-cut WAV + 0.4 s pre-roll → gpt-4o-mini-transcribe)
        └─► ConversationEngine turn-taking (end of turn = silence ≥ level hang; +1.4 s after "äh/und/weil/zum/möchte…")
              └─► page.onUserTurn → guided script | aiReply (LLM) | pronunciation drill
                    └─► ENG.respond: dcStreamAI (SSE) → sentence splitter → TTS per sentence (next one prefetched)
                          └─► Avatar.speakChunk (gapless WebAudio) ─► lip sync ─► back to LISTENING
```
- `js/call/call-state.js` — `CallStateMachine` with the 11 states IDLE, CONNECTING, LISTENING, USER_SPEAKING,
  PROCESSING, AI_SPEAKING, INTERRUPTED, PAUSED, RECONNECTING, ERROR, SESSION_ENDED + a transition table; invalid
  transitions are rejected and logged in `sm.history` (never an impossible state). UI, avatar and VAD subscribe.
- `js/call/audio-io.js` — shared AudioContext, MicInput (+ `pcm-capture-worklet.js` for OpenAI STT), VAD,
  AudioPlayer (gapless queue → analyser → out; `stop(fadeMs)` for barge-in), resample / PCM16 / WAV helpers.
- `js/call/tts.js` — providers with one interface `stream(text,{signal,level,persona})` → PCM chunks:
  **OpenAI** `gpt-4o-mini-tts` (pcm 24 kHz, per-tutor voice + `instructions` for persona and level pace),
  **ElevenLabs** `eleven_flash_v2_5` `/stream/with-timestamps` (pcm 16 kHz + per-character timestamps),
  **Browser** speechSynthesis (native, prefers neural/natural German voices; safety timeout). `DCCall.pace(level)`:
  A1 0.86 (slow, clear) · A2 0.94 · B1 1.0 · B2 1.06 (native). Voice "auto" = ElevenLabs > OpenAI > browser.
- `js/call/avatar.js` — `AvatarProvider` interface: connect · disconnect · speakChunk · finish · stop · interrupt ·
  setExpression · setState · getStatus (+ capabilities). **IllustratedAvatar** (SVG, default): lip sync from
  (1) ElevenLabs timestamps → German grapheme→viseme timeline (per sentence; request- or chunk-relative times both
  handled), else (2) the real TTS audio (RMS → jaw, spectral balance → vowel/sibilant shape), else (3) browser voice:
  approximated from word-boundary events (labelled "ungefähr"); expressions per state/mood tag, random blinks
  (incl. doubles), gaze saccades, non-repeating idle head motion, nods while the learner talks.
  **SimliAvatar** (photoreal, optional): Simli v3 SDK, bundled locally as `js/vendor/simli-client.bundle.js`
  (esbuild IIFE, MIT/Apache, rebuild steps in `js/vendor/LICENSES.md`), session token + ICE → p2p WebRTC, PCM16 16 kHz
  audio in → Simli renders lips + plays audio; failure/timeout → illustrated tutor takes over with a notice.
- `js/call/stt.js` — BrowserSTT (auto-restart with back-off; error codes denied/network/nomic) and OpenAISTT
  (per-utterance transcription with the lesson vocabulary as prompt; works in Firefox too).
- `js/call/conversation.js` — `ConversationEngine`: start/end/pause/resume/mute/volume, turn-taking, `say()` for
  fixed text, `respond()` for streamed LLM replies (leading `[mood]` tag → avatar expression, text after `###META`
  is not spoken but parsed as JSON), barge-in, retries, metrics (end of turn → first token / first audio).
- `js/app-shell.js`: `dcAIRequestConfig()` shared by `dcCallAI` (now accepts `opts.signal`) and new **`dcStreamAI`**
  (OpenAI-compatible SSE; falls back to a JSON answer); errors carry `e.status`. CSP connect-src += ElevenLabs,
  Simli (https/wss), `*.livekit.cloud`; media-src += `mediastream:`.

#### Real-time behaviour
- **Streaming:** sentence 1 goes to TTS while the LLM still writes (verified: first TTS request before the last
  token); TTS chunks are played as they arrive; the next sentence is synthesised during playback. A first clause
  > 60 chars is cut at a comma. Abbreviations ("z. B.", "Dr.") and ordinals don't end a sentence.
- **Barge-in:** while AI_SPEAKING the VAD needs a louder (noise+18 dB, ≥ −38 dBFS) and longer (320 ms) signal;
  with Web Speech the interrupt fires on ≥ 2 recognised words (or 1 word + VAD) that are **not** an echo of the
  tutor's audible/next sentence. Then: LLM stream aborted, TTS requests cancelled, audio faded out (~50 ms),
  INTERRUPTED → USER_SPEAKING; the history gets only the sentences the learner actually heard + " …", and the next
  user message is prefixed "[unterbricht]" so the model reacts to the interruption. Captions/echo guard follow the
  sentence that is audible now (audio is queued ahead).
- **Turn-taking:** base hang A1 1150 / A2 1000 / B1 880 / B2 780 ms (+350 ms for one-word turns, +1400 ms after
  fillers, conjunctions, articles, prepositions, pronouns, "möchte/würde/hätte", "," or "…"). The regex uses an
  explicit Unicode letter boundary — JS `\b` is ASCII-only and never matched before "äh"/"für" (bug found by Test C).
- **Failures:** `offline` event → abort + RECONNECTING "📡 Verbindung wird wiederhergestellt …", `online` → retry
  the pending turn; HTTP 5xx/429/timeouts (20 s to first token, 15 s per TTS sentence) → 2 retries with back-off;
  401/403 → ERROR with key hint (no loop); TTS failure → browser voice for that sentence + notice; Simli failure →
  illustrated tutor; mic denied / no mic / no Web Speech → notice, typing (💬) uses the same turn path.

#### Learning layer (page)
Modes: 🎓 guided (scripts, offline) · 🗣️ free (few corrections, confidence first) · 📘 learning (recasts in speech,
correction card + toast, max 2 vocab cards per reply, pronunciation drill). The system prompt carries tutor
personality, role/scene, goals, `LEVEL_RULES`, learner memory (recent words from `dc_review_requests`, last mistakes
from `de_coach_vault`), "no grammar lecture", "[unterbricht]" handling and the mood-tag + `###META` format.
Pronunciation: recogniser output vs. lexicon (umlaut-folded near-miss, Levenshtein 1 vs. expected words) → card with
sound tip (EN + Tamil), syllables, 🐢 slow replay, IPA on demand (🤖); honestly labelled as recogniser-based; in
learning mode the tutor asks for one repetition. Transcript: side panel (desktop) / bottom sheet (≤ 760 px),
replay 🔊 / 🐢, translate (META.en or AI), tap any word → lexicon popup + ➕ flashcard, correction/vocab cards.
Settings sheet (⚙): conversation mode, level, voice, keys (OpenAI, ElevenLabs + voice id, Simli + face id), avatar,
STT, self-view camera, Tamil, captions, "Verbindungen testen", average latency.
Storage: `dc_call_settings_v1`, `dc_call_latency`, keys `dc_call_openai_key` (falls back to `de_ai_key_openai`),
`dc_call_eleven_key`, `dc_call_eleven_voice[_<tutor>]`, `dc_call_simli_key` — only in this browser, sent only to
the provider itself. `dc_tutor_v1.mode` 'ai' is migrated to 'learning'.

#### Honest limits
Photoreal video and native lip sync only with a Simli key + face id. Natural voice only with an OpenAI or ElevenLabs
key (browser voices vary; Edge "Natural" voices are decent). Browser-voice lip sync is approximate. Web Speech (Chrome)
sends audio to Google and can't separate the tutor's voice perfectly — headphones make barge-in reliable.
Pronunciation feedback is inferred from what the recogniser understood, not phoneme scoring. No live test against the
vendor APIs was possible from the sandbox (egress blocked); the request formats follow the vendors' documented APIs.

#### Verified (headless Chromium; fake mic stream, fake SpeechRecognition, mocked SSE LLM / PCM TTS / ElevenLabs
NDJSON with timestamps / OpenAI transcription / Simli 401) — 60/60 checks, 0 console errors
A basic conversation (streamed greeting, auto turn end, correction + vocab cards, translate, word popup, save, replay,
typing, report, vault) · B interruption (echo guard, noise ignored, stop ~50 ms, history = heard part + "[unterbricht]")
· C hesitation ("Ich möchte äh" + 1.9 s silence → still listening, one merged turn; trailing "weil") · D pronunciation
(Brotchen → Brötchen card + Tamil tip, drill, praise; guided word score) · E level (prompt rules, TTS pace, A1 waits
longer) · F network (offline mid-reply → RECONNECTING → auto-retry, 503 retry, TTS fallback, 401, mic denied) ·
G mobile 390 px (one row of 6 controls ≥ 44 px, bottom sheet, no h-scroll, pause/resume) · H ElevenLabs viseme timing,
OpenAI STT, Simli fallback. build.py + smoke_pages 28/28.
Run again with `python3 scripts/test_call.py [A … H]` (mocks in `scripts/test_call_mocks.js`; also a CI step in checks.yml).

---

### 2026-09-25 (Task 47) — KI-Sprechpartner v2: closer to Praktika (video call, animated tutors, guided lessons without AI, learning path)

#### Task
User: "Can you make similar Praktika ai" (after Task 46).

#### What changed (`KI_Sprechpartner.html` rewritten, new `js/tutor-scripts.js`, new `scripts/check_tutor_scripts.py`)
- **Video-call screen:** large animated tutor (SVG face: blinks, mouth + head move while the German voice speaks,
  green glow while listening), live subtitles (🌐 → English + Tamil), mission goals as chips, call timer, control bar
  (💡 Hilfe · 🌐 Übersetzen · 🎙️ · ⌨️ Tippen · 🇬🇧 Wie sage ich? (AI mode) · 📞 Beenden).
- **6 tutors:** Lena (teacher, Munich), Priya (nurse from Chennai in Stuttgart — compares with Tamil), Jonas
  (colleague, Berlin), Herr Weber (official/examiner, Sie), Oma Hilde (Hamburg, slow & warm), Max (student, du).
- **🎓 Guided lessons — work without any AI key, offline:** `js/tutor-scripts.js` has a dialogue for all 15
  missions (105 turns; AI-assisted, checked by two agents + validator): tutor line DE/EN/TA, the learner's task
  (EN/TA), 3 model answers (DE/EN/TA), a tip, goal index, closing line, 8 lesson words. The learner speaks (or types);
  the answer is compared word by word with the closest model answer (≥ 60 % = accepted, colour-coded words;
  < 60 % → second try with the nearest model; after 2 tries the model is shown and saved as a mistake). Sample names
  in model answers (Arun, Priya …) don't count against the learner.
- **🤖 Free conversation** (AI key): as in Task 46 (+ reply_ta for the subtitles).
- **Learning path:** first-visit onboarding (goal: Alltag/Arbeit/Prüfung/Reisen/Ämter, level, minutes/day);
  missions sorted by nearness to the level and the goal; "Heute für dich" card; 🔥 streak (days with practice),
  minutes today vs. daily goal (`dc_tutor_v1.days`), lessons done.
- **Report:** pronunciation average, "mit Hilfe" count, goals, mistakes (→ KI-Coach Fehler-Tagebuch), lesson words
  with "➕ In meine Karteikarten" (loads js/lexicon.js on demand, only words the app knows → `dc_review_requests`,
  picked up by the home flashcards like the Übersetzer's), AI feedback in AI mode, "▶ Nächste" lesson.
- build.py runs `check_tutor_scripts.py` (every mission has 6–8 turns, 3 different options with DE/EN/TA, all goals
  reached, closing line, words); `js/tutor-scripts.js` is in the service-worker cache.

#### Verified
All 15 guided lessons played end to end in headless Chromium (all goals reached, report shown, no JS errors);
onboarding, help, retry, flashcard hand-over, name rule, AI mode with a stubbed AI, 390 px + dark mode;
build.py + smoke_pages 28/28.

---

### 2026-09-25 (Task 46) — KI-Sprechpartner: Praktika-style voice role-play tutor

#### Task
User: "And is possible to implement Praktika ai similar in existing on our page".

#### What was built (`KI_Sprechpartner.html`, new; linked from index.html "Coach" and the home suite links)
- **3 tutor personas:** Lena (patient teacher), Jonas (casual colleague, spoken German), Herr Weber (formal official,
  Sie-form, telc/Goethe exam style). Level A1–B2. Avatar animates while speaking / glows while listening.
- **15 missions** (A1 café, introducing yourself, supermarket, train ticket · A2 doctor, rescheduling by phone, flat
  viewing, pharmacy, small talk · B1 Bürgeramt, bank account, returning a product, job interview, opinion
  discussion · free conversation), each with 3–4 goals shown as a live checklist (the AI reports goals_done).
- **Voice first:** 🎙️ speech recognition (de-DE, interim text) → AI → tutor speaks (German voice, speed setting);
  🎧 hands-free mode starts the mic again after the tutor has spoken; typing always works.
- **Every learner turn gets feedback:** ✏️ correction (wrong → right, why in English + Tamil, 🔊 listen, 🎙️ repeat)
  or ✅ "Richtig!" with an optional more natural phrasing.
- **Help when stuck:** 💡 3 suggested replies (take over / listen / repeat); "🇬🇧→🇩🇪 Wie sage ich …?" translates
  what the learner wants to say into German for this situation. Repeating a suggestion/correction is scored word by
  word (🎯 Aussprache %).
- AI bubbles: 🔊 replay, 🐢 slow, 🌐 English translation on tap.
- **Report:** goals reached, all corrections (saved to the KI-Coach's Fehler-Tagebuch `de_coach_vault`, so its
  drill repeats them), AI feedback (score, strengths, what to work on, useful words), XP via addXP.
  Stats in `dc_tutor_v1` (tutor, level, missions done, sessions, minutes); options in `dc_tutor_opt_*`.
- One JSON-mode prompt per turn through `dcCallAI` (any provider set in AI Config & Settings); a non-JSON answer
  falls back to plain text. Without a key the page explains where to set one and the missions are disabled.

#### Verified
Headless Chromium with a stubbed AI: whole café mission (start, suggestions, correction with Tamil, goal checklist,
repeat score 100 %, mission complete, report with AI feedback, vault entry, stats), 390 px phone + dark mode, no JS
errors. Real-provider test still open (api.deepseek.com is blocked in this cloud environment).

---

### 2026-09-25 (Task 45) — Open points fixed: examples for every word, Studios on shared data, conjugation engine, fast Excel, offline fonts

#### Task
User: "Now you fix the open points with test key" (a DeepSeek test key). The key was NOT used and is not stored in the
repo: api.deepseek.com is blocked by this cloud environment's network policy (proxy 403). The user can allow the domain
in the environment's network settings; then the real-key test of the AI features (point 9) can be done.

#### What changed
- **Point 1 — Audio Coach retired:** `Verben_Hoeren_EN_DE.html` is a redirect to the Auto-Play Speaker (which has the
  same verbs, EN/TA → DE, Tamil, filters, drill sequences); the old page is in `archive/`. Links in index.html /
  deutsch-coach.html point to the Speaker; smoke_pages no longer expects its word list.
- **Point 2 — A2/B1 Studios use the shared data:** each Studio keeps its verb *selection* (`A2_VERBS_LIST`,
  `B1_VERBS_LIST`), all fields come from `js/word-data.js` and the Präsens forms from `js/german-conjugation.js`
  (`dcStudioVerbs()`). The old embedded copies had outdated Tamil (achten = "pay money") and wrong forms
  ("ich tworte an", "du planest", "du sterbst", "kennenlerne").
- **Conjugation engine fixes (affect Excel, Verb trainer, Übersetzer, home, Thema):** wir/sie = infinitive
  ("wir feiern", not "feieren"); e-insertion after consonant + m/n ("du öffnest, es regnet, du rechnest", but "lernst,
  wohnst"); "(sich)" follows the person ("ich entscheide (mich)").
- **Points 3/4/5/7 — word data (AI-drafted by agents, labelled):** example sentence + English + Tamil for all 1,089
  nouns and 671 adjectives (`ex`, `ex_en`, `ex_ta`, `ex_src: "ai"`), shown with 🤖 in the Nomen/Adjektiv trainers
  (answer box), Excel "Beispielsatz" column (2,467 of 2,479 rows) and the Übersetzer (lexicon `ex/exen/exta/exai`);
  topics for the 566 nouns without one (`topic_src: "ai"`); a noun for the 169 verbs without one (`noun_src: "ai"`);
  second opinion on the 68 uncertain Tamil meanings: 53 confirmed (🤖? → 🤖), 13 corrected, 2 stay uncertain.
  Data fixes: zähligen → zählbar, unzähligen → unzählig (countless), stolz → stolzer/am stolzesten, English of
  unvergesslich, genießbar, unversiegbar, unsachlich, vermehrbar. Word parts: exact spelling before the umlaut-less
  stem (zählbar = zählen + -bar, not zahlen).
- **Point 6 — Excel sheet:** memory tips are computed per row on first use (lazy getter); only the first 150 rows are
  built, more load when scrolling near the end ("Alle jetzt laden" button; the reader loads a row it needs). Phone-speed
  test (4× CPU throttling): rows visible after 3.8 s (was 15 s; ~0.5 s unthrottled).
- **Point 13 — fonts self-hosted:** `css/fonts.css` + `fonts/*.woff2` (Fjalla One, IBM Plex Sans/Mono, Inter;
  latin + latin-ext; SIL OFL, `fonts/OFL.txt`; 500 KB, in the service-worker cache). All 23 pages use it — a slow or
  blocked fonts.googleapis.com no longer delays or blanks the pages (it did: 41 s here).
- **Point 10 — Satzbau second proofread (agents):** 928 sentences checked again; 5 fixed (a logic slip
  "morgen/heute", two "trotzdem" role tags in the Mittelfeld, two English translations); themes had none.
- **Points 11/12 — Satzbau:** "⬆️ Importieren" loads an exported AI-sentence file (each sentence re-checked);
  after a wrong build/typed/listen answer "🤖 Ist meine Version auch richtig?" lets the AI judge the learner's order —
  if correct it is counted as right (labelled as the AI's verdict).
- Point 8 (≈ estimated levels) stays: no official list to take levels from.

#### Verified
Studios load 219/284 shared verbs with correct forms, no JS errors; engine diff reviewed for all 503 Studio verbs;
Excel scroll-loading/reader row access; trainers show examples; Satzbau import + alternative check with a stubbed AI;
build.py (all checks) + smoke_pages 27/27.

---

### 2026-09-25 (Task 44) — Satzbau: more sentences, AI sentences kept, hands-on help after mistakes, Experte level

#### Task
User: "Each 0/14 gemeistert. Is it questions for checking? Need more and also ai generated also keep for future. If AI enable,
and if did incorrect need to give hands-on more and help to expert on it".

#### What changed
- **Counter explained + clearer:** a topic card now reads "📝 N Sätze (+ n 🤖) · ✓ x gemeistert · 🏆 y Experte"; a line on
  the home screen explains it (gemeistert = 1× right, Experte = 3× right in any mode; a missed sentence stops counting
  until it is right again in the review).
- **More built-in sentences:** grammar topics 14 → 24, everyday themes 12 → 20 (4 more agents, same spec + validator,
  duplicates against the existing data rejected) → **928 sentences** (was 546).
- **Hands-on after a mistake (works without AI):** the missed sentence is automatically asked again ~3 sentences later
  (↻ Wiederholung); "🏋️ 3 ähnliche Sätze üben" pulls the 3 sentences of the topic with the most similar structure
  (edit distance of the role pattern) to the front, in the mode that was failed.
- **With an AI key:**
  - "🤖 Erklären & üben" after a mistake: the AI gets the correct sentence *and the learner's answer* (build order, chosen
    option, typed text, tapped chunk, misplaced verb gaps, heard speech) and explains exactly what went wrong + pattern +
    trick + Tamil comparison; then it writes 3 new sentences with the SAME structure, which come next (🏋️ Extra-Übung).
  - "🤖 +5 neue Sätze" in every topic: unlimited new sentences.
  - AI sentences pass the same word-order check in the browser (`sentenceProblems()`, a port of
    scripts/check_satzbau.py); failing or duplicate ones are dropped. Kept ones are saved in `sb_ai_v1`
    ({topicId: [sentence]}), added to their topic on every visit (counted on the card as "+ n 🤖"), labelled
    "🤖 KI-Satz" with a 🗑️ delete button, and can be exported as JSON (⬇️ Exportieren on the home screen).
  - Without a key the page shows where to set one up (AI Config & Settings).
- `masteredIn()` ignores sentences waiting in the review queue; `expertIn()` = correct ≥ 3×; ⭐ all mastered,
  🏆 all expert.

#### Verified
Headless Chromium with a stubbed AI: wrong answer → requeue + 3 similar sentences moved forward; AI coach got the
learner's answer, 3 AI sentences accepted (one with wrong word order rejected, "." in a chunk moved to end), saved,
still there after reload, card "14 Sätze + 3 🤖", delete works; +5 with only duplicates → clear message. All
sentences solved in 7 modes → all right, no JS errors; 390 px no sideways scroll; build.py + smoke_pages.

---

### 2026-09-25 (Task 43) — Satzbau-Trainer rebuilt: 546 role-tagged sentences, 8 learning modes, Satzbauplan

#### Task
User: "Satzbau-Trainer need to find missing and innovative way to learn and easy for learning and also lot of stuff".

#### What was missing
Only 52 sentences (9 grammar + 6 theme topics); no W-/Ja-Nein-questions, imperative, negation, TeKaMoLo, Dativ/Akkusativ
order, reflexive verbs, relative clauses, indirect questions, zu-infinitive, Futur, passive, Konjunktiv II, temporal
clauses, Ersatzinfinitiv; one exercise type (tap the words) with a rigid right/wrong check; no explanation *why* a word
stands where it stands; no review of mistakes.

#### Content — `js/satzbau-data.js` (new, 221 KB)
- 27 grammar topics (A1 7, A2 8, B1 10, B2 2) × 14 sentences + 14 everyday themes (Familie, Wohnen, Arbeit, Einkaufen,
  Gesundheit, Behörden, Reisen, Freizeit, Essen, Deutschkurs, Termine, Bank/Post/Handy, Wetter, Gefühle & Meinung)
  × 12 sentences (4 A1 · 5 A2 · 3 B1 each) = **546 sentences** (was 52; the old ones are kept, converted, a few fixed).
- Each topic: German/English/Tamil rule, a colour formula, a memory trick and the typical English/Tamil-speaker mistake.
  Tamil notes compare with Tamil word order (verb last = like a German Nebensatz).
- Each sentence is split into Satzglieder with a role; English + Tamil translation.
- Sentences, translations and Tamil rules were drafted with AI assistance (4 agents), then machine-checked and
  read through; the page labels Tamil 🤖 and says so in its footer.
- **`scripts/check_satzbau.py`** (new, run by build.py → CI): per clause — main clause: V is the 2nd Satzglied
  (K at position 0 doesn't count, a leading Nebensatz is the 1st); Nebensatz: v last, e before v (Ersatzinfinitiv
  topic exempt), um/ohne/statt … zu ends with the infinitive; verb-first only in janein/imperativ; required fields,
  duplicates.

#### Learning methods (`Satzbau_Trainer.html`, rewritten)
- **Farbhilfe:** every Satzglied coloured by role (Subjekt blue, Verb red, time/place/… own colours; legend on home).
- **🏗️ Satzbauplan** after each answer: Vorfeld | Verb (Pos. 2) | Mittelfeld | Verbende | Nachfeld, plus the
  Nebensatz with "verb at the end — like Tamil".
- 8 modes: 🧩 Bauen (keys 1–9, Enter, Backspace) · 🟢 Auswahl (right order vs. typical mistakes) · ✍️ Schreiben ·
  🎯 Verb-Detektiv (sentence without its verbs — tap the gap where each verb goes) · 🔍 Fehler finden (one Satzglied
  misplaced — tap it) · 🎧 Hören & Bauen (audio only, 🐢 slow) · 🎙️ Sprechen (speech recognition, word-by-word score;
  "Lösung zeigen" doesn't count as a mistake) · 🔄 Umbau (start the sentence with the time/place phrase → inversion).
- Mistakes are generated only by moving verbs (English "verb 3rd", Tamil "verb last", Satzklammer broken,
  "weil ich bin", "deshalb ich …", Ersatzinfinitiv "hat" at the end) — a moved verb is always wrong German, so a
  "wrong" option can never be a correct sentence.
- Build check accepts the inverted order (Vorfeld variant); a Mittelfeld-only difference gets "Verbstellung richtig!"
  with the TeKaMoLo/pronoun/nicht rule.
- Home: stats (mastered / today / to review), 🎲 Gemischte Runde (10 sentences of the chosen level, mode changes per
  sentence), 🔁 Fehler wiederholen (missed sentences), 🧭 Nächstes Thema (learning path A1→B2), level chips; theme
  topics opened with a level chosen practise only that level's sentences. 🤖 "Warum diese Reihenfolge?" when an AI key
  is set. XP + error log hooks as before; `sb_progress_v1` keys unchanged (old progress on kept sentences still counts).

#### Verified
Headless Chromium: all 546 sentences solved in 7 modes (3,822 items) → all "Richtig", no JS errors; mixed round, review
queue, speaking skip, dark mode, 390 px phone (no sideways scroll); smoke_pages 27/27; build.py incl. check_satzbau.

---

### 2026-09-25 (Task 42) — Audit: phone layout on every page, duplicate tools removed

#### Task
User: "Check any missing or enhancement need?" and "In tool, why need A2 studio? Like that anything unwanted".

#### Fixed
- **8 pages could be dragged sideways on a phone** (A1/B1 exam simulators, Cheat Codes, KI Coach, Verben hören, Master Grid, Wortfamilien redirect): `.app-main` is a flex item with the default `min-width:auto`, so one wide child stretched the whole page (to 1,200 px on Cheat Codes); the off-screen drawer (`right:-100%`) then followed the widened page. `css/design-system.css`: `.app-main, .app-content { min-width: 0 }`. KI Coach additionally: its 2-column control grid used `1fr 1fr` (long option texts) → `repeat(2, minmax(0,1fr))`; its drawer is hidden with a transform instead of `right:-100%`. Audit at 390 px: all 27 pages fit (was 19).
- **Tools list duplicates removed** (`index.html`): "A2 Studio" (same page as Prüfung → A2 Prüfung; B1 wasn't listed in Tools either) and "Wortfamilien" (`Wortfamilien_Explorer.html` is only a redirect to the Master Grid = Lernen → Wortschatz; the redirect file stays for old bookmarks).
- **Old in-page link bars removed** where they repeated the sidebar menu: Continuous Verb Speaker ("DEUTSCH-COACH SUITE", 7 links) and the Excel sheet ("DEUTSCH SUITE" header). The Excel page's code expected that bar's theme button → guarded (the app's top bar has the theme switch).

#### Audit findings, not changed (for a decision)
- `Verben_Hoeren_EN_DE.html` ("Audio Coach") does a subset of `Continuous_Verb_Speaker.html` ("Auto-Play Speaker"): same 721→719 verbs, EN → DE audio; the Speaker also has type filters (trennbar/untrennbar/reflexiv), 4 drill sequences, think-pauses and repetitions. Candidate to retire (redirect).
- A2 / B1 Practice Studios carry their own verb lists (`A2_VERBS` …) separate from js/word-data.js.
- Data gaps: nouns and adjectives have no example sentences (verbs have); 566 nouns have no topic (Thema); 169 verbs have no related noun; 68 AI Tamil meanings are marked uncertain (🤖?); 1,300 levels are frequency estimates (≈).
- Excel sheet takes ~4.7 s to open on a phone (2,479 rows × 19 columns rendered at once).
- Fonts load from Google Fonts (no offline copy); the Übersetzer's AI features still need one test with a real key.

---

### 2026-09-25 (Task 41) — Excel sheet: resizable columns, text wrap, example column width, sheet below the phone top bar

#### Task
User: "In excel page Wortaufbau column need option for resize".

#### What changed (`Deutsch_Wortschatz_Excel_Sheet.html`)
- **Every column can be resized** (not only Wortaufbau): drag the right edge of a column header (mouse or finger — pointer events; the grab area is 22 px wide on touch screens). Width 50–900 px, saved in this browser (`excel_sheet_colwidths_v1`), double-click / double-tap the edge = standard width, **↔ Breiten zurücksetzen** resets all. Resizing does not trigger sorting.
- **↵ Text umbrechen** (saved, `excel_sheet_wrap_v1`): long cells such as Wortaufbau wrap onto several lines instead of being cut off with "…".
- Bug from Task 38 fixed: the "🗣️ Beispielsatz" column had no width and collapsed to 0 px (invisible); it is 300 px now.
- On phones the app's sticky top bar is ~220 px (title + stat boxes), but the sheet assumed 72 px, so the sheet's header row (column names, resize edges) slid under the bar at the bottom of the page. The sheet height now uses the measured bar height plus the status bar below it (`--dc-app-header-h`, `syncAppHeaderHeight()`, updated by a ResizeObserver; not tied to window "load", which may never fire here).

#### Testing
Mouse drag Wortaufbau 240 → 400 px (header and body cells), survives reload, double-click resets; finger drag 240 → 340 px at 360/412/800 px; sort not triggered; wrap: rows grow (max 176 px in the first 40 rows); sheet starts below the top bar at 360/412/800/1280 px; Excel suites, contrast, build, smoke (27 pages) pass.

---

### 2026-09-25 (Task 40) — Excel sheet: hidden columns are visible as such; 🔥 button no longer saves its layout

#### Task
User (after Task 39): "Still not showing after f column".

#### Real cause
Not the scrolling: the saved column layout. The **🔥 Häufigste Verben hören** button applied the preset "Verben hören" (English · Wort · Präteritum · Perfekt · Häufigkeit · Level = exactly 6 columns, A–F) **and saved it** (`excel_sheet_columns_v1`), so every later visit showed only A–F; nothing on the page said that 13 columns were hidden. Reproduced: tap the button, reload → A–F.

#### Fix (`Deutsch_Wortschatz_Excel_Sheet.html`)
- New bar above the sheet whenever columns are hidden: "👁 6 von 19 Spalten sichtbar — 13 ausgeblendet" with **Alle 19 Spalten zeigen** and **🧩 Spalten wählen** (`renderHiddenColumnsBar()`); the status line says "6 von 19 Spalten (A–F)".
- The 🔥 button's 6-column view is only for that listening session (not saved) — the next visit shows the user's own layout again. Users who already have the 6-column layout saved see the bar and get all columns back with one tap.

#### Testing
Saved 6-column layout → bar + one tap → A–S, survives reload; 🔥 button → A–F with the bar, reload → own layout (A–S); smoke test 27 pages; build checks.

---

### 2026-09-25 (Task 39) — Excel sheet: all columns reachable again

#### Task
User: "In excel page I can see up to F column. Why it not showing".

#### Cause and fix (`Deutsch_Wortschatz_Excel_Sheet.html`)
- `.sheet-viewport` is meant to scroll the table inside itself (both directions, sticky header row), but it had no height inside the app layout, so it grew to all 2,479 rows (84,676 px). The page scrolled instead of the sheet, and the sideways scrollbar sat below the last row — only the first columns (A–F on a tablet) were reachable. Now `height: calc(100dvh - 72px)` (min 360 px): the sheet fills the screen and scrolls sideways with the scrollbar / a finger swipe.
- The status line says how many columns there are: "… · 19 Spalten (A–S) ↔ seitlich wischen" (wraps on phones — a no-wrap version widened the page to 593 px on a 412 px phone).
- Tested: 360/412/800/1280 px — no page overflow, swipe/scroll reaches column S; Excel suites, column reading, touch and mouse column drag pass. (`test_excel_cols.py` from Task 27 still expects the old 16-column layout — its failures are identical before and after this change.)
- GitHub checks (Task 38 workflow) passed on the branch and main.

---

### 2026-09-25 (Task 38) — Everything from the open list: shared word data, Tamil for every word, example sentences, speaking practice, CI

#### Task
User: "What is pending and what is need to enhance" → "Implement everything if need create agent". Data drafting (Tamil, example sentences) was done by 6 parallel agents (3 hit a usage limit and were re-run), merged and checked here; all code changes were made here.

#### What changed
**Data**
- **One source for the word lists: `js/word-data.js`** (`DC_WORDS.VERBS` 719 / `NOUNS` 1,089 / `ADJS` 671). The 8 pages that carried copies load it (`const VERBS = DC_WORDS.VERBS;`; Excel/Master Grid add `comp` from `komp`). Scripts read/write it (`load()`/`array_spans()` also match `DC_WORDS.NAME = [`, `data_files()`, `dump_entries()` keeps one entry per line). `check_vocab_sync.py` now fails if a page defines its own non-empty VERBS/NOUNS/ADJS again or reads DC_WORDS without loading the file. Stale `data/*.json` + `sync_data.py` (503-verb snapshot that would overwrite newer data) → `archive/`.
- Removed the non-words *befotografieren* / *verfotografieren* (list, home cards, curated sister lists); *backen* Präteritum **backte**; *joggen* **ist gejoggt**, "to jog".
- **Tamil for every word**: the 1,148 missing meanings (157 verbs, 566 nouns, 425 adjectives) were drafted by AI agents with rules and style examples from the existing data, checked for completeness/alignment/no Latin script, and spot-checked (45 random entries, all correct). Stored with `ta_src: "ai"` (`"ai?"` = the translator marked it uncertain, 68 entries) + generated `ta_translit`. **Labelled 🤖** (`dcTaMark()` in `js/app-shell.js`, tooltip "KI-Übersetzung") on the trainers, Verben hören, Continuous Speaker, Excel, Master Grid, home flashcards (`DC_TAMIL_AI` in `js/tamil-meanings.js`) and the Übersetzer (`tai` in `js/lexicon.js`). Home cards with Tamil: 1,465 → 2,614.
- **Example sentence for every verb** (707 without a curated one): German + English + Tamil, drafted by agents, checked by script that the verb (any form, separable split, reflexive) is in the sentence, and spot-checked (30 random, all grammatical). Fields `ex`, `ex_en`, `ex_ta`, `ex_src: "ai"`, labelled "🤖 KI-Beispiel". Shown in the Verb flashcard answer + memory system (with 🔊), the new Excel column "🗣️ Beispielsatz" (read aloud in column mode) and the Übersetzer.

**Verb flashcards**
- Memory system explains every verb built from parts via js/word-parts.js ("ver- (change; wrongly; away) + stehen (to stand) → verstehen") instead of vague prefix metaphors; simple verbs show their syllables instead of "stre… → German Action Sound"; situations use real sentences.
- Stem diagram keeps separable prefixes (greyed): anerkenn(en) → erkannte … an (was "erkenn → erkannte").

**New features**
- Übersetzer: **🎙️ Nachsprechen** (speech recognition de-DE; every word marked right/wrong, score %, numbers compared as words) for the word, its example and sentences; **⭐ Satz speichern** → "Meine Sätze" list (with AI translation if available, 🔊/🎙️/🗑); **➕ In meine Wiederholungen** → `dc_review_requests`, which the home page turns into "due today" cards on its next load (and says so in the coach line).
- 🌐 link to the Übersetzer from the Verb/Nomen/Adjektiv answer boxes, every Excel word and every Master Grid card (`dcTranslatorLink()`).
- Excel column chooser: drag the ⠿ handle with a finger (pointer events; HTML5 drag doesn't work on touch).

**Housekeeping**
- 186 unused old-menu CSS rules (`hub-*`/`suite-*` never used outside `<style>`) removed from 16 pages; 48 before/after screenshots (desktop light/dark, phone) — 42 pixel-identical, 6 differ only by the animated avatar's eyes / sub-pixel text rendering.
- Section 18 / 26 / overview notes updated (resolved items marked, word-data workflow).
- **CI**: `.github/workflows/checks.yml` (ubuntu-24.04) runs `scripts/build.py` (all data checks) and the new `scripts/smoke_pages.py` (every page over http in headless Chromium, fails on any JavaScript error or if a word page gets an empty list).

#### Not done / limits
- The Übersetzer's AI features still need one test with a real AI key (only a simulated provider was available here).
- Levels marked "≈" remain frequency estimates — there is no official list in the repo to replace them with.

#### Testing
`build.py` (8 checks) + `smoke_pages.py` (27 pages, 0 errors); contrast audit (all pages × 4 theme scenarios) clean; suites: prefix, parts, tips, B1, audio, Excel column reading, Übersetzer (13 queries), new Tamil-label/example suite, new speaking/saved/review/link suite (fake speech recognition), touch drag via real touch events.

---

### 2026-09-25 (Task 37) — Excel read-aloud follows the column order

#### Task
User: "If enable audio for verb or noun, need to be based on the order audio speak. Example Verb → order is english, verb and past tense then audio also en, verb and past tense".

#### What changed (`Deutsch_Wortschatz_Excel_Sheet.html`)
- New read-aloud mode **📑 Wie die Spalten (Reihenfolge & Auswahl)**, now the default (saved settings with the old default "Infinitiv · Präteritum · Perfekt" switch to it once; the other modes still exist). Each row is read **left to right in the visible column order** chosen in 🧩 Spalten & Reihenfolge — English with an English voice, German with the chosen German voice, hidden columns are not read. Example: English · Deutsches Wort · Präteritum → "to go" · "gehen" · "ging".
- Spoken columns: English, Deutsches Wort, Nomen (nouns: the plural, the singular is the word; verbs: the related noun), Präteritum, Perfekt, Präsens ("er geht"), Adjektiv forms (comparative, superlative), Verb (for nouns; skipped on verb rows where it repeats the word), Tamil only if the device has a Tamil voice. Tags, tips, level, frequency etc. are skipped. Text in brackets is not read.
- "+ Englisch" is greyed out in this mode (English is read where its column stands). If no readable column is visible, a message says so instead of silently stepping through the rows. The 🔥 Häufigste Verben hören button uses the preset English · Wort · Präteritum · Perfekt, so it is read in that order.

#### Testing
Speech spy: 6 column orders (verb, separable verb, noun, adjective, no readable column) read in exactly the column order with the right languages; reorder with ▲ taps at phone width → table and audio follow, and persist after reload; "read all" continues row after row; `build.py` passes.

---

### 2026-09-25 (Task 36) — Verb flashcards: prefix row, real verb family, correct generated sentences

#### Task
User (screenshot of the Verb trainer answer for *streiken*): "Here i don't see Inseparable Prefix".

#### What changed (`Verb_Transformation_Trainer.html`)
- The answer box has a **Präfix** row under the infinitive: prefix badge(s) (🛡️ untrennbar / 🚀 trennbar / 🔀 doppelt) with the rule in English and Tamil, both prefixes for double ones (anerkennen: an- trennbar + er- untrennbar), or "kein Präfix — einfaches Verb (Perfekt mit ge-: hat gestreikt)". Same classification as every other page (`MemoryTips.prefixInfo`, js/word-parts.js).
- 9-step memory system, grammar hook: uses that classification too, and says "No prefix" for simple verbs.
- **Word family** listed invented verbs: prefixes were glued onto the root with invented meanings ("abstreiken — to finish / copy / detach strike", "verstreiken"). Now it lists only verbs **from the verb list** built on the same base verb, each with its real English/Tamil meaning and prefix badge (stehen → bestehen 🛡️, verstehen 🛡️, entstehen 🛡️, aufstehen 🚀, zustehen 🚀 …); if there is none it says so. The invented "-bar / -end" adjectives ("streikbar", "to strike/be on strikeing") are replaced by the Partizip I, which exists for every verb.
- Generated sentences for verbs without a curated entry were ungrammatical ("Wir haben gestern gestreikt können", "when you hat gestreikt", separable Präteritum labelled Präsens) — a regex written as `\\s` never matched. Now: "Ich möchte heute streiken." · "Gestern habe ich gestreikt." · "Er streikte früher oft." (separable particle at the end: "Er erkannte früher oft an.", reflexive: "Ich möchte mich heute bemühen."). The Perfekt multiple-choice distractor had the same regex bug.
- Known data issue, not changed: the verb list contains `befotografieren` and `verfotografieren`, marked in their own English as "uncertain - not a standard dictionary word".

#### Testing
6 verbs (no prefix, untrennbar, trennbar, reflexive, double prefix, -ieren): prefix row, family, grammar hook, sentences and situations checked; UI reveal in a live session; screenshots at phone width; prefix suite, audio suite, `build.py` pass.

---

### 2026-09-25 (Task 35) — Auto-Audio switch, English/Tamil → Deutsch default, dark mode fix, Übersetzer page

#### Task
User: "1. In flash card always audio enabled. We need option to disable it. And also by default english/tamil to german. 2. Sometime dark mode not applying correctly 3. We need global translation page for word or sentence. If word need the details about the word which used in answer for existing and sentence to translate. And also implement the AI for ask related to word/sentence or give questions for practice".

#### What changed
**1. Flashcard audio + direction**
- **🔊 Auto-Audio An / 🔇 Aus** button in the session bar of the home flashcards and the Verb, Nomen and Adjektiv trainers (`dcAudioToggleHTML` / `dcSetAutoAudio` in `js/app-shell.js`, key `de_auto_audio`, shared with the Einstellungen checkbox). Switching off also turns off the tense auto-read and stops speech in progress. The 🔊 buttons on the card still play on demand.
- Default direction is **English/Tamil → Deutsch**: home `dc_cardDir` defaults to `en2de` (button "EN·TA→DE"); trainers default to `en2de` and now remember the choice (`vt_curDir`, `na_curDir`, `adj_curDir`).
- On meaning → Deutsch cards (and fill-the-gap) the German word is the answer, so auto-audio now reads it **after reveal**, not when the card appears (before, audio gave the answer away).
- Home cards show Tamil next to English (primary language from the EN/TA toggle): `js/tamil-meanings.js` (1,333 meanings from the master lists) fills `ta` at load — 1,465 of 2,934 cards now have Tamil.
- Bugs fixed on the way: the German word was missing from the home answer box since an older commit (`f9f17d6`) — restored with its article; progressive hints on EN→DE cards hinted the English word instead of the German one; EN→DE recall cards were recorded as `recall_de2en`.

**2. Dark mode**
- `js/app-shell.js` is the single source of truth: `dcSetTheme` sets every marker the pages use (`data-theme`, `.dark`, `.dark-theme` on `<html>` and `<body>`, `color-scheme`), switches the pages' `prefers-color-scheme` CSS rules to follow the app choice (not the OS), and follows pages' own toggles.
- **Contrast guard**: text that ends up the same colour as its background is given a readable colour (re-judged after colour transitions and theme changes; never starves on busy pages).
- **Surface guard** (dark mode only): hard-coded white/pastel cards (A1/B1 exam simulator phrase cards, A2/B1 Studio tense rows, Continuous Verb Speaker player, KI Coach bubbles, inputs …) get a dark surface of the same tint; saturated badges/buttons and "active" chips are left alone; everything is restored on switching to light.
- `css/design-system.css`: brighter der/die/das colours in dark mode.
- Audit: 0 unreadable elements on all pages in 4 scenarios (OS light/dark × app light/dark), 0 after live toggling.

**3. Übersetzer & Wort-Explorer (`Uebersetzer.html`)** — sidebar link "Übersetzer" on every page, card on the start page, "🌐 Alle Details" link in every home answer box, deep link `Uebersetzer.html?q=…`.
- **Word** (German, English or Tamil, also any form: *ging*, *Häuser*, *besser*, *schönen*, *stehe*): everything the app knows — article/plural, Präteritum/Perfekt/Nomen/Typ, full Präsens table (`js/german-conjugation.js`), Steigerung, Wortaufbau with Tamil + prefix type (`MemoryTips.partsHTML`), Merkhilfen (`MemoryTips.cheatCodes`), example + note from the home card, level, frequency rank, word family; 🔊 for every form. Unknown words get "Meintest du …?" suggestions.
- **Sentence**: word-for-word help from the app data (separable verbs recognised: *Ich stehe um 7 Uhr auf* → aufstehen, "auf" = Verbzusatz), and with AI a full translation (German / English / Tamil + grammar notes, labelled as AI).
- **KI fragen**: chat about the word/sentence (quick questions: meaning & use, grammar, similar words, mnemonic / explain sentence, is it correct, other ways to say it, pronunciation); the app's data for the word is given to the AI as facts.
- **Üben**: practice questions from the app data (always available: meaning, EN→DE, article, plural, Präteritum, hat/ist, Partizip, Präsens, Komparativ, gap-fill) or created by the AI (JSON quiz, validated, labelled as AI); multiple choice + typed answers with checking.
- `dcCallAI(messages)` / `dcAIConfigured()` in `js/app-shell.js`: chat call for every provider of the settings page (deepseek, openai, groq, gemini, openrouter, ollama).
- Data: `scripts/build_lexicon.py` generates `js/lexicon.js` (2,797 entries: master lists + home-card examples/notes/phrases) and `js/tamil-meanings.js`; nothing is invented. `build.py` runs `build_lexicon.py --check`; both files are in the offline cache.

#### Testing
Contrast audit (all pages × 4 theme scenarios) + live-toggle test (8 pages) + surface restore; audio suite (speech spy: nothing spoken before reveal on EN→DE, German word after reveal, off = silent incl. tense read, setting survives reload, trainers default en2de with the switch); translator suite (13 queries: base forms, verb/noun/adjective forms, declined adjective, English, Tamil, phrase, German and English sentences, typo, unknown) + mocked-AI suite (chat with context, JSON quiz incl. dropping an invalid question, answer checking, sentence translation); mobile width without horizontal scroll; earlier suites (tips, parts, prefix, B1), 27-page sweep without errors, `build.py` (8 checks) pass.

#### Files Changed
- `Uebersetzer.html` (new), `scripts/build_lexicon.py` (new), `js/lexicon.js` + `js/tamil-meanings.js` (generated)
- `js/app-shell.js`, `css/design-system.css`, `scripts/build.py`, `sw.js`
- `deutsch-coach.html`, `Verb_Transformation_Trainer.html`, `Nomen_Trainer.html`, `Adjektiv_Adverb_Trainer.html`, `Einstellungen_Setup.html`, `index.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-25 (Task 34) — B1.1 and B1.2 merged into B1

#### Task
User: "I can see b1.1 and b1.2 and also b1. Better keep b1. Remove the b1.1 and 1.2 list".

#### What changed
- Levels are now **A1 · A2 · B1 · B2 · C1** everywhere (home level bar, dashboard, learning path, Nomen and Adjektiv trainer chips, Excel level chips). No word was removed: the textbook words ("Auf jeden Fall!" B1.1 + B1.2) are part of B1 (home: B1 = 1,407 cards; Nomen trainer: B1 = 513 nouns).
- Word lists: `scripts/merge_b1.py` moved the 358 B1.1/B1.2 nouns to `level: "B1"` in every copy (Nomen trainer, Excel, Master Grid) and keeps the textbook part as **`srcLevel`**. `build.py` runs `merge_b1.py --check`.
- **Saved progress is untouched**: the Nomen/Adjektiv trainers key progress as `n|<level>|<word>` — they now use `srcLevel || level`, so all 1,089 keys are byte-identical to before (tested against the previous commit). Home cards keep their old id (`B1.1|behoerden|Anmeldung`) via `uidBase` while showing level B1; the learning path still puts the textbook words first, then the master-list words by frequency.
- Home: B1 exam readiness and the "Gemischte Prüfungsrunde" now use B1; default level for a topic is B1; outdated "App has only B1.1/B1.2" texts removed; subtitle "A1 · A2 · B1 · B2 · C1".
- Source names like "Auf jeden Fall! B1.1/B1.2" (book titles) and `progress-aggregator.js` (which already folds old B1.1/B1.2 data into B1) were left as they are.

#### Testing
New suite (11 checks): no B1.1/B1.2 in level bars/chips/data on home, Nomen, Adjektiv, Excel, Master Grid; B1 contains the textbook words; Anmeldung keeps its id; Nomen progress keys identical to the previous commit; B1 learning path starts with textbook words; exam drill uses B1. All earlier suites (level list updated), 26-page sweep, `build.py` (7 checks) pass.

#### Files Changed
- `scripts/merge_b1.py` (new), `scripts/build.py`, `sw.js`
- `deutsch-coach.html`, `Nomen_Trainer.html`, `Adjektiv_Adverb_Trainer.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-25 (Task 33) — Prefix type (untrennbar / trennbar) on every page + Excel prefix filter

#### Task
User: "Inseparable Prefix add in wherever it's page even excel also. In excel need filter Inseparable Prefix (start, end, contain)." — plus "do the best match for the project and also easy for learning".

#### One checked classification for every word
`js/word-parts.js` now has a 3rd field per word: its prefixes with type — **u** untrennbar (be-, ge-, er-, ver-, zer-, ent-, emp-, miss-), **t** trennbar (an-, auf-, ab-…), **d** doppelt (über-, unter-, um-, durch-… when not decided by a verb), **x** word-building prefix (un-, ur-, Haupt-…). Verbs are decided by their own forms (`MemoryTips.prefixTypes`): *stand auf* → auf- trennbar, *besucht* (no ge-) → be- untrennbar, *anerkennen* → an- trennbar + er- untrennbar; verbs whose forms show no prefix get none (*gehen, antworten, beten*). Nouns/adjectives take the prefix from their Wortaufbau (*Verkäufer* → ver- untrennbar, *Abtreibung* → ab- trennbar). 231 verbs untrennbar, 208 trennbar; 116 nouns/adjectives with an untrennbar prefix. *miss-* is now recognised in nouns (Missverständnis, Missgeschick).

#### Shown everywhere a word is shown
Shared renderer `MemoryTips.prefixBadgeHTML` / `prefixBadgesFor` (badge "🛡️ be- untrennbar" / "🚀 an- trennbar" / "🔀 um- doppelt", with the rule in English + Tamil in the Wortaufbau block):
- Home card back, Verb / Nomen / Adjektiv trainers (inside the Wortaufbau block).
- **Verben Hören** and **Thema-Sprechtrainer** verb cards (new badge).
- **Continuous Verb Speaker**: card shows the Wortaufbau + badge instead of its old prefix/root guess (which split *gehen* into ge + hen); new "🛡️ Inseparable (Untrennbar)" chip; the "Trennbar" chip now uses the checked type (it used "Präteritum has a space", which counted *führte zu*).
- **Master Grid**: `isTrennbar`/`isUntrennbar` used "starts with an/be…" (gehen = untrennbar, antworten = trennbar) — now the checked type; badges name the prefix; new "🔒 Untrennbare Verben (229)" filter.
- **Excel sheet**: new column "🛡️ Präfix (trennbar / untrennbar)" next to the word (badges; exported as text, e.g. "an- trennbar, er- untrennbar"), new preset "Präfixe lernen", and a new filter row **"🛡️ Präfix / Wortteil"**: *beginnt mit / endet mit / enthält* + text (matched on the bare word, no article / "sich"), a prefix-type dropdown (untrennbar / trennbar / doppelt / Wortbildung / ohne Präfix), and one-click chips for the 8 untrennbar prefixes with counts. With *beginnt mit* + a type, the text must be the classified prefix itself, so "be" + untrennbar finds *besuchen* but not *beten*, "ge" finds *gehören/gefallen* but not *gehen/geben*. "Filter zurücksetzen" clears it.

#### Testing
New suite (21 checks): chips + counts, ge-/be- chips exclude gehen/beten, start/end/contains, trennbar-only, ohne Präfix, column text for anerkennen, reset; Master Grid classification + filter; Continuous Verb Speaker chips; badges on Verben Hören, Thema, home (verbs and nouns), Nomen data; zero page errors. All earlier suites, 26-page sweep, `node --check`, `build.py` pass.

#### Files Changed
- `js/memory-tips.js`, `js/word-parts.js` (regenerated), `scripts/build_word_parts.py`, `scripts/word_parts_meanings.tsv`, `sw.js`
- `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html`, `Continuous_Verb_Speaker.html`, `Verben_Hoeren_EN_DE.html`, `Thema_Sprech_Trainer.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-25 (Task 32) — Tamil for every word part, reviewed root meanings, and 207 wrong Tamil values fixed

#### Task
User: "Also show Tamil meaning for each part. And also fix the open issue" (open issue from Task 31: some root meanings were Ding side senses, e.g. *reichen* "to hold out", *werben* "to court").

#### Tamil for each part
- Every part of every word now shows Tamil next to the English (home card back, Verb / Nomen / Adjektiv trainers, Excel "Wortaufbau" column): *Ab·trei·bung — ab- (away, off, down · விலகி, கீழே) + treiben (to drive, to push · செலுத்து / தள்ளு) + -ung (turns a verb into a noun · வினையிலிருந்து பெயர்ச்சொல்)*.
- Roots: new **`scripts/word_parts_meanings.tsv`** — a reviewed English meaning + Tamil for all ~880 root words used as parts. Prefixes (≈60), suffixes (≈30) and linking letters: Tamil tables in `js/memory-tips.js` (`PREFIX_TA`, `SUFFIX_TA`). The Tamil is an AI-assisted translation (Claude), reviewed; the page says so under every breakdown ("Tamil for the parts: AI-assisted translation, reviewed.").
- `build_word_parts.py` fails if a root has no line in the TSV or a prefix/suffix lacks English or Tamil, so coverage stays at 100 %.

#### Open issue fixed: reviewed meanings for every root
The same TSV replaces the automatically picked Ding glosses for all roots (*reichen* → to reach; to hand; to be enough, *werben* → to advertise; to recruit, *füllen* → to fill, *Weh* → pain, ache — Ding had a vulgar slang sense, *Kohl*, *Ober*, *Wirt* …). Also fixed while reviewing: *wichtig/topisch/offenbar* are no longer split into Wicht/Top/Off; *fort-/ober-/innen-/außen-* are prefixes (Fortschritt, Obergrenze, Innenstadt); linking *-n-* is tried before *-en-* (Kohle|n|stoff, not Kohl 'cabbage'); *-tum* can attach to verbs (Wachs|tum = wachsen); among Ding roots the more frequent word wins (Lade|säule = laden, not Lade 'drawer'); placeholder words (etw.) and Ding meanings are no longer used for words inside verb phrases; six hand-checked splits (Aussage, Umzugskarton, Bohrplattform, fotografieren, einsam, Alleingang). Syllables are now hyphenated per compound segment (Fort·schritt, Fa·mi·li·en·na·me instead of Forts·chritt, Fa·mi·li·enna·me).

#### Wrong Tamil in the word lists (found while doing this)
The `ta` field of the master lists had been filled by matching English **substrings**: send/extend/referendum/defendant/customer-friendly/dependent → முடி ("end" = finish); change/exchange → தொங்கு ("hang"); parents' house/accused/employee → பயன்படுத்து ("use"); breathable/meat-free/weatherproof → சாப்பிடு ("eat"); planet/power plant → திட்டமிடு ("plan"); verstehen → நில் ("stand"); wiederholen → சாப்பிடு; Diät → இற ("die"); unbezahlt → "paid"; eventuell → "maybe / never". All 1,333 existing Tamil values were reviewed: **207 were wrong** (86 verbs, 77 nouns, 44 adjectives) and are corrected in the canonical lists and every copy (793 edits in 7 pages) by **`scripts/fix_tamil.py`**, which also regenerates `ta_translit` (ISO 15919, the style most entries use). `build.py` runs `fix_tamil.py --check`.

#### Still open
~1,700 list entries have no Tamil at all (157 verbs, 566 nouns, 425 adjectives — the flashcards show English only for them); Tamil elsewhere (sister verbs, A1 mnemonics, tamil-dict.js) was not part of this review; the list Tamil is not labelled as AI-generated in the UI (its origin predates this session).

#### Testing
Word-parts suite extended to 27 checks (Tamil on every part of every word, AI note shown, reviewed meanings, corrected list Tamil + regenerated transliteration in the Verb and Nomen trainers, Excel text with Tamil). Task 29/30 suites, 26-page sweep, `node --check`, `build.py` (now 6 checks) all pass.

#### Files Changed
- `scripts/word_parts_meanings.tsv` (new), `scripts/fix_tamil.py` (new), `scripts/build_word_parts.py`, `scripts/build.py`, `js/memory-tips.js`, `js/word-parts.js` (regenerated), `sw.js`
- Word lists (Tamil): `Verb_Transformation_Trainer.html`, `Nomen_Trainer.html`, `Adjektiv_Adverb_Trainer.html`, `Continuous_Verb_Speaker.html`, `Verben_Hoeren_EN_DE.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-25 (Task 31) — Wortaufbau: syllables + meaningful parts for every word

#### Task
User: "I need this for all words. Eg: Abtreibung … Ab·trei·bung · Related parts: ab- (away, off), treiben (to drive, to push, to drift), -ung (noun-forming suffix …)".

#### What every word now shows
A "🧩 Wortaufbau" block: the syllables (*Ab·trei·bung*) and, where the word is built from smaller words, each part with its meaning — prefix (*ab-* away, off, down), root word (*treiben* do, chase; to drive), suffix (*-ung* turns a verb into a noun), linking letters (*Wettbewerb + -s- + fähig + -keit*), related word (*Kauf* ← *kaufen*, *gebraucht* ← *brauchen*). Words that aren't built from parts say "Grundwort" (*Hund*); phrases get syllables only.
Shown on: home card back (all 2,934 cards), Verb trainer, Nomen trainer, Adjektiv trainer, Excel sheet (new column "🧩 Wortaufbau (Silben + Teile)", searchable, exported, in the Verben/Nomen presets). 2,786 distinct words; 1,380 split into parts.

#### How it's built (no guessing)
- **Syllables**: `pyphen` with the LibreOffice de_DE hyphenation patterns (standard settings; a consonant left alone by the patterns is merged back, "Ge·brauchs·taug·lich·keit").
- **Parts**: `MemoryTips.wordParts()` (js/memory-tips.js). A split is made only when the root is a real word: first the app's own ~3,000 words (their learner meaning is used), then a root dictionary from **Ding** (TU Chemnitz, GPL-2+, Debian/Ubuntu package `trans-de-en` 1.9-7) limited to the 50k most frequent German words (`scripts/ding_roots.py`). The suffix must fit the word: *-ung* → a die-noun from a verb, *-er* → a der-noun from a verb (common verbs only), *-heit/-keit* → from an adjective, *-chen* → das, *-in* → plural *-innen*, *-lich/-ig/-bar/-los…* → adjectives. Prefixes on verbs are confirmed by the Präteritum/Partizip where the app has them. Compounds need the last part to have the same article.
- **Meanings of roots**: the app meaning, plus Ding's main sense when it adds something. Ding senses are chosen by how often a meaning recurs across the word's entries (main senses repeat; "hindern → to embarrass" appears once), rare English words and names last.
- Guards found by reviewing random samples: closest spelling first (*nötig* = Not + -ig, not Note), exact word/verb stem before "+e" variants (*Sehnsucht* = sehnen + Sucht, not Sehne), verb-stem heads ≥ 4 letters (*Gebrauch* ≠ geb(en) + Rauch), inside compounds a noun stays a noun (*Stadtteil* = Stadt + Teil), an adjective's last part can't be a suffix (*furchtbar* ≠ Furcht + bar 'cash'), and a short list of false etymologies (*Mädchen, Zucker, Bürger, Messer…*).
- Precomputed by **`scripts/build_word_parts.py`** into **`js/word-parts.js`** (154 KB, generated — do not edit; cached offline via sw.js); `build.py` runs `--check` and fails if the word lists changed without regenerating.

#### Known limits
Some Ding glosses are still a secondary sense (e.g. *reichen* "to hold out", *werben* "to court"); a split shows the parts' literal meanings, which can differ from the whole word's meaning. Words whose root is neither in the app nor among common Ding words stay "Grundwort".

#### Testing
New suite (19 checks): every home card / Verb / Nomen / Adjektiv trainer word has Wortaufbau data; exact expected splits for Abtreibung, Krankenhaus, Wettbewerbsfähigkeit, Lehrer, Umweltschutz, nötig, Sehnsucht, aufstehen; Hund/Zucker stay whole; card back shows meanings; phrases without "Grundwort"; Excel column filled for all rows; no page errors. Task 29/30 suites, 26-page sweep, `node --check`, `build.py` all pass.

#### Files Changed
- `js/memory-tips.js` (Wortaufbau engine + renderer), `js/word-parts.js` (new, generated), `scripts/build_word_parts.py` (new), `scripts/ding_roots.py` (new), `scripts/build.py`, `sw.js`
- `deutsch-coach.html`, `Verb_Transformation_Trainer.html`, `Nomen_Trainer.html`, `Adjektiv_Adverb_Trainer.html`, `Deutsch_Wortschatz_Excel_Sheet.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-25 (Task 30) — Memory tips checked for every word, and a learning path for every level

#### Task
User: "1. We have german learning tips for each. Now you can check all are existing and if need add good learning how information for keep it memory. 2. Make it Learning and practice for all level are update easy for learning".

#### Audit: tips were missing for some words and wrong for many
The "cheat codes" / "linguistics" boxes on the home card back (and copies in `Verb_Transformation_Trainer.html` and `Adjektiv_Adverb_Trainer.html`) guessed from spelling only. Checked against the real forms of the 721 verbs / 1,089 nouns:
- "Inseparable prefix, never takes ge-" fired on any verb starting with be/ge/er/ver…: 12 of 203 were wrong (*gehen* = ge + hen, *geben*, *gelten*, *beten*, *ernten*, *beugen*; *beilegen*/*beitragen* read as be- instead of separable bei-).
- "Separable prefix" fired on 165 verbs, 23 wrong (*antworten* = an + tworten, *absolvieren*; *zurückfahren* shown as zu-, *vorbeigehen* as vor-, *auseinandersetzen* as aus-).
- "Diphthong Scanner — verbs with -ei-/-ie- are 99% STRONG" fired on 162 verbs; **90 of them are regular** (*spielen, lieben, arbeiten, zeigen, reisen, meinen, mieten, heiraten…*).
- "100% feminine suffix" (-in/-ei/-ur/-ik…) was wrong for 12 nouns (*das Ei, der Termin, der Wein, der Verein, der Tanz, der Streik, der Ursprung*); "100% neuter" (-um/-ma/-ment…) for 10 of 20 (*der Baum, der Raum, die Firma, der Moment, der Kuchen*).
- Noun plural "defaults" ignored the stored plural (*das Angebot* told "monosyllabic neuter → -er + umlaut", real plural *Angebote*); the sein-auxiliary list matched by word ending (*bekommen* ⊃ kommen); compound splitting accepted any "starts with" match; the -ieren rule called itself "100%" (*verlieren* ends in -ieren).
- Coverage: 138 home cards had no tip at all (e.g. *Hund*), 577 new nouns had no mnemonic.

#### New: `js/memory-tips.js` — every tip is checked against the word's own data
- **Verbs**: separable only if the Präteritum shows the particle at the end (*stand auf*, also multi-particle *stellte wieder her*); inseparable only if the participle has no extra ge- (*besucht*; *gehen → gegangen* is excluded); "built on *suchen*" only when the root is a real verb. Vowel melody from Infinitiv/Präteritum/Partizip (*ei → ie → ie*) with the most frequent verbs of the same pattern as anchors (*schreiben – bleiben – steigen*); mixed verbs; regular verbs that *look* strong flagged as a trap (*zeigen – zeigte*); extra -e- (*arbeitete*); -ieren without ge- (only if the participle confirms it); sein/haben from the stored Perfekt; Präsens vowel change / irregular Präsens from the conjugation engine; fixed partner prepositions.
- **Nouns**: gender-ending rule quoted with its **real hit rate in this list** (*-ung → die: 187 of 190*), only for endings with ≥5 words and ≥75 %; a noun that breaks it gets an **"Ausnahme!"** tip instead (*der Junge, das Auge, der Käse*); nominalised adjectives (*der/die Deutsche, ein Deutscher*); n-Deklination (*den Kollegen*); compound "last word is the boss" only when the last part is a real noun with the same article and the first part a real word (*krank + -en- + Haus*; *Enthaltung* is not Ente + Haltung); plural pattern from the stored plural with same-pattern nouns.
- **Adjectives**: Steigerung pattern from the stored forms (umlaut / -e- drops / irregular / regular, extra -e- in *am ältesten*) with same-pattern adjectives; un- opposites when the base is a real adjective; word building (*Arbeit + -los*, *essen + -bar*) only with a real base word (a few misleading derivations excluded).
- Prepositions: Akkusativ (DOGFU), Dativ, and two-way (Wo?/Wohin?) rules. A plain learning-technique tip is the fallback only when a card has neither a curated mnemonic nor a checked tip.
- Wired in: home card back (`getCheatCodesForWord` / `analyzeGermanLinguistics` now delegate to it; the prefix/compound table no longer repeats in the tip list), Verb trainer, Adjektiv trainer (its "dunkel: regular" rule now says *dunkler*), Excel "Merkhilfe" column (curated trick + up to two tips; the old placeholder "Stem "arbeit..." → to work" / "Plural: -e" is gone).

#### Missing forms filled from the master lists (`scripts/fill_home_forms.py`)
Textbook/A1 home cards lacked forms the canonical lists have: 182 Präteritum/Perfekt (*entscheiden, bleiben…*), 190 articles/plurals (A1 starter nouns had no article at all: *Junge* → der, *Jungen*), 216 comparison forms (textbook adjectives now show "Steigerung" on the card). Only empty fields, exact word match; idempotent; `--check` runs in `build.py`. These cards now also get verb-tense and plural quizzes. The A1 shorthand plurals ("-n", "-se") are expanded for the tips, and a bare "-" there counts as unknown (it means both "die Zimmer" and "no plural").

#### Engine bug fixed (Präsens)
`js/german-conjugation.js` matched stem-change verbs by ending: *schalten → er schält*, *ausschalten → hält aus*, *beauftragen → beaufträgt*, *veranlassen → veranlässt*. A weak "-te" Präteritum now disables the stem-change table (Excel sheet and Thema trainer).

#### Part 2 — learning and practice for all levels (home)
- **Lernpfad**: every level (A1–C1, and per word type) is split into packs of 20 in learning order — textbook words in book order, then master-list words most frequent first. Each pack shows "x/20 gelernt" (learned = answered correctly once); "▶ Weiter: Paket N" continues with the first unfinished pack; "Alle" shows the path per level. B1/B2/C1 (no topics) previously only had Smart Learn.
- Smart Learn now introduces new words in the same order (most frequent first) instead of randomly.
- Topic tiles only for topics with words at that level. Sprechen/Schreiben at B1/B2/C1 offered no topics — now every topic, word bank from the topic's words; new B2 (opinion + counter-argument) and C1 (short talk / Erörterung with Pro/Contra) prompts.
- Outdated footer ("A1 has only one example word") corrected.

#### Testing
- New suite (38 checks): every one of 2,934 cards has a mnemonic or checked tip; no fake prefix splits (gehen, antworten, beten…); correct sep/insep for aufstehen/besuchen; vowel melody + anchors; no "99%/100%" claims anywhere; Angebot/Junge/Wohnung/Krankenhaus/Enthaltung; filled forms; Lernpfad for all 7 levels, pack sessions, progress counting, frequency order; C1 Sprechen; Verb/Adjektiv trainers; Excel Merkhilfe for all 2,481 rows; Präsens fix in Excel + Thema; zero page errors.
- Task 29 suite re-run (all uids unchanged), 26-page sweep clean, all inline scripts `node --check`, `build.py` (now also caches `german-conjugation.js` + `memory-tips.js` in `sw.js` — the former was missing, so it failed offline).

#### Files Changed
- `js/memory-tips.js` (new), `js/german-conjugation.js`, `scripts/fill_home_forms.py` (new), `scripts/build.py`, `sw.js`
- `deutsch-coach.html`, `Verb_Transformation_Trainer.html`, `Adjektiv_Adverb_Trainer.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, `Thema_Sprech_Trainer.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

#### Still open
30 A1 starter nouns and ~200 textbook nouns are not in the master noun list, so they have no plural data (their tip is the curated mnemonic or the article-chunk technique). C1 words are all rarer than the top-50k frequency list, so within C1 the path is alphabetical.

---

### 2026-09-24 (Task 29) — Words updated in every page and every form

#### Task
User: "Make sure words are updated in all form." Covered both readings: every page that shows words has all of them with the same data, and every grammatical form shown is real.

#### Every page now has every word (it didn't)
Audit of every page that carries its own word list found three pages never received the words added in Tasks 24–26:
- **`deutsch-coach.html` (home flashcards / spaced repetition — the main learning page)** lacked 209 verbs, 577 nouns and 565 adjectives, including basics like *Familie, lang, kurz, mögen, dürfen*. Added them as one `SYNCED_WORDS` block (1,351 cards; deck 1,583 → 2,934) built from the canonical lists: nouns with article + plural, verbs with Präteritum/Perfekt, adjectives with Steigerung in the mnemonic line. Noun topics mapped to the home topic set where there's a clear equivalent (Alltag→Behörden & Alltag, Körper→Gesundheit, Kleidung→Einkaufen), otherwise left without a topic. **Card uids**: appended after every existing list, and the new cards get a level-independent uid (`M|cat|word`, via a new optional `uidBase`) — verified that all 1,583 existing uids are byte-identical, so saved review progress is untouched, and a later change to a frequency-estimated level can't orphan progress either. Note: the app counts never-seen cards as due/new, so these appear as new words.
- **`Continuous_Verb_Speaker.html`** had 503 of 721 verbs, and its overlapping entries were the stale "your own list" copies of the 41 duplicate verbs removed in Task 25 (e.g. *bleiben* A2 "stay"). Its other 462 entries were identical to the canonical list, so it now holds the canonical 721.
- **`Thema_Sprech_Trainer.html`** had 540 verbs in a hand-written literal whose fields all matched the canonical data (0 differences), regenerated as the canonical 721 (same fields). This list feeds its "Häufige Wörter (A1/A2/B1/B2)" themes; they now list verbs **most frequent first**, and there's a new "Seltenere Wörter (C1)" theme.
- The three pages synced in Task 25 still held the **stale versions of the same 41 verbs** (append-only sync never touched existing entries) — found by a field-by-field comparison, which also confirmed no copy held any data the canonical lists lack. Replaced with the canonical entries.
- **Guard against this recurring**: new `scripts/check_vocab_sync.py` compares every copy field-by-field with its canonical list (Verb_Transformation_Trainer / Nomen_Trainer / Adjektiv_Adverb_Trainer) and checks the home deck has every word; it exits 1 on any drift and now runs inside `scripts/build.py`. Run against the previous commit it reports every gap listed above; it passes now.

#### Frequency levels in every page (not just the Excel sheet)
- `scripts/build_freq_ranks.py` now writes `freq` (rank) into every entry of every word list in the app, and for entries without a textbook level `level` + `levelEst: true` (1,300 words: 154 verbs, 496 nouns, 650 adjectives — identical in every copy). The Excel sheet reads these fields; its private `FREQ_RANK` map is gone. Re-run the script after adding words; `check_vocab_sync.py` will flag copies that weren't updated.
- Level filters extended where estimates introduced new values: C1 in Verb_Transformation_Trainer, Verben_Hören, Continuous_Verb_Speaker (which also lacked B2); B1 and C1 in Nomen_Trainer (its chips were B1.1/B1.2 only); B1/B2/C1 in the home level bar, dashboard progress rows and topic-default order. Estimated levels show "≈" wherever a single word's level is displayed (verb trainer pills, Verben Hören, home card meta). Stale "503 verbs" labels updated.

#### Only real grammatical forms (Excel sheet) + a shared conjugation engine
- The Excel sheet generated verb forms from every word's stem: nouns got "Präteritum/Perfekt/Präsens/Verb/Adjektiv" (*acht* → "hat geacht", "achthaft, achtlos"), adjectives got "die Dunkelheit / -keit", "erdunkelen", every verb got "<stem>bar / <stem>end" adjectives, and sister verbs were invented by gluing prefixes onto roots ("belernen"). Now: nouns show only article/plural (or "(kein Plural)"), adjectives only their Steigerung, verbs only curated word-family adjectives and curated sister verbs (14 verbs have them); everything else shows "—".
- Its Präsens column was stem + "t" (*arbeiten* → "arbeitt", *fahren* → "fahrt", *aufstehen* → "aufsteht"). Moved `Thema_Sprech_Trainer.html`'s Präsens engine (irregular tables, 45 stem-changing bases matched by suffix, d/t-epenthesis, separable prefix + "sich" from the Präteritum field) unchanged into **`js/german-conjugation.js`**, loaded by both pages. Verified by regenerating all 12,978 Thema sentences (721 verbs × 6 persons × 3 tenses) before/after: byte-identical.
- **Bug fixed in that engine** (pre-existing in Thema): for the 9 "verb + preposition" entries it conjugated the preposition — "Er zt zu" (*führen zu*), "Er aut auf", "Er füt sich", "Er (ugs.t weg", "Er etwt". It now strips a trailing governed preposition/"etw."/"(note)" first → "Er führt zu", "achtet auf", "engagiert sich", "schmeißt weg", "denkt nach". Perfekt sentences now bold the participle, not the trailing preposition. Only those 9 verbs' sentences changed.

#### Testing
- `scripts/check_vocab_sync.py` (in `build.py`): in sync — VERBS 721, NOUNS 1089, ADJS 671 across all copies; home deck has every word.
- Cross-page Playwright suite (41 checks): home deck size, all old uids unchanged, new uids unique, sample words present with correct article/plural/tenses, B1/B2/C1 levels, ≈ on cards; Excel Präsens for gehen/arbeiten/fahren/aufstehen/sich bemühen/führen zu/sein/nachdenken über, no invented forms for nouns/adjectives, every sister verb curated; C1 filters on all verb pages and Nomen; Thema themes and fixed sentences; zero page errors.
- Earlier Excel suites (read-aloud, column chooser) re-run and passing; full-site sweep clean; `sw.js` regenerated.

#### Files Changed
- `deutsch-coach.html`, `Continuous_Verb_Speaker.html`, `Thema_Sprech_Trainer.html`, `Verb_Transformation_Trainer.html`, `Verben_Hoeren_EN_DE.html`, `Nomen_Trainer.html`, `Adjektiv_Adverb_Trainer.html`, `Wortschatz_Master_Grid.html`, `Deutsch_Wortschatz_Excel_Sheet.html`
- `js/german-conjugation.js` (new), `scripts/check_vocab_sync.py` (new), `scripts/build_freq_ranks.py`, `scripts/build.py`, `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-24 (Task 28) — Excel sheet: levels from real word frequency, and read-aloud (one row / all rows)

#### Task
User: "Try it innovative way too. Category those word based on frequency of using. If more frequency A1 like that. Audio reading option also mostly for verb, past tense. Read current line and also option for read all one by one."

#### Frequency → level (estimated, marked ≈)
- **Source**: `hermitdave/FrequencyWords`, OpenSubtitles 2018, German top-50,000 word forms with counts (https://github.com/hermitdave/FrequencyWords, content **CC-BY-SA-4.0**; attribution in the page source and here). It is film/TV subtitle German, i.e. everyday spoken language — news/political vocabulary ranks lower than a newspaper corpus would put it.
- The list counts *word forms*, so `scripts/build_freq_ranks.py` sums each entry's real forms from our data (verb: infinitive + Präteritum + participle, skipping split separable Präteritum; noun: singular + plural; adjective: base + -e/-en/-er/-es/-em + comparative + superlative) and converts the total to the position it would take in the 50k list. Phrase entries ("fertig sein", "führen zu", "sich bemühen") ignore their own preposition/"sich" and are capped at their rarest content word — **found by testing**: the first version ranked "führen zu" and "achten auf" as the most common verbs in German because it was counting the prepositions *zu*/*auf*.
- Result is embedded as `FREQ_RANK` (2,481 entries; 1,995 in the top 50k, 486 rarer). Re-run `python3 scripts/build_freq_ranks.py` after adding words (entries missing from `FREQ_RANK` show "—" and level "?").
- **Cut-offs** calibrated against the 1,181 words that have a textbook level: A1 ≤ 1,000, A2 ≤ 2,000, B1 ≤ 15,000, B2 ≤ 50,000, rarer = C1. Agreement with textbook levels: **82.4% same level or one off, 45.8% exact** — frequency can't separate A1 from A2 (both are equally common in speech). So it is an estimate, and is labelled as one.
- **Textbook levels are never overwritten.** Only the 1,300 words with no level get an estimate (A1 48, A2 48, B1 474, B2 339, C1 391), shown as "≈B1" with a tooltip giving the rank. Level filter gained C1 and a "≈ geschätzte" checkbox (untick → estimates go back to "Ohne Level"). New "📊 Häufigkeit" column (5-bar indicator + rank), sortable numerically, exported as "Haeufigkeit Rang".
- Not propagated to the trainer pages' data (`Nomen_Trainer.html` etc.) — still an open option.

#### Read aloud
- **▶ on every row** reads that line; the row is highlighted and the cell being spoken is outlined. Only real data is read: verb = Infinitiv · Präteritum · Perfekt (e.g. "gehen · ging · ist gegangen"), noun = "der Hund · die Hunde", adjective = "dunkel · dunkler · am dunkelsten" (never the stem-generated helper columns).
- **🎧 Vorlesen bar**: ▶ Alle vorlesen (reads the visible rows in the current filter + sort order, starting at the selected row; becomes ⏸ Pause / ▶ Weiter), ⏮ ⏭ ⏹, mode (all three forms / Infinitiv·Präteritum / Infinitiv·Perfekt / word only), "+ Englisch" (meaning in an English voice), tempo, repeat 1–3×, live status "Zeile 3 / 721 · sagen", Escape stops. Settings saved per browser.
- **🔥 Häufigste Verben hören**: one click → verbs only, sorted most-frequent first, "Verben hören" column layout, starts reading (sein · war · ist gewesen, haben · hatte · hat gehabt, sagen …).
- Implementation notes: one utterance at a time chained on `onend`, with a length-based watchdog (some browsers drop `onend`); a token invalidates stale callbacks on pause/skip/stop; pause = cancel + resume replays the interrupted part (more reliable than `speechSynthesis.pause()` on Android); filter/sort changes stop a read-through since row positions change. The page's voice dropdown is respected.
- **Bug fixed**: `speakWord()` used `/^[•·s]+/` instead of `\s`, stripping leading letter **s** — "sein" was spoken as "ein", "sechs" as "echs". Its bracket-stripping regex was also malformed.

#### Testing
- `node --check` clean.
- New 42-check Playwright suite with a recording stand-in for `speechSynthesis` (headless Chromium has no voices): estimates present/marked/untouched textbook levels; rank sort numeric with sein/haben first; C1 chip; estimate toggle; exact texts spoken for verb/noun/adjective rows in every mode, with English, repeat 2×, tempo; highlight on/off; read-all order matches the table; pause really stops; resume continues at the interrupted part; ⏭/⏮; filter change stops; start from selected row; Stopp; Escape; 🔥 quick action; export column; phone width and tap. Passed twice in a row.
- Column-chooser suite (Task 27) updated for the new column and still passes; full-site sweep clean; `sw.js` regenerated.

#### Files Changed
- `Deutsch_Wortschatz_Excel_Sheet.html`
- `scripts/build_freq_ranks.py` (new)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-24 (Task 27) — Excel sheet: choose columns + their order, and real filters

#### Task
User: "We have excel. Need option for which are field to me display and where are position. Filter also need" — on `Deutsch_Wortschatz_Excel_Sheet.html`.

#### What existed and was broken
- A "👁️ Spalten wählen" modal only set `style.display='none'` on the cells present at click time. `renderTable()` rebuilds `<tbody>` on every sort/filter/search, so **hidden columns reappeared on the next interaction**. Nothing was saved, there was no way to reorder, and CSV/TSV export always wrote all 17 fields in a fixed order.
- The Level filter chips were hard-coded `A1/A2/B1/B2`, but nouns use `B1.1`/`B1.2` (358 nouns never matched the "B1" chip) and 1,300 rows have level `?` (no chip at all).
- The row builder invented values: missing levels became `A1`/`A2` (e.g. 225 adjectives from the *Einfach gut! B1* and *Auf jeden Fall!* textbooks were shown as "A1"), and every verb/adjective got topic "Alltag".

#### What was built
- **Column chooser ("🧩 Spalten & Reihenfolge")**: every column has a checkbox (show/hide), a drag handle (desktop drag-and-drop) and ▲/▼ buttons (work on touch). Presets: Standard, Verben lernen, Nomen lernen, Adjektive, Kompakt. "Alle anzeigen", "Zurücksetzen". The last visible column can't be hidden. Closes on Fertig/✕/Escape/click outside (capture-phase listener, because row 🔊 buttons call `stopPropagation()`; uses `composedPath()` because ▲/▼ re-render the list mid-click).
- The table is now driven by one `COLUMN_DEFS` array (label, cell renderer, export labels/values). Header (letter row A,B,C… + label row) is generated from the visible columns in the chosen order; body cells follow the same order. Layout is saved in `localStorage` (`excel_sheet_columns_v1`, try/catch-wrapped — a per-browser convenience, falls back to defaults), merged against `COLUMN_DEFS` so added/removed columns in future don't break saved layouts.
- **Export CSV / Copy for Excel now write exactly the visible columns in the chosen order** (Tamil column exports as two fields: meaning + transliteration).
- **Filters**: Level chips generated with counts (B1 includes B1.1/B1.2; new "Ohne Level"); new Thema dropdown (built from data, with counts and "Ohne Thema"); new "🔽 Spaltenfilter" row with a text filter under every visible column (combines with all other filters; Tamil filter also matches transliteration; the header isn't re-rendered while typing, so focus is kept); "✖ Filter zurücksetzen" clears everything.
- Row builder no longer invents levels/topics: unknown level shows `?`, missing topic shows `—`.
- Robustness: cell text is HTML-escaped; 🔊 buttons read the word from the row by index instead of inlining it in `onclick` (a word with an apostrophe used to break the handler); the empty-state message spans the visible column count.
- **Phone layout fix (pre-existing, but it made the new button untappable)**: the shared `.app-main`/`.app-content` flex items defaulted to `min-width:auto`, so the ~2,265px table pushed the whole page to 1,200px wide on a 375px phone, cutting off the ribbon and filters. Added `min-width:0` for this page only, so the table scrolls inside its own frame.

#### Correction to my own earlier work (Task 24 Phase 4 / Task 26)
Phase 4 gave all 496 new nouns `topic: "gesellschaft"` and Task 26 gave the 70 rescued nouns `topic: "alltag"`, justified as "topic is unused". That was true for `Nomen_Trainer.html`, but **this Excel page displays `topic` as "Thema"** — so a duck (`Ente`) and a cup (`Tasse`) were labelled "Gesellschaft", and a Thema filter would have made that worse. Checked which pages read the nouns' `topic` (only this one), then cleared those 566 placeholder values to `""` in all three `NOUNS` copies (`Nomen_Trainer.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html`). They now show "—" / "Ohne Thema" instead of a wrong category. Real categorisation of those 566 nouns is still open.

#### Known issue, flagged not fixed (RESOLVED in a later task: nouns/adjectives now show "—" for verb-only fields)
For nouns and adjectives the row builder **generates verb-style fields from the word stem** — e.g. Präteritum "achtte"/Perfekt "hat geacht" for the number *acht*, "achthaft, achtlos, achtreich" as its adjective forms, and similar fake Präsens/Verb/Sister-Verb values. These are not real German. Pre-existing and out of scope for this task, but now that users choose which fields to see it matters more; the "Nomen lernen"/"Adjektive" presets avoid those columns.

#### Testing
- `node --check` on every script block.
- 42-check Playwright suite with real clicks/typing/dragging: default layout; hide via checkbox (header + body stay aligned); ▲ move; drag-and-drop to first position; persistence across reload; presets; last-column lock; reset; Escape and click-outside close; export headers + actual downloaded CSV header match the visible order; Level B1 = B1+B1.1+B1.2, "Ohne Level"; Thema filter; column filter keeps focus while typing and combines with chips; Tamil filter matches transliteration; reset restores all 2,481 rows; empty-state colspan; phone (375px): page width 375, chooser fits on screen, ▲ works by tap; zero page errors. Screenshots checked for desktop, phone and dark mode.
- Full-site sweep: 26 pages, zero page errors. `sw.js` regenerated.

#### Files Changed
- `Deutsch_Wortschatz_Excel_Sheet.html` (column chooser, filters, export, phone layout, topic/level honesty)
- `Nomen_Trainer.html`, `Wortschatz_Master_Grid.html` (566 placeholder noun topics cleared — data only)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 26) — Fixed the remaining open item from Task 25: 99 non-adjective entries contaminating the `ADJS` array turned out to be 73 genuinely missing words, now correctly homed

#### Task
User said "Try to fix the open" after Task 25 explicitly flagged but didn't fix one issue: 99 entries (7 tagged `cat:'v'`, 92 tagged `cat:'n'`) sitting inside the `ADJS` array of both `Deutsch_Wortschatz_Excel_Sheet.html` and `Wortschatz_Master_Grid.html`, identical in both files (confirmed pre-dating this session).

#### What the 99 contaminants actually were
Each contaminant had only `{w, en, cat}` - no grammar data at all, meaning they weren't ever properly added anywhere; they'd been captured (word + gloss) and mis-filed into `ADJS` instead of `VERBS`/`NOUNS`. Checked each of the 99 against both files' own `VERBS`/`NOUNS` arrays by exact key match before deciding anything:
- **21 already existed correctly elsewhere** (`sein`, `werden`, `waschen`, `Kaffee`, `Schuh`, `Computer`, etc.) - safe to just delete from `ADJS`, no data lost.
- **73 were genuinely missing everywhere** - not just from `ADJS` (where they never belonged) but from the real `VERBS`/`NOUNS` arrays too, in every file in the project, including the canonical `Verb_Transformation_Trainer.html` and `Nomen_Trainer.html`. These are all basic, unambiguous A1 vocabulary (`Hund`=dog, `Baum`=tree, `Brief`=letter, `entschuldigen`=to apologize, `gucken`=to look, etc.), so reconstructing their grammar data from general knowledge carried the same low risk as similar reconstruction in Phases 3/4, just at native-speaker-obvious confidence rather than needing care.

Of the 73, 3 needed a judgment call rather than a straight add:
- `Beamte`, `Jugendliche`, `Verwandte` are nominalized adjectives with **ambiguous der/die gender** (`der/die Beamte` = "the official," gender depends on the person) - the `NOUNS` schema has one `a` field per entry and can't represent this, same policy as Phase 4. Deleted from `ADJS`, not added to `NOUNS`.
- `es gibt` is just the impersonal use of `geben` (which already exists in `VERBS`) - deleted from `ADJS`, no separate `VERBS` entry needed.
- That leaves 70 nouns + 3 verbs (`entschuldigen`, `gucken`, `wehtun`) genuinely added.

#### Fix
1. Removed all 99 `cat:'v'`/`cat:'n'` entries from `ADJS` in both `Deutsch_Wortschatz_Excel_Sheet.html` and `Wortschatz_Master_Grid.html` - this alone brought both files' `ADJS` down from 770 to exactly 671, matching `Adjektiv_Adverb_Trainer.html` precisely (no unique content was lost; the count match confirms these two pages now hold exactly the same adjective set as the canonical source).
2. Added the 3 rescued verbs and 70 rescued nouns to **every page that carries `VERBS`/`NOUNS`** - not just the two pages where the contamination was found. Checked first and confirmed all 73 were missing from `Verb_Transformation_Trainer.html`/`Nomen_Trainer.html` (the canonical sources) too, so adding them only to the two already-fixed pages would have created a new version of the exact sync gap Task 25 just closed. `level: "A1"` (unlike the B2-media-sourced Phase 2-4 additions, these are unambiguously basic vocabulary by inspection), `source` field discloses the reconstruction (contamination bug origin, grammar data supplied from general knowledge not sourced), Tamil fields left empty per the established graceful-degradation policy.
3. Updated every hardcoded word-count label across `Wortschatz_Master_Grid.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, and `Verben_Hoeren_EN_DE.html` again (same set of labels touched in Task 25, now reflecting the corrected totals).

New sitewide totals, consistent across every page that carries each array: **VERBS 721, ADJS 671, NOUNS 1089**.

#### Testing
- Syntax-checked (`node --check`) on all 5 touched files - clean.
- Headless-browser (Playwright) test suite: confirmed the exact expected count on every page for every array it carries; confirmed zero `cat:'v'`/`cat:'n'` contaminants remain in `ADJS` on both previously-contaminated pages; confirmed `wehtun` (a rescued verb) has correct `perfekt`/`praeteritum` on all 4 `VERBS`-carrying pages and `es gibt` was correctly *not* added anywhere; confirmed `Hund` (a rescued noun) has correct `a`/`pl`/`typ` on all 3 `NOUNS`-carrying pages and `Beamte` was correctly *not* added anywhere.
- Full-site smoke sweep (26 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Verb_Transformation_Trainer.html` (VERBS: 718 → 721)
- `Verben_Hoeren_EN_DE.html` (VERBS: 718 → 721, count labels updated)
- `Nomen_Trainer.html` (NOUNS: 1019 → 1089)
- `Deutsch_Wortschatz_Excel_Sheet.html` (ADJS: 770 → 671, VERBS: 718 → 721, NOUNS: 1019 → 1089, count labels updated)
- `Wortschatz_Master_Grid.html` (ADJS: 770 → 671, VERBS: 718 → 721, NOUNS: 1019 → 1089, count labels updated)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 25) — Fixed the two data-integrity issues flagged at the end of Phase 3: the multi-page sync gap and the 41 duplicate verb infinitives; found and partly fixed two more along the way

#### Task
User said "Fix those" in response to the two issues flagged after Phase 4 (and originally surfaced after Phase 3): (1) `VERBS`/`ADJS`/`NOUNS` are duplicated as page-local JS arrays across multiple files with no shared module, and 3 pages had drifted behind the richer trainer pages; (2) 41 pre-existing duplicate infinitives in the live `VERBS` array (`haben`, `gehen`, `kommen`, ... each appearing twice).

#### Fix 1: the 41 duplicate infinitives (`Verb_Transformation_Trainer.html`)
Every one of the 41 pairs followed the exact same shape: one entry tagged `source: "General A1 Vocabulary"` and a second, later-appended entry tagged `source: "your own list"` for the identical infinitive. Verified before touching anything: `perfekt` and `praeteritum` were byte-identical across every single pair (41/41) - the two entries were never in factual conflict, just redundant. The two entries differed only in cosmetic/vestigial fields (`en` phrasing "to go" vs "go", `level` A1 vs A2, `icon` - confirmed in Phase 3 that `icon` isn't rendered anywhere in this file), the mnemonic `noun` field (different but equally valid alternative choices), and in 3 cases the grammatical `typ` classification disagreed between the pair: `haben` (strong vs weak - neither correct; standard German grammar classifies it as a mixed verb alongside `kennen`/`bringen`/`denken`, so fixed to `mixed` while merging), `wollen` and `sollen` (mixed vs weak - `mixed` was already correct on the kept entry, since modal verbs are conventionally mixed). Kept the earlier (`General A1 Vocabulary`) entry in all 41 cases, dropped the duplicate. 759 -> 718 entries.

#### Fix 2: the multi-page sync gap
Confirmed via `grep -l 'const VERBS/ADJS/NOUNS = \['` which pages actually duplicate each array, and that `Adjektiv_Adverb_Trainer.html`'s empty `NOUNS = []` and `Nomen_Trainer.html`'s empty `ADJS = []` are harmless dead stubs left over from the Task 22 page split (zero entries, not a real gap). The real duplication:
- `VERBS`: `Deutsch_Wortschatz_Excel_Sheet.html`, `Verben_Hoeren_EN_DE.html`, `Wortschatz_Master_Grid.html` (all stuck at 564) vs. `Verb_Transformation_Trainer.html` (718 after Fix 1).
- `ADJS`: `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html` (345) vs. `Adjektiv_Adverb_Trainer.html` (671).
- `NOUNS`: `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html` (523) vs. `Nomen_Trainer.html` (1019).

Followed the same **append-only** approach the prior sync fix (commit `cf3269a`) established, rather than a wholesale array replace: for each lagging page, added only the entries missing by unique key (`inf`/`w`/`sg`) from the richest source, leaving every entry the lagging page already had untouched. This mattered in practice - checked each target file's actual field usage before syncing rather than assuming identical schemas, and found `Wortschatz_Master_Grid.html` reads `a.comp` for adjectives **with no fallback to `a.komp`** (unlike `Deutsch_Wortschatz_Excel_Sheet.html`, which does `a.comp || a.komp || ...`) - so every newly-appended adjective entry across both files was given a `comp` field (duplicate of `komp`) to match, not just the richer source's own `cat`/`komp` schema. Confirmed via `grep` that `NOUNS`/`VERBS`' field sets already matched exactly, no transform needed there. Result: `VERBS` 564->718 (all 3 pages, +154 each), `ADJS` 345->770 (both pages, +425 each - more than the richest source's 671 total, because these two pages' original 345 already contained some adjectives not present in `Adjektiv_Adverb_Trainer.html` itself, which the append-only approach correctly preserved rather than discarding), `NOUNS` 523->1019 (both pages, +496 each, exactly matching Phase 4's growth since these pages' original 523 was an exact subset of `Nomen_Trainer.html`'s pre-Phase-4 baseline).

Also updated every hardcoded word-count label found across these pages that isn't recalculated by JS at runtime (checked each one for a `.textContent =` assignment before deciding to hand-edit vs. leave alone): `Wortschatz_Master_Grid.html`'s hero subtitle and its "Alle/Nur Verben/Nur Nomen/Nur Adjektive" filter-button labels, `Deutsch_Wortschatz_Excel_Sheet.html`'s stats badge and filter-chip labels, `Verben_Hoeren_EN_DE.html`'s subtitle and "All (n)" filter button. Left `statusRowInfo`/`resultsCount`/`progressLabel` alone since those are genuinely recalculated on every render (verified each one's update call).

#### Found in the process, and partly fixed: a pre-existing `comp` field gap on `ADJS` (fixed) and non-adjective contamination in the same array (flagged, not fixed)
While syncing `ADJS`, found that 324 of the pre-sync 345 entries in both `Deutsch_Wortschatz_Excel_Sheet.html` and `Wortschatz_Master_Grid.html` had no `comp` field at all (only some had it, e.g. `dunkel`/`teuer` did, most didn't) - a pre-existing gap predating this session, invisible on `Deutsch_Wortschatz_Excel_Sheet.html` (which falls back to `komp`) but silently blanking the comparative on `Wortschatz_Master_Grid.html` (no fallback). Backfilled `comp = komp` for every entry that had one but was missing the other (225 of the 324, in both files).

The remaining 99 (324-225) had neither `comp` nor `komp` - because they are **not adjectives at all**: 7 verbs and 92 nouns (`{'w':'sein','en':'to be','cat':'v'}`, `{'w':'Freund','en':'friend','cat':'n'}`, etc.) sitting inside the `ADJS` array in both files, tagged with `cat: 'v'`/`cat: 'n'` - a pre-existing contamination bug distinct from and unrelated to the `comp` gap, confirmed identical (same 99 words) in both files so it predates this session rather than being introduced by this fix. **Not fixed** - triaging 99 misplaced entries (deciding whether each belongs in `VERBS`/`NOUNS` instead, checking for duplicates against those arrays, etc.) is the same kind of careful per-word work as the vocabulary-audit phases and is a separate task from what was asked here; flagging it rather than rushing a fix or silently leaving it undocumented.

#### Testing
- Syntax-checked (`node --check`) on all 4 touched files - clean.
- Headless-browser (Playwright) test suite: `Verb_Transformation_Trainer.html` VERBS is exactly 718 with zero duplicate infinitives and `haben` correctly reclassified to `mixed`; all 3 synced pages report the correct new counts (718/770/1019 as applicable); every genuine adjective entry (contaminants excluded) has both `komp` and `comp` on `Deutsch_Wortschatz_Excel_Sheet.html` and `comp` specifically on `Wortschatz_Master_Grid.html`; `Verben_Hoeren_EN_DE.html`'s dynamically-rendered `progressLabel` correctly reflects 718 after render.
- Full-site smoke sweep (26 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Verb_Transformation_Trainer.html` (VERBS: 759 → 718, deduplicated)
- `Deutsch_Wortschatz_Excel_Sheet.html` (VERBS 564→718, ADJS 345→770, NOUNS 523→1019, `comp` backfilled, count labels updated)
- `Verben_Hoeren_EN_DE.html` (VERBS 564→718, count labels updated)
- `Wortschatz_Master_Grid.html` (VERBS 564→718, ADJS 345→770, NOUNS 523→1019, `comp` backfilled, count labels updated)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 24, Phase 4 of a multi-phase vocabulary audit) — 496 new nouns from the second source, gender/plural supplied from grammar knowledge (source has none); PDF source's remaining nouns/verbs dropped per user instruction

#### Task
Final planned slice of the second source (`magdalena-trivina/goethe-zertifikat-b2-wortliste`): the 562 noun candidates, no gender or plural data anywhere in the source. The user also said to drop Phase 1's PDF source's remaining nouns (857) and verbs (331) entirely ("Ignore the pdf. Only focus on git csv") - those are no longer part of this audit's remaining scope.

#### Triage (562 raw candidates -> 496 new nouns)
Same shape as the verb batch, applied to nouns:
- **Plural forms captured as if they were the singular/dictionary form** (the largest category, ~140 entries): `Abmachungen`->`Abmachung`, `Ansätze`->`Ansatz`, `Beschwerden`->`Beschwerde`, `Bodenschätze`->`Bodenschatz`, `Vorschriften`->`Vorschrift`, and well over a hundred more - corrected to the singular before assigning gender/plural, same de-inflection principle as the adjective batches.
- **Verbs/adjectives/adverbs mistaken for nouns**: infinitives (`Beten`, `Ebnen`, `Kapieren`, `Loben`, `Teilnehmen`, `Verraten`, `Übertreiben`, 8 more), conjugated forms (`Bewundere` = "I admire"), adjectives (`Ausgelastet`, `Erheblich`, `Spürbar`, `Untersagt`, `Verfügbar`, 6 more), adverbs (`Massenhaft`, `Zudem`).
- **Proper nouns / place names**, out of scope for a general-vocabulary gender/plural trainer: `Estland`, `Lettland`, `Venedig`, `Nahost`, `Bundeswehr`.
- **Nominalized adjectives with ambiguous der/die gender** (`der Verbündete` / `die Verbündete` = "the ally", same word either gender depending on the person's sex) - the app's noun schema has one `a` (article) field per entry, so these can't be represented without picking a gender that would be wrong half the time. Dropped rather than force a choice: `Alleinstehende`, `Beauftragte`, `Böswillige`, `Gravierende`, `Verschleppten`, `Wehrpflichtigen`, and the informal `Azubis`.
- **Plural-only nouns (plurale tantum) or narrow multi-word/hyphenated compounds too awkward for a singular/plural schema**: `Aktiva`/`Passiva` (Latin-derived accounting plurals with no true singular), `Masern` (measles), `Belange`, `Anschaffungskosten`, `Haushaltsmittel`, `Bundesmittel`, `Streitkräften`, `Reisestrapazen`, `Einkünfte`, `Herz-Kreislauf-Erkrankungen`, `Ost-West-Gefälle`.
- **Typos corrected rather than dropped** (unlike the ambiguous cases above, these had one clear intended word): `Begrabnis`->`Begräbnis`, `Schiedrichter`->`Schiedsrichter`, `Stadttel`->`Stadtteil`, `Bogenschiessen`->`Bogenschießen`, `Arbeitsengtgelt`->`Arbeitsentgelt`, `Eignungtests`->`Eignungstests`, `Gipfels`(genitive)->`Gipfel`.
- **A few dropped as too obscure/low-confidence to be worth the risk of a wrong entry**: `Ablenkungskampf`, `Bräsigkeit` (rare Northern German regional word), `Fahrradkolonne`, `Frontverlauf`, `Schufa-Bescheinigung` (a specific German credit agency's brand-name certificate), `Binnenschiffen` (garbled beyond confident repair), `Ansprechpartnerinnen` (gendered plural form, skipped for schema simplicity), `Erachtens` (only exists in the fixed phrase "meines Erachtens").
- 501 candidates survived triage. Cross-checked against the live 523-entry `NOUNS` array and found **5 already present** (`Gemeinde`, `Lücke`, `Schritt`, `Solaranlage`, `Subvention` - again, several only matched because de-inflection fixed the surface form first). Dropped those, leaving **496 genuinely new nouns**.

#### Gender, plural, and plural-type: supplied from grammar knowledge, not the source (disclosed)
The source has no `a` (article/gender), `pl` (plural), or `typ` (plural-formation pattern) for any entry - just a German word and an English gloss. All three were supplied from general German-grammar knowledge for all 496 nouns, the same honesty model used for the adjectives' comparative/superlative and the verbs' principal parts. `typ` was assigned by the same classification the live data already uses (`e`, `en`, `er`, `s`, `umlaut`, `umlaut_only`, `unchanged`) based on how each noun's actual plural differs from its singular. For genuinely uncountable/no-natural-plural abstract nouns (`Abwehr`, `Zuversicht`, `Ehrgeiz`, and ~90 more), used the em dash (`—`) the live data already uses for this case (confirmed against the existing number-word and color entries, which use the same convention) rather than fabricate an unnatural plural.

#### Two fields left low-effort on purpose (confirmed unused, unlike the equivalent adjective/verb fields)
Checked how `Nomen_Trainer.html` actually renders `NOUNS` entries before deciding how much effort each field deserved: `topic` and `icon` are present in every existing entry but are **not referenced anywhere** in the page's filtering or rendering code (`grep` for `.topic` and `ICON_SVGS` inside this file returns nothing - filtering here is actually by `level` and `typ`, not `topic`, unlike the similarly-named `ADJ_CATEGORIES` mechanism on the adjectives page). Given they have zero functional effect today, gave every new entry the same default (`topic: "gesellschaft"`, `icon: "abstract"`) rather than spend per-word effort on a dimension the app doesn't use, and left `level: "?"` as usual.

#### Testing
- Syntax-checked (`node --check`) - clean.
- Headless-browser (Playwright) test suite: entry count exactly 523+496=1019; every entry has `sg`/`en`/a valid article/`pl`/a valid `typ`; **zero duplicate singular nouns** in the merged array (unlike the verbs phase, `NOUNS` had no pre-existing duplicate contamination to account for); spot-checked gender/plural/typ on several new entries (`Abschluss`->der/Abschlüsse/umlaut, `Beschwerde`->die/Beschwerden/en, `Gerücht`->das/Gerüchte/e, `Kiefer`->der/Kiefer/unchanged, `Abkehr`->die/—/unchanged); explicitly confirmed none of the excluded verb/adjective/adverb/proper-noun/plural-only/dual-gender contaminants leaked in; all three `practiceMode`s render with the expanded dataset in `nomen` mode.
- Full-site smoke sweep (26 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Status of this vocabulary-coverage audit after this phase
This closes out the second source (`magdalena-trivina/goethe-zertifikat-b2-wortliste`): adjectives (Phase 2, 265), verbs (Phase 3, 154), nouns (Phase 4, 496) are all done. Per the user's explicit instruction this phase, the first source's (`Hazrat-Ali9/Deutschland-Vocabulary-A1-B2`) remaining nouns (857 candidates) and verbs (331 candidates) are **out of scope going forward**, not merely deferred.

Still open and unrelated to either vocabulary source (carried over from Phase 3, not touched this phase either):
- The multi-page `VERBS`/`ADJS`/`NOUNS` duplication gap (`Deutsch_Wortschatz_Excel_Sheet.html`, `Verben_Hoeren_EN_DE.html`, `Wortschatz_Master_Grid.html` still carry the pre-Phase-1/2/3 counts) - flagged twice now, still the user's call.
- 41 pre-existing duplicate infinitives in the live `VERBS` array - flagged, not fixed.

#### Files Changed
- `Nomen_Trainer.html` (NOUNS: 523 → 1019)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 24, Phase 3 of a multi-phase vocabulary audit) — 154 new verbs from the second source, with principal parts supplied from grammar knowledge (source has none)

#### Task
Continuation of the audit onto the second source's (`magdalena-trivina/goethe-zertifikat-b2-wortliste`) two remaining slices: 562 noun candidates (no gender data at all) and 245 verb candidates (no principal parts at all). Given the user's request to "map and align the full methodology" onto both, and that this is materially riskier than the adjectives batch (gender and principal parts don't exist anywhere in the source and have to come from general German-grammar knowledge, not from the source), I asked the user how to pace it; they chose **verbs first, full rigor**, nouns to follow as a separate phase.

#### Triage (same shape as the adjective batches, applied to 245 raw verb candidates)
The raw candidate list had the same contamination pattern as the adjectives, plus new ones specific to verbs:
- **Inflected/conjugated forms mistaken for infinitives**: past participles (`abgerissen`→`abreißen`, `angeklungen`→`anklingen`, `überwunden`→`überwinden`, `versprochen`→`versprechen`, 20+ more), preterite forms (`berichteten`→`berichten`, `erwähnten`→`erwähnen`, `verweilten`→`verweilen`), a `zu`-infinitive (`vorzubeugen`→`vorbeugen`).
- **Adjectives/participles-used-as-adjectives mistaken for verbs** (the largest category, ~35 entries): `abschüssigen` (sloping), `altehrwürdigen` (venerable), `angehenden` (prospective), `gewaltsamen` (violent), `umstritten` (controversial), `vollkommen` (perfect/complete), etc. - dropped, these belong to the adjective slice (or were already covered there) if anywhere, not this one.
- **Nouns mistaken for verbs** (~25 entries), mostly plural nouns that happen to end in a verb-like `-en`: `anschuldigungen` (accusations), `drittstaaten` (third countries), `gräueltaten` (atrocities), `insassen` (inmates), `knochen` (bone), `sklaven` (slaves), etc.
- **Adverbs/pronouns mistaken for verbs**: `diejenigen` (those), `stattdessen`/`unterdessen`/`währenddessen` (meanwhile), `notgedrungen` (out of necessity), `ungern` (reluctantly).
- **A literal duplicate typo**: `rechfertigen` sitting right next to the correctly-spelled `rechtfertigen` two rows later - dropped the typo.
- **Genuinely ambiguous words where the source's own English gloss revealed which reading was captured**, resolved by trusting the gloss over the German spelling: `verfahren` glossed "Procedure" (capitalized, noun reading of *das Verfahren*, not the verb) - dropped; `bescheiden` glossed "modest" (the adjective, not the rare formal verb) - dropped; `gehoben` glossed "sophisticated" (adjectival use of *heben*'s participle, not the verb itself) - dropped.
- 161 candidates survived triage as real verb infinitives (after correcting inflected forms back to their dictionary infinitive). Cross-checked against the live 605-entry `VERBS` array and found **7 already present** (`berichten`, `berufen`, `bescheinigen`, `erwähnen`, `scheitern`, `versprechen`, `zusammenstoßen` - several only matched *because* de-inflection/typo-correction fixed the surface form first, same pattern as the adjectives). Dropped those, leaving **154 genuinely new verbs**.

#### Principal parts: supplied from grammar knowledge, not the source (disclosed)
The source is a flat two-column word list - it has no Perfekt, Präteritum, or weak/strong/mixed classification for any entry. For all 154 verbs, `perfekt` (with the correct `haben`/`sein` auxiliary), `praeteritum`, and `typ` were derived from general German-grammar knowledge rather than sourced, the same honesty model already used for the adjectives' comparative/superlative forms. Followed the app's existing separable-verb formatting convention exactly (`perfekt` as one compound word, e.g. `hat abgerissen`; `praeteritum` with the prefix separated, e.g. `riss ab` - confirmed against existing entries like `einkaufen`/`kaufte ein` and `zurückkommen`/`kam zurück`), and the app's existing haben/sein convention for motion verbs (confirmed against `fliegen`/`schwimmen`/`reisen`→`ist`, `tanzen`→`hat`) to pick the right auxiliary for verbs like `flanieren` (→ `ist flaniert`) and `tauchen` (→ `ist getaucht`). Left `level: "?"` and the optional `noun` field empty (the app already renders a graceful nominalized-infinitive fallback when `v.noun` is falsy - confirmed 14 of the existing 605 entries already ship without one).

#### A pre-existing data-architecture issue found, not caused by this phase
This app has no shared data module - `VERBS`/`NOUNS`/`ADJS` are each duplicated as page-local JS literals across multiple files (`grep -l 'const VERBS = \['` matches `Verb_Transformation_Trainer.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, `Verben_Hoeren_EN_DE.html`, `Wortschatz_Master_Grid.html`; the equivalent is true for `ADJS`/`NOUNS`). A prior session in this same project (commit `cf3269a`) already found and fixed one round of this "duplicated page-local copy fell behind a richer source" bug class for NOUNS/ADJS. Checking now: the other 3 verb-array pages are already stuck at 564 entries (41 short of `Verb_Transformation_Trainer.html`'s pre-this-phase count of 605) - a gap that **predates this session** and this phase's 154 new verbs were **only added to `Verb_Transformation_Trainer.html`**, since re-syncing 3 more large duplicated arrays (and the equivalent `ADJS` gap left by Phase 1/2) is a separate decision from "process this source's verbs" - flagged to the user rather than silently expanded into or silently left out of this phase's scope.
- Also found (incidental, not fixed): 41 pre-existing duplicate infinitives in the live `VERBS` array itself (basic A1 verbs like `haben`, `gehen`, `kommen` each appear twice) - confirmed via `git show HEAD:Verb_Transformation_Trainer.html` that these predate this session and this phase's merge introduced zero new duplicates. Not touched, since fixing it means deciding which of two existing entries to keep/merge and is unrelated to this source's extraction.

#### Testing
- Syntax-checked (`node --check`) - clean.
- Headless-browser (Playwright) test suite: entry count exactly 605+154=759; every entry has `inf`/`en`/`perfekt`/`praeteritum`/a valid `typ`; confirmed this merge introduced **zero new duplicate infinitives** (distinguished from the 41 pre-existing ones, which the test explicitly does not flag as a regression); spot-checked several new entries' principal parts (`abreißen`→`hat abgerissen`/`riss ab`/strong, `gelingen`→`ist gelungen`/`gelang`/strong, `umkommen`→`ist umgekommen`/`kam um`/strong, `veranlassen`→`hat veranlasst`/`veranlasste`/weak); explicitly confirmed none of the excluded adjective/noun/adverb/typo/duplicate contaminants leaked in as verb entries; all three `practiceMode`s render with the expanded dataset.
- Full-site smoke sweep (26 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Explicitly NOT done this phase (remaining work, not silently dropped)
- **562 noun candidates from this same source** - next phase, not started (highest remaining risk: gender is not reliably rule-derivable in German and will need the same per-word care as the verbs' principal parts, at over 3x the volume).
- **The multi-page VERBS/ADJS/NOUNS sync gap** described above - flagged, not fixed. Re-syncing `Deutsch_Wortschatz_Excel_Sheet.html`, `Verben_Hoeren_EN_DE.html`, and `Wortschatz_Master_Grid.html` to this phase's 759-entry `VERBS` array (and the other 3 pages carrying `ADJS` to Phase 1/2's 671-entry array) is a real, separate task the user should explicitly decide on.
- The 41 pre-existing duplicate infinitives noted above - flagged, not fixed.
- Nouns and verbs from Phase 1's PDF source (857 and 331 candidates respectively) - still not started.
- No CEFR level assigned to any of the 154 new verbs (left `"?"`, honest given the source isn't exam-verified per word).

#### Files Changed
- `Verb_Transformation_Trainer.html` (VERBS: 605 → 759)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 24, Phase 2 of a multi-phase vocabulary audit) — 265 more adjectives from a second real source, with a heavy de-inflection correction pass

#### Task
Continuation of the vocabulary-coverage audit. The user pointed at a second real GitHub source, `magdalena-trivina/goethe-zertifikat-b2-wortliste` (a CSV vocabulary list the repo says was compiled from real B2-level German media - Easy German Podcast, Tagesschau, Lage der Nation Podcast, Deutschlandfunk), and asked me to extract from it if it looked good. After evaluating scope (512 candidate adjectives, 562 genderless-candidate nouns, 245 verbs with no principal parts), the user chose to process adjectives from this source next.

#### What the source actually is (disclosed, not oversold)
- **Not an official Goethe-Institut word list** despite the repo name - a community CSV compiled by scraping/transcribing real media, explicitly not exam-verified per word. Kept the same honest `level: "?"` policy as Phase 1 rather than claim B2 certification the source itself doesn't claim.
- **Crowdsourced and inconsistently capitalized** - unlike Phase 1's source, nouns in this CSV are not reliably capitalized, so a naive "capitalized = noun" classifier mis-tagged roughly a third of the initial 512 "adjective" candidates as adjectives when they were actually nouns (`adler`=eagle, `ausstrahlung`=charisma, `dschungel`=jungle, etc.).
- **A scattered subset of rows have German/English reversed** (e.g. `autism,autismus` instead of `autismus,autism`) against the source's own stated column order - caught by manual inspection while saving the fetched CSV, not by an automated detector.
- **The most serious problem, found only after generating comparative/superlative forms on the first pass**: because the source captured vocabulary from real sentences in media transcripts rather than as dictionary headwords, a large fraction of the "adjectives" were captured already inflected (e.g. `abgelegene` instead of the dictionary base form `abgelegen`, `bevorstehende` instead of `bevorstehend`, `bewachtes`/`bezahlbares` instead of `bewacht`/`bezahlbar`). Blindly generating `komp`/`sup` on these inflected forms produces doubly-wrong output (e.g. the naive engine turned `bewachtes` into `bewachteser`/`am bewachtesesten`). This can't be fixed with an automatic suffix-strip rule, since real German adjectives legitimately end in bare `-e` (`leise`, `müde`, `böse`) - it required per-word manual correction.

#### Triage pipeline (five passes, each catching a distinct contamination type)
1. Noun-suffix filter (`-ung/-heit/-keit/-schaft/-tum/-nis/-ismus/-tion/-sion/-tät/-ling/-chen/-lein/-sal/-ei/...`) plus a 119-word hand-built manual exclusion list: 512 → 344 confirmed adjective candidates.
2. Verb-form/garbage filter (conjugated forms like `schwankt`, `umfasst`, `zurückwies` mistaken for adjectives, plus one garbage row): 344 → 327.
3. Non-gradable filter (adverbs/quantifiers/absolutes like `fast`, `allein`, `mehrere`, `derzeit`, `zumal` that aren't comparable adjectives even though the source tagged them as such): removed at generation time via a `NOT_GRADABLE` set.
4. **This phase's main work**: went through all 327 remaining candidates individually and (a) corrected ~80 inflected surface forms back to their dictionary base form (`abgelegene`→`abgelegen`, `andersdenkende`→`andersdenkend`, `heikle`→`heikel`, `zartem`→`zart`, etc.), (b) fixed a handful of OCR/typo spellings (`bodenstandlich`→`bodenständig`, `renommmierte`→`renommiert`, `reisserisch`→`reißerisch`, `gelind`→`gelinde`, `ermudend`→`ermüdend`), (c) caught 6 more contaminants the earlier automated passes missed - conjugated verb forms hiding among the "adjectives" (`äußerte`, `besticht`, `durchdreht`, `durchsetzt`, `herrscht`, the bare infinitive `wegschmeißen`) and (d) caught 8 more nouns the capitalization-based filter missed (`einzelfall`, `erbschaftsteuer`, `fördergelder`, `forschende`, `geistlicher`, `getreide`, `sondergesandte`, `verweigerer`), and (e) added 6 more true non-gradable entries to the exclusion set (`angeblich`, `erneut`, `imstande`, `letztendlich`, `stockdunkel`, `tagsüber`) while also correcting a bug in the carried-over exclusion set - `zugig` ("drafty") had been wrongly marked non-gradable, apparently confused with the unrelated word `zügig` ("brisk"); restored it as a normal gradable entry.
5. Regenerated `komp`/`sup` with the same rules engine as Phase 1 (regular suffixation, umlaut list, irregular dict, `-esten` endings for stems ending in d/t/s/ß/z/sch/x) run against the corrected base forms - this alone fixed the double-inflection bug, since it was purely a symptom of feeding inflected input into the generator, not a bug in the generator itself.
6. Cross-checked the resulting 276 candidates against the live 671→406 `ADJS` array by exact base-form match: **11 turned out to already be present** (`angemessen`, `bezahlbar`, `eindeutig`, `entsprechend`, `ernsthaft`, `erstaunlich`, `folgenreich`, `heilig`, `renommiert`, `wesentlich`, `zusätzlich`) - several of these only became visible as duplicates *because* the de-inflection pass fixed the surface form (e.g. the source's `angemessene` would have looked like a new word, but the corrected `angemessen` correctly matches what Phase 1 already added). Dropped these 11, leaving **265 genuinely new adjectives**.
7. Hand-classified all 265 into the existing 13-category taxonomy from Task 22, and also fixed several English glosses that were awkward, mis-capitalized, or in the wrong part of speech (adverb form instead of adjective, e.g. `zunehmend` "increasingly"→"increasing", `zwangsläufig` "inevitably"→"inevitable", `maßgeblich` "significantly"→"significant, decisive").
8. Tagged every new entry's `source` distinctly: `"goethe-zertifikat-b2-wortliste (GitHub: magdalena-trivina, community list compiled from real German media -- Easy German Podcast, Tagesschau, Lage der Nation, Deutschlandfunk; not an official Goethe-Institut source, level not exam-verified)"`, and left `level: "?"` for the same honesty reasons as Phase 1.
9. Confirmed `meaningHTML()`'s graceful Tamil-less degradation still applies - shipped without fabricating Tamil translations.

#### Testing
- Syntax-checked (`node --check`) - clean.
- Headless-browser (Playwright) test suite: entry count exactly 406+265=671; every entry has `komp`/`sup`; every entry has a valid category; no duplicate words in the merged array; spot-checked de-inflected words for correct `komp`/`sup` (`abgelegen`→`abgelegener`/`am abgelegensten`, `heikel`→`heikler`/`am heikelsten`, `zugig`→`zugiger`/`am zugigsten`); explicitly confirmed none of the known-bad inflected surface forms (`abgelegene`, `bewachtes`, `bezahlbares`, etc.) leaked in as separate headwords; explicitly confirmed none of the excluded verb-form/noun contaminants (`besticht`, `herrscht`, `einzelfall`, `getreide`, etc.) leaked in; the newly-populated `wetter` category filter narrows correctly; all three `practiceMode`s render with the expanded dataset.
- Full-site smoke sweep (26 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Explicitly NOT done this phase (remaining work, not silently dropped)
- **Nouns (562 candidates, no gender data at all in the source) and verbs (245 candidates, no participle/Präteritum data)** from this same second source - higher risk than the adjectives were, not started.
- The 67 phrase/idiom-type entries in this source that aren't single-word vocabulary - set aside, not force-classified.
- Nouns and verbs from Phase 1's PDF source (857 and 331 candidates respectively) - still not started.
- No CEFR level assigned to any of the 265 new adjectives (left `"?"`, honest given the source isn't exam-verified per word).

#### Files Changed
- `Adjektiv_Adverb_Trainer.html` (ADJS: 406 → 671)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 24, Phase 1 of a multi-phase vocabulary audit) — 160 new adjectives from a real, cross-referenced source

#### Task
Resumption of the full A1-B2 vocabulary-coverage-audit request from earlier in this session (interrupted twice while scoping it). The user supplied a real source: a GitHub-hosted PDF, `Hazrat-Ali9/Deutschland-Vocabulary-A1-B2` ("Full Vocabulary A1 - B2.pdf", 90 pages, ~2,050 numbered German↔English entries). Unlike telc.net/ankiweb.net (both `EGRESS_BLOCKED` in this environment), `raw.githubusercontent.com` was reachable, and the PDF's raw bytes came back from `WebFetch` intact - `pdftotext` (installed via `apt-get`, which worked despite `apt.launchpad.net` mirrors being blocked) extracted the full text.

#### What the source actually is (disclosed, not oversold)
- **Not an official telc/Goethe list** - a personal/community-compiled GitHub repo. Its own title just says "wichtiger Wortschatz bis zum Niveau B2" (important vocabulary up to B2 level) - no per-word CEFR tag anywhere in the document.
- **Domain-skewed in its later sections** toward healthcare/nursing vocabulary (*Dauerkatheter, Epilepsie, Psychopharmakon, Überleitungsbogen*, "examiniert" as in registered-nurse-qualified) - looks compiled for a Pflegekräfte (nursing) integration-course audience, not general-purpose learner vocabulary.
- **Real transcription/OCR quality issues**: found and had to hand-fix outright errors during processing - obsolete/wrong spellings (`Genoßen`/`Gefloßen` instead of post-1996-reform `genossen`/`geflossen`), garbled unrecognizable strings (`airshaft`, `unmerges`), stray PDF page-number digits glued onto English glosses (`"amazing 58"`), and - most importantly - **already-inflected forms mistaken for base words** (`weicher`/`besser`/`beste` are the comparative/superlative of adjectives *already in the app* - `weich`/`gut` - not new base adjectives; importing them as-is would have created nonsensical double-inflected forms like "besserer").

#### Pipeline built (Python, in the scratchpad - not checked into the app)
1. Parsed all ~2,040 numbered entries (many span wrapped lines in the raw PDF text).
2. Classified each by POS using the entry's own markup (Der/Die/Das prefix → noun with a plural-type hint; a parenthetical participle-looking word next to an *-en/-n* verb → verb; explicit `(adj)`/`(adv)`/`(prep)`/`(conj)`/`(pron)` tags; everything else set aside as `phrase`/`unknown` rather than guessed at). Handled the source's inconsistent field ordering (`verb (participle) - english` *and* `verb - english (participle)` both occur).
3. Cross-referenced every classified word (case/whitespace-normalized) against the live `VERBS`/`NOUNS`/`ADJS` arrays to separate already-covered words from genuine gaps: **331 new-candidate verbs, 857 new-candidate nouns, 197 new-candidate adjectives, 63 adverbs, 1 preposition** (no existing app arrays exist for adverbs/prepositions/conjunctions/pronouns to cross-reference against - noted as a structural gap, not solved this phase).
4. **Phase 1 (this task) processed only the adjective slice** (smallest, and adjectives don't need the plural-type/umlaut guessing nouns would) end-to-end: hand-fixed the typos/garbage/already-inflected entries found above (12 dropped or corrected before generation, 5 more dropped post-generation as duplicates of existing entries once typo-corrected spellings collided with what was already there - down to 162 clean candidates, merged to net +160 after two exact final-stage duplicates), generated `komp`/`sup` with a small rules engine (regular suffixation, a hand-curated short-umlauting-word list for `alt/kalt/warm/...`-type adjectives, a tiny irregular dict for `gut/viel/gern/hoch/nah`, and manual removal of non-gradable entries the source had mistakenly marked as plain adjectives - `fast`/`allein`/`mehrere`/`einzig`), and hand-classified all 162 into the existing 13-category taxonomy from Task 22.
5. Tagged every new entry's `source` field distinctly (`"Deutschland-Vocabulary-A1-B2 (GitHub: Hazrat-Ali9, community list — level not source-tagged)"`) so its different provenance from the textbook-sourced original 246 stays traceable, and left `level: "?"` (unlabeled) rather than guess a CEFR level with no real basis - consistent with how most of the original 246 were already left unlabeled for the same reason.
6. Confirmed the app's `meaningHTML()` already degrades gracefully with no Tamil translation (`v.ta` falsy → falls back to English-only display) - so these 160 new entries ship without Tamil rather than risk fabricating Tamil translations, which was flagged as a real concern before starting.

#### Testing
- Syntax-checked (`node --check`) - clean.
- Headless-browser (Playwright) test suite (11 checks): entry count is exactly 246+160=406; every new entry has `komp`/`sup`/a valid category; **caught a real bug via automated duplicate-detection** (`schlecht`/`unbefristet` collided with existing entries only *after* the typo-fix step renamed `schlect`→`schlecht` and `unbefristete`→`unbefristet`, past the point where the original against-existing-array dedup check had already run) - fixed by re-deduping the final merged array and re-testing; category filter still narrows correctly at the larger size; all three `practiceMode`s (easy/medium/hard) render correctly with the expanded dataset.
- Full-site smoke sweep (26 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Explicitly NOT done this phase (remaining work, not silently dropped)
- **Nouns (857 candidates)** and **verbs (331 candidates)** - the two largest, and structurally harder, slices: nouns need plural-form generation (the source gives only a terse type hint like `(e)`/`(en)`/`(same)`, not the actual inflected plural or umlaut behavior) and verbs need Präteritum generation (the source gives only the participle) - both of these are exactly the kind of "good-faith derivation, not textbook-verified" content the existing adjective komp/sup already models, but at far higher per-word risk (get a plural or a strong-verb Präteritum wrong and it's flatly incorrect, not just "unusual-sounding") and need the same manual-typo/garbage/already-inflected-form triage this phase did for adjectives, at ~5x the volume.
- **Adverbs (63 found)** and **prepositions (1 found)**: this app has no existing array structure for either - adding them means a new content type, not gap-filling an existing one.
- No CEFR level was assigned to any of the 160 new adjectives (left `"?"` - honest given the source doesn't provide it).
- The ~90 entries that didn't cleanly classify into any POS category (full-sentence opinion-phrase collocations like "Meiner Meinung nach...", reflexive-verb formatting variants, a handful of OCR-mangled article prefixes) were set aside entirely, not force-fit.

#### Files Changed
- `Adjektiv_Adverb_Trainer.html` (ADJS: 246 → 406)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 23) — New page: Geschichte_Trainer.html, a storyline-based dialogue trainer

#### Task
"Can you create the page like this https://ankiweb.net/shared/info/1698672280" (a shared AnkiWeb trial deck: "Firetongues German," a storyline course following two characters through a city, sentences in frequency order, native-speaker audio, illustrated cards). The linked page itself couldn't be fetched (network egress to `ankiweb.net` is blocked in this environment), so the user pasted a screenshot instead. Clarified via `AskUserQuestion` that the ask was a genuinely new storyline-based course page (not just reusing the card-layout on existing vocab, not a marketing/landing page).

#### Scoping decisions (disclosed, not silent)
- **Original content, not Firetongues'**: wrote an original 6-scene, 23-line A1 dialogue ("Lektion 1: Ankunft in Hamburg") with two original characters (Lena, arriving in Hamburg; Jonas, a local) — never copied or derived from Firetongues' own characters (Anna & Max) or content, which is a commercial product this project has no license to reproduce.
- **One lesson, not "2,000+ cards"**: the reference page's *full* course is 2,000+ cards; even its own free trial is 464. Shipping a single well-written, correctly-graded lesson now (with the full page architecture in place to add more later) was chosen over rushing a large volume of dialogue at lower quality.
- **Browser TTS, not studio recordings**: audio uses this app's existing shared `speak()`/`speakSequence()` (`js/tts-engine.js`), not human voice actors — stated plainly in the page's own footer rather than implying otherwise.
- **Simple inline-SVG avatars, not illustrated scene art**: no image-generation tool is available in this environment; built small flat-style SVG character avatars (reused per speaker, chat-bubble UI) rather than attempting to fake professional per-scene illustration.

#### What was built
- New page `Geschichte_Trainer.html`, following this app's established single-file conventions (`css/design-system.css`, `js/tts-engine.js`, `js/srs-engine.js`, `js/app-shell.js` for the shared sidebar/nav — no manual suite-hub markup needed, `renderAppShell()` injects it automatically on `DOMContentLoaded`).
- **Story mode**: all 6 scenes render as a scrollable chat-style thread (Lena's lines left-aligned, Jonas's right-aligned, each with a small SVG avatar), with a per-line 🔊 listen button, a per-line EN toggle (hidden by default, so the page reads as German-first), an optional "Formen" grammar note on ~40% of lines (one teaching point per note, not every line), and a "▶️ Play whole scene" button that speaks all of a scene's lines in sequence via `speakSequence()`.
- **Review mode**: a lightweight English→German recall flashcard flow over the same 23 lines, reusing the exact reveal/grade pattern established across this app's other trainers (`revealBtn` → populates answer + Formen note + 🔊 + Nochmal/Gewusst), backed by a new `SRSEngine.Engine('story_progress_v1', null)` progress store — a new, separate key (not reusing `na_progress_v1`/`vt_progress_v1`/etc.), since this is a distinct content set.
- Wired into navigation (`index.html` tools list, `deutsch-coach.html` suite grid).

#### Bug found and fixed during testing
Playwright testing caught a real bug before it shipped: the review-mode "Start Practice" button used `id="startReviewBtn"`, which **collides with an id already used by `js/app-shell.js`'s own injected sidebar button** (`<button id="startReviewBtn" onclick="window.location.href='deutsch-coach.html'">`, added by an earlier task). Since `app-shell.js`'s sidebar is injected into the DOM *before* this page's own content, `document.getElementById('startReviewBtn')` resolved to the *sidebar's* button instead of this page's — clicking "Start Practice" silently navigated away to `deutsch-coach.html` instead of starting a review session. Confirmed via `page.on('framenavigated')` during test debugging (no thrown error, no console error — it looked like the button just "did nothing" from the outside). Fixed by renaming this page's button to the unique `id="startStoryReviewBtn"`; grepped `js/app-shell.js` for its full id list (`closeDrawerBtn`, `menuBtn`, `startReviewBtn`, `themeToggleBtn`) to confirm no other collisions. Other existing trainer pages were already safe — they use `id="startBtn"`, not `startReviewBtn`.

#### Testing
- Syntax-checked all script blocks (`node --check`) — clean.
- Headless-browser (Playwright) test suite (15 checks): all 6 scenes and 23 bubbles render with avatars; EN toggle works; `playLine`/`playScene` speak the correct bare (un-bolded) text via a TTS spy; tab switching shows/hides the right view; Review mode starts, includes all 23 lines, reveals correctly, grades advance the session, progress persists to `story_progress_v1`, and the completion screen appears after finishing; app-shell navigation is present.
- Full-site smoke sweep (26 pages, up from 25): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Geschichte_Trainer.html` (new)
- `index.html`, `deutsch-coach.html` (navigation)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-23 (Task 22) — Split Nomen_Adjektiv_Trainer.html into two pages; adjectives grouped by category

#### Task
"Can you slit noun and adjectives page to two. One of noun and another adjectives(adjectives, adverb). For adjectives group by eg: time, frequency, personality etc..." — split the combined trainer into two standalone pages, and add semantic-category grouping to the adjectives page.

#### Investigation
Used a background Explore agent to map the 2222-line `Nomen_Adjektiv_Trainer.html` before touching it: the `curMode` ('nomen'/'adj') toggle only accounted for ~27-29% of the file (scattered ternaries + a handful of fully mode-specific functions like `analyzeNoun`, `renderNounMemoryHack`/`renderAdjMemoryHack`); the remaining ~70%+ (SRS progress engine, `practiceMode` easy/medium/hard system, swipe-gesture nav, show-answer/auto-read settings, the AI word-help panel, theme toggle, filter-chip mechanics) is mode-agnostic and identical either way. This shaped the approach: rather than surgically deleting every scattered `curMode==='adj' ? X : Y` ternary (high risk of missing one), each new file keeps the full original logic but has `curMode` **permanently fixed** (never user-changeable — the mode-toggle buttons are removed) and has the *other* mode's giant data array (`NOUNS` is ~101KB, `ADJS` ~57KB of the file's raw bytes) emptied to `[]`, so the unreachable branch's code never executes and carries no data weight.

This surfaced a genuine, pre-existing data-quality bug (already flagged in this file's own Known Bugs/Future Work sections but never fixed): of the 345 entries in the original `ADJS` array, **99 (~29%) weren't adjectives at all** — leftover noun/verb vocabulary (e.g. `{"w":"entschuldigen","en":"excuse/apologize","cat":"v"}`, missing `komp`/`sup`/`ta`/`level`/`source`) that silently rode along in the default "alle" filter and would render broken cards. These were dropped during the split rather than carried forward — `Adjektiv_Adverb_Trainer.html` ships exactly the 246 genuine, complete adjective entries.

No existing category/topic field covered adjectives (confirmed: `NOUNS` entries all have a `topic` field, `ADJS` entries never did — only a `source` field naming the textbook chapter of origin, not a semantic grouping) — grouping by time/frequency/personality/etc. had to be built from scratch by hand-classifying all 246 real adjectives.

#### What was built
- **Two new files**, replacing `Nomen_Adjektiv_Trainer.html` (deleted): `Nomen_Trainer.html` (nouns only, `curMode` fixed to `'nomen'`, `ADJS = []`) and `Adjektiv_Adverb_Trainer.html` (adjectives only, `curMode` fixed to `'adj'`, `NOUNS = []`). Both keep the shared `na_progress_v1` localStorage key (the pre-existing `n|`/`a|` uid prefixes already keep the two pages' entries from colliding, exactly as they did within the single combined page before), so no user progress is lost or needs migrating.
- **13-category taxonomy** designed for the 246 real adjectives (Größe & Menge, Zeit & Dauer, Charakter & Persönlichkeit, Gefühle & Emotionen, Aussehen & Zustand, Qualität & Bewertung, Wetter & Temperatur, Gesundheit & Sicherheit, Geschwindigkeit, Technik & Material, Preis & Wirtschaft, Gesellschaft & Kultur, Sonstige) — every entry hand-classified into exactly one category (verified: zero missing, zero invalid category ids) and stored as a new `cat` field. The existing textbook-source filter (`ADJ_SOURCES`, `v.source`) was repurposed into this category filter (`ADJ_CATEGORIES`, `v.cat`) — same chip-filter UI mechanism, new dimension being filtered, filter label changed from "Quelle" to "Kategorie".
- **Adverbs**: did **not** invent a separate adverb vocabulary dataset — fabricating new German words with English/Tamil translations and no source to verify them against would violate this project's standing "never fabricate content" rule. Instead, since German adjectives are used unchanged as adverbs (no separate inflected form, e.g. "schnell" = both "fast" and "quickly"), the same 246-word set now also serves as the adverb set, with a footer note making this explicit for learners rather than silently implying separate content exists. Flagged clearly to the user as a scoping decision, not a silent substitution.
- Updated every live navigation reference (`index.html`, `deutsch-coach.html`, `Deutsch_Wortschatz_Excel_Sheet.html`) from the single old link to two new links; updated an informational comment in `js/progress-aggregator.js`; regenerated `sw.js` (auto-discovers the new/removed files, cache version bump).

#### Testing
- Syntax-checked both new files (`node --check` on every script block) — clean.
- Headless-browser (Playwright) test suite (17 checks): confirmed mode-toggle buttons are gone and `curMode` is permanently fixed per file; `NOUNS`/`ADJS` are populated/emptied correctly in each file; every adjective has a valid category and none of the 99 junk entries survived; the category filter actually narrows the pool (e.g. "zeit" → 21 entries) and the filter chips show category names, not the old textbook-source labels; both pages render a studycard.
- A second deeper pass (10 checks) exercised all 3 `practiceMode`s (easy/medium/hard) on both new files, the medium-mode reveal-button flow, and Next/swipe-style navigation — all working on both pages.
- Full-site smoke sweep (25 pages, up from 24 — net +1 from the 1-file-to-2-file split): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Nomen_Trainer.html` (new)
- `Adjektiv_Adverb_Trainer.html` (new)
- `Nomen_Adjektiv_Trainer.html` (deleted)
- `index.html`, `deutsch-coach.html`, `Deutsch_Wortschatz_Excel_Sheet.html` (navigation updated)
- `js/progress-aggregator.js` (comment accuracy)
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry, plus updates to the file tree, data-structure docs, state/storage tables, Known Bugs, and Future Work sections to reflect the split)

---

### 2026-09-22 (Task 21) — Fix: Nomen_Adjektiv_Trainer.html's auto-audio was a dead no-op

#### Task
Follow-up to Task 20: "In happened in verb / And also nouns & adjectives" - the user confirmed the auto-read issue also affects `Nomen_Adjektiv_Trainer.html` (nouns & adjectives), not just the verb trainer.

#### Root cause
`Verb_Transformation_Trainer.html` had this exact bug and it was fixed in Task 18 - but `Nomen_Adjektiv_Trainer.html` was never checked at the time, since it has no tense data and was out of scope for the auto-read-*tenses* feature specifically. Re-checking it now found the identical latent bug: its "Hands-Free (Auto-Audio)" playback called the **shared** `js/tts-engine.js` `playTTS()` with a word argument - `setTimeout(() => playTTS(v.w || v.inf || v.base || v.sg), 300)` - but that shared function ignores any argument entirely and only reads a `data-audio` attribute off `<body>` that is never set anywhere in this app (confirmed: zero files reference `data-audio`). So every auto-audio call in this file was a complete, silent no-op, for both nouns and adjectives, independent of any TTS-voice-availability issue - a real code bug, not just a device/browser limitation.

#### What was built
- Replaced the dead `setTimeout(() => playTTS(...), 300)` call with `scheduleSpeak(v.w || v.inf || v.base || v.sg, 300)` (kept the existing fallback chain, since this file's `session` array holds both noun-shaped cards, which use `v.sg`, and adjective-shaped cards, which use `v.w` - unlike `Verb_Transformation_Trainer.html`'s homogeneous verb array, this couldn't be simplified to a single field).
- Added the same defensive `else if (cancelPendingSpeech) { cancelPendingSpeech(); }` branch, and a `cancelPendingSpeech()` call at the top of `renderCard()` (before the Easy/Hard mode branch), matching the Task 18 pattern already applied to the other two files - so a still-speaking Flip Card doesn't bleed into a following Easy/Hard card here either.

#### Testing
- Syntax-checked `Nomen_Adjektiv_Trainer.html` (`node --check` on every script block) - clean.
- Headless-browser (Playwright) test with a mocked `speechSynthesis.speak`: confirmed auto-audio now actually calls `speak()` with the correct word for both a noun card (`v.sg`) and an adjective card (`v.w`), fires again after `advance()`/Next, and stays silent when the setting is off - all previously silent no-ops, now working.
- Full-site smoke sweep (24 pages): zero `pageerror` events. Confirmed via grep that the separate der/die/das "Swipe Game" (`startSwipeGame`/`dragStart`/`dragEnd`) remains untouched.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Nomen_Adjektiv_Trainer.html`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 20) — Surface silent TTS failures instead of "nothing happens"

#### Task
"Now auto reading is not happening even flag enabled" - a follow-up bug report on Task 17-19's auto-read-tenses feature.

#### Investigation
Directly verified, with a real (unmocked) `speechSynthesis.speak()` spy in headless Chromium - not internal function calls, but clicking the actual checkbox and calling the actual session-advance functions - that the underlying code is correct: enabling the flag and advancing/swiping through cards **does** call `speechSynthesis.speak()` with the right words in the right order, every time, exactly as designed. So this isn't a logic regression in the auto-read feature itself.

What the same test also revealed: this sandboxed test environment has **no TTS voice backend installed at all**, so every one of those correctly-triggered `speak()` calls fails silently with a `synthesis-failed` error from the browser's Web Speech API - and nothing in the app surfaced that failure anywhere. From a user's perspective, "the code runs but makes no sound" and "the feature is broken" are indistinguishable without some kind of visible error. This exact failure mode - no German (or any) TTS voice available, or the browser blocking synthesis - is a plausible, concrete explanation for "flag enabled, nothing happens," and it was previously invisible everywhere except `Verb_Transformation_Trainer.html`'s dedicated `#voiceWarn` banner (which itself only checks for a *missing German voice specifically*, not a synthesis failure in general, and doesn't exist at all on `deutsch-coach.html` or any other page).

#### What was built
- Added `notifyTTSFailure(errorCode)` to the shared `js/tts-engine.js`: shows a small, auto-dismissing (9s) toast at the bottom of the screen - "🔇 Text-to-speech isn't working on this device/browser (no voice found, or blocked). Auto-read and 🔊 buttons won't produce sound." - plus a `console.warn` with the specific error code for debugging. Debounced with a `ttsErrorNoticeShown` flag so a failed 3-word auto-read sequence (or repeated failures across several cards) shows the toast once, not once per failed word.
- Wired it into `buildUtterance()` (the single utterance-construction helper already shared by `speak()`, `speakSequence()`, and therefore `scheduleSpeak()`/`scheduleSpeakSequence()`) via `u.addEventListener('error', ...)`, so every page that loads `js/tts-engine.js` gets this coverage automatically, with no per-page wiring needed - including `deutsch-coach.html`, which had no failure feedback of any kind before this.
- This is a diagnostic/UX improvement, not a guaranteed fix for this specific report: if the actual cause turns out to be something else (e.g. a stale cached service-worker still serving pre-Task-18 JavaScript in an already-open browser tab - `sw.js`'s cache-first strategy for non-HTML assets like `js/tts-engine.js` means an old cached copy keeps being served until a full reload picks up the newly-installed cache version, though `skipWaiting()`/`clients.claim()` mean a plain refresh should be enough - or a mobile browser's autoplay policy blocking a `speak()` call made from inside a `setTimeout` rather than directly inside a user-gesture handler), the toast at least tells the user *something* failed instead of silence, and the specific error code in the console narrows down which.

#### Testing
- Syntax-checked `js/tts-engine.js` - clean.
- Headless-browser (Playwright) test using the environment's genuine lack of a TTS voice (a real failure, not simulated): confirmed the toast appears with the expected text after a real `synthesis-failed` error, the debounce flag is set, and advancing through 2 more cards (each triggering more failed utterances) does not spawn duplicate/stacked toasts - always exactly one at a time.
- Re-ran the Task 17 auto-read regression suite (17 checks) and the Task 18 overlap-fix reproduction (12 checks) against the current code - all still passing, confirming this change didn't regress the underlying speech-triggering or cancellation logic.
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `js/tts-engine.js`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 19) — Surface flashcard settings in the Settings page + add a Reset button

#### Task
"And if I set some settings need keep it even after refresh or after new changes. Need to set reset have reset" — asking that settings persist across refresh/updates, and that there be a way to reset them.

#### Investigation
Verified directly (headless browser, a real `page.reload()`, not just a re-render) that `de_show_answer_default` and `de_auto_read_tenses` already persist correctly across a genuine page refresh - this is just normal `localStorage` behavior, and nothing in the app clears it on load or on a service-worker cache update (cache and `localStorage` are separate browser storage mechanisms; bumping `sw.js`'s cache version, as every recent task has done, does not touch `localStorage`). Both new keys already start with the `de_` prefix, so they were already automatically included in `Einstellungen_Setup.html`'s existing "Backup & Export", "Restore from Backup", and "Wipe All Data" functions (all three filter by `de_`/`dc_`/`*_progress_v*` prefixes) without any change needed there.

What was actually missing: the two new toggles (added inline in the flashcard UI in Tasks 16-17) had no presence on the central `Einstellungen_Setup.html` settings page, unlike the existing "Hands-Free (Auto-Audio)" and "Progressive Hints" toggles - so there was no way to see or change them from one place, and no reset option scoped to just these preferences ("Wipe All Data" is the only existing reset, and it's deliberately nuclear - it also erases progress, XP, and saved AI API keys).

#### What was built
- Added "Show Answer by Default (Flashcards)" and "Auto-read Tenses (Präsens · Präteritum · Perfekt)" checkboxes to `Einstellungen_Setup.html`'s existing "📚 Learning Preferences" card, following the exact same load/save pattern as the 3 toggles already there (`localStorage.getItem(...) === 'true'` on load, `localStorage.setItem(...)` on change).
- Added a "↺ Reset Learning Preferences to Defaults" button in that same card, scoped to exactly the 5 preference keys in that card (`de_simple_mode`, `de_auto_audio`, `de_progressive_hints`, `de_show_answer_default`, `de_auto_read_tenses`) - removes them from `localStorage`, unchecks all 5 checkboxes, and removes the `simple-mode` body class, without touching AI provider/API keys, user profile, theme, or any progress/XP data (those remain reachable only via the existing, intentionally-separate "Wipe All Data").

#### Testing
- Syntax-checked `Einstellungen_Setup.html` (`node --check` on every script block) - clean.
- Headless-browser (Playwright) test covering: settings set from a flashcard page are correctly reflected as checked when the settings page loads; they survive a real `page.reload()`; toggling a checkbox on the settings page correctly updates `localStorage`; the Reset button clears all 5 scoped keys and unchecks all 5 boxes; the Reset button does **not** touch unrelated keys (AI provider, user name); after reset, the flashcard page itself reads the (now off) state correctly via `getShowAnswerDefault()`. All 8 checks passed.
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Einstellungen_Setup.html`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 18) — Fix: swiping mid-speech spoke the new card over the old one

#### Task
"In flash card while auto speak if I swipe while during the speak, current word is speaking with previous word" — a bug report on Task 17's auto-read-tenses feature: swiping to a new card while the previous card was still being read aloud caused the two cards' audio to overlap/garble together instead of the old one cleanly stopping.

#### Root cause
`speakSequence()` (added in Task 17) chains through a list of texts by giving each `SpeechSynthesisUtterance` an `onend` handler that schedules the next word via `setTimeout(playNext, gapMs)`. When a new card rendered mid-sequence, the new `speakSequence()` call correctly called `speechSynthesis.cancel()` to stop whatever was *currently playing* - but that only stops the browser-level speech queue. It does nothing about a `setTimeout` already scheduled on the JS side by the *previous* call's `onend` handler (e.g. the gap between word 1 and word 2). That timer had no way to know a newer call had superseded it, so it fired anyway and spoke the old card's next word - now on top of the new card's audio that had already started. The same defect applied to any two auto-play calls in quick succession, not just within a single tense sequence.

#### What was built
- Added a shared `ttsGeneration` counter and `pendingSpeakTimer` handle to `js/tts-engine.js`, plus a `cancelPendingSpeech()` function that bumps the counter, clears any pending scheduled call, and stops the browser's speech queue - all three, together, in one place. Both `speak()` and `speakSequence()` now call it before starting. Inside `speakSequence()`'s chain, each step first checks that the generation it captured when it started is still current; if a newer `speak()`/`speakSequence()` call has bumped the counter in the meantime, the stale step silently stops instead of speaking.
- Added `scheduleSpeak(text, delayMs)` and `scheduleSpeakSequence(texts, delayMs, gapMs)` - the same "wait N ms, then speak" pattern every auto-play call site already used via raw `setTimeout`, but now going through the same generation-tracked cancellation so a second card rendered within that initial delay window cleanly supersedes the first's pending call instead of both eventually firing.
- Replaced every raw `setTimeout(() => ...(word)..., 300)` auto-play call across both files' flashcard renderers with the new `scheduleSpeak`/`scheduleSpeakSequence` helpers (5 call sites in `deutsch-coach.html`'s `recall_meaning`, `recall_de2en`, `plural`, `verbtense`, `fillgap` renderers; 1 in `Verb_Transformation_Trainer.html`'s Flip Card mode). While doing this, also consolidated a pre-existing duplicate block in `deutsch-coach.html`'s `renderRecallMeaning` (it had the exact same `if (de_auto_audio) {...}` block written twice in a row - harmless but redundant, now a single call) and switched `deutsch-coach.html`'s legacy `de_auto_audio` single-word playback from its local `window.playTTS()` shadow (which doesn't select a preferred German voice, unlike the shared engine) to the shared `speak()`/`scheduleSpeak()`, so it now also respects the user's voice preference and gets the same overlap protection.
- Added a `cancelPendingSpeech()` call at the very top of `deutsch-coach.html`'s `renderSessionCard()` and `Verb_Transformation_Trainer.html`'s `renderCard()` (before dispatching to any type/mode-specific renderer), so a still-speaking flashcard's audio is stopped cleanly even when the *next* card lands on a type/mode that doesn't manage speech itself - the 3 multiple-choice question types in `deutsch-coach.html`, and Easy/Hard mode in `Verb_Transformation_Trainer.html`, neither of which auto-play audio but could otherwise let a stale flashcard sequence keep talking underneath them.

#### Testing
- Syntax-checked `js/tts-engine.js`, `deutsch-coach.html`, and `Verb_Transformation_Trainer.html` (`node --check` on every script block) - clean.
- Re-ran the Task 17 headless-browser regression suite (auto-read fires in order on render/Next/Prev, respects the on/off toggle, correctly scoped checkboxes) - still 17/17 passing, no regression from this refactor.
- Wrote a new headless-browser test that reproduces the reported bug directly: mocks `speechSynthesis.speak`/`cancel` to record every utterance's actual start/end timestamps (not just what was queued), starts a 3-word auto-read sequence, swipes to the next card ~100ms into the first word (while it's still "speaking" in the mock), then checks the full event timeline. Confirmed, in both files: zero overlapping-utterance events; the old card's 2nd and 3rd words (Präteritum/Perfekt) are never spoken after the swipe; the new card's full 3-word sequence plays correctly in order once its own delay elapses.
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `js/tts-engine.js`
- `deutsch-coach.html`
- `Verb_Transformation_Trainer.html`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 17) — Auto-read tenses (Präsens/Präteritum/Perfekt) after swipe/next

#### Task
"In flash card have option to auto read after swipe/next Präsens / Präteritum / Perfekt" — a direct follow-up to Task 16's swipe+show-answer feature, asking for the tense forms to be read aloud automatically each time the user navigates to a new card, not just displayed.

#### Scoping
Only 2 of the 3 files touched in Task 16 actually contain Präsens/Präteritum/Perfekt tense-form content: `Verb_Transformation_Trainer.html`'s "Flip Card" mode (Infinitive = Präsens, Simple Past = Präteritum, Present Perfect = Perfekt, all shown together in the reveal box) and `deutsch-coach.html`'s `verbtense` question type (`card.w` = Präsens, `card.pr` = Präteritum, `card.pp` = Perfekt). `Nomen_Adjektiv_Trainer.html` has no tense data (articles/adjectives only), so it's out of scope.

While wiring this up, found the existing `de_auto_audio` ("auto-play audio") setting was **silently non-functional** in `Verb_Transformation_Trainer.html`: it called `playTTS(v.inf)`, but the shared `js/tts-engine.js` `playTTS()` function ignores its argument entirely and only reads a `data-audio` attribute off `<body>` that this file never sets — so the call was a no-op every time. (`deutsch-coach.html` was unaffected: it defines its own local `window.playTTS(txt, e)` that shadows the shared one and does speak the given text.) Fixed this incidentally while replacing the block, using the shared `speak(text)` function instead (which is not shadowed and correctly speaks any given text).

#### What was built
- Added `speakSequence(texts, gapMs)` to the shared `js/tts-engine.js` (loaded by nearly every page in the app), refactoring the existing `speak()` function's voice-selection logic into a shared `buildUtterance(text)` helper so both share it. `speakSequence` plays a list of texts one after another, using each `SpeechSynthesisUtterance`'s `onend`/`onerror` callback to chain to the next (rather than blind `setTimeout` delays, which would either overlap speech or leave awkward gaps depending on utterance length) — with a configurable gap between clips (default 450ms).
- Added a new `de_auto_read_tenses` localStorage flag with `getAutoReadTenses()`/`setAutoReadTenses()`/`toggleAutoReadTenses()` helpers and an `autoReadToggleHTML()` checkbox, mirroring the Task 16 "show answer by default" pattern, in both files — scoped to only the modes/types that actually have tense forms (`practiceMode === 'medium'` in `Verb_Transformation_Trainer.html`; a new `TENSE_READ_QTYPES = ['verbtense']` allowlist in `deutsch-coach.html`, separate from the existing `FLASHCARD_QTYPES` allowlist since only 1 of the 5 flashcard types has tense data).
- When the setting is on, each card render (which fires on initial load, after `advance()`/`advanceSession()` — Next button or swipe-left — and after `prevCard()`/`prevSession()` — Prev button or swipe-right, since all of these ultimately call the same render function) triggers `speakSequence([Präsens, Präteritum, Perfekt])` after a 300ms delay (matching the existing auto-audio convention). This runs independently of whether the answer is visually revealed — it's a deliberate design choice so users can practice by listening only, without needing "show answer by default" also enabled, matching a literal reading of "auto read after swipe/next" as its own feature.

#### Testing
- Syntax-checked `js/tts-engine.js`, `Verb_Transformation_Trainer.html`, and `deutsch-coach.html` (`node --check` on every script block) — clean.
- Headless-browser (Playwright) testing with a mocked `speechSynthesis.speak`/`cancel` that records what text was queued and fires `onend` asynchronously (so the real chaining logic runs, not just a single call): confirmed, in both files, that toggling the checkbox sets `localStorage` correctly, that the 3 tense forms are spoken **in the correct order** (Präsens → Präteritum → Perfekt) on initial render, that the sequence fires again after simulated Next/swipe-left (`advance()`/`advanceSession()`) and Prev/swipe-right (`prevCard()`/`prevSession()`) with the new card's own forms, that nothing speaks when the setting is off, and that the checkbox only appears where tense data actually exists (absent in `easy`/`hard` modes in the trainer file, absent for all non-`verbtense` question types in `deutsch-coach.html`, including the other 4 flashcard types that don't have tense forms).
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `js/tts-engine.js`
- `Verb_Transformation_Trainer.html`
- `deutsch-coach.html`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 16) — Swipe navigation + "show answer by default" on all real flashcards

#### Task
"In all flash card enable the swipe option (left and right) previous and next. And also option to show the answer my default."

#### Scoping
Used a background Explore agent to survey all 23 root `*.html` pages for genuine flashcard-style UIs before touching anything, since "all flash card" is ambiguous across an app with many different quiz/drill formats. This narrowed the true scope to 3 files: `deutsch-coach.html` (the main SRS review flow), `Verb_Transformation_Trainer.html`, and `Nomen_Adjektiv_Trainer.html` (both share a `practiceMode` architecture where only the `medium`/"Flip Card" mode is a real flip-flashcard; `easy` is multiple-choice and `hard` is typed production, so neither of those two modes got the swipe/reveal treatment). The agent's report also claimed `deutsch-coach.html`'s `renderArticle` renderer used the same reveal-flashcard pattern as the others — direct code reading showed this was wrong: `renderArticle` is genuinely multiple-choice (`.mcopt` der/die/das buttons) with a stray `onclick` referencing a nonexistent `revealBtn` id that silently no-ops. It (and `renderMcDe2En`/`renderMcEn2De`) were correctly excluded. `deutsch-coach.html` has 5 true reveal-flashcard question types out of its 8: `recall_meaning`, `recall_de2en`, `plural`, `verbtense`, `fillgap`.

All 3 files already contained dead swipe-gesture scaffolding from earlier work — targeting a nonexistent `.flashcard`/`.card` CSS class (the real class is `.studycard`) and wired to mismatched grading-button ids (`#btn-nochmal`/`#btn-gewusst` vs. the actual `btnNochmal`/`btnGewusst`), so it never fired, and even working would have graded the card rather than navigating. This was replaced, not "enabled."

#### What was built
- **Swipe navigation**: `document`-level delegated `touchstart`/`touchend` listeners (not per-card, since cards are destroyed/recreated on every render), filtered to only fire when the touch target is inside `.studycard` and isn't an `input`/`textarea` (so it doesn't interfere with the "Hard"/typed-production mode's text field). A `handleSwipe(dx, dy)` function requires `|dx| >= 50` and `|dx| >= |dy| * 1.5` (rejects short taps and mostly-vertical scroll gestures) before treating it as a swipe. **Convention: swipe left = next card, swipe right = previous card.**
  - `Verb_Transformation_Trainer.html` / `Nomen_Adjektiv_Trainer.html`: reused each file's existing "← Prev"/"→ Next" button handlers (`prevCard()`/`nextCardWithoutAnswer()` or `advance()`). `Nomen_Adjektiv_Trainer.html` didn't have a `prevCard()` function before this — added one, mirroring the pattern already present in `Verb_Transformation_Trainer.html`.
  - `deutsch-coach.html`'s main SRS session runner (`renderSessionCard`) had **no "go back" capability at all** before this change — added a new `prevSession()` function and a conditionally-rendered "← Zurück" button (shown only when `sessionIdx > 0`). This carries the same accepted tradeoff the other 2 files' pre-existing Prev buttons already had: swiping/clicking back to an already-graded card and grading it again is a pre-existing pattern in this app, not a new risk introduced here.
  - `Nomen_Adjektiv_Trainer.html` also has a wholly separate der/die/das gender-guessing "Swipe Game" (`startSwipeGame()`/`dragStart`/`dragEnd`, `.swipe-card`) where swipe direction *is* the answer, not deck navigation — left untouched and confirmed unmodified.
- **"Show answer by default"**: a shared `localStorage` flag (`de_show_answer_default`, `'true'`/`'false'`) with `getShowAnswerDefault()`/`setShowAnswerDefault()`/`toggleShowAnswerDefault()` helpers and a checkbox (`showAnswerToggleHTML()`) rendered above the card, but only for genuine reveal-flashcard modes/types (the `medium` practice mode in the 2 trainer files; the 5 `FLASHCARD_QTYPES` in `deutsch-coach.html` — the 3 multiple-choice question types never show this checkbox). Implemented by reusing each renderer's own existing `revealBtn.onclick` handler rather than duplicating reveal logic: the handler is assigned as before, then immediately invoked once (`if(getShowAnswerDefault()) document.getElementById('revealBtn').onclick();`) right after.
  - `deutsch-coach.html`'s `renderRecallMeaning` has a separate "progressive hints" mechanic (`de_progressive_hints`) that normally reveals the answer over 2 extra clicks before full reveal on click 3. Changed its gate to `localStorage.getItem('de_progressive_hints') === 'true' && !getShowAnswerDefault()` so "show answer by default" always means an immediate full reveal, bypassing progressive hints rather than fighting them.

#### Testing
- Syntax-checked all 3 files (`node --check` on every extracted `<script>` block) — clean.
- Headless-browser (Playwright, touch-enabled context) testing on all 3 files: toggling the checkbox correctly sets `localStorage['de_show_answer_default']` and populates `#revealArea` immediately; the setting persists across card navigation; the checkbox is present for flashcard modes/types and absent for multiple-choice ones; the "← Zurück"/"← Prev" button appears only when not on the first card.
- **Testing-methodology caveat (disclosed)**: synthetic `TouchEvent`/`Touch` construction dispatched via `page.evaluate()` did not reliably trigger the real `touchstart`/`touchend` DOM listeners in headless Chromium (no errors, but no effect). Worked around this by calling `handleSwipe(dx, dy)` directly to verify the swipe *logic* (confirmed `sessionIdx`/card position moves correctly in both directions, and that short/mostly-vertical gestures are correctly ignored, in all 3 files). This confirms the swipe-handling logic is correct but does **not** independently confirm real-touchscreen event delivery end-to-end — that part relies on the listener registration being standard/correct DOM API usage, not on a full physical-device test.
- For `deutsch-coach.html` specifically, also verified: the progressive-hints bypass (full reveal with grading buttons shown immediately, no intermediate hint text, when show-answer-default is on) and that the previously-nonexistent "go back" capability doesn't crash at `sessionIdx === 0`.
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `deutsch-coach.html`
- `Verb_Transformation_Trainer.html`
- `Nomen_Adjektiv_Trainer.html`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 15) — "Alle 3" tense-comparison mode

#### Task
"In [Thema_Sprech_Trainer.html] have option to switch Präsens/Präteritum/Perfekt... like this need option to select ich er sie .. ihr content example contains all three Präsens/Präteritum/Perfekt" — the existing tense selector picks ONE tense and shows all 6 persons in it; wanted the reverse view too: pick a person and see all 3 tenses side by side for direct comparison.

#### What was built
- Added a 4th entry to the `TENSES` array/selector: `{k:'all', label:'Alle 3', sub:'(Vergleich)'}`, alongside the existing Präsens/Präteritum/Perfekt buttons — selecting it doesn't replace the per-person layout, it changes what's shown *within* each person's row.
- `renderSentenceRowHTML()` now branches: in the 3 single-tense modes, each person still gets one `.sent-de`/`.sent-en` line (unchanged from before). In "Alle 3" mode, each person's row instead renders 3 stacked `.tense-line` blocks (new CSS, dashed divider between them, small uppercase tense-name label) — one per tense, each with its own independent 🔊 play / 🔁 loop / 🎙️ record buttons and transcript box, so a user can compare "Ich mache." / "Ich machte." / "Ich habe gemacht." at a glance and interact with any of the three individually.
- Re-plumbed `playSentence`, `toggleLoopSentence`, `runLoopStep`, and `toggleRecordSentence` to take an optional trailing `tense` argument: called with no tense (the 3 single-tense buttons) they behave exactly as before, using the globally-selected `curTense`; called with an explicit tense (the 3 per-tense-line buttons in compare mode) they target that specific tense's audio/highlight/transcript-box regardless of the global selector. Added a `getPlayTargetId()` helper so the "currently playing" highlight lands on the right element in both modes (the whole `.sent-row` normally, just the one `.tense-line` in compare mode) instead of always highlighting the full row.
- "▶️ Alle 6 nacheinander abspielen" (Play All) now adapts to the mode too: in compare mode it plays all 18 clips (6 persons × 3 tenses, tense-major-then-person order within each person) and its own label changes to say so; in single-tense mode it's unchanged (still 6 clips). Added `activeRecTense` alongside the existing `activeRecInf`/`activeRecIdx` state so the record button correctly tracks *which* of the (up to) 3 recordings-in-progress belongs to which tense-line.
- Applies uniformly to every topic on the page, including the auto-conjugated Häufige Wörter (A1-B2) topics from Tasks 5-6/10, since it only touches the shared rendering/playback layer, not the verb data itself.

#### Testing
- Headless-browser check: selecting "Alle 3" renders 18 `.tense-line` elements (6 persons × 3) for a hand-authored topic verb, each correctly labeled Präsens/Präteritum/Perfekt with the right German text; clicking a specific tense-line's play button speaks exactly that line's text (verified via a `speechSynthesis.speak` spy) and highlights only that line, not the whole row or a different tense.
- Confirmed switching back to a single tense (e.g. Perfekt) after using compare mode correctly returns to the original 6-row layout with zero `.tense-line` elements, and playback/highlight behavior is unchanged from before this change.
- Repeated the compare-mode check on a Häufige Wörter (A1) verb (the auto-conjugated data path) — same correct 18-line result.
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Thema_Sprech_Trainer.html`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 14) — Distinct icon + accent color for each Häufige Wörter level card

#### Task
"Need theme for Häufige Wörter" — clarified via `AskUserQuestion`: the 4 level cards (A1/A2/B1/B2) on `Thema_Sprech_Trainer.html`'s topic grid all shared the same `megaphone` icon and the same single shared icon color (`.thema-icon{color:var(--gold);}`, one color for every topic card in the app), so they looked identical to each other at a glance. Wanted a distinct icon/color per level card.

#### Fix
- Gave each of the 4 `haeufig_*` topic entries its own icon (from `js/icon-svgs.js`'s existing key set, picking ones not already used by the 7 domain topics to avoid visual overlap): A1→`abstract`, A2→`document`, B1→`team`, B2→`graduation`.
- Added a `color` field to those same 4 entries, reusing the app's existing named palette (`--green`/`--blue`/`--purple`/`--red`, already defined in this page's `:root` and dark-mode blocks) in a beginner→advanced progression: A1 green, A2 blue, B1 purple, B2 red — a common convention in language-learning UIs.
- `renderThemaGrid()` now applies `style="color:${t.color}"` inline on `.thema-icon` only when a topic defines `color` (the other 7 domain topics have no `color` field, so they're untouched and keep the single shared gold color from the CSS rule). Used the CSS variable reference (`var(--green)` etc.) rather than a resolved hex value, so the color still correctly swaps to its dark-mode-redefined value when the shared theme toggle is used.
- Confirmed the `.thema-card.active .thema-icon{color:#fff;}` CSS rule that could have fought with this inline style is dead code — `active` is never actually toggled onto a `.thema-card` anywhere in the JS — so no conflict in practice.

#### Testing
- Headless-browser check: each of the 4 cards' `.thema-icon` computed color matches its assigned palette color in light mode; re-checked after clicking the real theme toggle and confirmed the B2 card's icon switches to the dark-mode red variant, not a stale light-mode value.
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Regenerated `sw.js` (cache version bump).

#### Files Changed
- `Thema_Sprech_Trainer.html`
- `sw.js`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 13) — Add 24 missing "sister verb" entries

#### Task
"I can sister verbs and some details of content is missing. Please and add the missing details" — on `Wortschatz_Master_Grid.html` (and `Deutsch_Wortschatz_Excel_Sheet.html`, same feature), the "Sister Verbs" feature suggests related verbs (via `KNOWN_SISTER_VERBS`, e.g. `kommen` → ankommen/mitkommen/zurückkommen) and looks up each one's meaning with `getSisterMeaning()`: it searches `VERBS` for the infinitive and returns `.en`, falling back to a generic `PREFIX_MEANINGS` guess (e.g. "an-" → "to start / target") only if the prefix is recognized, or blank otherwise.

#### Root cause
Scripted a check of every sister verb listed in `KNOWN_SISTER_VERBS` against `VERBS`: **24 of them don't exist in `VERBS` at all** — einkaufen, abkaufen, ankommen, mitkommen, zurückkommen, aufstehen, abfahren, mitfahren, erfahren, erlernen, fernsehen, aussehen, wiedersehen, zuhören, bearbeiten, ausarbeiten, abgeben, ausgeben, aufgeben, mitnehmen, verschlafen, abfotografieren, befotografieren, verfotografieren. Unlike every earlier gap this session (Tasks 7-12), this wasn't a case of one page falling behind a richer copy elsewhere — checked `Verb_Transformation_Trainer.html` (the richest `VERBS` source in the app) and none of the 24 were there either. This needed genuinely new content, not copying from an existing source.

#### Decision on 2 uncertain entries
Two of the 24 (`befotografieren`, `verfotografieren`) aren't standard dictionary German as far as could be verified — "fotografieren" doesn't normally take be-/ver- prefixes this way. Asked the user rather than silently guessing or silently omitting; they chose "add all 24, best-effort guess on those 2." Added them with an explicit `(uncertain - not a standard dictionary word, best-effort guess)` suffix on the `en` field and `source: "uncertain / best-effort guess, not verified as standard German"`, so they're discoverable/correctable later rather than presented as equally solid as the other 22.

#### What was added
Built all 24 as full `VERBS`-schema entries (inf/en/perfekt/praeteritum/noun/level/source/typ/icon/ta/ta_translit), each hand-conjugated and grammar-checked individually (haben/sein auxiliary choice, separable vs. inseparable prefix placement, e→i stem changes for geben/nehmen compounds, e→ie for sehen compounds) — the same care applied to every hand-authored verb set earlier this session. Added identically to all 4 pages that maintain a `VERBS` array: `Verb_Transformation_Trainer.html` (605, was 581), `Verben_Hoeren_EN_DE.html`, `Wortschatz_Master_Grid.html`, `Deutsch_Wortschatz_Excel_Sheet.html` (564 each, was 540) — keeping the source-of-truth pattern established in Tasks 7-10 intact rather than creating a new inconsistency. Updated every hardcoded count label this touches on the 3 pages that have them (`Verb_Transformation_Trainer.html` has none).
Tamil translations for all 24 are original translations (not sourced from `js/tamil-dict.js`, which doesn't have them either) — same caveat as Task 12's "Garten" entry: real, considered translations from general knowledge, not cross-checked against an in-app source, so worth a native speaker's spot-check.
Deliberately NOT touched: `Thema_Sprech_Trainer.html`'s own embedded `VERBS_ALL` snapshot (built once from an earlier copy of `Verb_Transformation_Trainer.html`'s data) — that page has no "sister verbs" feature, so it wasn't affected by this gap, and refreshing its snapshot is a separate, unrequested task.

#### Testing
- Headless-browser check on all 4 pages: `VERBS.length` correct on each (605/564/564/564), zero `pageerror` events.
- On `Wortschatz_Master_Grid.html`, called `getSisterMeaning()` directly for 4 of the newly-added verbs (`ankommen`, `einkaufen`, `fernsehen`, `befotografieren`) and confirmed each now returns its real (or clearly-flagged-uncertain) meaning instead of a blank/generic prefix guess.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Verb_Transformation_Trainer.html`
- `Verben_Hoeren_EN_DE.html`
- `Wortschatz_Master_Grid.html`
- `Deutsch_Wortschatz_Excel_Sheet.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 12) — Add "Garten" back as a proper noun entry

#### Task
"Add Garten as a proper noun with Tamil translation" — direct follow-up to Task 11, where the two malformed `{w:'Garten', en:'garden', cat:'n'}` entries were removed from `ADJS` rather than fabricating the missing fields needed to relocate them as a real noun entry.

#### What was added
Added one new `NOUNS` entry to all 3 pages that carry that array (`Nomen_Adjektiv_Trainer.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html`), matching the exact field shape every other noun entry uses:
```
{"sg":"Garten","pl":"Gärten","a":"der","en":"garden","ta":"தோட்டம்","ta_translit":"thōṭṭam","icon":"house","level":"A1","topic":"wohnen","typ":"umlaut_only"}
```
- `pl`/`a`: "der Garten" → "die Gärten" (standard, unambiguous German).
- `ta`/`ta_translit`: தோட்டம் / thōṭṭam — the standard Tamil word for "garden". Unlike Task 10/11 (where relocating the entry would have meant guessing fields with no source to check them against), a plain dictionary translation for a common, unambiguous word is the same kind of work that built the rest of this vocabulary list, not the kind of invented statistic/fact the project's "never fabricate" rule targets — still, this specific translation was not cross-checked against `js/tamil-dict.js` or any other in-repo source (confirmed neither had it), so it rests on general knowledge rather than a verifiable in-app source; flagged here in case the user wants to double-check it themselves.
- `icon`: "house" — no dedicated garden/plant icon exists in `js/icon-svgs.js` (checked the full key list), so reused the same icon already used for this entry's `topic:"wohnen"` group (Zimmer, Fenster).
- `level`/`topic`/`typ`: A1 (basic vocabulary, consistent with its `wohnen`-topic siblings), `wohnen` (same topic as Zimmer/Fenster), `umlaut_only` (Garten→Gärten changes only the root vowel with no suffix added, the same pattern as Vater→Väter and Apfel→Äpfel already in the data — not the `umlaut` pattern used for Sohn→Söhne, which also adds an `-e`).
- Updated the same hardcoded count labels touched in Tasks 10-11 on the two pages that have them (Nomen 522→523, totals accordingly); `Nomen_Adjektiv_Trainer.html` has none to update.

#### Testing
- Headless-browser check on all 3 pages: the new entry is present with identical field values everywhere, `NOUNS.length === 523` on all 3, zero `pageerror` events.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Nomen_Adjektiv_Trainer.html`
- `Deutsch_Wortschatz_Excel_Sheet.html`
- `Wortschatz_Master_Grid.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 11) — Fix: remove misplaced "Garten" entries from ADJS

#### Task
"Fix the Garten entry too" — following up on the Known Bugs entry from Task 10 that flagged, but deliberately didn't fix, two malformed `{w:'Garten', en:'garden', cat:'n'}` entries sitting in the `ADJS` array (a noun, wrong shape, duplicated) on all 3 pages that carry that data.

#### Decision and fix
Checked first whether "Garten" already exists properly in any of the 3 pages' `NOUNS` arrays — it doesn't, anywhere. Building a correct noun entry from scratch would mean fabricating fields the real entries all have (`ta`/`ta_translit` Tamil translation, `icon`, `level`, `topic`, `typ`) with no source to verify them against (checked `js/tamil-dict.js` too — no "Garten" entry there either), which conflicts with this project's standing "never fabricate content" rule. Removing the two malformed entries outright doesn't require inventing anything, so that's what was done: deleted both `{w:'Garten', en:'garden', cat:'n'}` entries from `ADJS` in `Nomen_Adjektiv_Trainer.html`, `Deutsch_Wortschatz_Excel_Sheet.html`, and `Wortschatz_Master_Grid.html` (347 → 345 in each). Updated the same count labels touched in Task 10 (stats badge/hero subtitle, "Adjektive"/"Alle" filter chips, status-bar placeholder) on the two pages that hardcode them; `Nomen_Adjektiv_Trainer.html` has no hardcoded counts to fix (computes them live).
If the user wants "Garten" added back as a real noun entry later, it needs a real Tamil translation and level/topic assignment from them (or another verified source) first — not guessed.

#### Testing
- Headless-browser check on all 3 pages: `ADJS.length === 345` and no entry with `w === 'Garten'` remains, confirmed live via `page.evaluate`; zero `pageerror` events.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Nomen_Adjektiv_Trainer.html`
- `Deutsch_Wortschatz_Excel_Sheet.html`
- `Wortschatz_Master_Grid.html`
- `PROJECT_KNOWLEDGE.md` (this entry; removes the Known Bugs entry this task fixes)

---

### 2026-09-22 (Task 10) — Fix: same "richer source exists elsewhere" gap for NOUNS/ADJS

#### Task
"Check the other pages too for anything similar" — after 3 rounds of fixing the same missing-A1/B2-verbs bug on different pages, asked to proactively check the rest of the app for the same class of bug (a page keeping its own duplicated copy of shared vocabulary data that has silently fallen behind a richer copy living on another page), rather than fixing them one report at a time.

#### What was checked
- **`VERBS`**: confirmed (via `grep -lE "(const|let|var)\s+VERBS\s*=\s*\["`) that only 4 pages have their own copy: `Verb_Transformation_Trainer.html` (581/540 deduped, source of truth) and the 3 already fixed in Tasks 7-9. No other page has this gap.
- **`NOUNS` / `ADJS`**: found via the same grep pattern that 3 pages carry these — `Deutsch_Wortschatz_Excel_Sheet.html`, `Wortschatz_Master_Grid.html`, and `Nomen_Adjektiv_Trainer.html`. The first two were both stuck at 378 nouns / 337 adjectives; `Nomen_Adjektiv_Trainer.html` had 522 nouns / 347 adjectives — the same richer-source pattern as `VERBS`, just not yet reported by the user for this data. Scripted diff (by `sg` for nouns, `w` for adjectives) confirmed zero content differences for every entry present in both the smaller and larger sets, and zero duplicate keys in the source other than one pre-existing, already-shared data-quality quirk (see below) — safe to append the difference.
  - **NOUNS**: 144 missing (105 A1 + 39 B2 — an entire missing level for nouns too, same shape as the VERBS gap).
  - **ADJS**: 10 missing (all A1).
  - Appended both missing sets to `Deutsch_Wortschatz_Excel_Sheet.html` and `Wortschatz_Master_Grid.html` (NOUNS 378→522, ADJS 337→347 on both), and updated every hardcoded count label that had already been corrected once in Tasks 8-9 (they needed a second correction now that NOUNS/ADJS also grew): stats badge/hero subtitle, "Wortart" pos-filter chips, and the status-bar/results-count placeholder text on both pages. New combined total: 540 verbs + 522 nouns + 347 adjectives = 1,409 (was 1,255, was 1,117 before Task 8).
  - Noted but deliberately NOT touched: `Nomen_Adjektiv_Trainer.html`'s `ADJS` array has a pre-existing, already-identically-shared data-quality quirk — two duplicate `{w:'Garten', en:'garden', cat:'n'}` entries that are clearly a misplaced noun (wrong shape entirely: no `comp`/`sup`/`level`/etc., just `cat:'n'`) sitting in the adjectives array. This same quirk already exists identically in `Deutsch_Wortschatz_Excel_Sheet.html` and `Wortschatz_Master_Grid.html` too (verified), so it isn't something this fix introduced or made worse — flagging it in Known Bugs rather than silently "fixing" content quality that's out of scope for a missing-data pass.
- **`KNOWN_SISTER_VERBS` / `PREFIX_MEANINGS`**: also duplicated across the same 3 files. An initial raw-text-length comparison looked alarming (`Verb_Transformation_Trainer.html`'s copy was 4-10x longer in raw characters than the other two), but a proper balanced-brace extraction + `eval` + per-key `JSON.stringify` comparison (Node.js, not naive regex/JSON.parse, since these are JS object literals with unquoted keys) showed **byte-for-byte identical content** across all three files for every key — the raw-length difference was an artifact of an imprecise regex capturing extra trailing text in one file, not an actual data gap. No fix needed; recorded here so a future pass doesn't have to redo this investigation.
- **`GRAMMAR_RULES`**: confirmed unique to `Grammatik_Regel_Trainer.html` only — not duplicated anywhere, no drift possible.

#### Testing
- Headless-browser check on both fixed pages: `VERBS.length===540`, `NOUNS.length===522`, `ADJS.length===347` confirmed live via `page.evaluate` on both `Deutsch_Wortschatz_Excel_Sheet.html` and `Wortschatz_Master_Grid.html`, zero `pageerror` events.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Deutsch_Wortschatz_Excel_Sheet.html`
- `Wortschatz_Master_Grid.html`
- `PROJECT_KNOWLEDGE.md` (this entry; Known Bugs section)

---

### 2026-09-22 (Task 9) — Fix: Deutsch_Wortschatz_Excel_Sheet.html missing A1 and B2 verbs

#### Task
Follow-up to Task 8: "Check Deutsch_Wortschatz_Excel_Sheet.html for the same gap" — the user proactively asked to check a third page for the same issue, rather than waiting for it to be reported live.

#### Finding and fix
- Same root cause, confirmed independently: this page's own `VERBS` array was also stuck at 503 entries (A2 + B1 only). Appended the same, already-verified 37-verb list (9 A1 + 28 B2) used in Tasks 7 and 8 — identical schema, zero overlap.
- Notably, this page's UI is AHEAD of the other two: it already has working "Level: Alle / A1 / A2 / B1 / B2" filter chips (`setLevelFilter()`) — they were just silently non-functional for A1/B2 the whole time because there was no A1/B2 data for them to ever show. No UI changes were needed here at all, unlike Task 7 (had to add the missing filter buttons) — the data fix alone made the existing buttons work.
- This page builds its spreadsheet rows directly from `(VERBS || []).forEach(...)`, so the fix requires no other code changes, same as Task 8.
- Fixed the same class of stale hardcoded count labels found in Task 8: the stats badge, the "Wortart: Alle/Verben/Nomen/Adjektive" filter chips, and the status-bar row count — all previously showing the old 1,117/503/378/236 total (236 for Adjektive was independently wrong here too, same as Task 8's finding: the real `ADJS.length` is 337). Corrected to 1,255/540/378/337.

#### Testing
- Headless-browser check: `VERBS.length===540`, `NOUNS.length===378`, `ADJS.length===337`, `ALL_ROWS.length===1255`, all confirmed live via `page.evaluate`. Clicking the (previously dead) "A1" level chip now filters to 361 rows (verbs+nouns+adjectives tagged A1); "B2" filters to exactly 28 (all verbs, since B2 nouns/adjectives don't exist in this data); "Alle" returns to 1,255.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Deutsch_Wortschatz_Excel_Sheet.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 8) — Fix: Wortschatz_Master_Grid.html missing A1 and B2 verbs

#### Task
Follow-up to Task 7: "Fix Wortschatz_Master_Grid.html too" — the same missing-A1/B2-verbs gap flagged as a known bug at the end of Task 7.

#### Fix
- Same root cause and same fix as `Verben_Hoeren_EN_DE.html`: appended the same 37 verbs (9 A1 + 28 B2) to this page's own `VERBS` array (540 total, identical schema, zero overlap with the existing 503 — reused the exact same verified list from Task 7).
- This page has no level-filter UI (unlike `Verben_Hoeren_EN_DE.html`) — it builds one combined `allMasterEntries` array from `VERBS`/`NOUNS`/`ADJS` via `initMasterData()`, which iterates the full `VERBS` array directly, so the 37 new verbs are automatically picked up by every existing filter/search/view mode (grid/table/study) with no other code changes needed.
- Updated the hardcoded count labels that don't self-update: the "🌟 Alle (...)" and "⚡ Nur Verben (...)" pos-filter buttons, and the static hero subtitle text (both only used as pre-JS-load placeholders / button labels — the live `#resultsCount` span is already computed from `allMasterEntries.length` at runtime and needed no change).
- While fixing these, found the "🎨 Nur Adjektive (236)" label was ALSO stale and wrong independent of this task — the actual `ADJS` array has 337 entries, not 236 (540 + 378 + 337 = 1255, matching the live `allMasterEntries.length`; the old 503+378+236=1117 the page previously showed was wrong on two counts, not just the verb one). Fixed this label too while already touching the surrounding counts, rather than leaving a known-wrong number sitting next to freshly-corrected ones.

#### Testing
- Headless-browser check: no `pageerror` events; `VERBS.length===540` and `allMasterEntries.length===1255` confirmed live via `page.evaluate`; both `sein` (A1) and `mögen` (A1) found in the live `VERBS` array; clicking "Nur Verben" filters to exactly 540; button/subtitle text all show the corrected numbers.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Wortschatz_Master_Grid.html`
- `PROJECT_KNOWLEDGE.md` (this entry; removes the Known Bugs entry this task fixes)

---

### 2026-09-22 (Task 7) — Fix: Verben_Hoeren_EN_DE.html missing A1 and B2 verbs

#### Task
User reported (linking the live GitHub Pages URL): "I can see only a2 and b1" on `Verben_Hoeren_EN_DE.html`.

#### Root cause
This page keeps its own independent copy of the `VERBS` vocabulary array (same single-file-per-page pattern as the rest of the app), and that copy only ever had 503 entries — all tagged `A2` or `B1`. Its level-filter UI only had "All (503)" / "A2" / "B1" buttons, matching the data exactly (not a broken filter — the underlying data itself was missing every A1 and B2 verb). `Verb_Transformation_Trainer.html`'s `VERBS` array, by contrast, has the full 581 entries across all 4 levels (identical schema, identical content for every verb present in both — confirmed with a scripted diff: 0 field differences across all 503 shared infinitives). `Wortschatz_Master_Grid.html` has the exact same 503-only gap (also checked while investigating this) but has no level-filter UI at all to fix alongside it, and wasn't reported, so it was left alone — flagged in Known Bugs below instead of silently fixed.

#### Fix
- Deduped `Verb_Transformation_Trainer.html`'s 581 entries down to 540 unique infinitives (keeping the lowest CEFR level per verb, same method used for `Thema_Sprech_Trainer.html`'s Häufige Wörter topics), then computed the 37 entries genuinely absent from `Verben_Hoeren_EN_DE.html`'s 503 (9 A1 + 28 B2 — the other 12 already-present verbs whose canonical level in `Verb_Transformation_Trainer.html` differs are left as this page already had them tagged, to avoid silently reclassifying content the page's own filter counts already depend on).
- Appended those 37 verbs to this page's `VERBS` array (same JSON object shape: inf/en/perfekt/praeteritum/noun/level/source/typ/icon/ta/ta_translit).
- Added "A1" and "B2" filter buttons (`fltA1`/`fltB2`) alongside the existing "All"/"A2"/"B1", and the matching `else if` branches in `setVhFilter()`.
- Updated the two static "503" mentions (subtitle, initial progress-label text) to 540; the real running count (`${filteredVerbs.length} von ${VERBS.length} Verben`) was already computed from `VERBS.length` and needed no change.

#### Testing
- `node --check` on the extracted page script.
- Headless-browser check: "All (540)" button and progress label both show 540 on load; clicking A1 shows 9, B2 shows 28, All shows 540 again; body text confirms both a new A1 verb ("sein") and a new B2 verb ("mögen" — actually A1 in this data, general modal) render correctly after filtering.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Verben_Hoeren_EN_DE.html`
- `PROJECT_KNOWLEDGE.md` (this entry; Known Bugs section)

---

### 2026-09-22 (Task 6) — Thema_Sprech_Trainer.html: split "Häufige Wörter" into 4 level topics

#### Task
Follow-up to Task 5: user feedback was "540 theme are under one. I expect create another group there we can group by theme" — the single "Häufige Wörter" card (with an internal A1/A2/B1/B2/Alle filter) wasn't what they wanted; they wanted separate topic cards on the main grid, one per CEFR level.

#### Change
- Replaced the single `{id:'haeufig', ...}` topic with four: `haeufig_a1`/`haeufig_a2`/`haeufig_b1`/`haeufig_b2`, titled "Häufige Wörter (A1)" through "(B2)", each still using the `megaphone` icon.
- `init()` now buckets each `VERBS_ALL` entry into the matching level-topic (`v.level` → `haeufig_a1`/etc.) instead of building one flat 540-verb array.
- Removed the now-redundant in-topic level filter (`haeufigLevel` state, `setHaeufigLevel()`, `haeufigLevelSelectorHTML()`) added in Task 5, since the grouping now happens at the topic-grid level instead. `renderVerbList()`'s auto-topic disclosure note (explaining these are auto-conjugated, not hand-written) now triggers on any `haeufig_*` topic id and just shows that topic's own verb count.
- No changes to the conjugation engine or `VERBS_ALL` data itself — this was purely a re-grouping of the same 540 already-verified verbs.

#### Testing
- Headless-browser check: topic grid now shows 11 cards total (the original 7 plus 4 level cards), with counts "0 / 50", "0 / 178", "0 / 284", "0 / 28" for A1/A2/B1/B2 respectively (sums to 540, matching the total from Task 5).
- Opening the A1 topic shows exactly 50 verb cards; opening a verb and checking its sentence renders correctly.
- Re-ran the full live-page structural verification from Task 5 (`generateSentences`/`VERBS_ALL` called via `page.evaluate`, not a copy): all 9,720 sentence-tense combinations still clean, since the underlying data and engine weren't touched.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Thema_Sprech_Trainer.html`
- `sw.js` (regenerated: cache version bump)
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 5) — Thema_Sprech_Trainer.html: "Häufige Wörter" now covers all 540 A1–B2 verbs

#### Task
Follow-up to Task 4: "I mean all the words (a1,a2,b1,b2) verb" — the user wanted the "Häufige Wörter" topic to cover the app's ENTIRE existing verb vocabulary (A1–B2), not just the 5 hand-picked ones from Task 4. Clarified via `AskUserQuestion` (given the scale: 581 verbs) that full coverage with auto-conjugated sentences (simple, consistent template) was preferred over a smaller hand-written subset.

#### Scale problem and why hand-writing was ruled out
`Verb_Transformation_Trainer.html`'s existing `VERBS` array has 581 entries (A1: 50, A2: 219, B1: 284, B2: 28); after deduping repeated infinitives (41 verbs are re-listed across levels — kept the lowest level) that's 540 unique verbs. Hand-writing a unique, verified example sentence per person per tense (the standard this page's other 7 topics hold) would mean ~9,700 individually-checked sentences — not something that can honestly be hand-verified at this session's scale. Built a tested conjugation engine instead, using the 3 fields the app's own vocabulary data already provides per verb (`en`, `perfekt` = e.g. "hat gemacht"/"ist gegangen", `praeteritum` = the ich/er Präteritum form) to derive all 6 persons across all 3 tenses.

#### How the engine works (all logic lives inline in `Thema_Sprech_Trainer.html`)
- **Perfekt**: trivial — the data's `perfekt` field is already a complete phrase ("hat gemacht", "hat sich angepasst", "hat eine Verbindung hergestellt"). Split off the aux word (hat/ist → conjugate via a standard HABEN/SEIN table) and keep the rest (participle + any fixed material) verbatim, substituting the reflexive pronoun (mich/dich/sich/uns/euch/sich) for `sich` where present. The participle never changes across persons, so no participle-level conjugation is needed at all.
- **Präteritum**: the data's `praeteritum` field's first word is already the correct ich/er form (e.g. "nahm ab", "passte sich an", "stellte eine Verbindung her"). Person-endings applied to that first word only, using the standard rule (weak/mixed '-te' stems get -st/-n/-t/-n; bare strong stems get -st/-en/-t/-en with epenthetic -e- for stems ending in d/t/s/ß/z, discovered via testing that epenthesis differs between "du" and "ihr" for sibilant-ending stems e.g. "aßest" vs "aßt"). Any trailing words (separable prefix, fixed idiom material) are kept as-is (with reflexive substitution), since German keeps that material in the same position for every person.
- **Präsens**: the only tense not directly derivable from the data — has to come from the infinitive. Built from: (1) a hardcoded table of genuinely irregular verbs (sein, haben, werden, wissen, tun, and the 6 modals); (2) a table of ~35 known present-tense stem-changing strong-verb bases (helfen→hilfst, lesen→liest, fahren→fährst, laufen→läufst, etc.), matched against the infinitive by longest suffix so prefixed/compound verbs (aufgeben, vergessen, besprechen, herunterladen) inherit their base verb's pattern automatically; (3) a fully regular fallback (stem + e/st/t/en/t/en, with d/t-epenthesis, s/ß/z/x-ending contraction, and an -eln → -le ich-form drop) for everything else. Whether a separable prefix should stay attached to the conjugated verb (inseparable, e.g. "vergisst") or move to the end as its own word (separable, e.g. "nehme ... ab") is decided by comparing the infinitive's last token against the trailing word already present in the Präteritum field, not by guessing — if the infinitive starts with that same trailing word, it's treated as detachable; the same conjugated form (with the prefix now excluded) is used, and the caller appends the trailing word(s) verbatim, the same as it already does for every other tense.

#### Bugs found and fixed during testing (before this ever reached the page)
Wrote the engine standalone first and ran it against the full 540-verb dataset plus targeted spot-checks, catching 3 real defects before integration:
1. Verbs whose Präteritum ich-form happens to end in "-te" (haben→hatte, werden→wurde, wissen→wusste, all 6 modals) were being misrouted into the regular weak-verb derivation path instead of the hardcoded irregular table, producing wrong forms like "Ich hate." and "Ich wusse." — fixed by checking the irregular/modal table before the weak-derivation fallback, not after.
2. `werden`'s Präteritum "wurde" ends in a bare vowel rather than "-te", which the du/wir/ihr/sie-ending logic didn't anticipate, producing "Wir wurdeen." (extra e) — fixed by broadening the "already-ends-in-a-vowel, no epenthesis needed" branch from specifically "-te" to any trailing "e".
3. Mixed verbs (denken, bringen, kennen, nennen, senden, and their compounds like verbringen, mitdenken, anerkennen, zurücksenden) have an ablauted Präteritum stem (dacht-, brach-, kannt-, nannt-) that is NOT the Präsens stem (denk-, bring-, kenn-, nenn-) — deriving Präsens from the Präteritum field (as the original design did) produced wrong forms like "Ich dache." instead of "Ich denke." Fixed by re-deriving Präsens from the infinitive for every verb, never from the Präteritum field, which incidentally also fixed a separate separable-prefix double-concatenation bug (e.g. "Ich abnehme ab." / "Ich umziehe um.") that only affected the ich/wir/ihr/sie forms of separable stem-changing verbs, since those persons fell through to a regular-conjugation fallback that wasn't applying the same prefix-detachment logic already used for du/er.

#### Testing
- Standalone Node.js testing of the engine against all 540 verbs: zero structural issues (no `undefined`, no unbalanced `<b>` tags, no triple-letter typos) across all 9,720 generated sentence-tense combinations.
- Manual verification of ~80 hand-picked verbs spanning every category (true weak, strong with each of the e→i/e→ie/a→ä/au→äu/o→ö present-tense stem-change groups, mixed, all irregulars/modals, separable, inseparable, reflexive, separable+reflexive combined, and multi-word idiom entries like "Verbindung herstellen"/"recht haben") against my own knowledge of German grammar — all correct after the 3 fixes above.
- Re-verified the identical checks live in the browser (`page.evaluate` calling the page's own `generateSentences`/`VERBS_ALL`, not a copy) after integrating into `Thema_Sprech_Trainer.html`: 9,720/9,720 checks clean, zero `pageerror` events.
- Headless-browser UI test: topic grid now shows 8 cards; opening "Häufige Wörter" shows a CEFR level filter (A1/A2/B1/B2/Alle, defaulting to A1 = 50 verbs) in addition to the existing tense selector; switching to "Alle" shows all 540; opening a verb and switching tense (Perfekt→Präsens→Präteritum) on "essen" correctly renders "Ich habe gegessen." → "Ich esse." → "Ich aß.".
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Known limitations (disclosed in-page, not silently hidden)
- Sentences use a bare "Subject + verb(+prefix)." template with no object — the user explicitly accepted this tradeoff (richer per-verb sentences aren't buildable by rule for 540 verbs without risking transitivity mismatches). The page shows an explanatory note when this topic is open.
- English translations show only the plain infinitive gloss ("to see") for all 3 tenses rather than a fully re-conjugated English sentence, since English irregular past-tense forms (go→went, see→saw, ...) aren't derivable from the German data and getting ~500 of them right by rule wasn't feasible either.
- A few entries inherit pre-existing quirks from the source vocabulary data itself (not introduced by this engine): `backen`'s Präteritum is given as the archaic "buk" rather than the modern "backte"; `joggen`'s auxiliary is ambiguously listed as "ist/hat" in the source data, and the engine deterministically picks "ist" for its Perfekt sentence.

#### Files Changed
- `Thema_Sprech_Trainer.html` (added `VERBS_ALL`, the conjugation engine, a CEFR level filter for this topic, and removed the now-superseded 5 hand-crafted "Häufige Wörter" verbs from Task 4)
- `sw.js` (regenerated: cache version bump)
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 4) — Thema_Sprech_Trainer.html: add "Häufige Wörter" (Common Words) topic

#### Task
User request: "Now under common words theme(🗣️ Themen-Sprechtrainer) add all the words based on theme selection like above" — add a new topic to the page, populated the same way as the existing 7 (5 verbs, 6 persons, all 3 tenses), covering high-frequency general-purpose verbs not already represented in the domain-specific topics (Familie, Arbeit, Einkaufen, Freizeit, Essen & Trinken, Reisen, Gesundheit).

#### What was built
- Added an 8th topic, `id:'haeufig'`, title "Häufige Wörter", icon `megaphone`, with 5 of the most fundamental/highest-frequency German verbs not covered elsewhere in the page: `sein` (to be), `haben` (to have), `machen` (to do/make), `sagen` (to say), `sehen` (to see) — 30 new person-sentences × 3 tenses = 90 new sentence variants, all hand-conjugated and checked like every other verb on this page.
- `sein` and `haben` needed special care as they're both highly irregular (`sein`: bin/bist/ist/sind/seid/sind, war/warst/war/waren/wart/waren; `haben`: habe/hast/hat/haben/habt/haben, hatte/hattest/hatte/hatten/hattet/hatten) and, unusually, `sein` is its own Perfekt auxiliary (`ich bin ... gewesen`, not `ich habe ... gewesen`). The Perfekt bolding for `sein` was kept consistent with every other verb on the page (only the participle `gewesen` bolded, not the auxiliary) — an early draft bolded the auxiliary too, which was inconsistent with the rest of the file and got corrected before verifying.
- No new code paths were needed — the topic slots directly into the existing `THEMEN` array and is picked up automatically by the topic grid, tense selector, and all playback/loop/record features added in the previous task.

#### Testing
- `node --check` on the extracted page script.
- A Node script parsed the live `THEMEN` array: 8 topics, 40 verbs, 240 person-sentences, all 720 tense-variant fields (240 × 3) present and non-empty.
- Headless-browser test: confirmed the topic grid now shows 8 cards ending with "Häufige Wörter", opening it shows exactly the 5 expected verbs (sein, haben, machen, sagen, sehen), and switching Perfekt → Präsens → Präteritum on `sein` correctly renders "Ich bin müde gewesen." → "Ich bin müde." → "Ich war müde." with no console errors.
- Full-site smoke sweep (24 pages): zero `pageerror` events.
- Re-ran `scripts/build.py` to bump the service-worker cache version (content changed, not just the file list, so a bump is needed to bust stale cached copies of this page for returning users).

#### Files Changed
- `Thema_Sprech_Trainer.html`
- `sw.js` (regenerated: cache version bump)
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 3) — Thema_Sprech_Trainer.html: add Präsens + Präteritum tenses

#### Task
User request: "In Thema_Sprech_Trainer, each word i should need present, past tense lb and la. Ich, er, sie, ... ihr option to select based on that senstence can see play audio" — clarified via follow-up questions to mean: add both Präsens (present) and Präteritum (simple past, e.g. "änderte") alongside the existing Perfekt ("hat geändert"), with a way to select which tense's sentences are shown/played, for all 6 persons per verb.

#### What was built
- Restructured every sentence entry in the `THEMEN` data (35 verbs × 6 persons = 210 entries) from a single `{p, de, en}` shape to `{p, praes:{de,en}, praet:{de,en}, perf:{de,en}}` — 3 tense variants per person, 630 sentences total. The existing Perfekt sentences were kept as `perf`; Präsens and Präteritum were newly hand-written to match the same real-world content (same object/adverbial) as the existing Perfekt sentence, just re-conjugated.
- Each verb's conjugation was worked out individually (not templated) to get irregular forms right: stem-vowel changes in Präsens (e.g. `helfen`→`hilfst`, `lesen`→`liest`, `schlafen`→`schläfst`, `essen`→`isst`), strong-verb Präteritum stems (`half`, `las`, `schlief`, `aß`, `trank`, `flog`, `fuhr`, `ging`, `schwamm`, ...), separable-verb prefix placement in all three tenses (e.g. Präsens `Ich rufe meine Schwester an`, Präteritum `Ich rief meine Schwester an`, alongside the existing Perfekt `Ich habe meine Schwester angerufen`), and reflexive pronoun agreement for `sich erkälten` across all three tenses.
- Added a 3-way tense selector (Präsens / Präteritum / Perfekt, `.tense-row`/`.tense-btn`) shown above the verb list for the open topic; switching tense re-renders all 6 sentence rows for every verb in that topic and updates the subtitle to show which tense is active.
- Wired the selected tense into every consumer of sentence text: `renderSentenceRowHTML()`, `playSentence()`, `runLoopStep()` (single-sentence loop), `runAllPlayStep()` (the "Play All 6" feature), and the record-and-compare speech-recognition diff target — all now read `s[curTense].de`/`.en` instead of a single hardcoded `s.de`/`.en`.

#### Testing
- `node --check` on the extracted page script (syntax validation).
- A Node script parsed the live `THEMEN` array and confirmed all 35 verbs × 6 persons have non-empty `de`/`en` text for all 3 tenses (630/630 present, 0 missing).
- Headless-browser test: opened a topic, confirmed the default tense is Perfekt (unchanged default), switched to Präsens and Präteritum and confirmed the rendered German sentence text changed correctly each time (verified against the known-correct conjugations above, e.g. `besuchen`: Perfekt "Ich habe meine Großeltern besucht." → Präsens "Ich besuche meine Großeltern." → Präteritum "Ich besuchte meine Großeltern.").
- Headless-browser test with a `speechSynthesis.speak` spy confirmed the audio-play button speaks the text of the currently selected tense (tested with Präteritum active — spoke "Ich besuchte meine Großeltern.", not the Perfekt text), confirming the loop/play-all/record features aren't silently stuck on the old Perfekt text.
- Full-site smoke sweep (24 pages): zero `pageerror` events.

#### Files Changed
- `Thema_Sprech_Trainer.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 (Task 2) — Fix: missing English translations in konnektoren_referenz.html quiz

#### Task
User reported (with a screenshot showing "FRAGE 1 / 10 — Welcher Konnektor schickt das Verb ans SATZENDE?") that a page's practice quiz shows no English translation of the German example.

#### Root cause
`konnektoren_referenz.html`'s main reference cards already show German examples with an English translation (styled via the existing `.en` CSS class), but the separate "🎯 Schnell-Quiz & Drill" quiz section (`DRILL_ITEMS` array, `showQuestion()`) never had an `en` field at all — none of its 10 questions had an English translation, on any of the Easy/Medium/Hard modes.

#### Fix
- Added an `en` field with a real, hand-written English translation/gloss to all 10 `DRILL_ITEMS` entries (fill-in-the-blank items keep the `___` blank and note the relevant grammar point in parentheses, e.g. "(whether)", "(in order to)", "(the ... the)" — without giving away the answer).
- Added a new `#quizEn` element (styled `.quiz-en`, purple italic, matching the app's existing translation-line convention) between the question and the hint line.
- `showQuestion()` now sets `quizEn.textContent = item.en`; cleared on the quiz-complete screen.

#### Testing
- Headless-browser walkthrough of all 10 quiz questions (clicking through the Drill tab, `#tabDrill`) confirmed every question now shows a correct, non-empty English line alongside the German question, with zero `pageerror` events.
- Full-site sweep (24 pages) after the change: zero `pageerror` events.

#### Files Changed
- `konnektoren_referenz.html`
- `PROJECT_KNOWLEDGE.md` (this entry)

---

### 2026-09-22 — New page: Thema_Sprech_Trainer.html (Themen-Sprechtrainer)

#### Task
User request: "need to create the page that contain basic german speaking based on thema selection. there i click the word it contain example of communication using ich, er, sie, .. past sensentence. Audio option read the senstence and loop it." — a new topic-based speaking-practice page, plus an open invitation to add worthwhile extra features.

#### What was built
- New file `Thema_Sprech_Trainer.html`, linked from `index.html`'s dashboard under "Lernen (Core Learning)" (card uses the existing `module-speak` accent class).
- 7 topics (`familie`, `arbeit`, `einkaufen`, `freizeit`, `essen`, `reisen`, `gesundheit`) × 5 verbs each × 6 persons (ich/du/er-sie-es/wir/ihr/sie-Pl.) = 210 hand-written Perfekt-tense example sentences, each with the conjugated verb form bolded and an English translation. haben/sein selection, separable-verb Partizip II placement, and reflexive-pronoun agreement were manually checked per sentence.
- Per-sentence actions: single play (Web Speech `SpeechSynthesisUtterance`, `de-DE`), loop play (repeats with a pause, matches the existing Hörverstehen-page loop pattern), and record-and-compare ("shadow speaking" — `SpeechRecognition` + the app's existing `diffHighlight()` word-diff, showing exactly where the user's spoken attempt diverges from the target sentence).
- Added feature beyond the literal request: a "▶️ Alle 6 nacheinander abspielen" (Play All) button per verb that plays all 6 person-sentences back to back with the currently-playing row highlighted, and a stop/resume toggle.
- Simple per-verb progress tracking (`thema_sprech_progress_v1` in localStorage; "geübt" checkmark + a per-topic "X / 5 geübt" counter on the topic grid). Deliberately NOT wired into SRSEngine's box-schedule — these are one-off completion flags, not spaced-repetition items, and forcing them into that shape would have been dishonest about what the feature actually does.
- Page has no own `.app-layout`, so it is auto-wrapped by `js/app-shell.js`'s shared sidebar/header/theme-toggle (`renderAppShell()`).

#### Bug found and fixed: page-local dark-theme mismatch
While testing the new page's dark mode, found its own inline `<style>` block used a page-local `html.dark-theme { --card:...; --ink:...; }` override block, populated by a page-local `initTheme()`/`toggleTheme()` pair (`document.documentElement.classList.toggle('dark-theme')`). This class is never set by the *real* theme button — that one is injected by `js/app-shell.js`'s shared shell and instead sets `data-theme="dark"` on `<body>` (the mechanism `css/design-system.css` actually reads). Result: clicking the real, visible theme toggle correctly darkened the shared shell and page background, but every one of the page's own custom-styled elements (topic cards, verb cards, sentence rows, buttons) stayed light-themed.
- **Fix**: changed the selector to `html.dark-theme, body[data-theme="dark"]` so the page's custom CSS variables respond to the attribute the real toggle sets. Removed the now-fully-dead `toggleTheme()`/`initTheme()` functions entirely — `js/app-shell.js` already applies `data-theme` globally from `localStorage['de_theme']` on every page load (confirmed at `js/app-shell.js:330-337`), so the page needed no theme init code of its own.
- Verified via headless browser: after clicking `#themeToggleBtn`, `body[data-theme]` is `"dark"`, body background is `rgb(15,23,42)`, and `.thema-card` background is `rgb(30,41,59)` (the intended dark card color) — confirms the fix.
- **The same underlying bug pattern (a page-local theme class the real shared toggle never sets) also exists, unfixed, in `A1_Sprech_Pruefungs_Simulator.html`** (its own `applyTheme()` sets `document.body.classList.add('dark')`, a class `css/design-system.css` never reads either) and likely `Sprech_Pruefungs_Simulator.html` (built from the same template, not independently re-verified). Left unfixed there — out of scope for this task, since those pages were not touched otherwise — and logged below in Known Bugs.

#### Testing
- Headless-browser (`Playwright` + local `chromium`) smoke test: opened a topic, expanded a verb card, confirmed the "Play All" and "Als geübt markieren" buttons render, no `pageerror` events fired.
- Full-site sweep across all 24 `*.html` pages after the change (including the new page and the `index.html`/`sw.js` edits): zero `pageerror` events.
- `scripts/build.py` re-run to regenerate `sw.js` (bumped `CACHE_NAME` to `v43`, added `./Thema_Sprech_Trainer.html` to `urlsToCache`).

#### Files Changed
- `Thema_Sprech_Trainer.html` (new)
- `index.html` (new dashboard card)
- `sw.js` (regenerated via `scripts/build.py`)
- `PROJECT_KNOWLEDGE.md` (this entry; Known Bugs section)

---

### 2026-09-19 (Task 7) — AI: Gemini 3.8 Flash

#### Task
Implemented a new interactive question format — **Satz-Baukasten (Pick & Build Sentence from English Translation)** — in `Grammatik_Regel_Trainer.html`. Users are presented with an English sentence prompt and must pick/assemble scrambled German word chips from a bank below to construct the grammatically correct German sentence.

#### Files Changed
- `Grammatik_Regel_Trainer.html` (updated with `BUILD_GENERATORS` across all 16 rules, format switcher, interactive token bank/slots handlers, and enhanced keyboard support)
- `PROJECT_KNOWLEDGE.md` (updated Section 28)

#### Changes
- Created `BUILD_GENERATORS` containing sentence-builder templates across all 16 grammar rules, complete with English prompts, tokenized German chunks, target sentences, and rule explanations.
- Added interactive drill format selector in the HUD:
  - `🔀 Mixed`: Dynamically alternates between Multiple-Choice Gap Fill and Sentence-Builder questions.
  - `🔤 Gap Fill`: Classic multiple-choice 1-4 gap-fill questions.
  - `🧩 Satz-Baukasten`: Pick & Build sentence assembly from English.
- Built interactive UI components:
  - `.en-challenge-box`: Prominently displays the English source sentence with a translation challenge badge.
  - `#buildArea`: Dynamic dashed drop-zone displaying placed German tokens with removal on click.
  - `#bankArea`: Scrambled bank of clickable word chips (`.wordchip.inbank`).
  - Action row with `↺ Reset Words` and `✓ Check Sentence`.
  - Native German audio playback via `🔊 Satz auf Deutsch anhören` upon completion.
- Enhanced keyboard controls: `Enter` triggers sentence check before answer and advances to next question after answer.

#### Testing
- Verified HTML structure and styling via Python `HTMLParser`.
- Executed comprehensive Node.js tests verifying:
  - `setDrillFormat('build')` generates valid sentence builder exercises across all 16 rules.
  - `setDrillFormat('choice')` generates valid gap-fill questions across all 16 rules.
  - `setDrillFormat('mixed')` randomly balances both question types in endless marathon mode.

---

### 2026-09-19 (Task 6) — AI: Gemini 3.8 Flash

#### Task
Expanded `Grammatik_Regel_Trainer.html` to cover German paragraph structure (Absatzbau & Textverknüpfung) and 5 other essential missing German grammar rules (bringing the total from 10 to 16 pillars), complete with rule guides, formula boxes, reference tables, audio speech examples, static drills, and infinite dynamic question generators in `DYNAMIC_GENERATORS`.

#### Files Changed
- `Grammatik_Regel_Trainer.html` (updated with Rules 11 to 16 definitions, UI chips, stats view, and dynamic procedural generators)
- `PROJECT_KNOWLEDGE.md` (updated sections 4, 28)

#### Changes
- Identified and added 6 new critical grammar pillars to `GRAMMAR_RULES` and `DYNAMIC_GENERATORS`:
  11. **Paragraph Making & Cohesion (Absatzbau & Textverknüpfung):** The 4-step German paragraph blueprint (Thesensatz, Begründung, Belege/Beispiel, Fazit) and discourse transition connectors (*zunächst, darüber hinaus, einerseits... andererseits, zusammenfassend lässt sich sagen*).
  12. **Kommasetzung (German Comma Rules):** The 4 mandatory German comma rules (Nebensätze with *weil/dass/wenn*, Infinitivgruppen with *zu*, Relativsätze, and contrasting coordinating conjunctions *aber/sondern*).
  13. **N-Deklination (Weak Masculine Nouns):** Living masculine nouns (*der Kollege, der Kunde, der Herr, der Nachbar, der Praktikant*) taking *-(e)n* in all cases except Nominative singular.
  14. **Da- & Wo-Komposita (Pronominaladverbien):** Rules for things vs. people (*worauf / darauf* for things vs. *auf wen / auf ihn* for people).
  15. **Temporale Konnektoren (als vs. wenn, während, nachdem, bevor):** One-time past event (*als*) vs. repeated past or present/future events (*wenn*), anteriority with *nachdem*, and simultaneity with *während*.
  16. **Modalverben Nuancen (müssen vs. nicht dürfen vs. nicht brauchen zu):** Critical difference between obligation (*müssen*), permission/prohibition (*nicht dürfen* = strictly forbidden), and optionality (*nicht müssen / nicht brauchen zu* = don't have to).
- Added procedural question generator functions for all 6 new rules in `DYNAMIC_GENERATORS` (`r11_paragraph`, `r12_comma`, `r13_ndeklination`, `r14_pronominaladverb`, `r15_temporale`, `r16_modalverb`).
- Updated "All 10 Rules Mixed" to "All 16 Rules Mixed (Endless Marathon)".
- Updated Mastery and Progress view to dynamically compute stats across all 16 pillars (`GRAMMAR_RULES.length`).

#### Testing
- Verified `GRAMMAR_RULES` and `DYNAMIC_GENERATORS` length (16 each) and evaluated script in Node.js environment.
- Tested generating questions across all 16 rules and ran 50 randomized marathon queries with 100% success.
- Verified HTML markup integrity using Python `HTMLParser` without errors.

---

### 2026-09-19 (Task 5) — AI: Gemini 3.8 Flash

#### Task
Implemented an Infinite Dynamic Question Generator in `Grammatik_Regel_Trainer.html` allowing the learner to practice all 10 German grammar rules indefinitely without repeating or hitting an end-of-drill barrier.

#### Files Changed
- `Grammatik_Regel_Trainer.html` (updated with `DYNAMIC_GENERATORS`, `generateInfiniteQuestion`, Endless Mode, live performance HUD, and keyboard shortcuts)
- `PROJECT_KNOWLEDGE.md` (updated Section 28)

#### Changes
- Engineered `DYNAMIC_GENERATORS` encompassing procedural combinatoric generators for all 10 grammar pillars (verb positions, 4 cases, prepositions/dual prepositions, adjective declensions, Konjunktiv II, passive voice, relative clauses, infinitive mit zu, double connectors, reflexive verbs).
- Added `generateInfiniteQuestion(ruleId)` with automatic option shuffling, providing endless permutations on the fly.
- Introduced **"♾️ Endless Mode"** allowing indefinite, continuous grammar practice alongside a 10-question sprint option.
- Added **"🎲 All 10 Rules Mixed (Endless Marathon)"** rule chip, dynamically pulling across all grammar pillars simultaneously.
- Implemented real-time Performance HUD tracking total questions answered, current streak, best streak, and session accuracy.
- Added quick keyboard hotkeys (`1`, `2`, `3`, `4` for option selection; `Enter` for next question).

#### Testing
- Ran Node.js sandbox loop generating 50 dynamic questions across all rules without errors.
- Verified HTML structure and JavaScript execution in mock DOM environment.

---

### 2026-09-19 (Task 4) — AI: Gemini 3.8 Flash

#### Task
Implemented comprehensive learning materials, grammar rule training, oral exam simulator, and app suite integration to ensure the learner can pass CEFR A2/B1 exams, speak fluent German, and train all 10 core German grammar rules.

#### Files Changed
- `Grammatik_Regel_Trainer.html` (created, 50 KB standalone interactive grammar studio)
- `Sprech_Pruefungs_Simulator.html` (created, 36 KB oral exam simulator & written cloze suite)
- `index.html` (updated with Suite Navigation Launcher, 6 reading passages, exam links)
- `deutsch-coach.html` (updated, diverged (index is UI, coach is legacy data payload) copy kept in sync)
- `sw.js` (updated to v2, caching all suite applications offline)
- `German_A2_Practice_Studio.html` (updated with Suite Navigation Bar)
- `Verb_Transformation_Trainer.html` (updated with Suite Navigation Bar)
- `Nomen_Adjektiv_Trainer.html` (updated with Suite Navigation Bar)
- `Satzbau_Trainer.html` (updated with Suite Navigation Bar)
- `konnektoren_referenz.html` (updated with Suite Navigation Bar)
- `Verben_Hoeren_EN_DE.html` (updated with Suite Navigation Bar)
- `PROJECT_KNOWLEDGE.md` (updated sections 4, 16, 28)

#### Changes
- Created `Grammatik_Regel_Trainer.html` covering the 10 foundational German grammar pillars:
  1. Verb Position & Satzklammer (V2, Nebensatz verb-end, ADUSO, Inversion, TeKaMoLo)
  2. Die 4 Fälle (Nominativ, Akkusativ, Dativ with Dativ verbs, Genitiv)
  3. Präpositionen (Akkusativ DOGFU, Dativ ABMNSVZ, Wechselpräpositionen Wo vs Wohin, fixed prepositions)
  4. Adjektiv-Endungen (Weak, Mixed, and Strong declensions)
  5. Konjunktiv II (Polite spoken requests, wishes, advice: könnte, würde, hätte, wäre)
  6. Passiv (Präsens, Präteritum, Modalverb-Passiv)
  7. Relativsätze (Relative clauses with case functions & prepositions)
  8. Infinitiv mit „zu“ & „um ... zu“ vs. „damit“
  9. Zweiteilige Konnektoren (nicht nur... sondern auch, sowohl... als auch, zwar... aber, etc.)
  10. Reflexive Verben (Akkusativ vs. Dativ reflexive: mich vs mir)
  Each pillar includes clear visual matrices, formula summaries, native audio speech examples, and interactive rapid-fire drills with rule explanations and Leitner box mastery tracking (`gp_progress_v1`).
- Created `Sprech_Pruefungs_Simulator.html` featuring:
  - Oral Exam Teil 1 (Self-introduction formula + simulated spontaneous examiner questions with audio prompts and model responses).
  - Oral Exam Teil 2 (5-step B1 presentation framework across everyday exam topics with audio Redemittel).
  - Oral Exam Teil 3 (Interactive partner dialogue simulator for collaborative planning and scheduling).
  - Spoken Redemittel Vault (Categorized conversational audio soundboard).
  - Written Exam Cloze Suite (Sprachbausteine Teil 1 letter with 6 grammar gap questions and feedback).
  - Brief-Schmiede (Letter builder for formal excuses, complaints, apartment inquiries with 3-Leitpunkte checklists).
- Integrated universal **Suite Navigation Hub** across all 10 HTML tools, ending the previous isolation where apps could not navigate to each other.
- Upgraded Service Worker (`sw.js`) to cache the entire suite for 100% offline availability.
- Expanded `READING_PASSAGES` in `index.html` from 3 to 6 authentic exam passages and added direct links from the exam dashboard to the Grammar and Speaking tools.

#### Testing
- Validated all 10 HTML files via Python HTMLParser with zero syntax errors.
- Verified SHA-256 byte-identity of `index.html` and `deutsch-coach.html` (`1F1D3A8A...`).

---

### 2026-09-19 (Task 3) — AI: Gemini 3.8 Flash

#### Task
Resolved verb deficit in the main PWA application (`index.html` and `deutsch-coach.html`) where the Verben category was showing only 139 verbs instead of the full 500+ master verb collection.

#### Files Changed
- `index.html` (updated, 2939 lines, 283 KB)
- `deutsch-coach.html` (updated, diverged (index is UI, coach is legacy data payload) copy kept in sync)
- `PROJECT_KNOWLEDGE.md` (updated sections 4, 10, 28, 29)

#### Changes
- Injected `MASTER_EXTRA_VERBS` (383 missing verbs from the 503 master collection) into `index.html` and `deutsch-coach.html`.
- Unified verb coverage across the entire project: `ALL_CARDS` in the main app now contains 522 total verbs (covering all 503 verbs from `Verb_Transformation_Trainer.html` + 18 original contextual verbs), bringing total cards in the main app from 836 to 1,219 cards.
- Assigned contextual topics (`schule`, `arbeit`, `wohnen`, `essen`, `einkaufen`, `gesundheit`, `reisen`, etc.), level classifications, Präteritum, Perfekt, noun derivations, and icons.
- Generated unique collision-free UIDs for all 1,219 cards.
- Validated byte identity between `index.html` and `deutsch-coach.html` via SHA-256 (`3e01250278901ecc...`).

#### Bugs Fixed
- Fixed category count limitation in `index.html` where Verben was stuck at 139 cards. Now accurately displays and drills 522 verbs.

#### New Knowledge
See Section 29 entry regarding `index.html` verb population and category expansion.

#### Architectural Changes
None (utilized existing `ALL_CARDS.push` extension hook as intended by the original architecture).

#### Important Decisions
Preserved all 18 existing contextual verbs in `index.html` while adding the 383 missing verbs from the 503 master list, resulting in 522 total verbs with zero data loss. Maintained byte identity between `index.html` and `deutsch-coach.html`.

#### Testing
- Ran Node.js sandbox test with mock DOM confirming all 10 `<script>` blocks execute without runtime errors.
- Verified `ALL_CARDS.length === 1219` and `ALL_CARDS.filter(c => c.cat === 'v').length === 522`.
- Verified all 1,219 UIDs are unique.
- Confirmed SHA-256 hash match between `index.html` and `deutsch-coach.html`.

#### Remaining Issues
- Standalone trainers remain unlisted in `sw.js` `APP_SHELL`.

---

### 2026-09-19 (Task 2) — AI: Gemini 3.8 Flash

#### Task
Referenced `C:\Users\arunr\Downloads\German_A2_Practice_Template.xlsx` and designed/created an innovative, comprehensive single-page interactive learning environment (`German_A2_Practice_Studio.html`) that brings all 7 sheets of the A2 curriculum template to life.

#### Files Changed
- `German_A2_Practice_Studio.html` (created & upgraded, 218 KB single-file application with all 503 verbs)
- `German_A2_Practice_Template.xlsx` (copied to workspace root)
- `PROJECT_KNOWLEDGE.md` (updated sections 4, 10, 14, 28, 29)

#### Changes
- Built and expanded `German_A2_Practice_Studio.html` with 8 distinct interactive hubs matching the curriculum structure:
  1. *Verben-Labor:* Complete 503-verb repository (219 A2 verbs + 284 B1 verbs) with full 6-person conjugation matrix, personal ending highlights, 4 tense/mood forms (Präsens, Perfekt, Präteritum, Konjunktiv II), weak/strong/mixed classification filter, A2/B1 level toggle, instant search, and related noun bridge.
  2. *Reflexiv-Spiegel:* Reflexive pronoun mirror chart (ich→mich, du→dich, etc.) and reflexive verbs with preposition hints.
  3. *Trennbar-Detacher:* Visual prefix separation diagrams showing main clause Satzklammer movement and Perfekt `-ge-` insertion.
  4. *der·das·die Farb-Sortierung:* Color-coded columns (Blue der, Amber das, Red die), English cognates, and typical gender suffix rules.
  5. *Adjektiv-Endungen Kompass:* 3-parameter interactive calculator (Article type × Gender × Case) with live rule generation, sentence generation, and complete reference tables.
  6. *Imperativ-Schmiede:* 3-way command triad (du, ihr, Sie) with real situational example sentences.
  7. *Kategorieller Wortschatz:* Thematic drawer for personality traits, emotions, time adverbs, conversational particles, and connectors.
  8. *Smart-Drill Quiz:* Cross-module rapid-fire sprint testing verb conjugation, separable verbs, articles, adjective endings, and imperatives with instant feedback.
- Integrated Web Speech API (`speechSynthesis`) for native German pronunciation and audio verification across every single vocabulary card.
- Implemented local persistence via `a2_studio_progress_v1`.
- Copied source workbook `German_A2_Practice_Template.xlsx` into project root alongside B1 templates.

#### Bugs Fixed
None.

#### New Knowledge
See Section 29 entry regarding the 7 pedagogical pillars of the A2 course template and their connection to Arun's custom vocabulary list.

#### Architectural Changes
Added `German_A2_Practice_Studio.html` following the project's zero-build, single-file HTML architecture and vintage paper design language (`--paper`, `--ink`, `--card`, `--gold`, `--red`, `--blue`).

#### Important Decisions
Modeled all 7 sheets from `German_A2_Practice_Template.xlsx` directly into modular interactive views rather than a static table or drill-only interface, enabling both exploratory reference and active recall practice.

#### Testing
- Parsed and verified full HTML/JS integrity via Python HTMLParser.
- Confirmed valid responsive styling across desktop and mobile breakpoints.
- Verified Web Speech API integration for speech output.

#### Remaining Issues
- RESOLVED later: `scripts/build.py` puts every HTML page and shared asset into `sw.js`. (Original:) Standalone trainers (including the new A2 Practice Studio) are not yet in `sw.js`'s `APP_SHELL` cache list.

---

### 2026-09-19 — AI: Gemini 3.8 Flash

#### Task
Initial inspection, codebase-to-documentation reconciliation, verification of all open "UNKNOWN" items in `PROJECT_KNOWLEDGE.md`, and onboarding into the project's shared knowledge system.

#### Files Changed
- `PROJECT_KNOWLEDGE.md`

No application source files were modified.

#### Changes
- Reconciled workspace environment and git status: noted transition from historical Linux sandbox (`/mnt/user-data/outputs/`) to Windows workspace (`C:\Users\arunr\OneDrive\Documents\Projects\AIDrive\Deutsch_Coach_Project`), and confirmed no `.git` repository exists in the current project directory.
- Resolved all 5 open "UNKNOWN — requires verification" items by direct source inspection:
  1. Main app `uid` generation formula verified (`(c.level+"|"+c.topic+"|"+c.w).replace(/\s+/g,"_")` with duplicate disambiguation).
  2. `Verb_Transformation_Trainer.html` verb `uid` verified (`${v.level}|${v.inf}`).
  3. `Nomen_Adjektiv_Trainer.html` noun and adjective `uid` formulas verified (`n|${v.level}|${v.sg}` and `a|${v.w}`).
  4. Exact `localStorage` keys verified across all apps (`dc_progress_v1`, `dc_meta_v1`, `vt_progress_v1`, `na_progress_v1`).
  5. Security of Schreiben view free-text input verified against `index.html` (only touches `.textContent` for word/character counts; no XSS vector).
- Documented key state variables for `Verben_Hoeren_EN_DE.html`.
- Confirmed SHA-256 byte identity between `index.html` and `deutsch-coach.html`.

#### Bugs Fixed
None (verification and documentation reconciliation only).

#### New Knowledge
See Section 29 (AI-Discovered Knowledge) below for itemized entries on UID formulas, verified storage keys, free-text XSS safety confirmation, and local environment/git status.

#### Architectural Changes
None.

#### Important Decisions
Preserved all architectural principles (zero build tools, single-file HTML apps, independent progress keys) while eliminating uncertainties in data models and persistence schemas to ensure seamless handoff for subsequent tasks.

#### Testing
- Performed SHA-256 hash validation confirming `index.html` and `deutsch-coach.html` are identical.
- Direct regex and source inspection of `index.html`, `Verb_Transformation_Trainer.html`, `Nomen_Adjektiv_Trainer.html`, and `Verben_Hoeren_EN_DE.html`.
- Executed `git status` confirming absence of local git repository.

#### Remaining Issues
- UI language inconsistency across apps: `Verb_Transformation_Trainer.html` has English UI chrome; other apps remain in German.
- Service worker `APP_SHELL` in `sw.js` caches only the main app, leaving standalone trainers uncached offline.
- Spaced-repetition progress remains unshared across separate apps.
- Local repository is not connected to GitHub remote `github.com/ArunVivekanandhan/deutsch-coach`.

---

### 2026 (exact date unavailable in this session) — AI: Claude (Sonnet 5)

#### Task
Create the initial `PROJECT_KNOWLEDGE.md` for this project from scratch, by inspecting the actual
codebase, per explicit instructions to document-only (no code changes, no bug fixes, no new features).

#### Files Changed
- `PROJECT_KNOWLEDGE.md` (created).

No application/source files were modified, per the task's explicit constraints.

#### Changes
Full initial documentation pass: inventoried all 17 files in `/mnt/user-data/outputs`, confirmed
`index.html`/`deutsch-coach.html` are diverged (index is UI, coach is legacy data payload) duplicates, extracted the function/constant
inventory of all 5 interactive apps, read the PWA manifest and service worker in full, sampled the data
schemas of every app's embedded vocabulary array, confirmed the Excel workbooks' sheet structures, and
wrote all 29 sections above from that direct inspection.

#### Bugs Fixed
None (out of scope for this task).

#### New Knowledge
See Section 29 (AI-Discovered Knowledge) below for the itemized discoveries from this pass — most
notably the complete lack of shared code/data across the 5 apps, the 3 independently-drifted spaced-
repetition engines, the disconnected `.git` repo, and the UI-language inconsistency between the just-
translated Verb trainer and every other app.

#### Architectural Changes
None (documentation only).

#### Important Decisions
Chose to mark several specifics as "UNKNOWN — requires verification" (exact `localStorage` key
constants for the main app and the Nomen/Adjektiv trainer, the main app's card `uid` formula, the
Verb trainer's `uid` formula, whether the Schreiben view's free-text input is XSS-safe) rather than
guess, per the explicit instruction not to document assumptions as facts. A future AI should resolve
these by direct source inspection rather than trusting this note indefinitely.

#### Testing
No code was changed, so no functional testing was performed. This document's factual claims were
cross-checked against direct `grep`/`view`/`diff` output captured during the same session, not against
memory of earlier sessions.

#### Remaining Issues
All items in Sections 18, 19, and 26 remain open. The "UNKNOWN — requires verification" items listed
above are the most actionable next steps for whichever AI next touches the affected files.

---

### 2026-09-21/22 — AI: Claude Sonnet 5, branch `feature/production-learning-platform`

#### Task
A long multi-part session: (1) a series of live bug reports from the user working through the app
(voice dropdown, dashboard stats, several crash-broken pages), fixed one at a time with headless-
browser verification each time; (2) a merge of a large parallel refactor happening on `main` at the
same time (another AI session extracting shared `js/*.js` files, which repeatedly dropped code in the
process); (3) an explicit, large product brief asking for a full "premium learning platform"
transformation, worked as far as this session's budget allowed rather than attempted in full.

#### Files Changed (all verified in a real headless Chromium browser, not just read)
`Verb_Transformation_Trainer.html`, `Nomen_Adjektiv_Trainer.html`, `Wortschatz_Master_Grid.html`,
`German_Grammar_Cheat_Codes.html`, `Sprech_Pruefungs_Simulator.html`, `Continuous_Verb_Speaker.html`,
`Verben_Hoeren_EN_DE.html`, `deutsch-coach.html`, `index.html`, `js/tts-engine.js`, `js/app-shell.js`,
`js/srs-engine.js` (added by the parallel session, consumed here), `js/progress-aggregator.js` (new),
`sw.js`, `scripts/build.py` (moved + fixed), `PROJECT_KNOWLEDGE.md`. ~70 dead/one-off files moved to
`/archive` (see `archive/README.md`); none deleted.

#### Changes — bug fixes (each verified with a headless browser, console errors captured before/after)
- Restored ~8 functions/data blocks the parallel refactor dropped while extracting shared files
  (`meaningHTML`, `typLabel`/`typLabelNoun`/`typLabelAdj`, `PREFIX_DB`, `onVoiceChanged`,
  `testPronunciation`, `escapeQuotes`, the `.forEach(v => v.uid = ...)` uid-assignment lines whose
  absence silently collapsed every practice session to 1 card because every item shared
  `uid: undefined`) across `Verb_Transformation_Trainer.html` and `Nomen_Adjektiv_Trainer.html`.
- Fixed the voice-selection system in `js/tts-engine.js`: the `#voiceSelect` dropdown was never
  actually populated with `<option>` elements (even when voices existed), `#voiceWarn` polled forever
  with no timeout/fallback message, and — found via a mocked incremental-voice-list test — polling
  stopped the instant it saw *any* voice, which on some systems (Windows especially) means it locks
  onto a single default voice before the rest of the installed list loads.
- Fixed `deutsch-coach.html` (the main app): a `const todayISO` collided with `gamification.js`'s
  global `function todayISO()` (different, UTC-vs-local semantics — kept the correct local-time one
  under a new name rather than falling back to the colliding UTC version), and 5 copies of a stray
  incomplete `const skipBtn` line (no initializer) were silently killing the surrounding `<script>`
  block, which is also why `poolForLevel` looked "not defined" (declared in that same dead block).
- Fixed `Continuous_Verb_Speaker.html`/`Verben_Hoeren_EN_DE.html`: both declare their own richer
  dual-language (`deVoices`/`enVoices`) voice picker that collided with `js/tts-engine.js`'s own
  `let deVoices` (a hard `SyntaxError`, not a warning) — renamed the page-local variable rather than
  removing either implementation, since the pages' own logic is more capable than the shared one.
- Fixed `Sprech_Pruefungs_Simulator.html`/`German_Grammar_Cheat_Codes.html`: both had
  `document.addEventListener('DOMContentLoaded', function(){ ... };` — a `};` where `});` was needed,
  killing the whole script.
- Fixed `Wortschatz_Master_Grid.html`: a stray `` `r`n `` literal (Windows/PowerShell find-replace
  artifact) inside a template literal broke the script at parse time; underneath that, the code
  reading `NOUNS`/`ADJS` used field names (`n.singular`/`n.article`/`n.plural`/`a.word`/`a.super`)
  that don't match the real schema (`n.sg`/`n.a`/`n.pl`/`a.w`/`a.sup`), so every noun/adjective got
  `primaryWord: undefined` and crashed the sort. Also found and fixed a real regression from the
  refactor: `KNOWN_SISTER_VERBS` entries became `{v, en, ta}` objects but search/render/
  `getSisterMeaning` still expected plain strings — crashed the search box on every keystroke and
  printed "[object Object]" for two of three sister-verb meanings.
- **The mobile hamburger menu never worked, anywhere**, discovered while adding ARIA labels:
  `js/app-shell.js` looked up the sidebar via `document.getElementById('app-sidebar')`, but the
  sidebar's actual `id` is `'sidebar'` (`app-sidebar` is its CSS *class*). Fixed; verified the drawer
  actually opens at a 375px viewport.

#### Changes — progress unification (Section 14 has the full, verified breakdown)
Added `js/progress-aggregator.js`: aggregates only the 3 genuinely SRS-shaped progress stores
(`dc`/`na`/`vt`) into real due/difficult/mastered/reviewed counts, reusing the already-tested
`SRSEngine.Engine` class (read-only, no schema changes, no writes). Deliberately does NOT blend in
`gp_progress_v1`/`sb_progress_v1`/studio-completion data, since those measure different things and
mixing them would itself be a form of fake statistics. Replaced three separate instances of fabricated
numbers with this real data: (1) the shared sidebar's "Level Progress" bars, which cascaded one
combined mastered-count through arbitrary invented per-level thresholds (150/250/300/300 words) with
no basis in real per-level vocabulary size; (2) the shared header's "New" tile, which was
`ESTIMATED_TOTAL = 1500; new = 1500 - seen` — a hardcoded guess that also never counted
`vt_progress_v1` at all; (3) `index.html`'s own separate header, which had hardcoded placeholder
numbers (12/4/20/450) that only got overwritten when real due-count was nonzero — the very first bug
identified at the start of this session, never actually fixed until now. Wired `js/srs-engine.js` +
`js/progress-aggregator.js` into all 23 pages that load `js/app-shell.js` (previously only 3 did).
Verified: seeded realistic progress data and confirmed the header/sidebar numbers are mathematically
correct against it; confirmed a zero-data "new user" now shows honest zeros instead of fake numbers.

#### Changes — repository cleanup
Moved ~70 files (one-off `patch_*.py`/`fix_*.py`/`restore_*.py` scripts from earlier sessions, ad hoc
test scripts, 4 dead HTML duplicates never linked from any nav/README/manifest, a stray 2.9MB source
`.docx`, stray diff dumps) to `/archive` after confirming via `grep` that nothing references them —
see `archive/README.md`. Nothing was deleted. Moved the two still-useful maintenance scripts
(`build.py`, `sync_data.py`) to `/scripts`; fixed `build.py` to `os.chdir` to the repo root on startup
so it still works from its new location, and added the two shared JS files it was missing from its
own asset list. Re-ran it to regenerate `sw.js`'s cache list (now only lists real, live files).

#### Changes — accessibility / mobile
Basic, targeted ARIA pass on the shared shell (used on every page; previously zero `aria-*` attributes
anywhere in the codebase): labels on icon-only buttons, `aria-expanded`/`aria-controls` on the mobile
menu button reflecting real state, `aria-hidden` on decorative icons, a named nav landmark,
`role="progressbar"` with real `aria-valuenow`/min/max on the mastery bar.

#### Testing
Every fix in this entry was verified by loading the actual file in a headless Chromium browser
(`/opt/pw-browsers/chromium-1194`) via Playwright, capturing `pageerror`/console events, and — for the
functional fixes — actually clicking through the relevant flow (building a practice session, revealing
and rating cards, searching, opening the mobile drawer) rather than just checking for a clean load. A
full-suite sweep (`for f in *.html: load, wait, capture errors`) was re-run after every batch of
changes; the session ended with **zero console errors across all 26 real pages** (confirmed
immediately before this changelog entry was written).

#### What was explicitly requested but NOT completed this session (honest accounting)
The user's brief asked for a full product transformation: a rebuilt Home/Learn/Vocabulary/Grammar/
Practice/Progress information architecture, a unified vocabulary experience replacing 3+ separate
trainer pages, a consolidated grammar experience replacing 4+ separate pages, a consolidated practice
experience replacing 6+ separate pages, full responsive testing at 4 breakpoints, a complete
accessibility pass across all 26 pages (only the shared shell got one), and AI features woven into the
learning flow rather than living as a separate nav item. **None of the above IA/content-unification
work was done.** What exists today is still 21 separate tool pages behind a shared sidebar, not one
coherent Vocabulary/Grammar/Practice flow — `deutsch-coach.html` already has a reasonably capable
dashboard and session UI (level breakdown, Smart Learn, multiple-choice cards) that could plausibly
become the real "Learn" surface, but that decision and the actual consolidation work were not made
this session. This was a deliberate scoping choice given the realistic size of "rebuild the IA and
unify 21 tools" (genuinely multiple further sessions of work, not something to rush for the sake of
claiming completion) rather than an oversight — see Section 26 for the prioritized remaining backlog.

#### Remaining Issues
See the rewritten Sections 2, 14, 18 above for the current accurate state. Section 26 below has the
prioritized backlog for the IA/vocabulary/grammar/practice unification work that was not attempted.

---

### Session: A1 exam simulator + real B2 vocabulary/grammar foundation

Follow-up work after the changelog entry above, in direct response to the user pointing out two real
gaps that entry's own "not completed" section didn't fully close: no A1 exam-prep content anywhere
(the dashboard's Prüfung section only had B1 and A2), and no B2 content of any kind (vocabulary,
grammar, or otherwise) in the app. Scoped explicitly with the user beforehand: A1 was to get a **full
exam simulator matching the B1 `Sprech_Pruefungs_Simulator.html`'s structure**, not a lighter practice
studio; B2 was to get a **real content foundation (vocabulary + grammar) built first**, honestly
sourced/labeled and non-fabricated, before any B2 practice studio — practice needs something to
practice with. Developed on `claude/peaceful-dijkstra-7s59dc` (this session's designated branch,
caught up from `main`/`feature/production-learning-platform`'s shared tip first).

#### Changes — A1 oral/written exam simulator
Added `A1_Sprech_Pruefungs_Simulator.html`, a new page mirroring `Sprech_Pruefungs_Simulator.html`'s
exact shape (mode tabs, sub-tabs, card layout, speech synthesis, Web Speech API recording + diff
comparison) but with content rewritten for the real Goethe "Start Deutsch 1" (A1) format rather than
reusing B1's tasks at a lower difficulty:
- **Teil 1** — Sich vorstellen (7-point biographical introduction: Name/Alter/Land/Wohnort/Sprachen/
  Beruf/Hobby) + spelling + 3 spontaneous examiner questions, matching the real A1 exam's simpler
  "introduce yourself" format (B1's Teil 1 is the same shape but assumes higher fluency).
- **Teil 2** — Informationen erfragen und geben: 8 topic/keyword cards (Thema + Stichwort) each with a
  model question and answer — this is a genuinely different task type from B1's Teil 2 (a 5-step solo
  presentation), matching real Start Deutsch 1's card-based Q&A format instead of just reusing B1's
  structure with easier vocabulary.
- **Teil 3** — Bitten formulieren: 6 short picture-prompt scenarios (open a window, turn down a radio,
  etc.), each a single polite request + one-line reaction — matching A1's real single-exchange format,
  not B1's longer multi-turn negotiation dialogues.
- Spoken Redemittel vault (4 A1-appropriate categories) and a written section reworked to match A1's
  actual writing exam shape: **Formular ausfüllen** (read a short text, fill in a registration form —
  built as real text-input fields checked against answers, not reusing B1's multiple-choice cloze
  mechanic, since Start Deutsch 1's real Teil 1 is free-text form-filling) and **Mitteilung schreiben**
  (2 short personal-note blueprints, matching A1's actual "short note/SMS" task rather than B1's longer
  formal letters).
- Also implemented a real, working exam timer (`setExamTimer`/`toggleTimer`/`resetTimer`) — while
  investigating the B1 file to copy its structure, discovered its own timer buttons call functions that
  are never defined anywhere (pre-existing bug, not fixed — see Section 18).
- Linked from the dashboard's Prüfung section as "Sprechen (A1)"; registered in `sw.js`.

#### Changes — B2 grammar (Grammatik_Regel_Trainer.html)
Added 5 new grammar rules (`r17`–`r21`) covering real B2-level topics not previously in the trainer's
16 existing A1–B1 rules: Konjunktiv I & indirekte Rede (reported speech), Partizipialattribute (extended
participle constructions, e.g. "die steigenden Preise"), Doppelkonjunktionen (je...desto, weder...noch,
sowohl...als auch), Nominalisierung (verb/adjective → noun, e.g. "wegen des Kostenanstiegs"), and
formal Genitiv prepositions (trotz/während/aufgrund/innerhalb). Each has the same full structure as
existing rules (summary, formula, `tableHTML`, examples, static `drills`) **and** a working
`DYNAMIC_GENERATORS` entry — discovered that the endless-drill mode silently redirects to a random
*existing* rule if the selected rule has no `DYNAMIC_GENERATORS` entry (`generateInfiniteQuestion()`'s
`!DYNAMIC_GENERATORS[targetRule]` fallback), so without these entries the new rules would display in
study mode but never actually be drillable when selected. (Note for future agents: every existing
rule's per-object `drills` field is itself dead/unused — `DYNAMIC_GENERATORS` is what actually powers
practice; this was true before this session too, not something introduced here.)

#### Changes — B2 vocabulary
Added 28 B2-level verbs to `Verb_Transformation_Trainer.html`'s `VERBS` array and 39 B2-level nouns to
`Nomen_Adjektiv_Trainer.html`'s `NOUNS` array — general CEFR B2 vocabulary (abstract/professional
register: verbs like `erwägen`, `sich engagieren`, `berücksichtigen`, `gewährleisten`; nouns like
`Nachhaltigkeit`, `Zusammenhang`, `Entwicklung`, `Klimawandel`, `Lebenslauf`), labeled
`source: "General B2 Vocabulary"` matching the labeling convention from the earlier A1
vocabulary additions (Section 28's prior entry). Checked every candidate noun against `NOUNS` before
writing and dropped/replaced 10 that already existed at B1.1/B1.2 (e.g. `Verantwortung`, `Gesellschaft`,
`Kompetenz`). **Initially skipped the equivalent check for verbs** — 6 of the first 28 B2 verbs
(`beeinflussen`, `verzichten`, `vermitteln`, `zunehmen`, `abnehmen`, `gewährleisten`) turned out to
already exist in `VERBS` at `level: "B1"`, caught by a post-insertion duplicate scan (`VERBS.length` vs.
unique `inf` count) rather than checked upfront like the nouns were. Replaced all 6 with genuinely new
B2 verbs (`sich anpassen`, `sich verschlechtern`, `sich verbessern`, `sich einsetzen`,
`sich vorbereiten`, `abschätzen`) and re-verified zero duplicate infinitives across any B2 entry before
committing. Registered `B2` in both files' level-filter arrays (`LEVELS` in the verb trainer,
`NOUN_LEVELS` in the noun trainer). `ADJS` still has no B2 entries — not attempted this session. Note
for future agents: `VERBS` already had ~40 pre-existing duplicate infinitives across other levels before
this session (e.g. `haben`, `gehen`, `sprechen` each appear more than once) — that's pre-existing and
unrelated to this batch, not something this session introduced or fixed.

#### Changes — B2 wired into progress tracking
`js/progress-aggregator.js`'s `levelFromUid()` and `getVocabularyStatsByLevel()` now recognize `B2`
uids (previously hardcoded to only A1/A2/B1). `js/app-shell.js`'s shared sidebar and `index.html`'s
own dashboard now render a real B2 mastered/reviewed row (via the same honest "real counts, not
fabricated percentages" approach as the A1/A2/B1 rows) instead of the previous static "No B2 content
yet" label. The dashboard's Prüfung section note was reworded to reflect that B2 vocabulary/grammar now
exist while still being explicit that no B2 exam-prep studio exists yet (see Section 26).

#### Changes — incidental bug fix
`js/icon-svgs.js`'s `getIcon()` fallback (`ICON_SVGS[v.icon] || ICON_SVGS['abstract']`) silently
returned `undefined` for the several hundred existing vocabulary entries tagged `icon:"abstract"`,
since `'abstract'` was never actually defined in `ICON_SVGS`. Found while choosing icons for the new B2
nouns (many of which are abstract concepts); added a real `'abstract'` SVG. Fixes icon rendering for
every existing entry using that tag too, not just the new B2 ones.

#### Testing
Every change verified with headless Chromium (`/opt/pw-browsers/chromium-1194`) via Playwright: the new
A1 page's every tab/sub-tab/scenario-switch/form-check/timer interaction was clicked through and
asserted on; the 5 new grammar rules' `generateInfiniteQuestion()` was called directly per rule id to
confirm each returns its own question rather than silently falling back to an old rule; the B2 level
filters in both vocabulary trainers were clicked and their displayed counts (28, 39) confirmed against
the actual array contents; B2 progress rows were verified by seeding realistic `vt_progress_v1`/
`na_progress_v1` data and checking the rendered mastered-count and bar-width math by hand. A full
23-page smoke sweep (load + capture `pageerror`) was re-run after each batch with zero errors.

#### What was explicitly requested but NOT completed this session
No B2 practice/exam-prep studio was built — this was the explicit, agreed scope boundary ("content
foundation first," see the opening of this entry), not an oversight. `ADJS` (adjectives) got no B2
entries. The B1 exam simulator's broken timer functions and the ~13-page orphaned-CSS cleanup from the
previous changelog entry remain unfixed (out of scope for this entry too).

---

### Follow-up: B2 batch for German_Grammar_Cheat_Codes.html

Reviewed `German_Grammar_Cheat_Codes.html` at the user's request (30 mnemonic "shortcut" cards across 8
categories, 3 live pattern-scanner widgets, search + category filters — distinct from
`Grammatik_Regel_Trainer.html`'s more formal rule format) and confirmed it had zero B2 content and no
Genitiv-preposition mnemonic despite covering Akkusativ ("DOGFU") and Dativ ("Blue Danube") ones. Added
8 new cards (`id: 31`–`38`, `cat: "b2"`, new "🎓 B2 Cheat Codes" filter chip): mnemonic versions of the
5 B2 grammar topics added to `Grammatik_Regel_Trainer.html` above (Genitiv prepositions, Konjunktiv
I/reported-speech "sei" detector, Partizipialattribut "unpacking" trick, Doppelkonjunktionen pairs,
a Nominalisierung writing-upgrade paired with the existing Shortcut 23 B1 connector checklist) **plus**
3 additional tricks not covered anywhere else in the app yet: Zustandspassiv vs. Vorgangspassiv
("snapshot vs. movie" — `sein`+Partizip II is a result-state, `werden`+Partizip II is the process),
Futur II as natives actually use it (assumption about the past, not real future), and N-Deklination's
"-en Club" (weak masculine nouns like `der Student`/`der Junge` taking `-en` in every case but
Nominativ Singular). Note for future agents: this file's `CHEAT_CODES` array mixes unquoted-key JS
object literals (the original 30 entries) with quoted-key JSON-style ones (these 8 new entries) — both
are valid JS, but a naive `json.loads()` on the array text will fail on the unquoted-key entries; don't
assume this file is parseable as JSON the way `VERBS`/`NOUNS` are.

Verified via headless Chromium: total card count (38), the new filter chip's count (8), search for a
new topic ("Futur II") returning exactly 1 result, and an audio button on a new card firing without
error. Full 23-page smoke sweep re-run with zero errors before committing.

---

### Follow-up: difficulty-tiered practice + AI weak-spot follow-up

The user asked for "lots and lots" of offline practice per topic, easy→difficult, across "everything"
(explicitly confirmed as the full scope via AskUserQuestion, acknowledged as a genuinely multi-session
effort) — plus, when AI is enabled, wrong-answer explanations (a feature that already existed, see
below) and more practice generated for weak spots, offline-bank-first with AI filling gaps when the
bank runs thin (also explicitly confirmed via AskUserQuestion). Started with
`Grammatik_Regel_Trainer.html` as the first, highest-leverage installment — **not** all pages; see
"NOT completed" below.

#### Changes — difficulty-tiered offline question bank
Added a `diff: 'easy'|'medium'|'hard'` field to a brand-new hand-authored generator function on every
one of the 21 rules (63 new questions total — roughly doubling the previous ~26-generator pool, which
itself held 2-14 variants per rule depending on how many generator functions that rule already had).
Added `let currentDifficulty` global state + a new Easy/Medium/Hard/Mixed filter row in the drill HUD
(`setDifficulty()`). `generateInfiniteQuestion()` now retries up to 15 times to draw a question matching
the active difficulty filter before falling back to whatever was drawn — older, untagged generators are
left completely untouched (zero regression risk) and simply act as unfiltered "mixed bag" fallback
content. Selecting a specific difficulty also forces `choice` (gap-fill) format, since difficulty tags
only exist on `choice`-type questions, not the separate sentence-builder (`build`) mode.

#### Changes — AI weak-spot follow-up (offline-first, AI-fills-gap)
Added a "🤖 More Practice On This (AI)" button next to the existing wrong-answer AI explainer. It asks
the configured AI provider (Groq/OpenAI/Ollama, same `de_ai_provider`/`de_ai_key_*` localStorage config
as the pre-existing explain feature) for ONE new question on the exact rule + difficulty just missed,
in a strict JSON shape; a malformed/failed response (no key configured, network error, bad JSON) always
falls back to the offline bank for that rule rather than leaving the learner stuck, with a visible
banner explaining the fallback. AI-generated questions are marked `aiGenerated: true` and show a
"🤖 AI-GENERATED" badge so learners know which is which.

#### Changes — two pre-existing crashes fixed (found while wiring the above)
Both documented in Section 18. `checkAnswer()` (gap-fill mode) referenced `buildOrder` (a
sentence-builder-only variable), throwing on every wrong answer and silently breaking the whole feedback
box — the AI-explain button never even appeared. `explainWrongAnswerAI()` referenced an undeclared
`currentRule`, so the AI explanation always threw before making the API call - meaning this
already-advertised "explain why it's wrong" feature had never actually worked. Both are fixed now: the
first passes the actually-chosen wrong option, the second looks up the rule via the question's `ruleId`.

#### Testing
All 21 rules × 3 difficulties (63 draws) verified programmatically to produce well-formed questions
(non-empty prompt containing `___`, valid options array, correct index resolving to a real option) with
zero thrown errors. Both AI code paths (`explainWrongAnswerAI`, `generateAIPracticeQuestion`) tested by
mocking `callAIGrammarExplanation` for both a success case (valid JSON → question object built and used
correctly, `aiGenerated: true`) and a failure case (error string → offline fallback used, banner shown).
Full 23-page smoke sweep clean.

#### What was explicitly requested but NOT completed this session
The user's confirmed scope was "everything" — grammar, vocabulary, and all other practice pages. Only
`Grammatik_Regel_Trainer.html` was upgraded this session; explicitly communicated to the user as the
first installment of a larger, honestly-multi-session backlog, not the whole thing. Not yet touched:
adding easy→hard difficulty tiers or AI weak-spot generation to the vocabulary trainers
(`Verb_Transformation_Trainer.html`, `Nomen_Adjektiv_Trainer.html` — these already have an inherent
easy→hard progression via SRS box level, but no explicit difficulty-mode selector or AI weak-spot
question generation), or to any exam simulator / practice studio page.

---

### Follow-up: same pattern extended to both vocabulary trainers

Continuing the "everything" scope confirmed above, applied the same Easy/Medium/Hard practice-mode +
AI weak-spot pattern to `Verb_Transformation_Trainer.html` and `Nomen_Adjektiv_Trainer.html`.

#### Changes — Verb_Transformation_Trainer.html
Added `practiceMode` state ('easy'/'medium'/'hard') + a mode-selector row, wired into `renderCard()`:
- **Easy** (new): multiple-choice recognition — 4 options (1 correct + 3 distractors sampled from the
  currently-filtered pool, or the full `VERBS` array if the pool is too small), direction-aware
  (DE→Meaning or Meaning→DE per the existing `curDir` toggle).
- **Medium**: the pre-existing flip-card + self-rate flow, completely unchanged.
- **Hard**: a typed "write a full sentence using this verb from memory" challenge. The file already had
  a `triggerProductionChallenge()` function written for exactly this, discovered to be **dead code** —
  defined but never called from anywhere (confirmed via `grep`). Rebuilt as a standalone
  `renderHardProduction()`/`checkHardProduction()` pair instead of reusing the old function directly,
  since it assumed DOM elements (`revealArea`, `frontActions`) that only exist in Medium mode's
  post-reveal state.

#### Changes — Nomen_Adjektiv_Trainer.html
Same pattern, adapted to this page's two sub-modes and extra drill direction:
- **Easy**: 4-option recognition for the normal DE↔meaning directions; a focused 3-option der/die/das
  pick for Nomen's separate "gender" direction.
- **Medium**: unchanged.
- **Hard**: typed production scoped to what this page actually tests in Medium mode rather than a
  generic sentence — nouns require typing article + plural (`der Tisch, die Tische`), adjectives
  require comparative + superlative (`schneller, am schnellsten`).

#### Changes — shared AI helper extracted
Added `callAIHelper(promptText, callback)` to `js/app-shell.js` (same `de_ai_provider`/`de_ai_key_*`
localStorage convention `Grammatik_Regel_Trainer.html` already used and `checkAIStatus()`'s
`ai-enabled` body class already exposed) so the two vocabulary trainers didn't need to duplicate the
fetch/provider logic. Deliberately left `Grammatik_Regel_Trainer.html`'s own existing
`callAIGrammarExplanation()` as-is rather than refactoring it to call the new shared helper — it was
already tested and working, and a refactor purely to remove ~30 lines of duplication wasn't worth the
regression risk. Worth doing as a follow-up cleanup, not urgent.

Both vocabulary trainers' AI weak-spot button ("More Practice With This Word") only appears when
`ai-enabled` is set, and deliberately never asks the AI to invent new vocabulary — only for ONE usage
example sentence of a word already verified in `VERBS`/`NOUNS`/`ADJS`, to avoid introducing unverified
content into pages presented as reliable vocabulary data.

#### Testing
Both pages verified via headless Chromium: all three modes render and call `recordAnswer()`/SRS
correctly (Verb Trainer's DE→Meaning/Meaning→DE Easy mode, Nomen's Easy mode in both its normal and
gender directions, Adjektiv's Easy mode, and both pages' Hard mode with valid/invalid input); the AI
button's `ai-enabled` gating (hidden when not configured, shown + functional with a mocked
`callAIHelper` when configured) tested on both. Full 23-page smoke sweep clean after each commit.

#### What was explicitly requested but NOT completed this session
Exam simulators and practice studios (`Sprech_Pruefungs_Simulator.html`,
`A1_Sprech_Pruefungs_Simulator.html`, `German_A2_Practice_Studio.html`,
`German_B1_Practice_Studio.html`, `Hoerverstehen_Diktat_Trainer.html`, `Brief_Schreiben_Trainer.html`,
`Satzbau_Trainer.html`, `konnektoren_referenz.html`, `Dialog_Schatten_Trainer.html`,
`Wortfamilien_Explorer.html`, `Wortschatz_Master_Grid.html`) still have none of this — see Section 26.

---

### Follow-up: practice-depth pattern completed across every page it genuinely fits

Finished the "everything" scope from the user's confirmed answer above. First surveyed all 11
remaining practice-adjacent pages (via a dedicated read-only investigation) to find out, honestly,
which ones have a real right/wrong mechanic worth tiering and which don't — rather than forcing a
difficulty selector onto every page regardless of fit. Result: 7 of the 11 got the treatment (some
scoped to just their one graded sub-section); 4 were deliberately excluded with reasons, not deferred.

**Got Easy/Medium/Hard (in addition to `Grammatik_Regel_Trainer.html`,
`Verb_Transformation_Trainer.html`, `Nomen_Adjektiv_Trainer.html` from the entry above):**
- `Satzbau_Trainer.html` (word-order builder) — Easy: multiple-choice among real-word reorderings of
  the same tokens (never random word salad, matching the page's own stated philosophy). Medium: the
  pre-existing tap-token builder, unchanged. Hard: typed free recall.
- `German_A2_Practice_Studio.html` / `German_B1_Practice_Studio.html` — scoped to just their "drill"
  chapter (the other 7 chapters are pure reference cards with no grading, left untouched). Easy: the
  pre-existing 4-option MCQ. Medium (new): self-rate recall. Hard (new): typed free recall. Also fixed
  a copy-paste bug found in B1's file: its drill chapter's copy literally said "...alle A2-Module..."
  and "Bereit für den A2-Sprint?" despite being the B1 studio.
- `Hoerverstehen_Diktat_Trainer.html` — Easy (new): "which sentence did you hear?" multiple choice.
  Medium (new): gap-fill (hear the sentence, type just 1-2 blanked words). Hard: the pre-existing full
  typed dictation, unchanged.
- `konnektoren_referenz.html` — scoped to its Drill tab (the Referenz tab is pure reference). Easy: the
  pre-existing 10-question fixed MCQ. Medium/Hard (new): the same questions typed instead of clicked,
  Medium showing the option list as a hint, Hard showing nothing.
- `Sprech_Pruefungs_Simulator.html` (B1) — scoped to Written > Sprachbausteine Cloze only (Oral and
  Vault are shadowing/reference with nothing to grade). Easy: the pre-existing `<select>` dropdowns.
  Medium/Hard (new): typed per-gap, Medium showing the option lists as a hint.
- `A1_Sprech_Pruefungs_Simulator.html` — scoped to Written > Formular ausfüllen only. Easy (new):
  multiple-choice per field, distractors drawn from the form's own other real field values. Medium
  (new): typed with a shuffled "Answer Bank" of all correct values shown. Hard: the pre-existing typed
  exact-match, unchanged (was already free recall with no hints).

**Deliberately NOT given a difficulty selector (checked, not skipped):** `Brief_Schreiben_Trainer.html`
(a compose-and-save letter tool with qualitative AI feedback, no right/wrong to tier),
`Dialog_Schatten_Trainer.html` (AI-generated dialogue + audio shadowing, no grading mechanic),
`Wortschatz_Master_Grid.html` (a browsable/filterable vocab grid with a peek-to-reveal "study" toggle
but no score), `Wortfamilien_Explorer.html` (confirmed to be a pure `<meta http-equiv="refresh">`
redirect stub to `Wortschatz_Master_Grid.html`, not a real page — nothing to change). Forcing a
selector onto these would have meant building a whole new quiz feature from scratch on each, not
extending an existing one — a materially different, much larger undertaking than what was asked for.

**Two more real bugs found and fixed along the way** (beyond the `checkAnswer`/`explainWrongAnswerAI`
crashes in the earlier entry), both flagged by Section 18:
- `Hoerverstehen_Diktat_Trainer.html` had a hardcoded Deepseek API key embedded directly in the
  client-side source as a "safe fallback" for when no user key was configured. Since this repo deploys
  publicly to GitHub Pages, that key was exposed to every visitor via view-source — a real security
  issue, not a style nit. Removed it; AI generation now honestly requires the user's own key like every
  other provider/page (verified the "please configure a key" fallback path still works correctly).
- `Satzbau_Trainer.html`'s "🤖 KI-Satzanalyse" (AI sentence analysis) button on a wrong answer was
  branded as AI but `analyzeSentenceAIFallback()` was a hardcoded canned response wrapped in a
  `setTimeout` — it never called any real AI. Now calls the real shared `callAIHelper()` when AI is
  actually configured, and falls back to the same static content honestly relabeled as a "Word Order
  Tip" (not claiming to be AI) when it isn't.
- `konnektoren_referenz.html` had a whole "AI Sentence Builder" feature
  (`generateBuildTask`/`checkBuildTask`/`playBuildAudio`, a module-level `currentTask`) that was
  **entirely dead code**: it referenced `#builderKonnektor`/`#builderTask`/`#bldAnswer`/`#bldFeedback`/
  `#bldTarget`/`#bldEn`/`#bldTa`/`#builderLoading`/`#checkBtn`, none of which exist anywhere in the
  file's HTML (confirmed via `grep`), and wasn't wired to any button either. Replaced with a real,
  wired-up AI weak-spot follow-up using the shared `callAIHelper()`.

**AI weak-spot follow-up is now consistent app-wide**: every page in this list that got an AI button
uses the same shared `callAIHelper()` from `js/app-shell.js` (added in the entry above) and the same
`ai-enabled` body-class gating, and every one of them explains or generates practice around a REAL word/
sentence/question already in that page's own verified data — none of them ask the AI to invent new
vocabulary, grammar rules, or exam content.

#### Testing
Every file re-verified via headless Chromium after its change: each new mode exercised end to end
(render → answer → correct/wrong feedback path), AI button gating tested with both no-AI and a mocked
`callAIHelper` response, and a full 23-page smoke sweep (`pageerror` capture) re-run clean after every
commit. `German_A2_Practice_Studio.html`/`German_B1_Practice_Studio.html`'s drill chapter is
gated behind completing the other 7 chapters, so tests force-unlocked them via `PROGRESS.completed`
rather than skipping that verification.

#### Remaining state
The confirmed "everything" scope for the difficulty-tiered practice + AI weak-spot pattern is now done:
every page with a real right/wrong mechanic has it, and every page without one was checked and
honestly excluded rather than silently skipped. Nothing from this specific request is outstanding.
(Unrelated, longer-standing backlog items from Section 26 — IA/IA unification, orphaned CSS, etc. —
are untouched and still open.)

---

## 29. AI-Discovered Knowledge

### Discovery: Main app verb collection now unified with the 503-verb master list (522 total verbs)
**Date:** 2026-09-19 · **AI:** Gemini 3.8 Flash
**Finding:** Originally, `index.html` contained only 139 verb cards across `LEGACY_DATA`, `A2_DATA`, and `VERB_ADD_DATA`. Meanwhile, `Verb_Transformation_Trainer.html` contained 503 curated verbs. By extracting the 383 missing verbs, assigning contextual topics, and injecting them into `ALL_CARDS` via `MASTER_EXTRA_VERBS`, `index.html` and `deutsch-coach.html` now feature 522 verbs (covering 100% of the 503 master verbs + 18 original contextual expressions).
**Evidence:** Node.js runtime verification in `scratch/verify_runtime.js` confirming `ALL_CARDS.length = 1219` and `ALL_CARDS.filter(c => c.cat === 'v').length = 522`.
**Affected files:** `index.html`, `deutsch-coach.html`.
**Impact:** Learners using the main PWA can now study, drill, and track spaced-repetition progress on all 500+ verbs seamlessly.

### Discovery: The 7 grammatical pillars of the A2 Practice Template form a complete syllabus bridge
**Date:** 2026-09-19 · **AI:** Gemini 3.8 Flash
**Finding:** `German_A2_Practice_Template.xlsx` contains 7 specific sheets representing the foundational grammar obstacles of the CEFR A2 curriculum:
1. `verbs`: Full 6-person conjugation + 4 tenses/moods (Präsens, Perfekt, Präteritum, Konjunktiv II) + related noun bridge.
2. `Reflexive`: Pronoun adaptation across persons (mich/dich/sich/uns/euch/sich) + preposition pairings.
3. `Trennbar Verbs`: Verb-second vs clause-final prefix movement (Satzklammer) + `-ge-` infix in Perfekt.
4. `der das die`: Gender classification with English cognate associations and suffix heuristics.
5. `Adjective Endung`: Mixed (`ein`), weak (`der`), and strong (zero-article) inflection matrices with dynamic sentence synthesis.
6. `imperative`: du / ihr / Sie formation rules with everyday situational commands.
7. `adj_categorise`: Thematic lexical clusters (personality, emotion, time, particles, connectors).
By translating this entire structure into `German_A2_Practice_Studio.html`, the project now possesses an interactive, audio-enabled A2 learning environment directly aligned with Arun's course materials.
**Evidence:** Direct analysis of `German_A2_Practice_Template.xlsx` and implementation in `German_A2_Practice_Studio.html`.
**Affected files:** `German_A2_Practice_Studio.html`, `German_A2_Practice_Template.xlsx`.
**Impact:** A2 learners can now master all 7 grammatical dimensions interactively with audio feedback in a single offline-capable page.

### Discovery: Exact UID generation formulas and localStorage keys across all apps verified
**Date:** 2026-09-19 · **AI:** Gemini 3.8 Flash
**Finding:** All four spaced-repetition stores and UID schemes were inspected and confirmed:
- Main app (`index.html` / `deutsch-coach.html`): `LS_PROGRESS_KEY = "dc_progress_v1"`, `LS_META_KEY = "dc_meta_v1"`. Card UIDs use `base = (c.level+"|"+c.topic+"|"+c.w).replace(/\s+/g,"_")` with loop collision resolution `uid = base + "__" + (++n)`.
- Verb Trainer (`Verb_Transformation_Trainer.html`): Key `'vt_progress_v1'`. Verb UIDs use `v.uid = v.level + '|' + v.inf`.
- Noun & Adjective Trainer (`Nomen_Adjektiv_Trainer.html`): Key `LS_KEY = 'na_progress_v1'`. Noun UIDs use `'n|' + v.level + '|' + v.sg`; adjective UIDs use `'a|' + v.w`.
**Evidence:** Direct inspection in `index.html` (lines 1784-1808), `Verb_Transformation_Trainer.html` (lines 242-268), `Nomen_Adjektiv_Trainer.html` (lines 173-193).
**Affected files:** `index.html`, `deutsch-coach.html`, `Verb_Transformation_Trainer.html`, `Nomen_Adjektiv_Trainer.html`.
**Impact:** Resolves prior UNKNOWN flags in Sections 7 and 14. Any future cross-app progress migration or data export can reference these exact keys and schemas.

### Discovery: Schreiben (writing) view user input is strictly XSS-safe
**Date:** 2026-09-19 · **AI:** Gemini 3.8 Flash
**Finding:** In the main app's writing view (`renderSchreiben`), user-entered text in the `<textarea id="writeArea">` is only listened to via the `input` event to compute word and character counts. The result is assigned to `textContent` of `#wordCount` (`${words} Wörter · ${txt.length} Zeichen`). The user input is never placed into `innerHTML`, attributes, or evaluated.
**Evidence:** `index.html` lines 2699-2703.
**Affected files:** `index.html`, `deutsch-coach.html`.
**Impact:** Confirms the security assumption from Section 21. No sanitize or escaping library is required for the current writing view.

### Discovery: Workspace migration to Windows and absence of local git repository
**Date:** 2026-09-19 · **AI:** Gemini 3.8 Flash
**Finding:** The project is running on Windows in `C:\Users\arunr\OneDrive\Documents\Projects\AIDrive\Deutsch_Coach_Project`. The `/mnt/user-data/outputs/.git` repository mentioned in prior documentation does not exist in this environment (`git status` exits with code 1 `fatal: not a git repository`).
**Evidence:** `git status` in project root returned code 1.
**Affected files:** Workspace environment / tooling.
**Impact:** File changes made in this workspace are not under local git version control until `git init` (and optionally a remote setup) is performed.

### Discovery: The 5 apps share zero code or data — every shared pattern is an independently drifted copy
**Date:** prior session · **AI:** Claude (Sonnet 5)
**Finding:** The icon SVG library (`ICON_SVGS`), the Tamil-translation dictionaries, the
spaced-repetition engine (Leitner box logic, `BOX_SCHEDULE`, `recordAnswer`/`getProg` shape), and the
diff-highlighting algorithm all appear in more than one file, each time as a separately pasted-in copy
rather than a shared module. Confirmed by direct diffing of the `BOX_SCHEDULE` constant, the
`ICON_SVGS` keys, and the `recordAnswer`/`getProg` function bodies across the main app,
`Verb_Transformation_Trainer.html`, and `Nomen_Adjektiv_Trainer.html`.
**Evidence:** `grep -n "BOX_SCHEDULE\|function getProg\|function recordAnswer"` across the three files
returns near-identical but not diverged (index is UI, coach is legacy data payload) function bodies in each.
**Affected files:** `deutsch-coach.html`/`index.html`, `Verb_Transformation_Trainer.html`,
`Nomen_Adjektiv_Trainer.html`.
**Impact:** Any fix or enhancement to the spaced-repetition logic must be manually re-applied up to 3
times. This is the single highest-leverage refactor opportunity in the project if a future AI is asked
to reduce maintenance burden, but doing so would require introducing a build step or a shared script
file — a departure from the current "one portable HTML file" design decision (Section 24), so should
not be done without explicit user sign-off.

### Discovery: Progress is not shared across apps even for identical vocabulary items
**Date:** prior session · **AI:** Claude (Sonnet 5)
**Finding:** A verb like `sprechen` exists in both the main app's `ALL_CARDS` and
`Verb_Transformation_Trainer.html`'s `VERBS` array, but progress on it in one app has no way to reach
the other — different `localStorage` keys, different `uid` schemes.
**Evidence:** `Verb_Transformation_Trainer.html` uses key `'vt_progress_v1'`; the main app uses
`LS_PROGRESS_KEY` (`"dc_progress_v1"`).
**Affected files:** All apps with persistence (main app, Verb trainer, Nomen/Adjektiv trainer).
**Impact:** A learner who studies the same word in two different apps is, from the software's
perspective, two unrelated learning histories for that word. This is worth surfacing to the user as a
design trade-off (portability vs. unified progress) rather than silently "fixing," since fixing it
would require either a shared storage schema or a migration/import step across apps.

### Discovery: The `.git` repository in outputs has no remote — it predates and is unrelated to the user's actual GitHub repo
**Date:** prior session · **AI:** Claude (Sonnet 5)
**Finding:** `/mnt/user-data/outputs/.git` contains one commit (`8eed843 Deutsch-Coach: unified A1-B1.2
vocabulary trainer PWA`) but `git remote -v` returns nothing — it was never connected to
`github.com/ArunVivekanandhan/deutsch-coach` (a repo the user has separately mentioned).
**Evidence:** `git remote -v` empty output; `git log --oneline` shows exactly one commit with no
subsequent history despite many files being newer than that commit's timestamp.
**Affected files:** N/A (tooling/process discovery, not a source-code file).
**Impact:** Anyone assuming "there's a git repo, so there's version history" would be wrong — the real
history of this project lives only in the chat conversation, not in git. Do not treat this local repo
as a reliable source of "what changed when."

### Discovery: Full Bilingual English Guidance added across all apps
**Date:** Current session · **AI:** Gemini 3.7
**Finding:** Added clear bilingual English subtitles, grammar explanations, and topic translations across all 11 HTML files (`index.html`, `Satzbau_Trainer.html`, `German_A2_Practice_Studio.html`, `German_B1_Practice_Studio.html`, `Nomen_Adjektiv_Trainer.html`, `konnektoren_referenz.html`, `Grammatik_Regel_Trainer.html`, `Sprech_Pruefungs_Simulator.html`).
**Impact:** A learner with English/Tamil as base languages can now clearly navigate every button, topic, and grammar rule without getting lost in German-only chrome.

### Discovery: Multi-AI Live German Coach & Real-Time Grammar Correction App Added
**Date:** Current session · **AI:** Gemini 3.7
**Finding:** Created `KI_German_Coach.html` — a responsive, mobile-ready live conversation coach with multi-AI provider support (DeepSeek, OpenAI, Groq, Gemini, OpenRouter, and local Ollama), customizable coach personas (Frau Müller, Herr Weber, Lukas, Dr. Hoffmann), voice recognition (STT) and German speech synthesis (TTS), live under-message grammar corrections with token diffs, rule explanations, native B1/B2 upgrades, and a persistent Fehler-Tagebuch (Mistake Vault) in `localStorage`. Also added the persistent top Suite Hub banner and a dedicated `🤖 KI Coach ↗` tab directly into `index.html` and `deutsch-coach.html` navigation bar.
**Impact:** The learner can now navigate directly to the AI coach from any screen or device.

### Discovery: Realistic Human Avatar Video Coach (KI_Human_Partner.html) Added
**Date:** Current session · **AI:** Gemini 3.7
**Finding:** Created `KI_Human_Partner.html` — an immersive 1-on-1 video call experience featuring an animated realistic human German coach (Frau Schmidt, Herr Weber, Lukas, Dr. Hoffmann) with dynamic multi-viseme lip-syncing, natural eye blinking, subtle head-tilts, ambient classroom lighting, real-time speech recognition (STT), human voice TTS, bilingual subtitles, and instant live grammar feedback cards.
**Impact:** Provides an authentic, human-like speaking immersion experience for learners preparing for oral speaking exams (DTZ / telc / Goethe B1).

### Discovery: German Grammar Cheat Codes App & Cross-Suite Shortcut Integration
**Date:** 2026-09-20 · **AI:** Gemini 3.7
**Finding:** Created `German_Grammar_Cheat_Codes.html` containing 30+ interactive shortcut hacks across 10 categories (Verb Past Tenses, haben/sein Perfekt, der/die/das Suffix Scanners, Case Prepositions DOGFU & Blue Danube, TeKaMoLo, ADUSO, English sound shifts, and Tamil-German SOV/Case structural bridges). Also injected dynamic cheat code tips directly into card reveal views of `Verb_Transformation_Trainer.html`, `Nomen_Adjektiv_Trainer.html`, and `deutsch-coach.html` / `index.html`.
**Impact:** Learners can now crack German past tenses, gender articles, and sentence structures intuitively using their existing English and Tamil linguistic knowledge.






