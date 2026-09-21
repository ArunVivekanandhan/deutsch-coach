import sys

with open('konnektoren_referenz.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the Build Tab in the nav-tabs
nav_tabs = '''  <div class="nav-tabs">
    <div class="nav-tab active" id="tabRef" onclick="setTab('ref')">📚 Referenz &amp; Regeln</div>
    <div class="nav-tab" id="tabDrill" onclick="setTab('drill')">⚡ Schnell-Quiz &amp; Drill</div>
  </div>'''

new_nav_tabs = '''  <div class="nav-tabs">
    <div class="nav-tab active" id="tabRef" onclick="setTab('ref')">📚 Referenz &amp; Regeln</div>
    <div class="nav-tab" id="tabDrill" onclick="setTab('drill')">⚡ Schnell-Quiz &amp; Drill</div>
    <div class="nav-tab" id="tabBuild" onclick="setTab('build')">🤖 AI Sentence Builder</div>
  </div>'''
content = content.replace(nav_tabs, new_nav_tabs)


# Insert viewBuild container after viewDrill
view_drill_end = '''    <button id="quizNextBtn" class="opt-btn" style="margin-top:12px; display:none;" onclick="nextQuestion()">Nächste Frage ➡️</button>
  </div>
</div>'''

view_build_html = '''    <button id="quizNextBtn" class="opt-btn" style="margin-top:12px; display:none;" onclick="nextQuestion()">Nächste Frage ➡️</button>
  </div>
</div>

<!-- AI BUILDER VIEW -->
<div id="viewBuild" style="display:none; max-width:800px; margin:0 auto;">
  <div class="drill-card" style="margin-bottom:16px;">
    <h2 style="font-family:'Fjalla One',sans-serif; margin-bottom:8px;">🤖 AI Sentence Builder</h2>
    <p style="font-size:14px; color:var(--ink-soft); margin-bottom:12px;">Erstelle eigene deutsche Sätze! Wähle einen Konnektor, und die KI generiert dir eine englische/tamilische Vorgabe, die du übersetzen musst.</p>
    
    <div style="display:flex; gap:8px; margin-bottom:16px;">
      <select id="builderKonnektor" style="flex:1; padding:10px; font-size:14px; border-radius:6px; border:1px solid var(--line); font-family:'IBM Plex Sans';">
        <optgroup label="Gruppe 1: Verb am Ende">
          <option value="weil">weil</option>
          <option value="da">da</option>
          <option value="obwohl">obwohl</option>
          <option value="dass">dass</option>
          <option value="ob">ob</option>
          <option value="damit">damit</option>
          <option value="um ... zu">um ... zu</option>
        </optgroup>
        <optgroup label="Gruppe 2: Position-1-Adverbien (Inversion)">
          <option value="deshalb">deshalb</option>
          <option value="deswegen">deswegen</option>
          <option value="trotzdem">trotzdem</option>
          <option value="sonst">sonst</option>
          <option value="außerdem">außerdem</option>
        </optgroup>
        <optgroup label="Gruppe 3: Koordinierend (ADUSO)">
          <option value="aber">aber</option>
          <option value="denn">denn</option>
          <option value="und">und</option>
          <option value="sondern">sondern</option>
          <option value="oder">oder</option>
        </optgroup>
      </select>
      <button onclick="generateBuildTask()" class="opt-btn" style="width:auto; padding:10px 16px; background:var(--ink); color:#fff; border-color:var(--ink);">Generieren</button>
    </div>
    
    <div id="builderLoading" style="display:none; font-weight:bold; color:var(--gold); margin-bottom:12px;">⏳ Generiere Satzaufgabe mit KI...</div>
    
    <div id="builderTask" style="display:none;">
      <div style="background:var(--paper); padding:16px; border-radius:8px; border:1px solid var(--line); margin-bottom:16px;">
        <div style="font-weight:bold; margin-bottom:8px;">Übersetze diesen Satz ins Deutsche und verwende "<span id="bldTarget" style="color:var(--red);"></span>":</div>
        <div id="bldEn" style="font-weight:600; font-size:16px; margin-bottom:4px; color:var(--ink);"></div>
        <div id="bldTa" style="color:var(--ink-soft); font-size:14px;"></div>
      </div>
      <input type="text" id="bldAnswer" placeholder="Schreibe deinen deutschen Satz hier..." style="width:100%; padding:14px; font-size:15px; border-radius:6px; border:1px solid var(--line); margin-bottom:12px; font-family:'IBM Plex Sans';" onkeydown="if(event.key==='Enter') checkBuildTask()">
      
      <div style="display:flex; gap:8px;">
        <button onclick="checkBuildTask()" id="checkBtn" class="opt-btn" style="flex:1; background:var(--green); color:#fff; border-color:var(--green);">Lösung prüfen</button>
        <button onclick="playBuildAudio()" class="opt-btn" style="width:auto; background:var(--blue); color:#fff; border-color:var(--blue);">🔊</button>
      </div>
      
      <div id="bldFeedback" style="margin-top:16px; font-size:15px;"></div>
    </div>
  </div>
</div>'''
content = content.replace(view_drill_end, view_build_html)

# Add setTab logic for 'build'
set_tab_old = '''function setTab(t) {
  document.getElementById('tabRef').classList.toggle('active', t === 'ref');
  document.getElementById('tabDrill').classList.toggle('active', t === 'drill');

  document.getElementById('viewRef').style.display = t === 'ref' ? 'block' : 'none';
  document.getElementById('viewDrill').style.display = t === 'drill' ? 'block' : 'none';
  if (t === 'drill') initQuiz();
}'''

set_tab_new = '''function setTab(t) {
  document.getElementById('tabRef').classList.toggle('active', t === 'ref');
  document.getElementById('tabDrill').classList.toggle('active', t === 'drill');
  document.getElementById('tabBuild').classList.toggle('active', t === 'build');

  document.getElementById('viewRef').style.display = t === 'ref' ? 'block' : 'none';
  document.getElementById('viewDrill').style.display = t === 'drill' ? 'block' : 'none';
  document.getElementById('viewBuild').style.display = t === 'build' ? 'block' : 'none';
  
  if (t === 'drill') initQuiz();
}'''
content = content.replace(set_tab_old, set_tab_new)

# Add AI Logic
ai_logic = '''
// --- AI BUILDER LOGIC ---
let currentTask = null;

async function generateBuildTask() {
  const konnektor = document.getElementById('builderKonnektor').value;
  document.getElementById('builderTask').style.display = 'none';
  document.getElementById('bldFeedback').innerHTML = '';
  document.getElementById('bldAnswer').value = '';
  document.getElementById('builderLoading').style.display = 'block';

  const prompt = `Generate a B1 level practice sentence for the German connector "${konnektor}".
Output strictly valid JSON with this schema:
{
  "en": "English sentence that naturally requires ${konnektor} when translated to German",
  "ta": "Tamil translation of the sentence",
  "de": "The correct German translation using ${konnektor}"
}
No other text outside JSON.`;

  const provider = localStorage.getItem('de_ai_provider') || 'groq';
  let apiUrl, headers, bodyData, getResponseText;

  if (provider === 'openai' || provider === 'openrouter' || provider === 'groq') {
    const apiKey = localStorage.getItem('de_ai_key_' + provider);
    if (!apiKey) {
      document.getElementById('builderLoading').style.display = 'none';
      return alert(`API Key für ${provider} fehlt! Bitte in der Startseite konfigurieren.`);
    }
    if (provider === 'openai') apiUrl = 'https://api.openai.com/v1/chat/completions';
    else if (provider === 'groq') apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    else apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    const model = localStorage.getItem('de_ai_model_' + provider) || (provider === 'groq' ? 'llama3-8b-8192' : 'gpt-4o-mini');
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey };
    bodyData = JSON.stringify({ model: model, response_format: { type: "json_object" }, messages: [{ role: 'user', content: prompt }] });
    getResponseText = (data) => data.choices[0].message.content;
  } else {
    apiUrl = localStorage.getItem('de_ai_endpoint_ollama') || 'http://localhost:11434/api/chat';
    const model = localStorage.getItem('de_ai_model_ollama') || 'llama3';
    headers = { 'Content-Type': 'application/json' };
    bodyData = JSON.stringify({ model: model, format: 'json', stream: false, messages: [{ role: 'user', content: prompt }] });
    getResponseText = (data) => data.message.content;
  }

  try {
    const response = await fetch(apiUrl, { method: 'POST', headers, body: bodyData });
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const rawText = getResponseText(data);
    const jsonStr = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
    currentTask = JSON.parse(jsonStr);
    
    document.getElementById('bldTarget').textContent = konnektor;
    document.getElementById('bldEn').textContent = currentTask.en;
    document.getElementById('bldTa').textContent = currentTask.ta;
    document.getElementById('builderTask').style.display = 'block';
  } catch (err) {
    alert('Fehler beim Generieren. Bitte überprüfe deine AI Einstellungen.');
    console.error(err);
  } finally {
    document.getElementById('builderLoading').style.display = 'none';
  }
}

async function checkBuildTask() {
  if(!currentTask) return;
  const ans = document.getElementById('bldAnswer').value.trim();
  if(!ans) return alert('Bitte schreibe einen Satz!');
  
  const konnektor = document.getElementById('builderKonnektor').value;
  const prompt = `The user is practicing the German connector "${konnektor}".
Target German translation: "${currentTask.de}"
User's input: "${ans}"

Evaluate the user's input. Is it grammatically correct and does it properly use the connector "${konnektor}" with the correct word order? (Group 1 = Verb am Ende, Group 2 = Inversion, Group 3 = ADUSO normal). 
Output strictly valid JSON:
{
  "correct": boolean,
  "feedback": "Short feedback in English explaining if they got the word order/verb position right, and how to fix it if wrong."
}
No other text outside JSON.`;

  document.getElementById('checkBtn').textContent = 'Prüfe...';
  
  const provider = localStorage.getItem('de_ai_provider') || 'groq';
  let apiUrl, headers, bodyData, getResponseText;

  if (provider === 'openai' || provider === 'openrouter' || provider === 'groq') {
    const apiKey = localStorage.getItem('de_ai_key_' + provider);
    apiUrl = provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : (provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions');
    const model = localStorage.getItem('de_ai_model_' + provider) || (provider === 'groq' ? 'llama3-8b-8192' : 'gpt-4o-mini');
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey };
    bodyData = JSON.stringify({ model: model, response_format: { type: "json_object" }, messages: [{ role: 'user', content: prompt }] });
    getResponseText = (data) => data.choices[0].message.content;
  } else {
    apiUrl = localStorage.getItem('de_ai_endpoint_ollama') || 'http://localhost:11434/api/chat';
    const model = localStorage.getItem('de_ai_model_ollama') || 'llama3';
    headers = { 'Content-Type': 'application/json' };
    bodyData = JSON.stringify({ model: model, format: 'json', stream: false, messages: [{ role: 'user', content: prompt }] });
    getResponseText = (data) => data.message.content;
  }

  try {
    const response = await fetch(apiUrl, { method: 'POST', headers, body: bodyData });
    const data = await response.json();
    const rawText = getResponseText(data);
    const eval = JSON.parse(rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1));
    
    const fbDiv = document.getElementById('bldFeedback');
    if(eval.correct) {
      fbDiv.innerHTML = `<div style="padding:12px; border-radius:6px; background:#dcfce7; color:var(--green); border:1px solid #bbf7d0;">
        <b>✅ Perfekt!</b><br>${eval.feedback}<br><br><span style="color:var(--ink-soft);font-size:13px;">KI Lösungsvorschlag: ${currentTask.de}</span>
      </div>`;
    } else {
      fbDiv.innerHTML = `<div style="padding:12px; border-radius:6px; background:#fee2e2; color:var(--red); border:1px solid #fecaca;">
        <b>❌ Fast!</b><br>${eval.feedback}<br><br><span style="color:var(--ink-soft);font-size:13px;">KI Lösungsvorschlag: ${currentTask.de}</span>
      </div>`;
    }
  } catch(err) {
    alert('Fehler bei der AI Prüfung.');
  } finally {
    document.getElementById('checkBtn').textContent = 'Lösung prüfen';
  }
}

function playBuildAudio() {
  if(!currentTask || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(currentTask.de);
  u.lang = "de-DE";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
'''

content = content.replace('// Service Worker Registration', ai_logic + '\n// Service Worker Registration')

with open('konnektoren_referenz.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
