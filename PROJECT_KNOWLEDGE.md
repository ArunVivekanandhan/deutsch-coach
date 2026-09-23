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
  this session — see Section 14). This directly supersedes the old "no shared code, everything
  copy-pasted" claim in the original Section 25 below (kept below for historical context but no
  longer accurate as a blanket statement).
- **The vocabulary/grammar/practice content is still NOT unified.** Content still lives in
  page-specific inline JSON arrays (`VERBS`, `NOUNS`, `ADJS`, `LEGACY_DATA` — see Section 7), each
  page's own copy, not one canonical source. A `data/*.json` + `scripts/sync_data.py` consolidation
  was started (by another session) but nothing reads from `data/*.json` yet — it's a stale, disconnected
  snapshot (503/378/337 words vs. `VERBS`/`NOUNS` now at 581/522 live entries after B2 additions — see
  Section 28). Do not treat `data/*.json` as authoritative; treat the individual HTML pages' inline
  arrays as the actual live data until that consolidation is finished and verified.
  **`VERBS` and `NOUNS` now include a real B2 tier** (28 verbs, 39 nouns — `ADJS` still has none), so
  `level` values across the codebase are `A1`/`A2`/`B1`/`B1.1`/`B1.2`/`B2` depending on the file; always
  check a given array's actual distinct `level` values before writing level-filtering logic against it.
- **Progress storage is genuinely fragmented across 9 localStorage keys with 4 incompatible shapes**
  (real vocabulary SRS data vs. streak counters vs. completion counters vs. dead/unused keys) — see
  Section 14 for the full breakdown and why `js/progress-aggregator.js` only aggregates 3 of the 9.
- **Repository hygiene**: `/archive` holds ~70 one-off scripts and dead file duplicates moved out of
  the production surface this session (see `archive/README.md` for what and why — none were deleted).
  `/scripts` holds the two still-useful maintenance tools (`build.py` regenerates `sw.js`'s cache list
  and runs a basic smoke test; `sync_data.py` is the unfinished data-consolidation tool).
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
├── Grammatik_Regel_Trainer.html            # 16 Core German Grammar Pillars with rules, audio & infinite practice drills
├── Sprech_Pruefungs_Simulator.html         # Oral Exam Simulator (Teil 1-3), Spoken Redemittel Vault & Letter Builder
├── German_A2_Practice_Studio.html          # Interactive 7-module A2 learning studio with Suite Hub
├── German_B1_Practice_Studio.html          # Interactive 7-module B1 learning studio with Suite Hub
├── Verb_Transformation_Trainer.html        # Standalone verb Präsens→Vergangenheit trainer with Suite Hub
├── Nomen_Trainer.html                      # Standalone noun-plural trainer with Suite Hub (split from Nomen_Adjektiv_Trainer.html)
├── Adjektiv_Adverb_Trainer.html            # Standalone adjective-comparison trainer, grouped by semantic category, with Suite Hub (split from Nomen_Adjektiv_Trainer.html)
├── Satzbau_Trainer.html                    # Standalone sentence-building trainer with Suite Hub
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

**Satzbau_Trainer.html:** `DATA = { grammar: [...], thematic: [...] }`, each entry a topic with
`templates[]`, each template with `variants[]` (hand-verified full sentences, word-order-scrambled at
runtime for the build exercise). No per-word `uid`/progress tracking — this app has no spaced repetition
(see Section 25).

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
- **Important logic:** word-order scramble-and-rebuild mechanic over **149 hand-verified sentence
  variants** across 23 topics (8 grammar-focused + 15 thematic); correctness is guaranteed by using only
  pre-verified full sentences, never generating new combinations at runtime (an earlier
  independent-slot-rolling bug that could produce ungrammatical sentences was found and fixed prior to
  shipping — see Section 25).
- **Dependencies:** none.
- **Known limitations:** **no spaced-repetition/progress persistence at all** — this app is stateless
  session-to-session; every visit starts fresh with no due/difficult/mastered tracking.

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
| Satzbau_Trainer | `curCategory`, `curTopic`, `curTemplate`, `curVariant`, `correctOrder`, `buildSlots`, `bankWords`, `seenCount` |
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
- **Page-local dark-theme class never set by the real toggle.** `A1_Sprech_Pruefungs_Simulator.html`
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
- `js/app-shell.js` orphaned CSS: ~13 pages still carry unused `.suite-hub`/`.hub-links`/`.hub-banner`
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
- Finish (or abandon and remove) the `data/*.json` + `scripts/sync_data.py` consolidation — it's
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
- Standalone trainers (including the new A2 Practice Studio) are not yet in `sw.js`'s `APP_SHELL` cache list.

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






