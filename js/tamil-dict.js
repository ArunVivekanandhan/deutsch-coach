const NOUN_MNEMONIC_DB = {
  "fußgängerzone": {
    image: "Imagine a giant, friendly cartoon FOOT walking peacefully down a wide cobblestone street where all cars and traffic are strictly forbidden.",
    breakdown: ["Fuß (foot)", "Gänger (walker)", "Zone (zone)"],
    breakdownEn: "FOOT-WALKER ZONE",
    emojiScene: "🚶🚶🚶 People walking + 🚫🚗 No cars → Fußgängerzone",
    punch: "DIE + FOOT + WALKER + ZONE → die Fußgängerzone"
  },
  "wohnung": {
    image: "Imagine relaxing in your cozy APARTMENT where you 'WON' (wohn-) ultimate peace, quiet, and independence.",
    breakdown: ["Wohnen (to live/reside)", "-ung (noun suffix)"],
    breakdownEn: "LIVING PLACE / FLAT",
    emojiScene: "🛋️ Cozy home + 🔑 Private key → die Wohnung",
    punch: "DIE + WOHNEN (-ung) → die Wohnung"
  },
  "mädchen": {
    image: "Imagine a little cheerful girl wearing a red coat. The diminutive suffix '-chen' shrinks everything into cute NEUTER (das)!",
    breakdown: ["Magd (young maiden/girl)", "-chen (little/diminutive)"],
    breakdownEn: "LITTLE MAIDEN / GIRL",
    emojiScene: "👧 Little girl + 🎀 Small diminutive (-chen) → das Mädchen",
    punch: "DAS + MÄD- + -CHEN → das Mädchen"
  },
  "apfel": {
    image: "Imagine biting into a crisp, juicy red APPLE that makes a loud 'CRUNCH'! The singular 'A' flips into 'Ä' for plural (Äpfel).",
    breakdown: ["Apfel (Germanic apple)"],
    breakdownEn: "CRISP RED APPLE",
    emojiScene: "🍎 Crisp apple + 🌳 Fruit tree → der Apfel",
    punch: "DER + APPLE (A → Ä) → der Apfel"
  },
  "kind": {
    image: "Imagine a happy young CHILD playing kindly with wooden building blocks.",
    breakdown: ["Kind (kin / child)"],
    breakdownEn: "YOUNG CHILD",
    emojiScene: "👶 Happy child + 🧸 Toys (-er plural) → das Kind",
    punch: "DAS + KIND (+er) → das Kind"
  },
  "auto": {
    image: "Imagine a sleek, shiny blue sports CAR zooming down the German Autobahn. Ends in '-o' like Kino/Foto → neuter DAS!",
    breakdown: ["Auto (automobile / self-moving)"],
    breakdownEn: "MOTOR VEHICLE / CAR",
    emojiScene: "🚗 Fast car + 🛣️ Autobahn → das Auto",
    punch: "DAS + AUTO (+s) → das Auto"
  },
  "schlüssel": {
    image: "Imagine turning a solid silver KEY that goes 'CLICK' to close and lock (schließen) your front door safely.",
    breakdown: ["Schließen (to lock/close)", "-el (tool suffix)"],
    breakdownEn: "LOCKING TOOL / KEY",
    emojiScene: "🗝️ Silver key + 🔒 Secure lock → der Schlüssel",
    punch: "DER + SCHLIESSEN TOOL → der Schlüssel"
  },
  "lampe": {
    image: "Imagine switching on an elegant glowing bedside LAMP that illuminates the whole dark room in warm light.",
    breakdown: ["Lampe (light fixture)"],
    breakdownEn: "GLOWING LIGHT LAMP",
    emojiScene: "💡 Glowing lamp + 🛏️ Bedside table → die Lampe",
    punch: "DIE + LAMP (-e) → die Lampe"
  },
  "buch": {
    image: "Imagine opening an ancient leather-bound BOOK filled with magical stories and glowing letters. Plural adds umlaut: Bücher!",
    breakdown: ["Buch (beech wood tablet / book)"],
    breakdownEn: "BOUND BOOK",
    emojiScene: "📖 Open book + 📚 Library shelf → das Buch",
    punch: "DAS + BOOK (u → ü + er) → das Buch"
  },
  "möglichkeit": {
    image: "Imagine a golden master key unlocking multiple glowing doors of endless OPPORTUNITY and possibility. Suffix '-keit' is 100% DIE!",
    breakdown: ["Möglich (possible)", "-keit (quality / state)"],
    breakdownEn: "STATE OF POSSIBILITY / OPTION",
    emojiScene: "🚪 Open doors + ✨ Endless choices → die Möglichkeit",
    punch: "DIE + MÖGLICH + -KEIT → die Möglichkeit"
  },
  "arbeitsplatz": {
    image: "Imagine walking into your modern office and sitting at your dedicated WORK DESK equipped with monitor, notebook, and coffee.",
    breakdown: ["Arbeit (work)", "s (connector)", "Platz (place / spot)"],
    breakdownEn: "WORK PLACE / JOB SPOT",
    emojiScene: "💼 Work tasks + 🖥️ Office desk → der Arbeitsplatz",
    punch: "DER + ARBEIT + PLATZ → der Arbeitsplatz"
  },
  "fahrkartenautomat": {
    image: "Imagine standing on the train platform tapping the touchscreen of a tall, red TICKET VENDING MACHINE to buy your train pass.",
    breakdown: ["Fahrkarte (travel ticket)", "n (connector)", "Automat (vending machine)"],
    breakdownEn: "TRAVEL-TICKET MACHINE",
    emojiScene: "🎫 Train ticket + 🤖 Dispenser machine → der Fahrkartenautomat",
    punch: "DER + FAHRKARTE + AUTOMAT → der Fahrkartenautomat"
  },
  "krankenhaus": {
    image: "Imagine a large, modern hospital building where dedicated doctors and nurses help sick people recover.",
    breakdown: ["Kranken (sick people/patients)", "Haus (building/house)"],
    breakdownEn: "SICK-PEOPLE HOUSE / HOSPITAL",
    emojiScene: "🏥 Hospital building + 🩺 Doctors caring → das Krankenhaus",
    punch: "DAS + KRANKEN + HAUS → das Krankenhaus"
  }
};

