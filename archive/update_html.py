import os, re
import sys

file_path = 'Grammatik_Regel_Trainer.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace KI Erklärung with KI-Erklärung (Why is this wrong?)
content = content.replace('KI Erklärung', 'KI-Erklärung (Why is this wrong?)')
content = content.replace('KI Erklrung', 'KI-Erklärung (Why is this wrong?)')

# Update callAIGrammarExplanation function
new_callAI = '''async function callAIGrammarExplanation(promptText, callback) {
  const provider = localStorage.getItem('de_ai_provider') || 'groq';
  const apiKey = localStorage.getItem('de_ai_key_' + provider);
  
  let endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  let model = 'llama3-8b-8192';

  if (provider === 'openai') {
    endpoint = 'https://api.openai.com/v1/chat/completions';
    model = 'gpt-4o-mini';
  } else if (provider === 'ollama') {
    endpoint = localStorage.getItem('de_ai_endpoint_ollama') || 'http://localhost:8080/v1/chat/completions';
    model = localStorage.getItem('de_ai_model_ollama') || 'llama3';
  }
  
  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: promptText }]
      })
    });
    const data = await res.json();
    if(data.choices && data.choices.length>0) {
      callback(data.choices[0].message.content);
    } else {
      callback("AI Error: " + JSON.stringify(data));
    }
  } catch(e) {
    callback("Error connecting to AI: " + e.message);
  }
}'''
content = re.sub(r'async function callAIGrammarExplanation\(promptText, callback\).*?catch\(e\) \{\s*callback\(\"Error connecting to AI: \" \+ e\.message\);\s*\}\s*\}', new_callAI, content, flags=re.DOTALL)

# Update explainWrongAnswerAI
new_explainAI = '''function explainWrongAnswerAI(chosenOpt) {
  const fbBtn = document.getElementById("aiExplainBtn");
  if(fbBtn) fbBtn.innerText = "⏳ Loading...";
  
  const q = currentQuestion;
  const promptTxt = `I am learning German. I answered this grammar question incorrectly.
Sentence: "${q.prompt}"
Correct answer: "${q.options ? q.options[q.correct] : q.en}"
My incorrect answer: "${chosenOpt}"
Rule context: ${currentRule ? currentRule.summary : ''}

Briefly explain EXACTLY why my answer is wrong and why the correct answer is right. Keep it short and encouraging.`;

  callAIGrammarExplanation(promptTxt, (exp) => {
    const fbBox = document.getElementById("aiExplainBox");
    if(fbBox) {
      fbBox.innerHTML = `<strong>🤖 KI-Erklärung:</strong><br>${exp.replace(/\\n/g, '<br>')}`;
      fbBox.style.display = "block";
    }
    if(fbBtn) fbBtn.style.display = "none";
    
    const vault = JSON.parse(localStorage.getItem('de_grammar_vault') || '[]');
    vault.push({
      date: new Date().toISOString(),
      prompt: q.prompt,
      correct: q.options ? q.options[q.correct] : q.en,
      wrong: chosenOpt,
      explanation: exp
    });
    localStorage.setItem('de_grammar_vault', JSON.stringify(vault));
  });
}'''
content = re.sub(r'function explainWrongAnswerAI\(chosenOpt\).*?if\(fbBtn\) fbBtn\.style\.display = "none";\s*\}\);\s*\}', new_explainAI, content, flags=re.DOTALL)

# Add UI button/modal to view "My Grammar Weaknesses"
# I'll add the button next to "Drill Weaknesses"
btn_weakness_str = '<div style="margin-bottom:8px;"><button onclick="toggleWeaknessVault()" id="btnWeakness" class="subtab" style="background:var(--red); color:#fff; border-color:var(--red-dark);">🏋️ Drill Weaknesses (Box 1-2)</button></div>'
new_btn_str = btn_weakness_str.replace('</div>', ' <button onclick="showGrammarVault()" class="subtab" style="background:var(--ink); color:#fff;">📖 View My Grammar Weaknesses</button></div>')
content = content.replace(btn_weakness_str, new_btn_str)

# Add modal HTML and JS at the end of the body
modal_html = '''
<!-- Grammar Vault Modal -->
<div id="grammarVaultModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center; padding:20px; box-sizing:border-box;">
  <div style="background:var(--paper); width:100%; max-width:600px; max-height:80vh; overflow-y:auto; border-radius:8px; padding:20px; position:relative;">
    <button onclick="document.getElementById('grammarVaultModal').style.display='none'" style="position:absolute; top:10px; right:10px; background:var(--red); color:#fff; border:none; border-radius:4px; padding:5px 10px; cursor:pointer;">Close</button>
    <h2 style="margin-top:0; font-family:'Fjalla One',sans-serif; color:var(--ink);">📖 My Grammar Weaknesses</h2>
    <div id="grammarVaultContent"></div>
  </div>
</div>
'''

vault_js = '''
function showGrammarVault() {
  const vault = JSON.parse(localStorage.getItem('de_grammar_vault') || '[]');
  const content = document.getElementById('grammarVaultContent');
  if (vault.length === 0) {
    content.innerHTML = '<p>No weaknesses recorded yet. Keep practicing!</p>';
  } else {
    content.innerHTML = vault.reverse().map(v => `
      <div style="background:var(--card); border:1px solid var(--line); border-radius:6px; padding:12px; margin-bottom:12px;">
        <div style="font-size:12px; color:var(--ink-soft); margin-bottom:4px;">${new Date(v.date).toLocaleString()}</div>
        <div style="font-weight:bold; margin-bottom:4px;">Prompt: ${v.prompt}</div>
        <div style="color:var(--red); margin-bottom:2px;">Your Answer: ${v.wrong}</div>
        <div style="color:var(--green); margin-bottom:8px;">Correct: ${v.correct}</div>
        <div style="background:#fff; padding:8px; border-left:3px solid var(--gold); font-size:13px; line-height:1.4;">
          ${v.explanation.replace(/\\n/g, '<br>')}
        </div>
      </div>
    `).join('');
  }
  document.getElementById('grammarVaultModal').style.display = 'flex';
}
'''
if 'grammarVaultModal' not in content:
    content = content.replace('</body>', modal_html + '\n<script>\n' + vault_js + '\n</script>\n</body>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done updating Grammatik_Regel_Trainer.html')
