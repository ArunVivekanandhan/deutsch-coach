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
// Auto-play calls (auto-audio, auto-read-tenses) happen silently in the background,
// so if the device/browser can't actually produce speech (no voice installed, or
// blocked by the browser), a user has no way to tell "nothing is set up" apart from
// "nothing happened" - which looks identical to the feature being broken. Surface it
// once per page load instead of failing silently.
let ttsErrorNoticeShown = false;
function notifyTTSFailure(errorCode){
  if(ttsErrorNoticeShown) return;
  ttsErrorNoticeShown = true;
  console.warn('Text-to-speech failed (' + errorCode + '). No audio will play on this device/browser.');
  if(typeof document === 'undefined' || !document.body) return;
  const el = document.createElement('div');
  el.textContent = '🔇 Text-to-speech isn\'t working on this device/browser (no voice found, or blocked). Auto-read and 🔊 buttons won\'t produce sound.';
  el.style.cssText = 'position:fixed; bottom:16px; left:50%; transform:translateX(-50%); background:#1e293b; color:#fff; padding:10px 16px; border-radius:8px; font-size:13px; font-family:sans-serif; z-index:99999; max-width:92vw; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.3);';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 9000);
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
  u.addEventListener('error', (e) => notifyTTSFailure(e.error));
  return u;
}
// Bumped by every speak/speakSequence call so a chain in progress (waiting on
// onend to schedule its next word via setTimeout) can tell it's been superseded
// by a newer call - e.g. the user swiped to another card mid-speech - and stop
// instead of firing its next word on top of the new card's audio.
let ttsGeneration = 0;
let pendingSpeakTimer = null;
function cancelPendingSpeech(){
  ttsGeneration++;
  if(pendingSpeakTimer){ clearTimeout(pendingSpeakTimer); pendingSpeakTimer = null; }
  if('speechSynthesis' in window) speechSynthesis.cancel();
}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  cancelPendingSpeech();
  speechSynthesis.speak(buildUtterance(text));
}
// Speaks a list of texts one after another (e.g. Präsens/Präteritum/Perfekt forms),
// waiting for each to finish before starting the next so they don't cut each other off.
function speakSequence(texts, gapMs){
  if(!('speechSynthesis' in window)) return;
  const queue = (texts||[]).filter(t => t && String(t).trim());
  if(queue.length === 0) return;
  cancelPendingSpeech();
  const myGeneration = ttsGeneration;
  let i = 0;
  function playNext(){
    if(myGeneration !== ttsGeneration) return; // a newer speak/speakSequence call superseded this chain
    if(i >= queue.length) return;
    const u = buildUtterance(queue[i++]);
    u.onend = () => setTimeout(playNext, gapMs || 450);
    u.onerror = () => setTimeout(playNext, gapMs || 450);
    speechSynthesis.speak(u);
  }
  playNext();
}
// Schedules a speak/speakSequence call after `delayMs`, cancelling any
// previously scheduled-but-not-yet-started call and any currently playing/queued
// speech right away - so navigating rapidly (repeated swipes) never leaves a
// stale delayed call to fire later on top of whatever's playing by then.
function scheduleSpeak(text, delayMs){
  cancelPendingSpeech();
  const myGeneration = ttsGeneration;
  pendingSpeakTimer = setTimeout(() => {
    pendingSpeakTimer = null;
    if(myGeneration !== ttsGeneration) return;
    speak(text);
  }, delayMs);
}
function scheduleSpeakSequence(texts, delayMs, gapMs){
  cancelPendingSpeech();
  const myGeneration = ttsGeneration;
  pendingSpeakTimer = setTimeout(() => {
    pendingSpeakTimer = null;
    if(myGeneration !== ttsGeneration) return;
    speakSequence(texts, gapMs);
  }, delayMs);
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