const VERB_MNEMONIC_DB = {
  "wissen": {
    anchor: "Wisdom / Wizard",
    image: "Imagine a wise old wizard with a glowing beard who knows every single fact, statistic, and secret in the universe.",
    lock: "Facts, data, addresses, numbers, or clauses with 'dass / wie / wo / was / warum' = WIZARD = Wissen!",
    situations: [
      "Asking for factual data: 'Weißt du die Telefonnummer / die Uhrzeit?'",
      "Knowing that something happened: 'Ich weiß, dass er heute kommt.'",
      "Saying 'I don't know' to a question: 'Ich weiß es nicht.'"
    ],
    family: { noun: "das Wissen (knowledge/facts)", adj: "wissbegierig (eager to learn), wissenschaftlich (scientific)", related: "das Gewissen (conscience)" },
    story: "The wise Wizard flips through his ancient encyclopedia to find the exact fact.",
    punch: "WISSEN = WIZARD → FACTUAL KNOWLEDGE / DATA",
    prep: "wissen über (+ Akk) / von (+ Dat)",
    confusion: { target: "kennen", rule: "Use WISSEN for facts/info/dass-clauses (Ich weiß, wer er ist); use KENNEN for people, cities, and familiarity (Ich kenne ihn)." },
    sentences: [
      { de: "Ich weiß die Antwort [fact], aber ich kenne die Person nicht.", en: "I know the answer [fact], but I don't know the person." },
      { de: "Weißt du, wo der Bahnhof ist?", en: "Do you know where the train station is? [question word]" },
      { de: "Er hat schon immer alles besser gewusst.", en: "He has always known everything better." }
    ],
    quiz: {
      cloze: "Ich ___ (know [fact]), dass der Deutschkurs um 9 Uhr beginnt.",
      clozeAns: "weiß",
      mc: "When do you use 'wissen' instead of 'kennen'?",
      mcOpts: ["Talking about your best friend", "Stating a fact or answering with 'dass...'", "Visiting a foreign city"],
      mcAns: "Stating a fact or answering with 'dass...'",
      transform: "wissen → wusste → hat gewusst (Mixed Verb: i → u + regular -te/-t)"
    }
  },
  "kennen": {
    anchor: "Ken (Barbie doll / Familiar Person)",
    image: "Imagine meeting the famous Ken doll in Berlin. He is a person you are personally acquainted with.",
    lock: "People, places, cities, songs, movies, or familiarity = KEN = Kennen!",
    situations: [
      "Knowing a person personally: 'Kennst du meinen Bruder Tom?'",
      "Familiarity with a city or country: 'Ich kenne Berlin sehr gut.'",
      "Knowing a song, book, or brand: 'Kennst du dieses Lied?'"
    ],
    family: { noun: "die Kenntnis (knowledge/skill), das Kennen", adj: "bekannt (famous/well-known), unbekannt (unknown)", related: "kennenlernen (to get to know), die Bekanntschaft" },
    story: "You bump into Ken the doll on Alexanderplatz and greet him as an old friend.",
    punch: "KENNEN = KEN DOLL → FAMILIAR PERSON / PLACE",
    prep: "kennen + Akkusativ (direct person/place)",
    confusion: { target: "wissen", rule: "Use KENNEN for people & places (Ich kenne Tom); use WISSEN for facts (Ich weiß, wo Tom wohnt)." },
    sentences: [
      { de: "Ich kenne diese Stadt sehr gut.", en: "I know this city very well [place]." },
      { de: "Kennst du den neuen Kollegen?", en: "Do you know the new colleague? [person]." },
      { de: "Wir haben uns früher gut gekannt.", en: "We knew each other well in the past." }
    ],
    quiz: {
      cloze: "___ du den neuen Lehrer schon?",
      clozeAns: "Kennst",
      mc: "Which sentence correctly uses 'kennen'?",
      mcOpts: ["Ich kenne, wie spät es ist.", "Ich kenne Herrn Müller schon lange.", "Ich kenne, dass er krank ist."],
      mcAns: "Ich kenne Herrn Müller schon lange.",
      transform: "kennen → kannte → hat gekannt (Mixed Verb: e → a + regular -te/-t)"
    }
  },
  "schädigen": {
    anchor: "Shady (Shady vandal causing damage)",
    image: "Imagine a shady character in a dark hooded jacket sneaking around a parking lot scratching and damaging car paint.",
    lock: "Doing harm, inflicting damage, or hurting health/reputation = SHADY = Schädigen!",
    situations: [
      "Health / Lifestyle: 'Rauchen schädigt die Lunge und das Herz.'",
      "Reputation / Business: 'Der Skandal schädigte das Ansehen der Firma.'",
      "Environment / Nature: 'Pestizide schädigen nützliche Insekten und die Umwelt.'"
    ],
    family: { noun: "der Schaden (damage/harm), die Schädigung (act of damaging)", adj: "schädlich (harmful/toxic), unschädlich (harmless)", related: "beschädigen (damage physical item), entschädigen (compensate)" },
    story: "A shady vandal damages the shiny parked car, causing a massive financial Schaden.",
    punch: "SCHÄDIGEN = SHADY → DAMAGE / CAUSE HARM",
    prep: "schädigen + Akkusativ (direct object)",
    confusion: { target: "beschädigen", rule: "SCHÄDIGEN = cause general harm/damage to health, nature, or reputation; BESCHÄDIGEN = direct physical damage to a concrete object (e.g. Das Auto wurde beschädigt)." },
    sentences: [
      { de: "Zu viel Stress schädigt die Gesundheit.", en: "Too much stress damages one's health." },
      { de: "Die Chemikalien haben den Boden nachhaltig geschädigt.", en: "The chemicals have permanently damaged the soil." },
      { de: "Falsche Gerüchte schädigten seinen guten Ruf.", en: "False rumors damaged his good reputation." }
    ],
    quiz: {
      cloze: "Rauchen ___ (damages) die Lunge.",
      clozeAns: "schädigt",
      mc: "What is the noun associated with 'schädigen'?",
      mcOpts: ["der Schatten", "der Schaden", "die Schande"],
      mcAns: "der Schaden",
      transform: "schädigen → schädigte → hat geschädigt (Weak Verb: regular -te / ge-...-t)"
    }
  },
  "fahren": {
    anchor: "Fare / Ferry",
    image: "Imagine paying your bus FARE or boarding a speeding FERRY to travel across the river.",
    lock: "Moving via any vehicle (car, bus, train, ferry, bike) = FARE / FERRY = Fahren!",
    situations: [
      "Commuting by vehicle: 'Ich fahre jeden Morgen mit der Bahn zur Arbeit.'",
      "Traveling on vacation: 'Wir fahren im Sommer nach Italien.'",
      "Driving carefully: 'Fahr bitte vorsichtig bei diesem Regen!'"
    ],
    family: { noun: "die Fahrt (journey/trip), der Fahrer (driver), das Fahrzeug (vehicle)", adj: "fahrbar (drivable), fahrplanmäßig (on schedule)", related: "abfahren (depart), mitfahren (ride along), erfahren (experience)" },
    story: "You pay the bus fare and board the ferry to drive across the scenic lake.",
    punch: "FAHREN = FARE / FERRY → TRAVEL BY VEHICLE / DRIVE",
    prep: "fahren mit (+ Dat) / nach (+ Dat)",
    confusion: { target: "gehen", rule: "FAHREN = by vehicle or on wheels (mit dem Auto/Zug); GEHEN = on foot (zu Fuß)." },
    sentences: [
      { de: "Er fährt mit dem Auto nach Berlin.", en: "He drives by car to Berlin." },
      { de: "Gestern sind wir mit dem Fahrrad gefahren.", en: "Yesterday we rode by bicycle [ist gefahren]." },
      { de: "Der Zug fuhr pünktlich um 10 Uhr ab.", en: "The train departed on time at 10 AM." }
    ],
    quiz: {
      cloze: "Letzte Woche ___ er nach München gefahren (sein/haben).",
      clozeAns: "ist",
      mc: "Which auxiliary verb does 'fahren' take for movement?",
      mcOpts: ["haben (hat gefahren)", "sein (ist gefahren)", "werden (wird gefahren)"],
      mcAns: "sein (ist gefahren)",
      transform: "fahren → fuhr → ist gefahren (Strong Verb: a → u → a)"
    }
  },
  "essen": {
    anchor: "Essence / S-shaped Sausage",
    image: "Imagine taking a giant bite of an S-shaped sizzling German Bratwurst, enjoying every bit of delicious food ESSENCE.",
    lock: "Consuming solid food = S-sausage ESSENCE = Essen!",
    situations: [
      "Daily meals: 'Wir essen jeden Tag um 19 Uhr gemeinsam zu Abend.'",
      "Ordering food: 'Was möchtest du im Restaurant essen?'",
      "Diet preferences: 'Ich esse kein Fleisch, ich bin Vegetarier.'"
    ],
    family: { noun: "das Essen (food/meal), das Esszimmer (dining room)", adj: "essbar (edible), ungenießbar (inedible)", related: "aufessen (eat up), der Esslöffel (tablespoon)" },
    story: "You take a big bite of the sizzling S-sausage and savor the rich food essence.",
    punch: "ESSEN = S-SAUSAGE ESSENCE → EAT FOOD",
    prep: "essen + Akkusativ (food item)",
    confusion: { target: "fressen", rule: "ESSEN is for humans eating; FRESSEN is for animals eating." },
    sentences: [
      { de: "Was isst du heute zum Mittagessen?", en: "What are you eating today for lunch?" },
      { de: "Ich habe gestern eine leckere Pizza gegessen.", en: "I ate a delicious pizza yesterday." },
      { de: "Er aß schnell einen Apfel vor der Schule.", en: "He quickly ate an apple before school." }
    ],
    quiz: {
      cloze: "Du ___ (eat) sehr gesund!",
      clozeAns: "isst",
      mc: "What is the Präteritum (Simple Past) of 'essen'?",
      mcOpts: ["esste", "aß", "geasst"],
      mcAns: "aß",
      transform: "essen → aß → hat gegessen (Strong Verb: e → a → e)"
    }
  },
  "aufstehen": {
    anchor: "Auf (Up) + Stehen (Stand)",
    image: "When the alarm rings, you throw off the blanket, pop straight UP (auf) and STAND (stehen) on your feet.",
    lock: "Leaving bed / rising to feet = AUF (Up) + STEHEN (Stand) = Aufstehen!",
    situations: [
      "Morning routine: 'Ich stehe unter der Woche um 6:30 Uhr auf.'",
      "Rising in a meeting/church: 'Alle Teilnehmer standen auf.'",
      "Health check: 'Können Sie bitte aufstehen und ein paar Schritte gehen?'"
    ],
    family: { noun: "das Aufstehen (rising/getting up), der Aufstand (rebellion/uprising)", adj: "aufgestanden", related: "aufwachen (wake up), stehen (stand stationary)" },
    story: "When morning arrives, you jump UP (auf) and STAND (stehen) ready to conquer the day.",
    punch: "AUFSTEHEN = AUF (UP) + STAND → GET UP / RISE",
    prep: "aufstehen von (+ Dat)",
    confusion: { target: "aufwachen", rule: "AUFWACHEN = opening eyes / waking up in bed; AUFSTEHEN = physically getting out of bed onto your feet." },
    sentences: [
      { de: "Ich stehe jeden Morgen früh auf.", en: "I get up early every morning." },
      { de: "Heute bin ich um 7 Uhr aufgestanden.", en: "Today I got up at 7 AM [ist aufgestanden]." },
      { de: "Er stand langsam vom Stuhl auf.", en: "He stood up slowly from the chair." }
    ],
    quiz: {
      cloze: "Wann bist du heute Morgen ___ (aufstehen - Perfekt)?",
      clozeAns: "aufgestanden",
      mc: "Is 'aufstehen' separable (trennbar) and what is its auxiliary?",
      mcOpts: ["Inseparable, takes haben", "Separable (steht...auf), takes sein (ist aufgestanden)", "Separable, takes haben"],
      mcAns: "Separable (steht...auf), takes sein (ist aufgestanden)",
      transform: "aufstehen → stand auf → ist aufgestanden (Strong Separable: e → a → a)"
    }
  },
  "erinnern": {
    anchor: "Er- + INNER mind vault",
    image: "Imagine diving deep into your INNER mind vault, pulling open a golden drawer to retrieve a cherished memory.",
    lock: "Remembering or reminding = digging inside your INNER mind = Erinnern!",
    situations: [
      "Recalling past events: 'Ich erinnere mich gern an unsere Reise nach Wien.'",
      "Reminding someone: 'Bitte erinnere mich morgen an das Meeting.'",
      "Recognizing someone: 'Ich kann mich nicht mehr an seinen Namen erinnern.'"
    ],
    family: { noun: "die Erinnerung (memory/recollection), das Erinnerungsfoto", adj: "erinnerlich (memorable)", related: "innerlich (internal/inner), sich besinnen (reflect)" },
    story: "You reach deep into your inner mind to bring back a forgotten childhood memory.",
    punch: "ERINNERN = INNER MIND → REMEMBER / RECALL (sich erinnern an + Akk)",
    prep: "sich erinnern an (+ Akk) / jemanden erinnern an (+ Akk)",
    confusion: { target: "merken", rule: "SICH ERINNERN AN (+ Akk) = recall a past memory; SICH MERKEN (+ Akk) = store/memorize something in mind for the future." },
    sentences: [
      { de: "Ich erinnere mich an diesen schönen Tag.", en: "I remember that beautiful day [an + Akkusativ]." },
      { de: "Erinnerst du mich bitte an den Arzttermin?", en: "Will you please remind me of the doctor appointment?" },
      { de: "Wir haben uns lange an die Schulzeit erinnert.", en: "We remembered our school days for a long time." }
    ],
    quiz: {
      cloze: "Ich erinnere mich ___ meinen ersten Schultag (Preposition: an/auf/über).",
      clozeAns: "an",
      mc: "Which preposition and case does 'sich erinnern' require?",
      mcOpts: ["an + Akkusativ", "von + Dativ", "über + Dativ"],
      mcAns: "an + Akkusativ",
      transform: "erinnern → erinnerte → hat erinnert (Inseparable prefix er-: no ge-)"
    }
  },
  "stehen": {
    anchor: "Statue / Stand",
    image: "Imagine a stone STATUE standing upright and motionless in the town square.",
    lock: "Stationary upright posture + Dativ (Wo?) = STATUE = Stehen!",
    situations: [
      "Object position: 'Das Glas steht auf dem Tisch.'",
      "Waiting / traffic: 'Wir standen eine Stunde im Stau.'",
      "Standing upright: 'Er steht an der Bushaltestelle.'"
    ],
    family: { noun: "der Stand (status/booth), der Stillstand", adj: "ständig (constant), standhaft", related: "stellen (put upright), aufstehen (get up)" },
    story: "The tall statue stands steady and proud in the center of the park.",
    punch: "STEHEN = STATUE STAND → UPRIGHT POSITION (DATIV)",
    prep: "stehen auf / an / vor (+ Dativ - Wo?)",
    confusion: { target: "stellen", rule: "STEHEN = static position (Wo? + Dativ); STELLEN = active movement putting upright (Wohin? + Akkusativ)." },
    sentences: [
      { de: "Das Glas steht auf dem Tisch.", en: "The glass is standing on the table [Dativ: wo?]." },
      { de: "Er stand lange vor der Tür.", en: "He stood in front of the door for a long time." },
      { de: "Wo hast du gestern gestanden?", en: "Where did you stand yesterday?" }
    ],
    quiz: {
      cloze: "Das Buch ___ auf dem Regal (steht/stellt).",
      clozeAns: "steht",
      mc: "What case does 'stehen' answer?",
      mcOpts: ["Wo? + Dativ (location)", "Wohin? + Akkusativ (destination)", "Woher? + Genitiv"],
      mcAns: "Wo? + Dativ (location)",
      transform: "stehen → stand → hat gestanden (Strong: e → a → a)"
    }
  },
  "stellen": {
    anchor: "Setting / Stalling into place",
    image: "Imagine your hands actively setting a fragile vase upright onto the kitchen counter.",
    lock: "Active motion placing something upright + Akkusativ (Wohin?) = SETTING = Stellen!",
    situations: [
      "Placing upright: 'Ich stelle die Flasche in den Kühlschrank.'",
      "Setting an alarm: 'Ich stelle den Wecker auf 7 Uhr.'",
      "Asking a question: 'Darf ich Ihnen eine Frage stellen?'"
    ],
    family: { noun: "die Stelle (spot/job), die Stellung", adj: "festgestellt", related: "vorstellen (introduce), bestellen (order)" },
    story: "You carefully place the tall bottle upright on top of the shelf.",
    punch: "STELLEN = SET UPRIGHT → ACTIVE PLACING (AKKUSATIV)",
    prep: "stellen auf / in / an (+ Akkusativ - Wohin?)",
    confusion: { target: "stehen", rule: "STELLEN = action (Ich stelle das Glas auf den Tisch); STEHEN = location (Das Glas steht auf dem Tisch)." },
    sentences: [
      { de: "Ich stelle das Glas auf den Tisch.", en: "I place the glass onto the table [Akkusativ: wohin?]." },
      { de: "Er stellte den Wecker auf 6 Uhr.", en: "He set the alarm clock for 6 AM." },
      { de: "Sie hat die Blumen ins Wasser gestellt.", en: "She has put the flowers into the water." }
    ],
    quiz: {
      cloze: "Ich ___ die Tasse auf den Tisch (stelle/stehe).",
      clozeAns: "stelle",
      mc: "What case does 'stellen' answer?",
      mcOpts: ["Wohin? + Akkusativ (action/destination)", "Wo? + Dativ (static position)", "Wann? + Dativ"],
      mcAns: "Wohin? + Akkusativ (action/destination)",
      transform: "stellen → stellte → hat gestellt (Weak Verb)"
    }
  },
  "liegen": {
    anchor: "Lying down / Lounging lazy",
    image: "Imagine a lazy cat lying flat on the warm carpet without moving.",
    lock: "Flat horizontal position + Dativ (Wo?) = LYING = Liegen!",
    situations: [
      "Resting in bed: 'Er liegt krank im Bett.'",
      "Object lying flat: 'Das Buch liegt auf dem Schreibtisch.'",
      "Geographic location: 'Berlin liegt im Osten von Deutschland.'"
    ],
    family: { noun: "die Lage (location/situation), die Liege (couch/lounger)", adj: "gelegen (located/convenient)", related: "legen (lay flat down)" },
    story: "The sleepy cat lies flat across the sunny rug all afternoon.",
    punch: "LIEGEN = LYING FLAT → HORIZONTAL REST (DATIV)",
    prep: "liegen auf / in / unter (+ Dativ - Wo?)",
    confusion: { target: "legen", rule: "LIEGEN = resting flat (Wo? + Dativ); LEGEN = active placement flat down (Wohin? + Akkusativ)." },
    sentences: [
      { de: "Das Buch liegt auf dem Tisch.", en: "The book is lying on the table [Dativ: wo?]." },
      { de: "Er lag gestern den ganzen Tag im Bett.", en: "He lay in bed all day yesterday." },
      { de: "München hat im Süden gelegen.", en: "Munich is situated in the south." }
    ],
    quiz: {
      cloze: "Der Schlüssel ___ auf dem Teppich (liegt/legt).",
      clozeAns: "liegt",
      mc: "Which sentence is correct for a static flat position?",
      mcOpts: ["Das Handy liegt auf dem Sofa.", "Das Handy legt auf dem Sofa.", "Das Handy stellt auf dem Sofa."],
      mcAns: "Das Handy liegt auf dem Sofa.",
      transform: "liegen → lag → hat gelegen (Strong: ie → a → e)"
    }
  },
  "legen": {
    anchor: "Laying eggs / Laying flat",
    image: "Imagine a hen laying a smooth egg into the nest, placing it down flat.",
    lock: "Active motion placing something flat down + Akkusativ (Wohin?) = LAYING = Legen!",
    situations: [
      "Putting an object down: 'Ich lege das Handy auf den Tisch.'",
      "Lying yourself down: 'Ich lege mich für eine halbe Stunde hin.'",
      "Putting value on something: 'Wir legen großen Wert auf Pünktlichkeit.'"
    ],
    family: { noun: "die Ablage (filing/storage), die Unterlage", adj: "angelegt", related: "hinlegen (lie down), ablegen (file away)" },
    story: "You gently lay the fragile phone flat on the soft blanket.",
    punch: "LEGEN = LAY FLAT → ACTIVE PLACEMENT (AKKUSATIV)",
    prep: "legen auf / in (+ Akkusativ - Wohin?)",
    confusion: { target: "liegen", rule: "LEGEN = action of placing flat (Wohin? + Akk); LIEGEN = condition of being flat (Wo? + Dat)." },
    sentences: [
      { de: "Ich lege das Buch auf das Bett.", en: "I lay the book onto the bed [Akkusativ: wohin?]." },
      { de: "Er legte die Papiere in die Schublade.", en: "He put the papers into the drawer." },
      { de: "Hast du die Schlüssel auf den Schrank gelegt?", en: "Did you place the keys onto the cupboard?" }
    ],
    quiz: {
      cloze: "Ich ___ mich kurz aufs Sofa (lege/liege).",
      clozeAns: "lege",
      mc: "What does 'sich legen' mean?",
      mcOpts: ["To lie down (action)", "To stand up", "To sit down"],
      mcAns: "To lie down (action)",
      transform: "legen → legte → hat gelegt (Weak Verb)"
    }
  },
  "sitzen": {
    anchor: "Sitting chair / Statue sitting",
    image: "Imagine sitting relaxed on a comfortable armchair enjoying a warm cup of tea.",
    lock: "Seated stationary posture + Dativ (Wo?) = SITZEN!",
    situations: [
      "Seated posture: 'Er sitzt am Schreibtisch und arbeitet.'",
      "Restaurant/Cinema: 'Wir saßen in der ersten Reihe.'",
      "Resting: 'Komm, setz dich nicht auf den Boden, sitz auf dem Stuhl.'"
    ],
    family: { noun: "der Sitz (seat/headquarters), der Sitzplatz", adj: "sitzend", related: "setzen (sit down), besitzen (own/possess)" },
    story: "You sit comfortably on the chair reading your favorite book.",
    punch: "SITZEN = SEATED POSTURE → WO? (DATIV)",
    prep: "sitzen auf / in / an (+ Dativ - Wo?)",
    confusion: { target: "setzen", rule: "SITZEN = seated posture (Wo? + Dativ); SETZEN = placing into seat / sich setzen (Wohin? + Akkusativ)." },
    sentences: [
      { de: "Er sitzt auf dem Stuhl.", en: "He is sitting on the chair [Dativ: wo?]." },
      { de: "Wir saßen stundenlang im Café.", en: "We sat in the café for hours." },
      { de: "Hast du gut gesessen?", en: "Were you seated comfortably?" }
    ],
    quiz: {
      cloze: "Sie ___ auf dem Sofa und liest ein Buch (sitzt/setzt).",
      clozeAns: "sitzt",
      mc: "What is the Präteritum of 'sitzen'?",
      mcOpts: ["sitzte", "saß", "gesessen"],
      mcAns: "saß",
      transform: "sitzen → saß → hat gesessen (Strong: i → a → e)"
    }
  },
  "setzen": {
    anchor: "Seat yourself / Setting down",
    image: "Imagine taking a seat onto a chair or placing a potted plant onto the windowsill.",
    lock: "Active action of sitting down (sich setzen) or placing down + Akkusativ (Wohin?) = SETZEN!",
    situations: [
      "Sitting down: 'Setzen Sie sich bitte!'",
      "Placing an object: 'Er setzte den Hut auf den Kopf.'",
      "Focusing on something: 'Wir setzen auf Qualität.'"
    ],
    family: { noun: "der Satz (sentence/set), die Besetzung", adj: "festgesetzt", related: "sitzen (be seated), übersetzen (translate)" },
    story: "You actively take a seat on the chair and make yourself comfortable.",
    punch: "SETZEN = SIT DOWN / PLACE → WOHIN? (AKKUSATIV)",
    prep: "setzen auf / in (+ Akkusativ - Wohin?)",
    confusion: { target: "sitzen", rule: "SETZEN = active motion into seat (Wohin? + Akk); SITZEN = stationary state of sitting (Wo? + Dat)." },
    sentences: [
      { de: "Er setzt sich auf den Stuhl.", en: "He sits down onto the chair [Akkusativ: wohin?]." },
      { de: "Ich setzte mich neben meinen Freund.", en: "I sat down next to my friend." },
      { de: "Haben Sie sich schon gesetzt?", en: "Have you taken a seat already?" }
    ],
    quiz: {
      cloze: "Bitte ___ Sie sich! (Take a seat)",
      clozeAns: "setzen",
      mc: "What case follows 'sich setzen'?",
      mcOpts: ["Wohin? + Akkusativ", "Wo? + Dativ", "Woher? + Dativ"],
      mcAns: "Wohin? + Akkusativ",
      transform: "setzen → setzte → hat gesetzt (Weak Verb)"
    }
  },
  "leihen": {
    anchor: "Lie on borrowed books",
    image: "Imagine lying on a pile of borrowed library books that you must return next week.",
    lock: "Borrowing or lending temporarily without money = LEIHEN!",
    situations: [
      "Borrowing from a friend: 'Kannst du mir 10 Euro leihen?'",
      "Library / tools: 'Ich habe mir ein Buch aus der Bibliothek geliehen.'",
      "Lending your car: 'Er hat seinem Nachbarn das Fahrrad geliehen.'"
    ],
    family: { noun: "die Leihe (lending/loan), die Leihgabe", adj: "leihweise (on loan)", related: "verleihen (award / lend out), ausleihen (borrow)" },
    story: "You borrow a friend's bike for the day and promise to return it tonight.",
    punch: "LEIHEN = LEND / BORROW (NO RENT MONEY)",
    prep: "leihen von (+ Dat) / an (+ Akk)",
    confusion: { target: "mieten", rule: "LEIHEN = borrow/lend for free (e.g. from a friend); MIETEN = rent for money (e.g. an apartment or rental car)." },
    sentences: [
      { de: "Kannst du mir deinen Stift leihen?", en: "Can you lend me your pen?" },
      { de: "Er lieh mir gestern sein Auto.", en: "He lent me his car yesterday." },
      { de: "Ich habe mir etwas Geld geliehen.", en: "I borrowed some money." }
    ],
    quiz: {
      cloze: "Er hat mir sein Fahrrad ___ (leihen - Perfekt).",
      clozeAns: "geliehen",
      mc: "Notice the vowel shift in 'leihen' (ei → ie):",
      mcOpts: ["leihte", "lieh / geliehen", "gelieht"],
      mcAns: "lieh / geliehen",
      transform: "leihen → lieh → hat geliehen (Strong: ei → ie → ie)"
    }
  }
};

