import re

with open("Nomen_Adjektiv_Trainer.html", "r", encoding="utf-8") as f:
    content = f.read()

swipe_html = """
<!-- SWIPE GAME UI -->
<div id="swipeGameUI" style="display:none; flex-direction:column; align-items:center; width:100%; max-width:400px; margin:0 auto;">
  <div style="width:100%; display:flex; justify-content:space-between; margin-bottom:12px;">
    <button class="togglebtn" onclick="exitSwipeGame()">⬅ Zurück</button>
    <div style="font-weight:bold; font-size:18px; color:var(--ink);">Score: <span id="swipeScore">0</span></div>
  </div>
  
  <div style="width:100%; display:flex; justify-content:space-between; font-weight:bold; color:var(--ink-soft); margin-bottom:8px; font-size:14px; text-transform:uppercase;">
    <div style="color:var(--die);">⬅ Die</div>
    <div style="color:var(--das);">Das ⬆</div>
    <div style="color:var(--der);">Der ➡</div>
  </div>

  <div id="swipeCardContainer" style="position:relative; width:300px; height:400px; margin:0 auto; perspective:1000px;">
    <!-- Cards will be injected here -->
  </div>
  
  <div style="display:flex; justify-content:center; gap:20px; margin-top:24px;">
    <button class="bigbtn" style="width:60px; height:60px; border-radius:50%; background:var(--die); padding:0; display:flex; align-items:center; justify-content:center; font-size:20px;" onclick="simulateSwipe('die')">Die</button>
    <button class="bigbtn" style="width:60px; height:60px; border-radius:50%; background:var(--das); padding:0; display:flex; align-items:center; justify-content:center; font-size:20px;" onclick="simulateSwipe('das')">Das</button>
    <button class="bigbtn" style="width:60px; height:60px; border-radius:50%; background:var(--der); padding:0; display:flex; align-items:center; justify-content:center; font-size:20px;" onclick="simulateSwipe('der')">Der</button>
  </div>
</div>
"""

