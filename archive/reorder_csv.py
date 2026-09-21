import re
import sys

def process_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Reorder CSV headers
    old_csv_headers = """    const headers = [
      '#', 'Deutsches Wort', 'Wortart', 'Level', 'Artikel', 'Nomen', 'Verb Infinitiv', 
      'Praesens', 'Praeteritum', 'Perfekt', 'Adjektiv Form', 'Sister Verbs', 
      'English Meaning', 'Tamil Meaning', 'Tamil Translit', 'Thema', 'Merkhilfe'
    ];"""
    
    new_csv_headers = """    const headers = [
      '#', 'English Meaning', 'Deutsches Wort', 'Nomen', 'Praeteritum', 'Perfekt', 'Adjektiv Form',
      'Sister Verbs', 'Tamil Meaning', 'Tamil Translit', 'Thema', 'Merkhilfe',
      'Wortart', 'Level', 'Artikel', 'Verb Infinitiv', 'Praesens'
    ];"""

    content = content.replace(old_csv_headers, new_csv_headers)

    # Reorder CSV row
    old_csv_row = """      const row = [
        idx + 1,
        r.word,
        r.pos,
        r.level,
        r.gender,
        r.noun,
        r.verb,
        r.praesens,
        r.praet,
        r.perfekt,
        r.adj,
        r.sisters,
        r.en,
        r.ta,
        r.ta_translit,
        r.topic,
        r.mnemonic
      ];"""

    new_csv_row = """      const row = [
        idx + 1,
        r.en,
        r.word,
        r.noun,
        r.praet,
        r.perfekt,
        r.adj,
        r.sisters,
        r.ta,
        r.ta_translit,
        r.topic,
        r.mnemonic,
        r.pos,
        r.level,
        r.gender,
        r.verb,
        r.praesens
      ];"""

    content = content.replace(old_csv_row, new_csv_row)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Done")

process_html('Deutsch_Wortschatz_Excel_Sheet.html')
