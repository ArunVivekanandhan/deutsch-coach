// =========================================================================
// DEUTSCH COACH - GLOBAL APP SHELL (New Design Migration)
// Dynamically renders the sidebar, header, and drawer across legacy pages
// =========================================================================

function injectDependencies() {
    // Inject Lucide script if not present
    if (!document.querySelector('script[src*="lucide"]')) {
        const script = document.createElement('script');
        script.src = "js/lucide.min.js";
        script.onload = () => {
            if (window.lucide) window.lucide.createIcons();
        };
        document.head.appendChild(script);
    }


        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = "Content-Security-Policy";
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com https://api.deepseek.com https://api.groq.com https://openrouter.ai http://localhost:11434; img-src 'self' data:; media-src 'self' data: blob:;";
        document.head.appendChild(cspMeta);
    }

    // Inject Mobile & PWA tags if not present
    if (!document.querySelector('link[rel="manifest"]')) {
        const manifest = document.createElement('link');
        manifest.rel = "manifest";
        manifest.href = "manifest.json";
        document.head.appendChild(manifest);
    }
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        const appleIcon = document.createElement('link');
        appleIcon.rel = "apple-touch-icon";
        appleIcon.href = "icon-192.png";
        document.head.appendChild(appleIcon);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement('meta');
        themeColor.name = "theme-color";
        themeColor.content = "#1B2A4A";
        document.head.appendChild(themeColor);
    }
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
        document.head.appendChild(viewport);
    }

    // Register Service Worker for PWA (Installable on Mobile)
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("sw.js").catch(err => console.log("SW Registration failed: ", err));
        });
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

    // Apply Simple Mode globally
    if (localStorage.getItem('de_simple_mode') === 'true') {
        document.body.classList.add('simple-mode');
    }
    // Inject dependencies on every page
    injectDependencies();


    // --- Real, aggregated progress (see js/progress-aggregator.js) ---
    // Previously this cascaded a single combined mastered-count through
    // arbitrary made-up per-level thresholds (150/250/300/300), which could
    // show an A1 progress bar filling from B1 mastery and had no basis in
    // actual per-level word counts. That's exactly the "fake precision"
    // problem - replaced with a real, honestly-labeled total below instead
    // of a number dressed up as per-level completion we can't actually back.
    const vocabStats = (typeof ProgressAggregator !== 'undefined')
        ? ProgressAggregator.getVocabularyStats()
        : { due: 0, difficult: 0, mastered: 0, reviewed: 0 };
    const lessonsCompleted = (typeof ProgressAggregator !== 'undefined')
        ? ProgressAggregator.getLessonsCompleted() : 0;
    const streak = (typeof ProgressAggregator !== 'undefined')
        ? ProgressAggregator.getStreak() : 0;
    const byLevel = (typeof ProgressAggregator !== 'undefined')
        ? ProgressAggregator.getVocabularyStatsByLevel()
        : { A1: { mastered: 0, reviewed: 0 }, A2: { mastered: 0, reviewed: 0 }, B1: { mastered: 0, reviewed: 0 }, B2: { mastered: 0, reviewed: 0 } };
    // Real per-level counts, not percentages - there's no reliable total
    // vocabulary-per-level figure available from this shared script (each
    // page only loads its own word list), so showing "X mastered / Y
    // studied" is what can honestly be shown rather than a fabricated %.
    const levelRow = (label, s) => `
                    <div class="level-progress-container">
                        <div class="progress-label"><span>${label}</span><span>${s.mastered} mastered</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${s.reviewed > 0 ? Math.round(s.mastered / s.reviewed * 100) : 0}%;" role="progressbar" aria-label="${label} mastery" aria-valuenow="${s.mastered}" aria-valuemin="0" aria-valuemax="${s.reviewed}"></div></div>
                    </div>`;

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
            <nav class="app-sidebar-nav" aria-label="Primary">
                <div class="nav-group">
                    <div class="nav-group-title" id="primary-nav-title">Navigation</div>
                    <a href="index.html" class="nav-link"><i data-lucide="home" class="nav-icon" aria-hidden="true"></i> Home</a>
                    <a href="index.html#lernen" class="nav-link"><i data-lucide="book-open" class="nav-icon" aria-hidden="true"></i> Lernen</a>
                    <a href="index.html#pruefung" class="nav-link"><i data-lucide="award" class="nav-icon" aria-hidden="true"></i> Prüfung</a>
                    <a href="index.html#coach" class="nav-link"><i data-lucide="bot" class="nav-icon" aria-hidden="true"></i> AI Coach</a>
                    <a href="index.html#tools" class="nav-link"><i data-lucide="wrench" class="nav-icon" aria-hidden="true"></i> Tools</a>
                    <a href="Uebersetzer.html" class="nav-link"><i data-lucide="languages" class="nav-icon" aria-hidden="true"></i> Übersetzer</a>
                    <a href="Einstellungen_Setup.html" class="nav-link"><i data-lucide="settings" class="nav-icon" aria-hidden="true"></i> AI Config & Settings</a>
                </div>
                <div class="nav-group" aria-labelledby="level-nav-title">
                    <div class="nav-group-title" id="level-nav-title">Your Level Progress</div>
                    ${levelRow('A1', byLevel.A1)}
                    ${levelRow('A2', byLevel.A2)}
                    ${levelRow('B1', byLevel.B1)}
                    ${levelRow('B2', byLevel.B2)}
                </div>
                <div class="nav-group" aria-labelledby="progress-nav-title">
                    <div class="nav-group-title" id="progress-nav-title">Your Progress</div>
                    <div class="level-progress-container">
                        <div class="progress-label"><span id="mastered-label">Words mastered (all levels)</span><span aria-hidden="true">${vocabStats.mastered}</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${vocabStats.reviewed > 0 ? Math.round(vocabStats.mastered / vocabStats.reviewed * 100) : 0}%;" role="progressbar" aria-labelledby="mastered-label" aria-valuenow="${vocabStats.mastered}" aria-valuemin="0" aria-valuemax="${vocabStats.reviewed}"></div></div>
                        <div class="progress-label" style="margin-top: 4px; font-size: 11px; opacity: 0.75;"><span>${vocabStats.reviewed} words studied so far</span></div>
                    </div>
                    <div class="level-progress-container" style="display:flex; justify-content:space-between; font-size:12px; color:var(--color-ink-soft);">
                        <span><span aria-hidden="true">🔥</span> ${streak}-day streak</span>
                        <span>${lessonsCompleted} lessons done</span>
                    </div>
                </div>
            </nav>
        `;
        layout.appendChild(sidebar);
        
        // 2. Main Area
        const main = document.createElement('main');
        main.className = 'app-main';
        main.setAttribute('role', 'main');

        // Header stats reuse the same real aggregate computed above - no
        // separate re-count, no fabricated "New" estimate.
        const due = vocabStats.due, hard = vocabStats.difficult, mastered = vocabStats.mastered;
        const reviewedCount = vocabStats.reviewed;

        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = `
            <div style="display: flex; gap: var(--space-sm); align-items: center;">
                <button class="ds-mobile-menu-btn ds-btn ds-btn-secondary" id="menuBtn" style="padding: 8px;" aria-label="Open navigation menu" aria-expanded="false" aria-controls="sidebar">
                    <i data-lucide="menu" aria-hidden="true"></i>
                </button>
                <button class="ds-btn ds-btn-secondary theme-toggle-btn" id="themeToggleBtn" style="padding: 8px;" title="Toggle Dark Mode" aria-label="Toggle dark mode">
                    <i data-lucide="moon" aria-hidden="true"></i>
                </button>
                <div class="streakbox" style="margin-left: var(--space-sm);"></div>
            </div>
            <div class="header-title mobile-only">Deutsch Coach</div>
            <div class="header-srs-metrics">
                <div class="srs-metric due"><div class="srs-val">${due}</div><div class="srs-label">Due Today</div></div>
                <div class="srs-metric hard"><div class="srs-val">${hard}</div><div class="srs-label">Difficult</div></div>
                <div class="srs-metric new"><div class="srs-val">${reviewedCount}</div><div class="srs-label">Reviewed</div></div>
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
                const isOpen = sidebarNode.classList.toggle('open');
                drawerOverlay.classList.toggle('open');
                menuBtn.setAttribute('aria-expanded', String(isOpen));
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

        // Theme toggle: one source of truth (dcSetTheme below keeps every page's markers in line)
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                dcSetTheme(!dcThemeState.dark, true);
                themeBtn.innerHTML = dcThemeState.dark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
                if (window.lucide) window.lucide.createIcons();
            });
            themeBtn.innerHTML = dcThemeState.dark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
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

