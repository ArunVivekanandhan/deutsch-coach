import re
import glob

# 1. Standardize AI Provider
def fix_ai_provider():
    files = glob.glob("*.html") + glob.glob("js/*.js") + glob.glob("assets/js/*.js")
    for fname in files:
        with open(fname, "r", encoding="utf-8", errors="surrogateescape") as f:
            content = f.read()
        
        new_content = re.sub(r"localStorage\.getItem\('de_ai_provider'\)\s*\|\|\s*'[^']+'", "localStorage.getItem('de_ai_provider') || 'groq'", content)
        
        if new_content != content:
            with open(fname, "w", encoding="utf-8", errors="surrogateescape") as f:
                f.write(new_content)
            print(f"Fixed AI provider in {fname}")

# 2. Add Streakbox HUD to app-shell.js and index.html
def add_streakbox():
    # app-shell.js
    with open("js/app-shell.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    if "class=\"streakbox\"" not in content:
        # insert right after the moon icon button
        target = '<button class="ds-btn ds-btn-secondary theme-toggle-btn" id="themeToggleBtn" style="padding: 8px;" title="Toggle Dark Mode">\n                    <i data-lucide="moon"></i>\n                </button>'
        replacement = target + '\n                <div class="streakbox" style="margin-left: var(--space-sm);"></div>'
        content = content.replace(target, replacement)
        with open("js/app-shell.js", "w", encoding="utf-8") as f:
            f.write(content)
        print("Added streakbox to app-shell.js")

    # index.html
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()
    if "class=\"streakbox\"" not in content:
        target = '<button class="ds-btn ds-btn-secondary theme-toggle-btn" id="themeToggleBtn" style="padding: 8px;" title="Toggle Dark Mode">\n            <i data-lucide="moon"></i>\n          </button>'
        replacement = target + '\n          <div class="streakbox" style="margin-left: var(--space-sm);"></div>'
        content = content.replace(target, replacement)
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("Added streakbox to index.html")

# 3. Add Badges to gamification.js
def fix_badges():
    with open("assets/js/gamification.js", "r", encoding="utf-8") as f:
        content = f.read()

    # The user asked for simple milestone badges.
    badge_logic = """
function checkBadges(state, aState) {
    let newBadges = [];
    if (aState.totalCardsStudied >= 50 && !state.badges.includes("First 50 Cards")) newBadges.push("First 50 Cards");
    if (aState.totalCardsStudied >= 500 && !state.badges.includes("500 Cards")) newBadges.push("500 Cards");
    if (state.streak >= 3 && !state.badges.includes("3-Day Streak")) newBadges.push("3-Day Streak");
    if (state.streak >= 7 && !state.badges.includes("7-Day Streak")) newBadges.push("7-Day Streak");
    if (state.streak >= 30 && !state.badges.includes("30-Day Streak")) newBadges.push("30-Day Streak");
    if (state.level >= 5 && !state.badges.includes("Level 5 Scholar")) newBadges.push("Level 5 Scholar");

    if (newBadges.length > 0) {
        state.badges.push(...newBadges);
        newBadges.forEach(b => {
            if(window.showNotification) window.showNotification(`🏆 Badge Earned: ${b}!`);
            else alert(`🏆 Badge Earned: ${b}!`);
        });
    }
}
"""

    if "function checkBadges" not in content:
        # Add badge logic
        content = content.replace("saveGamificationState(state);", "checkBadges(state, getAnalyticsState());\n    saveGamificationState(state);")
        # Add the function definition
        content += badge_logic
        with open("assets/js/gamification.js", "w", encoding="utf-8") as f:
            f.write(content)
        print("Added badge logic to gamification.js")


fix_ai_provider()
add_streakbox()
fix_badges()
