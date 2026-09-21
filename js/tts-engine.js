// ==========================================
// Shared Text-to-Speech Engine
// ==========================================
let deVoices = [];
function populateVoices(){
  const all = speechSynthesis.getVoices();
  deVoices = all.filter(v => v.lang.startsWith('de'));
}
function pollForVoices(){
  if(deVoices.length > 0) return;
  populateVoices();
  if(deVoices.length === 0) setTimeout(pollForVoices, 100);
}
if('speechSynthesis' in window){
  speechSynthesis.onvoiceschanged = populateVoices;
  pollForVoices();
}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\(.*?\)/g,'').trim());
  u.lang = 'de-DE';
  u.rate = 0.85; // Slightly slower for more natural, human-like cadence
  if(deVoices.length > 0){
    const premium = deVoices.find(v => v.name.toLowerCase().includes('premium'));
    const google = deVoices.find(v => v.name.toLowerCase().includes('google'));
    u.voice = premium || google || deVoices[0];
  }
  speechSynthesis.speak(u);
}
function speakBtn(text, label){
  const safe = text.replace(/'/g, "\\'");
  return `<button class="speakbtn" title="${label||'anhören'}" onclick="event.stopPropagation(); speak('${safe}')">🔊</button>`;
}
// Support auto-audio
function playTTS(){
  const audioText = document.body.getAttribute('data-audio');
  if(audioText) speak(audioText);
}
