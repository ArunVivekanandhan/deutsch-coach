# -*- coding: utf-8 -*-
"""Correct wrong Tamil meanings ("ta") in the word lists and regenerate their transliteration ("ta_translit").

Found in Task 32: many Tamil values had been assigned by matching English *substrings*, e.g.
  send / extend / referendum / defendant / (customer-)friendly / dependent  ->  முடி ("end" = finish)
  change / exchange                                                          ->  தொங்கு ("hang")
  parents' house / accused / employee                                        ->  பயன்படுத்து ("use")
  breathable / meat-free / weatherproof                                      ->  சாப்பிடு ("eat")
  planet / power plant                                                       ->  திட்டமிடு ("plan")
All 1,333 existing Tamil values were reviewed; the 207 wrong ones are corrected below (AI-assisted translation,
reviewed). Applied to the canonical lists and every copy (VERBS / ALL_VERBS / VERBS_ALL / NOUNS / ADJS).

Run: python3 scripts/fix_tamil.py            (idempotent)
     python3 scripts/fix_tamil.py --check    (used by build.py: fails if a corrected value came back)
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_freq_ranks import array_spans, ARRAYS  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CORRECTIONS = {
    'v': {
        'heißen': 'என்று அழைக்கப்படு', 'verkaufen': 'விற்', 'dürfen': 'அனுமதிக்கப்படு', 'husten': 'இருமு',
        'basteln': 'கைவினை செய்', 'bitten': 'வேண்டிக்கொள்', 'grillen': 'தணலில் சுடு', 'kennenlernen': 'அறிமுகமாகு',
        'klappen': 'சரியாக அமை / மடி', 'leihen': 'கடன் கொடு / கடன் வாங்கு', 'lügen': 'பொய் சொல்', 'meinen': 'கருது',
        'packen': 'பொதி கட்டு', 'riechen': 'முகர் / மணம் வீசு', 'schicken': 'அனுப்பு', 'treiben': 'ஈடுபடு / துரத்து',
        'surfen': 'அலைச்சறுக்கு / இணையத்தில் உலாவு', 'widerstehen': 'எதிர்த்து நில்', 'überweisen': 'பணம் அனுப்பு (வங்கி மாற்றம்)',
        'umsteigen': 'வண்டி மாறு', 'unternehmen': 'மேற்கொள்', 'verstehen': 'புரிந்துகொள்', 'üben': 'பயிற்சி செய்',
        'wechseln': 'மாற்று', 'wiederholen': 'மீண்டும் செய்', 'duschen': 'ஷவரில் குளி', 'verzeihen': 'மன்னி',
        'vergeben': 'மன்னி', 'fertig sein': 'முடித்திரு / தயாராக இரு', 'bereit sein': 'தயாராக இரு',
        'erlaubt sein': 'அனுமதிக்கப்பட்டிரு', 'abnehmen': 'எடை குறை', 'abschicken': 'அனுப்பு', 'absolvieren': 'நிறைவு செய்',
        'achten': 'கவனி / மதி', 'achten auf': 'கவனி', 'anfahren': 'புறப்படு / வாகனத்தால் மோது',
        'angewöhnen': 'பழக்கப்படுத்திக்கொள்', 'aufkommen': 'பொறுப்பேற்', 'auseinandersetzen': 'ஆழமாக ஆராய்',
        'ausparken': 'வாகனத்தை வெளியே எடு', 'behalten': 'வைத்துக்கொள்', 'beilegen': 'இணைத்து அனுப்பு / தீர்த்துவை',
        'benötigen': 'தேவைப்படு', 'einchecken': 'பதிவு செய் (செக்-இன்)', 'eingehen': 'வந்து சேர்', 'einhalten': 'கடைப்பிடி',
        'einschlafen': 'தூங்கிவிடு', 'enttäuschen': 'ஏமாற்றமடையச் செய்', 'erinnern': 'நினைவூட்டு / நினைவுகூர்',
        'erleichtern': 'எளிதாக்கு', 'herkommen': 'இங்கே வா', 'kümmern': 'கவனித்துக்கொள்', 'mitdenken': 'சேர்ந்து சிந்தி',
        'mitreden': 'கருத்துச் சொல்', 'rasieren': 'சவரம் செய்', 'schwingen': 'ஆடு', 'senden': 'அனுப்பு',
        'stattfinden': 'நடைபெறு', 'verdrängen': 'அகற்று / ஒடுக்கு', 'verfolgen': 'பின்தொடர் / துன்புறுத்து',
        'verlängern': 'நீட்டி', 'versenden': 'அனுப்பு', 'vertragen': 'தாங்கிக்கொள் / ஒத்துப்போ', 'verursachen': 'ஏற்படுத்து',
        'verzichten': 'விட்டுக்கொடு', 'verändern': 'மாற்று', 'weitergehen': 'தொடர்ந்து செல்', 'zaubern': 'மந்திரம் செய்',
        'zurücklassen': 'விட்டுச் செல்', 'zurückschicken': 'திருப்பி அனுப்பு', 'zurücksenden': 'திருப்பி அனுப்பு',
        'zurücktreten': 'பதவி விலகு / பின்வாங்கு', 'zusammenarbeiten': 'சேர்ந்து வேலை செய்', 'zusammenstellen': 'தொகு',
        'zustellen': 'விநியோகி', 'einleben': 'புதிய இடத்தில் பழகிக்கொள்', 'auswandern': 'வெளிநாட்டுக்குக் குடிபெயர்',
        'engagieren für': 'ஈடுபடு', 'hinsetzen': 'உட்கார்', 'umtauschen': 'மாற்றிக்கொள்', 'einsetzen für': 'ஆதரித்துப் போராடு',
        'verlernen': 'கற்றதை மறந்துவிடு', 'zwingen zu etw.': 'கட்டாயப்படுத்து', 'ersetzen': 'மாற்றீடு செய்', 'mitmachen': 'பங்கேற்',
    },
    'n': {
        '(Auslands-)Aufenthalt': 'தங்கியிருத்தல் (வெளிநாட்டில்)', 'Ehrenamt': 'தன்னார்வப் பணி',
        'Einwohnermeldeamt': 'குடியிருப்போர் பதிவு அலுவலகம்', 'Elternhaus': 'பெற்றோர் வீடு', 'Tanz': 'நடனம்',
        'Bürgerinitiative': 'குடிமக்கள் முன்முயற்சி', 'Kulturschock': 'பண்பாட்டு அதிர்ச்சி', 'Bezahlung': 'பணம் செலுத்துதல்',
        'Festanstellung': 'நிரந்தர வேலை', 'Kenntnis': 'அறிவு', 'Schichtarbeit': 'சுழற்சி முறை வேலை',
        'Tätigkeit': 'செயல்பாடு / வேலை', 'Argument': 'வாதம் / காரணம்', 'Branche': 'தொழில்துறை', 'Ungleichheit': 'சமத்துவமின்மை',
        'Arbeitnehmer': 'ஊழியர்', 'Arbeitnehmerin': 'ஊழியர் (பெண்)', '(Arbeits-)Bedingung': '(வேலை) நிபந்தனை',
        'Beschäftigte': 'ஊழியர்', 'Streik': 'வேலைநிறுத்தம்', 'Tarifvertrag': 'கூட்டு ஊதிய ஒப்பந்தம்', 'Verständnis': 'புரிதல்',
        'Wohnungseinrichtung': 'வீட்டுத் தளபாடங்கள்', 'Ablenkung': 'கவனச்சிதறல்', 'Badewanne': 'குளியல் தொட்டி',
        'Lieblingsort': 'விருப்பமான இடம்', 'Beet': 'பாத்தி (தோட்டம்)', 'Ernte': 'அறுவடை', 'Arbeitskraft': 'தொழிலாளர் / உழைப்பு சக்தி',
        'Einwanderungsland': 'குடியேற்ற நாடு', 'Gastarbeiter': 'வெளிநாட்டுத் தொழிலாளர்', 'Gastarbeiterin': 'வெளிநாட்டுத் தொழிலாளர் (பெண்)',
        'Heimatland': 'தாய்நாடு', 'Migrationserfahrung': 'இடம்பெயர்வு அனுபவம்', 'Migrationshintergrund': 'இடம்பெயர்வுப் பின்னணி',
        'Regierung': 'அரசாங்கம்', 'Gewohnheit': 'பழக்கம்', 'Missverständnis': 'தவறான புரிதல்', 'Trinkgeld': 'அன்பளிப்புப் பணம் (டிப்ஸ்)',
        'Förderung': 'ஆதரவு / நிதியுதவி', 'Bewegung': 'இயக்கம் / அசைவு', 'Diät': 'உணவுக் கட்டுப்பாடு', 'Droge': 'போதைப்பொருள்',
        'Gegend': 'பகுதி / சுற்றுவட்டாரம்', 'Betrieb': 'நிறுவனம் / தொழிற்சாலை',
        'Kraftwerk': 'மின் நிலையம்', 'Planet': 'கோள்', 'Zweifel': 'சந்தேகம்', 'Parkplatz': 'வாகன நிறுத்துமிடம்',
        'Landwirtschaft': 'விவசாயம்', 'Start-up': 'புத்தொழில் நிறுவனம்', 'Export': 'ஏற்றுமதி', 'Import': 'இறக்குமதி',
        'Bundesregierung': 'மத்திய அரசு', 'Grenze': 'எல்லை', 'Kaiserin': 'பேரரசி', 'Abstimmung': 'வாக்கெடுப்பு',
        'Diskussion': 'விவாதம்', 'Volksabstimmung': 'பொது வாக்கெடுப்பு', 'Fakt': 'உண்மை', 'Spielende': 'விளையாடுபவர்',
        'Stimme': 'வாக்கு / குரல்', 'Angeklagte': 'குற்றம் சாட்டப்பட்டவர்', 'Beschuldigte': 'குற்றம் சாட்டப்பட்டவர்',
        'Schuldige': 'குற்றவாளி', 'Strafe': 'தண்டனை', 'Zeuge': 'சாட்சி', 'Zeugin': 'சாட்சி (பெண்)',
        'Gender-Care-Gap': 'பாலினப் பராமரிப்பு இடைவெளி', 'Erfindung': 'கண்டுபிடிப்பு', 'Grammophon': 'கிராமபோன்',
        'Videotelefon': 'காணொளித் தொலைபேசி', 'Zeitreise': 'கால பயணம்', 'Veränderung': 'மாற்றம்', 'Hausarbeit': 'வீட்டு வேலை',
        'Poetry-Slam': 'கவிதைப் போட்டி', 'Werk': 'படைப்பு / தொழிற்சாலை',
    },
    'a': {
        'aktiv': 'சுறுசுறுப்பான', 'annulliert': 'ரத்து செய்யப்பட்ட', 'lebhaft': 'உயிரோட்டமான', 'sauber': 'சுத்தமான',
        'traumhaft': 'கனவு போன்ற / அற்புதமான', 'fristlos': 'முன்னறிவிப்பின்றி', 'unglaublich': 'நம்ப முடியாத', 'völlig': 'முற்றிலும்',
        'schädlich': 'தீங்கான', 'umweltfreundlich': 'சுற்றுச்சூழலுக்கு உகந்த', 'voraussichtlich': 'எதிர்பார்க்கப்படும்',
        'atmungsaktiv': 'காற்று புகக்கூடிய', 'beschädigt': 'சேதமடைந்த', 'eventuell': 'ஒருவேளை',
        'kundenfreundlich': 'வாடிக்கையாளருக்கு உகந்த', 'lieferbar': 'விநியோகத்திற்குக் கிடைக்கும்', 'wetterfest': 'வானிலையைத் தாங்கும்',
        'doppelt': 'இரட்டை', 'motiviert': 'ஊக்கமுள்ள', 'unentschieden': 'முடிவெடுக்காத / சமநிலையான', 'tatsächlich': 'உண்மையான / உண்மையில்',
        'hilfsbereit': 'உதவும் மனப்பான்மையுள்ள', 'abhängig': 'சார்ந்திருக்கும்', 'englischsprachig': 'ஆங்கிலம் பேசும்', 'offen': 'திறந்த',
        'fleischfrei': 'இறைச்சி இல்லாத', 'fleischlos': 'இறைச்சி இல்லாத', 'laktosefrei': 'லாக்டோஸ் இல்லாத', 'zufällig': 'தற்செயலான',
        'absichtlich': 'வேண்டுமென்றே', 'betrunken': 'குடிபோதையில் உள்ள', 'frustriert': 'விரக்தியடைந்த', 'sportlich': 'விளையாட்டுத் திறனுள்ள',
        'ungleich': 'சமமற்ற', 'gebraucht': 'பயன்படுத்தப்பட்ட', 'lebenswert': 'வாழத் தகுந்த', 'verpackt': 'பொதிக்கப்பட்ட',
        'unverpackt': 'பொதியில்லாத', 'abstrakt': 'கருத்தியலான', 'hilfreich': 'உதவிகரமான', 'bekannt': 'அறியப்பட்ட / பிரபலமான',
        'wirtschaftlich': 'பொருளாதார', 'unbezahlt': 'ஊதியமற்ற', 'KI-generiert': 'செயற்கை நுண்ணறிவால் உருவாக்கப்பட்ட',
    },
}

# --- ISO 15919 transliteration (the style most existing ta_translit values use: ச = c, ழ = ḻ, long vowels ā ī ū ē ō) ---
CONS = {'க': 'k', 'ங': 'ṅ', 'ச': 'c', 'ஞ': 'ñ', 'ட': 'ṭ', 'ண': 'ṇ', 'த': 't', 'ந': 'n', 'ப': 'p', 'ம': 'm', 'ய': 'y',
        'ர': 'r', 'ல': 'l', 'வ': 'v', 'ழ': 'ḻ', 'ள': 'ḷ', 'ற': 'ṟ', 'ன': 'ṉ', 'ஜ': 'j', 'ஷ': 'ṣ', 'ஸ': 's', 'ஹ': 'h'}
VOW = {'அ': 'a', 'ஆ': 'ā', 'இ': 'i', 'ஈ': 'ī', 'உ': 'u', 'ஊ': 'ū', 'எ': 'e', 'ஏ': 'ē', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'ō', 'ஔ': 'au', 'ஃ': 'ḵ'}
SIGN = {'ா': 'ā', 'ி': 'i', 'ீ': 'ī', 'ு': 'u', 'ூ': 'ū', 'ெ': 'e', 'ே': 'ē', 'ை': 'ai', 'ொ': 'o', 'ோ': 'ō', 'ௌ': 'au'}


def translit(ta):
    out, i = [], 0
    while i < len(ta):
        ch = ta[i]
        if ch in CONS:
            nxt = ta[i + 1] if i + 1 < len(ta) else ''
            if nxt == '்':
                out.append(CONS[ch]); i += 2; continue
            if nxt in SIGN:
                out.append(CONS[ch] + SIGN[nxt]); i += 2; continue
            out.append(CONS[ch] + 'a'); i += 1; continue
        out.append(VOW.get(ch, ch)); i += 1
    return ''.join(out)


KIND = {'VERBS': 'v', 'ALL_VERBS': 'v', 'VERBS_ALL': 'v', 'NOUNS': 'n', 'ADJS': 'a'}


def main():
    check = '--check' in sys.argv
    changed_total, wrong = 0, []
    for fname in sorted(f for f in os.listdir(ROOT) if f.endswith('.html')):
        path = os.path.join(ROOT, fname)
        html = open(path, encoding='utf-8').read()
        spans = sorted(array_spans(html), key=lambda x: -x[1])
        changed = False
        for name, s, e in spans:
            if name not in KIND:
                continue
            try:
                entries = json.loads(html[s:e])
            except ValueError:
                continue
            kind, key = KIND[name], ARRAYS[name][1]
            fixes = CORRECTIONS[kind]
            n = 0
            for entry in entries:
                w = entry.get(key)
                if w in fixes and entry.get('ta') and (entry['ta'] != fixes[w] or entry.get('ta_translit') != translit(fixes[w])):
                    if check:
                        wrong.append(f'{fname}:{name}:{w}')
                        continue
                    entry['ta'] = fixes[w]
                    entry['ta_translit'] = translit(fixes[w])
                    n += 1
            if n:
                html = html[:s] + json.dumps(entries, ensure_ascii=False, separators=(',', ':')) + html[e:]
                changed = True
                changed_total += n
                print(f'{fname}: {name} {n} Tamil values corrected')
        if changed and not check:
            open(path, 'w', encoding='utf-8').write(html)
    if check:
        if wrong:
            print('Tamil values that were corrected in Task 32 are wrong again (run scripts/fix_tamil.py):', ', '.join(wrong[:10]))
            sys.exit(1)
        print('OK: corrected Tamil values in place.')
    else:
        print(f'{changed_total} Tamil values corrected across all copies.')


if __name__ == '__main__':
    main()
