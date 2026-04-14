const CACHE = 'florescendo-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => { self.clients.claim(); });
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
self.addEventListener('push', e => {
  const d = e.data?.json() || {};
  e.waitUntil(self.registration.showNotification(d.title || 'Florescendo 🌸', {
    body: d.body || 'Sua palavra de hoje está esperando, florzinha 💕',
    icon: '/icon-192.png', vibrate: [200,100,200]
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
