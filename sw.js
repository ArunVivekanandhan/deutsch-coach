const CACHE_NAME = 'deutsch-coach-v5';
const urlsToCache = [
  './',
  './index.html',
  './deutsch-coach.html',
  './Sprech_Pruefungs_Simulator.html',
  './Grammatik_Regel_Trainer.html',
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

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