const ROOT_MNEMONIC_DB = {
  "steh": { anchor: "Stand / Statue", idea: "standing upright, presence", tamil: "நில்", conf: { target: "stellen", rule: "stehen = Wo? (Dativ); stellen = Wohin? (Akkusativ)" } },
  "fahr": { anchor: "Fare / Ferry", idea: "vehicular motion, journey", tamil: "பயணி / ஓட்டு", conf: { target: "gehen", rule: "fahren = by vehicle; gehen = on foot" } },
  "geh": { anchor: "Go / Leg motion", idea: "walking on foot, proceeding", tamil: "செல் / நட" },
  "komm": { anchor: "Come / Welcome", idea: "arriving, approaching here", tamil: "வா" },
  "bring": { anchor: "Bring / Delivery", idea: "transporting something to someone", tamil: "கொண்டு வா", conf: { target: "holen", rule: "bringen = transport here; holen = go fetch from there" } },
  "sprech": { anchor: "Speech / Speak", idea: "vocal communication, speaking", tamil: "பேசு" },
  "schreib": { anchor: "Scribe / Write", idea: "writing, recording text", tamil: "எழுது" },
  "les": { anchor: "Lesson / Read", idea: "reading text, decoding words", tamil: "படி / வாசி" },
  "seh": { anchor: "Sight / See", idea: "visual perception, watching", tamil: "பார்" },
  "hör": { anchor: "Hear / Audio", idea: "auditory listening, hearing", tamil: "கேள்" },
  "kauf": { anchor: "Coffee cart / Buy", idea: "purchasing goods with money", tamil: "வாங்கு" },
  "arbeit": { anchor: "Hard bite / Work", idea: "labor, employment, tasks", tamil: "வேலை செய்" },
  "wohn": { anchor: "Dwelling / Reside", idea: "living in a home/city", tamil: "வசி" },
  "leb": { anchor: "Life / Live", idea: "being alive, existence", tamil: "வாழ்" },
  "denk": { anchor: "Think / Brain tank", idea: "mental cognition, reflecting", tamil: "சிந்தி" },
  "wiss": { anchor: "Wizard / Wisdom", idea: "factual data, knowing info", tamil: "அறி / தெரி", conf: { target: "kennen", rule: "wissen = facts/dass; kennen = people/places" } },
  "kenn": { anchor: "Ken Doll / Person", idea: "personal familiarity, knowing someone/somewhere", tamil: "தெரி", conf: { target: "wissen", rule: "kennen = people/places; wissen = facts" } },
  "schad": { anchor: "Shady / Damage", idea: "inflicting harm, damage, loss", tamil: "சேதப்படுத்து", conf: { target: "beschädigen", rule: "schädigen = general harm; beschädigen = physical object damage" } },
  "schädig": { anchor: "Shady / Damage", idea: "inflicting harm, damage, loss", tamil: "சேதப்படுத்து", conf: { target: "beschädigen", rule: "schädigen = general harm; beschädigen = physical object damage" } },
  "nehm": { anchor: "Name & Take", idea: "grasping, taking possession", tamil: "எடு" },
  "geb": { anchor: "Give / Gift", idea: "handing over, donating", tamil: "கொடு" },
  "find": { anchor: "Find / Treasure", idea: "discovering, locating", tamil: "கண்டுபிடி", conf: { target: "suchen", rule: "suchen = look for; finden = actually found" } },
  "such": { anchor: "Search / Seeking", idea: "looking for something lost", tamil: "தேடு" },
  "zeig": { anchor: "Signal / Show", idea: "pointing out, demonstrating", tamil: "காட்டு" },
  "mach": { anchor: "Make / Do", idea: "creating, doing, performing", tamil: "செய் / பண்ணு" },
  "ruf": { anchor: "Roof shout / Call", idea: "shouting, phoning, summoning", tamil: "அழை" },
  "halt": { anchor: "Halt / Hold", idea: "stopping, holding in place", tamil: "பிடி / நிறுத்து" },
  "lass": { anchor: "Let / Lease", idea: "permitting, leaving behind", tamil: "விடு / அனுமதி" },
  "lauf": { anchor: "Leg trot / Run", idea: "running fast or walking", tamil: "ஓடு / நட" },
  "renn": { anchor: "Race / Running sprint", idea: "sprinting at high speed", tamil: "வேகமாக ஓடு" },
  "schneid": { anchor: "Scissors / Snip", idea: "cutting with blade/knife", tamil: "வெட்டு" },
  "wasch": { anchor: "Wash / Water splash", idea: "cleansing with soap and water", tamil: "கழுவு" },
  "putz": { anchor: "Polish / Clean", idea: "cleaning, scrubbing surfaces", tamil: "சுத்தம் செய்" },
  "rein": { anchor: "Refine / Pure clean", idea: "purifying, cleaning", tamil: "சுத்தப்படுத்து" },
  "koch": { anchor: "Cook / Kitchen pot", idea: "boiling, cooking meals", tamil: "சமை" },
  "back": { anchor: "Bake / Oven bread", idea: "baking bread or cakes", tamil: "சுடு" },
  "bau": { anchor: "Build / Bricklayer", idea: "constructing buildings/structures", tamil: "கட்டு" },
  "helf": { anchor: "Help / Helping hand", idea: "assisting someone in need", tamil: "உதவு" },
  "trag": { anchor: "Trek / Carry / Wear", idea: "carrying load or wearing clothes", tamil: "சும / அணி" },
  "zieh": { anchor: "Tug / Pull / Move", idea: "pulling force or moving home", tamil: "இழு / குடிபெயர்" },
  "drück": { anchor: "Press / Push button", idea: "pressing down or hugging", tamil: "அழுத்து" },
  "zahl": { anchor: "Toll / Pay tally", idea: "paying money, counting", tamil: "பணம் செலுத்து", conf: { target: "bezahlen", rule: "zahlen = general paying; bezahlen = pay a specific bill/item [Akk]" } },
  "kling": { anchor: "Cling / Ring chime", idea: "sounding, chiming, ringing", tamil: "ஒலி" },
  "öffn": { anchor: "Open / Unlocked door", idea: "opening an entryway or box", tamil: "திற" },
  "schließ": { anchor: "Slit lock / Shut", idea: "closing, locking", tamil: "மூடு / பூட்டு" },
  "pass": { anchor: "Fit / Matching piece", idea: "fitting well, being suitable", tamil: "பொருந்து" },
  "fehl": { anchor: "Fail / Missing part", idea: "lacking, missing, absent", tamil: "குறைவாக இரு" },
  "folg": { anchor: "Follow / Footsteps", idea: "following after, succeeding", tamil: "பின்தொடர்" },
  "hoff": { anchor: "Hope / Wishing star", idea: "hoping for good outcome", tamil: "நம்பு / ஆசைப்படு" },
  "lieb": { anchor: "Love / Heart", idea: "loving dearly", tamil: "நேசி" },
  "hass": { anchor: "Hate / Dark frown", idea: "detesting strongly", tamil: "வெறு" },
  "wein": { anchor: "Whine / Weeping tears", idea: "crying, shedding tears", tamil: "அழு" },
  "lach": { anchor: "Laugh / Chuckle", idea: "laughing joyfully", tamil: "சிரி" },
  "freu": { anchor: "Friendly joy / Glad", idea: "rejoicing, looking forward", tamil: "மகிழ்" },
  "ärger": { anchor: "Anger / Irritation", idea: "annoying, getting upset", tamil: "கோபப்படு" },
  "stör": { anchor: "Stir up / Disturb", idea: "interrupting, bothering", tamil: "தொந்தரவு செய்" },
  "treff": { anchor: "Target hit / Meet", idea: "meeting someone, hitting mark", tamil: "சந்தி" },
  "wähl": { anchor: "Vote / Well-chosen", idea: "selecting, choosing, dialing", tamil: "தேர்ந்தெடு" },
  "änder": { anchor: "Alter / Changing draft", idea: "modifying, altering", tamil: "மாற்று" },
  "wechsel": { anchor: "Switch / Exchange coin", idea: "swapping, exchanging", tamil: "பரிமாறு / மாற்று" },
  "studier": { anchor: "Student / University degree", idea: "studying at university", tamil: "பல்கலைக்கழகத்தில் படி", conf: { target: "lernen", rule: "studieren = academic degree at university; lernen = general learning/memorizing" } },
  "reparier": { anchor: "Repair / Fix tool", idea: "fixing broken items", tamil: "பழுதுபார்" },
  "stürz": { anchor: "Stumble / Fall crash", idea: "plummeting, crashing down", tamil: "விழு" },
  "sterb": { anchor: "Starve / Perish", idea: "dying, passing away", tamil: "இற" },
  "wachs": { anchor: "Wax / Grow tall", idea: "growing, expanding", tamil: "வளர்" },
  "schlaf": { anchor: "Sleep / Slumber bed", idea: "sleeping peacefully", tamil: "தூங்கு" },
  "trink": { anchor: "Drink / Thirst quencher", idea: "drinking liquids", tamil: "குடி" },
  "setz": { anchor: "Seat / Sit down", idea: "placing in seat / sitting down", tamil: "உட்கார வை", conf: { target: "sitzen", rule: "sitzen = Wo? (Dativ); setzen = Wohin? (Akkusativ)" } },
  "sitz": { anchor: "Sitting chair", idea: "seated stationary posture", tamil: "உட்கார்", conf: { target: "setzen", rule: "sitzen = Wo? (Dativ); setzen = Wohin? (Akkusativ)" } }
};

