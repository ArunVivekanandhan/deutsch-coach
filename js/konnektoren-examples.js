/* Konnektoren-Referenz: examples for EVERY connector chip — at least 3 per sentence type (Tasks 78/79).
   Sentence types (derived from the markup, checked by scripts/check_konnektoren_examples.py):
     grp1 Nebensatz  — "hinten": main clause first, connector later (verb at the end of the Nebensatz)
                       "vorne":  sentence starts with the connector → the whole Nebensatz is Position 1,
                                 the main-clause verb comes right after the comma (sodass: only "hinten")
     grp2 Position 1 / grp3 Position 0 — "einfach": one verb; "klammer": 2nd verb part at the clause end (|…|)
     grp4 two-part   — one type
   Markup in `de`: [connector] (both parts for two-part connectors), {conjugated verb whose position matters},
   |second verb part at the end of the clause| (Partizip II, Infinitiv, separable prefix).
   German and English written by the assistant and checked against the group's word-order rule by the build;
   Tamil is AI-assisted (shown with 🤖 on the page). Keys = first word of the chip label, lower case. */
window.DC_KONN_EX = {
  /* ---------- Gruppe 1: Nebensatz — Verb am Ende ---------- */
  weil: { lv: 'A2', note: 'Grund (because). Verb ans ENDE — gleiche Bedeutung wie denn, aber andere Wortstellung.', note_en: 'Reason (because). Verb to the END — same meaning as denn, but different word order.', ex: [
    { de: 'Ich bleibe heute zu Hause, [weil] ich Fieber {habe}.', en: 'I\'m staying at home today because I have a temperature.', ta: 'எனக்குக் காய்ச்சல் இருப்பதால் இன்று நான் வீட்டில் இருக்கிறேன்.' },
    { de: 'Sie lernt Deutsch, [weil] sie in Deutschland arbeiten {möchte}.', en: 'She is learning German because she wants to work in Germany.', ta: 'ஜெர்மனியில் வேலை செய்ய விரும்புவதால் அவள் ஜெர்மன் கற்கிறாள்.' },
    { de: 'Wir fahren mit dem Zug, [weil] das Auto kaputt {ist}.', en: 'We\'re going by train because the car is broken.', ta: 'கார் பழுதாகியிருப்பதால் நாங்கள் ரயிலில் செல்கிறோம்.' },
    { de: '[Weil] der Bus nicht {kam}, {bin} ich zu spät zur Arbeit |gekommen|.', en: 'Because the bus didn\'t come, I was late for work.', ta: 'பேருந்து வராததால் நான் வேலைக்குத் தாமதமாக வந்தேன்.' },
    { de: '[Weil] ich krank {bin}, {gehe} ich heute nicht zur Arbeit.', en: 'Because I\'m ill, I\'m not going to work today.', ta: 'எனக்கு உடம்பு சரியில்லாததால், இன்று நான் வேலைக்குப் போகவில்லை.' },
    { de: '[Weil] es so heiß {ist}, {trinken} wir viel Wasser.', en: 'Because it\'s so hot, we drink a lot of water.', ta: 'மிகவும் வெப்பமாக இருப்பதால், நாங்கள் நிறைய தண்ணீர் குடிக்கிறோம்.' }] },
  da: { lv: 'B1', note: 'Grund wie weil, steht oft am Satzanfang (bekannter Grund).', note_en: 'Reason like weil; often at the start of the sentence (a reason everyone knows).', ex: [
    { de: 'Wir bestellen Pizza, [da] niemand kochen {will}.', en: 'We\'re ordering pizza, since nobody wants to cook.', ta: 'யாரும் சமைக்க விரும்பாததால், நாங்கள் பீட்சா ஆர்டர் செய்கிறோம்.' },
    { de: 'Ich nehme ein Taxi, [da] es schon spät {ist}.', en: 'I\'m taking a taxi, since it\'s already late.', ta: 'ஏற்கனவே நேரமாகிவிட்டதால், நான் டாக்ஸி எடுக்கிறேன்.' },
    { de: 'Er kann nicht kommen, [da] er arbeiten {muss}.', en: 'He can\'t come, since he has to work.', ta: 'அவர் வேலை செய்ய வேண்டியிருப்பதால், அவரால் வர முடியாது.' },
    { de: '[Da] es heute {regnet}, {nehmen} wir das Auto.', en: 'As it\'s raining today, we\'re taking the car.', ta: 'இன்று மழை பெய்வதால், நாங்கள் காரை எடுத்துக்கொள்கிறோம்.' },
    { de: '[Da] ich kein Visum {hatte}, {konnte} ich nicht |reisen|.', en: 'Since I had no visa, I couldn\'t travel.', ta: 'என்னிடம் விசா இல்லாததால், என்னால் பயணம் செய்ய முடியவில்லை.' },
    { de: '[Da] der Laden sonntags geschlossen {ist}, {kaufen} wir am Samstag |ein|.', en: 'Since the shop is closed on Sundays, we do our shopping on Saturday.', ta: 'ஞாயிற்றுக்கிழமைகளில் கடை மூடியிருப்பதால், நாங்கள் சனிக்கிழமை பொருட்கள் வாங்குகிறோம்.' }] },
  dass: { lv: 'A2', note: 'Inhalt nach sagen, denken, hoffen, wissen, es ist wichtig … Verb ans ENDE.', note_en: 'Content after sagen, denken, hoffen, wissen, es ist wichtig … Verb to the END.', ex: [
    { de: 'Ich hoffe, [dass] du bald wieder gesund {bist}.', en: 'I hope that you\'ll be well again soon.', ta: 'நீ விரைவில் மீண்டும் குணமடைவாய் என்று நம்புகிறேன்.' },
    { de: 'Er sagt, [dass] der Zug Verspätung {hat}.', en: 'He says that the train is delayed.', ta: 'ரயில் தாமதமாக வருகிறது என்று அவர் சொல்கிறார்.' },
    { de: 'Es ist wichtig, [dass] wir jeden Tag Deutsch {sprechen}.', en: 'It\'s important that we speak German every day.', ta: 'நாம் தினமும் ஜெர்மன் பேசுவது முக்கியம்.' },
    { de: '[Dass] du {kommst}, {weiß} ich schon.', en: 'I already know that you\'re coming.', ta: 'நீ வருகிறாய் என்பது எனக்கு ஏற்கனவே தெரியும்.' },
    { de: '[Dass] der Kurs so teuer {ist}, {finde} ich nicht gut.', en: 'I don\'t think it\'s good that the course is so expensive.', ta: 'வகுப்பு இவ்வளவு விலை உயர்ந்ததாக இருப்பது எனக்குச் சரியாகப் படவில்லை.' },
    { de: '[Dass] wir morgen frei {haben}, {wusste} ich nicht.', en: 'I didn\'t know that we have tomorrow off.', ta: 'நாளை எங்களுக்கு விடுமுறை என்று எனக்குத் தெரியவில்லை.' }] },
  wenn: { lv: 'A2', note: 'Bedingung (if) oder wiederholt / Gegenwart / Zukunft (when). Verb ans ENDE.', note_en: 'Condition (if) or repeated / present / future (when). Verb to the END.', ex: [
    { de: 'Ruf mich an, [wenn] du am Bahnhof {bist}.', en: 'Call me when you\'re at the station.', ta: 'நீ ரயில் நிலையத்தில் இருக்கும்போது எனக்கு அழை.' },
    { de: 'Ich gehe gern spazieren, [wenn] die Sonne {scheint}.', en: 'I like going for a walk when the sun is shining.', ta: 'சூரியன் பிரகாசிக்கும்போது நடக்கப் போக எனக்குப் பிடிக்கும்.' },
    { de: 'Du kannst bei uns schlafen, [wenn] du {willst}.', en: 'You can sleep at our place if you want.', ta: 'நீ விரும்பினால் எங்கள் வீட்டில் தூங்கலாம்.' },
    { de: '[Wenn] ich Zeit {habe}, {koche} ich gern indisch.', en: 'When I have time, I like cooking Indian food.', ta: 'எனக்கு நேரம் இருக்கும்போது, இந்திய உணவு சமைக்க எனக்குப் பிடிக்கும்.' },
    { de: '[Wenn] es morgen {regnet}, {bleiben} wir zu Hause.', en: 'If it rains tomorrow, we\'ll stay at home.', ta: 'நாளை மழை பெய்தால், நாங்கள் வீட்டிலேயே இருப்போம்.' },
    { de: '[Wenn] du Fragen {hast}, {kannst} du mich jederzeit |anrufen|.', en: 'If you have questions, you can call me any time.', ta: 'உனக்குக் கேள்விகள் இருந்தால், எப்போது வேண்டுமானாலும் என்னை அழைக்கலாம்.' }] },
  als: { lv: 'A2', note: 'EINMAL in der Vergangenheit (sonst: wenn). Verb ans ENDE.', note_en: 'ONE time in the past (otherwise: wenn). Verb to the END.', ex: [
    { de: 'Ich habe mich sehr gefreut, [als] ich die Prüfung bestanden {habe}.', en: 'I was very happy when I passed the exam.', ta: 'தேர்வில் தேர்ச்சி பெற்றபோது நான் மிகவும் மகிழ்ந்தேன்.' },
    { de: 'Ich war sehr nervös, [als] ich nach Deutschland {kam}.', en: 'I was very nervous when I came to Germany.', ta: 'நான் ஜெர்மனிக்கு வந்தபோது மிகவும் பதற்றமாக இருந்தேன்.' },
    { de: 'Es regnete stark, [als] wir {ankamen}.', en: 'It was raining heavily when we arrived.', ta: 'நாங்கள் வந்து சேர்ந்தபோது பலத்த மழை பெய்தது.' },
    { de: '[Als] ich ein Kind {war}, {wohnten} wir in Chennai.', en: 'When I was a child, we lived in Chennai.', ta: 'நான் குழந்தையாக இருந்தபோது, நாங்கள் சென்னையில் வசித்தோம்.' },
    { de: '[Als] wir am Flughafen {ankamen}, {war} das Flugzeug schon weg.', en: 'When we arrived at the airport, the plane had already gone.', ta: 'நாங்கள் விமான நிலையத்தை அடைந்தபோது, விமானம் ஏற்கனவே புறப்பட்டுவிட்டது.' },
    { de: '[Als] ich den Job {bekam}, {habe} ich sofort meine Eltern |angerufen|.', en: 'When I got the job, I called my parents straight away.', ta: 'எனக்கு வேலை கிடைத்தபோது, உடனே என் பெற்றோரை அழைத்தேன்.' }] },
  obwohl: { lv: 'A2', note: 'Gegensatz (although). Verb ans ENDE — vgl. trotzdem (Position 1).', note_en: 'Contrast (although). Verb to the END — compare trotzdem (position 1).', ex: [
    { de: 'Ich gehe zur Arbeit, [obwohl] ich müde {bin}.', en: 'I go to work although I\'m tired.', ta: 'நான் சோர்வாக இருந்தாலும் வேலைக்குப் போகிறேன்.' },
    { de: 'Er spielt Fußball, [obwohl] es {regnet}.', en: 'He\'s playing football although it\'s raining.', ta: 'மழை பெய்தாலும், அவன் கால்பந்து விளையாடுகிறான்.' },
    { de: 'Wir haben die Wohnung genommen, [obwohl] sie teuer {ist}.', en: 'We took the flat although it\'s expensive.', ta: 'வீடு விலை அதிகமாக இருந்தாலும், நாங்கள் அதை எடுத்துக்கொண்டோம்.' },
    { de: '[Obwohl] es kalt {ist}, {geht} er ohne Jacke raus.', en: 'Although it\'s cold, he goes out without a jacket.', ta: 'குளிராக இருந்தாலும், அவன் ஜாக்கெட் இல்லாமல் வெளியே போகிறான்.' },
    { de: '[Obwohl] die Wohnung klein {ist}, {gefällt} sie uns sehr.', en: 'Although the flat is small, we like it a lot.', ta: 'வீடு சிறியதாக இருந்தாலும், அது எங்களுக்கு மிகவும் பிடிக்கும்.' },
    { de: '[Obwohl] ich viel gelernt {habe}, {habe} ich die Prüfung nicht |bestanden|.', en: 'Although I studied a lot, I didn\'t pass the exam.', ta: 'நான் நிறையப் படித்திருந்தாலும், தேர்வில் தேர்ச்சி பெறவில்லை.' }] },
  'während': { lv: 'B1', note: 'Gleichzeitig (while). Verb ans ENDE.', note_en: 'At the same time (while). Verb to the END.', ex: [
    { de: 'Sie telefoniert, [während] sie Auto {fährt}.', en: 'She talks on the phone while she\'s driving.', ta: 'அவள் கார் ஓட்டும்போது தொலைபேசியில் பேசுகிறாள்.' },
    { de: 'Die Kinder spielen draußen, [während] wir {kochen}.', en: 'The children play outside while we cook.', ta: 'நாங்கள் சமைக்கும்போது, குழந்தைகள் வெளியே விளையாடுகிறார்கள்.' },
    { de: 'Ich höre Podcasts, [während] ich zur Arbeit {fahre}.', en: 'I listen to podcasts while I drive to work.', ta: 'நான் வேலைக்குச் செல்லும்போது பாட்காஸ்ட்கள் கேட்கிறேன்.' },
    { de: '[Während] ich {koche}, {hört} mein Mann Musik.', en: 'While I cook, my husband listens to music.', ta: 'நான் சமைக்கும்போது, என் கணவர் இசை கேட்கிறார்.' },
    { de: '[Während] wir im Urlaub {waren}, {hat} die Nachbarin die Blumen |gegossen|.', en: 'While we were on holiday, the neighbour watered the flowers.', ta: 'நாங்கள் விடுமுறையில் இருந்தபோது, பக்கத்து வீட்டுப் பெண் பூச்செடிகளுக்குத் தண்ணீர் ஊற்றினார்.' },
    { de: '[Während] er {schläft}, {räume} ich die Küche |auf|.', en: 'While he\'s sleeping, I tidy up the kitchen.', ta: 'அவன் தூங்கும்போது, நான் சமையலறையை ஒழுங்குபடுத்துகிறேன்.' }] },
  nachdem: { lv: 'B1', note: 'Erst A, dann B. Nebensatz eine Zeitstufe früher (Perfekt → Präsens, Plusquamperfekt → Präteritum).', note_en: 'First A, then B. The clause is one tense earlier (Perfekt → Präsens, Plusquamperfekt → Präteritum).', ex: [
    { de: 'Wir fahren los, [nachdem] die Kinder angekommen {sind}.', en: 'We\'ll set off after the children have arrived.', ta: 'குழந்தைகள் வந்து சேர்ந்த பிறகு நாங்கள் புறப்படுவோம்.' },
    { de: 'Er ging ins Bett, [nachdem] er die Nachrichten gesehen {hatte}.', en: 'He went to bed after he had watched the news.', ta: 'செய்திகளைப் பார்த்த பிறகு அவர் தூங்கச் சென்றார்.' },
    { de: 'Ich rufe dich an, [nachdem] ich mit dem Arzt gesprochen {habe}.', en: 'I\'ll call you after I\'ve spoken to the doctor.', ta: 'மருத்துவரிடம் பேசிய பிறகு நான் உன்னை அழைக்கிறேன்.' },
    { de: '[Nachdem] ich gegessen {habe}, {gehe} ich spazieren.', en: 'After I\'ve eaten, I go for a walk.', ta: 'நான் சாப்பிட்ட பிறகு, நடக்கப் போகிறேன்.' },
    { de: '[Nachdem] sie den Brief gelesen {hatte}, {rief} sie ihre Mutter |an|.', en: 'After she had read the letter, she called her mother.', ta: 'கடிதத்தைப் படித்த பிறகு, அவள் தன் அம்மாவை அழைத்தாள்.' },
    { de: '[Nachdem] wir das Formular ausgefüllt {hatten}, {mussten} wir lange |warten|.', en: 'After we had filled in the form, we had to wait a long time.', ta: 'படிவத்தை நிரப்பிய பிறகு, நாங்கள் நீண்ட நேரம் காத்திருக்க வேண்டியிருந்தது.' }] },
  bevor: { lv: 'B1', note: 'Vorher (before). Verb ans ENDE.', note_en: 'Before. Verb to the END.', ex: [
    { de: 'Wasch dir die Hände, [bevor] du {isst}.', en: 'Wash your hands before you eat.', ta: 'சாப்பிடுவதற்கு முன் உன் கைகளைக் கழுவு.' },
    { de: 'Ich lese immer ein bisschen, [bevor] ich {einschlafe}.', en: 'I always read a little before I fall asleep.', ta: 'தூங்குவதற்கு முன் நான் எப்போதும் கொஞ்சம் படிக்கிறேன்.' },
    { de: 'Ruf bitte an, [bevor] du {kommst}.', en: 'Please call before you come.', ta: 'நீ வருவதற்கு முன் தயவுசெய்து அழை.' },
    { de: '[Bevor] ich zur Arbeit {gehe}, {trinke} ich einen Kaffee.', en: 'Before I go to work, I drink a coffee.', ta: 'வேலைக்குப் போவதற்கு முன், நான் ஒரு காபி குடிக்கிறேன்.' },
    { de: '[Bevor] wir nach Indien {fliegen}, {müssen} wir Geschenke |kaufen|.', en: 'Before we fly to India, we have to buy presents.', ta: 'இந்தியாவுக்கு விமானத்தில் போவதற்கு முன், நாங்கள் பரிசுகள் வாங்க வேண்டும்.' },
    { de: '[Bevor] der Film {beginnt}, {kaufen} wir noch Popcorn.', en: 'Before the film starts, we\'ll buy some popcorn.', ta: 'படம் தொடங்குவதற்கு முன், நாங்கள் பாப்கார்ன் வாங்குவோம்.' }] },
  damit: { lv: 'B1', note: 'Ziel (so that). Anderes Subjekt → damit; gleiches Subjekt → um … zu.', note_en: 'Purpose (so that). Different subject → damit; same subject → um … zu.', ex: [
    { de: 'Ich spreche langsam, [damit] mich alle {verstehen}.', en: 'I speak slowly so that everyone understands me.', ta: 'எல்லோருக்கும் புரிய வேண்டும் என்பதற்காக நான் மெதுவாகப் பேசுகிறேன்.' },
    { de: 'Wir sparen Geld, [damit] unsere Kinder studieren {können}.', en: 'We save money so that our children can study.', ta: 'எங்கள் குழந்தைகள் படிக்க முடிய வேண்டும் என்பதற்காக நாங்கள் பணம் சேமிக்கிறோம்.' },
    { de: 'Mach das Fenster zu, [damit] es nicht so kalt {wird}.', en: 'Close the window so that it doesn\'t get so cold.', ta: 'அதிகம் குளிராகாமல் இருக்க ஜன்னலை மூடு.' },
    { de: '[Damit] die Kinder gut {schlafen}, {machen} wir das Licht |aus|.', en: 'So that the children sleep well, we switch off the light.', ta: 'குழந்தைகள் நன்றாகத் தூங்க வேண்டும் என்பதற்காக, நாங்கள் விளக்கை அணைக்கிறோம்.' },
    { de: '[Damit] du nichts {vergisst}, {schreibe} ich dir eine Liste.', en: 'So that you don\'t forget anything, I\'ll write you a list.', ta: 'நீ எதையும் மறக்காமல் இருக்க, நான் உனக்கு ஒரு பட்டியல் எழுதித் தருகிறேன்.' },
    { de: '[Damit] wir den Zug {erreichen}, {müssen} wir jetzt |losgehen|.', en: 'To catch the train, we have to leave now.', ta: 'ரயிலைப் பிடிக்க, நாம் இப்போதே புறப்பட வேண்டும்.' }] },
  ob: { lv: 'B1', note: 'Indirekte Ja/Nein-Frage (whether). Verb ans ENDE.', note_en: 'Indirect yes/no question (whether). Verb to the END.', ex: [
    { de: 'Ich weiß nicht, [ob] er heute {kommt}.', en: 'I don\'t know whether he\'s coming today.', ta: 'அவன் இன்று வருவானா என்று எனக்குத் தெரியாது.' },
    { de: 'Kannst du mir sagen, [ob] der Supermarkt noch offen {ist}?', en: 'Can you tell me whether the supermarket is still open?', ta: 'பல்பொருள் அங்காடி இன்னும் திறந்திருக்கிறதா என்று சொல்ல முடியுமா?' },
    { de: 'Sie fragt, [ob] wir am Samstag Zeit {haben}.', en: 'She\'s asking whether we have time on Saturday.', ta: 'சனிக்கிழமை எங்களுக்கு நேரம் இருக்கிறதா என்று அவள் கேட்கிறாள்.' },
    { de: '[Ob] er {kommt}, {weiß} ich nicht.', en: 'Whether he\'s coming, I don\'t know.', ta: 'அவன் வருவானா என்பது எனக்குத் தெரியாது.' },
    { de: '[Ob] das Wetter gut {wird}, {sehen} wir morgen.', en: 'We\'ll see tomorrow whether the weather will be good.', ta: 'வானிலை நன்றாக இருக்குமா என்பதை நாளை பார்ப்போம்.' },
    { de: '[Ob] wir in Deutschland {bleiben}, {haben} wir noch nicht |entschieden|.', en: 'We haven\'t decided yet whether we\'ll stay in Germany.', ta: 'நாங்கள் ஜெர்மனியில் தங்குவோமா என்று இன்னும் முடிவு செய்யவில்லை.' }] },
  falls: { lv: 'B1', note: 'Für den Fall, dass … (in case). Wie wenn, aber weniger wahrscheinlich.', note_en: 'In case … Like wenn, but less likely.', ex: [
    { de: 'Nimm einen Schirm mit, [falls] es {regnet}.', en: 'Take an umbrella in case it rains.', ta: 'மழை பெய்தால் பயன்படும், ஒரு குடையை எடுத்துச் செல்.' },
    { de: 'Ich nehme etwas Geld mit, [falls] ich ein Taxi {brauche}.', en: 'I\'m taking some money in case I need a taxi.', ta: 'டாக்ஸி தேவைப்பட்டால் என்பதற்காக நான் கொஞ்சம் பணம் எடுத்துச் செல்கிறேன்.' },
    { de: 'Schreib mir eine Nachricht, [falls] du später {kommst}.', en: 'Send me a message in case you\'re coming later.', ta: 'நீ தாமதமாக வந்தால், எனக்கு ஒரு செய்தி அனுப்பு.' },
    { de: '[Falls] du Hilfe {brauchst}, {kannst} du mich |anrufen|.', en: 'In case you need help, you can call me.', ta: 'உனக்கு உதவி தேவைப்பட்டால், நீ என்னை அழைக்கலாம்.' },
    { de: '[Falls] der Zug {ausfällt}, {nehmen} wir den Bus.', en: 'In case the train is cancelled, we\'ll take the bus.', ta: 'ரயில் ரத்து செய்யப்பட்டால், நாங்கள் பேருந்தில் செல்வோம்.' },
    { de: '[Falls] es morgen {schneit}, {fahren} wir nicht in die Berge.', en: 'In case it snows tomorrow, we won\'t go to the mountains.', ta: 'நாளை பனி பெய்தால், நாங்கள் மலைகளுக்குப் போக மாட்டோம்.' }] },
  sodass: { lv: 'B1', note: 'Folge (so that / with the result that). Steht immer HINTER dem Hauptsatz — nie am Satzanfang.', note_en: 'Result (so that / with the result that). Always AFTER the main clause — never at the start.', ex: [
    { de: 'Es hat stark geregnet, [sodass] das Fußballspiel ausfallen {musste}.', en: 'It rained heavily, so the football match had to be cancelled.', ta: 'பலத்த மழை பெய்ததால், கால்பந்து போட்டி ரத்து செய்யப்பட வேண்டியிருந்தது.' },
    { de: 'Er war krank, [sodass] er nicht zur Arbeit gehen {konnte}.', en: 'He was ill, so he couldn\'t go to work.', ta: 'அவர் உடல்நலமில்லாமல் இருந்ததால், வேலைக்குப் போக முடியவில்லை.' },
    { de: 'Der Bus war voll, [sodass] wir zu Fuß gegangen {sind}.', en: 'The bus was full, so we walked.', ta: 'பேருந்து நிரம்பியிருந்ததால், நாங்கள் நடந்து சென்றோம்.' }] },
  seitdem: { lv: 'B1', note: 'Seit diesem Zeitpunkt (since). Oft Präsens, weil es bis heute gilt.', note_en: 'Since that moment (since). Often Präsens, because it is still true today.', ex: [
    { de: 'Er ist viel ruhiger, [seitdem] er Yoga {macht}.', en: 'He\'s much calmer since he started doing yoga.', ta: 'யோகா செய்யத் தொடங்கியதிலிருந்து அவர் மிகவும் அமைதியாக இருக்கிறார்.' },
    { de: 'Sie ist glücklicher, [seitdem] sie in Hamburg {wohnt}.', en: 'She\'s happier since she\'s been living in Hamburg.', ta: 'ஹாம்பர்க்கில் வசிக்கத் தொடங்கியதிலிருந்து அவள் மகிழ்ச்சியாக இருக்கிறாள்.' },
    { de: 'Ich schlafe besser, [seitdem] ich keinen Kaffee mehr {trinke}.', en: 'I sleep better since I stopped drinking coffee.', ta: 'நான் காபி குடிப்பதை நிறுத்தியதிலிருந்து நன்றாகத் தூங்குகிறேன்.' },
    { de: '[Seitdem] ich in Berlin {wohne}, {fahre} ich viel Fahrrad.', en: 'Since I\'ve been living in Berlin, I cycle a lot.', ta: 'நான் பெர்லினில் வசிக்கத் தொடங்கியதிலிருந்து, நிறைய சைக்கிள் ஓட்டுகிறேன்.' },
    { de: '[Seitdem] wir einen Hund {haben}, {gehen} wir jeden Tag spazieren.', en: 'Since we\'ve had a dog, we go for a walk every day.', ta: 'எங்களிடம் நாய் வந்ததிலிருந்து, நாங்கள் தினமும் நடக்கப் போகிறோம்.' },
    { de: '[Seitdem] ich den Kurs {besuche}, {kann} ich viel besser Deutsch |sprechen|.', en: 'Since I\'ve been taking the course, I can speak German much better.', ta: 'வகுப்பில் சேர்ந்ததிலிருந்து, என்னால் ஜெர்மன் மிகவும் நன்றாகப் பேச முடிகிறது.' }] },

  /* ---------- Gruppe 2: Position 1 — Verb sofort danach, dann Subjekt ---------- */
  deshalb: { lv: 'A2', note: 'Folge (so / that\'s why). deshalb = Position 1 → Verb, dann Subjekt.', note_en: 'Result (so / that\'s why). deshalb = position 1 → verb, then subject.', ex: [
    { de: 'Ich bin müde, [deshalb] {gehe} ich früh ins Bett.', en: 'I\'m tired, so I\'m going to bed early.', ta: 'நான் சோர்வாக இருக்கிறேன், அதனால் சீக்கிரம் தூங்கப் போகிறேன்.' },
    { de: 'Meine Mutter hat Geburtstag, [deshalb] {kaufe} ich Blumen.', en: 'It\'s my mother\'s birthday, so I\'m buying flowers.', ta: 'என் அம்மாவுக்குப் பிறந்தநாள், அதனால் நான் பூக்கள் வாங்குகிறேன்.' },
    { de: 'Es ist kalt, [deshalb] {trage} ich eine Mütze.', en: 'It\'s cold, so I\'m wearing a hat.', ta: 'குளிராக இருக்கிறது, அதனால் நான் ஒரு தொப்பி அணிந்திருக்கிறேன்.' },
    { de: 'Der Zug hatte Verspätung, [deshalb] {bin} ich zu spät |gekommen|.', en: 'The train was late, so I arrived late.', ta: 'ரயில் தாமதமானது, அதனால் நான் தாமதமாக வந்தேன்.' },
    { de: 'Ich habe meinen Schlüssel vergessen, [deshalb] {musste} ich auf meinen Mann |warten|.', en: 'I forgot my key, so I had to wait for my husband.', ta: 'நான் என் சாவியை மறந்துவிட்டேன், அதனால் என் கணவருக்காகக் காத்திருக்க வேண்டியிருந்தது.' },
    { de: 'Das Wetter war schön, [deshalb] {sind} wir an den See |gefahren|.', en: 'The weather was nice, so we drove to the lake.', ta: 'வானிலை நன்றாக இருந்தது, அதனால் நாங்கள் ஏரிக்குச் சென்றோம்.' }] },
  deswegen: { lv: 'A2', note: 'Wie deshalb (that\'s why) — eher gesprochen.', note_en: 'Like deshalb (that\'s why) — more spoken.', ex: [
    { de: 'Es ist sehr heiß, [deswegen] {trinken} wir viel Wasser.', en: 'It\'s very hot, that\'s why we drink a lot of water.', ta: 'மிகவும் வெப்பமாக இருக்கிறது, அதனால் நாங்கள் நிறைய தண்ணீர் குடிக்கிறோம்.' },
    { de: 'Ich habe keinen Führerschein, [deswegen] {fahre} ich mit dem Bus.', en: 'I don\'t have a driving licence, that\'s why I go by bus.', ta: 'என்னிடம் ஓட்டுநர் உரிமம் இல்லை, அதனால் நான் பேருந்தில் செல்கிறேன்.' },
    { de: 'Mein Handy ist kaputt, [deswegen] {schreibe} ich dir eine E-Mail.', en: 'My phone is broken, that\'s why I\'m writing you an email.', ta: 'என் கைப்பேசி பழுதாகிவிட்டது, அதனால் உனக்கு ஒரு மின்னஞ்சல் எழுதுகிறேன்.' },
    { de: 'Er hat viel gelernt, [deswegen] {hat} er die Prüfung |bestanden|.', en: 'He studied a lot, that\'s why he passed the exam.', ta: 'அவன் நிறையப் படித்தான், அதனால் தேர்வில் தேர்ச்சி பெற்றான்.' },
    { de: 'Der Supermarkt war zu, [deswegen] {mussten} wir zur Tankstelle |gehen|.', en: 'The supermarket was shut, that\'s why we had to go to the petrol station.', ta: 'பல்பொருள் அங்காடி மூடியிருந்தது, அதனால் நாங்கள் பெட்ரோல் நிலையத்துக்குப் போக வேண்டியிருந்தது.' },
    { de: 'Ich bin erkältet, [deswegen] {kann} ich heute nicht |kommen|.', en: 'I have a cold, that\'s why I can\'t come today.', ta: 'எனக்குச் சளி பிடித்திருக்கிறது, அதனால் இன்று என்னால் வர முடியாது.' }] },
  daher: { lv: 'B1', note: 'Wie deshalb (hence) — eher geschrieben.', note_en: 'Like deshalb (hence) — more written.', ex: [
    { de: 'Ich spreche noch nicht gut Deutsch, [daher] {besuche} ich einen Kurs.', en: 'I don\'t speak German well yet, so I\'m taking a course.', ta: 'நான் இன்னும் நன்றாக ஜெர்மன் பேசுவதில்லை, எனவே ஒரு வகுப்பில் படிக்கிறேன்.' },
    { de: 'Er wohnt in der Nähe, [daher] {kommt} er oft zu Fuß.', en: 'He lives nearby, so he often comes on foot.', ta: 'அவர் அருகில் வசிக்கிறார், எனவே அடிக்கடி நடந்தே வருகிறார்.' },
    { de: 'Die Miete ist hoch, [daher] {suchen} wir eine neue Wohnung.', en: 'The rent is high, hence we\'re looking for a new flat.', ta: 'வாடகை அதிகம், எனவே நாங்கள் புதிய வீடு தேடுகிறோம்.' },
    { de: 'Die Straße ist gesperrt, [daher] {müssen} wir einen Umweg |fahren|.', en: 'The road is closed, so we have to take a detour.', ta: 'சாலை மூடப்பட்டுள்ளது, எனவே நாங்கள் சுற்றுவழியில் செல்ல வேண்டும்.' },
    { de: 'Das Angebot war günstig, [daher] {haben} wir sofort |gebucht|.', en: 'The offer was cheap, so we booked straight away.', ta: 'சலுகை மலிவாக இருந்தது, எனவே நாங்கள் உடனே முன்பதிவு செய்தோம்.' },
    { de: 'Es gab keine Tickets mehr, [daher] {sind} wir zu Hause |geblieben|.', en: 'There were no tickets left, so we stayed at home.', ta: 'டிக்கெட்டுகள் எதுவும் மிச்சம் இல்லை, எனவே நாங்கள் வீட்டிலேயே இருந்தோம்.' }] },
  trotzdem: { lv: 'A2', note: 'Gegensatz (nevertheless / anyway). Position 1 — vgl. obwohl (Verb am Ende).', note_en: 'Contrast (nevertheless / anyway). Position 1 — compare obwohl (verb at the end).', ex: [
    { de: 'Es regnet, [trotzdem] {gehen} wir spazieren.', en: 'It\'s raining; we\'re going for a walk anyway.', ta: 'மழை பெய்கிறது, இருந்தாலும் நாங்கள் நடக்கப் போகிறோம்.' },
    { de: 'Das Essen ist teuer, [trotzdem] {kommen} viele Leute.', en: 'The food is expensive; nevertheless lots of people come.', ta: 'உணவு விலை அதிகம், இருந்தாலும் நிறைய பேர் வருகிறார்கள்.' },
    { de: 'Ich habe wenig Zeit, [trotzdem] {helfe} ich dir.', en: 'I have little time, but I\'ll help you anyway.', ta: 'எனக்கு நேரம் குறைவு, இருந்தாலும் நான் உனக்கு உதவுகிறேன்.' },
    { de: 'Ich war krank, [trotzdem] {bin} ich zur Arbeit |gegangen|.', en: 'I was ill; nevertheless I went to work.', ta: 'எனக்கு உடம்பு சரியில்லை, இருந்தாலும் நான் வேலைக்குப் போனேன்.' },
    { de: 'Die Prüfung war schwer, [trotzdem] {habe} ich |bestanden|.', en: 'The exam was hard; I passed anyway.', ta: 'தேர்வு கடினமாக இருந்தது, இருந்தாலும் நான் தேர்ச்சி பெற்றேன்.' },
    { de: 'Er war müde, [trotzdem] {wollte} er noch |tanzen|.', en: 'He was tired, but he still wanted to dance.', ta: 'அவன் சோர்வாக இருந்தான், இருந்தாலும் இன்னும் நடனமாட விரும்பினான்.' }] },
  'außerdem': { lv: 'A2', note: 'Zusätzlich (besides / also). Position 1 → Verb sofort.', note_en: 'In addition (besides / also). Position 1 → verb right after it.', ex: [
    { de: 'Die Wohnung ist hell, [außerdem] {hat} sie einen Balkon.', en: 'The flat is bright, and it also has a balcony.', ta: 'வீடு வெளிச்சமாக இருக்கிறது, மேலும் அதில் ஒரு பால்கனியும் இருக்கிறது.' },
    { de: 'Ich arbeite Vollzeit, [außerdem] {lerne} ich abends Deutsch.', en: 'I work full-time, and I also study German in the evenings.', ta: 'நான் முழு நேரம் வேலை செய்கிறேன், மேலும் மாலையில் ஜெர்மன் படிக்கிறேன்.' },
    { de: 'Das Hotel liegt zentral, [außerdem] {ist} das Frühstück inklusive.', en: 'The hotel is central; besides, breakfast is included.', ta: 'ஹோட்டல் நகர மையத்தில் இருக்கிறது, மேலும் காலை உணவும் அதில் அடங்கும்.' },
    { de: 'Ich habe eingekauft, [außerdem] {habe} ich die Wohnung |geputzt|.', en: 'I did the shopping, and I also cleaned the flat.', ta: 'நான் பொருட்கள் வாங்கினேன், மேலும் வீட்டையும் சுத்தம் செய்தேன்.' },
    { de: 'Du sollst mehr Wasser trinken, [außerdem] {musst} du dich |ausruhen|.', en: 'You should drink more water, and you also need to rest.', ta: 'நீ அதிகம் தண்ணீர் குடிக்க வேண்டும், மேலும் ஓய்வெடுக்கவும் வேண்டும்.' },
    { de: 'Der Kurs war gut, [außerdem] {haben} wir viele Leute |kennengelernt|.', en: 'The course was good, and we also got to know lots of people.', ta: 'வகுப்பு நன்றாக இருந்தது, மேலும் நாங்கள் பலரைத் தெரிந்துகொண்டோம்.' }] },
  sonst: { lv: 'B1', note: 'Warnung (otherwise). Position 1 → Verb sofort.', note_en: 'Warning (otherwise). Position 1 → verb right after it.', ex: [
    { de: 'Zieh eine Jacke an, [sonst] {wirst} du krank.', en: 'Put a jacket on, otherwise you\'ll get ill.', ta: 'ஜாக்கெட் போட்டுக்கொள், இல்லையென்றால் உனக்கு உடம்பு சரியில்லாமல் போகும்.' },
    { de: 'Wir müssen jetzt los, [sonst] {verpassen} wir den Bus.', en: 'We have to go now, otherwise we\'ll miss the bus.', ta: 'நாம் இப்போது புறப்பட வேண்டும், இல்லையென்றால் பேருந்தைத் தவறவிடுவோம்.' },
    { de: 'Du musst den Antrag heute abgeben, [sonst] {bekommst} du keinen Termin.', en: 'You must hand in the application today, otherwise you won\'t get an appointment.', ta: 'நீ இன்றே விண்ணப்பத்தைச் சமர்ப்பிக்க வேண்டும், இல்லையென்றால் உனக்குச் சந்திப்பு நேரம் கிடைக்காது.' },
    { de: 'Schreib es auf, [sonst] {wirst} du es |vergessen|.', en: 'Write it down, otherwise you\'ll forget it.', ta: 'அதை எழுதி வை, இல்லையென்றால் நீ அதை மறந்துவிடுவாய்.' },
    { de: 'Du musst dich heute anmelden, [sonst] {kannst} du nicht |mitmachen|.', en: 'You must register today, otherwise you can\'t take part.', ta: 'நீ இன்றே பதிவு செய்ய வேண்டும், இல்லையென்றால் உன்னால் பங்கேற்க முடியாது.' },
    { de: 'Zum Glück hatte ich einen Schirm, [sonst] {wäre} ich nass |geworden|.', en: 'Luckily I had an umbrella, otherwise I would have got wet.', ta: 'அதிர்ஷ்டவசமாக என்னிடம் குடை இருந்தது, இல்லையென்றால் நான் நனைந்திருப்பேன்.' }] },
  dann: { lv: 'A1', note: 'Reihenfolge (then). Position 1 → Verb sofort.', note_en: 'Order (then). Position 1 → verb right after it.', ex: [
    { de: 'Zuerst frühstücke ich, [dann] {gehe} ich zur Arbeit.', en: 'First I have breakfast, then I go to work.', ta: 'முதலில் நான் காலை உணவு சாப்பிடுகிறேன், பிறகு வேலைக்குப் போகிறேன்.' },
    { de: 'Wir kaufen ein, [dann] {kochen} wir zusammen.', en: 'We do the shopping, then we cook together.', ta: 'நாங்கள் பொருட்கள் வாங்குகிறோம், பிறகு சேர்ந்து சமைக்கிறோம்.' },
    { de: 'Du gehst geradeaus, [dann] {siehst} du den Bahnhof.', en: 'You go straight on, then you\'ll see the station.', ta: 'நீ நேராகப் போ, பிறகு ரயில் நிலையத்தைப் பார்ப்பாய்.' },
    { de: 'Mach zuerst deine Hausaufgaben, [dann] {darfst} du |spielen|.', en: 'Do your homework first, then you may play.', ta: 'முதலில் உன் வீட்டுப்பாடத்தைச் செய், பிறகு நீ விளையாடலாம்.' },
    { de: 'Ich dusche, [dann] {ziehe} ich mich |an|.', en: 'I have a shower, then I get dressed.', ta: 'நான் குளிக்கிறேன், பிறகு ஆடை அணிகிறேன்.' },
    { de: 'Wir essen zu Abend, [dann] {sehen} wir |fern|.', en: 'We have dinner, then we watch TV.', ta: 'நாங்கள் இரவு உணவு சாப்பிடுகிறோம், பிறகு தொலைக்காட்சி பார்க்கிறோம்.' }] },
  folglich: { lv: 'B2', note: 'Logische Folge (consequently) — formell.', note_en: 'Logical result (consequently) — formal.', ex: [
    { de: 'Die Preise steigen, [folglich] {kaufen} die Leute weniger.', en: 'Prices are rising; consequently people are buying less.', ta: 'விலைகள் உயர்கின்றன, அதன் விளைவாக மக்கள் குறைவாக வாங்குகிறார்கள்.' },
    { de: 'Der Kunde zahlt nicht, [folglich] {bekommt} er keine Ware.', en: 'The customer isn\'t paying; consequently he gets no goods.', ta: 'வாடிக்கையாளர் பணம் செலுத்தவில்லை, அதன் விளைவாக அவருக்குப் பொருட்கள் கிடைக்காது.' },
    { de: 'Es gibt weniger Busse, [folglich] {fahren} mehr Leute mit dem Auto.', en: 'There are fewer buses; consequently more people go by car.', ta: 'பேருந்துகள் குறைவு, அதன் விளைவாக அதிகமானோர் காரில் செல்கிறார்கள்.' },
    { de: 'Er hat die Rechnung nicht bezahlt, [folglich] {wurde} der Strom |abgestellt|.', en: 'He didn\'t pay the bill; consequently the electricity was cut off.', ta: 'அவர் கட்டணத்தைச் செலுத்தவில்லை, அதன் விளைவாக மின்சாரம் துண்டிக்கப்பட்டது.' },
    { de: 'Der Flug wurde gestrichen, [folglich] {mussten} wir im Hotel |übernachten|.', en: 'The flight was cancelled; consequently we had to stay the night in a hotel.', ta: 'விமானம் ரத்து செய்யப்பட்டது, அதன் விளைவாக நாங்கள் ஹோட்டலில் இரவு தங்க வேண்டியிருந்தது.' },
    { de: 'Sie hat die Frist verpasst, [folglich] {wurde} ihr Antrag |abgelehnt|.', en: 'She missed the deadline; consequently her application was rejected.', ta: 'அவள் காலக்கெடுவைத் தவறவிட்டாள், அதன் விளைவாக அவளுடைய விண்ணப்பம் நிராகரிக்கப்பட்டது.' }] },
  allerdings: { lv: 'B1', note: 'Einschränkung (however). Position 1 → Verb sofort.', note_en: 'Restriction (however). Position 1 → verb right after it.', ex: [
    { de: 'Das Zimmer ist schön, [allerdings] {ist} es ziemlich laut.', en: 'The room is nice; however, it\'s quite noisy.', ta: 'அறை அழகாக இருக்கிறது, ஆனால் அது கொஞ்சம் சத்தமாக இருக்கிறது.' },
    { de: 'Der Job ist interessant, [allerdings] {verdient} man nicht viel.', en: 'The job is interesting; however, you don\'t earn much.', ta: 'வேலை சுவாரஸ்யமானது, ஆனால் அதில் அதிகம் சம்பாதிக்க முடியாது.' },
    { de: 'Das Restaurant ist gut, [allerdings] {sind} die Preise hoch.', en: 'The restaurant is good; however, the prices are high.', ta: 'உணவகம் நன்றாக இருக்கிறது, ஆனால் விலைகள் அதிகம்.' },
    { de: 'Ich komme gern mit, [allerdings] {muss} ich um zehn Uhr zu Hause |sein|.', en: 'I\'d love to come along; however, I have to be home at ten.', ta: 'நான் மகிழ்ச்சியாக உடன் வருகிறேன், ஆனால் பத்து மணிக்கு வீட்டில் இருக்க வேண்டும்.' },
    { de: 'Die Reise war schön, [allerdings] {hat} es oft |geregnet|.', en: 'The trip was lovely; however, it often rained.', ta: 'பயணம் இனிமையாக இருந்தது, ஆனால் அடிக்கடி மழை பெய்தது.' },
    { de: 'Du kannst mein Auto nehmen, [allerdings] {musst} du es morgen |zurückbringen|.', en: 'You can take my car; however, you have to bring it back tomorrow.', ta: 'நீ என் காரை எடுத்துக்கொள்ளலாம், ஆனால் நாளை திருப்பிக் கொண்டு வர வேண்டும்.' }] },

  /* ---------- Gruppe 3: Position 0 (ADUSO) — danach normale Wortstellung ---------- */
  aber: { lv: 'A1', note: 'Gegensatz (but). Position 0 → Subjekt + Verb wie immer.', note_en: 'Contrast (but). Position 0 → subject + verb as usual.', ex: [
    { de: 'Ich möchte kommen, [aber] ich {habe} keine Zeit.', en: 'I\'d like to come, but I have no time.', ta: 'நான் வர விரும்புகிறேன், ஆனால் எனக்கு நேரம் இல்லை.' },
    { de: 'Das Auto ist alt, [aber] es {fährt} noch gut.', en: 'The car is old, but it still runs well.', ta: 'கார் பழையது, ஆனால் அது இன்னும் நன்றாக ஓடுகிறது.' },
    { de: 'Ich trinke gern Tee, [aber] mein Mann {trinkt} lieber Kaffee.', en: 'I like drinking tea, but my husband prefers coffee.', ta: 'எனக்கு டீ குடிக்கப் பிடிக்கும், ஆனால் என் கணவருக்கு காபிதான் அதிகம் பிடிக்கும்.' },
    { de: 'Ich wollte kommen, [aber] ich {habe} den Bus |verpasst|.', en: 'I wanted to come, but I missed the bus.', ta: 'நான் வர விரும்பினேன், ஆனால் பேருந்தைத் தவறவிட்டேன்.' },
    { de: 'Das Essen war gut, [aber] wir {mussten} lange |warten|.', en: 'The food was good, but we had to wait a long time.', ta: 'உணவு நன்றாக இருந்தது, ஆனால் நாங்கள் நீண்ட நேரம் காத்திருக்க வேண்டியிருந்தது.' },
    { de: 'Wir wollten grillen, [aber] es {hat} den ganzen Tag |geregnet|.', en: 'We wanted to have a barbecue, but it rained all day.', ta: 'நாங்கள் கிரில் செய்ய விரும்பினோம், ஆனால் நாள் முழுவதும் மழை பெய்தது.' }] },
  denn: { lv: 'A1', note: 'Grund (because). Position 0 → normale Wortstellung (anders als weil!).', note_en: 'Reason (because). Position 0 → normal word order (unlike weil!).', ex: [
    { de: 'Ich bleibe zu Hause, [denn] ich {bin} krank.', en: 'I\'m staying at home, because I\'m ill.', ta: 'நான் வீட்டில் இருக்கிறேன், ஏனெனில் எனக்கு உடம்பு சரியில்லை.' },
    { de: 'Wir nehmen ein Taxi, [denn] es {ist} schon spät.', en: 'We\'re taking a taxi, because it\'s already late.', ta: 'நாங்கள் டாக்ஸி எடுக்கிறோம், ஏனெனில் ஏற்கனவே நேரமாகிவிட்டது.' },
    { de: 'Ich lerne Deutsch, [denn] ich {arbeite} in Deutschland.', en: 'I\'m learning German, because I work in Germany.', ta: 'நான் ஜெர்மன் கற்கிறேன், ஏனெனில் நான் ஜெர்மனியில் வேலை செய்கிறேன்.' },
    { de: 'Ich bin müde, [denn] ich {habe} schlecht |geschlafen|.', en: 'I\'m tired, because I slept badly.', ta: 'நான் சோர்வாக இருக்கிறேன், ஏனெனில் நான் சரியாகத் தூங்கவில்லை.' },
    { de: 'Wir bleiben zu Hause, [denn] wir {müssen} die Wohnung |putzen|.', en: 'We\'re staying at home, because we have to clean the flat.', ta: 'நாங்கள் வீட்டில் இருக்கிறோம், ஏனெனில் வீட்டைச் சுத்தம் செய்ய வேண்டும்.' },
    { de: 'Er ist glücklich, [denn] er {hat} eine Wohnung |gefunden|.', en: 'He is happy, because he has found a flat.', ta: 'அவர் மகிழ்ச்சியாக இருக்கிறார், ஏனெனில் அவருக்கு ஒரு வீடு கிடைத்துவிட்டது.' }] },
  und: { lv: 'A1', note: 'Verbindung (and). Position 0 — aber ein Wort wie danach nach und nimmt selbst Position 1.', note_en: 'Joining (and). Position 0 — but a word like danach after und takes position 1 itself.', ex: [
    { de: 'Ich wohne in Berlin, [und] meine Schwester {wohnt} in München.', en: 'I live in Berlin, and my sister lives in Munich.', ta: 'நான் பெர்லினில் வசிக்கிறேன், என் சகோதரி மியூனிக்கில் வசிக்கிறாள்.' },
    { de: 'Er kocht, [und] ich {decke} den Tisch.', en: 'He cooks and I set the table.', ta: 'அவர் சமைக்கிறார், நான் மேசையைத் தயார் செய்கிறேன்.' },
    { de: 'Wir gehen ins Kino, [und] danach {essen} wir Pizza.', en: 'We\'re going to the cinema, and afterwards we\'ll eat pizza.', ta: 'நாங்கள் சினிமாவுக்குப் போகிறோம், அதன் பிறகு பீட்சா சாப்பிடுவோம்.' },
    { de: 'Ich habe gekocht, [und] mein Mann {hat} |abgewaschen|.', en: 'I cooked and my husband did the washing-up.', ta: 'நான் சமைத்தேன், என் கணவர் பாத்திரங்களைக் கழுவினார்.' },
    { de: 'Sie steht um sechs Uhr auf, [und] um sieben {fängt} ihre Arbeit |an|.', en: 'She gets up at six, and her work starts at seven.', ta: 'அவள் ஆறு மணிக்கு எழுந்திருக்கிறாள், ஏழு மணிக்கு அவளுடைய வேலை தொடங்குகிறது.' },
    { de: 'Ich gehe einkaufen, [und] du {kannst} schon den Tisch |decken|.', en: 'I\'ll go shopping, and you can already set the table.', ta: 'நான் பொருட்கள் வாங்கப் போகிறேன், நீ இப்போதே மேசையைத் தயார் செய்யலாம்.' }] },
  sondern: { lv: 'A2', note: 'Korrektur nach nicht / kein (but rather). Position 0.', note_en: 'Correction after nicht / kein (but rather). Position 0.', ex: [
    { de: 'Ich trinke keinen Kaffee, [sondern] ich {trinke} Tee.', en: 'I don\'t drink coffee — I drink tea.', ta: 'நான் காபி குடிப்பதில்லை, மாறாக டீ குடிக்கிறேன்.' },
    { de: 'Wir fahren nicht mit dem Zug, [sondern] wir {nehmen} das Auto.', en: 'We\'re not going by train — we\'re taking the car.', ta: 'நாங்கள் ரயிலில் போவதில்லை, மாறாக காரை எடுத்துக்கொள்கிறோம்.' },
    { de: 'Er ist nicht faul, [sondern] er {ist} nur müde.', en: 'He isn\'t lazy — he\'s just tired.', ta: 'அவன் சோம்பேறி இல்லை, மாறாக வெறுமனே சோர்வாக இருக்கிறான்.' },
    { de: 'Ich habe nicht geschlafen, [sondern] ich {habe} die ganze Nacht |gelernt|.', en: 'I didn\'t sleep — I studied all night.', ta: 'நான் தூங்கவில்லை, மாறாக இரவு முழுவதும் படித்தேன்.' },
    { de: 'Wir fahren nicht in den Urlaub, [sondern] wir {müssen} |arbeiten|.', en: 'We\'re not going on holiday — we have to work.', ta: 'நாங்கள் விடுமுறைக்குப் போவதில்லை, மாறாக வேலை செய்ய வேண்டும்.' },
    { de: 'Er hat nicht angerufen, [sondern] er {hat} eine Nachricht |geschickt|.', en: 'He didn\'t call — he sent a message.', ta: 'அவர் அழைக்கவில்லை, மாறாக ஒரு செய்தி அனுப்பினார்.' }] },
  oder: { lv: 'A1', note: 'Alternative (or). Position 0 — in Fragen danach wieder Verb zuerst.', note_en: 'Alternative (or). Position 0 — in questions the verb comes first again.', ex: [
    { de: 'Möchtest du Tee, [oder] {möchtest} du Kaffee?', en: 'Would you like tea, or would you like coffee?', ta: 'உனக்கு டீ வேண்டுமா, அல்லது காபி வேண்டுமா?' },
    { de: 'Wir kochen zu Hause, [oder] wir {gehen} ins Restaurant.', en: 'We cook at home, or we go to a restaurant.', ta: 'நாங்கள் வீட்டில் சமைப்போம், அல்லது உணவகத்துக்குப் போவோம்.' },
    { de: 'Du kannst mich anrufen, [oder] du {schreibst} mir eine Nachricht.', en: 'You can call me, or you can send me a message.', ta: 'நீ என்னை அழைக்கலாம், அல்லது எனக்கு ஒரு செய்தி அனுப்பலாம்.' },
    { de: 'Du kannst mit dem Bus fahren, [oder] ich {kann} dich |abholen|.', en: 'You can take the bus, or I can pick you up.', ta: 'நீ பேருந்தில் வரலாம், அல்லது நான் வந்து உன்னை அழைத்துச் செல்லலாம்.' },
    { de: 'Ist sie krank, [oder] {hat} sie den Termin |vergessen|?', en: 'Is she ill, or has she forgotten the appointment?', ta: 'அவளுக்கு உடம்பு சரியில்லையா, அல்லது சந்திப்பை மறந்துவிட்டாளா?' },
    { de: 'Hast du Hunger, [oder] {sollen} wir später |essen|?', en: 'Are you hungry, or shall we eat later?', ta: 'உனக்குப் பசிக்கிறதா, அல்லது நாம் பிறகு சாப்பிடலாமா?' }] },

  /* ---------- Gruppe 4: zweiteilige Konnektoren ---------- */
  nicht: { lv: 'B1', note: 'nicht nur … sondern auch (not only … but also).', note_en: 'nicht nur … sondern auch (not only … but also).', ex: [
    { de: 'Sie spricht [nicht nur] Deutsch, [sondern auch] Französisch.', en: 'She speaks not only German but also French.', ta: 'அவள் ஜெர்மன் மட்டுமல்ல, பிரெஞ்சும் பேசுவாள்.' },
    { de: 'Das Hotel war [nicht nur] billig, [sondern auch] sehr sauber.', en: 'The hotel was not only cheap but also very clean.', ta: 'ஹோட்டல் மலிவானது மட்டுமல்ல, மிகவும் சுத்தமாகவும் இருந்தது.' },
    { de: 'Ich brauche [nicht nur] meinen Pass, [sondern auch] ein Foto.', en: 'I need not only my passport but also a photo.', ta: 'எனக்கு என் கடவுச்சீட்டு மட்டுமல்ல, ஒரு புகைப்படமும் தேவை.' }] },
  sowohl: { lv: 'B1', note: 'sowohl … als auch (both … and). Zwei Subjekte → Verb im Plural.', note_en: 'sowohl … als auch (both … and). Two subjects → plural verb.', ex: [
    { de: 'Ich mag [sowohl] Hunde [als auch] Katzen.', en: 'I like both dogs and cats.', ta: 'எனக்கு நாய்களும் பிடிக்கும், பூனைகளும் பிடிக்கும்.' },
    { de: '[Sowohl] meine Frau [als auch] ich {arbeiten} in einem Krankenhaus.', en: 'Both my wife and I work in a hospital.', ta: 'என் மனைவியும் நானும் ஒரு மருத்துவமனையில் வேலை செய்கிறோம்.' },
    { de: 'Der Kurs ist [sowohl] am Vormittag [als auch] am Abend möglich.', en: 'The course is possible both in the morning and in the evening.', ta: 'வகுப்பு காலையிலும் மாலையிலும் நடக்கும்.' }] },
  weder: { lv: 'B1', note: 'weder … noch (neither … nor) — schon verneint, kein extra nicht!', note_en: 'weder … noch (neither … nor) — already negative, no extra nicht!', ex: [
    { de: 'Ich habe [weder] Zeit [noch] Geld.', en: 'I have neither time nor money.', ta: 'எனக்கு நேரமும் இல்லை, பணமும் இல்லை.' },
    { de: 'Er trinkt [weder] Alkohol [noch] Kaffee.', en: 'He drinks neither alcohol nor coffee.', ta: 'அவன் மதுவும் குடிப்பதில்லை, காபியும் குடிப்பதில்லை.' },
    { de: '[Weder] mein Bruder [noch] meine Schwester {wohnt} in Deutschland.', en: 'Neither my brother nor my sister lives in Germany.', ta: 'என் சகோதரனும் ஜெர்மனியில் வசிக்கவில்லை, என் சகோதரியும் வசிக்கவில்லை.' }] },
  zwar: { lv: 'B1', note: 'zwar … aber (admittedly … but). aber = Position 0.', note_en: 'zwar … aber (admittedly … but). aber = position 0.', ex: [
    { de: 'Das Auto ist [zwar] alt, [aber] es {fährt} noch gut.', en: 'The car is old, it\'s true, but it still runs well.', ta: 'கார் பழையதுதான், ஆனால் அது இன்னும் நன்றாக ஓடுகிறது.' },
    { de: 'Ich bin [zwar] müde, [aber] ich {komme} mit.', en: 'I\'m tired, admittedly, but I\'ll come along.', ta: 'நான் சோர்வாகத்தான் இருக்கிறேன், ஆனால் உடன் வருகிறேன்.' },
    { de: 'Die Wohnung ist [zwar] klein, [aber] sie {ist} sehr gemütlich.', en: 'The flat is small, it\'s true, but it\'s very cosy.', ta: 'வீடு சிறியதுதான், ஆனால் மிகவும் வசதியாக இருக்கிறது.' }] },
  je: { lv: 'B2', note: 'je … desto / umso (the more … the more). je-Teil: Verb am Ende; desto + Komparativ: Verb sofort.', note_en: 'je … desto / umso (the more … the more). je part: verb at the end; desto + comparative: verb right after.', ex: [
    { de: '[Je] mehr ich {übe}, [desto] besser {spreche} ich.', en: 'The more I practise, the better I speak.', ta: 'நான் எவ்வளவு அதிகம் பயிற்சி செய்கிறேனோ, அவ்வளவு நன்றாகப் பேசுகிறேன்.' },
    { de: '[Je] früher wir {losfahren}, [desto] weniger Verkehr {gibt} es.', en: 'The earlier we set off, the less traffic there is.', ta: 'நாம் எவ்வளவு சீக்கிரம் புறப்படுகிறோமோ, அவ்வளவு குறைவான போக்குவரத்து இருக்கும்.' },
    { de: '[Je] älter man {wird}, [umso] ruhiger {wird} man.', en: 'The older you get, the calmer you become.', ta: 'வயது ஆக ஆக, மனிதர் அமைதியாகிறார்.' }] },
  einerseits: { lv: 'B2', note: 'einerseits … andererseits (on the one hand … on the other). Beide Position 1 → Verb sofort.', note_en: 'einerseits … andererseits (on the one hand … on the other). Both take position 1 → verb right after.', ex: [
    { de: '[Einerseits] {verdiene} ich gut, [andererseits] {habe} ich wenig Freizeit.', en: 'On the one hand I earn well, on the other hand I have little free time.', ta: 'ஒருபுறம் நான் நன்றாகச் சம்பாதிக்கிறேன், மறுபுறம் எனக்கு ஓய்வு நேரம் குறைவு.' },
    { de: '[Einerseits] {ist} die Stadt schön, [andererseits] {ist} sie sehr teuer.', en: 'On the one hand the city is beautiful, on the other hand it\'s very expensive.', ta: 'ஒருபுறம் நகரம் அழகானது, மறுபுறம் அது மிகவும் விலை உயர்ந்தது.' },
    { de: 'Ich möchte [einerseits] in Deutschland bleiben, [andererseits] {vermisse} ich meine Familie.', en: 'On the one hand I\'d like to stay in Germany, on the other hand I miss my family.', ta: 'ஒருபுறம் நான் ஜெர்மனியில் இருக்க விரும்புகிறேன், மறுபுறம் என் குடும்பத்தை நினைத்து ஏங்குகிறேன்.' }] }
};
