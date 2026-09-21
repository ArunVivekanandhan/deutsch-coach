import re

def restore_block_nat():
    file_path = "Nomen_Adjektiv_Trainer.html"
    with open(file_path, "r", encoding="utf-8") as f:
        current_content = f.read()

    with open("old_nat.txt", "r", encoding="utf-16") as f:
        old_content = f.read()

    start_marker = "function pool(){"
    end_marker = "/* ---- meaning box ---- */"
    
    start_idx = old_content.find(start_marker)
    end_idx = old_content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print(f"Could not find markers in git history for {file_path}")
        return
        
    block_to_restore = old_content[start_idx:end_idx]
    
    if "/* ---- meaning box ---- */" in current_content:
        target_idx = current_content.find("/* ---- meaning box ---- */")
    elif "function meaningHTML" in current_content:
        target_idx = current_content.find("function meaningHTML")
    elif "function renderCard" in current_content:
        target_idx = current_content.find("function renderCard")
    else:
        print(f"Could not find injection point in {file_path}")
        return
        
    if "function refreshAll(){ renderChips(); renderDash(); renderRuleRef(); }" in current_content:
        current_content = current_content.replace("function refreshAll(){ renderChips(); renderDash(); renderRuleRef(); }\n\n", "")
        
    new_content = current_content[:target_idx] + "/* ---- filtering & UI ---- */\n" + block_to_restore + current_content[target_idx:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Restored block into {file_path}")

restore_block_nat()
