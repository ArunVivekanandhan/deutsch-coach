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
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com https://api.deepseek.com https://api.groq.com https://openrouter.ai http://localhost:11434 https://api.elevenlabs.io https://api.simli.ai wss://api.simli.ai https://*.livekit.cloud wss://*.livekit.cloud; img-src 'self' data:; media-src 'self' data: blob: mediastream:;";
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

// ---- Site map (Task 61): ONE list of every page, grouped by skill. Drives the sidebar menu on every page and the
// home page sections, so a new page is added here once. lvl = suggested level, ai = needs an AI key.
window.DC_SITEMAP = [
  { id: 'start', icon: 'sunrise', title: 'Start', pages: [
    { href: 'index.html', icon: 'home', t: 'Home · Tagesplan', d: 'Dein Plan für heute, zuletzt geübt, alle Bereiche.' },
    { href: 'deutsch-coach.html', icon: 'layers', t: 'Karteikarten (tägliche Wiederholung)', d: 'Wörter mit Wiederholungs-System: fällige Karten, Bilder, Tamil, Audio.', lvl: 'A1–B2' },
    { href: 'Meine_Fehler.html', icon: 'notebook-pen', t: 'Meine Fehler (Fehlerheft)', d: 'Alle falschen Antworten aus allen Übungen — wiederholen, bis sie sitzen.', lvl: 'alle' },
    { href: 'Mein_Fortschritt.html', icon: 'chart-column', t: 'Mein Fortschritt (Woche)', d: 'Übungszeit pro Bereich an jedem Tag, Ergebnisse und was du als Nächstes üben solltest.', lvl: 'alle' } ] },
  { id: 'woerter', icon: 'library', title: 'Wörter', mod: 'vocab', pages: [
    { href: 'Verb_Transformation_Trainer.html', icon: 'zap', t: 'Verben', d: 'Alle Zeitformen eines Verbs, Karteikarten, Merkhilfen.', lvl: 'A1–B2' },
    { href: 'Nomen_Trainer.html', icon: 'box', t: 'Nomen (der/die/das)', d: 'Artikel und Plural sicher lernen.', lvl: 'A1–B2' },
    { href: 'Adjektiv_Adverb_Trainer.html', icon: 'shapes', t: 'Adjektive & Adverbien', d: 'Gegenteile, Komparativ, Superlativ.', lvl: 'A1–B2' },
    { href: 'Wort_Zwillinge.html', icon: 'copy', t: 'Wort-Zwillinge', d: 'Verwechselbare Wörter: Küche / Kuchen, obwohl / trotzdem …', lvl: 'A1–B1' },
    { href: 'Wortschatz_Master_Grid.html', icon: 'grid-3x3', t: 'Wortschatz: Raster & Tabelle', d: 'Alle Wörter als Raster mit Wortfamilien — oder als Tabelle mit allen Formen (drucken, exportieren).', lvl: 'A1–B2',
      views: [['Wortschatz_Master_Grid.html', '🔲 Raster & Wortfamilien'], ['Deutsch_Wortschatz_Excel_Sheet.html', '📊 Tabelle (Excel)']] },
    { href: 'Uebersetzer.html', icon: 'languages', t: 'Übersetzer & Wort-Explorer', d: 'Wort oder Satz nachschlagen: Formen, Wortaufbau, Tamil.', lvl: 'alle' } ] },
  { id: 'grammatik', icon: 'puzzle', title: 'Grammatik & Satzbau', mod: 'grammar', pages: [
    { href: 'Grammatik_Regel_Trainer.html', icon: 'puzzle', t: 'Grammatik-Regeln', d: 'Alle Regeln A1 → B2 mit Tabellen, Bildern, Tamil-Brücken und Übungen.', lvl: 'A1–B2' },
    { href: 'Bild_Grammatik.html', icon: 'clapperboard', t: 'Grammatik in Bildern (animiert)', d: 'Jede Regel als bewegtes Bild: Wörter wandern, die Katze springt auf den Tisch, die Uhr dreht sich — plus Bild-Quiz.', lvl: 'A1–B1' },
    { href: 'Satzbau_Trainer.html', icon: 'construction', t: 'Satzbau-Trainer', d: 'Sätze bauen: Verb auf Position 2, Nebensätze, Konnektoren.', lvl: 'A1–B1' },
    { href: 'Zeitreise_Trainer.html', icon: 'history', t: 'Zeitreise: gestern · heute · morgen', d: 'Vergangenheit, Gegenwart, Zukunft im selben Satz üben.', lvl: 'A1–B1' },
    { href: 'konnektoren_referenz.html', icon: 'link', t: 'Konnektoren', d: 'weil, deshalb, obwohl, trotzdem … mit Wortstellung.', lvl: 'A2–B1' },
    { href: 'German_Grammar_Cheat_Codes.html', icon: 'lightbulb', t: 'Grammatik-Spickzettel', d: '30+ Abkürzungen und Eselsbrücken.', lvl: 'A1–B1' } ] },
  { id: 'schreiben', icon: 'pen-tool', title: 'Schreiben & Übersetzen', mod: 'write', pages: [
    { href: 'Text_Trainer.html', icon: 'file-pen', t: 'Text-Trainer (EN → DE) + ⚡ Crashkurs', d: 'Prüfungstext Satz für Satz übersetzen: Leicht / Mittel / Schwer.', lvl: 'A1–B1' },
    { href: 'Brief_Schreiben_Trainer.html', icon: 'mail', t: 'Brief schreiben', d: 'E-Mails und Briefe für die Prüfung, KI-Korrektur.', lvl: 'A2–B1', ai: true },
    { href: 'KI_German_Coach.html', icon: 'message-square', t: 'KI-Text-Coach', d: 'Auf Deutsch chatten und sofort korrigiert werden.', lvl: 'A1–B2', ai: true } ] },
  { id: 'hoeren', icon: 'headphones', title: 'Hören & Lesen', mod: 'speak', pages: [
    { href: 'Hoerverstehen_Diktat_Trainer.html', icon: 'headphones', t: 'Hörverstehen & Diktat', d: 'Hören und aufschreiben, Endlos-Audio.', lvl: 'A1–B1' },
    { href: 'Continuous_Verb_Speaker.html', icon: 'play-circle', t: 'Auto-Play: Verben hören', d: 'Englisch → Deutsch im Loop — beim Gehen oder Kochen.', lvl: 'A1–B2' },
    { href: 'Geschichte_Trainer.html', icon: 'book-open', t: 'Geschichte: Lena & Jonas', d: 'Eine Geschichte in Kapiteln lesen und hören.', lvl: 'A1–A2' } ] },
  { id: 'sprechen', icon: 'mic', title: 'Sprechen', mod: 'speak', pages: [
    { href: 'Thema_Sprech_Trainer.html', icon: 'mic', t: 'Themen-Sprechtrainer', d: 'ich/du/er … im Perfekt nachsprechen, mit Audio und Loop.', lvl: 'A1–B1' },
    { href: 'Dialog_Schatten_Trainer.html', icon: 'mic-2', t: 'Dialog-Schatten', d: 'Dialoge laut mitsprechen, Aussprache verbessern.', lvl: 'A1–B1' },
    { href: 'KI_Sprechpartner.html', icon: 'drama', t: 'KI-Sprechpartner (Anruf)', d: 'Rollenspiele mit Stimme: Café, Arzt, Amt … mit Korrektur.', lvl: 'A1–B2', ai: true },
    { href: 'KI_Human_Partner.html', icon: 'users', t: 'Live-Video-Partner', d: 'Gespräch mit einem KI-Avatar.', lvl: 'A2–B2', ai: true } ] },
  { id: 'pruefung', icon: 'award', title: 'Prüfung', mod: 'exam', pages: [
    { href: 'A1_Sprech_Pruefungs_Simulator.html', icon: 'mic', t: 'Sprechprüfung simulieren (A1 · B1)', d: 'A1: vorstellen, fragen, bitten · B1/DTZ: planen, diskutieren, präsentieren — wie in der Prüfung.', lvl: 'A1–B1',
      views: [['A1_Sprech_Pruefungs_Simulator.html', '🅰️ A1 · Start Deutsch 1'], ['Sprech_Pruefungs_Simulator.html', '🅱️ B1 · DTZ']] },
    { href: 'German_A2_Practice_Studio.html', icon: 'award', t: 'A2 Praxis-Studio', d: 'Die 7 Module der A2-Prüfung.', lvl: 'A2' },
    { href: 'German_B1_Practice_Studio.html', icon: 'graduation-cap', t: 'B1 Praxis-Studio', d: 'telc / Goethe Zertifikat B1 gezielt üben.', lvl: 'B1' },
 ] },
  { id: 'setup', icon: 'settings', title: 'Einstellungen', pages: [
    { href: 'Einstellungen_Setup.html', icon: 'settings', t: 'KI-Schlüssel & Einstellungen', d: 'KI-Anbieter, Stimme, Audio, Design.' } ] }
];
// the menu entry a page belongs to (a page can be one "view" of a merged entry, e.g. Raster | Tabelle)
function dcPageEntry(href) { for (const g of DC_SITEMAP) for (const p of g.pages) if (p.href === href || (p.views || []).some(v => v[0] === href)) return { g, p }; return null; }
window.dcPageEntry = dcPageEntry;
function dcCurrentPage() { const f = (location.pathname.split('/').pop() || 'index.html'); return f || 'index.html'; }
// Sidebar menu: a search box + one collapsible group per skill; the group of the current page is open.
function dcNavHTML() {
    const cur = dcCurrentPage();
    const esc = x => String(x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return `<div class="nav-group dc-nav">
        <input type="search" class="dc-nav-search" id="dcNavSearch" placeholder="🔎 Seite suchen … (z. B. Verben, Brief)" aria-label="Seite suchen">
        ${DC_SITEMAP.map(g => {
            const open = g.pages.some(p => p.href === cur || (p.views || []).some(v => v[0] === cur)) || (cur === 'index.html' && g.id === 'start');
            return `<details class="dc-nav-grp" data-grp="${g.id}" ${open ? 'open' : ''}><summary><i data-lucide="${g.icon}" class="nav-icon" aria-hidden="true"></i> ${esc(g.title)} <span class="dc-nav-n">${g.pages.length}</span></summary>
                ${g.pages.map(p => { const on = p.href === cur || (p.views || []).some(v => v[0] === cur); return `<a href="${p.href}" class="nav-link${on ? ' active' : ''}" ${on ? 'aria-current="page"' : ''} data-q="${esc((p.t + ' ' + p.d).toLowerCase())}"><i data-lucide="${p.icon}" class="nav-icon" aria-hidden="true"></i> ${esc(p.t)}${p.ai ? ' <span title="braucht KI-Schlüssel">🤖</span>' : ''}</a>`; }).join('')}
            </details>`; }).join('')}
    </div>`;
}
function dcBindNavSearch(root) {
    const inp = (root || document).querySelector('#dcNavSearch'); if (!inp) return;
    inp.addEventListener('input', () => {
        const q = inp.value.trim().toLowerCase();
        document.querySelectorAll('.dc-nav-grp').forEach(g => {
            let any = false;
            g.querySelectorAll('.nav-link').forEach(a => { const hit = !q || a.dataset.q.includes(q); a.style.display = hit ? '' : 'none'; any = any || hit; });
            g.style.display = any ? '' : 'none'; if (q && any) g.open = true;
        });
    });
}
// Remember the last pages practised (for "Zuletzt geübt" on the home page).
(function dcRememberPage() {
    try {
        const cur = dcCurrentPage(); if (cur === 'index.html') return;
        if (!dcPageEntry(cur)) return;
        const r = JSON.parse(localStorage.getItem('dc_recent') || '[]').filter(x => x.href !== cur);
        r.unshift({ href: cur, at: Date.now() }); localStorage.setItem('dc_recent', JSON.stringify(r.slice(0, 8)));
    } catch (e) { /* storage blocked */ }
})();
window.dcNavHTML = dcNavHTML; window.dcBindNavSearch = dcBindNavSearch;
// Animated pictures (Task 67): every word picture / icon pops in and then moves in a way that fits what it shows
// (🏃 runs, 🐦 flies, 🔥 flickers, 💧 drips, ❤️ beats, 😴 breathes …; anything else floats gently). CSS in
// design-system.css (.dc-anim[data-anim=…]). New pictures are picked up by a MutationObserver. Off: OS "reduce motion",
// or localStorage dc_anim = 'off' (switch in Einstellungen and on Bild_Grammatik.html) → html.dc-no-anim.
(function dcAnimatePics() {
    const MAP = { move: '🏃🚶🚗🚌🚆🚲🚕🚚🛴🏊🚂🚇🛵🏍🚴🧗⛷🏄🚣🚙🚓🚑🚒🚜🛻🚎🚐🧍🤸🐎🐕🐈🐢🐌🦆🐜', fly: '🐦🦋✈🎈🪁🕊🛫🛬🦅🐝🚁🪽🎐📨✉💌🍃',
        spin: '🌀⚙🎡🔄🔁❄🌍🌎🌏⏳⌛☀🌞🧭💿📀🎠🌻🧶', pulse: '❤💖💗💓💔🫀💯⭐✨🌟💡🔴🔵🟢🟡⚫⚪🟣🟠🟤💎🏆🥇🎯💘❣',
        shake: '😂😠😡😱🔔📞☎⏰😬🥶🤣😤🤬📢📣🚨🥁😵🤯😨😰', flicker: '🔥🕯⚡🎆🎇💥🌋', bounce: '⚽🏀🎾🐸🦘🐇🎉🥳👍✅🏐🎊🙌👏🤾🏈🎈🧸🐥',
        fall: '💧🌧☔🍂🍁🌨💦🌦☂🚿💦🩸', breathe: '😴💤🛌🛋🌙🥱🌜🌛😌🧘🛏', wave: '🌊👋🏳🚩🌾🌳🌴🌲🎏🏁🎋🙋' };
    const KIND = {};
    Object.entries(MAP).forEach(([k, v]) => Array.from(v).forEach(ch => { if (ch !== '️') KIND[ch] = k; }));
    const SEL = '.wpic,.wz-pic,.wz-q-pic,.wordicon,.verb-icon,.module-icon,.flash-pic,.card-pic,.pic-big,[data-pic]';
    function kindOf(el) {
        if (el.dataset.pic && MAP[el.dataset.pic]) return el.dataset.pic;
        for (const ch of Array.from((el.textContent || '').trim())) { if (KIND[ch]) return KIND[ch]; if (/\p{L}/u.test(ch)) break; }
        return el.classList.contains('module-icon') ? 'once' : 'float';
    }
    function deco(root) {
        if (!root || root.nodeType !== 1) return;
        const list = root.matches && root.matches(SEL) ? [root] : [];
        root.querySelectorAll && list.push(...root.querySelectorAll(SEL));
        list.forEach(el => { if (el.classList.contains('dc-anim') || (!el.matches('.wpic,[data-pic]') && el.querySelector('.wpic'))) return; /* the inner picture moves, not its box */ el.dataset.anim = kindOf(el); el.classList.add('dc-anim'); });
    }
    try { if (localStorage.getItem('dc_anim') === 'off') document.documentElement.classList.add('dc-no-anim'); } catch (e) {}
    window.dcSetAnim = on => { try { localStorage.setItem('dc_anim', on ? 'on' : 'off'); } catch (e) {} document.documentElement.classList.toggle('dc-no-anim', !on); };
    window.dcAnimOn = () => !document.documentElement.classList.contains('dc-no-anim');
    const start = () => {
        deco(document.body);
        new MutationObserver(recs => recs.forEach(r => r.addedNodes.forEach(deco))).observe(document.body, { childList: true, subtree: true });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

// Interface language German ⇄ English: the dictionary + translator live in js/ui-i18n.js, loaded here for every page.
(function dcLoadI18n() {
    if (document.querySelector('script[src$="ui-i18n.js"]')) return;
    const sc = document.createElement('script'); sc.src = 'js/ui-i18n.js'; (document.head || document.documentElement).appendChild(sc);
    // "Satz erklärt" (grammar + word by word after a mistake) — js/sentence-explain.js loads the word list only when used
    if (!document.querySelector('script[src$="sentence-explain.js"]')) { const se = document.createElement('script'); se.src = 'js/sentence-explain.js'; (document.head || document.documentElement).appendChild(se); }
})();
// Practice time per skill and day (Task 65, shown on Mein_Fortschritt.html): every 15 s the page is visible AND was
// used in the last 60 s (tap, key, scroll) adds 15 s to dc_activity[YYYY-MM-DD][skill]. Skill = the page's menu group;
// the flashcards count as "woerter", the mistake notebook as "fehler". Kept for 120 days, only in this browser.
(function dcTrackTime() {
    let skill;
    try {
        const cur = dcCurrentPage(), ent = dcPageEntry(cur);
        skill = { 'deutsch-coach.html': 'woerter', 'Meine_Fehler.html': 'fehler' }[cur] || (ent && !['start', 'setup'].includes(ent.g.id) ? ent.g.id : null);
    } catch (e) { return; }
    if (!skill) return;
    let last = Date.now();
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(ev => addEventListener(ev, () => { last = Date.now(); }, { passive: true, capture: true }));
    setInterval(() => {
        if (document.visibilityState !== 'visible' || Date.now() - last > 60000) return;
        try {
            const d = new Date(), day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            const a = JSON.parse(localStorage.getItem('dc_activity') || '{}');
            a[day] = a[day] || {}; a[day][skill] = (a[day][skill] || 0) + 15;
            const keys = Object.keys(a).sort(); while (keys.length > 120) delete a[keys.shift()];
            localStorage.setItem('dc_activity', JSON.stringify(a));
        } catch (e) { /* storage blocked */ }
    }, 15000);
})();

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
                ${dcNavHTML()}
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
                <button class="ds-btn ds-btn-secondary" id="dcLangBtn" style="padding: 6px 10px; font-size: 13px; font-weight: 700;" type="button" title="Bedienung: Deutsch / English" data-no-i18n>🌐 DE</button>
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
        // "Mehr in diesem Bereich": the other pages of the same group, so the next exercise is one tap away
        const curPage = dcCurrentPage(), ent = dcPageEntry(curPage), grp = ent && ent.g.id !== 'setup' ? ent.g : null;
        // merged pages: a switch between the views at the top (Raster | Tabelle, A1 | B1)
        if (ent && ent.p.views) {
            const sw = document.createElement('nav');
            sw.className = 'dc-views'; sw.setAttribute('aria-label', 'Ansicht wechseln');
            sw.innerHTML = `<span class="dc-views-t">${ent.p.t}:</span>` + ent.p.views.map(([h, l]) => `<a href="${h}"${h === curPage ? ' aria-current="page" class="on"' : ''}>${l}</a>`).join('');
            content.insertBefore(sw, legacyWrapper);
        }
        if (grp) {
            const more = document.createElement('nav');
            more.className = 'dc-more'; more.setAttribute('aria-label', 'Mehr in diesem Bereich');
            more.innerHTML = `<div class="dc-more-t">Mehr in <b>${grp.title}</b> · <a href="index.html#${grp.id}">alle Bereiche</a></div><div class="dc-more-l">${grp.pages.filter(p => p !== ent.p).map(p => `<a href="${p.href}"><i data-lucide="${p.icon}" aria-hidden="true"></i> ${p.t}</a>`).join('')}</div>`;
            content.appendChild(more);
        }
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
        dcBindNavSearch();
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

// ---- Link from any word to the Übersetzer & Wort-Explorer (all details, AI questions, practice).
function dcTranslatorLink(word, compact) {
    const w = String(word || '').replace(/\([^)]*\)/g, '').trim();
    if (!w) return '';
    const href = 'Uebersetzer.html?q=' + encodeURIComponent(w);
    return compact
        ? `<a class="dc-tx-link" href="${href}" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="Im Übersetzer öffnen: alle Details, KI fragen, üben" style="text-decoration:none; margin-left:4px;">🌐</a>`
        : `<div class="dc-tx-link" style="margin-top:6px; font-size:12.5px; text-align:center;"><a href="${href}" target="_blank" rel="noopener" onclick="event.stopPropagation()">🌐 Alle Details · KI fragen · üben (Übersetzer)</a></div>`;
}
window.dcTranslatorLink = dcTranslatorLink;

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
// Endpoint, model and headers of the provider chosen in AI Config & Settings (shared by dcCallAI and dcStreamAI).
function dcAIRequestConfig() {
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
    const headers = { 'Content-Type': 'application/json' };
    if (provider !== 'ollama' && key) headers['Authorization'] = 'Bearer ' + key;
    return { provider, endpoint: ENDPOINTS[provider] || ENDPOINTS.groq,
        model: localStorage.getItem('de_ai_model_' + provider) || MODELS[provider] || MODELS.groq, headers };
}
async function dcAIHttpError(res) {
    const txt = await res.text().catch(() => '');
    const e = new Error('KI-Fehler (' + res.status + '): ' + txt.substring(0, 160));
    e.status = res.status;
    return e;
}
async function dcCallAI(messages, opts) {
    opts = opts || {};
    const cfg = dcAIRequestConfig();
    const res = await fetch(cfg.endpoint, { method: 'POST', headers: cfg.headers, signal: opts.signal,
        body: JSON.stringify({ model: cfg.model, messages, temperature: opts.temperature != null ? opts.temperature : 0.4 }) });
    if (!res.ok) throw await dcAIHttpError(res);
    const data = await res.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('Leere KI-Antwort.');
    return text;
}
// Streaming variant (Server-Sent Events, OpenAI-compatible "stream": true — all providers above support it).
// opts.onDelta(textPiece, fullSoFar) is called as tokens arrive; resolves with the full text. opts.signal aborts.
// A provider that answers without a stream (plain JSON) still works: the whole text arrives as one delta.
async function dcStreamAI(messages, opts) {
    opts = opts || {};
    const cfg = dcAIRequestConfig();
    const res = await fetch(cfg.endpoint, { method: 'POST', headers: cfg.headers, signal: opts.signal,
        body: JSON.stringify({ model: cfg.model, messages, stream: true, temperature: opts.temperature != null ? opts.temperature : 0.5 }) });
    if (!res.ok) throw await dcAIHttpError(res);
    let full = '';
    const ct = res.headers.get('content-type') || '';
    if (!res.body || !/event-stream|x-ndjson|octet-stream/.test(ct)) {
        const data = await res.json().catch(() => null);
        full = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
        if (full && opts.onDelta) opts.onDelta(full, full);
        if (!full) throw new Error('Leere KI-Antwort.');
        return full;
    }
    const reader = res.body.getReader(), dec = new TextDecoder();
    let buf = '';
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (payload === '[DONE]') return full;
            try {
                const j = JSON.parse(payload);
                const piece = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
                if (piece) { full += piece; if (opts.onDelta) opts.onDelta(piece, full); }
            } catch (e) { /* keep-alive or partial line */ }
        }
    }
    return full;
}
window.dcAIConfigured = dcAIConfigured;
window.dcCallAI = dcCallAI;
window.dcStreamAI = dcStreamAI;

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
