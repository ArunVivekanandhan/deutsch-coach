import sys
from bs4 import BeautifulSoup
import re

with open('deutsch-coach.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('js/app-shell.js', 'r', encoding='utf-8') as f:
    js = f.read()

html = html.replace('<script src="js/app-shell.js"></script>', f'<script>{js}</script>')

with open('test_inline.html', 'w', encoding='utf-8') as f:
    f.write(html)
