const CACHE_NAME = 'ki-os-v1';
const STATIC_ASSETS = ['/', '/dashboard', '/offline'];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-First for API, Cache-First for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API calls: Network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request).catch(() => new Response('{"error":"offline"}', {
      status: 503, headers: { 'Content-Type': 'application/json' },
    })));
    return;
  }

  // Navigation: Network first, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request).then((r) => r || caches.match('/offline')))
    );
    return;
  }

  // Static assets: Cache first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => new Response('', { status: 404 })))
  );
});
