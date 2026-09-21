import re

with open("js/app-shell.js", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the counting logic
old_block = r"""        // Helper to count stats across DBs
        const countStats = \(prog\) => \{
            for\(let k in prog\) \{
                if \(prog\[k\]\.nextReview && prog\[k\]\.nextReview < now\) due\+\+;
                if \(prog\[k\]\.box <= 1\) hard\+\+;
            \}
        \};"""

new_block = """        // Helper to count stats across DBs
        const countStats = (prog) => {
            const today = new Date();
            const todayStr = today.getFullYear()+"-"+String(today.getMonth()+1).padStart(2,"0")+"-"+String(today.getDate()).padStart(2,"0");
            
            for(let k in prog) {
                const p = prog[k];
                // Support both date formats that exist across the old apps
                if (p.nextDue && p.nextDue <= todayStr) {
                    due++;
                } else if (p.nextReview && p.nextReview < now) {
                    due++;
                }
                
                if (p.box <= 1) hard++;
            }
        };"""

content = re.sub(old_block, new_block, content)

with open("js/app-shell.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed app-shell date comparison logic.")
