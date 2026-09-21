import re
import glob

def patch_trainer(filename, progress_key):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract SVGs if present
    svg_match = re.search(r'(const ICON_SVGS = \{[\s\S]*?\n\};\n)', content)
    if svg_match:
        content = content.replace(svg_match.group(1), "")

    # Inject SVG and SRSEngine scripts
    if '<script src="js/icon-svgs.js"></script>' not in content:
        content = content.replace('<script src="js/app-shell.js"></script>', '<script src="js/icon-svgs.js"></script>\n  <script src="js/srs-engine.js"></script>\n  <script src="js/app-shell.js"></script>')
        # If it doesn't use app-shell.js at the end, just inject before </body>
        if '<script src="js/icon-svgs.js"></script>' not in content:
            content = content.replace('</body>', '<script src="js/icon-svgs.js"></script>\n  <script src="js/srs-engine.js"></script>\n</body>')

    srs_shim = f"""const dcEngine = new SRSEngine.Engine("{progress_key}", null);
let PROGRESS = dcEngine.db;

const todayISO = SRSEngine.todayISO;
const addDays = SRSEngine.addDaysISO;
const BOX_SCHEDULE = {{1:0,2:1,3:3,4:7,5:14}};

function getProg(uid) {{ return dcEngine.getProg(uid); }}
function saveProgress() {{ dcEngine.save(); }}
function isDue(uid) {{ return dcEngine.isDue(uid); }}
function isNew(uid) {{ const p = dcEngine.db[uid]; return !p || !p.timesSeen; }}
"""

    # We need to replace `const LS_KEY = ...` up to `function isNew(uid)...`
    # Let's find exactly how the blocks are written.
    if 'const LS_KEY = "' in content:
        block_regex = r'const LS_KEY = "[^"]+";[\s\S]*?function isNew\(uid\)\{[^\}]*\}'
        if re.search(block_regex, content):
            content = re.sub(block_regex, srs_shim, content)
            
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Patched {filename}")

patch_trainer("Verb_Transformation_Trainer.html", "vt_progress_v1")
patch_trainer("Nomen_Adjektiv_Trainer.html", "na_progress_v1")
