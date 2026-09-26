const CACHE_NAME = 'deutsch-coach-v110';
const urlsToCache = [
  './',
  './index.html',
  './German_Grammar_Cheat_Codes.html',
  './Verb_Transformation_Trainer.html',
  './Adjektiv_Adverb_Trainer.html',
  './deutsch-coach.html',
  './Geschichte_Trainer.html',
  './Brief_Schreiben_Trainer.html',
  './Sprech_Pruefungs_Simulator.html',
  './A1_Sprech_Pruefungs_Simulator.html',
  './Hoerverstehen_Diktat_Trainer.html',
  './Wortschatz_Master_Grid.html',
  './KI_Human_Partner.html',
  './KI_German_Coach.html',
  './Einstellungen_Setup.html',
  './Satzbau_Trainer.html',
  './Deutsch_Wortschatz_Excel_Sheet.html',
  './Dialog_Schatten_Trainer.html',
  './Verben_Hoeren_EN_DE.html',
  './konnektoren_referenz.html',
  './Thema_Sprech_Trainer.html',
  './Continuous_Verb_Speaker.html',
  './Grammatik_Regel_Trainer.html',
  './German_B1_Practice_Studio.html',
  './Uebersetzer.html',
  './Nomen_Trainer.html',
  './German_A2_Practice_Studio.html',
  './Wortfamilien_Explorer.html',
  './KI_Sprechpartner.html',
  './js/srs-engine.js',
  './js/german-conjugation.js',
  './js/memory-tips.js',
  './js/word-parts.js',
  './js/word-data.js',
  './js/lexicon.js',
  './js/tamil-meanings.js',
  './js/satzbau-data.js',
  './js/tutor-scripts.js',
  './js/grammar-tamil.js',
  './js/word-pictures.js',
  './js/icon-svgs.js',
  './js/tamil-dict.js',
  './js/tts-engine.js',
  './js/progress-aggregator.js',
  './css/design-system.css',
  './js/app-shell.js',
  './js/lucide.min.js',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  './js/call/audio-io.js',
  './js/call/avatar.js',
  './js/call/call-log.js',
  './js/call/call-state.js',
  './js/call/conversation.js',
  './js/call/pcm-capture-worklet.js',
  './js/call/stt.js',
  './js/call/tts.js',
  './css/fonts.css',
  './fonts/fjalla-one-400-latin-ext.woff2',
  './fonts/fjalla-one-400-latin.woff2',
  './fonts/ibm-plex-mono-400-italic-latin-ext.woff2',
  './fonts/ibm-plex-mono-400-italic-latin.woff2',
  './fonts/ibm-plex-mono-400-latin-ext.woff2',
  './fonts/ibm-plex-mono-400-latin.woff2',
  './fonts/ibm-plex-mono-500-latin-ext.woff2',
  './fonts/ibm-plex-mono-500-latin.woff2',
  './fonts/ibm-plex-mono-600-latin-ext.woff2',
  './fonts/ibm-plex-mono-600-latin.woff2',
  './fonts/ibm-plex-mono-700-latin-ext.woff2',
  './fonts/ibm-plex-mono-700-latin.woff2',
  './fonts/ibm-plex-sans-400-italic-latin-ext.woff2',
  './fonts/ibm-plex-sans-400-italic-latin.woff2',
  './fonts/ibm-plex-sans-var-latin-ext.woff2',
  './fonts/ibm-plex-sans-var-latin.woff2',
  './fonts/inter-var-latin-ext.woff2',
  './fonts/inter-var-latin.woff2'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache).catch(err => console.log('Cache addAll error:', err)))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const isHTML = event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html');
  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
  }
});
