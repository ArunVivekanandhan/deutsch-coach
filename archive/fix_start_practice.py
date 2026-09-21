import re

def fix_start_practice(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the anonymous startBtn listener
    target = "document.getElementById('startBtn').addEventListener('click', ()=>{"
    if target in content:
        content = content.replace(target, "function startPractice(){")
        
        # also remove the trailing `});` that ends this block.
        # It's right after `renderCard();`
        content = re.sub(r'renderCard\(\);\s*\}\);', r'renderCard();\n}', content)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed startPractice in {file_path}")
    else:
        print(f"Target not found in {file_path}")

fix_start_practice("Verb_Transformation_Trainer.html")
fix_start_practice("Nomen_Adjektiv_Trainer.html")
