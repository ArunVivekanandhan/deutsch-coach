import re

with open("deutsch-coach.html", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the renderView else block
old_else = """    } else {
        document.getElementById("langToggleBtn").innerHTML = window.langPref === 'en' ? '🇺🇸 EN' : '🇮🇳 TA';
    }"""
    
new_else = """    } else {
        let dLabel = "🔀 MIXED";
        if(window.cardDir === 'en2de') dLabel = "🇬🇧 EN→DE";
        if(window.cardDir === 'de2en') dLabel = "🇩🇪 DE→EN";
        if(document.getElementById("dirToggleBtn")) {
            document.getElementById("dirToggleBtn").innerHTML = dLabel;
        }
        document.getElementById("langToggleBtn").innerHTML = window.langPref === 'en' ? '🇺🇸 EN' : '🇮🇳 TA';
    }"""

# For safety, just regex match it
content = re.sub(r'\} else \{\s+document\.getElementById\("langToggleBtn"\)\.innerHTML = [^\}]+\}', new_else, content)

with open("deutsch-coach.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated else branch")
