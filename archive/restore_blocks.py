import re
import subprocess

def get_git_file(commit, filename):
    result = subprocess.run(["git", "show", f"{commit}:{filename}"], capture_output=True)
    return result.stdout.decode('utf-8')

def restore_blocks(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        current_content = f.read()

    old_content = get_git_file("22f33d5", file_path)

    start_marker = "function pool(){"
    end_marker = "/* ---- Session card ---- */"
    
    start_idx = old_content.find(start_marker)
    end_idx = old_content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print(f"Could not find markers in git history for {file_path}")
        return
        
    block_to_restore = old_content[start_idx:end_idx]
    
    if "/* ---- Session card ---- */" in current_content:
        target_idx = current_content.find("/* ---- Session card ---- */")
    elif "function typLabel" in current_content:
        target_idx = current_content.find("function typLabel")
    elif "function renderCard" in current_content:
        target_idx = current_content.find("function renderCard")
    else:
        print(f"Could not find injection point in {file_path}")
        return
        
    if "function refreshAll(){ renderChips(); renderDash(); }" in current_content:
        current_content = current_content.replace("function refreshAll(){ renderChips(); renderDash(); }\n\n", "")
    if "function refreshAll(){ renderChips(); renderDash(); renderRuleRef(); }" in current_content:
        current_content = current_content.replace("function refreshAll(){ renderChips(); renderDash(); renderRuleRef(); }\n\n", "")
        
    new_content = current_content[:target_idx] + "/* ---- filtering & UI ---- */\n" + block_to_restore + current_content[target_idx:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Restored block into {file_path}")

restore_blocks("Verb_Transformation_Trainer.html")
restore_blocks("Nomen_Adjektiv_Trainer.html")
