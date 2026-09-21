import re

with open("deutsch-coach.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Progressive hints in renderRecallMeaning
# Locate the `afterRender` block of `renderRecallMeaning`
recall_meaning_afterRender = """
    afterRender(){
      let hintState = 0;
      document.getElementById("revealBtn").onclick = ()=>{
        const isProgressive = localStorage.getItem('de_progressive_hints') === 'true';
        if (isProgressive && hintState < 2) {
          hintState++;
          const btn = document.getElementById("revealBtn");
          const area = document.getElementById("revealArea");
          
          if (hintState === 1) {
            btn.innerHTML = "Hint 2: Word Length 🔎";
            area.innerHTML = `<div class="revealbox" style="font-size:24px; color:var(--purple); text-align:center;">${card.en.charAt(0)} _ _ _ _</div>`;
          } else if (hintState === 2) {
            btn.innerHTML = "Reveal Answer 👁️";
            const masked = card.en.split(' ').map(w => w.charAt(0) + ' _ '.repeat(w.length-1)).join('   ');
            area.innerHTML = `<div class="revealbox" style="font-size:24px; color:var(--purple); text-align:center;">${masked}</div>`;
          }
          return;
        }

        const displayMeaning = (card.en && card.ta) ? 
          `<b>EN:</b> ${card.en}<br><b style="margin-top:4px;display:inline-block;">TA:</b> ${card.ta}` : 
          (card.en || card.ta);
          
        const meaningHtml = `<div class="revealbox" style="font-size:22px; color:var(--purple);">${displayMeaning}</div>`;
        document.getElementById("revealArea").innerHTML = meaningHtml + renderInfoPanel(card) + renderAnswerButtons(card.uid);
        document.getElementById("cardBtnGroup").style.display="none";
        
        // If hints were used, don't allow "Gewusst" or "Easy", cap at "Nochmal" or "Hard"
        if (hintState > 0) {
           const btn2 = document.getElementById("btnGewusst");
           const btn3 = document.getElementById("btnEasy");
           if (btn2) { btn2.disabled = true; btn2.style.opacity = '0.4'; btn2.title = 'Disabled because hints were used'; }
           if (btn3) { btn3.disabled = true; btn3.style.opacity = '0.4'; btn3.title = 'Disabled because hints were used'; }
        }
        
        wireAnswerButtons(card, advanceFn, "recall_de2en");
      };
      
      if (localStorage.getItem('de_auto_audio') === 'true') {
         setTimeout(() => {
            if (window.playTTS) window.playTTS(card.w);
         }, 300);
      }
      
      const skipBtn = document.getElementById("skipCardBtn");
      if(skipBtn) skipBtn.onclick = advanceFn;
    }
"""

content = re.sub(r'afterRender\(\)\{\s*document\.getElementById\("revealBtn"\)\.onclick = \(\)=>\{[\s\S]*?if\(skipBtn\) skipBtn\.onclick = advanceFn;\s*\}', recall_meaning_afterRender.strip(), content, count=1, flags=re.DOTALL)

with open("deutsch-coach.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Injected progressive hints and auto-audio into deutsch-coach.html")