// =========================================================================
// THEME — one source of truth for dark mode on every page.
// Pages used four different markers (body[data-theme], body.dark, html.dark / html.dark-theme) and many also had
// @media (prefers-color-scheme: dark) blocks that followed the phone/OS setting instead of the app's choice, so a
// page could end up half dark. Here: the app choice (localStorage de_theme; OS setting only when nothing is saved)
// is applied to ALL markers on <html> and <body>, and every prefers-color-scheme rule is switched to follow it.
// Pages keep their own toggle buttons: a MutationObserver notices whichever marker they flip and syncs the rest.
// =========================================================================
const dcThemeState = { dark: false, syncing: false, orig: new WeakMap() };
function dcPreferredDark() {
    let t = null;
    try { t = localStorage.getItem('de_theme'); } catch (e) { /* storage blocked */ }
    if (t === 'dark' || t === 'light') return t === 'dark';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function dcSyncSchemeMedia(dark) {
    const walk = rules => {
        for (const rule of rules) {
            if (rule.media && rule.cssRules) {
                let orig = dcThemeState.orig.get(rule);
                if (orig === undefined) { orig = rule.media.mediaText; dcThemeState.orig.set(rule, orig); }
                if (/prefers-color-scheme/.test(orig)) {
                    const wantsDark = /prefers-color-scheme:\s*dark/.test(orig);
                    const active = wantsDark === dark;
                    const rest = orig.replace(/(and\s*)?\(\s*prefers-color-scheme:\s*(dark|light)\s*\)(\s*and)?/g, '').trim();
                    try { rule.media.mediaText = active ? (rest || 'all') : 'not all'; } catch (e) { /* read-only */ }
                }
                walk(rule.cssRules);
            } else if (rule.cssRules) walk(rule.cssRules);
        }
    };
    for (const sheet of Array.from(document.styleSheets)) {
        let rules = null;
        try { rules = sheet.cssRules; } catch (e) { continue; }   // cross-origin sheet (fonts)
        if (rules) walk(rules);
    }
}
function dcSetTheme(dark, persist) {
    dcThemeState.syncing = true;
    dcThemeState.dark = !!dark;
    const els = [document.documentElement, document.body].filter(Boolean);
    for (const el of els) {
        el.setAttribute('data-theme', dark ? 'dark' : 'light');
        el.classList.toggle('dark', !!dark);
        el.classList.toggle('dark-theme', !!dark);
    }
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    dcSyncSchemeMedia(!!dark);
    try { dcRestoreSurfaces(); } catch (e) { /* first call runs before the contrast guard below is set up */ }
    if (persist) { try { localStorage.setItem('de_theme', dark ? 'dark' : 'light'); } catch (e) { /* ignore */ } }
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerHTML = dark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    // let the observer see our own changes first, then listen again
    setTimeout(() => { dcThemeState.syncing = false; }, 0);
    if (typeof dcRecheckAllContrast === 'function' && document.body) { setTimeout(dcRecheckAllContrast, 60); setTimeout(dcRecheckAllContrast, 700); }
}
function dcWatchThemeMarkers() {
    const obs = new MutationObserver(muts => {
        if (dcThemeState.syncing) return;
        for (const m of muts) {
            const el = m.target;
            const dark = m.attributeName === 'data-theme' ? el.getAttribute('data-theme') === 'dark'
                : (el.classList.contains('dark') || el.classList.contains('dark-theme'));
            if (dark !== dcThemeState.dark) { dcSetTheme(dark, true); break; }
        }
    });
    [document.documentElement, document.body].filter(Boolean)
        .forEach(el => obs.observe(el, { attributes: true, attributeFilter: ['class', 'data-theme'] }));
}
dcSetTheme(dcPreferredDark(), false);                   // as early as possible (html element)
document.addEventListener('DOMContentLoaded', () => {   // body exists + all inline <style> parsed
    dcSetTheme(dcPreferredDark(), false);
    dcWatchThemeMarkers();
});
window.addEventListener('load', () => dcSyncSchemeMedia(dcThemeState.dark));   // late stylesheets
window.addEventListener('storage', e => { if (e.key === 'de_theme') dcSetTheme(dcPreferredDark(), false); });
if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onOs = () => { let t = null; try { t = localStorage.getItem('de_theme'); } catch (e) { /* */ } if (!t) dcSetTheme(mq.matches, false); };
    if (mq.addEventListener) mq.addEventListener('change', onOs);
}
window.dcSetTheme = dcSetTheme;

