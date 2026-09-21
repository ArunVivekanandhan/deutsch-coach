import re

srs_shim_verb = """
/* ---- persistence & SRS ---- */
const dcEngine = new SRSEngine.Engine("vt_progress_v1", null);
let PROGRESS = dcEngine.db;

const todayISO = SRSEngine.todayISO;
const addDays = SRSEngine.addDaysISO;
const BOX_SCHEDULE = {1:0,2:1,3:3,4:7,5:14};

function getProg(uid) { return dcEngine.getProg(uid); }
function saveProgress() { dcEngine.save(); }
function isDue(uid) { return dcEngine.isDue(uid); }
function isNew(uid) { const p = dcEngine.db[uid]; return !p || !p.timesSeen; }
function isDifficult(uid){ const p = PROGRESS[uid]; return p && p.timesWrong>=2; }
function isMastered(uid){ const p = PROGRESS[uid]; return p && p.box>=4; }
"""

srs_shim_noun = """
/* ---- persistence & SRS ---- */
const dcEngine = new SRSEngine.Engine("na_progress_v1", null);
let PROGRESS = dcEngine.db;

const todayISO = SRSEngine.todayISO;
const addDays = SRSEngine.addDaysISO;
const BOX_SCHEDULE = {1:0,2:1,3:3,4:7,5:14};

function getProg(uid) { return dcEngine.getProg(uid); }
function saveProgress() { dcEngine.save(); }
function isDue(uid) { return dcEngine.isDue(uid); }
function isNew(uid) { const p = dcEngine.db[uid]; return !p || !p.timesSeen; }
function isDifficult(uid){ const p = PROGRESS[uid]; return p && p.timesWrong>=2; }
function isMastered(uid){ const p = PROGRESS[uid]; return p && p.box>=4; }
"""

def inject_srs(file_path, shim):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Also wrap missing DOM elements with if(elem) checks
    content = content.replace("gc.innerHTML = ", "if(gc) gc.innerHTML = ")
    content = content.replace("gc.querySelectorAll", "if(gc) gc.querySelectorAll")
    
    if "const dcEngine = new SRSEngine" not in content:
        target = "/* ---- filtering & UI ---- */"
        if target in content:
            content = content.replace(target, shim + "\n" + target)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Injected SRS shim into {file_path}")
        else:
            print(f"Could not find target in {file_path}")
    else:
        print(f"SRS already present in {file_path}")

inject_srs("Verb_Transformation_Trainer.html", srs_shim_verb)
inject_srs("Nomen_Adjektiv_Trainer.html", srs_shim_noun)
