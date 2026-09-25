# -*- coding: utf-8 -*-
"""Open every page in a headless Chromium (served over http, like the real app) and fail on any
JavaScript error. Also checks that the shared word lists reach the pages that use them.

Run: python3 scripts/smoke_pages.py        (needs: pip install playwright; python -m playwright install chromium)
"""
import functools, glob, http.server, os, sys, threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
from playwright.sync_api import sync_playwright  # noqa: E402

# Pages that must see the shared word lists (js/word-data.js), with the global they read.
WORD_PAGES = {'Verb_Transformation_Trainer.html': 'VERBS', 'Nomen_Trainer.html': 'NOUNS',
              'Adjektiv_Adverb_Trainer.html': 'ADJS', 'Deutsch_Wortschatz_Excel_Sheet.html': 'VERBS',
              'Wortschatz_Master_Grid.html': 'NOUNS', 'Continuous_Verb_Speaker.html': 'ALL_VERBS',
              'Thema_Sprech_Trainer.html': 'VERBS_ALL'}


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve():
    handler = functools.partial(QuietHandler, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def launch(p):
    try:
        return p.chromium.launch(args=['--no-sandbox'])
    except Exception:
        for exe in glob.glob('/opt/pw-browsers/chromium-*/chrome-linux/chrome'):
            return p.chromium.launch(executable_path=exe, args=['--no-sandbox'])
        raise


def main():
    srv = serve()
    base = f'http://127.0.0.1:{srv.server_address[1]}/'
    pages = sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))
    failed = []
    with sync_playwright() as p:
        browser = launch(p)
        for f in pages:
            page = browser.new_page()
            errs = []
            page.on('pageerror', lambda e, errs=errs: errs.append(str(e).split('\n')[0]))
            try:
                page.goto(base + f, wait_until='load', timeout=30000)
                page.wait_for_timeout(1200)
                if f in WORD_PAGES:
                    n = page.evaluate(f'() => (typeof {WORD_PAGES[f]} !== "undefined" && {WORD_PAGES[f]}.length) || 0')
                    if not n:
                        errs.append(f'{WORD_PAGES[f]} is empty - js/word-data.js not loaded?')
            except Exception as e:
                errs.append(f'could not load: {e}'.split('\n')[0])
            print(('FAIL ' if errs else 'ok   ') + f + ('' if not errs else ': ' + ' | '.join(errs[:3])))
            if errs:
                failed.append(f)
            page.close()
        browser.close()
    srv.shutdown()
    if failed:
        print(f'{len(failed)} of {len(pages)} pages have JavaScript errors')
        sys.exit(1)
    print(f'All {len(pages)} pages load without JavaScript errors.')


if __name__ == '__main__':
    main()
