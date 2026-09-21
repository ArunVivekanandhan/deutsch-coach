// =========================================================================
// DEUTSCH COACH - GLOBAL APP SHELL (New Design Migration)
// Dynamically renders the sidebar, header, and drawer across legacy pages
// =========================================================================

function injectDependencies() {
    // Inject Lucide script if not present
    if (!document.querySelector('script[src*="lucide"]')) {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/lucide@latest";
        script.onload = () => {
            if (window.lucide) window.lucide.createIcons();
        };
        document.head.appendChild(script);
    }

    // Inject design-system.css if not present
    if (!document.querySelector('link[href*="design-system.css"]')) {
        const link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = "css/design-system.css";
        document.head.appendChild(link);
    }
}

function renderAppShell() {
    // Inject dependencies on every page
    injectDependencies();


    // --- Dynamic Level Progress Calculation ---
    const dcProg = JSON.parse(localStorage.getItem('dc_progress_v1') || '{}');
    const naProg = JSON.parse(localStorage.getItem('na_progress_v1') || '{}');
    const wmgProg = JSON.parse(localStorage.getItem('wmg_progress_v1') || '{}');
    
    let totalMastered = 0;
    // Count items that are in box 4 or 5 (Mastered/Known well)
    for (let k in dcProg) { if (dcProg[k].box >= 4) totalMastered++; }
    for (let k in naProg) { if (naProg[k].box >= 4) totalMastered++; }
    for (let k in wmgProg) { if (wmgProg[k].box >= 4) totalMastered++; }
    
    // Cascading progression thresholds
    const A1_MAX = 150;
    const A2_MAX = 250;
    const B11_MAX = 300;
    const B12_MAX = 300;
    
    let rem = totalMastered;
    let a1Pct = Math.min(100, Math.round((rem / A1_MAX) * 100)); rem -= A1_MAX; if (rem < 0) rem = 0;
    let a2Pct = Math.min(100, Math.round((rem / A2_MAX) * 100)); rem -= A2_MAX; if (rem < 0) rem = 0;
    let b11Pct = Math.min(100, Math.round((rem / B11_MAX) * 100)); rem -= B11_MAX; if (rem < 0) rem = 0;
    let b12Pct = Math.min(100, Math.round((rem / B12_MAX) * 100));
    // ------------------------------------------

    const body = document.body;
    
    // Only wrap if it's a legacy page (doesn't have app-layout yet)
    if (!body.querySelector('.app-layout')) {
        const childrenToMove = Array.from(body.childNodes);
        
        const layout = document.createElement('div');
        layout.className = 'app-layout';
        
        // 1. Sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'app-sidebar';
        sidebar.id = 'sidebar';
        
        sidebar.innerHTML = `
            <div class="app-sidebar-header">
                <i data-lucide="graduation-cap" style="margin-right: 8px; color: var(--color-primary);"></i> Deutsch Coach
            </div>
            <nav class="app-sidebar-nav">
                <div class="nav-group">
                    <div class="nav-group-title">Navigation</div>
                    <a href="index.html" class="nav-link"><i data-lucide="home" class="nav-icon"></i> Home</a>
                    <a href="index.html#lernen" class="nav-link"><i data-lucide="book-open" class="nav-icon"></i> Lernen</a>
                    <a href="index.html#pruefung" class="nav-link"><i data-lucide="award" class="nav-icon"></i> Prüfung</a>
                    <a href="index.html#coach" class="nav-link"><i data-lucide="bot" class="nav-icon"></i> AI Coach</a>
                    <a href="index.html#tools" class="nav-link"><i data-lucide="wrench" class="nav-icon"></i> Tools</a>
                    <a href="Einstellungen_Setup.html" class="nav-link"><i data-lucide="settings" class="nav-icon"></i> AI Config & Settings</a>
                </div>
                <div class="nav-group">
                    <div class="nav-group-title">Level Progress</div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>A1 Foundation</span><span>${a1Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${a1Pct}%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>A2 Basics</span><span>${a2Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${a2Pct}%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>B1.1 Intermediate</span><span>${b11Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${b11Pct}%;"></div></div>
                    </div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span>B1.2 Advanced</span><span>${b12Pct}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${b12Pct}%;"></div></div>
                    </div>
                </div>
            </nav>
        `;
        layout.appendChild(sidebar);
        
        // 2. Main Area
        const main = document.createElement('main');
        main.className = 'app-main';
        
        // Calculate mock stats (or actual stats) for the header
        const prog = JSON.parse(localStorage.getItem('dc_progress_v1') || '{}');
        let due = 0, hard = 0, newCount = 0, mastered = 0;
        const now = Date.now();
        for(let k in prog) { 
            if(prog[k].nextReview && prog[k].nextReview < now) due++;
        }
        
        // Use placeholders if 0
        if (due === 0) due = 12;
        if (hard === 0) hard = 4;
        if (newCount === 0) newCount = 20;
        if (mastered === 0) mastered = 450;
        
        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = `
            <div style="display: flex; gap: var(--space-sm); align-items: center;">
                <button class="ds-mobile-menu-btn ds-btn ds-btn-secondary" id="menuBtn" style="padding: 8px;">
                    <i data-lucide="menu"></i>
                </button>
                <button class="ds-btn ds-btn-secondary theme-toggle-btn" id="themeToggleBtn" style="padding: 8px;" title="Toggle Dark Mode">
                    <i data-lucide="moon"></i>
                </button>
            </div>
            <div class="header-title mobile-only">Deutsch Coach</div>
            <div class="header-srs-metrics">
                <div class="srs-metric due"><div class="srs-val">${due}</div><div class="srs-label">Due Today</div></div>
                <div class="srs-metric hard"><div class="srs-val">${hard}</div><div class="srs-label">Difficult</div></div>
                <div class="srs-metric new"><div class="srs-val">${newCount}</div><div class="srs-label">New</div></div>
                <div class="srs-metric mastered"><div class="srs-val">${mastered}</div><div class="srs-label">Mastered</div></div>
            </div>
            <button class="ds-btn ds-btn-primary" id="startReviewBtn" onclick="window.location.href='deutsch-coach.html'">
                <i data-lucide="play" style="width: 18px;"></i> <span class="btn-text">Start Daily Review</span>
            </button>
        `;
        main.appendChild(header);
        
        // Content Area wrapper
        const content = document.createElement('div');
        content.className = 'app-content';
        
        // Create legacy wrapper for old content
        const legacyWrapper = document.createElement('div');
        legacyWrapper.className = 'legacy-wrapper';
        
        childrenToMove.forEach(child => {
            legacyWrapper.appendChild(child);
        });
        
        // Hide old redundant sidebars automatically, but keep .suite-hub for cross-navigation
        const oldHubs = legacyWrapper.querySelectorAll('.appshell > .sidebar, .hub-links, .hub-banner');
        oldHubs.forEach(h => h.style.display = 'none');
        
        content.appendChild(legacyWrapper);
        main.appendChild(content);
        layout.appendChild(main);
        
        // Overlay for mobile drawer
        const drawerOverlay = document.createElement('div');
        drawerOverlay.className = 'drawer-overlay';
        drawerOverlay.id = 'drawerOverlay';
        layout.appendChild(drawerOverlay);

        // 3. Details Drawer
        const detailsDrawer = document.createElement('div');
        detailsDrawer.className = 'details-drawer';
        detailsDrawer.id = 'detailsDrawer';
        detailsDrawer.innerHTML = `
            <div class="drawer-header">
                <h3 style="margin:0; font-size: 16px;">Deep Mode Details</h3>
                <button class="close-drawer-btn" id="closeDrawerBtn"><i data-lucide="x"></i></button>
            </div>
            <div class="drawer-content">
                <p style="font-size: 14px;"><strong>Memory Tricks:</strong> Use visualization to remember difficult genders.</p>
                <p style="font-size: 14px;"><strong>Gender Locks:</strong> (der) = 🔵, (die) = 🔴, (das) = 🟢</p>
                <p style="font-size: 14px;"><strong>Plurals:</strong> Watch out for umlaut changes.</p>
                <div class="keyboard-shortcuts" style="margin-top: 32px; border-top: 1px solid var(--color-border); padding-top: 16px;">
                    <h4 style="font-size: 12px; text-transform: uppercase; color: var(--color-ink-soft);">Keyboard Shortcuts</h4>
                    <ul style="list-style:none; padding:0; margin:0; font-size:13px; color:var(--color-ink);">
                        <li style="margin-bottom: 8px;">Toggle Drawer <span class="keyboard-hint">M</span></li>
                        <li style="margin-bottom: 8px;">Close Drawer <span class="keyboard-hint">Esc</span></li>
                        <li style="margin-bottom: 8px;">Fast Mode Sequence <span class="keyboard-hint">Enter</span> / <span class="keyboard-hint">N</span></li>
                    </ul>
                </div>
            </div>
        `;
        layout.appendChild(detailsDrawer);
        
        body.appendChild(layout);

        // Bind Events for newly created DOM
        const menuBtn = document.getElementById('menuBtn');
        const sidebarNode = document.getElementById('sidebar');
        if (menuBtn && sidebarNode) {
            menuBtn.addEventListener('click', () => {
                sidebarNode.classList.toggle('open');
                drawerOverlay.classList.toggle('open');
            });
        }

        window.toggleDrawer = () => { 
            if (detailsDrawer) detailsDrawer.classList.toggle('open'); 
            if (drawerOverlay) drawerOverlay.classList.toggle('open'); 
        };
        const toggleDrawer = window.toggleDrawer;

        const closeDrawerBtn = document.getElementById('closeDrawerBtn');
        if (closeDrawerBtn) {
            closeDrawerBtn.addEventListener('click', () => {
                detailsDrawer.classList.remove('open');
                drawerOverlay.classList.remove('open');
            });
        }
        
        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', () => {
                if (sidebarNode) sidebarNode.classList.remove('open');
                if (detailsDrawer) detailsDrawer.classList.remove('open');
                drawerOverlay.classList.remove('open');
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key.toLowerCase() === 'm') toggleDrawer();
            else if (e.key === 'Escape') {
                if (detailsDrawer.classList.contains('open')) detailsDrawer.classList.remove('open');
            } else if (e.key === 'Enter' || e.key.toLowerCase() === 'n') {
                // If there's an action button inside the legacy content, try clicking it first
                const checkBtn = document.querySelector('.actbtn.check, .actbtn.next');
                if (checkBtn) {
                    checkBtn.click();
                } else {
                    const reviewBtn = document.getElementById('startReviewBtn');
                    if (reviewBtn) reviewBtn.click();
                }
            }
        });

        // Theme Toggle Logic for legacy pages
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const isDark = document.body.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    document.body.removeAttribute('data-theme');
                    document.body.classList.remove('dark');
                    localStorage.setItem('de_theme', 'light');
                    themeBtn.innerHTML = '<i data-lucide="moon"></i>';
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    document.body.classList.add('dark');
                    localStorage.setItem('de_theme', 'dark');
                    themeBtn.innerHTML = '<i data-lucide="sun"></i>';
                }
                if (window.lucide) window.lucide.createIcons();
            });
            // Initial setup for theme icon
            if (localStorage.getItem('de_theme') === 'dark') {
                themeBtn.innerHTML = '<i data-lucide="sun"></i>';
                document.body.classList.add('dark');
            }
        }

        // Initialize icons for the newly injected shell
        if (window.lucide) window.lucide.createIcons();
    }
}

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAppShell);
} else {
    renderAppShell();
}

// Auto-load theme globally
const savedTheme = localStorage.getItem('de_theme');
if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark');
}


// Check AI Status globally
function checkAIStatus() {
    const provider = localStorage.getItem('de_ai_provider') || 'deepseek';
    let enabled = false;
    if (provider === 'ollama') {
        enabled = true;
    } else {
        enabled = !!localStorage.getItem('de_ai_key_' + provider);
    }
    
    if (enabled) {
        document.body.classList.add('ai-enabled');
    } else {
        document.body.classList.remove('ai-enabled');
    }
}
checkAIStatus();
