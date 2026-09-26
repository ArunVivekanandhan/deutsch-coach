/* Interface language German ⇄ English (Task 66). Loaded by js/app-shell.js on every page.
   Only INTERFACE labels are translated (menu, buttons, tabs, headings, hints, placeholders, tooltips) and only by an
   EXACT match of the whole label (a leading emoji / arrow and a trailing "(123)" count are kept) — so German learning
   content (sentences, words, quiz options, word tiles) is never touched. Choice: localStorage dc_ui_lang = 'de' | 'en'
   (button 🌐 in the header). Untranslated labels simply stay German. */
(function () {
  const DICT = {
    // ---- menu, home, shared shell ----
    'Start': 'Start', 'Wörter': 'Words', 'Grammatik & Satzbau': 'Grammar & sentence building', 'Schreiben & Übersetzen': 'Writing & translating',
    'Hören & Lesen': 'Listening & reading', 'Sprechen': 'Speaking', 'Prüfung': 'Exam', 'Einstellungen': 'Settings',
    'Home · Tagesplan': 'Home · daily plan', 'Dein Plan für heute, zuletzt geübt, alle Bereiche.': 'Your plan for today, recently practised, all areas.',
    'Karteikarten (tägliche Wiederholung)': 'Flashcards (daily review)', 'Wörter mit Wiederholungs-System: fällige Karten, Bilder, Tamil, Audio.': 'Words with spaced repetition: due cards, pictures, Tamil, audio.',
    'Meine Fehler (Fehlerheft)': 'My mistakes (mistake notebook)', 'Alle falschen Antworten aus allen Übungen — wiederholen, bis sie sitzen.': 'Every wrong answer from every exercise — review until it sticks.',
    'Mein Fortschritt (Woche)': 'My progress (week)', 'Übungszeit pro Bereich an jedem Tag, Ergebnisse und was du als Nächstes üben solltest.': 'Practice time per area each day, results and what to practise next.',
    'Verben': 'Verbs', 'Alle Zeitformen eines Verbs, Karteikarten, Merkhilfen.': 'All tenses of a verb, flashcards, memory tips.',
    'Nomen (der/die/das)': 'Nouns (der/die/das)', 'Artikel und Plural sicher lernen.': 'Learn articles and plurals for sure.',
    'Adjektive & Adverbien': 'Adjectives & adverbs', 'Gegenteile, Komparativ, Superlativ.': 'Opposites, comparative, superlative.',
    'Wort-Zwillinge': 'Word twins', 'Verwechselbare Wörter: Küche / Kuchen, obwohl / trotzdem …': 'Easily confused words: Küche / Kuchen, obwohl / trotzdem …',
    'Wortschatz: Raster & Tabelle': 'Vocabulary: grid & table', 'Alle Wörter als Raster mit Wortfamilien — oder als Tabelle mit allen Formen (drucken, exportieren).': 'All words as a grid with word families — or as a table with all forms (print, export).',
    'Übersetzer & Wort-Explorer': 'Translator & word explorer', 'Wort oder Satz nachschlagen: Formen, Wortaufbau, Tamil.': 'Look up a word or sentence: forms, word parts, Tamil.',
    'Grammatik-Regeln': 'Grammar rules', 'Alle Regeln A1 → B2 mit Tabellen, Bildern, Tamil-Brücken und Übungen.': 'All rules A1 → B2 with tables, pictures, Tamil bridges and exercises.',
    'Satzbau-Trainer': 'Sentence builder', 'Sätze bauen: Verb auf Position 2, Nebensätze, Konnektoren.': 'Build sentences: verb in position 2, subordinate clauses, connectors.',
    'Zeitreise: gestern · heute · morgen': 'Time travel: yesterday · today · tomorrow', 'Vergangenheit, Gegenwart, Zukunft im selben Satz üben.': 'Practise past, present and future with the same sentence.',
    'Konnektoren': 'Connectors', 'weil, deshalb, obwohl, trotzdem … mit Wortstellung.': 'weil, deshalb, obwohl, trotzdem … with word order.',
    'Grammatik-Spickzettel': 'Grammar cheat sheet', '30+ Abkürzungen und Eselsbrücken.': '30+ shortcuts and mnemonics.',
    'Text-Trainer (EN → DE) + ⚡ Crashkurs': 'Text trainer (EN → DE) + ⚡ crash course', 'Prüfungstext Satz für Satz übersetzen: Leicht / Mittel / Schwer.': 'Translate an exam text sentence by sentence: easy / medium / hard.',
    'Brief schreiben': 'Letter writing', 'E-Mails und Briefe für die Prüfung, KI-Korrektur.': 'E-mails and letters for the exam, AI correction.',
    'KI-Text-Coach': 'AI text coach', 'Auf Deutsch chatten und sofort korrigiert werden.': 'Chat in German and get corrected instantly.',
    'Hörverstehen & Diktat': 'Listening & dictation', 'Hören und aufschreiben, Endlos-Audio.': 'Listen and write down, endless audio.',
    'Auto-Play: Verben hören': 'Auto-play: listen to verbs', 'Englisch → Deutsch im Loop — beim Gehen oder Kochen.': 'English → German on a loop — while walking or cooking.',
    'Geschichte: Lena & Jonas': 'Story: Lena & Jonas', 'Eine Geschichte in Kapiteln lesen und hören.': 'Read and listen to a story in chapters.',
    'Themen-Sprechtrainer': 'Topic speaking trainer', 'ich/du/er … im Perfekt nachsprechen, mit Audio und Loop.': 'Repeat ich/du/er … in the perfect tense, with audio and loop.',
    'Dialog-Schatten': 'Dialogue shadowing', 'Dialoge laut mitsprechen, Aussprache verbessern.': 'Speak dialogues aloud along with the audio, improve pronunciation.',
    'KI-Sprechpartner (Anruf)': 'AI speaking partner (call)', 'Rollenspiele mit Stimme: Café, Arzt, Amt … mit Korrektur.': 'Voice role-plays: café, doctor, office … with correction.',
    'Live-Video-Partner': 'Live video partner', 'Gespräch mit einem KI-Avatar.': 'Conversation with an AI avatar.',
    'Sprechprüfung simulieren (A1 · B1)': 'Speaking exam simulator (A1 · B1)', 'A1: vorstellen, fragen, bitten · B1/DTZ: planen, diskutieren, präsentieren — wie in der Prüfung.': 'A1: introduce yourself, ask, request · B1/DTZ: plan, discuss, present — like in the exam.',
    'A2 Praxis-Studio': 'A2 practice studio', 'Die 7 Module der A2-Prüfung.': 'The 7 modules of the A2 exam.',
    'B1 Praxis-Studio': 'B1 practice studio', 'telc / Goethe Zertifikat B1 gezielt üben.': 'Targeted practice for telc / Goethe B1.',
    'KI-Schlüssel & Einstellungen': 'AI key & settings', 'KI-Anbieter, Stimme, Audio, Design.': 'AI provider, voice, audio, design.',
    'Seite suchen … (z. B. Verben, Brief)': 'Search pages … (e.g. verbs, letter)', 'Seite suchen': 'Search pages', 'braucht KI-Schlüssel': 'needs an AI key',
    'Mehr in diesem Bereich': 'More in this area', 'alle Bereiche': 'all areas', 'Ansicht wechseln': 'Switch view',
    '🔲 Raster & Wortfamilien': '🔲 Grid & word families', '📊 Tabelle (Excel)': '📊 Table (Excel)', '🅰️ A1 · Start Deutsch 1': '🅰️ A1 · Start Deutsch 1', '🅱️ B1 · DTZ': '🅱️ B1 · DTZ',
    'Heute': 'Today', 'Dein Plan für heute': 'Your plan for today', '(ca. 30 Min.)': '(about 30 min.)', 'Zuletzt geübt': 'Recently practised',
    'Neu hier? Der Lernweg': 'New here? The learning path', '1 Wörter': '1 Words', '2 Regel': '2 Rule', '3 Sätze bauen': '3 Build sentences', '4 Hören': '4 Listen', '5 Sprechen': '5 Speak', '6 Schreiben': '6 Write',
    'Noch nichts — fang mit Schritt 1 im Plan an.': 'Nothing yet — start with step 1 of the plan.',
    'Mit den ersten 10 Wörtern starten →': 'Start with your first 10 words →', 'Neue Wörter lernen (10 Karten) →': 'Learn new words (10 cards) →',
    'Karteikarten mit Bild, Tamil und Audio.': 'Flashcards with picture, Tamil and audio.', 'Wiederholen, bevor du vergisst — ca. 10 Min.': 'Review before you forget — about 10 min.',
    'Fehler von gestern sind die Punkte von morgen.': "Yesterday's mistakes are tomorrow's points.",
    'Satzbau: 10 Sätze bauen →': 'Sentence building: build 10 sentences →', 'Verb auf Position 2, Nebensätze, Konnektoren.': 'Verb in position 2, subordinate clauses, connectors.',
    'Eine Grammatik-Regel üben →': 'Practise one grammar rule →', 'Tabelle lesen, dann 10 Aufgaben.': 'Read the table, then 10 exercises.',
    'Zeitreise: gestern · heute · morgen →': 'Time travel: yesterday · today · tomorrow →', 'Vergangenheit, Gegenwart, Zukunft.': 'Past, present, future.',
    'Wort-Zwillinge-Quiz →': 'Word-twins quiz →', 'Verwechselbare Wörter sicher trennen.': 'Tell confusable words apart.',
    'Laut sprechen: ein Thema →': 'Speak aloud: one topic →', '5 Min. nachsprechen — der Mund muss mitlernen.': '5 min. of repeating aloud — your mouth has to learn too.',
    'Ein Diktat hören und schreiben →': 'Listen to a dictation and write it →', 'Hören + Rechtschreibung in einem.': 'Listening + spelling in one.',
    'Einen Text übersetzen (Leicht → Schwer) →': 'Translate a text (easy → hard) →', 'Wie in der Prüfung, Satz für Satz.': 'Like in the exam, sentence by sentence.',
    'Ansichten': 'views', 'KI': 'AI', 'KI — Schlüssel nötig': 'AI — key needed', 'alle': 'all',
    'Start Daily Review': 'Start daily review', 'Due Today': 'Due today',
    'Grammatik in Bildern (animiert)': 'Grammar in pictures (animated)', 'Jede Regel als bewegtes Bild: Wörter wandern, die Katze springt auf den Tisch, die Uhr dreht sich — plus Bild-Quiz.': 'Every rule as a moving picture: words move, the cat jumps onto the table, the clock turns — plus a picture quiz.',
    '🎬 Grammatik in Bildern': '🎬 Grammar in pictures', 'Konzepte': 'Concepts', 'Bild-Quiz': 'Picture quiz', 'Alle Konzepte': 'All concepts', 'Abspielen': 'Play', 'Pause': 'Pause', 'Vorlesen': 'Read aloud',
    'Jetzt im Bild-Quiz testen': 'Test yourself in the picture quiz', 'Regel üben': 'Practise the rule', 'Welcher deutsche Satz passt zum Bild?': 'Which German sentence matches the picture?', 'Neue 10 Bilder': 'New 10 pictures',
    'Konzepte ansehen': 'See the concepts', 'Animation: an': 'Animation: on', 'Animation: aus': 'Animation: off', 'Diese Regel als bewegtes Bild ansehen →': 'See this rule as a moving picture →',
    'Subjekt': 'Subject', 'Verb': 'Verb', 'Objekt': 'Object', 'Ort / Richtung': 'Place / direction', 'Konnektor / Fragewort': 'Connector / question word', 'Rest': 'Other',
    'Wohin? (Akkusativ)': 'Where to? (accusative)', 'Wo? (Dativ)': 'Where? (dative)', 'Bilder animieren': 'Animate pictures',
    'Level-Test: alle Themen eines Levels zusammen': 'Level test: all topics of a level together', 'Bauen (Wörter ordnen)': 'Build (put words in order)', 'Schreiben (wie in der Prüfung)': 'Write (like in the exam)',
    'Gemischt (alle Übungsarten)': 'Mixed (all exercise types)', 'noch nicht gemacht': 'not done yet', 'Test nochmal (neue Sätze)': 'Test again (new sentences)', 'Fehler jetzt üben': 'Practise mistakes now', 'Themen': 'Topics',
    'Grammatikthema': 'grammar topic', 'Alltagsthema': 'everyday topic', 'richtig': 'correct', 'Üben': 'Practise',
    'Fehler gemerkt': 'Mistake saved', 'Richtig:': 'Correct:', 'Jetzt üben': 'Practise now', 'Später': 'Later', 'Fehlerheft': 'Mistake notebook', 'Nach einem Fehler:': 'After a mistake:',
    'fragen': 'ask', 'sofort üben': 'practise at once', 'nur speichern': 'just save', 'Geübt!': 'Practised!', 'Weiter mit der Übung': 'Back to the exercise', 'Welches Verb? (Infinitiv)': 'Which verb? (infinitive)',
    'Nomen mit Artikel (der / die / das)': 'Noun with article (der / die / das)', 'Welches Adjektiv?': 'Which adjective?', 'So ist es richtig:': "Here's the right answer:",
    'Warum?': 'Why?', 'Sätze bauen': 'Build sentences', 'Satz bauen': 'Build the sentence', 'Zwei Sätze verbinden': 'Join two sentences', 'Nebensatz (Verb am Ende)': 'Subordinate clause (verb at the end)', 'Position 1 (Verb sofort)': 'Position 1 (verb right after)', 'Position 0 (ADUSO)': 'Position 0 (ADUSO)', 'Zweiteilig': 'Two-part', 'Neue Runde': 'New round', 'Level': 'Level', 'Art': 'Type', '3 ähnliche Sätze': '3 similar sentences', 'Kein anderer Satz zu dieser Regel': 'No other sentence for this rule', 'Alle Beispiele': 'All examples', 'Beispiele schließen': 'Close examples', 'Tippe auf einen Konnektor → Beispiele (mind. 3 pro Satztyp)': 'Tap a connector → examples (at least 3 per sentence type)', 'Beispiele nach Satztyp (mind. 3 pro Typ)': 'Examples by sentence type (at least 3 each)', 'alle öffnen': 'open all', 'Anderer Satz': 'Other sentence', 'Andere Frage': 'Other question', 'Anderes Bild': 'Other picture', 'Leeren': 'Clear', 'Zurück': 'Back', 'Leicht': 'Easy', 'Mittel': 'Medium', 'Schwer': 'Hard', 'Wörter antippen': 'tap the words', 'ohne Hilfe': 'no help', 'letztes Wort': 'last word', 'leeren': 'clear',
    '3 ähnliche Fragen (KI)': '3 similar questions (AI)', '3 weitere ähnliche Fragen (KI)': '3 more similar questions (AI)', 'Mehr Fragen mit KI (Schlüssel einrichten)': 'More questions with AI (set up a key)', 'Mehr üben': 'More practice', 'Du hast:': 'You wrote:', 'Satz erklärt: Grammatik + Wort für Wort': 'Sentence explained: grammar + word by word', 'Grammatik in diesem Satz:': 'Grammar in this sentence:', 'Wort für Wort:': 'Word by word:',
    // ---- common buttons & words in labels ----
    'Alle': 'All', 'Alle anzeigen': 'Show all', 'Alle Themen': 'All topics', 'Alle löschen': 'Delete all', 'Alle vorlesen': 'Read all aloud', 'Alle nacheinander anhören': 'Listen to all in a row',
    'Anhören': 'Listen', 'anhören': 'listen', 'Nochmal hören': 'Listen again', 'Beispiel anhören': 'Listen to the example', 'ganzen Text hören': 'listen to the whole text', 'vorlesen': 'read aloud',
    'Prüfen': 'Check', 'Prüfen (Strg+Enter)': 'Check (Ctrl+Enter)', 'Weiter →': 'Next →', 'Weiter': 'Next', 'Nächste →': 'Next →', 'Nächste Frage': 'Next question', 'Nächstes Thema': 'Next topic', 'Nächste Zeile': 'Next line',
    'Nochmal': 'Again', 'Nochmal versuchen': 'Try again', '↺ Nochmal': '↺ Again', 'Lösung': 'Solution', 'Lösung zeigen': 'Show solution', 'Regel zeigen': 'Show rule', 'Zurücksetzen': 'Reset', 'Filter zurücksetzen': 'Reset filters',
    'Schließen': 'Close', 'Hinweis schließen': 'Close hint', 'Verlauf schließen': 'Close history', 'Suchen / Übersetzen': 'Search / translate', 'Wort suchen': 'Search word',
    'Jetzt üben': 'Practise now', 'Üben': 'Practise', 'Sätze üben': 'Practise sentences', 'Satz bauen': 'Build the sentence', 'Richtigen Satz wählen': 'Choose the right sentence', 'Welche Zeit?': 'Which tense?',
    'Thema': 'Topic', 'Thema filtern': 'Filter topic', 'Thema:': 'Topic:', 'Ohne Thema': 'No topic', 'Häufigkeit': 'Frequency', 'Deutsches Wort': 'German word', 'Wort oder Satz': 'Word or sentence',
    'Nur Nomen': 'Nouns only', 'Nur Verben': 'Verbs only', 'Nur das Wort': 'Only the word', 'Nur auf Klick vorlesen': 'Read aloud only on click', 'ändern': 'change',
    'Regelmäßig': 'Regular', 'Unregelmäßig': 'Irregular', 'Umlaut': 'Umlaut', 'Nicht steigerbar': 'Not comparable', 'unverändert': 'unchanged',
    'Nomen': 'Nouns', 'Präteritum': 'Simple past (Präteritum)', 'Zeit': 'Time', 'Zeit & Dauer': 'Time & duration', 'Größe & Menge': 'Size & amount', 'Charakter & Persönlichkeit': 'Character & personality',
    'Gefühle & Emotionen': 'Feelings & emotions', 'Gefühle': 'Feelings', 'Aussehen & Zustand': 'Appearance & condition', 'Qualität & Bewertung': 'Quality & rating', 'Körper': 'Body', 'Behörden': 'Authorities',
    'beginnt mit': 'starts with', 'endet mit': 'ends with', 'enthält': 'contains', 'ähnliche Bedeutung': 'similar meaning', 'ohne Präfix': 'no prefix', 'Präfix-Typ': 'Prefix type', 'Alle Präfix-Typen': 'All prefix types',
    'Präfix (trennbar / untrennbar)': 'Prefix (separable / inseparable)', 'Trennbare Verben': 'Separable verbs', 'Breiten zurücksetzen': 'Reset widths', 'Spalten und Reihenfolge': 'Columns and order',
    'Willkommen zurück!': 'Welcome back!', 'Wofür lernst du Deutsch?': 'Why are you learning German?', 'Wie viele Minuten pro Tag?': 'How many minutes a day?', 'Ziel-Prüfung': 'Target exam',
    'Übungsfragen (aus der App)': 'Practice questions (from the app)', 'Übungsfragen mit KI': 'Practice questions with AI', 'Im Übersetzer öffnen: alle Details, KI fragen, üben': 'Open in the translator: all details, ask AI, practise',
    'Gesprächsverlauf': 'Conversation history', 'Anruf-Einstellungen': 'Call settings', 'Art des Gesprächs': 'Type of conversation', 'Gesprächsart (KI)': 'Conversation type (AI)', 'Videoanruf mit dem Tutor': 'Video call with the tutor',
    'Hörverstehen Trainer': 'Listening trainer', 'Verben-Labor': 'Verb lab', 'Verben Flashcards': 'Verb flashcards', 'Farben der Satzglieder': 'Colours of the sentence parts', 'Unterschied hören': 'Hear the difference',
    'Tamil: KI-Übersetzung (AI-assisted translation, spot-checked)': 'Tamil: AI-assisted translation, spot-checked', 'Beispielsatz von KI erstellt (AI-drafted, checked)': 'Example sentence drafted by AI, checked',
    // ---- Text-Trainer ----
    '📝 Text-Trainer: Englisch → Deutsch': '📝 Text trainer: English → German', 'Crashkurs': 'Crash course', 'Lesen & Hören': 'Read & listen', 'Satz für Satz': 'Sentence by sentence', 'Verschwinde-Text': 'Vanishing text',
    'Prüfung simulieren': 'Simulate the exam', 'Eigener Text': 'Your own text', 'Spickzettel': 'Cheat sheet', 'Blitz-Quiz': 'Quick quiz', 'Sätze verbinden': 'Join sentences',
    'Für die Prüfung morgen: Konnektoren · Satzbau A1 · Akkusativ/Dativ': "For tomorrow's exam: connectors · A1 word order · accusative/dative",
    'Übersetze den Text ins Deutsche.': 'Translate the text into German.', 'Ein Feld pro Satz': 'One box per sentence', 'Ein großes Feld (wie auf Papier)': 'One big box (like on paper)',
    'Leicht': 'Easy', 'Mittel': 'Medium', 'Schwer': 'Hard', 'Wörter antippen + Regel sichtbar': 'tap words + rule shown', 'selbst tippen + Anfangsbuchstaben': 'type yourself + first letters', 'ohne Hilfe, wie in der Prüfung': 'no help, like in the exam',
    'Wörter unten antippen …': 'Tap the words below …', 'letztes Wort': 'last word', 'leeren': 'clear', 'Regel zeigen': 'Show rule', 'Skelett': 'Skeleton', 'Lösung': 'Solution',
    'Nächste Stufe →': 'Next level →', 'Jetzt Prüfung simulieren': 'Simulate the exam now', 'Abgeben & vergleichen': 'Hand in & compare', 'Falsche Sätze einzeln üben': 'Practise the wrong sentences one by one',
    'Nur die falschen nochmal': 'Only the wrong ones again', 'Nochmal schreiben': 'Write it again', 'Nochmal von vorn': 'Start again', 'Musterübersetzung erstellen': 'Create a model translation',
    'Auf Deutsch schreiben …': 'Write in German …', 'Ein Satz …': 'One sentence …', 'Tipp': 'Hint', 'Nach „Prüfen“ vorlesen: Aus': 'Read aloud after "Check": off', 'Nach „Prüfen“ vorlesen: An': 'Read aloud after "Check": on',
    '🔊 neben einem Satz spielt immer — auf Wunsch.': '🔊 next to a sentence always plays — on request.', 'English text anzeigen': 'Show English text',
    'Jetzt testen: Blitz-Quiz →': 'Test yourself now: quick quiz →', 'Satzbau-Trainer (Konnektoren-Themen)': 'Sentence builder (connector topics)', 'Konnektoren-Referenz': 'Connector reference',
    'Neue 15 Fragen': 'New 15 questions', 'Nur die falschen': 'Only the wrong ones', 'Weiter: Sätze verbinden': 'Next: join sentences', 'Weiter: Verschwinde-Text': 'Next: vanishing text', 'Alle Sätze': 'All sentences',
    'Alles gemischt': 'All mixed', 'Satzbau A1': 'A1 word order', 'Akkusativ / Dativ': 'Accusative / dative', 'Was passt in die Lücke?': 'What fits in the gap?', 'Welcher Satz ist richtig?': 'Which sentence is right?',
    'Jetzt: dein Prüfungstext Satz für Satz': 'Now: your exam text sentence by sentence', 'perfekt verbunden': 'joined perfectly', 'Hilfen kosten nichts — aber versuch es zuerst allein.': "Hints are free — but try on your own first.",
    // ---- Meine Fehler ----
    '📒 Meine Fehler': '📒 My mistakes', 'Meine Fehler': 'My mistakes', 'jetzt fällig': 'due now', 'noch offen': 'still open', 'gelernt': 'learnt', 'Jetzt wiederholen': 'Review now', 'Wiederholen': 'Review',
    'Alle Fehler ansehen': 'See all mistakes', 'Gelernte entfernen': 'Remove learnt ones', 'Weiß ich nicht': "I don't know", 'Zur Übung': 'Go to the exercise', 'Liste': 'List', 'Weiter wiederholen': 'Keep reviewing',
    'Frage': 'Question', 'Richtig': 'Right', 'Bereich': 'Area', 'Stand': 'Progress', 'Auf Deutsch … (Enter = prüfen)': 'In German … (Enter = check)', 'richtig wiederholt': 'reviewed correctly',
    // ---- Mein Fortschritt ----
    '📈 Mein Fortschritt': '📈 My progress', 'Übungszeit pro Tag (Minuten)': 'Practice time per day (minutes)', '7 Tage': '7 days', '4 Wochen': '4 weeks', 'Als Tabelle anzeigen': 'Show as a table',
    'Bereiche in diesem Zeitraum': 'Areas in this period', 'Ergebnisse': 'Results', 'Minuten in 7 Tagen': 'minutes in 7 days', 'Tage geübt (≥ 1 Min.)': 'days practised (≥ 1 min.)', 'Fehler gelernt': 'mistakes learnt',
    'Wörter gemeistert': 'words mastered', 'Fehler wiederholen': 'Reviewing mistakes', 'Schreiben': 'Writing', 'Zeitraum': 'Period', 'Tag': 'Day', 'Summe': 'Total',
    // ---- Zeitreise / Wort-Zwillinge / Satzbau / Grammatik (headings & tabs) ----
    'Zeitstrahl': 'Timeline', 'Verb-Zeitmaschine': 'Verb time machine', 'Wort-Zwillinge (Küche / Kuchen)': 'Word twins (Küche / Kuchen)', 'Karten': 'Cards', 'Quiz': 'Quiz',
    'Hauptsatz: Verb auf Position 2': 'Main clause: verb in position 2', 'Inversion: Verb auf Position 2': 'Inversion: verb in position 2', 'Nebensatz: mehrere Verben am Ende': 'Subordinate clause: several verbs at the end',
    'Nebensatz zuerst + zu-Infinitiv': 'Subordinate clause first + zu-infinitive', 'Adjektivendungen im Satz': 'Adjective endings in the sentence', 'Dativ- und Akkusativobjekt: Reihenfolge': 'Dative and accusative object: order',
    'Reflexive Verben: Position von sich': 'Reflexive verbs: position of sich', 'Vorfeld: Was steht auf Position 1?': 'Front field: what stands in position 1?', 'Infinitiv mit zu': 'Infinitive with zu',
    'Temporale Nebensätze': 'Time clauses', 'Relativsätze': 'Relative clauses', 'Ersatzinfinitiv: Modalverb im Perfekt': 'Double infinitive: modal verb in the perfect', 'Negation: nicht und kein': 'Negation: nicht and kein',
    'Präpositionen: Dativ, Akkusativ, Wechselpräpositionen': 'Prepositions: dative, accusative, two-way prepositions', 'Subordinierend (Verb am Ende)': 'Subordinating (verb at the end)', 'Kein Einfluss auf Wortstellung': 'No effect on word order',
    'Übung starten (Start Practice)': 'Start practice', 'Start Practice (Üben starten)': 'Start practice',
    // ---- settings / translator placeholders ----
    'Wort suchen … (z. B. Küche, cake, கேக்)': 'Search a word … (e.g. Küche, cake, கேக்)', 'z. B.  Abtreibung · aufstehen · ging · house · வீடு · Ich stehe um 7 Uhr auf.': 'e.g.  Abtreibung · aufstehen · ging · house · வீடு · Ich stehe um 7 Uhr auf.',
    'Eigene Frage zu diesem Wort / Satz … (Deutsch, English, தமிழ்)': 'Your own question about this word / sentence … (German, English, தமிழ்)',
    'Einstellungen (Global Setup)': 'Settings (global setup)', 'ElevenLabs-Schlüssel': 'ElevenLabs key', 'Simli-Schlüssel & Face-ID': 'Simli key & face ID', 'OpenAI-Schlüssel (Stimme / Spracherkennung)': 'OpenAI key (voice / speech recognition)',
    'leer = Schlüssel aus AI Config (OpenAI) verwenden': 'empty = use the key from AI config (OpenAI)'
  };
  const PATTERNS = [
    [/^Geschätzt aus Worthäufigkeit – Rang ([\d.]+) von 50\.000 Wortformen \(OpenSubtitles 2018\)$/, 'Estimated from word frequency – rank $1 of 50,000 word forms (OpenSubtitles 2018)'],
    [/^Geschätzt aus Worthäufigkeit – Seltener als die 50\.000 häufigsten Wortformen \(OpenSubtitles 2018\)$/, 'Estimated from word frequency – rarer than the 50,000 most frequent word forms (OpenSubtitles 2018)'],
    [/^Rang ([\d.]+) von 50\.000 Wortformen \(OpenSubtitles 2018\)$/, 'Rank $1 of 50,000 word forms (OpenSubtitles 2018)'],
    [/^(\S+) anhören$/, 'Listen: $1'],
    [/^Satz (\d+) auf Deutsch …$/, 'Sentence $1 in German …'],
    [/^Satz (\d+) \/ (\d+)(.*)$/, 'Sentence $1 / $2$3'], [/^Frage (\d+) \/ (\d+)(.*)$/, 'Question $1 / $2$3'],
    [/^Stufe (\d) \/ 4$/, 'Level $1 / 4'],
    [/^(\d+) fällige Karten wiederholen →$/, 'Review $1 due cards →'], [/^(\d+) Fehler aus deinem Fehlerheft wiederholen →$/, 'Review $1 mistakes from your notebook →'],
    [/^(\d+) falsche Sätze im Text-Trainer nochmal →$/, 'Redo $1 wrong sentences in the text trainer →'],
    [/^(\d+) Sätze · ✓ (\d+) gemeistert · 🏆 (\d+) Experte$/, '$1 sentences · ✓ $2 mastered · 🏆 $3 expert'],
    [/^\+ Wiederholung (A1(?: \+ A2)?|A2 \+ A1)$/, '+ revision of $1'],
    [/^Neuer Satz, gleiche Regel · (.+)$/, 'New sentence, same rule · $1'], [/^(\d) neue Sätze kommen als Nächstes$/, '$1 new sentences come next'],
    [/^Jetzt wiederholen \((\d+)\)$/, 'Review now ($1)'], [/^(\d+) Min\.$/, '$1 min.']
  ];
  // elements whose own labels may be translated; learning content inside them is safe because matches are exact
  const UI = '.kx-hint,button,a,label,summary,th,h1,h2,h3,h4,option,legend,[role=tab],.tab,.chip,.section-title,.nav-group-title,.module-title,.module-desc,.srs-label,.progress-label,.dc-more-t,.dc-views-t,.subq,.sub,.muted,.why,.plan,.today-card,.stat,.tile,.area-head,.row';
  const SKIP = '.opt,button.tile,.wz-opt,.zr-opt,[data-opt],[data-w],[data-tile],[data-no-i18n],[lang="ta"],textarea,input,select.de-only,.diff,.vanish,.q,.en-big,.skel,script,style';
  const lang = () => { try { return localStorage.getItem('dc_ui_lang') === 'en' ? 'en' : 'de'; } catch (e) { return 'de'; } };
  function tr(s) {
    const t = s.trim(); if (!t) return null;
    if (DICT[t] != null) return DICT[t];
    for (const [re, rep] of PATTERNS) if (re.test(t)) return t.replace(re, rep);
    // keep a leading emoji/arrow and a trailing count "(12)" or ":" around a known label
    const m = t.match(/^([^\p{L}\p{N}„"(]*)(.*?)(\s*\(\d[\d.,]*\)|\s*:)?$/u);
    if (m && (m[1] || m[3]) && m[2] && DICT[m[2]] != null) return m[1] + DICT[m[2]] + (m[3] || '');
    return null;
  }
  const ORIG = new WeakMap(), SET = new WeakMap();
  function doText(n, en) {
    const el = n.parentElement; if (!el || !el.closest(UI) || el.closest(SKIP)) return;
    if (!ORIG.has(n) || (SET.has(n) && n.nodeValue !== SET.get(n))) ORIG.set(n, n.nodeValue);   // page changed the text itself
    const o = ORIG.get(n);
    if (en) { const t = tr(o); if (t != null) { const v = o.replace(o.trim(), t); if (n.nodeValue !== v) { n.nodeValue = v; } SET.set(n, v); } }
    else if (n.nodeValue !== o && SET.has(n) && n.nodeValue === SET.get(n)) { n.nodeValue = o; SET.set(n, o); }
  }
  function doAttrs(el, en) {
    if (el.closest && el.closest('[data-no-i18n]')) return;
    for (const a of ['placeholder', 'title', 'aria-label']) {
      if (!el.hasAttribute(a)) continue;
      const k = 'data-i18n-' + a; if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(a));
      const o = el.getAttribute(k), t = en ? tr(o) : null;
      el.setAttribute(a, t != null ? t : o);
    }
  }
  function apply(root, partial) {
    const en = lang() === 'en', r = root || document.body; if (!r) return;
    if (en) used = true; else if (!used) return;          // German and never switched: nothing to do
    const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) doText(n, en);
    (r.querySelectorAll ? [r, ...r.querySelectorAll('[placeholder],[title],[aria-label]')] : []).forEach(el => el.getAttribute && doAttrs(el, en));
    if (partial) return;
    document.documentElement.setAttribute('data-ui-lang', lang());
    paintBtn();
  }
  function paintBtn() {
    const en = lang() === 'en';
    document.querySelectorAll('#dcLangBtn').forEach(b => { b.textContent = en ? '🌐 EN' : '🌐 DE'; b.title = en ? 'Interface: English — click for German' : 'Bedienung: Deutsch — klicken für Englisch'; });
  }
  // after the first switch to English, translate only what the page adds or changes (big pages re-render a lot)
  let used = false;
  const obs = new MutationObserver(recs => {
    if (lang() !== 'en' && !used) return;
    const en = lang() === 'en'; obs.disconnect();
    for (const r of recs) {
      if (r.type === 'characterData') doText(r.target, en);
      else r.addedNodes.forEach(n => { if (n.nodeType === 3) doText(n, en); else if (n.nodeType === 1) apply(n, true); });
    }
    watch();
  });
  const watch = () => { if (document.body) obs.observe(document.body, { childList: true, subtree: true, characterData: true }); };
  function setLang(l) { try { localStorage.setItem('dc_ui_lang', l); } catch (e) {} obs.disconnect(); used = true; apply(); paintBtn(); watch(); }
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#dcLangBtn')) setLang(lang() === 'en' ? 'de' : 'en'); });
  window.dcUiLang = { get: lang, set: setLang, tr, apply };
  const start = () => { apply(); paintBtn(); watch(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0)); else setTimeout(start, 0);
})();
