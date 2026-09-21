import os
import re

def patch_file(filename, replacements):
    if not os.path.exists(filename): return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != orig:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filename}")

# Nomen Adjektiv
patch_file("Nomen_Adjektiv_Trainer.html", {
    'class="quick-tool-btn" style="margin-bottom:8px; display:inline-block;" onclick="requestMnemonicAI': 
    'class="quick-tool-btn ai-feature" style="margin-bottom:8px; display:inline-block;" onclick="requestMnemonicAI'
})

# Satzbau
patch_file("Satzbau_Trainer.html", {
    '<button id="btnAiExp"': '<button id="btnAiExp" class="ai-feature"'
})

# Verb Transformation
patch_file("Verb_Transformation_Trainer.html", {
    'class="btn-hint" onclick="getAITip()"': 'class="btn-hint ai-feature" onclick="getAITip()"'
})

# Grammatik
patch_file("Grammatik_Regel_Trainer.html", {
    '<button id="aiExpBtn" class="drill-submit"': '<button id="aiExpBtn" class="drill-submit ai-feature"'
})

# Konnektoren Builder Tab
patch_file("konnektoren_referenz.html", {
    '<div class="ds-tab" id="tabBuild" onclick="setTab(\'build\')">🤖 AI Sentence Builder</div>':
    '<div class="ds-tab ai-feature" id="tabBuild" onclick="setTab(\'build\')">🤖 AI Sentence Builder</div>'
})

print("Done patching AI buttons.")
