const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/database.js',
    '/assets/js/index.js',
    '/webmanifest.json',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
  ];
  
  const PRECACHE = 'precache-v1';
  const RUNTIME = 'runtime';
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        })
        .then((cachesToDelete) => {
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  
  self.addEventListener('fetch', (event) => {

        if (event.request.method !== 'GET') {

        event.respondWith(fetch(event.request)
            .then(response => {

                return response;

            }).catch(err => {
                console.log(err);

                return err;

            }));

        } else if (event.request.url) {

            event.respondWith(
            caches.open(RUNTIME).then(cache => {

                return fetch(event.request)

                    .then(response => {

                            if (response.status === 200) {

                            cache.put(event.request.url, response.clone());
                        }

                        return response;
                    })

                    .catch(err => {

                        return cache.match(event.request);
                    });

            }).catch(err => console.log(err))
        );

        return;
    }
  });
  