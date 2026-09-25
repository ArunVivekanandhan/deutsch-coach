import glob
import re
import urllib.request
import os
import sys

# This script lives in scripts/ but operates on the repo root (relative
# paths for sw.js, *.html, etc. assume that cwd) - so make it runnable
# from anywhere rather than only from inside scripts/.
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

# 1. Update sw.js automatically
html_files = glob.glob("*.html")
assets = ['./js/srs-engine.js', './js/german-conjugation.js', './js/memory-tips.js', './js/word-parts.js', './js/icon-svgs.js', './js/tamil-dict.js', './js/tts-engine.js', './js/progress-aggregator.js', "./css/design-system.css", "./js/app-shell.js", "./js/lucide.min.js", "./icon-192.png", "./icon-512.png", "./manifest.json"]
urls_to_cache = ["./", "./index.html"] + [f"./{f}" for f in html_files if f != "index.html"] + assets

with open("sw.js", "r", encoding="utf-8", errors="surrogateescape") as f:
    sw_content = f.read()

# Replace the urlsToCache array
new_array_str = "const urlsToCache = [\n  " + ",\n  ".join(f"'{u}'" for u in urls_to_cache) + "\n];"
sw_content = re.sub(r'const urlsToCache = \[.*?\];', new_array_str, sw_content, flags=re.DOTALL)

# Bump version
def bump_version(m):
    ver = int(m.group(1))
    return f"const CACHE_NAME = 'deutsch-coach-v{ver+1}';"
sw_content = re.sub(r"const CACHE_NAME = 'deutsch-coach-v(\d+)';", bump_version, sw_content)

with open("sw.js", "w", encoding="utf-8", errors="surrogateescape") as f:
    f.write(sw_content)
print(f"Updated sw.js with {len(urls_to_cache)} files.")

# 2. Simple Smoke Test
print("\nRunning smoke tests...")
errors = 0
for f in html_files:
    content = open(f, encoding="utf-8", errors="surrogateescape").read()
    if "<script" in content and "</script>" not in content:
        print(f"[ERROR] Syntax Error in {f}: Unclosed script tag")
        errors += 1
    if "https://unpkg.com/lucide@latest" in content:
        print(f"[ERROR] Security Warning in {f}: Loads lucide from unpkg instead of local")
        errors += 1

if errors == 0:
    print("[SUCCESS] All HTML files passed basic static checks.")
else:
    sys.exit(1)

# 3. Word lists are copied into several pages -- make sure no copy has drifted.
import subprocess
sync = subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "check_vocab_sync.py")])
if sync.returncode != 0:
    sys.exit(1)

# 4. Home flashcards must not miss a form (Präteritum/Perfekt, plural, Steigerung) the master lists have.
forms = subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "fill_home_forms.py"), "--check"])
if forms.returncode != 0:
    sys.exit(1)

# 5. js/word-parts.js (syllables + word parts for every word) must match the current word lists.
parts = subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "build_word_parts.py"), "--check"])
if parts.returncode != 0:
    sys.exit(1)

# 6. Tamil values corrected in Task 32 (substring-matching bug) must stay corrected in every copy.
tamil = subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "fix_tamil.py"), "--check"])
if tamil.returncode != 0:
    sys.exit(1)
