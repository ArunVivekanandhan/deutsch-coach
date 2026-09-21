import re

with open("js/app-shell.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the computation block
old_block = r"""        // Calculate mock stats \(or actual stats\) for the header
        const prog = JSON\.parse\(localStorage\.getItem\('dc_progress_v1'\) \|\| '\{\}'\);
        let due = 0, hard = 0, newCount = 0, mastered = 0;
        const now = Date\.now\(\);
        for\(let k in prog\) \{ 
            if\(prog\[k\]\.nextReview && prog\[k\]\.nextReview < now\) due\+\+;
        \}"""

new_block = """        // Calculate actual stats for the header
        let due = 0, hard = 0, newCount = 0;
        let mastered = totalMastered; // reusing totalMastered calculated above
        const now = Date.now();
        
        // Helper to count stats across DBs
        const countStats = (prog) => {
            for(let k in prog) {
                if (prog[k].nextReview && prog[k].nextReview < now) due++;
                if (prog[k].box <= 1) hard++;
            }
        };
        
        countStats(dcProg);
        countStats(naProg);
        countStats(wmgProg);
        
        // Estimate new count: Assume total DB size ~ 1500 (A1+A2+B1). New = Total - Seen
        const totalSeen = Object.keys(dcProg).length + Object.keys(naProg).length + Object.keys(wmgProg).length;
        const ESTIMATED_TOTAL = 1500;
        newCount = Math.max(0, ESTIMATED_TOTAL - totalSeen);"""

content = re.sub(old_block, new_block, content)

with open("js/app-shell.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched app-shell.js")
