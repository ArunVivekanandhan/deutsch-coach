const ICON_SVGS = {
  abstract:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="4 4"/><circle cx="24" cy="24" r="5" fill="currentColor"/></svg>',
  briefcase:'<svg viewBox="0 0 48 48"><rect x="8" y="16" width="32" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M18 16v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="8" y1="26" x2="40" y2="26" stroke="currentColor" stroke-width="2.5"/></svg>',
  document:'<svg viewBox="0 0 48 48"><path d="M14 6h14l8 8v28a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M28 6v8h8" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" stroke-width="2"/><line x1="16" y1="30" x2="32" y2="30" stroke="currentColor" stroke-width="2"/><line x1="16" y1="36" x2="26" y2="36" stroke="currentColor" stroke-width="2"/></svg>',
  graduation:'<svg viewBox="0 0 48 48"><polygon points="24,10 44,18 24,26 4,18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 22v9c0 3 5 5 10 5s10-2 10-5v-9" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="44" y1="18" x2="44" y2="30" stroke="currentColor" stroke-width="2.5"/></svg>',
  handshake:'<svg viewBox="0 0 48 48"><path d="M4 22l9-8 7 5 4-3 8 6-6 8-4-3-4 4-9-6z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 26l6 6" stroke="currentColor" stroke-width="2.5"/></svg>',
  "chart-up":'<svg viewBox="0 0 48 48"><line x1="6" y1="42" x2="42" y2="42" stroke="currentColor" stroke-width="2.5"/><rect x="10" y="30" width="6" height="12" fill="currentColor"/><rect x="20" y="22" width="6" height="20" fill="currentColor"/><rect x="30" y="12" width="6" height="30" fill="currentColor"/><path d="M10 20l8-8 6 5 12-12" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
  building:'<svg viewBox="0 0 48 48"><rect x="10" y="8" width="28" height="34" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="16" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="2"/><line x1="24" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="2"/><line x1="32" y1="16" x2="36" y2="16" stroke="currentColor" stroke-width="2"/><line x1="16" y1="24" x2="20" y2="24" stroke="currentColor" stroke-width="2"/><line x1="24" y1="24" x2="28" y2="24" stroke="currentColor" stroke-width="2"/><line x1="32" y1="24" x2="36" y2="24" stroke="currentColor" stroke-width="2"/><rect x="20" y="32" width="8" height="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  search:'<svg viewBox="0 0 48 48"><circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="29" y1="29" x2="42" y2="42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  email:'<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="26" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M6 12l18 14L42 12" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
  megaphone:'<svg viewBox="0 0 48 48"><path d="M6 20v8h6l14 8V12l-14 8Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M26 16a8 8 0 0 1 0 16" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="10" y1="28" x2="12" y2="38" stroke="currentColor" stroke-width="2.5"/></svg>',
  video:'<svg viewBox="0 0 48 48"><rect x="4" y="12" width="26" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M30 20l14-8v24l-14-8Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  target:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="24" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="24" r="2.5" fill="currentColor"/></svg>',
  team:'<svg viewBox="0 0 48 48"><circle cx="16" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="32" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M6 40v-4c0-6 5-9 10-9s10 3 10 9v4" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M22 40v-4c0-6 5-9 10-9s10 3 10 9v4" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
  clock:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="24" y1="24" x2="24" y2="13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="24" y1="24" x2="32" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  house:'<svg viewBox="0 0 48 48"><path d="M6 22 24 8l18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 20v18h28V20" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="20" y="28" width="8" height="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  money:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="24" y="31" font-size="18" text-anchor="middle" fill="currentColor" font-family="sans-serif">€</text></svg>',
  "id-card":'<svg viewBox="0 0 48 48"><rect x="5" y="10" width="38" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="16" cy="22" r="5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="25" y1="19" x2="37" y2="19" stroke="currentColor" stroke-width="2"/><line x1="25" y1="25" x2="37" y2="25" stroke="currentColor" stroke-width="2"/><line x1="10" y1="32" x2="22" y2="32" stroke="currentColor" stroke-width="2"/></svg>',
  balance:'<svg viewBox="0 0 48 48"><line x1="24" y1="6" x2="24" y2="38" stroke="currentColor" stroke-width="2.5"/><line x1="10" y1="14" x2="38" y2="14" stroke="currentColor" stroke-width="2.5"/><path d="M4 14l6 12h-12z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M44 14l-6 12h12z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16" y1="40" x2="32" y2="40" stroke="currentColor" stroke-width="2.5"/></svg>',
  smile:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="18" cy="20" r="2" fill="currentColor"/><circle cx="30" cy="20" r="2" fill="currentColor"/><path d="M16 29c3 4 13 4 16 0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  calendar:'<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="6" y1="18" x2="42" y2="18" stroke="currentColor" stroke-width="2.5"/><line x1="14" y1="6" x2="14" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="34" y1="6" x2="34" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="13" y="24" width="6" height="6" fill="currentColor"/><rect x="21" y="24" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="29" y="24" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  phone:'<svg viewBox="0 0 48 48"><path d="M12 6h6l3 8-4 3c2 5 6 9 11 11l3-4 8 3v6c0 2-2 4-4 4C20 37 11 28 8 13c0-2 2-6 4-7Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>'
};


/* a real picture of the word (js/word-pictures.js, Task 51) when one exists, else the category line icon */
function wordPicHTML(cat, word) {
    const e = typeof dcWordPic === 'function' ? dcWordPic(cat, word) : '';
    return e ? `<span class="wpic" role="img" aria-label="${word}" style="font-size:2.1em; line-height:1; display:inline-block;">${e}</span>` : '';
}
function getIcon(v) {
    if (!v) return ICON_SVGS['abstract'];
    const pic = v.inf ? wordPicHTML('v', v.inf) : v.sg ? wordPicHTML('n', v.sg) : v.w ? wordPicHTML('a', v.w) : '';
    if (pic) return pic;
    if (v.inf && v.inf.toLowerCase() === 'betreten') {
      return `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fdfbf7;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e0d5;stop-opacity:1" />
          </linearGradient>
          <radialGradient id="clayLight" cx="40%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d1d1d1;stop-opacity:1" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <!-- Doorway Depth -->
        <path d="M20 40 L32 25 L44 40" fill="none" stroke="#B98A2E" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
        <rect x="22" y="20" width="20" height="24" fill="url(#doorGrad)" stroke="#B98A2E" stroke-width="1.5" filter="url(#softShadow)"/>
        <rect x="24" y="22" width="16" height="20" fill="#fcfaf5" />
        <!-- Clay Figure (Entering) -->
        <g transform="translate(0, 2)">
          <rect x="28" y="32" width="8" height="12" rx="4" fill="url(#clayLight)" filter="url(#softShadow)" />
          <circle cx="32" cy="28" r="4" fill="url(#clayLight)" filter="url(#softShadow)" />
          <rect x="30" y="42" width="4" height="3" rx="1.5" fill="#B98A2E" />
          <rect x="36" y="38" width="4" height="3" rx="1.5" fill="url(#clayLight)" filter="url(#softShadow)" transform="rotate(-10, 38, 40)" />
        </g>
      </svg>`;
    }
    return ICON_SVGS[v.icon] || ICON_SVGS['abstract'];
}
