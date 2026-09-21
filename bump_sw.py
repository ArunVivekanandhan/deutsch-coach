import re

with open("sw.js", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r"const CACHE_NAME = 'deutsch-coach-v\d+';", "const CACHE_NAME = 'deutsch-coach-v22';", content)

with open("sw.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated sw.js cache version")