const PREFIX_METAPHORS = {
  "ab": { dir: "away / off / departure / down", icon: "🛫", hint: "detaching or leaving a starting point" },
  "an": { dir: "at / on / start / attach / contact", icon: "🎯", hint: "initiating contact or switching on" },
  "auf": { dir: "up / open / arise / sudden", icon: "⬆️", hint: "upward motion, opening, or sudden start" },
  "aus": { dir: "out / exit / complete / turn off", icon: "🚪", hint: "outward movement or thorough completion" },
  "ein": { dir: "in / into / enter / initiate", icon: "📥", hint: "moving inside or settling in" },
  "mit": { dir: "with / along / accompany", icon: "🤝", hint: "joining together with others" },
  "nach": { dir: "after / follow / look up / replicate", icon: "🔍", hint: "following behind or checking closely" },
  "vor": { dir: "before / forward / prepare / demonstrate", icon: "⏩", hint: "presenting in front or doing beforehand" },
  "zu": { dir: "shut / towards / add / agree", icon: "🔒", hint: "closing tight or moving towards a target" },
  "zurück": { dir: "back / return", icon: "🔄", hint: "returning to original state/place" },
  "weg": { dir: "away / gone / discarded", icon: "💨", hint: "moving far away or removing" },
  "be": { dir: "transitive focus / target object", icon: "🎯", hint: "directing the action squarely onto an object (inseparable: no ge-)" },
  "ge": { dir: "collective / result / belong", icon: "🏛️", hint: "collective outcome or intrinsic state (inseparable)" },
  "er": { dir: "achievement / origin / result / deep state", icon: "🏆", hint: "reaching an outcome through effort (inseparable: no ge-)" },
  "ver": { dir: "change / away / mistake / consume / intensive", icon: "🔀", hint: "transformation, going wrong, or intensive action (inseparable: no ge-)" },
  "zer": { dir: "destruction / into pieces", icon: "💥", hint: "breaking into fragments or destroying (inseparable: no ge-)" },
  "ent": { dir: "removal / escape / origin / unlock", icon: "🔓", hint: "escaping, removing, or initial emergence (inseparable: no ge-)" },
  "emp": { dir: "receive / feel / recommend", icon: "🤲", hint: "internal perception or reception (inseparable: no ge-)" },
  "miss": { dir: "wrong / mis- / failure", icon: "❌", hint: "incorrect execution or erroneous state (inseparable: no ge-)" }
};

