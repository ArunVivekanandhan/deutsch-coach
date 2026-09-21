import re

with open("deutsch-coach.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace renderDirToggle
old_render = """function renderDirToggle() {
  let label = "🔀 MIXED";
  if(window.cardDir === 'en2de') label = "🇬🇧 EN→DE";
  if(window.cardDir === 'de2en') label = "🇩🇪 DE→EN";
  return `<button class="togglebtn" id="dirToggleBtn" style="margin-left: 8px; border-color: var(--blue); color: var(--blue); font-weight: bold;">
            ${label}
          </button>`;
}"""

new_render = """function renderDirToggle() {
  const dir = window.cardDir || 'mixed';
  return `
  <div class="segmented-control" id="dirSegmented" style="margin-left:8px; display:flex; background:var(--line); padding:3px; border-radius:10px; font-size:11px; font-weight:bold;">
    <button class="seg-btn ${dir==='en2de'?'active':''}" data-dir="en2de" title="Englisch -> Deutsch">🇬🇧 EN→DE</button>
    <button class="seg-btn ${dir==='mixed'?'active':''}" data-dir="mixed" title="Mixed Spaced Repetition">🔀 MIXED</button>
    <button class="seg-btn ${dir==='de2en'?'active':''}" data-dir="de2en" title="Deutsch -> Englisch">🇩🇪 DE→EN</button>
  </div>
  <style>
    .seg-btn {
      background: transparent;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--ink-soft);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      font-weight: 700;
    }
    .seg-btn:hover { color: var(--ink); }
    .seg-btn.active {
      background: var(--paper);
      color: var(--blue);
      box-shadow: 0 2px 5px rgba(0,0,0,0.08);
    }
  </style>
  `;
}"""

# 2. Replace bindDirToggle
old_bind = """function bindDirToggle() {
  const btn = document.getElementById("dirToggleBtn");
  if(btn) {
    btn.onclick = () => {
      if(window.cardDir === 'mixed') window.cardDir = 'en2de';
      else if(window.cardDir === 'en2de') window.cardDir = 'de2en';
      else window.cardDir = 'mixed';
      localStorage.setItem('dc_cardDir', window.cardDir);
      renderView();
    };
  }
}"""

new_bind = """function bindDirToggle() {
  const container = document.getElementById("dirSegmented");
  if(container) {
    container.querySelectorAll(".seg-btn").forEach(btn => {
      btn.onclick = (e) => {
        window.cardDir = e.target.dataset.dir;
        localStorage.setItem('dc_cardDir', window.cardDir);
        renderView();
      };
    });
  }
}"""

content = content.replace(old_render, new_render)
content = content.replace(old_bind, new_bind)

# 3. Replace the else block logic in renderView
old_else = """    } else {
        let dLabel = "🔀 MIXED";
        if(window.cardDir === 'en2de') dLabel = "🇬🇧 EN→DE";
        if(window.cardDir === 'de2en') dLabel = "🇩🇪 DE→EN";
        if(document.getElementById("dirToggleBtn")) {
            document.getElementById("dirToggleBtn").innerHTML = dLabel;
        }
        document.getElementById("langToggleBtn").innerHTML = window.langPref === 'en' ? '🇺🇸 EN' : '🇮🇳 TA';
    }"""

new_else = """    } else {
        if(document.getElementById("dirSegmented")) {
            document.querySelectorAll("#dirSegmented .seg-btn").forEach(b => b.classList.remove('active'));
            const activeBtn = document.querySelector(`#dirSegmented .seg-btn[data-dir="${window.cardDir}"]`);
            if(activeBtn) activeBtn.classList.add('active');
        }
        document.getElementById("langToggleBtn").innerHTML = window.langPref === 'en' ? '🇺🇸 EN' : '🇮🇳 TA';
    }"""

content = content.replace(old_else, new_else)

with open("deutsch-coach.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated to segmented control")
