import os
import re

# 1. Update app-shell.js to add AI enabled class
app_shell_path = "js/app-shell.js"
with open(app_shell_path, 'r', encoding='utf-8') as f:
    shell = f.read()

ai_logic = """
// Check AI Status globally
function checkAIStatus() {
    const provider = localStorage.getItem('de_ai_provider') || 'deepseek';
    let enabled = false;
    if (provider === 'ollama') {
        enabled = true;
    } else {
        enabled = !!localStorage.getItem('de_ai_key_' + provider);
    }
    
    if (enabled) {
        document.body.classList.add('ai-enabled');
    } else {
        document.body.classList.remove('ai-enabled');
    }
}
checkAIStatus();
"""

if "checkAIStatus" not in shell:
    shell += "\n" + ai_logic
    with open(app_shell_path, 'w', encoding='utf-8') as f:
        f.write(shell)
    print("Updated app-shell.js")

# 2. Update design-system.css
css_path = "css/design-system.css"
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

ai_css = """
/* Hide AI Features if API Key not configured */
body:not(.ai-enabled) .ai-feature {
    display: none !important;
}
"""

if ".ai-feature" not in css:
    css += "\n" + ai_css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated design-system.css")

# 3. Add .ai-feature class to specific AI buttons in HTML files
# We will use regex to find the buttons that say "KI", "AI", or call specific functions.

def add_class_to_buttons(filename, regex, new_class="ai-feature"):
    if not os.path.exists(filename): return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will replace `class="..."` with `class="... ai-feature"`
    # Or add class if it doesn't exist
    def replacer(match):
        button_html = match.group(0)
        if "ai-feature" in button_html:
            return button_html
        if 'class="' in button_html:
            return button_html.replace('class="', f'class="{new_class} ', 1)
        else:
            return button_html.replace('<button', f'<button class="{new_class}"', 1)
            
    new_content = re.sub(regex, replacer, content)
    if new_content != content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added ai-feature to {filename}")

# Nomen: `onclick="callAIMnemonic(...)`
add_class_to_buttons("Nomen_Adjektiv_Trainer.html", r'<button[^>]*onclick="callAIMnemonic[^>]*>.*?</button>')

# Satzbau: `<button id="btnAiExp"`
add_class_to_buttons("Satzbau_Trainer.html", r'<button[^>]*id="btnAiExp"[^>]*>.*?</button>')

# Verb Transformation: `onclick="getAITip()"`
add_class_to_buttons("Verb_Transformation_Trainer.html", r'<button[^>]*onclick="getAITip\(\)"[^>]*>.*?</button>')

# Grammar: `id="aiExpBtn"`
add_class_to_buttons("Grammatik_Regel_Trainer.html", r'<button[^>]*id="aiExpBtn"[^>]*>.*?</button>')

# Konnektoren: AI Builder tab `id="tabBuild"`
# Wait, Konnektoren Builder is a whole tab. We should hide the tab itself!
add_class_to_buttons("konnektoren_referenz.html", r'<div[^>]*id="tabBuild"[^>]*>.*?</div>')
