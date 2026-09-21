import re

def fix_refreshAll(filename, func_def):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    if "function refreshAll()" not in content:
        # replace the call `refreshAll();` with the definition and the call
        target = "refreshAll();"
        replacement = f"{func_def}\n\n{target}"
        if target in content:
            content = content.replace(target, replacement)
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Fixed refreshAll in {filename}")
        else:
            print(f"Could not find refreshAll() call in {filename}")

fix_refreshAll("Verb_Transformation_Trainer.html", "function refreshAll(){ renderChips(); renderDash(); }")
fix_refreshAll("Nomen_Adjektiv_Trainer.html", "function refreshAll(){ renderChips(); renderDash(); renderRuleRef(); }")