// ---- Contrast guard: text that ends up (almost) the same colour as the background behind it — e.g. a card
// with a fixed white background whose text turns white in dark mode — gets a readable colour. Runs in idle
// batches (big tables stay smooth), again for content rendered later, and after every theme change.
const dcContrast = { fixed: new Set(), queue: [], scheduled: false, bgCache: new WeakMap() };
function dcRgb(str) {
    const m = String(str).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
}
function dcLum(c) {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}
function dcEffectiveBg(el) {
    const chain = [];
    let cur = el, found = null;
    while (cur && cur.nodeType === 1) {
        if (dcContrast.bgCache.has(cur)) { found = dcContrast.bgCache.get(cur); break; }
        chain.push(cur);
        const cs = getComputedStyle(cur);
        const c = dcRgb(cs.backgroundColor);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') { found = 'image'; break; }   // gradient / picture: can't judge
        if (c && c[3] >= 0.6) { found = c; break; }
        cur = cur.parentElement;
    }
    if (!found) found = dcThemeState.dark ? [15, 23, 42, 1] : [255, 255, 255, 1];
    chain.forEach(e => dcContrast.bgCache.set(e, found));
    return found;
}
function dcHasOwnText(el) {
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName)) return true;
    for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) return true;
    return false;
}
// Dark mode: pages that hard-code white / pastel card backgrounds (background:#fff) keep bright boxes in
// dark mode. Such surfaces get a dark background of the same tint; saturated colours (badges, buttons,
// highlights) and "active" chips (deliberately inverted) are left alone.
dcContrast.surfaces = new Set();
function dcRestoreSurfaces() {
    dcContrast.surfaces.forEach(el => { el.style.removeProperty('background-color'); el.removeAttribute('data-dc-surface'); });
    dcContrast.surfaces.clear();
    dcContrast.bgCache = new WeakMap();
}
function dcCheckSurface(el) {
    if (!dcThemeState.dark || dcContrast.surfaces.has(el) || el === document.body) return;
    if (/^(BUTTON|HTML|BODY|IMG|VIDEO|CANVAS|OPTION)$/.test(el.tagName) || el.closest('svg')) return;
    if (el.classList.contains('active') || el.getAttribute('aria-selected') === 'true' || el.getAttribute('aria-pressed') === 'true') return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || (cs.backgroundImage && cs.backgroundImage !== 'none')) return;
    const c = dcRgb(cs.backgroundColor);
    if (!c || c[3] < 0.6) return;
    const hi = Math.max(c[0], c[1], c[2]), lo = Math.min(c[0], c[1], c[2]);
    if (dcLum(c) < 0.7 || hi - lo > 70) return;               // not a white / pastel surface
    if (!/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
        const r = el.getBoundingClientRect();
        if (r.width * r.height < 2500) return;                 // small badges keep their pastel colour
    }
    const base = [30, 41, 59];                                 // slate-800, the app's dark card colour
    const out = base.map((b, i) => Math.min(255, Math.round(b + (c[i] - lo) * 2.2)));
    el.style.setProperty('background-color', `rgb(${out[0]}, ${out[1]}, ${out[2]})`, 'important');
    el.setAttribute('data-dc-surface', '1');
    dcContrast.surfaces.add(el);
}
function dcCheckContrast(el) {
    if (!el.isConnected || el.closest('svg')) return;
    dcCheckSurface(el);
    if (!dcHasOwnText(el)) return;
    // An element fixed earlier is re-judged with the page's own colour (transitions paused so the
    // computed colour is the real target, not an in-between value); the fix is kept or dropped in one go.
    const hadFix = dcContrast.fixed.has(el);
    let prevTransition = '';
    if (hadFix) { prevTransition = el.style.transition; el.style.transition = 'none'; el.style.removeProperty('color'); }
    let fix = null;
    const cs = getComputedStyle(el);
    if (cs.display !== 'none' && cs.visibility !== 'hidden') {
        const bg = dcEffectiveBg(el), fg = dcRgb(cs.color);
        if (bg !== 'image' && fg && fg[3] >= 0.3) {
            const lb = dcLum(bg), lf = dcLum(fg);
            if ((Math.max(lb, lf) + 0.05) / (Math.min(lb, lf) + 0.05) < 2.2) fix = lb > 0.4 ? '#1f2937' : '#f1f5f9';
        }
    }
    if (fix) {
        el.style.setProperty('color', fix, 'important');
        el.setAttribute('data-dc-contrast', '1');
        dcContrast.fixed.add(el);
    } else if (hadFix) {
        el.removeAttribute('data-dc-contrast');
        dcContrast.fixed.delete(el);
    }
    if (hadFix) { void getComputedStyle(el).color; el.style.transition = prevTransition; }
}
function dcRunContrastQueue(deadline) {
    dcContrast.scheduled = false;
    // Always do a small time slice: when the idle callback fires because of its timeout (busy page),
    // timeRemaining() is 0 and waiting for a "real" idle period could starve the queue forever.
    const start = Date.now();
    const more = () => Date.now() - start < 10 || (deadline && deadline.timeRemaining && deadline.timeRemaining() > 2);
    while (dcContrast.queue.length && more()) {
        const el = dcContrast.queue.pop();
        try { dcCheckContrast(el); } catch (e) { /* element gone */ }
    }
    if (dcContrast.queue.length) dcScheduleContrast();
}
function dcScheduleContrast() {
    if (dcContrast.scheduled) return;
    dcContrast.scheduled = true;
    (window.requestIdleCallback || (f => setTimeout(f, 30)))(dcRunContrastQueue, { timeout: 500 });
}
function dcQueueContrast(root) {
    if (!root || root.nodeType !== 1) return;
    // The queue is popped from the end: push in reverse document order so parents are handled first
    // (a card's background is darkened before the text inside it is judged).
    const all = root.querySelectorAll('*');
    for (let i = all.length - 1; i >= 0; i--) dcContrast.queue.push(all[i]);
    dcContrast.queue.push(root);
    dcScheduleContrast();
}
function dcRecheckAllContrast() {
    // Fixes are not cleared up front (that would flash unreadable text); every element is re-judged in turn.
    dcContrast.fixed.forEach(el => { if (!el.isConnected) dcContrast.fixed.delete(el); });
    dcContrast.bgCache = new WeakMap();
    dcContrast.queue = [];
    if (document.body) dcQueueContrast(document.body);
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(dcRecheckAllContrast, 150);
    new MutationObserver(muts => {
        for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) { dcContrast.bgCache = new WeakMap(); dcQueueContrast(n); }
    }).observe(document.body, { childList: true, subtree: true });
});
window.addEventListener('load', () => { setTimeout(dcRecheckAllContrast, 200); setTimeout(dcRecheckAllContrast, 900); });
// Pages animate colours (transition: all .15s … .3s): judge again once a colour transition has finished.
document.addEventListener('transitionend', e => {
    if (!/color|background|^all$/.test(e.propertyName) || !(e.target instanceof Element)) return;
    dcContrast.bgCache = new WeakMap();
    dcQueueContrast(e.target);
}, true);


