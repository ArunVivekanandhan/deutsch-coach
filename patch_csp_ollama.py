import re

# 1. Fix Ollama Port in Grammatik_Regel_Trainer.html
with open('Grammatik_Regel_Trainer.html', 'r', encoding='utf-8') as f:
    grt_content = f.read()

grt_content = grt_content.replace('http://localhost:8080/v1/chat/completions', 'http://localhost:11434/v1/chat/completions')

with open('Grammatik_Regel_Trainer.html', 'w', encoding='utf-8') as f:
    f.write(grt_content)

# 2. Update CSP in index.html and app-shell.js
extra_csp = "https://api.deepseek.com https://api.groq.com https://openrouter.ai http://localhost:11434"

def patch_csp(content):
    # Find the connect-src directive and append the new domains if not there
    match = re.search(r"connect-src 'self' ([^;]+);", content)
    if match:
        existing = match.group(1)
        if "api.deepseek.com" not in existing:
            new_connect = f"connect-src 'self' {existing} {extra_csp};"
            content = content.replace(match.group(0), new_connect)
    return content

with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()
idx_content = patch_csp(idx_content)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx_content)

with open('js/app-shell.js', 'r', encoding='utf-8') as f:
    shell_content = f.read()
shell_content = patch_csp(shell_content)
with open('js/app-shell.js', 'w', encoding='utf-8') as f:
    f.write(shell_content)

print("CSP and Ollama Port Patched.")
