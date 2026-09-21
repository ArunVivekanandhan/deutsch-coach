import re
import glob
import os

def sync_data():
    with open("data/verbs.json", "r", encoding="utf-8", errors="surrogateescape") as f:
        verbs = f.read().strip()
    with open("data/nouns.json", "r", encoding="utf-8", errors="surrogateescape") as f:
        nouns = f.read().strip()
    with open("data/adjectives.json", "r", encoding="utf-8", errors="surrogateescape") as f:
        adjs = f.read().strip()

    html_files = glob.glob("*.html")
    
    for fname in html_files:
        if fname == "deutsch-coach.html":
            continue

        with open(fname, "r", encoding="utf-8", errors="surrogateescape") as f:
            content = f.read()

        original = content

        def repl_verb(m): return f"const {m.group(1)} = {verbs};"
        def repl_noun(m): return f"const NOUNS = {nouns};"
        def repl_adj(m): return f"const {m.group(1)} = {adjs};"

        content = re.sub(r'const (VERBS|ALL_VERBS)\s*=\s*\[.*?\];', repl_verb, content, flags=re.DOTALL)
        content = re.sub(r'const NOUNS\s*=\s*\[.*?\];', repl_noun, content, flags=re.DOTALL)
        content = re.sub(r'const (ADJEKTIVE|ADJS)\s*=\s*\[.*?\];', repl_adj, content, flags=re.DOTALL)

        if content != original:
            with open(fname, "w", encoding="utf-8", errors="surrogateescape") as f:
                f.write(content)
            print(f"Synced and updated {fname}")
        else:
            # Check if it even has the arrays to begin with
            if "const VERBS" in original or "const NOUNS" in original or "const ADJ" in original:
                print(f"Verified byte-identical for {fname}")

if __name__ == "__main__":
    sync_data()