// ---- Tamil that was drafted by AI (Task 38: ta_src "ai" / "ai?" in js/word-data.js) is labelled 🤖 wherever
// a page shows it; "ai?" = the translator was unsure. Human-entered Tamil has no ta_src and no label.
function dcTaIsAI(e) { return !!(e && typeof e.ta_src === 'string' && e.ta_src.indexOf('ai') === 0); }
function dcTaMark(e) {
    if (!dcTaIsAI(e)) return '';
    const unsure = e.ta_src === 'ai?';
    const title = unsure ? 'Tamil: KI-Übersetzung, unsicher (AI-assisted, uncertain)' : 'Tamil: KI-Übersetzung (AI-assisted translation, spot-checked)';
    return `<span class="dc-ta-ai" title="${title}" aria-label="${title}" style="font-size:.75em; opacity:.75; margin-left:3px; cursor:help;">🤖${unsure ? '?' : ''}</span>`;
}
function dcTaMarkText(e) { return dcTaIsAI(e) ? (e.ta_src === 'ai?' ? ' 🤖?' : ' 🤖') : ''; }
window.dcTaIsAI = dcTaIsAI; window.dcTaMark = dcTaMark; window.dcTaMarkText = dcTaMarkText;

// ---- Auto-audio switch for flashcards (home + Verb/Nomen/Adjektiv trainers). One key, de_auto_audio, is
// shared with the Einstellungen page; switching it off also stops the tense auto-read and any speech in progress.
function dcAutoAudioOn() { try { return localStorage.getItem('de_auto_audio') === 'true'; } catch (e) { return false; } }
function dcSetAutoAudio(on) {
    try {
        localStorage.setItem('de_auto_audio', on ? 'true' : 'false');
        if (!on) localStorage.setItem('de_auto_read_tenses', 'false');
    } catch (e) { /* storage blocked: the switch only lasts for this page */ }
    if (!on) {
        try { if (typeof cancelPendingSpeech === 'function') cancelPendingSpeech(); } catch (e) {}
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
        document.querySelectorAll('input[data-dc-tense-read]').forEach(i => { i.checked = false; });
    }
    document.querySelectorAll('.dc-audio-toggle').forEach(dcPaintAudioToggle);
    document.dispatchEvent(new CustomEvent('dc-audio-change', { detail: { on: !!on } }));
}
function dcPaintAudioToggle(btn) {
    const on = dcAutoAudioOn();
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? '🔊 Auto-Audio: An' : '🔇 Auto-Audio: Aus';
    btn.title = on ? 'Karten werden automatisch vorgelesen – klicken zum Ausschalten (Audio off)'
                   : 'Karten werden nicht vorgelesen – klicken zum Einschalten (Audio on). 🔊 auf der Karte spielt immer.';
}
function dcAudioToggleHTML() {
    const on = dcAutoAudioOn();
    return `<button type="button" class="dc-audio-toggle${on ? ' on' : ''}" aria-pressed="${on}" onclick="dcSetAutoAudio(!dcAutoAudioOn())"
        title="${on ? 'Karten werden automatisch vorgelesen – klicken zum Ausschalten (Audio off)' : 'Karten werden nicht vorgelesen – klicken zum Einschalten (Audio on). 🔊 auf der Karte spielt immer.'}">${on ? '🔊 Auto-Audio: An' : '🔇 Auto-Audio: Aus'}</button>`;
}
window.dcAutoAudioOn = dcAutoAudioOn;
window.dcSetAutoAudio = dcSetAutoAudio;
window.dcAudioToggleHTML = dcAudioToggleHTML;

