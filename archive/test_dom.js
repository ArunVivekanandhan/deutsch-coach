const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('Grammatik_Regel_Trainer.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.error("JS Error:", err);
});
virtualConsole.on("jsdomError", (err) => {
  console.error("JSDOM Error:", err);
});
virtualConsole.on("log", (msg) => {
  console.log("Log:", msg);
});

const dom = new JSDOM(html, { runScripts: "dangerously", virtualConsole });
