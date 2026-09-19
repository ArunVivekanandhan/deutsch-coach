/* Complete offline cache for Dein Deutsch-Coach Suite.
   Caches all 7 applications, icons, and manifest for 100% offline access. */
const CACHE_NAME = "deutsch-coach-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./deutsch-coach.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./Grammatik_Regel_Trainer.html",
  "./Sprech_Pruefungs_Simulator.html",
  "./German_A2_Practice_Studio.html",
  "./Verb_Transformation_Trainer.html",
  "./Nomen_Adjektiv_Trainer.html",
  "./Satzbau_Trainer.html",
  "./Verben_Hoeren_EN_DE.html",
  "./konnektoren_referenz.html"
];

self.addEventListener("install", (event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event)=>{
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached) return cached;
      return fetch(event.request).catch(()=>cached);
    })
  );
});
