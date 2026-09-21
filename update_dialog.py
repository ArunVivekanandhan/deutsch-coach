import re

with open('Dialog_Schatten_Trainer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace input with select
old_input = '''<input type="text" id="scenarioInput" placeholder="Szenario (z.B. 'Beim Bäcker' oder 'At the bakery')">'''
new_input = '''<select id="scenarioInput">
        <option value="" disabled selected>-- Wähle ein Szenario --</option>
        <option value="Beim Bäcker (At the bakery)">Beim Bäcker (At the bakery)</option>
        <option value="Im Supermarkt (At the supermarket)">Im Supermarkt (At the supermarket)</option>
        <option value="Im Restaurant (At the restaurant)">Im Restaurant (At the restaurant)</option>
        <option value="Am Bahnhof (At the train station)">Am Bahnhof (At the train station)</option>
        <option value="Beim Arzt (At the doctor)">Beim Arzt (At the doctor)</option>
        <option value="Im Hotel einchecken (Checking into a hotel)">Im Hotel einchecken (Checking into a hotel)</option>
        <option value="Nach dem Weg fragen (Asking for directions)">Nach dem Weg fragen (Asking for directions)</option>
        <option value="Smalltalk mit Nachbarn (Small talk with neighbors)">Smalltalk mit Nachbarn (Small talk with neighbors)</option>
        <option value="Ein Vorstellungsgespräch (Job interview)">Ein Vorstellungsgespräch (Job interview)</option>
      </select>'''
content = content.replace(old_input, new_input)

# Update styling for select in head
old_style = '''input { width: 100%; font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; padding: 12px; margin-bottom: 12px; border: 1.5px solid var(--line); border-radius: 6px; background: var(--paper); color: var(--ink); }'''
new_style = '''input, select { width: 100%; font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; padding: 12px; margin-bottom: 12px; border: 1.5px solid var(--line); border-radius: 6px; background: var(--paper); color: var(--ink); }'''
content = content.replace(old_style, new_style)

# Replace validation alert message
content = content.replace("alert('Bitte gib ein Szenario ein.');", "alert('Bitte wähle ein Szenario aus.');")

# Rewrite AI Provider logic
old_ai = '''    const provider = localStorage.getItem('de_ai_provider') || 'ollama';
    let apiUrl, headers, bodyData, getResponseText;

    if (provider === 'openai' || provider === 'openrouter') {
      const apiKey = localStorage.getItem(provider === 'openai' ? 'de_ai_key_openai' : 'de_ai_key_openrouter');
      apiUrl = provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions';
      const model = localStorage.getItem(provider === 'openai' ? 'de_ai_model_openai' : 'de_ai_model_openrouter') || 'gpt-4o-mini';
      headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey };
      bodyData = JSON.stringify({ model: model, response_format: { type: "json_object" }, messages: [{ role: 'user', content: prompt }] });
      getResponseText = (data) => data.choices[0].message.content;
    } else {
      apiUrl = localStorage.getItem('de_ai_endpoint_ollama') || 'http://localhost:8080/v1/chat/completions';
      const model = localStorage.getItem('de_ai_model_ollama') || 'llama3';
      headers = { 'Content-Type': 'application/json' };
      bodyData = JSON.stringify({ model: model, format: 'json', messages: [{ role: 'user', content: prompt }] });
      getResponseText = (data) => data.choices[0].message.content;
    }'''

new_ai = '''    const provider = localStorage.getItem('de_ai_provider') || 'groq';
    let apiUrl, headers, bodyData, getResponseText;

    if (provider === 'openai' || provider === 'openrouter' || provider === 'groq') {
      const apiKey = localStorage.getItem('de_ai_key_' + provider);
      if (!apiKey) {
        document.getElementById('loading').style.display = 'none';
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
    }'''
content = content.replace(old_ai, new_ai)

with open('Dialog_Schatten_Trainer.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
