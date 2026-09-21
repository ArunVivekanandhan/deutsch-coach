import re

files = ["Verb_Transformation_Trainer.html", "Nomen_Adjektiv_Trainer.html"]
for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Fix garbled text
    content = content.replace("à®¤à®®à®¿à®´à¯ ", "தமிழ்")
    content = content.replace("â†’", "→")
    content = content.replace("Â·", "·")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed encoding issues in {file_path}")
