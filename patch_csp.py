import re
import glob

csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; connect-src \'self\' https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com; img-src \'self\' data:; media-src \'self\' data: blob:;">'

# 1. Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    idx_content = f.read()

if "Content-Security-Policy" not in idx_content:
    idx_content = idx_content.replace("<head>", f"<head>\n  {csp}")
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(idx_content)

# 2. Update app-shell.js
with open("js/app-shell.js", "r", encoding="utf-8") as f:
    shell = f.read()

shell_csp_inject = f"""    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {{
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = "Content-Security-Policy";
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com; img-src 'self' data:; media-src 'self' data: blob:;";
        document.head.appendChild(cspMeta);
    }}"""

if "Content-Security-Policy" not in shell:
    shell = shell.replace("// Inject Mobile & PWA tags if not present", f"{shell_csp_inject}\n\n    // Inject Mobile & PWA tags if not present")
    with open("js/app-shell.js", "w", encoding="utf-8") as f:
        f.write(shell)

print("Injected CSP into index.html and app-shell.js")
