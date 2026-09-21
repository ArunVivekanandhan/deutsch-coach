import os
import glob
import re

# 1. Strip legacy hub-links and theme toggle buttons
legacy_files = [
    "Continuous_Verb_Speaker.html",
    "German_Grammar_Cheat_Codes.html",
    "KI_German_Coach.html",
    "KI_Human_Partner.html",
    "Nomen_Adjektiv_Trainer.html",
    "Satzbau_Trainer.html",
    "Sprech_Pruefungs_Simulator.html",
    "Verb_Transformation_Trainer.html"
]

for filename in legacy_files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find <div class="hub-links"> ... </div>
    # Using dotall to match across newlines
    # Need to be careful to match the outer div
    # Actually, a simple approach is to find `<div class="hub-links">` and the `</div>` that closes it.
    # Then also remove the button that has `toggleDarkMode()`.
    
    # Let's use regex that matches the exact block since they are mostly identical
    # They usually look like:
    # <div class="hub-links">
    #   ... links ...
    # </div>
    # <button onclick="toggleDarkMode()" ...>...</button>
    
    # Or they are enclosed in an outer div?
    # Let's just remove the <div class="hub-links"> and everything inside it up to its closing </div>
    content = re.sub(r'<div class="hub-links">.*?</div>', '', content, flags=re.DOTALL)
    
    # And remove the toggleDarkMode button
    content = re.sub(r'<button[^>]*onclick="toggleDarkMode\(\)"[^>]*>.*?</button>', '', content, flags=re.DOTALL)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Cleaned up legacy UI in {filename}")

# 2. Fix window.onload -> DOMContentLoaded
onload_files = [
    "Einstellungen_Setup.html",
    "German_Grammar_Cheat_Codes.html",
    "Hoerverstehen_Diktat_Trainer.html",
    "Sprech_Pruefungs_Simulator.html"
]

for filename in onload_files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find `window.onload = function_name;`
    # Replace with robust readyState check
    
    # Find `window.onload = init;` or `window.onload = function() { ... }`
    # For `Einstellungen_Setup.html`, `window.onload = loadSettings;`
    # For `German_Grammar_Cheat_Codes.html`, `window.onload = function() {`
    # For `Hoerverstehen_Diktat_Trainer.html`, `window.onload = init;`
    # For `Sprech_Pruefungs_Simulator.html`, `window.onload = function(){`
    
    if "window.onload = loadSettings;" in content:
        content = content.replace("window.onload = loadSettings;", """if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSettings);
} else {
  loadSettings();
}""")
    
    if "window.onload = init;" in content:
        content = content.replace("window.onload = init;", """if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}""")
        
    # For anonymous functions, it's slightly harder.
    # Let's replace `window.onload = function()` with `document.addEventListener('DOMContentLoaded', function()`
    # Actually, a better way for anonymous functions is to define it as `function initPage() { ... }` and call it.
    
    if filename == "German_Grammar_Cheat_Codes.html":
        content = content.replace("window.onload = function() {", "document.addEventListener('DOMContentLoaded', function() {")
    if filename == "Sprech_Pruefungs_Simulator.html":
        content = content.replace("window.onload = function(){", "document.addEventListener('DOMContentLoaded', function(){")

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed initialization in {filename}")
