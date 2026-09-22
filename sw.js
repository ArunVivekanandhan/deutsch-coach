const CACHE_NAME = 'deutsch-coach-v54';
const urlsToCache = [
  './',
  './index.html',
  './German_Grammar_Cheat_Codes.html',
  './Verb_Transformation_Trainer.html',
  './deutsch-coach.html',
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
  './Nomen_Adjektiv_Trainer.html',
  './German_A2_Practice_Studio.html',
  './Wortfamilien_Explorer.html',
  './js/srs-engine.js',
  './js/icon-svgs.js',
  './js/tamil-dict.js',
  './js/tts-engine.js',
  './js/progress-aggregator.js',
  './css/design-system.css',
  './js/app-shell.js',
  './js/lucide.min.js',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
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
