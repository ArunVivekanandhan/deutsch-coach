import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace hardcoded bars with ID-driven ones
replacements = {
    r'<div class="progress-label"><span>A1 Foundation</span><span>100%</span></div>\s*<div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 100%;"></div></div>':
    '<div class="progress-label"><span>A1 Foundation</span><span id="a1-pct-txt">0%</span></div>\n            <div class="progress-bar-bg"><div id="a1-pct-bar" class="progress-bar-fill" style="width: 0%;"></div></div>',
    
    r'<div class="progress-label"><span>A2 Basics</span><span>85%</span></div>\s*<div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 85%;"></div></div>':
    '<div class="progress-label"><span>A2 Basics</span><span id="a2-pct-txt">0%</span></div>\n            <div class="progress-bar-bg"><div id="a2-pct-bar" class="progress-bar-fill" style="width: 0%;"></div></div>',
    
    r'<div class="progress-label"><span>B1.1 Intermediate</span><span>40%</span></div>\s*<div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 40%;"></div></div>':
    '<div class="progress-label"><span>B1.1 Intermediate</span><span id="b11-pct-txt">0%</span></div>\n            <div class="progress-bar-bg"><div id="b11-pct-bar" class="progress-bar-fill" style="width: 0%;"></div></div>',
    
    r'<div class="progress-label"><span>B1.2 Advanced</span><span>5%</span></div>\s*<div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 5%;"></div></div>':
    '<div class="progress-label"><span>B1.2 Advanced</span><span id="b12-pct-txt">0%</span></div>\n            <div class="progress-bar-bg"><div id="b12-pct-bar" class="progress-bar-fill" style="width: 0%;"></div></div>',
}

for old, new in replacements.items():
    content = re.sub(old, new, content)

# Inject computation script at end of body
script_inject = """
<script>
document.addEventListener('DOMContentLoaded', () => {
    const dcProg = JSON.parse(localStorage.getItem('dc_progress_v1') || '{}');
    const naProg = JSON.parse(localStorage.getItem('na_progress_v1') || '{}');
    const wmgProg = JSON.parse(localStorage.getItem('wmg_progress_v1') || '{}');
    let totalMastered = 0;
    for (let k in dcProg) { if (dcProg[k].box >= 4) totalMastered++; }
    for (let k in naProg) { if (naProg[k].box >= 4) totalMastered++; }
    for (let k in wmgProg) { if (wmgProg[k].box >= 4) totalMastered++; }

    const A1_MAX = 150;
    const A2_MAX = 250;
    const B11_MAX = 300;
    const B12_MAX = 300;

    let rem = totalMastered;
    let a1Pct = Math.min(100, Math.round((rem / A1_MAX) * 100)); rem -= A1_MAX; if (rem < 0) rem = 0;
    let a2Pct = Math.min(100, Math.round((rem / A2_MAX) * 100)); rem -= A2_MAX; if (rem < 0) rem = 0;
    let b11Pct = Math.min(100, Math.round((rem / B11_MAX) * 100)); rem -= B11_MAX; if (rem < 0) rem = 0;
    let b12Pct = Math.min(100, Math.round((rem / B12_MAX) * 100));

    if(document.getElementById('a1-pct-txt')) {
        document.getElementById('a1-pct-txt').textContent = a1Pct + '%';
        document.getElementById('a1-pct-bar').style.width = a1Pct + '%';
        
        document.getElementById('a2-pct-txt').textContent = a2Pct + '%';
        document.getElementById('a2-pct-bar').style.width = a2Pct + '%';
        
        document.getElementById('b11-pct-txt').textContent = b11Pct + '%';
        document.getElementById('b11-pct-bar').style.width = b11Pct + '%';
        
        document.getElementById('b12-pct-txt').textContent = b12Pct + '%';
        document.getElementById('b12-pct-bar').style.width = b12Pct + '%';
    }
});
</script>
"""

if "a1-pct-txt" not in content:
    content = content.replace("</body>", script_inject + "\n</body>")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched index.html")
