import glob
import re

html_files = glob.glob("*.html")

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    scripts_to_move = [
        r'<script src="\./assets/js/gamification\.js"></script>',
        r'<script src="js/icon-svgs\.js"></script>',
        r'<script src="js/srs-engine\.js"></script>',
        r'<script src="js/tamil-dict\.js"></script>',
        r'<script src="js/app-shell\.js"></script>',
        r'<script src="js/lucide\.min\.js"></script>',
    ]
    
    extracted_scripts = []
    
    for pat in scripts_to_move:
        match = re.search(pat, content)
        if match:
            extracted_scripts.append(match.group(0))
            content = content.replace(match.group(0) + '\n', '')
            content = content.replace(match.group(0), '') # in case no newline
            
    if extracted_scripts:
        # Join them
        scripts_block = '  ' + '\n  '.join(extracted_scripts) + '\n'
        
        # Insert them right before </head>
        if '</head>' in content:
            content = content.replace('</head>', scripts_block + '</head>')
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Moved scripts to <head> in {file_path}")
