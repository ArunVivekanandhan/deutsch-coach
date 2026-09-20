import os, re

file_path = 'Nomen_Adjektiv_Trainer.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

mnemonic_js = '''
async function callAIMnemonic(word, article, enMeaning) {
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

  const promptText = `I am learning German nouns. The word is "${article} ${word}" meaning "${enMeaning}". Give me a short, memorable Eselsbrücke (memory hook / mnemonic) in English/Tamil to easily remember its gender (${article}). Keep it to 1-2 sentences.`;

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
      return data.choices[0].message.content;
    } else {
      return "AI Error: " + JSON.stringify(data);
    }
  } catch(e) {
    return "Error connecting to AI: " + e.message;
  }
}

async function requestMnemonicAI(word, article, enMeaning, btnId, boxId) {
  const btn = document.getElementById(btnId);
  const box = document.getElementById(boxId);
  if(btn) btn.innerText = "⏳ Loading...";
  
  const mnemonic = await callAIMnemonic(word, article, enMeaning);
  
  const vault = JSON.parse(localStorage.getItem('de_nomen_mnemonics') || '{}');
  vault[word] = mnemonic;
  localStorage.setItem('de_nomen_mnemonics', JSON.stringify(vault));
  
  if(box) {
    box.innerHTML = `<strong>💡 KI Eselsbrücke:</strong><br>${mnemonic.replace(/\\n/g, '<br>')}`;
    box.style.display = 'block';
  }
  if(btn) btn.style.display = 'none';
}
'''
if 'callAIMnemonic' not in content:
    # Need to find a good place to insert. loadProgress seems fine if it exists.
    # Otherwise just before closing script tag
    if 'function loadProgress(){' in content:
        content = content.replace('function loadProgress(){', mnemonic_js + '\nfunction loadProgress(){')
    else:
        # Before </script>
        content = content.replace('</script>', mnemonic_js + '\n</script>')

button_html = '''
      <div id="aiMnemonicBox_${v.sg}" style="display:${JSON.parse(localStorage.getItem('de_nomen_mnemonics') || '{}')[v.sg] ? 'block' : 'none'}; background:#fff; padding:8px; border-left:3px solid var(--gold); border-radius:4px; font-size:13px; margin-bottom:8px;">
        ${JSON.parse(localStorage.getItem('de_nomen_mnemonics') || '{}')[v.sg] ? '<strong>💡 KI Eselsbrücke:</strong><br>' + JSON.parse(localStorage.getItem('de_nomen_mnemonics') || '{}')[v.sg].replace(/\\n/g, '<br>') : ''}
      </div>
      ${!JSON.parse(localStorage.getItem('de_nomen_mnemonics') || '{}')[v.sg] ? `<button id="btnAiMnemonic_${v.sg}" class="quick-tool-btn" style="margin-bottom:8px; display:inline-block;" onclick="requestMnemonicAI('${v.sg}', '${v.a}', '${escapeQuotes(v.en)}', 'btnAiMnemonic_${v.sg}', 'aiMnemonicBox_${v.sg}')">💡 Eselsbrücke (Mnemonic) KI</button>` : ''}
'''

content = content.replace('<!-- 2. Memory Trick -->', '<!-- 2. Memory Trick -->\n' + button_html)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done updating Nomen_Adjektiv_Trainer.html')
