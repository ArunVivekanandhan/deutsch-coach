import re

with open("deutsch-coach.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace loadProgress, saveProgress, etc.
srs_shim = """const dcEngine = new SRSEngine.Engine("dc_progress_v1", "dc_meta_v1");
let PROGRESS = dcEngine.db;
let META = dcEngine.meta;

const todayISO = SRSEngine.todayISO;
const addDaysISO = SRSEngine.addDaysISO;
const BOX_SCHEDULE = {1:0, 2:1, 3:3, 4:7, 5:14};
const BOX_NAME = {1:"Neu", 2:"Lernt", 3:"Vertraut", 4:"Stark", 5:"Gemeistert"};

function getProgress(uid) { return dcEngine.getProg(uid); }
function saveProgress() { dcEngine.save(); }
function saveMeta() { dcEngine.saveMeta(); }
function bumpStreak() { dcEngine.bumpStreak(); }
function isDue(uid) { return dcEngine.isDue(uid); }

function recordAnswer(uid, correct, qType) {
  const p = getProgress(uid);
  p.timesSeen++;
  if(!p.firstSeen) p.firstSeen = todayISO();
  p.lastReviewed = todayISO();
  if(qType) p.lastQType = qType;
  
  if(correct){
    p.box = Math.min(5, p.box+1);
    p.timesCorrect = (p.timesCorrect||0)+1;
    p.lastResult = "correct";
  } else {
    p.box = 1;
    p.timesWrong = (p.timesWrong||0)+1;
    p.lastResult = "wrong";
  }
  const days = BOX_SCHEDULE[p.box] !== undefined ? BOX_SCHEDULE[p.box] : 30;
  p.nextDue = addDaysISO(days === 0 ? 0 : days);
  
  dcEngine.save();
  dcEngine.bumpStreak();
  META.totalReviewed = (META.totalReviewed||0)+1;
  dcEngine.saveMeta();
}"""

# Find the block from `const LS_PROGRESS_KEY` down to `function isNew(uid)` and replace it.
block_regex = r'const LS_PROGRESS_KEY = "dc_progress_v1";[\s\S]*?function isNew\(uid\)\{'
content = re.sub(block_regex, srs_shim + "\nfunction isNew(uid){", content)

with open("deutsch-coach.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched SRS in deutsch-coach.html")
