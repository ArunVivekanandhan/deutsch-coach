import os
import re

filename = "deutsch-coach.html"
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add window.cardDir global
if "window.cardDir" not in content:
    content = content.replace("window.langPref = localStorage.getItem('dc_langPref') || 'en';", 
"""window.langPref = localStorage.getItem('dc_langPref') || 'en';
window.cardDir = localStorage.getItem('dc_cardDir') || 'mixed'; // 'mixed', 'en2de', 'de2en'""")

# 2. Add renderRecallDe2En
recall_de2en = """
function renderRecallDe2En(card, advanceFn){
  const stripe = `<div class="stripe ${card.cat}"></div>`;
  const box = PROGRESS[card.uid] ? BOX_NAME[PROGRESS[card.uid].box] : "Neu";
  const displayMeaning = window.langPref === 'ta' && card.ta ? card.ta : card.en;
  return {
    html: `
    ${difficultBanner(card)}
    <div class="studycard">
      ${stripe}
      ${metaHTML(card)}
      <div class="qlabel">Deutsch → Englisch &nbsp;•&nbsp; 📦 ${box}</div>
      <div class="prompt">
        ${promptIconHTML(card)}
        ${card.a?`<div class="artikel-tag">${card.a}</div>`:""}
        <div class="word" style="cursor:pointer;" onclick="const rb=document.getElementById('revealBtn'); if(rb)rb.click();">${card.w} <button onclick="playTTS('${card.w.replace(/'/g, "\\'")}', event)" style="background:none;border:none;cursor:pointer;font-size:20px;vertical-align:middle;margin-left:8px;" title="Speak">🔊</button></div>
        <div class="subq">Was bedeutet das? • What does this mean?</div>
      </div>
      <div id="cardBtnGroup" style="display:flex; gap:8px; padding:0 18px 14px;">
        <button class="thinkbtn" id="revealBtn" style="flex:2; margin:0;">Antwort zeigen 👁️ • Reveal</button>
        <button class="thinkbtn" id="skipCardBtn" style="flex:1; margin:0; background:var(--paper); border:1.5px solid var(--line); color:var(--ink-soft);" title="Skip to next card">⏭ Weiter</button>
      </div>
      <div id="revealArea"></div>
    </div>`,
    afterRender(){
      document.getElementById("revealBtn").onclick = ()=>{
        // For De->En, info panel can stay same, but we show the meaning prominently
        const meaningHtml = `<div style="text-align:center; font-size:22px; font-weight:700; margin-bottom:12px; color:var(--purple);">${displayMeaning}</div>`;
        document.getElementById("revealArea").innerHTML = meaningHtml + renderInfoPanel(card) + renderAnswerButtons(card.uid);
        document.getElementById("cardBtnGroup").style.display="none";
        wireAnswerButtons(card, advanceFn, "recall_de2en");
      };
      const skipBtn = document.getElementById("skipCardBtn");
      if(skipBtn) skipBtn.onclick = advanceFn;
    }
  };
}
"""
if "renderRecallDe2En" not in content:
    content = content.replace("function renderMcDe2En(card, advanceFn){", recall_de2en + "\nfunction renderMcDe2En(card, advanceFn){")

# 3. Update TYPE_RENDERERS
if "recall_de2en: renderRecallDe2En" not in content:
    content = content.replace("recall_meaning: renderRecallMeaning,", "recall_meaning: renderRecallMeaning,\n  recall_de2en: renderRecallDe2En,")

# 4. Update validTypesFor
valid_types_old = """function validTypesFor(card){
  // Nouns -> meaning + article + plural + context. Verbs -> meaning + tenses + context.
  // Adjectives -> meaning + context. Every word always allows plain meaning recall + MC.
  const types = ["recall_meaning","mc_de2en","mc_en2de"];"""
valid_types_new = """function validTypesFor(card){
  let types = [];
  if (window.cardDir === 'en2de') {
      types = ["recall_meaning", "mc_en2de", "recall_meaning"];
  } else if (window.cardDir === 'de2en') {
      types = ["recall_de2en", "mc_de2en", "recall_de2en"];
  } else {
      types = ["recall_meaning", "recall_de2en", "mc_de2en", "mc_en2de"];
  }"""
if valid_types_new not in content:
    content = content.replace(valid_types_old, valid_types_new)

# 5. Add UI toggle button
toggle_functions = """
function renderDirToggle() {
  let label = "🔀 MIXED";
  if(window.cardDir === 'en2de') label = "🇬🇧 EN→DE";
  if(window.cardDir === 'de2en') label = "🇩🇪 DE→EN";
  return `<button class="togglebtn" id="dirToggleBtn" style="margin-left: 8px; border-color: var(--blue); color: var(--blue); font-weight: bold;">
            ${label}
          </button>`;
}

function bindDirToggle() {
  const btn = document.getElementById("dirToggleBtn");
  if(btn) {
    btn.onclick = () => {
      if(window.cardDir === 'mixed') window.cardDir = 'en2de';
      else if(window.cardDir === 'en2de') window.cardDir = 'de2en';
      else window.cardDir = 'mixed';
      localStorage.setItem('dc_cardDir', window.cardDir);
      renderView();
    };
  }
}
"""
if "renderDirToggle" not in content:
    content = content.replace("function renderLangToggle() {", toggle_functions + "\nfunction renderLangToggle() {")

# 6. Inject toggle into catBar
inject_old = """        catBar.insertAdjacentHTML('beforeend', renderLangToggle());
        bindLangToggle();"""
inject_new = """        catBar.insertAdjacentHTML('beforeend', renderDirToggle());
        bindDirToggle();
        catBar.insertAdjacentHTML('beforeend', renderLangToggle());
        bindLangToggle();"""
if "renderDirToggle()" not in content:
    content = content.replace(inject_old, inject_new)

    update_old = """        document.getElementById("langToggleBtn").innerHTML = window.langPref === 'en' ? '🇬🇧 EN' : '🇮🇳 TA';"""
    update_new = """        let dLabel = "🔀 MIXED";
        if(window.cardDir === 'en2de') dLabel = "🇬🇧 EN→DE";
        if(window.cardDir === 'de2en') dLabel = "🇩🇪 DE→EN";
        document.getElementById("dirToggleBtn").innerHTML = dLabel;
        document.getElementById("langToggleBtn").innerHTML = window.langPref === 'en' ? '🇬🇧 EN' : '🇮🇳 TA';"""
    content = content.replace(update_old, update_new)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated deutsch-coach.html with direction toggle")
