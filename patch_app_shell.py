import re

with open("js/app-shell.js", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("var savedTheme = localStorage.getItem('de_theme');\nif (savedTheme === 'dark') {\n    document.body.setAttribute('data-theme', 'dark');\n    document.body.classList.add('dark');\n}", 
"""{
    const theme = localStorage.getItem('de_theme');
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
    }
}""")

with open("js/app-shell.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched app-shell.js")
