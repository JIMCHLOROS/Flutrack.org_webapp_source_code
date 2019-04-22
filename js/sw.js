const cacheName = 'FlutrackCache';

const staticAssets = [
  './',
  './main.js',
  './css/main.css',
  './errPage.json',
  './img/dog.jpg'
];

self.addEventListener('install', async function () {
  const cache = await caches.open(cacheName);
  cache.addAll(staticAssets);
});

/*
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
*/
