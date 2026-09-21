import sys

with open('Grammatik_Regel_Trainer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Robust Init
old_init = "window.onload = init;"
new_init = """if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}"""
content = content.replace(old_init, new_init)

# 2. Refactor Rule Chips rendering
old_chip = '''      <div class="chip ${active}" onclick="selectRule('${r.id}')">
        <span class="dot" style="background:${r.color};"></span>
        <span>${r.id==='alle' ? '🔥 All 16 Rules Mixed' : `Rule ${r.num}: ${r.title.split('(')[0].trim()}`}</span>
      </div>'''

new_chip = '''      <div class="ds-card ${active}" onclick="selectRule('${r.id}')" style="cursor:pointer; display:flex; flex-direction:column; gap:4px; padding:12px; border:2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}; background:var(--color-surface); transition:all 0.2s;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="width:10px; height:10px; border-radius:50%; background:${r.color}; display:inline-block;"></span>
          <span style="font-weight:700; font-size:12px; color:var(--color-ink-soft);">${r.id==='alle' ? 'MIXED' : `RULE ${r.num}`}</span>
        </div>
        <div style="font-size:14px; font-weight:600; color:var(--color-ink); line-height:1.2;">
          ${r.id==='alle' ? 'All 16 Rules Mixed Marathon' : r.title.split('(')[0].trim()}
        </div>
      </div>'''
content = content.replace(old_chip, new_chip)

with open('Grammatik_Regel_Trainer.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
