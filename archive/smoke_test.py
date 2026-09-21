import asyncio
from playwright.async_api import async_playwright
import glob
import os
import http.server
import socketserver
import threading

PORT = 8080
DIRECTORY = os.getcwd()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("Serving at port", PORT)
        httpd.serve_forever()

async def run(playwright):
    browser = await playwright.chromium.launch()
    page = await browser.new_page()
    
    html_files = glob.glob("*.html")
    errors = []

    page.on("pageerror", lambda err: errors.append(f"Page Error: {err}"))
    page.on("console", lambda msg: errors.append(f"Console {msg.type}: {msg.text}") if msg.type in ['error'] else None)

    for file in html_files:
        print(f"Testing {file}...")
        try:
            await page.goto(f"http://localhost:{PORT}/{file}", wait_until="networkidle")
        except Exception as e:
            errors.append(f"Failed to load {file}: {e}")

    await browser.close()
    
    if errors:
        print("\n❌ Smoke Test Failed with the following errors:")
        for err in errors:
            # Filter out some known non-critical errors like missing favicons
            if "favicon.ico" not in err:
                print(err)
    else:
        print("\n✅ Smoke Test Passed! No console errors found.")

async def main():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    async with async_playwright() as playwright:
        await run(playwright)

if __name__ == "__main__":
    asyncio.run(main())
