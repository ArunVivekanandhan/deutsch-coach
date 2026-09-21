import sys

with open('Grammatik_Regel_Trainer.html', 'r', encoding='utf-8') as f:
    content = f.read()

broken = """      fbBox.innerHTML = `<strong>🤖 KI-Erklärung:</strong><br>${exp.replace(/\\n/g, '<br>')}`;"""
# wait, wait! It's literally broken across lines in the file.
# let's just find "exp.replace(/" and "/g, '<br>')"

lines = content.split('\n')
for i, line in enumerate(lines):
    if "exp.replace(/" in line and lines[i+1].startswith("/g, '<br>')}"):
        lines[i] = line.replace("exp.replace(/", r"exp.replace(/\n") + lines[i+1]
        lines[i+1] = "DELETE_ME"

new_content = '\n'.join([l for l in lines if l != "DELETE_ME"])

with open('Grammatik_Regel_Trainer.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Fixed newline bug.")
