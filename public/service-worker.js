
// public/service-worker.js (A very basic service worker for caching static assets)
/*
const CACHE_NAME = 'school-q-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other static assets like JS bundles, CSS, images if not using CDN heavily
  // '/static/js/bundle.js', // Example
  // '/static/css/main.chunk.css', // Example
  // '/logo192.png',
  // '/logo512.png',
  'https://cdn.tailwindcss.com', // Cache Tailwind CSS
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' // Cache font
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
*/
