import re

with open("js/app-shell.js", "r", encoding="utf-8") as f:
    content = f.read()

simple_mode_logic = """
    // Apply Simple Mode globally
    if (localStorage.getItem('de_simple_mode') === 'true') {
        document.body.classList.add('simple-mode');
    }
"""

content = content.replace("function renderAppShell() {\n    // Inject dependencies on every page", "function renderAppShell() {\n" + simple_mode_logic + "    // Inject dependencies on every page")

with open("js/app-shell.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated app-shell.js")
