import re

with open("index.html", "r", encoding="utf-8") as f:
    idx_content = f.read()

# Add script to calculate index.html stats correctly at the bottom of the file before </body>
dashboard_script = """
<script>
document.addEventListener("DOMContentLoaded", () => {
    const dcProg = JSON.parse(localStorage.getItem('dc_progress_v1') || '{}');
    const naProg = JSON.parse(localStorage.getItem('na_progress_v1') || '{}');
    const wmgProg = JSON.parse(localStorage.getItem('wmg_progress_v1') || '{}');
    
    let totalMastered = 0;
    for (let k in dcProg) { if (dcProg[k].box >= 4) totalMastered++; }
    for (let k in naProg) { if (naProg[k].box >= 4) totalMastered++; }
    for (let k in wmgProg) { if (wmgProg[k].box >= 4) totalMastered++; }
    
    const A1_MAX = 150, A2_MAX = 250, B11_MAX = 300, B12_MAX = 300;
    
    let rem = totalMastered;
    let a1Pct = Math.min(100, Math.round((rem / A1_MAX) * 100)); rem -= A1_MAX; if (rem < 0) rem = 0;
    let a2Pct = Math.min(100, Math.round((rem / A2_MAX) * 100)); rem -= A2_MAX; if (rem < 0) rem = 0;
    let b11Pct = Math.min(100, Math.round((rem / B11_MAX) * 100)); rem -= B11_MAX; if (rem < 0) rem = 0;
    let b12Pct = Math.min(100, Math.round((rem / B12_MAX) * 100));
    
    const update = (idPct, idBar, val) => {
        const txt = document.getElementById(idPct);
        const bar = document.getElementById(idBar);
        if (txt) txt.textContent = val + "%";
        if (bar) bar.style.width = val + "%";
    };
    
    update("a1-pct-txt", "a1-pct-bar", a1Pct);
    update("a2-pct-txt", "a2-pct-bar", a2Pct);
    update("b11-pct-txt", "b11-pct-bar", b11Pct);
    update("b12-pct-txt", "b12-pct-bar", b12Pct);
});
</script>
</body>"""

idx_content = idx_content.replace("</body>", dashboard_script)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(idx_content)
    
print("Injected dashboard progress script into index.html")
