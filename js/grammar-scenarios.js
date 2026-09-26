/* Grammatik-Regeln: every sentence TYPE of a rule with at least 3 examples (Task 80 — phase 1: all A1 rules).
   DC_GRAMMAR_SC[ruleId] = [{ t: title, d: why / how (one line), must: regex source the German must match (optional),
   ex: [{ de, en }] }]. In `de`, [ ] marks the part that shows the rule (rendered bold + coloured).
   German and English written by the assistant; checked by scripts/check_grammar_scenarios.py (build step):
   ≥ 3 examples per type, markers balanced, final punctuation, `must` matched, no duplicates. */
window.DC_GRAMMAR_SC = {
  r1_wordorder: [
    { t: 'Hauptsatz: Verb auf Position 2', d: 'Egal was auf Position 1 steht (Subjekt, Zeit, Ort) — das konjugierte Verb ist immer das 2. Satzglied.', ex: [
      { de: 'Ich [gehe] heute ins Kino.', en: 'I\'m going to the cinema today.' },
      { de: 'Heute [gehe] ich ins Kino.', en: 'Today I\'m going to the cinema.' },
      { de: 'Im Sommer [fahren] wir nach Indien.', en: 'In summer we\'re going to India.' }] },
    { t: 'Ja/Nein-Frage & Imperativ: Verb auf Position 1', d: 'Keine W-Frage → das Verb steht ganz vorne.', ex: [
      { de: '[Kommst] du mit?', en: 'Are you coming along?' },
      { de: '[Hast] du heute Zeit?', en: 'Do you have time today?' },
      { de: '[Komm] bitte her!', en: 'Please come here!' }] },
    { t: 'Satzklammer: Perfekt / Modalverb', d: 'Hilfs- oder Modalverb auf Position 2, der zweite Verbteil ganz am Ende.', ex: [
      { de: 'Ich [habe] gestern einen Job [bekommen].', en: 'I got a job yesterday.' },
      { de: 'Wir [müssen] heute lange [arbeiten].', en: 'We have to work late today.' },
      { de: 'Sie [ist] schon nach Hause [gegangen].', en: 'She has already gone home.' }] },
    { t: 'Position 0 (ADUSO): aber, denn, und, sondern, oder', d: 'Zählt nicht mit → danach normale Reihenfolge: Subjekt + Verb.', must: '\\b(aber|denn|und|sondern|oder)\\b', ex: [
      { de: 'Ich bin müde, [aber] ich arbeite noch.', en: 'I\'m tired, but I\'m still working.' },
      { de: 'Ich lerne Deutsch, [denn] ich wohne in Köln.', en: 'I\'m learning German, because I live in Cologne.' },
      { de: 'Er kommt heute, [oder] er kommt morgen.', en: 'He\'s coming today, or he\'s coming tomorrow.' }] },
    { t: 'Position 1: deshalb, trotzdem, sonst, dann', d: 'Das Wort nimmt selbst Position 1 → Verb sofort danach, dann das Subjekt.', must: '\\b(deshalb|trotzdem|sonst|dann)\\b', ex: [
      { de: 'Es regnet, [deshalb bleibe] ich zu Hause.', en: 'It\'s raining, so I\'m staying at home.' },
      { de: 'Ich bin krank, [trotzdem gehe] ich zur Arbeit.', en: 'I\'m ill, but I\'m going to work anyway.' },
      { de: 'Beeil dich, [sonst verpassen] wir den Bus.', en: 'Hurry up, otherwise we\'ll miss the bus.' }] },
    { t: 'Nebensatz hinten: Verb am Ende', d: 'weil, dass, wenn, obwohl … schicken das konjugierte Verb ans Ende des Nebensatzes.', must: '\\b(weil|dass|wenn|obwohl|ob)\\b', ex: [
      { de: 'Ich bleibe zu Hause, weil ich krank [bin].', en: 'I\'m staying at home because I\'m ill.' },
      { de: 'Er sagt, dass der Kurs morgen [beginnt].', en: 'He says that the course starts tomorrow.' },
      { de: 'Ich weiß nicht, ob sie heute [kommt].', en: 'I don\'t know whether she\'s coming today.' }] },
    { t: 'Nebensatz vorne: Verb direkt nach dem Komma', d: 'Der ganze Nebensatz ist Position 1 → das Verb des Hauptsatzes kommt sofort nach dem Komma.', must: '^(Weil|Wenn|Als|Obwohl|Dass|Ob)\\b', ex: [
      { de: 'Weil ich krank bin, [bleibe] ich zu Hause.', en: 'Because I\'m ill, I\'m staying at home.' },
      { de: 'Wenn ich Zeit habe, [lese] ich gern.', en: 'When I have time, I like reading.' },
      { de: 'Als ich klein war, [wohnten] wir in Madurai.', en: 'When I was little, we lived in Madurai.' }] },
    { t: 'TeKaMoLo: Zeit → Grund → Art → Ort', d: 'Im Mittelfeld: wann? → warum? → wie? → wo/wohin?', ex: [
      { de: 'Ich fahre [morgen] [wegen der Arbeit] [mit dem Zug] [nach Berlin].', en: 'Tomorrow I\'m going to Berlin by train because of work.' },
      { de: 'Wir essen [heute] [zusammen] [im Restaurant].', en: 'Today we\'re eating together at a restaurant.' },
      { de: 'Er geht [jeden Tag] [zu Fuß] [zur Schule].', en: 'He walks to school every day.' }] }
  ],
  a1_praesens: [
    { t: 'Regelmäßig: Stamm + Endung', d: 'ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en.', ex: [
      { de: 'Ich lern[e] Deutsch.', en: 'I\'m learning German.' },
      { de: 'Du wohn[st] in Berlin.', en: 'You live in Berlin.' },
      { de: 'Wir spiel[en] am Sonntag Fußball.', en: 'We play football on Sunday.' }] },
    { t: 'Stamm auf -t / -d: extra -e-', d: 'Sonst kann man die Endung nicht hören: du arbeitest, er findet.', must: '(e?test|et)\\b', ex: [
      { de: 'Du arbeit[est] sehr viel.', en: 'You work a lot.' },
      { de: 'Er find[et] seinen Schlüssel nicht.', en: 'He can\'t find his key.' },
      { de: 'Ihr wart[et] auf den Bus.', en: 'You (all) are waiting for the bus.' }] },
    { t: 'Stamm auf -s / -ß / -z: du nur -t', d: 'Das s ist schon da: du heißt (nicht heißst), du tanzt.', ex: [
      { de: 'Wie heiß[t] du?', en: 'What\'s your name?' },
      { de: 'Du tanz[t] sehr gut.', en: 'You dance very well.' },
      { de: 'Du reis[t] gern, oder?', en: 'You like travelling, don\'t you?' }] },
    { t: 'Vokalwechsel nur bei du und er/sie/es', d: 'e→i (sprechen), e→ie (lesen), a→ä (fahren) — ich, wir, ihr, sie bleiben normal.', ex: [
      { de: 'Du [sprichst] gut Deutsch.', en: 'You speak German well.' },
      { de: 'Er [fährt] jeden Tag mit dem Bus.', en: 'He takes the bus every day.' },
      { de: 'Sie [liest] gern Romane.', en: 'She likes reading novels.' }] },
    { t: 'sein & haben (unregelmäßig)', d: 'bin, bist, ist, sind, seid, sind · habe, hast, hat, haben, habt, haben.', must: '\\b(bin|bist|ist|sind|seid|habe|hast|hat|haben|habt)\\b', ex: [
      { de: 'Ich [bin] heute müde.', en: 'I\'m tired today.' },
      { de: 'Du [hast] Glück.', en: 'You\'re lucky.' },
      { de: 'Wir [sind] aus Indien.', en: 'We\'re from India.' }] },
    { t: 'du oder Sie?', d: 'du = Familie, Freunde, Kinder (நீ) · Sie = Fremde, Arbeit, Ämter (நீங்கள்) — Sie immer groß, Verb mit -en.', must: '\\b(du|Sie)\\b', ex: [
      { de: 'Woher [kommst du], Priya?', en: 'Where are you from, Priya? (friend)' },
      { de: 'Woher [kommen Sie], Frau Kumar?', en: 'Where are you from, Mrs Kumar? (polite)' },
      { de: '[Können Sie] mir bitte helfen?', en: 'Could you help me, please? (polite)' }] }
  ],
  a1_pronomen: [
    { t: 'Nominativ — wer? (Subjekt)', d: 'ich, du, er, sie, es, wir, ihr, sie/Sie.', ex: [
      { de: '[Er] wohnt in Köln.', en: 'He lives in Cologne.' },
      { de: '[Wir] lernen zusammen.', en: 'We study together.' },
      { de: '[Sie] ist meine Lehrerin.', en: 'She is my teacher.' }] },
    { t: 'Akkusativ — wen? (direktes Objekt)', d: 'mich, dich, ihn, sie, es, uns, euch, sie/Sie.', must: '\\b(mich|dich|ihn|uns|euch)\\b', ex: [
      { de: 'Ich sehe [ihn] jeden Tag.', en: 'I see him every day.' },
      { de: 'Kennst du [mich] noch?', en: 'Do you still remember me?' },
      { de: 'Wir besuchen [euch] am Sonntag.', en: 'We\'ll visit you (all) on Sunday.' }] },
    { t: 'Dativ — wem? (helfen, geben, gehören …)', d: 'mir, dir, ihm, ihr, ihm, uns, euch, ihnen/Ihnen.', must: '\\b(mir|dir|ihm|ihr|ihnen|Ihnen)\\b', ex: [
      { de: 'Kannst du [mir] helfen?', en: 'Can you help me?' },
      { de: 'Das Buch gehört [ihm].', en: 'The book belongs to him.' },
      { de: 'Ich gebe [ihr] das Geld.', en: 'I\'m giving her the money.' }] },
    { t: 'Possessiv im Nominativ', d: 'mein (der/das) · meine (die/Plural) — wie ein/eine.', must: '\\b([Mm]ein|[Mm]eine|[Dd]ein|[Dd]eine|[Ss]ein|[Ss]eine|[Uu]nser|[Uu]nsere)\\b', ex: [
      { de: 'Das ist [mein] Bruder.', en: 'This is my brother.' },
      { de: '[Meine] Mutter kocht sehr gut.', en: 'My mother cooks very well.' },
      { de: 'Wo ist [dein] Handy?', en: 'Where is your phone?' }] },
    { t: 'Possessiv im Akkusativ', d: 'Nur maskulin ändert sich: meinen Vater · meine Mutter · mein Kind.', must: '\\b(meinen|deinen|seinen|ihren|unseren|deine|meine)\\b', ex: [
      { de: 'Ich besuche [meinen] Vater.', en: 'I\'m visiting my father.' },
      { de: 'Er sucht [seinen] Schlüssel.', en: 'He\'s looking for his key.' },
      { de: 'Hast du [deine] Tasche?', en: 'Do you have your bag?' }] },
    { t: 'Possessiv im Dativ', d: 'meinem (der/das) · meiner (die) · meinen + n (Plural).', must: '\\b(meinem|meiner|seinem|seiner|unseren|ihrem|ihrer)\\b', ex: [
      { de: 'Ich wohne bei [meiner] Tante.', en: 'I live with my aunt.' },
      { de: 'Er spricht mit [seinem] Chef.', en: 'He\'s talking to his boss.' },
      { de: 'Wir helfen [unseren] Eltern.', en: 'We help our parents.' }] }
  ],
  a1_negation: [
    { t: 'kein — statt ein / ohne Artikel', d: 'kein wie ein: kein Auto, keine Zeit, keinen Kaffee (Akk. maskulin -en).', must: '\\bkein', ex: [
      { de: 'Ich habe [kein] Auto.', en: 'I don\'t have a car.' },
      { de: 'Wir haben heute [keine] Zeit.', en: 'We have no time today.' },
      { de: 'Er trinkt [keinen] Kaffee.', en: 'He doesn\'t drink coffee.' }] },
    { t: 'nicht am Satzende — das Verb wird verneint', d: 'Nichts anderes wird verneint → nicht ganz nach hinten.', must: '\\bnicht[.!?]$', ex: [
      { de: 'Ich komme heute [nicht].', en: 'I\'m not coming today.' },
      { de: 'Das verstehe ich [nicht].', en: 'I don\'t understand that.' },
      { de: 'Ich kenne ihn [nicht].', en: 'I don\'t know him.' }] },
    { t: 'nicht vor Adjektiv oder Ort', d: 'nicht steht direkt vor dem, was verneint wird.', must: '\\bnicht\\b', ex: [
      { de: 'Er ist [nicht] müde.', en: 'He isn\'t tired.' },
      { de: 'Das Essen ist [nicht] teuer.', en: 'The food isn\'t expensive.' },
      { de: 'Ich fahre [nicht] nach Berlin.', en: 'I\'m not going to Berlin.' }] },
    { t: 'nicht vor dem 2. Verbteil', d: 'Bei Perfekt, Modalverb, trennbarem Verb: nicht vor den Teil am Ende.', must: '\\bnicht\\b', ex: [
      { de: 'Ich habe es [nicht] gesehen.', en: 'I didn\'t see it.' },
      { de: 'Wir können heute [nicht] kommen.', en: 'We can\'t come today.' },
      { de: 'Er ruft mich [nicht] an.', en: 'He doesn\'t call me.' }] },
    { t: 'Doch — Ja auf eine negative Frage', d: 'Frage mit nicht/kein, Antwort positiv → Doch! (nicht Ja).', must: '\\bDoch\\b', ex: [
      { de: 'Kommst du nicht? – [Doch], ich komme!', en: 'Aren\'t you coming? – Yes, I am!' },
      { de: 'Hast du keinen Hunger? – [Doch], großen Hunger!', en: 'Aren\'t you hungry? – Yes, very hungry!' },
      { de: 'Ist das nicht dein Buch? – [Doch], das ist meins.', en: 'Isn\'t that your book? – Yes, it\'s mine.' }] },
    { t: 'nichts · nie · niemand', d: 'nichts = nothing · nie = never · niemand = nobody.', must: '\\b(nichts|nie|Niemand|niemand)\\b', ex: [
      { de: 'Ich habe heute [nichts] gegessen.', en: 'I haven\'t eaten anything today.' },
      { de: 'Er kommt [nie] pünktlich.', en: 'He\'s never on time.' },
      { de: '[Niemand] ist zu Hause.', en: 'Nobody is at home.' }] }
  ],
  a1_fragen: [
    { t: 'W-Frage: W-Wort (1) + Verb (2)', d: 'Das Verb steht direkt nach dem Fragewort, dann das Subjekt.', must: '^(Wo|Wann|Warum|Was|Wer|Wie)\\b', ex: [
      { de: '[Wo wohnst] du?', en: 'Where do you live?' },
      { de: '[Wann beginnt] der Kurs?', en: 'When does the course start?' },
      { de: '[Warum lernst] du Deutsch?', en: 'Why are you learning German?' }] },
    { t: 'Ja/Nein-Frage: Verb zuerst', d: 'Kein Fragewort → das Verb auf Position 1.', must: '\\?$', ex: [
      { de: '[Hast] du Zeit?', en: 'Do you have time?' },
      { de: '[Sprechen] Sie Englisch?', en: 'Do you speak English?' },
      { de: '[Kommst] du morgen mit?', en: 'Are you coming along tomorrow?' }] },
    { t: 'Wo? · Wohin? · Woher?', d: 'wo = Ort (Dativ) · wohin = Richtung · woher = Herkunft.', must: '^(Wo|Wohin|Woher)\\b', ex: [
      { de: '[Wo] arbeitest du? – In einem Krankenhaus.', en: 'Where do you work? – In a hospital.' },
      { de: '[Wohin] fährst du? – Nach Hamburg.', en: 'Where are you going? – To Hamburg.' },
      { de: '[Woher] kommst du? – Aus Indien.', en: 'Where are you from? – From India.' }] },
    { t: 'Wie viel? · Wie viele? · Wie lange?', d: 'wie viel + ohne Plural / Geld · wie viele + Plural · wie lange = Dauer.', must: '^Wie (viel|viele|lange)\\b', ex: [
      { de: '[Wie viel] kostet das?', en: 'How much does that cost?' },
      { de: '[Wie viele] Kinder haben Sie?', en: 'How many children do you have?' },
      { de: '[Wie lange] wohnst du schon hier?', en: 'How long have you been living here?' }] },
    { t: 'Wen? (Akkusativ) · Wem? (Dativ)', d: 'wen = whom (sehen, besuchen) · wem = to whom (helfen, gehören, geben).', must: '^(Wen|Wem)\\b', ex: [
      { de: '[Wen] besuchst du am Wochenende?', en: 'Who are you visiting at the weekend?' },
      { de: '[Wem] gehört die Tasche?', en: 'Whose bag is this?' },
      { de: '[Wem] hilfst du?', en: 'Who are you helping?' }] },
    { t: 'Welcher? · Was für ein?', d: 'welcher = aus einer bekannten Auswahl (Endung wie der) · was für ein = welche Art (Endung wie ein).', must: '^(Welche|Welchen|Welcher|Welches|Was für)\\b', ex: [
      { de: '[Welchen] Bus nimmst du?', en: 'Which bus are you taking?' },
      { de: '[Welche] Farbe magst du?', en: 'Which colour do you like?' },
      { de: '[Was für ein] Auto hast du?', en: 'What kind of car do you have?' }] }
  ],
  a1_zahlen_zeit: [
    { t: 'Zahlen 21–99: Einer + und + Zehner', d: 'Wie beim alten Englisch „four-and-twenty“: erst die Einer.', must: 'und(zwanzig|dreißig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig)', ex: [
      { de: 'Das kostet [einundzwanzig] Euro.', en: 'That costs twenty-one euros.' },
      { de: 'Mein Vater ist [siebenundfünfzig] Jahre alt.', en: 'My father is fifty-seven years old.' },
      { de: 'Ich wohne in Hausnummer [dreiunddreißig].', en: 'I live at house number thirty-three.' }] },
    { t: 'Uhrzeit offiziell (24 Stunden)', d: 'Stunde + Uhr + Minuten: 14:30 = vierzehn Uhr dreißig.', must: 'Uhr', ex: [
      { de: 'Der Zug fährt um [vierzehn Uhr dreißig].', en: 'The train leaves at 14:30.' },
      { de: 'Der Termin ist um [acht Uhr fünfzehn].', en: 'The appointment is at 8:15.' },
      { de: 'Die Praxis öffnet um [neun Uhr].', en: 'The surgery opens at nine o\'clock.' }] },
    { t: 'Uhrzeit im Alltag: Viertel, halb', d: 'halb drei = 2:30 (halb ZUR nächsten Stunde!) · Viertel nach vier = 4:15 · Viertel vor acht = 7:45.', must: '\\b(halb|Viertel)\\b', ex: [
      { de: 'Es ist [halb drei] (2:30).', en: 'It\'s half past two.' },
      { de: 'Wir treffen uns um [Viertel nach vier] (4:15).', en: 'We\'re meeting at quarter past four.' },
      { de: 'Der Film beginnt um [Viertel vor acht] (7:45).', en: 'The film starts at quarter to eight.' }] },
    { t: 'um · am · im', d: 'um + Uhrzeit · am + Tag / Datum / Tageszeit · im + Monat / Jahreszeit.', must: '\\b(um|am|Am|im|Im)\\b', ex: [
      { de: 'Ich komme [um] sieben Uhr.', en: 'I\'m coming at seven o\'clock.' },
      { de: 'Wir treffen uns [am] Montag.', en: 'We\'re meeting on Monday.' },
      { de: '[Im] Mai fliegen wir nach Chennai.', en: 'In May we\'re flying to Chennai.' }] },
    { t: 'Datum mit Ordinalzahl', d: 'der erste, zweite, dritte, siebte … · am + -en: am dritten Mai.', must: '\\b(erste|ersten|dritte|dritten|siebten|zweite)\\b', ex: [
      { de: 'Heute ist der [dritte] Mai.', en: 'Today is the third of May.' },
      { de: '[Am ersten] Januar ist Neujahr.', en: 'New Year\'s Day is on the first of January.' },
      { de: 'Mein Geburtstag ist [am siebten] Juli.', en: 'My birthday is on the seventh of July.' }] }
  ],
  a1_modalverben: [
    { t: 'Modalverb auf Position 2 + Infinitiv am Ende', d: 'Das Modalverb wird konjugiert, das zweite Verb bleibt im Infinitiv am Ende.', must: '\\b(kann|kannst|können|muss|musst|müssen|will|willst|wollen|darf|darfst|dürfen|soll|sollst|sollen|möchte|möchtest|möchten)\\b', ex: [
      { de: 'Ich [kann] gut [kochen].', en: 'I can cook well.' },
      { de: 'Wir [müssen] heute [arbeiten].', en: 'We have to work today.' },
      { de: 'Er [will] ein Auto [kaufen].', en: 'He wants to buy a car.' }] },
    { t: 'ich / er / sie / es: ohne Endung', d: 'ich kann · er kann (nicht: er kannt) · ich muss · er darf · sie will.', must: '\\b(Ich|Er|Sie|ich|er) (muss|darf|will|kann|soll)\\b', ex: [
      { de: 'Ich [muss] jetzt gehen.', en: 'I have to go now.' },
      { de: 'Er [darf] hier nicht rauchen.', en: 'He\'s not allowed to smoke here.' },
      { de: 'Sie [will] Ärztin werden.', en: 'She wants to become a doctor.' }] },
    { t: 'Frage mit Modalverb', d: 'Ja/Nein-Frage: Modalverb zuerst · W-Frage: W-Wort + Modalverb.', must: '\\?$', ex: [
      { de: '[Kannst] du mir helfen?', en: 'Can you help me?' },
      { de: '[Darf] ich das Fenster öffnen?', en: 'May I open the window?' },
      { de: 'Was [möchtest] du trinken?', en: 'What would you like to drink?' }] },
    { t: 'möchten — höflich bitten', d: 'möchte = would like: im Café, beim Arzt, am Telefon.', must: '\\b(möchte|möchten|Möchten)\\b', ex: [
      { de: 'Ich [möchte] einen Kaffee, bitte.', en: 'I\'d like a coffee, please.' },
      { de: 'Wir [möchten] einen Termin machen.', en: 'We\'d like to make an appointment.' },
      { de: '[Möchten] Sie etwas essen?', en: 'Would you like something to eat?' }] },
    { t: 'nicht müssen = nicht nötig', d: 'Du musst nicht = you don\'t have to (es ist egal).', must: '\\b(muss|musst|müssen|Müssen)\\b.*\\bnicht\\b', ex: [
      { de: 'Du musst morgen [nicht] kommen, es ist Feiertag.', en: 'You don\'t have to come tomorrow, it\'s a holiday.' },
      { de: 'Wir müssen [nicht] bar bezahlen.', en: 'We don\'t have to pay in cash.' },
      { de: 'Sie müssen [nicht] warten.', en: 'You don\'t have to wait.' }] },
    { t: 'nicht dürfen = verboten', d: 'Du darfst nicht = you must not (Regel, Verbot).', must: '\\b(darf|darfst|dürfen)\\b.*\\b(nicht|keinen|kein|keine)\\b', ex: [
      { de: 'Hier darf man [nicht] parken.', en: 'You must not park here.' },
      { de: 'Im Kurs dürfen wir [nicht] essen.', en: 'We\'re not allowed to eat in class.' },
      { de: 'Kinder dürfen [keinen] Alkohol trinken.', en: 'Children must not drink alcohol.' }] }
  ],
  a1_trennbar: [
    { t: 'Präsens: Vorsilbe ans Ende', d: 'Das Verb auf Position 2, die Vorsilbe (an, ein, ab, auf …) ganz am Ende.', ex: [
      { de: 'Ich [rufe] dich morgen [an].', en: 'I\'ll call you tomorrow.' },
      { de: 'Wir [kaufen] heute [ein].', en: 'We\'re doing the shopping today.' },
      { de: 'Der Zug [fährt] um acht Uhr [ab].', en: 'The train leaves at eight o\'clock.' }] },
    { t: 'Mit Modalverb: zusammen am Ende', d: 'Der Infinitiv bleibt ein Wort: anrufen, aufstehen, aufmachen.', must: '\\b(will|müssen|Kannst|kann|muss)\\b', ex: [
      { de: 'Ich will dich später [anrufen].', en: 'I want to call you later.' },
      { de: 'Wir müssen morgen früh [aufstehen].', en: 'We have to get up early tomorrow.' },
      { de: 'Kannst du bitte das Fenster [aufmachen]?', en: 'Can you open the window, please?' }] },
    { t: 'Im Nebensatz: zusammen am Ende', d: 'Nebensatz → Verb ans Ende, und dort bleibt es ein Wort.', must: '\\b(weil|wann|wenn|dass)\\b', ex: [
      { de: 'Ich bin müde, weil ich so früh [aufstehe].', en: 'I\'m tired because I get up so early.' },
      { de: 'Ich weiß nicht, wann der Film [anfängt].', en: 'I don\'t know when the film starts.' },
      { de: 'Sag mir Bescheid, wenn du [ankommst].', en: 'Let me know when you arrive.' }] },
    { t: 'Perfekt: -ge- in der Mitte', d: 'an·ge·rufen, ein·ge·kauft, auf·ge·standen.', must: '(an|ein|auf|ab|aus)ge', ex: [
      { de: 'Ich habe dich gestern [angerufen].', en: 'I called you yesterday.' },
      { de: 'Wir haben schon [eingekauft].', en: 'We\'ve already done the shopping.' },
      { de: 'Er ist um sechs Uhr [aufgestanden].', en: 'He got up at six o\'clock.' }] },
    { t: 'Untrennbar (be-, ver-, er- …): immer zusammen, Perfekt ohne ge', d: 'besuchen → besucht · verstehen → verstanden · erklären → erklärt.', must: '\\b(be|ver|er)\\p{L}+', ex: [
      { de: 'Ich [besuche] meine Oma.', en: 'I\'m visiting my grandma.' },
      { de: 'Ich habe das Wort nicht [verstanden].', en: 'I didn\'t understand the word.' },
      { de: 'Der Lehrer [erklärt] die Regel.', en: 'The teacher explains the rule.' }] },
    { t: 'Imperativ: Vorsilbe ans Ende', d: 'Ruf mich an! · Mach das Licht aus!', must: '!$', ex: [
      { de: '[Ruf] mich später [an]!', en: 'Call me later!' },
      { de: '[Mach] bitte das Licht [aus]!', en: 'Switch off the light, please!' },
      { de: '[Steh] jetzt [auf]!', en: 'Get up now!' }] }
  ],
  a1_imperativ: [
    { t: 'du-Form: Stamm, ohne du', d: 'kommen → Komm! · helfen → Hilf! (e→i bleibt).', must: '!$', ex: [
      { de: '[Komm] bitte her!', en: 'Please come here!' },
      { de: '[Hilf] mir bitte!', en: 'Help me, please!' },
      { de: '[Sprich] bitte langsam!', en: 'Please speak slowly!' }] },
    { t: 'ihr-Form: wie ihr-Präsens, ohne ihr', d: 'ihr kommt → Kommt! · ihr macht → Macht!', must: '!$', ex: [
      { de: '[Kommt] bitte pünktlich!', en: 'Please be on time! (to several people)' },
      { de: '[Macht] eure Hausaufgaben!', en: 'Do your homework! (to several people)' },
      { de: '[Seid] bitte leise!', en: 'Please be quiet! (to several people)' }] },
    { t: 'Sie-Form: Verb + Sie', d: 'Höflich: Warten Sie! · Setzen Sie sich!', must: '\\bSie\\b', ex: [
      { de: '[Warten Sie] bitte hier!', en: 'Please wait here!' },
      { de: '[Setzen Sie] sich bitte!', en: 'Please sit down!' },
      { de: '[Rufen Sie] mich morgen an!', en: 'Call me tomorrow! (polite)' }] },
    { t: 'Trennbare Verben: Vorsilbe ans Ende', d: 'aufmachen → Mach … auf! · aufräumen → Räumt … auf!', must: '\\b(auf|an|aus)!$', ex: [
      { de: '[Mach] das Fenster [auf]!', en: 'Open the window!' },
      { de: '[Ruf] mich später [an]!', en: 'Call me later!' },
      { de: '[Räumt] bitte euer Zimmer [auf]!', en: 'Tidy your room, please! (to several people)' }] },
    { t: 'sein & a → ä ohne Umlaut', d: 'sein → Sei! · fahren → Fahr! (nicht: Fähr!) · schlafen → Schlaf!', must: '^(Sei|Fahr|Schlaf)\\b', ex: [
      { de: '[Sei] vorsichtig!', en: 'Be careful!' },
      { de: '[Fahr] langsam!', en: 'Drive slowly!' },
      { de: '[Schlaf] gut!', en: 'Sleep well!' }] },
    { t: 'wir-Form: Los, machen wir das!', d: 'Verb + wir = let\'s …', must: '\\bwir\\b', ex: [
      { de: '[Gehen wir]!', en: 'Let\'s go!' },
      { de: '[Fangen wir] an!', en: 'Let\'s start!' },
      { de: '[Essen wir] zusammen!', en: 'Let\'s eat together!' }] }
  ]
};
