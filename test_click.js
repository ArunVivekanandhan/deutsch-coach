const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('Grammatik_Regel_Trainer.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });

setTimeout(() => {
    try {
        // mock what app-shell does
        const existingContent = dom.window.document.body.innerHTML;
        dom.window.document.body.innerHTML = `<div id="mainContent">${existingContent}</div>`;
        
        // now try to click the button
        const btn = Array.from(dom.window.document.querySelectorAll('button')).find(b => b.textContent.includes('View My Grammar Weaknesses'));
        if (btn) {
            btn.click();
            console.log("Modal display after click:", dom.window.document.getElementById('grammarVaultModal').style.display);
        } else {
            console.log("Button not found");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}, 500);
