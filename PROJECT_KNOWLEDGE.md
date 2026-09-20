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

## 2. Current Status

All 5 apps and both Excel-generation pipelines are functionally complete and have been manually tested
(via headless jsdom simulation during development, not a real test suite — see Section 17). The most
recently modified file, `Verb_Transformation_Trainer.html`, has an English-language UI; all other apps
still have German-language UI chrome (see Section 24 "UI language inconsistency" and Section 19).
There is no deployment pipeline: files exist as local downloads. The project was previously developed in a Linux sandbox (`/mnt/user-data/outputs/`) and is currently located in a Windows local folder (`C:\Users\arunr\OneDrive\Documents\Projects\AIDrive\Deutsch_Coach_Project`). **No `.git` repository exists in the current project directory** (`git status` reports fatal: not a git repository). A remote GitHub repository (`github.com/ArunVivekanandhan/deutsch-coach`) was mentioned previously, but the local workspace is not currently linked to any git remote.

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
├── index.html                              # Main PWA — byte-identical to deutsch-coach.html
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
├── Nomen_Adjektiv_Trainer.html             # Standalone noun-plural / adj-comparison trainer with Suite Hub
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

`index.html` and `deutsch-coach.html` are **confirmed byte-identical** (`diff` returns empty). Only
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

**Nomen_Adjektiv_Trainer.html noun object:**
```
{ sg, pl, a, en, ta, ta_translit, icon, level, topic, typ, uid }
```
`typ` ∈ `{en, e, er, s, unchanged, umlaut_only}` (plural-formation family). `uid` is generated as:
`v.uid = 'n|' + v.level + '|' + v.sg` (verified in `Nomen_Adjektiv_Trainer.html` line 192).

**Nomen_Adjektiv_Trainer.html adjective object:**
```
{ w, komp, sup, en, ta, ta_translit, icon, source, typ, uid }
```
`typ` ∈ `{regular, umlaut, irregular}` (comparison-formation family). `uid` is generated as:
`v.uid = 'a|' + v.w` (verified in `Nomen_Adjektiv_Trainer.html` line 193). `komp`/`sup` (Komparativ/
Superlativ) were **generated programmatically** by a rules engine (regular suffixation + a hand-curated
umlaut-word list + a tiny irregular-word dict for `nah→näher→am nächsten`), **not sourced from a
textbook** — treat these forms as good-faith derivations, not verified textbook data (unlike the noun
plurals, which are sourced from the original glossary).

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
| Nomen_Adjektiv_Trainer | `curMode`, `curFilt1`, `curFilt2`, `curDir`, `meaningLang`, `PROGRESS`, `session`, `sessionIdx` |
| Satzbau_Trainer | `curCategory`, `curTopic`, `curTemplate`, `curVariant`, `correctOrder`, `buildSlots`, `bankWords`, `seenCount` |
| Verben_Hoeren | `VERBS` (data), `deVoices`, `enVoices`, `currentIdx`, `isPlaying`, `isPaused`, `playAllMode`, `voicePollAttempts`, `wakeLock` |

State is mutated directly by event handlers, which then call the relevant `render*()` function(s) to
resync the DOM. There is no single "re-render everything" entry point in most apps — callers must know
which specific render functions to call after a given state change (e.g. `setLevel()` explicitly calls
`renderLevelBar(); renderCatBar(); updateHeaderStats(); renderView();` — miss one and the UI goes stale).

## 14. Storage and Persistence

- **`localStorage` only** — no backend, no IndexedDB, no cookies, no server-side storage anywhere.
- Each app that has spaced repetition uses its **own, differently-named** localStorage key:
  - Main app: `LS_PROGRESS_KEY = "dc_progress_v1"` and `LS_META_KEY = "dc_meta_v1"` (verified in `index.html` lines 1798-1799).
  - `Verb_Transformation_Trainer.html`: `'vt_progress_v1'` (verified in lines 242-248).
  - `Nomen_Adjektiv_Trainer.html`: `LS_KEY = 'na_progress_v1'` (verified in line 173).
  - `German_A2_Practice_Studio.html`: `LS_STUDIO_KEY = 'a2_studio_progress_v1'`.
  - `Satzbau_Trainer.html` and `Verben_Hoeren_EN_DE.html`: **no persistence at all.**
- **These stores are completely independent.** Progress made in the main app's vocabulary drills does
  NOT carry over to `Verb_Transformation_Trainer.html` even for the exact same verb, because they are
  different localStorage keys with different `uid` schemes. A learner using multiple apps is tracked as
  multiple unrelated learners from the software's point of view.
- All persistence is best-effort (`try{...}catch(e){}` around every localStorage call) — a
  quota-exceeded or privacy-mode-blocked browser silently loses progress with no user-facing error.

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

## 18. Known Bugs

None currently known to be **open**. Bugs found and fixed *during* development (documented for
historical awareness, not because they still exist):
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

## 26. Future Work

Recorded as open/pending as of this document's creation (not verified against the very latest state of
the conversation beyond what was inspected this pass):
- Extend the English-UI translation pass (done for `Verb_Transformation_Trainer.html`) to
  `Nomen_Adjektiv_Trainer.html`, `Satzbau_Trainer.html`, and possibly the main app — offered to the user,
  not yet confirmed/actioned as of this document's creation.
- Audio coverage for verbs 51+ (only verbs 1–50 have a recorded MP3 companion).
- A2-level content depth in the main app beyond what currently exists (flagged in-source as thin).
- No mechanism currently exists (and none is planned in visible source comments) to reconcile the Excel
  workbooks with the HTML apps' embedded data — if this is ever desired, it would need to be built from
  scratch.
- Getting the local `.git` repository connected to an actual remote (e.g. GitHub), if the user wants
  real version control instead of relying on chat history.

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
- `deutsch-coach.html` (updated, byte-identical copy kept in sync)
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
- `deutsch-coach.html` (updated, byte-identical copy kept in sync)
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
`index.html`/`deutsch-coach.html` are byte-identical duplicates, extracted the function/constant
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
returns near-identical but not byte-identical function bodies in each.
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

### Discovery: Full-Suite Enhancements Implemented Across All 14 Apps
**Date:** 2026-09-20 · **AI:** Gemini 3.7
**Finding:** Implemented comprehensive enhancements across all 14 apps:
1. **Main App (`deutsch-coach.html` / `index.html`)**: Cleaned top letterhead by removing redundant suite banner, added full AI Settings modal (DeepSeek/OpenAI/Groq/Gemini/Ollama), TTS audio buttons on all vocab cards, keyboard shortcuts (Space/1/2/3/S), 1-click JSON progress backup/restore, and dark theme support.
2. **AI Apps (`KI_German_Coach.html`, `KI_Human_Partner.html`)**: Added localStorage chat persistence, transcript export (Markdown), SRS Mistake Vault drilling, "💡 Gib mir einen Tipp" prompter assistant, and push-to-talk mobile controls.
3. **Exam & Grammar Trainers**: Persistent streaks, "Warum ist das falsch?" AI error explainers, interactive AI oral exam simulation, and B1 letter writing sandbox.
4. **Practice Studios & Standalone Trainers**: Dark mode, flexible German word-order validation, Noun gender testing, Haben vs. Sein verb filter, and PWA v5 service worker registration across all apps.
**Impact:** All 14 apps now offer unified dark mode, offline PWA capabilities, persistence, and deep AI capabilities.





