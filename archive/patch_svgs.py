import re

def extract_svgs():
    with open("deutsch-coach.html", "r", encoding="utf-8") as f:
        content = f.read()

    svg_match = re.search(r'(const ICON_SVGS = \{[\s\S]*?\n\};\n)', content)
    if svg_match:
        svg_code = svg_match.group(1)
        with open("js/icon-svgs.js", "w", encoding="utf-8") as f:
            f.write(svg_code)
            
        # Replace it in deutsch-coach.html
        new_content = content.replace(svg_code, "")
        
        # Inject script tag
        if '<script src="js/icon-svgs.js"></script>' not in new_content:
            new_content = new_content.replace('<script src="js/app-shell.js"></script>', '<script src="js/icon-svgs.js"></script>\n  <script src="js/srs-engine.js"></script>\n  <script src="js/app-shell.js"></script>')
            
        with open("deutsch-coach.html", "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Extracted ICON_SVGS from deutsch-coach.html")
    else:
        print("ICON_SVGS not found in deutsch-coach.html")

extract_svgs()
