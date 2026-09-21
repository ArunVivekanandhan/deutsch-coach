import re

for file_path in ["Verb_Transformation_Trainer.html", "Nomen_Adjektiv_Trainer.html"]:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove the conflicting const declarations
    content = re.sub(r'const todayISO = SRSEngine\.todayISO;\s*', '', content)
    content = re.sub(r'const addDays = SRSEngine\.addDaysISO;\s*', '', content)
    
    # Replace function calls
    content = re.sub(r'(?<!function )todayISO\(', 'SRSEngine.todayISO(', content)
    content = re.sub(r'(?<!function )addDays\(', 'SRSEngine.addDaysISO(', content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed todayISO and addDays in {file_path}")
