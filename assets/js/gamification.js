// Gamification & Analytics Engine for Deutsch-Coach Suite
// Automatically handles XP, Streaks, Badges, and Error Analytics

const GAMI_KEY = 'de_gamification_v1';
const ANALYTICS_KEY = 'de_analytics_v1';

function getGamificationState() {
    let state = JSON.parse(localStorage.getItem(GAMI_KEY));
    if (!state) {
        state = {
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: null,
            badges: []
        };
    }
    return state;
}

function saveGamificationState(state) {
    localStorage.setItem(GAMI_KEY, JSON.stringify(state));
    updateHUD();
}

function getAnalyticsState() {
    let state = JSON.parse(localStorage.getItem(ANALYTICS_KEY));
    if (!state) {
        state = {
            errors: {}, // { "category": count }
            weakestTopics: {},
            totalCardsStudied: 0,
            timeSpentMs: 0
        };
    }
    return state;
}

function saveAnalyticsState(state) {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(state));
}

function todayISO() {
    return new Date().toISOString().split('T')[0];
}

// Gamification API
window.addXP = function(amount, source) {
    let state = getGamificationState();
    state.xp += amount;
    
    // Level up logic: every 500 XP is a level
    let newLevel = Math.floor(state.xp / 500) + 1;
    if (newLevel > state.level) {
        state.level = newLevel;
        showNotification(`🎉 Level Up! Du bist jetzt Level ${state.level}!`);
    }

    // Streak logic
    const today = todayISO();
    if (state.lastActiveDate !== today) {
        if (!state.lastActiveDate) {
            state.streak = 1;
        } else {
            let lastDate = new Date(state.lastActiveDate);
            let currentDate = new Date(today);
            let diffDays = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
            
            if (diffDays === 1) {
                state.streak += 1;
            } else if (diffDays > 1) {
                state.streak = 1; // reset streak
            }
        }
        state.lastActiveDate = today;
    }
    
    saveGamificationState(state);
};

window.logError = function(category, details) {
    let state = getAnalyticsState();
    if (!state.errors[category]) state.errors[category] = 0;
    state.errors[category]++;
    saveAnalyticsState(state);
};

window.logStudyAction = function() {
    let state = getAnalyticsState();
    state.totalCardsStudied++;
    saveAnalyticsState(state);
};

// UI HUD Update
function updateHUD() {
    const state = getGamificationState();
    // Update Streak box if it exists (in deutsch-coach.html)
    const streakEl = document.getElementById('streakNum');
    if (streakEl) streakEl.innerText = state.streak;
    
    // Check if Gamification HUD exists, if not inject it into header if possible
    let hud = document.getElementById('gami-hud');
    if (!hud && document.querySelector('.streakbox')) {
        hud = document.createElement('div');
        hud.id = 'gami-hud';
        hud.style.display = 'flex';
        hud.style.gap = '12px';
        hud.style.alignItems = 'center';
        hud.style.fontSize = '12px';
        hud.style.fontWeight = 'bold';
        hud.style.marginTop = '4px';
        document.querySelector('.streakbox').appendChild(hud);
    }
    
    if (hud) {
        hud.innerHTML = `
            <span style="color:var(--blue);">🌟 Lvl ${state.level}</span>
            <span style="color:var(--purple);">✨ ${state.xp} XP</span>
        `;
    }
}

function showNotification(msg) {
    let toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--ink)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '24px';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = "'IBM Plex Sans', sans-serif";
    toast.style.fontWeight = 'bold';
    toast.innerText = msg;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHUD);
} else {
    updateHUD();
}
