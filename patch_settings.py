import re

with open("Einstellungen_Setup.html", "r", encoding="utf-8") as f:
    content = f.read()

preferences_html = """
      <h2>📚 Learning Preferences</h2>
      <div class="help-text" style="margin-bottom: 16px;">Customize how the trainers behave for a smoother experience.</div>
      
      <div class="form-group" style="display:flex; align-items:center; justify-content:space-between; background:var(--paper-dark); padding:16px; border-radius:8px; margin-bottom:12px;">
        <div>
          <div style="font-weight:700;">Simple Mode (Zen UI)</div>
          <div style="font-size:12px; color:var(--ink-soft); margin-top:4px;">Hides advanced filters and enlarges buttons for an easier mobile experience.</div>
        </div>
        <input type="checkbox" id="simpleModeToggle" style="width:24px; height:24px;" onchange="localStorage.setItem('de_simple_mode', this.checked); if(this.checked) document.body.classList.add('simple-mode'); else document.body.classList.remove('simple-mode');">
      </div>

      <div class="form-group" style="display:flex; align-items:center; justify-content:space-between; background:var(--paper-dark); padding:16px; border-radius:8px; margin-bottom:12px;">
        <div>
          <div style="font-weight:700;">Hands-Free (Auto-Audio)</div>
          <div style="font-size:12px; color:var(--ink-soft); margin-top:4px;">Automatically play Text-to-Speech audio when a new card is drawn.</div>
        </div>
        <input type="checkbox" id="autoAudioToggle" style="width:24px; height:24px;" onchange="localStorage.setItem('de_auto_audio', this.checked)">
      </div>

      <div class="form-group" style="display:flex; align-items:center; justify-content:space-between; background:var(--paper-dark); padding:16px; border-radius:8px; margin-bottom:32px;">
        <div>
          <div style="font-weight:700;">Progressive Hints</div>
          <div style="font-size:12px; color:var(--ink-soft); margin-top:4px;">Tap reveal multiple times to get partial letter hints before showing the answer.</div>
        </div>
        <input type="checkbox" id="progressiveHintsToggle" style="width:24px; height:24px;" onchange="localStorage.setItem('de_progressive_hints', this.checked)">
      </div>
"""

content = content.replace("<h2>🤖 AI Engine & API Keys</h2>", preferences_html + "\n      <h2>🤖 AI Engine & API Keys</h2>")

script_addition = """
  // Load Preferences
  document.getElementById('simpleModeToggle').checked = localStorage.getItem('de_simple_mode') === 'true';
  document.getElementById('autoAudioToggle').checked = localStorage.getItem('de_auto_audio') === 'true';
  document.getElementById('progressiveHintsToggle').checked = localStorage.getItem('de_progressive_hints') === 'true';
"""

content = content.replace("// Load Settings", script_addition + "\n  // Load Settings")

with open("Einstellungen_Setup.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Einstellungen_Setup.html")
