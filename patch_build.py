with open('build.py', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('assets = [', "assets = ['./js/srs-engine.js', './js/icon-svgs.js', './js/tamil-dict.js', ")
with open('build.py', 'w', encoding='utf-8') as f:
    f.write(c)
