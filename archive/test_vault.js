const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('Grammatik_Regel_Trainer.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });

setTimeout(() => {
    try {
        dom.window.localStorage.setItem('de_grammar_vault', JSON.stringify([]));
        dom.window.showGrammarVault();
        console.log("Called showGrammarVault successfully. Modal display:", dom.window.document.getElementById('grammarVaultModal').style.display);
    } catch (e) {
        console.error("Error calling showGrammarVault:", e);
    }
}, 500);
