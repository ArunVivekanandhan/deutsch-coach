import re

def restore_vars(file_path, old_file_path, start_str, end_str):
    with open(file_path, "r", encoding="utf-8") as f:
        current = f.read()
    
    with open(old_file_path, "r", encoding="utf-16") as f:
        old = f.read()
        
    s_idx = old.find(start_str)
    e_idx = old.find(end_str)
    if s_idx == -1 or e_idx == -1:
        print(f"Could not find markers in {old_file_path}")
        return
        
    block = old[s_idx:e_idx]
    
    # Check if they are already restored
    if start_str in current:
        print(f"Variables already present in {file_path}")
        return
        
    target = 'const dcEngine = new SRSEngine'
    if target in current:
        current = current.replace(target, block + "\n" + target)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(current)
        print(f"Restored variables into {file_path}")
    else:
        print(f"Could not find target in {file_path}")

restore_vars("Verb_Transformation_Trainer.html", "old_vtt.html", "const LEVELS =", "/* ---- persistence ---- */")
restore_vars("Nomen_Adjektiv_Trainer.html", "old_nat.txt", "let curMode =", "/* ---- persistence ---- */")
