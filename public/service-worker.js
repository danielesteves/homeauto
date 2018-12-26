/*eslint no-undef: "error"*/
/*eslint-env browser*/

var cacheName = 'homeauto-1-0-1';
var filesToCache = [
    '/',
    '/__/firebase/4.10.0/firebase-app.js',
    '/__/firebase/4.10.0/firebase-auth.js',
    '/__/firebase/4.10.0/firebase-database.js',
    '/__/firebase/4.10.0/firebase-messaging.js',
    '/__/firebase/4.10.0/firebase-storage.js',
    '/__/firebase/init.js'
];



self.addEventListener('install', function(e) {
  //console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      //console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  //console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  //console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});