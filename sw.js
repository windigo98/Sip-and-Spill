/* Sip & Spill — offline-friendly cache.
   URLs resolve from the registration scope so the GitHub Pages project
   site (https://windigo98.github.io/Sip-and-Spill/, capital S) caches
   /Sip-and-Spill/ assets rather than the user-site root. */
const CACHE = "sip-spill-v9";
const SHELL_PATHS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./prompts.js",
  "./art.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

function shellUrls() {
  const scope = self.registration ? self.registration.scope : new URL("./", self.location).href;
  return SHELL_PATHS.map((path) => new URL(path, scope).href);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(shellUrls())).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then((cached) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
