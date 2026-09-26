/* Konnektoren-Referenz: 3 examples for EVERY connector chip (Task 78).
   Markup in `de`: [ ] = the connector (both parts for two-part connectors), { } = the conjugated verb whose position
   the rule is about. German and English written by the assistant and checked against the group's word-order rule by
   scripts/check_konnektoren_examples.py (build step); Tamil is AI-assisted (shown with 🤖 on the page).
   Keys = first word of the chip label, lower case. */
window.DC_KONN_EX = {
  /* ---------- Gruppe 1: Nebensatz — Verb am Ende ---------- */
  weil: { lv: 'A2', note: 'Grund (because). Verb ans ENDE — gleiche Bedeutung wie denn, aber andere Wortstellung.', ex: [
    { de: 'Ich bleibe heute zu Hause, [weil] ich Fieber {habe}.', en: 'I\'m staying at home today because I have a temperature.', ta: 'எனக்குக் காய்ச்சல் இருப்பதால் இன்று நான் வீட்டில் இருக்கிறேன்.' },
    { de: '[Weil] der Bus nicht {kam}, {bin} ich zu spät zur Arbeit gekommen.', en: 'Because the bus didn\'t come, I was late for work.', ta: 'பேருந்து வராததால் நான் வேலைக்குத் தாமதமாக வந்தேன்.' },
    { de: 'Sie lernt Deutsch, [weil] sie in Deutschland arbeiten {möchte}.', en: 'She is learning German because she wants to work in Germany.', ta: 'ஜெர்மனியில் வேலை செய்ய விரும்புவதால் அவள் ஜெர்மன் கற்கிறாள்.' }] },
  da: { lv: 'B1', note: 'Grund wie weil, steht oft am Satzanfang (bekannter Grund).', ex: [
    { de: '[Da] es heute {regnet}, {nehmen} wir das Auto.', en: 'As it\'s raining today, we\'re taking the car.', ta: 'இன்று மழை பெய்வதால், நாங்கள் காரை எடுத்துக்கொள்கிறோம்.' },
    { de: '[Da] ich kein Visum {hatte}, {konnte} ich nicht reisen.', en: 'Since I had no visa, I couldn\'t travel.', ta: 'என்னிடம் விசா இல்லாததால், என்னால் பயணம் செய்ய முடியவில்லை.' },
    { de: 'Wir bestellen Pizza, [da] niemand kochen {will}.', en: 'We\'re ordering pizza, since nobody wants to cook.', ta: 'யாரும் சமைக்க விரும்பாததால், நாங்கள் பீட்சா ஆர்டர் செய்கிறோம்.' }] },
  dass: { lv: 'A2', note: 'Inhalt nach sagen, denken, hoffen, wissen, es ist wichtig … Verb ans ENDE.', ex: [
    { de: 'Ich hoffe, [dass] du bald wieder gesund {bist}.', en: 'I hope that you\'ll be well again soon.', ta: 'நீ விரைவில் மீண்டும் குணமடைவாய் என்று நம்புகிறேன்.' },
    { de: 'Er sagt, [dass] der Zug Verspätung {hat}.', en: 'He says that the train is delayed.', ta: 'ரயில் தாமதமாக வருகிறது என்று அவர் சொல்கிறார்.' },
    { de: 'Es ist wichtig, [dass] wir jeden Tag Deutsch {sprechen}.', en: 'It\'s important that we speak German every day.', ta: 'நாம் தினமும் ஜெர்மன் பேசுவது முக்கியம்.' }] },
  wenn: { lv: 'A2', note: 'Bedingung (if) oder wiederholt / Gegenwart / Zukunft (when). Verb ans ENDE.', ex: [
    { de: '[Wenn] ich Zeit {habe}, {koche} ich gern indisch.', en: 'When I have time, I like cooking Indian food.', ta: 'எனக்கு நேரம் இருக்கும்போது, இந்திய உணவு சமைக்க எனக்குப் பிடிக்கும்.' },
    { de: 'Ruf mich an, [wenn] du am Bahnhof {bist}.', en: 'Call me when you\'re at the station.', ta: 'நீ ரயில் நிலையத்தில் இருக்கும்போது எனக்கு அழை.' },
    { de: '[Wenn] es morgen {regnet}, {bleiben} wir zu Hause.', en: 'If it rains tomorrow, we\'ll stay at home.', ta: 'நாளை மழை பெய்தால், நாங்கள் வீட்டிலேயே இருப்போம்.' }] },
  als: { lv: 'A2', note: 'EINMAL in der Vergangenheit (sonst: wenn). Verb ans ENDE.', ex: [
    { de: '[Als] ich ein Kind {war}, {wohnten} wir in Chennai.', en: 'When I was a child, we lived in Chennai.', ta: 'நான் குழந்தையாக இருந்தபோது, நாங்கள் சென்னையில் வசித்தோம்.' },
    { de: '[Als] wir am Flughafen {ankamen}, {war} das Flugzeug schon weg.', en: 'When we arrived at the airport, the plane had already gone.', ta: 'நாங்கள் விமான நிலையத்தை அடைந்தபோது, விமானம் ஏற்கனவே புறப்பட்டுவிட்டது.' },
    { de: 'Ich habe mich sehr gefreut, [als] ich die Prüfung bestanden {habe}.', en: 'I was very happy when I passed the exam.', ta: 'தேர்வில் தேர்ச்சி பெற்றபோது நான் மிகவும் மகிழ்ந்தேன்.' }] },
  obwohl: { lv: 'A2', note: 'Gegensatz (although). Verb ans ENDE — vgl. trotzdem (Position 1).', ex: [
    { de: '[Obwohl] es kalt {ist}, {geht} er ohne Jacke raus.', en: 'Although it\'s cold, he goes out without a jacket.', ta: 'குளிராக இருந்தாலும், அவன் ஜாக்கெட் இல்லாமல் வெளியே போகிறான்.' },
    { de: 'Ich gehe zur Arbeit, [obwohl] ich müde {bin}.', en: 'I go to work although I\'m tired.', ta: 'நான் சோர்வாக இருந்தாலும் வேலைக்குப் போகிறேன்.' },
    { de: '[Obwohl] die Wohnung klein {ist}, {gefällt} sie uns sehr.', en: 'Although the flat is small, we like it a lot.', ta: 'வீடு சிறியதாக இருந்தாலும், அது எங்களுக்கு மிகவும் பிடிக்கும்.' }] },
  'während': { lv: 'B1', note: 'Gleichzeitig (while). Verb ans ENDE.', ex: [
    { de: '[Während] ich {koche}, {hört} mein Mann Musik.', en: 'While I cook, my husband listens to music.', ta: 'நான் சமைக்கும்போது, என் கணவர் இசை கேட்கிறார்.' },
    { de: 'Sie telefoniert, [während] sie Auto {fährt}.', en: 'She talks on the phone while she\'s driving.', ta: 'அவள் கார் ஓட்டும்போது தொலைபேசியில் பேசுகிறாள்.' },
    { de: '[Während] wir im Urlaub {waren}, {hat} die Nachbarin die Blumen gegossen.', en: 'While we were on holiday, the neighbour watered the flowers.', ta: 'நாங்கள் விடுமுறையில் இருந்தபோது, பக்கத்து வீட்டுப் பெண் பூச்செடிகளுக்குத் தண்ணீர் ஊற்றினார்.' }] },
  nachdem: { lv: 'B1', note: 'Erst A, dann B. Nebensatz eine Zeitstufe früher (Perfekt → Präsens, Plusquamperfekt → Präteritum).', ex: [
    { de: '[Nachdem] ich gegessen {habe}, {gehe} ich spazieren.', en: 'After I\'ve eaten, I go for a walk.', ta: 'நான் சாப்பிட்ட பிறகு, நடக்கப் போகிறேன்.' },
    { de: '[Nachdem] sie den Brief gelesen {hatte}, {rief} sie ihre Mutter an.', en: 'After she had read the letter, she called her mother.', ta: 'கடிதத்தைப் படித்த பிறகு, அவள் தன் அம்மாவை அழைத்தாள்.' },
    { de: 'Wir fahren los, [nachdem] die Kinder angekommen {sind}.', en: 'We\'ll set off after the children have arrived.', ta: 'குழந்தைகள் வந்து சேர்ந்த பிறகு நாங்கள் புறப்படுவோம்.' }] },
  bevor: { lv: 'B1', note: 'Vorher (before). Verb ans ENDE.', ex: [
    { de: '[Bevor] ich zur Arbeit {gehe}, {trinke} ich einen Kaffee.', en: 'Before I go to work, I drink a coffee.', ta: 'வேலைக்குப் போவதற்கு முன், நான் ஒரு காபி குடிக்கிறேன்.' },
    { de: 'Wasch dir die Hände, [bevor] du {isst}.', en: 'Wash your hands before you eat.', ta: 'சாப்பிடுவதற்கு முன் உன் கைகளைக் கழுவு.' },
    { de: '[Bevor] wir nach Indien {fliegen}, {müssen} wir Geschenke kaufen.', en: 'Before we fly to India, we have to buy presents.', ta: 'இந்தியாவுக்கு விமானத்தில் போவதற்கு முன், நாங்கள் பரிசுகள் வாங்க வேண்டும்.' }] },
  damit: { lv: 'B1', note: 'Ziel (so that). Anderes Subjekt → damit; gleiches Subjekt → um … zu.', ex: [
    { de: 'Ich spreche langsam, [damit] mich alle {verstehen}.', en: 'I speak slowly so that everyone understands me.', ta: 'எல்லோருக்கும் புரிய வேண்டும் என்பதற்காக நான் மெதுவாகப் பேசுகிறேன்.' },
    { de: 'Wir sparen Geld, [damit] unsere Kinder studieren {können}.', en: 'We save money so that our children can study.', ta: 'எங்கள் குழந்தைகள் படிக்க முடிய வேண்டும் என்பதற்காக நாங்கள் பணம் சேமிக்கிறோம்.' },
    { de: 'Mach das Fenster zu, [damit] es nicht so kalt {wird}.', en: 'Close the window so that it doesn\'t get so cold.', ta: 'அதிகம் குளிராகாமல் இருக்க ஜன்னலை மூடு.' }] },
  ob: { lv: 'B1', note: 'Indirekte Ja/Nein-Frage (whether). Verb ans ENDE.', ex: [
    { de: 'Ich weiß nicht, [ob] er heute {kommt}.', en: 'I don\'t know whether he\'s coming today.', ta: 'அவன் இன்று வருவானா என்று எனக்குத் தெரியாது.' },
    { de: 'Kannst du mir sagen, [ob] der Supermarkt noch offen {ist}?', en: 'Can you tell me whether the supermarket is still open?', ta: 'பல்பொருள் அங்காடி இன்னும் திறந்திருக்கிறதா என்று சொல்ல முடியுமா?' },
    { de: 'Sie fragt, [ob] wir am Samstag Zeit {haben}.', en: 'She\'s asking whether we have time on Saturday.', ta: 'சனிக்கிழமை எங்களுக்கு நேரம் இருக்கிறதா என்று அவள் கேட்கிறாள்.' }] },
  falls: { lv: 'B1', note: 'Für den Fall, dass … (in case). Wie wenn, aber weniger wahrscheinlich.', ex: [
    { de: '[Falls] du Hilfe {brauchst}, {ruf} mich an.', en: 'In case you need help, call me.', ta: 'உனக்கு உதவி தேவைப்பட்டால், என்னை அழை.' },
    { de: 'Nimm einen Schirm mit, [falls] es {regnet}.', en: 'Take an umbrella in case it rains.', ta: 'மழை பெய்தால் பயன்படும், ஒரு குடையை எடுத்துச் செல்.' },
    { de: '[Falls] der Zug {ausfällt}, {nehmen} wir den Bus.', en: 'In case the train is cancelled, we\'ll take the bus.', ta: 'ரயில் ரத்து செய்யப்பட்டால், நாங்கள் பேருந்தில் செல்வோம்.' }] },
  sodass: { lv: 'B1', note: 'Folge (so that / with the result that). Steht immer HINTER dem Hauptsatz.', ex: [
    { de: 'Es hat stark geregnet, [sodass] das Fußballspiel ausfallen {musste}.', en: 'It rained heavily, so the football match had to be cancelled.', ta: 'பலத்த மழை பெய்ததால், கால்பந்து போட்டி ரத்து செய்யப்பட வேண்டியிருந்தது.' },
    { de: 'Er war krank, [sodass] er nicht zur Arbeit gehen {konnte}.', en: 'He was ill, so he couldn\'t go to work.', ta: 'அவர் உடல்நலமில்லாமல் இருந்ததால், வேலைக்குப் போக முடியவில்லை.' },
    { de: 'Der Bus war voll, [sodass] wir zu Fuß gegangen {sind}.', en: 'The bus was full, so we walked.', ta: 'பேருந்து நிரம்பியிருந்ததால், நாங்கள் நடந்து சென்றோம்.' }] },
  seitdem: { lv: 'B1', note: 'Seit diesem Zeitpunkt (since). Oft Präsens, weil es bis heute gilt.', ex: [
    { de: '[Seitdem] ich in Berlin {wohne}, {fahre} ich viel Fahrrad.', en: 'Since I\'ve been living in Berlin, I cycle a lot.', ta: 'நான் பெர்லினில் வசிக்கத் தொடங்கியதிலிருந்து, நிறைய சைக்கிள் ஓட்டுகிறேன்.' },
    { de: 'Er ist viel ruhiger, [seitdem] er Yoga {macht}.', en: 'He\'s much calmer since he started doing yoga.', ta: 'யோகா செய்யத் தொடங்கியதிலிருந்து அவர் மிகவும் அமைதியாக இருக்கிறார்.' },
    { de: '[Seitdem] wir einen Hund {haben}, {gehen} wir jeden Tag spazieren.', en: 'Since we\'ve had a dog, we go for a walk every day.', ta: 'எங்களிடம் நாய் வந்ததிலிருந்து, நாங்கள் தினமும் நடக்கப் போகிறோம்.' }] },

  /* ---------- Gruppe 2: Position 1 — Verb sofort danach, dann Subjekt ---------- */
  deshalb: { lv: 'A2', note: 'Folge (so / that\'s why). deshalb = Position 1 → Verb, dann Subjekt.', ex: [
    { de: 'Ich bin müde, [deshalb] {gehe} ich früh ins Bett.', en: 'I\'m tired, so I\'m going to bed early.', ta: 'நான் சோர்வாக இருக்கிறேன், அதனால் சீக்கிரம் தூங்கப் போகிறேன்.' },
    { de: 'Der Zug hatte Verspätung, [deshalb] {bin} ich zu spät gekommen.', en: 'The train was late, so I arrived late.', ta: 'ரயில் தாமதமானது, அதனால் நான் தாமதமாக வந்தேன்.' },
    { de: 'Meine Mutter hat Geburtstag, [deshalb] {kaufe} ich Blumen.', en: 'It\'s my mother\'s birthday, so I\'m buying flowers.', ta: 'என் அம்மாவுக்குப் பிறந்தநாள், அதனால் நான் பூக்கள் வாங்குகிறேன்.' }] },
  deswegen: { lv: 'A2', note: 'Wie deshalb (that\'s why) — eher gesprochen.', ex: [
    { de: 'Es ist sehr heiß, [deswegen] {trinken} wir viel Wasser.', en: 'It\'s very hot, that\'s why we drink a lot of water.', ta: 'மிகவும் வெப்பமாக இருக்கிறது, அதனால் நாங்கள் நிறைய தண்ணீர் குடிக்கிறோம்.' },
    { de: 'Ich habe keinen Führerschein, [deswegen] {fahre} ich mit dem Bus.', en: 'I don\'t have a driving licence, that\'s why I go by bus.', ta: 'என்னிடம் ஓட்டுநர் உரிமம் இல்லை, அதனால் நான் பேருந்தில் செல்கிறேன்.' },
    { de: 'Er hat viel gelernt, [deswegen] {hat} er die Prüfung bestanden.', en: 'He studied a lot, that\'s why he passed the exam.', ta: 'அவன் நிறையப் படித்தான், அதனால் தேர்வில் தேர்ச்சி பெற்றான்.' }] },
  daher: { lv: 'B1', note: 'Wie deshalb (hence) — eher geschrieben.', ex: [
    { de: 'Die Straße ist gesperrt, [daher] {müssen} wir einen Umweg fahren.', en: 'The road is closed, so we have to take a detour.', ta: 'சாலை மூடப்பட்டுள்ளது, எனவே நாங்கள் சுற்றுவழியில் செல்ல வேண்டும்.' },
    { de: 'Ich spreche noch nicht gut Deutsch, [daher] {besuche} ich einen Kurs.', en: 'I don\'t speak German well yet, so I\'m taking a course.', ta: 'நான் இன்னும் நன்றாக ஜெர்மன் பேசுவதில்லை, எனவே ஒரு வகுப்பில் படிக்கிறேன்.' },
    { de: 'Das Angebot war günstig, [daher] {haben} wir sofort gebucht.', en: 'The offer was cheap, so we booked straight away.', ta: 'சலுகை மலிவாக இருந்தது, எனவே நாங்கள் உடனே முன்பதிவு செய்தோம்.' }] },
  trotzdem: { lv: 'A2', note: 'Gegensatz (nevertheless / anyway). Position 1 — vgl. obwohl (Verb am Ende).', ex: [
    { de: 'Es regnet, [trotzdem] {gehen} wir spazieren.', en: 'It\'s raining; we\'re going for a walk anyway.', ta: 'மழை பெய்கிறது, இருந்தாலும் நாங்கள் நடக்கப் போகிறோம்.' },
    { de: 'Ich war krank, [trotzdem] {bin} ich zur Arbeit gegangen.', en: 'I was ill; nevertheless I went to work.', ta: 'எனக்கு உடம்பு சரியில்லை, இருந்தாலும் நான் வேலைக்குப் போனேன்.' },
    { de: 'Die Prüfung war schwer, [trotzdem] {habe} ich bestanden.', en: 'The exam was hard; I passed anyway.', ta: 'தேர்வு கடினமாக இருந்தது, இருந்தாலும் நான் தேர்ச்சி பெற்றேன்.' }] },
  'außerdem': { lv: 'A2', note: 'Zusätzlich (besides / also). Position 1 → Verb sofort.', ex: [
    { de: 'Die Wohnung ist hell, [außerdem] {hat} sie einen Balkon.', en: 'The flat is bright, and it also has a balcony.', ta: 'வீடு வெளிச்சமாக இருக்கிறது, மேலும் அதில் ஒரு பால்கனியும் இருக்கிறது.' },
    { de: 'Ich arbeite Vollzeit, [außerdem] {lerne} ich abends Deutsch.', en: 'I work full-time, and I also study German in the evenings.', ta: 'நான் முழு நேரம் வேலை செய்கிறேன், மேலும் மாலையில் ஜெர்மன் படிக்கிறேன்.' },
    { de: 'Das Hotel liegt zentral, [außerdem] {ist} das Frühstück inklusive.', en: 'The hotel is central; besides, breakfast is included.', ta: 'ஹோட்டல் நகர மையத்தில் இருக்கிறது, மேலும் காலை உணவும் அதில் அடங்கும்.' }] },
  sonst: { lv: 'B1', note: 'Warnung (otherwise). Position 1 → Verb sofort.', ex: [
    { de: 'Zieh eine Jacke an, [sonst] {wirst} du krank.', en: 'Put a jacket on, otherwise you\'ll get ill.', ta: 'ஜாக்கெட் போட்டுக்கொள், இல்லையென்றால் உனக்கு உடம்பு சரியில்லாமல் போகும்.' },
    { de: 'Wir müssen jetzt los, [sonst] {verpassen} wir den Bus.', en: 'We have to go now, otherwise we\'ll miss the bus.', ta: 'நாம் இப்போது புறப்பட வேண்டும், இல்லையென்றால் பேருந்தைத் தவறவிடுவோம்.' },
    { de: 'Du musst den Antrag heute abgeben, [sonst] {bekommst} du keinen Termin.', en: 'You must hand in the application today, otherwise you won\'t get an appointment.', ta: 'நீ இன்றே விண்ணப்பத்தைச் சமர்ப்பிக்க வேண்டும், இல்லையென்றால் உனக்குச் சந்திப்பு நேரம் கிடைக்காது.' }] },
  dann: { lv: 'A1', note: 'Reihenfolge (then). Position 1 → Verb sofort.', ex: [
    { de: 'Zuerst frühstücke ich, [dann] {gehe} ich zur Arbeit.', en: 'First I have breakfast, then I go to work.', ta: 'முதலில் நான் காலை உணவு சாப்பிடுகிறேன், பிறகு வேலைக்குப் போகிறேன்.' },
    { de: 'Wir kaufen ein, [dann] {kochen} wir zusammen.', en: 'We do the shopping, then we cook together.', ta: 'நாங்கள் பொருட்கள் வாங்குகிறோம், பிறகு சேர்ந்து சமைக்கிறோம்.' },
    { de: 'Mach zuerst deine Hausaufgaben, [dann] {darfst} du spielen.', en: 'Do your homework first, then you may play.', ta: 'முதலில் உன் வீட்டுப்பாடத்தைச் செய், பிறகு நீ விளையாடலாம்.' }] },
  folglich: { lv: 'B2', note: 'Logische Folge (consequently) — formell.', ex: [
    { de: 'Er hat die Rechnung nicht bezahlt, [folglich] {wurde} der Strom abgestellt.', en: 'He didn\'t pay the bill; consequently the electricity was cut off.', ta: 'அவர் கட்டணத்தைச் செலுத்தவில்லை, அதன் விளைவாக மின்சாரம் துண்டிக்கப்பட்டது.' },
    { de: 'Die Preise steigen, [folglich] {kaufen} die Leute weniger.', en: 'Prices are rising; consequently people are buying less.', ta: 'விலைகள் உயர்கின்றன, அதன் விளைவாக மக்கள் குறைவாக வாங்குகிறார்கள்.' },
    { de: 'Der Flug wurde gestrichen, [folglich] {mussten} wir im Hotel übernachten.', en: 'The flight was cancelled; consequently we had to stay the night in a hotel.', ta: 'விமானம் ரத்து செய்யப்பட்டது, அதன் விளைவாக நாங்கள் ஹோட்டலில் இரவு தங்க வேண்டியிருந்தது.' }] },
  allerdings: { lv: 'B1', note: 'Einschränkung (however). Position 1 → Verb sofort.', ex: [
    { de: 'Das Zimmer ist schön, [allerdings] {ist} es ziemlich laut.', en: 'The room is nice; however, it\'s quite noisy.', ta: 'அறை அழகாக இருக்கிறது, ஆனால் அது கொஞ்சம் சத்தமாக இருக்கிறது.' },
    { de: 'Ich komme gern mit, [allerdings] {muss} ich um zehn Uhr zu Hause sein.', en: 'I\'d love to come along; however, I have to be home at ten.', ta: 'நான் மகிழ்ச்சியாக உடன் வருகிறேன், ஆனால் பத்து மணிக்கு வீட்டில் இருக்க வேண்டும்.' },
    { de: 'Der Job ist interessant, [allerdings] {verdient} man nicht viel.', en: 'The job is interesting; however, you don\'t earn much.', ta: 'வேலை சுவாரஸ்யமானது, ஆனால் அதில் அதிகம் சம்பாதிக்க முடியாது.' }] },

  /* ---------- Gruppe 3: Position 0 (ADUSO) — danach normale Wortstellung ---------- */
  aber: { lv: 'A1', note: 'Gegensatz (but). Position 0 → Subjekt + Verb wie immer.', ex: [
    { de: 'Ich möchte kommen, [aber] ich {habe} keine Zeit.', en: 'I\'d like to come, but I have no time.', ta: 'நான் வர விரும்புகிறேன், ஆனால் எனக்கு நேரம் இல்லை.' },
    { de: 'Das Auto ist alt, [aber] es {fährt} noch gut.', en: 'The car is old, but it still runs well.', ta: 'கார் பழையது, ஆனால் அது இன்னும் நன்றாக ஓடுகிறது.' },
    { de: 'Ich trinke gern Tee, [aber] mein Mann {trinkt} lieber Kaffee.', en: 'I like drinking tea, but my husband prefers coffee.', ta: 'எனக்கு டீ குடிக்கப் பிடிக்கும், ஆனால் என் கணவருக்கு காபிதான் அதிகம் பிடிக்கும்.' }] },
  denn: { lv: 'A1', note: 'Grund (because). Position 0 → normale Wortstellung (anders als weil!).', ex: [
    { de: 'Ich bleibe zu Hause, [denn] ich {bin} krank.', en: 'I\'m staying at home, because I\'m ill.', ta: 'நான் வீட்டில் இருக்கிறேன், ஏனெனில் எனக்கு உடம்பு சரியில்லை.' },
    { de: 'Wir nehmen ein Taxi, [denn] es {ist} schon spät.', en: 'We\'re taking a taxi, because it\'s already late.', ta: 'நாங்கள் டாக்ஸி எடுக்கிறோம், ஏனெனில் ஏற்கனவே நேரமாகிவிட்டது.' },
    { de: 'Ich lerne Deutsch, [denn] ich {arbeite} in Deutschland.', en: 'I\'m learning German, because I work in Germany.', ta: 'நான் ஜெர்மன் கற்கிறேன், ஏனெனில் நான் ஜெர்மனியில் வேலை செய்கிறேன்.' }] },
  und: { lv: 'A1', note: 'Verbindung (and). Position 0 — aber ein Wort wie danach nach und nimmt selbst Position 1.', ex: [
    { de: 'Ich wohne in Berlin, [und] meine Schwester {wohnt} in München.', en: 'I live in Berlin, and my sister lives in Munich.', ta: 'நான் பெர்லினில் வசிக்கிறேன், என் சகோதரி மியூனிக்கில் வசிக்கிறாள்.' },
    { de: 'Er kocht, [und] ich {decke} den Tisch.', en: 'He cooks and I set the table.', ta: 'அவர் சமைக்கிறார், நான் மேசையைத் தயார் செய்கிறேன்.' },
    { de: 'Wir gehen ins Kino, [und] danach {essen} wir Pizza.', en: 'We\'re going to the cinema, and afterwards we\'ll eat pizza.', ta: 'நாங்கள் சினிமாவுக்குப் போகிறோம், அதன் பிறகு பீட்சா சாப்பிடுவோம்.' }] },
  sondern: { lv: 'A2', note: 'Korrektur nach nicht / kein (but rather). Position 0.', ex: [
    { de: 'Ich trinke keinen Kaffee, [sondern] ich {trinke} Tee.', en: 'I don\'t drink coffee — I drink tea.', ta: 'நான் காபி குடிப்பதில்லை, மாறாக டீ குடிக்கிறேன்.' },
    { de: 'Wir fahren nicht mit dem Zug, [sondern] wir {nehmen} das Auto.', en: 'We\'re not going by train — we\'re taking the car.', ta: 'நாங்கள் ரயிலில் போவதில்லை, மாறாக காரை எடுத்துக்கொள்கிறோம்.' },
    { de: 'Er ist nicht faul, [sondern] er {ist} nur müde.', en: 'He isn\'t lazy — he\'s just tired.', ta: 'அவன் சோம்பேறி இல்லை, மாறாக வெறுமனே சோர்வாக இருக்கிறான்.' }] },
  oder: { lv: 'A1', note: 'Alternative (or). Position 0 — in Fragen danach wieder Verb zuerst.', ex: [
    { de: 'Möchtest du Tee, [oder] {möchtest} du Kaffee?', en: 'Would you like tea, or would you like coffee?', ta: 'உனக்கு டீ வேண்டுமா, அல்லது காபி வேண்டுமா?' },
    { de: 'Wir kochen zu Hause, [oder] wir {gehen} ins Restaurant.', en: 'We cook at home, or we go to a restaurant.', ta: 'நாங்கள் வீட்டில் சமைப்போம், அல்லது உணவகத்துக்குப் போவோம்.' },
    { de: 'Du kannst mich anrufen, [oder] du {schreibst} mir eine Nachricht.', en: 'You can call me, or you can send me a message.', ta: 'நீ என்னை அழைக்கலாம், அல்லது எனக்கு ஒரு செய்தி அனுப்பலாம்.' }] },

  /* ---------- Gruppe 4: zweiteilige Konnektoren ---------- */
  nicht: { lv: 'B1', note: 'nicht nur … sondern auch (not only … but also).', ex: [
    { de: 'Sie spricht [nicht nur] Deutsch, [sondern auch] Französisch.', en: 'She speaks not only German but also French.', ta: 'அவள் ஜெர்மன் மட்டுமல்ல, பிரெஞ்சும் பேசுவாள்.' },
    { de: 'Das Hotel war [nicht nur] billig, [sondern auch] sehr sauber.', en: 'The hotel was not only cheap but also very clean.', ta: 'ஹோட்டல் மலிவானது மட்டுமல்ல, மிகவும் சுத்தமாகவும் இருந்தது.' },
    { de: 'Ich brauche [nicht nur] meinen Pass, [sondern auch] ein Foto.', en: 'I need not only my passport but also a photo.', ta: 'எனக்கு என் கடவுச்சீட்டு மட்டுமல்ல, ஒரு புகைப்படமும் தேவை.' }] },
  sowohl: { lv: 'B1', note: 'sowohl … als auch (both … and). Zwei Subjekte → Verb im Plural.', ex: [
    { de: 'Ich mag [sowohl] Hunde [als auch] Katzen.', en: 'I like both dogs and cats.', ta: 'எனக்கு நாய்களும் பிடிக்கும், பூனைகளும் பிடிக்கும்.' },
    { de: '[Sowohl] meine Frau [als auch] ich {arbeiten} in einem Krankenhaus.', en: 'Both my wife and I work in a hospital.', ta: 'என் மனைவியும் நானும் ஒரு மருத்துவமனையில் வேலை செய்கிறோம்.' },
    { de: 'Der Kurs ist [sowohl] am Vormittag [als auch] am Abend möglich.', en: 'The course is possible both in the morning and in the evening.', ta: 'வகுப்பு காலையிலும் மாலையிலும் நடக்கும்.' }] },
  weder: { lv: 'B1', note: 'weder … noch (neither … nor) — schon verneint, kein extra nicht!', ex: [
    { de: 'Ich habe [weder] Zeit [noch] Geld.', en: 'I have neither time nor money.', ta: 'எனக்கு நேரமும் இல்லை, பணமும் இல்லை.' },
    { de: 'Er trinkt [weder] Alkohol [noch] Kaffee.', en: 'He drinks neither alcohol nor coffee.', ta: 'அவன் மதுவும் குடிப்பதில்லை, காபியும் குடிப்பதில்லை.' },
    { de: '[Weder] mein Bruder [noch] meine Schwester {wohnt} in Deutschland.', en: 'Neither my brother nor my sister lives in Germany.', ta: 'என் சகோதரனும் ஜெர்மனியில் வசிக்கவில்லை, என் சகோதரியும் வசிக்கவில்லை.' }] },
  zwar: { lv: 'B1', note: 'zwar … aber (admittedly … but). aber = Position 0.', ex: [
    { de: 'Das Auto ist [zwar] alt, [aber] es {fährt} noch gut.', en: 'The car is old, it\'s true, but it still runs well.', ta: 'கார் பழையதுதான், ஆனால் அது இன்னும் நன்றாக ஓடுகிறது.' },
    { de: 'Ich bin [zwar] müde, [aber] ich {komme} mit.', en: 'I\'m tired, admittedly, but I\'ll come along.', ta: 'நான் சோர்வாகத்தான் இருக்கிறேன், ஆனால் உடன் வருகிறேன்.' },
    { de: 'Die Wohnung ist [zwar] klein, [aber] sie {ist} sehr gemütlich.', en: 'The flat is small, it\'s true, but it\'s very cosy.', ta: 'வீடு சிறியதுதான், ஆனால் மிகவும் வசதியாக இருக்கிறது.' }] },
  je: { lv: 'B2', note: 'je … desto / umso (the more … the more). je-Teil: Verb am Ende; desto + Komparativ: Verb sofort.', ex: [
    { de: '[Je] mehr ich {übe}, [desto] besser {spreche} ich.', en: 'The more I practise, the better I speak.', ta: 'நான் எவ்வளவு அதிகம் பயிற்சி செய்கிறேனோ, அவ்வளவு நன்றாகப் பேசுகிறேன்.' },
    { de: '[Je] früher wir {losfahren}, [desto] weniger Verkehr {gibt} es.', en: 'The earlier we set off, the less traffic there is.', ta: 'நாம் எவ்வளவு சீக்கிரம் புறப்படுகிறோமோ, அவ்வளவு குறைவான போக்குவரத்து இருக்கும்.' },
    { de: '[Je] älter man {wird}, [umso] ruhiger {wird} man.', en: 'The older you get, the calmer you become.', ta: 'வயது ஆக ஆக, மனிதர் அமைதியாகிறார்.' }] },
  einerseits: { lv: 'B2', note: 'einerseits … andererseits (on the one hand … on the other). Beide Position 1 → Verb sofort.', ex: [
    { de: '[Einerseits] {verdiene} ich gut, [andererseits] {habe} ich wenig Freizeit.', en: 'On the one hand I earn well, on the other hand I have little free time.', ta: 'ஒருபுறம் நான் நன்றாகச் சம்பாதிக்கிறேன், மறுபுறம் எனக்கு ஓய்வு நேரம் குறைவு.' },
    { de: '[Einerseits] {ist} die Stadt schön, [andererseits] {ist} sie sehr teuer.', en: 'On the one hand the city is beautiful, on the other hand it\'s very expensive.', ta: 'ஒருபுறம் நகரம் அழகானது, மறுபுறம் அது மிகவும் விலை உயர்ந்தது.' },
    { de: 'Ich möchte [einerseits] in Deutschland bleiben, [andererseits] {vermisse} ich meine Familie.', en: 'On the one hand I\'d like to stay in Germany, on the other hand I miss my family.', ta: 'ஒருபுறம் நான் ஜெர்மனியில் இருக்க விரும்புகிறேன், மறுபுறம் என் குடும்பத்தை நினைத்து ஏங்குகிறேன்.' }] }
};