swipe_js = """
// --- SWIPE GAME LOGIC ---
let swipeQueue = [];
let swipeScore = 0;
let currentCardEl = null;
let currentWordObj = null;
let isDragging = false;
let startX = 0, startY = 0, currentX = 0, currentY = 0;

function startSwipeGame() {
  document.getElementById('dashboardUI').style.display = 'none';
  document.getElementById('stageUI').style.display = 'none';
  document.getElementById('swipeGameUI').style.display = 'flex';
  
  swipeScore = 0;
  document.getElementById('swipeScore').textContent = swipeScore;
  
  // Prepare queue
  swipeQueue = [...NOUNS].filter(n => n.a).sort(() => Math.random() - 0.5);
  
  renderNextSwipeCard();
}

function exitSwipeGame() {
  document.getElementById('swipeGameUI').style.display = 'none';
  document.getElementById('dashboardUI').style.display = 'block';
}

function renderNextSwipeCard() {
  const container = document.getElementById('swipeCardContainer');
  container.innerHTML = '';
  
  if (swipeQueue.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding-top:100px; font-weight:bold; font-size:24px;">Game Over!<br>Score: ${swipeScore}</div>`;
    return;
  }
  
  currentWordObj = swipeQueue.pop();
  
  const card = document.createElement('div');
  card.className = 'swipe-card';
  card.style.cssText = `
    position: absolute; width: 100%; height: 100%; background: var(--card);
    border: 2px solid var(--ink); border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: grab; user-select: none; transition: transform 0.1s; transform-origin: 50% 100%;
  `;
  
  card.innerHTML = `
    <div style="font-size:42px; font-weight:bold; color:var(--ink); margin-bottom:12px; text-align:center;">${currentWordObj.sg}</div>
    <div style="font-size:18px; color:var(--ink-soft);">${currentWordObj.en || ""}</div>
    <div id="swipeFeedback" style="position:absolute; top:20px; font-weight:bold; font-size:24px; opacity:0; text-transform:uppercase; border:3px solid; padding:4px 12px; border-radius:8px;"></div>
  `;
  
  container.appendChild(card);
  currentCardEl = card;
  
  // Touch / Mouse Events
  card.addEventListener('mousedown', dragStart);
  card.addEventListener('touchstart', dragStart, {passive:false});
  
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('touchmove', dragMove, {passive:false});
  
  window.addEventListener('mouseup', dragEnd);
  window.addEventListener('touchend', dragEnd);
}

function dragStart(e) {
  if (e.type === 'touchstart') {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else {
    startX = e.clientX;
    startY = e.clientY;
  }
  isDragging = true;
  currentCardEl.style.transition = 'none';
}

function dragMove(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  currentX = clientX - startX;
  currentY = clientY - startY;
  
  let rotate = currentX * 0.05;
  currentCardEl.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;
  
  // Feedback
  const fb = document.getElementById('swipeFeedback');
  if (currentX < -50) { fb.textContent = "DIE"; fb.style.color = "var(--die)"; fb.style.borderColor = "var(--die)"; fb.style.opacity = Math.min(1, Math.abs(currentX)/100); }
  else if (currentX > 50) { fb.textContent = "DER"; fb.style.color = "var(--der)"; fb.style.borderColor = "var(--der)"; fb.style.opacity = Math.min(1, currentX/100); }
  else if (currentY < -50) { fb.textContent = "DAS"; fb.style.color = "var(--das)"; fb.style.borderColor = "var(--das)"; fb.style.opacity = Math.min(1, Math.abs(currentY)/100); }
  else { fb.style.opacity = 0; }
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  
  window.removeEventListener('mousemove', dragMove);
  window.removeEventListener('touchmove', dragMove);
  window.removeEventListener('mouseup', dragEnd);
  window.removeEventListener('touchend', dragEnd);
  
  const threshold = 80;
  let answer = null;
  
  if (currentX < -threshold) answer = 'die';
  else if (currentX > threshold) answer = 'der';
  else if (currentY < -threshold) answer = 'das';
  
  if (answer) {
    processSwipe(answer);
  } else {
    // Reset
    currentCardEl.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    currentCardEl.style.transform = `translate(0px, 0px) rotate(0deg)`;
    document.getElementById('swipeFeedback').style.opacity = 0;
  }
  currentX = 0; currentY = 0;
}

function simulateSwipe(dir) {
  if(!currentCardEl) return;
  processSwipe(dir, true);
}

function processSwipe(answer, isSimulated = false) {
  const correct = currentWordObj.a === answer;
  
  currentCardEl.style.transition = 'transform 0.4s ease-out, opacity 0.4s';
  
  let endX = 0, endY = 0;
  if(answer === 'die') endX = -500;
  else if(answer === 'der') endX = 500;
  else if(answer === 'das') endY = -500;
  
  currentCardEl.style.transform = `translate(${endX}px, ${endY}px) rotate(${endX*0.1}deg)`;
  currentCardEl.style.opacity = 0;
  
  if(correct) {
    swipeScore++;
    document.getElementById('swipeScore').textContent = swipeScore;
    // Tiny confetti effect could go here
  } else {
    // Flash red or show error briefly
    swipeScore = Math.max(0, swipeScore - 1);
    document.getElementById('swipeScore').textContent = swipeScore;
    alert(`Falsch! Es ist: ${currentWordObj.a} ${currentWordObj.sg}`);
  }
  
  setTimeout(() => {
    renderNextSwipeCard();
  }, 400);
}
"""

# Insert CSS vars for game colors
if "--die:" not in content:
    content = content.replace("--purple:#6B4A8A;", "--purple:#6B4A8A; --der:#2563eb; --die:#dc2626; --das:#16a34a;")

# Inject HTML
if "id=\"swipeGameUI\"" not in content:
    content = content.replace("<!-- Dashboard -->", swipe_html + "\n  <!-- Dashboard -->")

# Inject JS
if "startSwipeGame" not in content:
    content = content.replace("</script>", swipe_js + "\n</script>", 1)

# Inject button into Nomen dashboard
btn_html = """<button class="bigbtn" style="background:var(--ink); box-shadow:0 6px 0 #0f172a; margin-bottom:12px;" onclick="startSwipeGame()">🎮 Swipe Game (Der/Die/Das)<span class="subtext">Tinder for Nouns - Build fast reflexes</span></button>"""
if "Swipe Game" not in content:
    content = content.replace("<button class=\"bigbtn\" onclick=\"startSession()\">", btn_html + "\n    <button class=\"bigbtn\" onclick=\"startSession()\">")

with open("Nomen_Adjektiv_Trainer.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Swipe Game injected into Nomen Adjektiv Trainer")
