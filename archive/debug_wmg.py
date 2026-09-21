import asyncio
from playwright.async_api import async_playwright
import os
import http.server
import socketserver
import threading

PORT = 8081
DIRECTORY = os.getcwd()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

async def run(playwright):
    browser = await playwright.chromium.launch()
    page = await browser.new_page()
    
    file = "Wortschatz_Master_Grid.html"
    
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))
    page.on("console", lambda msg: print(f"Console {msg.type}: {msg.text}") if msg.type in ['error'] else None)

    try:
        await page.goto(f"http://localhost:{PORT}/{file}", wait_until="networkidle")
        print("Page loaded.")
    except Exception as e:
        print(f"Failed to load {file}: {e}")

    await browser.close()
    
async def main():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    async with async_playwright() as playwright:
        await run(playwright)

if __name__ == "__main__":
    asyncio.run(main())
