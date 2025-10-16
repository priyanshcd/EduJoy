const CACHE_NAME = 'edujoy-cache-v2'; // Version updated from v1 to v2
const urlsToCache = [
    '/',
    '/game.html',
    '/profile.html',
    '/ai_tutor.html',
    '/rocket.html',
    '/history.html',
    '/biology.html',
    '/english2.html',
    '/geography.html',
    '/index.html', // Math game
    '/db.js',
    '/favicon.png',
];

// Install a service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// On activate, clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Cache and return requests with a network-first strategy for HTML
self.addEventListener('fetch', event => {
    // Use a network-first strategy for HTML pages to ensure they are always fresh
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
        return;
    }

    // Use cache-first for other assets
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

