/*eslint no-undef: "error"*/
/*eslint-env browser*/

var cacheName = 'homeauto-1-3-1';
var filesToCache = [
    '/',
    '/__/firebase/7.14.1/firebase-app.js',
    '/__/firebase/7.14.1/firebase-auth.js',
    '/__/firebase/7.14.1/firebase-database.js',
    '/__/firebase/7.14.1/firebase-messaging.js',
    '/__/firebase/7.14.1/firebase-storage.js',
    '/__/firebase/7.14.1/firebase-performance.js',
    '/__/firebase/init.js',
    '/css/materialize.css',
    '/css/materialize.min.css',
    '/css/style.css',
    '/js/jquery-3.3.1.js',
    '/js/materialize.js',
    '/js/materialize.min.js',
    '/js/script.js',
    '/images/outlet.png',
    '/images/sensor.png',
    '/images/thermometer.png',
    '/images/cardiogram.png'
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
