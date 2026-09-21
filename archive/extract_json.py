import re
import os
import json

if not os.path.exists("data"):
    os.makedirs("data")

# Extract the arrays from Wortschatz_Master_Grid.html (since it probably has all 3)
with open("Wortschatz_Master_Grid.html", "r", encoding="utf-8", errors="surrogateescape") as f:
    content = f.read()

verbs_match = re.search(r'const VERBS = (\[.*?\]);', content, re.DOTALL)
if verbs_match:
    with open("data/verbs.json", "w", encoding="utf-8", errors="surrogateescape") as f:
        f.write(verbs_match.group(1))

nouns_match = re.search(r'const NOUNS = (\[.*?\]);', content, re.DOTALL)
if nouns_match:
    with open("data/nouns.json", "w", encoding="utf-8", errors="surrogateescape") as f:
        f.write(nouns_match.group(1))

adjs_match = re.search(r'const ADJEKTIVE = (\[.*?\]);', content, re.DOTALL)
if adjs_match:
    with open("data/adjectives.json", "w", encoding="utf-8", errors="surrogateescape") as f:
        f.write(adjs_match.group(1))

# Check Deutsch_Wortschatz_Excel_Sheet.html if any are missing
if not verbs_match or not nouns_match or not adjs_match:
    with open("Deutsch_Wortschatz_Excel_Sheet.html", "r", encoding="utf-8", errors="surrogateescape") as f:
        content2 = f.read()
    if not verbs_match:
        m = re.search(r'const VERBS = (\[.*?\]);', content2, re.DOTALL)
        if m: open("data/verbs.json", "w", encoding="utf-8").write(m.group(1))
    if not nouns_match:
        m = re.search(r'const NOUNS = (\[.*?\]);', content2, re.DOTALL)
        if m: open("data/nouns.json", "w", encoding="utf-8").write(m.group(1))
    if not adjs_match:
        m = re.search(r'const (?:ADJEKTIVE|ADJS) = (\[.*?\]);', content2, re.DOTALL)
        if m: open("data/adjectives.json", "w", encoding="utf-8").write(m.group(1))

print("Extraction complete.")