// Shared string-escaping helper for building onclick="..." attributes safely.
// Several pages call this but never defined it locally - defining it once
// here (loaded on nearly every page) instead of re-patching it per page.
// A page's own function escapeQuotes(){} (if any) safely redeclares this.
function escapeQuotes(s) { return String(s || '').replace(/'/g, "\\'"); }

// Check AI Status globally
function checkAIStatus() {
    const provider = localStorage.getItem('de_ai_provider') || 'groq';
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
document.addEventListener('DOMContentLoaded', checkAIStatus);

// Chat-style AI call for every provider the Einstellungen page offers (deepseek, openai, groq, gemini,
// openrouter, ollama). messages = [{role:'system'|'user'|'assistant', content}]. Resolves with the reply
// text; rejects with an Error (no key, HTTP error, network) so callers can show it.
function dcAIConfigured() {
    const provider = localStorage.getItem('de_ai_provider') || 'groq';
    return provider === 'ollama' || !!localStorage.getItem('de_ai_key_' + provider);
}
async function dcCallAI(messages, opts) {
    opts = opts || {};
    const provider = localStorage.getItem('de_ai_provider') || 'groq';
    const key = localStorage.getItem('de_ai_key_' + provider) || '';
    if (provider !== 'ollama' && !key) throw new Error('Kein KI-Schlüssel eingerichtet (AI Config & Settings).');
    const ENDPOINTS = {
        deepseek: 'https://api.deepseek.com/chat/completions',
        openai: 'https://api.openai.com/v1/chat/completions',
        groq: 'https://api.groq.com/openai/v1/chat/completions',
        gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        openrouter: 'https://openrouter.ai/api/v1/chat/completions',
        ollama: localStorage.getItem('de_ai_endpoint_ollama') || 'http://localhost:11434/v1/chat/completions'
    };
    const MODELS = { deepseek: 'deepseek-chat', openai: 'gpt-4o-mini', groq: 'llama-3.1-8b-instant',
        gemini: 'gemini-2.0-flash', openrouter: 'openrouter/auto', ollama: 'llama3' };
    const endpoint = ENDPOINTS[provider] || ENDPOINTS.groq;
    const model = localStorage.getItem('de_ai_model_' + provider) || MODELS[provider] || MODELS.groq;
    const headers = { 'Content-Type': 'application/json' };
    if (provider !== 'ollama' && key) headers['Authorization'] = 'Bearer ' + key;
    const res = await fetch(endpoint, { method: 'POST', headers,
        body: JSON.stringify({ model, messages, temperature: opts.temperature != null ? opts.temperature : 0.4 }) });
    if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error('KI-Fehler (' + res.status + '): ' + txt.substring(0, 160));
    }
    const data = await res.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('Leere KI-Antwort.');
    return text;
}
window.dcAIConfigured = dcAIConfigured;
window.dcCallAI = dcCallAI;

// Shared AI call helper (same provider/key convention as checkAIStatus above -
// de_ai_provider + de_ai_key_<provider>, configured on Einstellungen_Setup.html).
// Any page can call this instead of rolling its own fetch logic. Always calls
// `callback(text)` - on any failure (no key, network error, bad response) the
// text starts with "AI Error" / "Error connecting" so callers can detect
// failure with a simple string check and fall back to offline content.
async function callAIHelper(promptText, callback) {
    const provider = localStorage.getItem('de_ai_provider') || 'groq';
    const apiKey = localStorage.getItem('de_ai_key_' + provider);

    let endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    let model = 'llama3-8b-8192';

    if (provider === 'openai') {
        endpoint = 'https://api.openai.com/v1/chat/completions';
        model = 'gpt-4o-mini';
    } else if (provider === 'ollama') {
        endpoint = localStorage.getItem('de_ai_endpoint_ollama') || 'http://localhost:11434/v1/chat/completions';
        model = localStorage.getItem('de_ai_model_ollama') || 'llama3';
    }

    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ model: model, messages: [{ role: "user", content: promptText }] })
        });
        const data = await res.json();
        if (data.choices && data.choices.length > 0) {
            callback(data.choices[0].message.content);
        } else {
            callback("AI Error: " + JSON.stringify(data));
        }
    } catch (e) {
        callback("Error connecting to AI: " + e.message);
    }
}
