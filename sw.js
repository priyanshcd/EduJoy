    // Define a cache name
    const CACHE_NAME = 'edujoy-v1';

    // List all the files that need to be cached for offline access
    const urlsToCache = [
      '/',
      'game.html',
      'index.html', // Maths Game
      'rocket.html',
      'history.html',
      'biology.html',
      'english2.html',
      'geography.html'
      // NOTE: If you add CSS or other JS files, add them here too.
    ];

    // 1. Installation: Open the cache and add the core files.
    self.addEventListener('install', (event) => {
      console.log('Service Worker: Installing...');
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('Service Worker: Caching app shell');
            return cache.addAll(urlsToCache);
          })
          .catch(err => console.error('Service Worker: Caching failed', err))
      );
    });

    // 2. Activation: Clean up old caches if any exist.
    self.addEventListener('activate', (event) => {
      console.log('Service Worker: Activating...');
      const cacheWhitelist = [CACHE_NAME];
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                console.log('Service Worker: Deleting old cache', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });

    // 3. Fetch: Intercept network requests and serve from cache if available.
    self.addEventListener('fetch', (event) => {
      console.log('Service Worker: Fetching', event.request.url);
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            // If the request is in the cache, return the cached response
            if (response) {
              return response;
            }
            // Otherwise, fetch from the network, and cache the response for next time
            return fetch(event.request).then((networkResponse) => {
              // Check if we received a valid response
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }

              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              const responseToCache = networkResponse.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return networkResponse;
            });
          })
      );
    });
    
