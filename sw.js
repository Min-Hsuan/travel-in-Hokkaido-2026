const CACHE = 'hokkaido-v1';

const ASSETS = [
  './index.html',
  './img/日出公園.png',
  './img/四季彩之秋.png',
  './img/深山峠展望台.png',
  './img/富田農場.png',
  './img/白金青池.png',
  './img/白鬚瀑布.png',
  './img/ 十勝岳望岳台.png',
  './img/自家製パスタ専門店 だぐらすふぁ～.png',
  './img/拼布之路.png',
  './img/Kitchen Hitosaji.png',
  './img/新榮之丘.png',
  './img/Hoshinoki0.png',
  './img/Hoshinoki1.png',
  './img/Mahoro.png',
  './img/Mahoro－１.png',
  './img/Chinese Restaurant Keien.png',
  './img/Menya Unga 拉麵.png',
  './img/Menya Unga 拉麵-1.png',
  './img/Menya Unga 拉麵-2.png',
  './img/雞蛋糕 正福屋.png',
  './img/Ryugetsu Co. 柳月.png',
  './img/六花亭 小樽運河店.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first for local assets; skip external (maps, CDN fonts)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return res;
      });
    })
  );
});
