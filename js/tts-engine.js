// ==========================================
// Shared Text-to-Speech Engine
// ==========================================
let deVoices = [];
let voicePollAttempts = 0;
function populateVoices(){
  const all = speechSynthesis.getVoices();
  deVoices = all.filter(v => v.lang.startsWith('de'));

  const warn = document.getElementById('voiceWarn');
  const select = document.getElementById('voiceSelect');

  if(deVoices.length > 0){
    if(warn) warn.style.display = 'none';
    if(select){
      const savedURI = localStorage.getItem('dc_preferred_voice_uri') || '';
      select.innerHTML = deVoices.map(v =>
        `<option value="${v.voiceURI}" ${v.voiceURI===savedURI?'selected':''}>${v.name} (${v.lang})</option>`
      ).join('');
      if(typeof selectedVoiceURI !== 'undefined' && !selectedVoiceURI && savedURI){
        selectedVoiceURI = savedURI;
      }
    }
  } else if(voicePollAttempts >= 15 && warn){
    warn.innerHTML = '⚠️ No German voice found on this device. For crystal-clear native pronunciation:<br>• <b>Windows</b>: Settings → Time &amp; Language → Speech → Add "German (Germany)"<br>• <b>Android</b>: Settings → System → Languages → Text-to-speech → Install German<br>• <b>iPhone/iPad</b>: Settings → Accessibility → Spoken Content → Voices → German';
    warn.style.display = 'block';
  }
}
function pollForVoices(){
  voicePollAttempts++;
  populateVoices();
  // Keep polling and re-rendering for the full attempt budget rather than
  // stopping the instant we see any voice at all - on some systems (notably
  // Windows) getVoices() returns a single default voice immediately and only
  // reveals the rest of the installed voices a bit later.
  if(voicePollAttempts < 15) setTimeout(pollForVoices, 200);
}
function initVoicePolling(){
  if('speechSynthesis' in window){
    speechSynthesis.onvoiceschanged = populateVoices;
    pollForVoices();
  }
}
// This script loads in <head>, before <body> (and #voiceSelect/#voiceWarn) exist -
// wait for the DOM so the first poll can actually find and populate them.
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initVoicePolling);
} else {
  initVoicePolling();
}
function buildUtterance(text){
  const u = new SpeechSynthesisUtterance((text||'').replace(/\(.*?\)/g,'').trim());
  u.lang = 'de-DE';
  u.rate = 0.85; // Slightly slower for more natural, human-like cadence
  if(deVoices.length > 0){
    const chosenURI = typeof selectedVoiceURI !== 'undefined' ? selectedVoiceURI : null;
    const chosen = chosenURI ? deVoices.find(v => v.voiceURI === chosenURI) : null;
    const premium = deVoices.find(v => v.name.toLowerCase().includes('premium'));
    const google = deVoices.find(v => v.name.toLowerCase().includes('google'));
    u.voice = chosen || premium || google || deVoices[0];
  }
  return u;
}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(buildUtterance(text));
}
// Speaks a list of texts one after another (e.g. Präsens/Präteritum/Perfekt forms),
// waiting for each to finish before starting the next so they don't cut each other off.
function speakSequence(texts, gapMs){
  if(!('speechSynthesis' in window)) return;
  const queue = (texts||[]).filter(t => t && String(t).trim());
  if(queue.length === 0) return;
  speechSynthesis.cancel();
  let i = 0;
  function playNext(){
    if(i >= queue.length) return;
    const u = buildUtterance(queue[i++]);
    u.onend = () => setTimeout(playNext, gapMs || 450);
    u.onerror = () => setTimeout(playNext, gapMs || 450);
    speechSynthesis.speak(u);
  }
  playNext();
}
function speakBtn(text, label){
  const safe = (text||'').replace(/'/g, "\\'");
  return `<button class="speakbtn" title="${label||'anhören'}" onclick="event.stopPropagation(); speak('${safe}')">🔊</button>`;
}
// Support auto-audio
function playTTS(){
  const audioText = document.body.getAttribute('data-audio');
  if(audioText) speak(audioText);
}
