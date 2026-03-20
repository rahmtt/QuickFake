const CACHE_NAME = 'quickfake-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // PWA butuh event fetch kosong minimal untuk lolos syarat install
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
}); 
