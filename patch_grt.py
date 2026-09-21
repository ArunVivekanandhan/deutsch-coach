import re

with open("Grammatik_Regel_Trainer.html", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(
    r"\.stats-row\{\s*display:grid; grid-template-columns:repeat\(4,1fr\); gap:6px; margin-bottom:14px; text-align:center;\s*\}",
    r".stats-row{ display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:14px; text-align:center; } @media (max-width: 480px) { .stats-row { grid-template-columns:repeat(2,1fr); } }",
    content
)

with open("Grammatik_Regel_Trainer.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
