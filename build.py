import glob
import re
import urllib.request
import os
import sys

# 1. Update sw.js automatically
html_files = glob.glob("*.html")
assets = ["./css/design-system.css", "./js/app-shell.js", "./js/lucide.min.js", "./icon-192.png", "./icon-512.png", "./manifest.json"]
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
