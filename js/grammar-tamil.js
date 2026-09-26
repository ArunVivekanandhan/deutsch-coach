/* Tamil ↔ German grammar bridges (Task 50) for the Grammatik-Regel-Trainer (keys = GRAMMAR_RULES ids).
   k: 'bridge' = Tamil already works like German here (✅ easy for Tamil speakers)
      'trap'   = Tamil habit that leads to a typical mistake (⚠️)
   de: German example · ta: Tamil example · gloss: word-by-word English of the Tamil · why / why_ta: explanation
   table: optional rows [German, Tamil, English]
   Drafted with AI assistance and checked against standard Tamil grammar (வேற்றுமை உருபுகள், பெயரெச்சம், -படு passive,
   -கொள் reflexive/self-benefactive); shown with 🤖 in the UI. scripts/check_grammar_tamil.py validates the structure. */
window.DC_GRAMMAR_TAMIL = {
  a1_praesens: [
    { k: 'bridge', t: 'Verb endings per person — Tamil does it too',
      de: 'ich gehe · du gehst · er geht', ta: 'நான் போகிறேன் · நீ போகிறாய் · அவன் போகிறான்',
      gloss: 'I go-1sg · you go-2sg · he go-3sg',
      why: 'English only adds -s for he/she. Tamil and German change the verb ending for every person, so you already think this way: -ேன் ≈ -e, -ாய் ≈ -st, -ான் ≈ -t.',
      why_ta: 'தமிழ் வினை நபருக்கு ஏற்ப மாறுவது போல ஜெர்மன் வினையும் மாறும்: ich gehe (போகிறேன்), du gehst (போகிறாய்), er geht (போகிறான்).' },
    { k: 'bridge', t: 'du / Sie = நீ / நீங்கள்',
      de: 'Kommst du? · Kommen Sie?', ta: 'நீ வருகிறாயா? · நீங்கள் வருகிறீர்களா?',
      gloss: 'you(informal) come? · you(respectful) come?',
      why: 'Tamil already separates the familiar நீ and the respectful நீங்கள் — German du and Sie work the same way. Like நீங்கள், Sie is also the plural form.',
      why_ta: 'நண்பர்கள், குடும்பம், குழந்தைகள் → du (நீ); அலுவலகம், அறிமுகமில்லாதவர்கள், அதிகாரிகள் → Sie (நீங்கள்).' }
  ],
  a1_pronomen: [
    { k: 'bridge', t: 'ich · mich · mir = நான் · என்னை · எனக்கு',
      table: [['ich · mich · mir', 'நான் · என்னை · எனக்கு', 'I · me · to me'], ['du · dich · dir', 'நீ · உன்னை · உனக்கு', 'you · you · to you'], ['er · ihn · ihm', 'அவன் · அவனை · அவனுக்கு', 'he · him · to him'], ['wir · uns · uns', 'நாம் · நம்மை · நமக்கு', 'we · us · to us']],
      de: 'Er sieht mich. · Er hilft mir.', ta: 'அவன் என்னைப் பார்க்கிறான். · அவன் எனக்கு உதவுகிறான்.',
      gloss: 'he me-ACC sees · he me-DAT helps',
      why: 'Tamil -ஐ (என்னை) = German Akkusativ (mich); Tamil -க்கு (எனக்கு) = German Dativ (mir). If you can say it in Tamil, you know which German form to use.',
      why_ta: 'என்னை → mich (Akkusativ), எனக்கு → mir (Dativ). தமிழ் உருபே சரியான ஜெர்மன் வடிவத்தைக் காட்டும்.' },
    { k: 'trap', t: 'Possessive mein changes — Tamil என் never does',
      de: 'mein Vater · meine Mutter · mit meinem Vater', ta: 'என் அப்பா · என் அம்மா · என் அப்பாவுடன்',
      gloss: 'my father · my mother · my father-with',
      why: 'Tamil என் stays the same; German mein takes the endings of ein (meine, meinen, meinem, meiner) depending on gender and case.',
      why_ta: 'தமிழில் „என்“ மாறாது; ஜெர்மனில் mein → meine / meinen / meinem என மாறும்.' }
  ],
  a1_negation: [
    { k: 'bridge', t: 'nicht goes towards the end — like இல்லை',
      de: 'Ich komme heute nicht.', ta: 'நான் இன்று வரவில்லை / வரமாட்டேன்.',
      gloss: 'I today come-not',
      why: 'Tamil puts the negation at the end (வரவில்லை, இல்லை). German nicht also tends to the end of the sentence — but before adjectives, place phrases and the second verb part.',
      why_ta: 'தமிழில் „இல்லை“ கடைசியில் வருவது போல „nicht“ பெரும்பாலும் வாக்கியத்தின் இறுதியில் வரும்.' },
    { k: 'trap', t: 'Doch! = "yes (it is)" to a negative question',
      de: 'Hast du keinen Hunger? – Doch!', ta: 'உனக்குப் பசிக்கவில்லையா? – பசிக்கிறதே!',
      gloss: 'to-you hungry-not? – (it) is hungry!',
      why: 'A Tamil "ஆமாம்" after a negative question can mean "yes, I am not hungry". In German "Ja" is wrong here — say "Doch" when you mean the positive, "Nein" when you agree with the negation.',
      why_ta: 'எதிர்மறைக் கேள்விக்கு „ஆம், பசிக்கிறது“ என்று சொல்ல ஜெர்மனில் „Doch!“; „Ja“ தவறு.' }
  ],
  a1_fragen: [
    { k: 'trap', t: 'Tamil adds -ஆ, German moves the verb to the front',
      de: 'Kommst du morgen?', ta: 'நீ நாளை வருகிறாயா?',
      gloss: 'you tomorrow come-?',
      why: 'Tamil keeps the word order and adds -ஆ. German yes/no questions start with the verb: "Du kommst morgen?" (only with question intonation) is informal; the standard form is "Kommst du morgen?".',
      why_ta: 'தமிழில் „-ஆ“ சேர்த்தால் கேள்வி; ஜெர்மனில் வினையை முதலில் வைக்க வேண்டும்: Kommst du …?' }
  ],
  a1_zahlen_zeit: [
    { k: 'trap', t: 'einundzwanzig = "one-and-twenty" — Tamil says இருபத்தொன்று (twenty-one)',
      de: 'einundzwanzig (21) · siebenundvierzig (47)', ta: 'இருபத்தொன்று · நாற்பத்தேழு',
      gloss: 'twenty-one · forty-seven',
      why: 'Tamil and English say the tens first; German says the units first. Write the unit digit first when you hear a number: sieben-und-vierzig → 7 … 4 → 47.',
      why_ta: 'தமிழில் பத்துகள் முதலில் (நாற்பத்தேழு); ஜெர்மனில் ஒன்றுகள் முதலில்: sieben + und + vierzig = 47.' },
    { k: 'trap', t: 'halb drei = 2:30, not "two and a half" towards three',
      de: 'Es ist halb drei.', ta: 'மணி இரண்டரை.',
      gloss: 'o\'clock two-and-a-half',
      why: 'Tamil இரண்டரை counts from 2. German "halb drei" counts towards 3 ("half way to three") — it is the same time, 2:30, but the number is ONE HIGHER.',
      why_ta: '„halb drei“ = இரண்டரை மணி (2:30). ஜெர்மனில் அடுத்த மணியைச் சொல்வார்கள் — „drei“ என்றாலும் நேரம் 2:30!' }
  ],
  a1_modalverben: [
    { k: 'bridge', t: 'kommen kann / fahren muss = வர முடியும் / போக வேண்டும்',
      de: '…, weil ich morgen arbeiten muss.', ta: 'நான் நாளை வேலை செய்ய வேண்டும்.',
      gloss: 'I tomorrow work do must',
      why: 'Tamil puts the main verb before the "modal" (செய்ய வேண்டும் = do must, வர முடியும் = come can). German does the same at the end of the sentence: arbeiten muss, kommen kann.',
      why_ta: 'வேண்டும் = müssen, முடியும் = können, கூடாது = nicht dürfen — முக்கிய வினை முதலில், modal பின்னால்: „arbeiten muss“.' }
  ],
  a1_imperativ: [
    { k: 'bridge', t: 'Komm! / Kommen Sie! = வா! / வாருங்கள்!',
      de: 'Komm her! · Kommen Sie bitte herein!', ta: 'இங்கே வா! · தயவுசெய்து உள்ளே வாருங்கள்!',
      gloss: 'here come! · please inside come(respectful)!',
      why: 'Tamil has a short command (வா) and a respectful one (வாருங்கள்) — exactly German du-imperative (Komm!) and Sie-imperative (Kommen Sie!).',
      why_ta: 'நண்பருக்கு → Komm! (வா); மரியாதையாக → Kommen Sie! (வாருங்கள்).' }
  ],
  a2_komparation: [
    { k: 'bridge', t: 'größer als er = அவனை விட உயரம்',
      de: 'Ich bin größer als mein Bruder.', ta: 'நான் என் அண்ணனை விட உயரம்.',
      gloss: 'I my brother-ACC than tall',
      why: 'Tamil marks the person you compare with using -ஐ விட ("than"). German uses als after the comparative: größer als. For "as … as" Tamil uses போல, German so … wie.',
      why_ta: '„-ஐ விட“ = „als“ (größer als); „போல“ = „so … wie“ (so groß wie).' }
  ],
  a2_dativverben: [
    { k: 'bridge', t: 'Es gefällt mir = எனக்குப் பிடிக்கும் (the person is Dativ in both)',
      de: 'Das Essen schmeckt mir. · Mir tut der Kopf weh.', ta: 'எனக்கு உணவு ருசிக்கிறது. · எனக்குத் தலை வலிக்கிறது.',
      gloss: 'to-me food tastes · to-me head aches',
      why: 'English makes the person the subject ("I like", "I have a headache"). Tamil and German put the person in the dative (எனக்கு = mir) and the thing is the subject.',
      why_ta: 'எனக்கு பிடிக்கும் / ருசிக்கிறது / வலிக்கிறது → mir gefällt / schmeckt / tut weh.' }
  ],
  b1_plusquam_futur: [
    { k: 'bridge', t: 'war gekommen = வந்திருந்தான்',
      de: 'Als ich ankam, war er schon gegangen.', ta: 'நான் வந்தபோது, அவன் ஏற்கனவே போயிருந்தான்.',
      gloss: 'I came-when, he already had-gone',
      why: 'Tamil has a past-perfect form (-இருந்தான்) for something that happened before another past event — exactly the German Plusquamperfekt (hatte/war + Partizip II).',
      why_ta: '„போயிருந்தான்“ (கடந்த காலத்துக்கு முன்) = „war gegangen“ — Plusquamperfekt.' }
  ],
  b1_lassen: [
    { k: 'bridge', t: 'reparieren lassen = பழுது பார்க்க வை (-வை = have someone do it)',
      de: 'Ich lasse mein Auto reparieren.', ta: 'நான் என் காரைப் பழுது பார்க்க வைக்கிறேன்.',
      gloss: 'I my car-ACC repair make-do',
      why: 'Tamil uses வை / செய் to say that someone else does the action for you. German uses lassen + infinitive, and the order at the end is the same: reparieren lassen = பழுது பார்க்க வை.',
      why_ta: 'மற்றவரைச் செய்ய வைப்பது: தமிழில் „-க்க வை“, ஜெர்மனில் „lassen“: Ich lasse … reparieren.' }
  ],
  r1_wordorder: [
    { k: 'bridge', t: 'Nebensatz & Satzklammer: the verb goes last — like in Tamil',
      de: '…, weil ich morgen nach Chennai fahren muss.', ta: 'நான் நாளை சென்னைக்குப் போக வேண்டும்.',
      gloss: 'I · tomorrow · to-Chennai · go · must',
      why: 'Tamil always puts the verb at the end — even in the same order as German: "fahren muss" = "போக வேண்டும்" (go + must). After weil/dass/wenn, German follows the Tamil order word for word.',
      why_ta: 'தமிழில் வினை எப்போதும் கடைசியில். ஜெர்மன் துணை வாக்கியத்திலும் (weil, dass, wenn …) வினை கடைசியில்: „fahren muss“ = „போக வேண்டும்“ — அதே வரிசை!' },
    { k: 'trap', t: 'Main clause: the conjugated verb is 2nd — not last',
      de: 'Morgen fahre ich nach Chennai.', ta: 'நாளை நான் சென்னைக்குப் போகிறேன்.',
      gloss: 'tomorrow · I · to-Chennai · go',
      why: 'The Tamil habit "verb at the end" is right for the Nebensatz and for the second part of the bracket (Partizip / Infinitiv), but wrong for the conjugated verb of a main clause: not *"Morgen ich nach Chennai fahre".',
      why_ta: 'முதன்மை வாக்கியத்தில் (Hauptsatz) மாறும் வினை 2-ஆம் இடத்தில். தமிழ் போல் கடைசியில் வைத்தால் தவறு.' }
  ],
  r2_cases: [
    { k: 'bridge', t: 'Dativ = Tamil -க்கு — also for "I like", "I am cold", "it hurts"',
      de: 'Mir ist kalt. · Das gefällt mir. · Mir tut der Kopf weh.', ta: 'எனக்குக் குளிர்கிறது. · எனக்கு அது பிடிக்கும். · எனக்குத் தலை வலிக்கிறது.',
      gloss: 'to-me cold-is · to-me that is-liked · to-me head aches',
      why: 'English says "I am cold / I like it". Tamil and German both put the person in the dative: எனக்கு = mir, உனக்கு = dir. When your Tamil sentence starts with எனக்கு, the German one usually has mir.',
      why_ta: '„எனக்கு …“ என்று தொடங்கும் தமிழ் வாக்கியம் ஜெர்மனில் பெரும்பாலும் „mir …“ (Dativ): எனக்குப் பிடிக்கும் = Das gefällt mir.' },
    { k: 'bridge', t: 'Akkusativ = -ஐ · Genitiv = -இன் / -உடைய',
      de: 'Ich sehe den Hund. · das Auto meines Bruders', ta: 'நான் நாயைப் பார்க்கிறேன். · என் அண்ணனுடைய கார்',
      gloss: 'I dog-ACC see · my (elder) brother\'s car',
      why: 'Same idea, different place: Tamil marks the case at the END of the noun (நாய் + ஐ), German mostly on the ARTICLE (der → den, des). Look at the article.',
      why_ta: 'தமிழில் வேற்றுமை உருபு பெயரின் கடைசியில் (நாய் + ஐ); ஜெர்மனில் பெரும்பாலும் article மாறும் (der → den).' }
  ],
  r3_prepositions: [
    { k: 'bridge', t: 'Wo? = -இல் (Dativ) · Wohin? = -க்கு (Akkusativ)',
      de: 'Ich bin im Haus. (Wo? → Dativ) · Ich gehe ins Haus. (Wohin? → Akkusativ)', ta: 'நான் வீட்டில் இருக்கிறேன். · நான் வீட்டுக்குப் போகிறேன்.',
      gloss: 'I house-in am · I house-to go',
      why: 'Tamil already separates "where" (-இல்) from "where to" (-க்கு). German two-way prepositions do the same with the case: location → Dativ (im, auf dem), direction → Akkusativ (ins, auf den).',
      why_ta: 'இருக்கும் இடம் (-இல்) → Dativ; போகும் திசை (-க்கு) → Akkusativ. தமிழ் உருபு சொல்வதையே ஜெர்மன் வேற்றுமை சொல்கிறது.' },
    { k: 'bridge', t: 'mit + Dativ = -உடன் (person) / -ஆல் (tool)',
      de: 'Ich fahre mit meinem Freund. · Ich schreibe mit dem Stift.', ta: 'நான் என் நண்பனுடன் போகிறேன். · நான் பேனாவால் எழுதுகிறேன்.',
      gloss: 'I my friend-with go · I pen-with write',
      why: 'Tamil has two "with" endings; German uses mit for both — and mit is always followed by the Dativ.',
      why_ta: '-உடன் (ஒருவருடன்), -ஆல் (கருவியால்) — இரண்டுக்கும் ஜெர்மனில் „mit“ + Dativ.' }
  ],
  r4_adjectives: [
    { k: 'trap', t: 'Tamil adjectives never change — German ones do',
      de: 'ein neuer Wagen · ein neues Haus · mit einer neuen Tasche', ta: 'புதிய கார் · புதிய வீடு · புதிய பையுடன்',
      gloss: 'new car · new house · new bag-with',
      why: 'In Tamil "புதிய" stays the same before every noun. In German the ending depends on the article, gender and case (-e / -er / -es / -en / -em). Learn every noun with its article, then use the table above.',
      why_ta: 'தமிழில் „புதிய“ மாறாது; ஜெர்மனில் பெயரடையின் முடிவு article, பால், வேற்றுமையைப் பொறுத்து மாறும்.' }
  ],
  r5_konjunktiv: [
    { k: 'bridge', t: 'Unreal past: -இருந்திருந்தால் … -இருப்பேன் = hätte … wäre',
      de: 'Wenn ich Zeit gehabt hätte, wäre ich gekommen.', ta: 'எனக்கு நேரம் இருந்திருந்தால், நான் வந்திருப்பேன்.',
      gloss: 'to-me time had-been-if, I would-have-come',
      why: 'Tamil has a special form for "if it had happened (but it didn\'t)". German expresses exactly this with Konjunktiv II of the past: hätte / wäre + Partizip II.',
      why_ta: '„…இருந்திருந்தால் … வந்திருப்பேன்“ (நடக்காத கடந்த காலம்) = Konjunktiv II Vergangenheit: hätte / wäre + Partizip II.' },
    { k: 'bridge', t: 'Polite request: …முடியுமா? = Könnten Sie …?',
      de: 'Könnten Sie mir bitte helfen?', ta: 'தயவுசெய்து எனக்கு உதவ முடியுமா?',
      gloss: 'please · to-me · help · is-it-possible?',
      why: 'Tamil softens a request with முடியுமா; German uses Konjunktiv II (könnten, würden, hätte gern). A plain imperative ("Helfen Sie mir!") sounds rude to strangers.',
      why_ta: 'மரியாதையான கேள்வி: தமிழில் „… முடியுமா?“, ஜெர்மனில் „Könnten Sie …?“ / „Würden Sie …?“.' }
  ],
  r6_passiv: [
    { k: 'bridge', t: '-ப்பட்டது = wurde … gebaut (and the same order in a Nebensatz)',
      de: 'Das Haus wurde 1990 gebaut. · …, dass das Haus 1990 gebaut wurde.', ta: 'அந்த வீடு 1990-இல் கட்டப்பட்டது.',
      gloss: 'that house 1990-in build-PASSIVE-was',
      why: 'Tamil builds the passive with படு: கட்ட + பட்டது (built + was). In a German Nebensatz the order is identical: "gebaut wurde" = கட்டப்பட்டது.',
      why_ta: 'தமிழ் செயப்பாட்டு வினை: கட்ட + பட்டது. ஜெர்மன் Passiv: wurde + Partizip II; துணை வாக்கியத்தில் „gebaut wurde“ — அதே வரிசை.' }
  ],
  r7_relativsatz: [
    { k: 'trap', t: 'Tamil puts the description BEFORE the noun — German after it',
      de: 'der Mann, der gestern gekommen ist', ta: 'நேற்று வந்த மனிதர்',
      gloss: 'yesterday came(-who) man',
      why: 'Tamil has no relative pronoun: the description stands before the noun. German puts it after the noun, after a comma, starting with der / die / das — but the verb at the end ("gekommen ist") still matches your Tamil instinct.',
      why_ta: 'தமிழில் விவரம் பெயருக்கு முன் (நேற்று வந்த மனிதர்). ஜெர்மனில் பெயருக்குப் பின்: காற்புள்ளி + der/die/das; வினை கடைசியில் — தமிழ் போலவே.' }
  ],
  r8_infinitiv: [
    { k: 'bridge', t: 'um … zu = -க்க / -வதற்காக (object first, verb last)',
      de: 'Ich bin nach Deutschland gekommen, um Deutsch zu lernen.', ta: 'ஜெர்மன் கற்க நான் ஜெர்மனிக்கு வந்தேன்.',
      gloss: 'German to-learn I to-Germany came',
      why: '"Deutsch zu lernen" and "ஜெர்மன் கற்க" have the same order: first the object, then the verb with its purpose marker.',
      why_ta: '„Deutsch zu lernen“ = „ஜெர்மன் கற்க“ — பொருள் முதலில், வினை கடைசியில்.' }
  ],
  r9_connectors: [
    { k: 'bridge', t: 'sowohl … als auch = -உம் … -உம் · weder … noch = -உம் இல்லை … -உம் இல்லை',
      de: 'Er spricht sowohl Tamil als auch Deutsch. · Ich habe weder Zeit noch Geld.', ta: 'அவர் தமிழும் ஜெர்மனும் பேசுவார். · என்னிடம் நேரமும் இல்லை, பணமும் இல்லை.',
      gloss: 'he Tamil-and German-and speaks · with-me time-also not, money-also not',
      why: 'Tamil marks "both" with -உம் on each word; German puts a two-part connector around the two words.',
      why_ta: 'தமிழில் இரண்டு சொற்களிலும் „-உம்“; ஜெர்மனில் „sowohl … als auch“ / „weder … noch“.' }
  ],
  r10_reflexiv: [
    { k: 'bridge', t: 'mich / mir = என்னை / எனக்கு — Tamil makes the same Akkusativ/Dativ split',
      table: [['mich · mir', 'என்னை · எனக்கு', 'myself'], ['dich · dir', 'உன்னை · உனக்கு', 'yourself'], ['sich · sich', 'தன்னை · தனக்கு', 'himself / herself / itself'],
        ['uns · uns', 'நம்மை · நமக்கு (எங்களை · எங்களுக்கு)', 'ourselves'], ['euch · euch', 'உங்களை · உங்களுக்கு', 'yourselves'], ['sich · sich (Sie)', 'தங்களை · தங்களுக்கு', 'themselves / yourself (formal)']],
      de: 'Ich sehe mich im Spiegel. · Ich kaufe mir ein Handy.', ta: 'நான் என்னைக் கண்ணாடியில் பார்க்கிறேன். · நான் எனக்கு ஒரு போன் வாங்குகிறேன்.',
      gloss: 'I myself-ACC mirror-in see · I myself-DAT a phone buy',
      why: 'Where Tamil says என்னை (-ஐ), German says mich (Akkusativ); where Tamil says எனக்கு (-க்கு, "for myself"), German says mir (Dativ). Like Tamil தன்னை/தனக்கு, German has one special word for the 3rd person: sich.',
      why_ta: 'என்னை (-ஐ) → mich (Akkusativ); எனக்கு (-க்கு) → mir (Dativ). தன்னை / தனக்கு போல ஜெர்மனில் 3-ஆம் நபருக்கு ஒரே சொல்: sich.' },
    { k: 'bridge', t: 'sich waschen ≈ கழுவிக்கொள் (-கொள் = for / to myself)',
      de: 'Ich wasche mir die Hände. · Ich ziehe mich an.', ta: 'நான் கை கழுவிக்கொள்கிறேன். · நான் உடை அணிந்துகொள்கிறேன்.',
      gloss: 'I hand wash-for-myself · I clothes put-on-for-myself',
      why: 'Tamil adds -கொள் when you do something to or for yourself. Very often German has a reflexive verb in exactly those places (sich waschen, sich anziehen, sich vorbereiten).',
      why_ta: 'தனக்குத் தானே செய்யும் செயல்: தமிழில் „-கொள்“, ஜெர்மனில் பெரும்பாலும் „sich“ (mich / mir).' }
  ],
  r12_comma: [
    { k: 'trap', t: 'German ALWAYS needs a comma before dass / weil / ob / wenn',
      de: 'Ich weiß, dass du müde bist.', ta: 'நீ களைப்பாக இருக்கிறாய் என்று எனக்குத் தெரியும்.',
      gloss: 'you tired are that to-me known',
      why: 'Tamil links the clause with என்று and no comma; English often skips it too. In German the comma before a Nebensatz (dass, weil, ob, wenn, der/die/das …) is compulsory — and the verb goes to the end, just like before என்று.',
      why_ta: 'ஜெர்மனில் dass, weil, wenn, ob … முன் காற்புள்ளி கட்டாயம். „என்று“ முன் வினை கடைசியில் இருப்பது போல, dass-வாக்கியத்திலும் வினை கடைசியில்.' }
  ],
  r14_pronominaladverb: [
    { k: 'bridge', t: 'worauf / darauf = எதற்கு / அதற்கு (question/that + ending glued together)',
      de: 'Worauf wartest du? – Ich warte darauf.', ta: 'நீ எதற்காகக் காத்திருக்கிறாய்? – நான் அதற்காகக் காத்திருக்கிறேன்.',
      gloss: 'you what-for wait? – I that-for wait',
      why: 'Tamil glues the case ending onto "what / that" (எது + க்கு → எதற்கு, அது + க்கு → அதற்கு). German glues the preposition onto wo- / da-: wo + auf → worauf, da + auf → darauf.',
      why_ta: 'தமிழ்: எது + க்கு = எதற்கு; ஜெர்மன்: wo + auf = worauf, da + auf = darauf.' }
  ],
  r15_temporale: [
    { k: 'bridge', t: 'als = -போது · immer wenn = -போதெல்லாம் · nachdem = -த பிறகு · bevor = -வதற்கு முன்',
      de: 'Als ich ein Kind war, … · Nachdem ich gegessen habe, … · Bevor ich schlafe, …', ta: 'நான் சிறுவனாக இருந்தபோது … · நான் சாப்பிட்ட பிறகு … · நான் தூங்குவதற்கு முன் …',
      gloss: 'I child was-when · I ate-after · I sleeping-before',
      why: 'Tamil puts the time word after the verb, German puts the connector first — but in both languages the verb closes the clause ("als ich ein Kind war"). Once in the past = als (-போது); every time = wenn (-போதெல்லாம்).',
      why_ta: 'கடந்த காலத்தில் ஒருமுறை → „als“ (-போது); ஒவ்வொரு முறையும் → „wenn“ (-போதெல்லாம்). இரண்டு மொழியிலும் வினை வாக்கியத்தின் கடைசியில்.' }
  ],
  r16_modalverb: [
    { k: 'bridge', t: 'muss nicht ≠ darf nicht — Tamil keeps them apart too',
      de: 'Du musst nicht kommen. · Du darfst hier nicht rauchen.', ta: 'நீ வர வேண்டியதில்லை. · நீ இங்கே புகைபிடிக்கக் கூடாது.',
      gloss: 'you come need-not · you here smoke must-not',
      why: 'English "must not" misleads (it means darf nicht). Tamil separates them like German: வேண்டியதில்லை = muss nicht / braucht nicht zu; கூடாது = darf nicht.',
      why_ta: 'வேண்டியதில்லை = muss nicht; கூடாது = darf nicht — தமிழ் போலவே ஜெர்மனும் பிரிக்கிறது.' }
  ],
  r17_indirekte_rede: [
    { k: 'bridge', t: 'Reported speech: Tamil marks it with என்று, German with the verb form (sei, habe)',
      de: 'Er sagte, er sei krank.', ta: 'அவர் உடம்பு சரியில்லை என்று சொன்னார்.',
      gloss: 'he body not-well that said',
      why: 'Tamil shows "he says so, not me" with என்று; formal German shows it with Konjunktiv I (sei, habe, könne). In everyday speech Germans often use the indicative or würde instead.',
      why_ta: '„… என்று சொன்னார்“ = ஜெர்மனில் Konjunktiv I (sei, habe) — „அவர் சொன்னது, நான் அல்ல“ என்பதைக் காட்டுகிறது.' }
  ],
  r18_partizipialattribute: [
    { k: 'bridge', t: 'Extended participle = Tamil பெயரெச்சம் (identical order!)',
      de: 'der gestern angekommene Zug · die in Chennai geborene Ärztin', ta: 'நேற்று வந்த ரயில் · சென்னையில் பிறந்த டாக்டர்',
      gloss: 'yesterday arrived train · Chennai-in born doctor',
      why: 'English speakers find this B2 structure hard. For Tamil speakers it is natural: all details come before the noun and the participle stands right before it — exactly like வந்த ரயில்.',
      why_ta: 'B2 „Partizipialattribut“ = தமிழின் பெயரெச்சம்: விவரம் முன்னால், பெயரெச்சம் பெயருக்கு நேராக முன் — ஒரே வரிசை!' }
  ],
  r19_doppelkonjunktionen: [
    { k: 'bridge', t: 'je … desto = எவ்வளவு … அவ்வளவு',
      de: 'Je mehr du liest, desto besser sprichst du.', ta: 'எவ்வளவு அதிகம் படிக்கிறாயோ, அவ்வளவு நன்றாகப் பேசுவாய்.',
      gloss: 'how-much more you-read, that-much well you-will-speak',
      why: 'Tamil has the same two-part pattern. Watch the German word order: in the je-part the verb goes to the end, in the desto-part the verb comes right after the comparative.',
      why_ta: '„எவ்வளவு … அவ்வளவு“ = „je … desto“. je-பகுதியில் வினை கடைசியில்; desto-பகுதியில் வினை உடனே.' }
  ],
  r20_nominalisierung: [
    { k: 'bridge', t: 'das Lernen = கற்றல் / கற்பது',
      de: 'Das Lernen macht Spaß. · beim Kochen', ta: 'கற்றல் மகிழ்ச்சி தருகிறது. · சமைக்கும்போது',
      gloss: 'learning joy gives · cooking-while',
      why: 'Tamil turns verbs into nouns with -தல் / -வது (கற்றல், படிப்பது). German capitalises the infinitive and adds das: das Lernen, das Lesen — always neuter.',
      why_ta: 'வினையைப் பெயராக்க: தமிழில் -தல் / -வது; ஜெர்மனில் das + பெரிய எழுத்தில் infinitive (das Lernen).' }
  ],
  r21_genitivpraepositionen: [
    { k: 'trap', t: 'wegen = காரணமாக — but German puts it BEFORE the noun',
      de: 'Wegen des Regens bleibe ich zu Hause. · Trotz des Regens gehe ich spazieren.', ta: 'மழை காரணமாக நான் வீட்டில் இருக்கிறேன். · மழை இருந்தும் நான் நடக்கப் போகிறேன்.',
      gloss: 'rain because-of I house-in stay · rain despite I walk go',
      why: 'Tamil puts "because of / despite" AFTER the noun (postposition). German puts wegen / trotz BEFORE it, and the noun goes into the Genitiv: des Regens.',
      why_ta: 'தமிழில் „காரணமாக“ பெயருக்குப் பின்; ஜெர்மனில் „wegen“ பெயருக்கு முன் + Genitiv (des Regens).' }
  ]
};
