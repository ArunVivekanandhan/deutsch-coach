const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('deutsch-coach.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => console.error("JS Error:", err));

const dom = new JSDOM(html, { runScripts: "dangerously", virtualConsole, url: "http://localhost/" });

setTimeout(() => {
    const catBar = dom.window.document.getElementById("catBar");
    console.log("catBar HTML:", catBar.innerHTML);
}, 1000);
