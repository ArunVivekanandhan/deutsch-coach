import sys

with open('Grammatik_Regel_Trainer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove UNIFIED DEUTSCH-COACH SUITE HUB
hub_start = content.find('<!-- Suite Navigation Hub -->')
hub_end = content.find('<h1>German Grammar &amp; Rules Trainer</h1>')
if hub_start != -1 and hub_end != -1:
    content = content[:hub_start] + content[hub_end:]

# 2. Refactor Modetabs
old_modetabs = '''  <!-- Mode Tabs -->
  <div class="modetabs">
    <div class="modetab active" id="tabStudy" onclick="switchMode('study')">📚 Rule Guide &amp; Tables</div>
    <div class="modetab" id="tabDrill" onclick="switchMode('drill')">⚡ Interactive Practice Drill</div>
    <div class="modetab" id="tabStats" onclick="switchMode('stats')">📈 Mastery &amp; Progress</div>
  </div>'''

new_modetabs = '''  <!-- Mode Tabs -->
  <div class="ds-tabs" style="margin-bottom: var(--space-lg);">
    <div class="ds-tab active" id="tabStudy" onclick="switchMode('study')" style="cursor:pointer; padding: 12px 24px; font-weight: 600; border-radius: var(--radius-md); transition: all 0.2s; background: var(--color-surface); border: 1px solid var(--color-border);">📚 Rule Guide &amp; Tables</div>
    <div class="ds-tab" id="tabDrill" onclick="switchMode('drill')" style="cursor:pointer; padding: 12px 24px; font-weight: 600; border-radius: var(--radius-md); transition: all 0.2s; background: var(--color-surface); border: 1px solid var(--color-border);">⚡ Interactive Practice Drill</div>
    <div class="ds-tab" id="tabStats" onclick="switchMode('stats')" style="cursor:pointer; padding: 12px 24px; font-weight: 600; border-radius: var(--radius-md); transition: all 0.2s; background: var(--color-surface); border: 1px solid var(--color-border);">📈 Mastery &amp; Progress</div>
  </div>
  
  <style>
    .ds-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .ds-tab.active { background: var(--color-primary) !important; color: white !important; border-color: var(--color-primary) !important; }
    .ds-tab:not(.active):hover { border-color: var(--color-primary); color: var(--color-primary); }
  </style>'''
content = content.replace(old_modetabs, new_modetabs)

# 3. Refactor Filterbox
old_filterbox = '''  <!-- Rule Filter Chips -->
  <div class="filterbox">
    
    <div class="filterlabel">Select German Grammar Pillar:</div>
    <div style="margin-bottom:8px;"><button onclick="toggleWeaknessVault()" id="btnWeakness" class="subtab" style="background:var(--red); color:#fff; border-color:var(--red-dark);">🔥 Drill Weaknesses (Box 1-2)</button> <button onclick="showGrammarVault()" class="subtab" style="background:var(--ink); color:#fff;">📚 View My Grammar Weaknesses</button></div>
    <div class="chiprow" id="ruleChips"></div>

  </div>'''

new_filterbox = '''  <!-- Rule Filter Chips -->
  <div class="filterbox" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-xl); box-shadow: var(--shadow-sm);">
    
    <div class="filterlabel" style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-ink-soft); font-weight: 600; margin-bottom: var(--space-md);">Select German Grammar Pillar:</div>
    <div style="margin-bottom:var(--space-md); display:flex; gap:8px;">
        <button onclick="toggleWeaknessVault()" id="btnWeakness" class="ds-btn ds-btn-primary" style="background: #ef4444; border-color: #ef4444; font-size:13px;">🔥 Drill Weaknesses (Box 1-2)</button> 
        <button onclick="showGrammarVault()" class="ds-btn ds-btn-secondary" style="font-size:13px;">📚 View My Grammar Weaknesses</button>
    </div>
    
    <!-- CSS Grid for Pillars -->
    <div class="chiprow" id="ruleChips" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;"></div>
  </div>'''
content = content.replace(old_filterbox, new_filterbox)

# 4. Refactor toggleDarkMode function inside JS since it was requested to be removed
toggle_dark_code = '''function toggleDarkMode() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
  localStorage.setItem('de_theme', isDark ? "light" : "dark");
}
if(localStorage.getItem('de_theme') === 'dark') document.body.setAttribute("data-theme", "dark");'''
content = content.replace(toggle_dark_code, '')

with open('Grammatik_Regel_Trainer.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
