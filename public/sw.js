const CACHE = "wrenchbid-v2";
const ASSETS = [];

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // Never cache index.html or any navigation request — always go to network
  if (e.request.mode === "navigate" || 
      url.pathname === "/" || 
      url.pathname === "/index.html" ||
      e.request.headers.get("Service-Worker") === "bypass") {
    e.respondWith(fetch(e.request));
    return;
  }

  // For everything else: network first, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
