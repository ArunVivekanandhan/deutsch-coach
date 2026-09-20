// =========================================================================
// DEUTSCH COACH - GLOBAL APP SHELL
// Dynamically renders the sidebar and navigation across all pages
// =========================================================================

const APP_NAVIGATION = [
  {
    group: 'Dashboard',
    links: [
      { name: 'Home', path: 'index.html', icon: '📊' }
    ]
  },
  {
    group: 'Lernen',
    links: [
      { name: 'SRS Smart Learn', path: 'deutsch-coach.html', icon: '🧠' },
      { name: 'Wortschatz Grid', path: 'Wortschatz_Master_Grid.html', icon: '📝' },
      { name: 'Grammatik Regeln', path: 'Grammatik_Regel_Trainer.html', icon: '🧩' },
      { name: 'Satzbau Trainer', path: 'Satzbau_Trainer.html', icon: '🏗️' },
      { name: 'Hörverstehen', path: 'Hoerverstehen_Diktat_Trainer.html', icon: '🎧' }
    ]
  },
  {
    group: 'Prüfung & Praxis',
    links: [
      { name: 'A2 Studio', path: 'German_A2_Practice_Studio.html', icon: '🎓' },
      { name: 'B1 Studio', path: 'German_B1_Practice_Studio.html', icon: '🎓' },
      { name: 'Sprechen & Prüfung', path: 'Sprech_Pruefungs_Simulator.html', icon: '🗣️' },
      { name: 'Brief Schreiben', path: 'Brief_Schreiben_Trainer.html', icon: '✉️' }
    ]
  },
  {
    group: 'KI Coach',
    links: [
      { name: 'Live Text Coach', path: 'KI_German_Coach.html', icon: '🤖' },
      { name: 'Human Partner', path: 'KI_Human_Partner.html', icon: '👥' },
      { name: 'Dialog Schatten', path: 'Dialog_Schatten_Trainer.html', icon: '🎭' }
    ]
  },
  {
    group: 'Tools & Flashcards',
    links: [
      { name: 'Verben Trainer', path: 'Verb_Transformation_Trainer.html', icon: '⚡' },
      { name: 'Nomen & Adjektive', path: 'Nomen_Adjektiv_Trainer.html', icon: '📦' },
      { name: 'Cheat Codes', path: 'German_Grammar_Cheat_Codes.html', icon: '💡' },
      { name: 'Einstellungen', path: 'Einstellungen_Setup.html', icon: '⚙️' }
    ]
  }
];

function renderAppShell() {
  // If the body doesn't have the app-layout class, we are migrating a legacy page.
  // We will wrap the existing body content into the new shell.
  const body = document.body;
  if (!body.querySelector('.app-layout')) {
    // Move nodes instead of using innerHTML to preserve event listeners and script execution!
    const childrenToMove = Array.from(body.childNodes);
    
    const layout = document.createElement('div');
    layout.className = 'app-layout';
    
    const sidebar = document.createElement('aside');
    sidebar.className = 'app-sidebar';
    
    // Sidebar Header
    const sidebarHeader = document.createElement('div');
    sidebarHeader.className = 'app-sidebar-header';
    sidebarHeader.textContent = 'Deutsch Coach';
    sidebar.appendChild(sidebarHeader);
    
    // Sidebar Nav
    const nav = document.createElement('nav');
    nav.className = 'app-sidebar-nav';
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    APP_NAVIGATION.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'nav-group';
      
      const title = document.createElement('div');
      title.className = 'nav-group-title';
      title.textContent = group.group;
      groupEl.appendChild(title);
      
      group.links.forEach(link => {
        const a = document.createElement('a');
        a.className = 'nav-link' + (currentPath === link.path ? ' active' : '');
        a.href = './' + link.path;
        a.innerHTML = \`<span class="nav-icon">\${link.icon}</span> \${link.name}\`;
        groupEl.appendChild(a);
      });
      
      nav.appendChild(groupEl);
    });
    
    sidebar.appendChild(nav);
    layout.appendChild(sidebar);
    
    const main = document.createElement('main');
    main.className = 'app-main';
    
    const header = document.createElement('header');
    header.className = 'app-header';
    header.innerHTML = \`
      <div style="display:flex; align-items:center; gap:16px;">
        <button class="ds-btn ds-btn-secondary ds-mobile-menu-btn" onclick="document.querySelector('.app-sidebar').classList.toggle('open')" style="padding:8px;">☰</button>
        <div style="font-weight:600;">\${document.title}</div>
      </div>
      <div>
        <button class="ds-btn ds-btn-secondary" onclick="const isD = document.body.classList.toggle('dark'); localStorage.setItem('de_theme', isD ? 'dark' : 'light');">🌙 Theme</button>
      </div>
    \`;
    main.appendChild(header);
    
    const content = document.createElement('div');
    content.className = 'app-content';
    
    // Create legacy wrapper
    const legacyWrapper = document.createElement('div');
    legacyWrapper.className = 'legacy-wrapper';
    
    childrenToMove.forEach(child => {
        legacyWrapper.appendChild(child);
    });
    
    // Hide all old suite-hubs automatically
    const oldHubs = legacyWrapper.querySelectorAll('.suite-hub, .appshell > .sidebar, .hub-links');
    oldHubs.forEach(h => h.style.display = 'none');
    
    content.appendChild(legacyWrapper);
    main.appendChild(content);
    layout.appendChild(main);
    
    body.appendChild(layout);
  }
}

// Auto-init on load
document.addEventListener('DOMContentLoaded', renderAppShell);


// Auto-load theme
const savedTheme = localStorage.getItem('de_theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}
