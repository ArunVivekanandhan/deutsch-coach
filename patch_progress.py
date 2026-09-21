import re

filename = "js/app-shell.js"
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject the dynamic calculation right before `const body = document.body;`
calc_logic = """
    // --- Dynamic Level Progress Calculation ---
    const dcProg = JSON.parse(localStorage.getItem('dc_progress_v1') || '{}');
    const naProg = JSON.parse(localStorage.getItem('na_progress_v1') || '{}');
    const wmgProg = JSON.parse(localStorage.getItem('wmg_progress_v1') || '{}');
    
    let totalMastered = 0;
    // Count items that are in box 4 or 5 (Mastered/Known well)
    for (let k in dcProg) { if (dcProg[k].box >= 4) totalMastered++; }
    for (let k in naProg) { if (naProg[k].box >= 4) totalMastered++; }
    for (let k in wmgProg) { if (wmgProg[k].box >= 4) totalMastered++; }
    
    // Cascading progression thresholds
    const A1_MAX = 150;
    const A2_MAX = 250;
    const B11_MAX = 300;
    const B12_MAX = 300;
    
    let rem = totalMastered;
    let a1Pct = Math.min(100, Math.round((rem / A1_MAX) * 100)); rem -= A1_MAX; if (rem < 0) rem = 0;
    let a2Pct = Math.min(100, Math.round((rem / A2_MAX) * 100)); rem -= A2_MAX; if (rem < 0) rem = 0;
    let b11Pct = Math.min(100, Math.round((rem / B11_MAX) * 100)); rem -= B11_MAX; if (rem < 0) rem = 0;
    let b12Pct = Math.min(100, Math.round((rem / B12_MAX) * 100));
    // ------------------------------------------

    const body = document.body;"""

content = content.replace("    const body = document.body;", calc_logic)

# 2. Replace the hardcoded HTML with dynamic HTML
old_html = """                    <div class="level-progress-container">
                        <div class="progress-label"><span>A1 Foundation</span><span>100%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 100%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>A2 Basics</span><span>85%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 85%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>B1.1 Intermediate</span><span>40%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 40%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>B1.2 Advanced</span><span>5%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 5%;"></div></div>
                    </div>"""

new_html = """                    <div class="level-progress-container">
                        <div class="progress-label"><span>A1 Foundation</span><span>${a1Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${a1Pct}%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>A2 Basics</span><span>${a2Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${a2Pct}%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>B1.1 Intermediate</span><span>${b11Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${b11Pct}%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>B1.2 Advanced</span><span>${b12Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${b12Pct}%;"></div></div>
                    </div>"""

content = content.replace(old_html, new_html)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated app-shell.js with dynamic progress")
