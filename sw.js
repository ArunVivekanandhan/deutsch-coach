const CACHE_NAME = 'deutsch-coach-v13';
const urlsToCache = [
  './',
  './index.html',
  './deutsch-coach.html',
  './Wortschatz_Master_Grid.html',
  './Deutsch_Wortschatz_Excel_Sheet.html',
  './German_Grammar_Cheat_Codes.html',
  './Sprech_Pruefungs_Simulator.html',
  './Grammatik_Regel_Trainer.html',
  './konnektoren_referenz.html',
  './Verben_Hoeren_EN_DE.html',
  './KI_Human_Partner.html',
  './KI_German_Coach.html',
  './German_A2_Practice_Studio.html',
  './German_B1_Practice_Studio.html',
  './Nomen_Adjektiv_Trainer.html',
  './Satzbau_Trainer.html',
  './Verb_Transformation_Trainer.html',
  './Continuous_Verb_Speaker.html',
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
