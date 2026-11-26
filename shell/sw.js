// {{HUB_NAME}} offline support: caches the hub shell and every subject listed in subjects.json.
// Bump V when you change root shell files or switcher.js. Content files (json, md, js, html)
// are fetched fresh when online and served from cache when offline.
const V = "{{ID}}-00000000";
const SHELL = [
  "./", "./index.html", "./switcher.js", "./manifest.webmanifest",
  "./lib/firebase-config.js", "./lib/firebase-sync.js", "./lib/cat.js", "./lib/stats.js",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png",
  /* HUB:BEGIN */
  /* HUB:END */
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith("{{ID}}-") && k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function navFallback(pathname) {
  /* HUB:BEGIN */
  /* HUB:END */
  return caches.match("./index.html");
}

self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const same = u.origin === location.origin;
  const fonts = u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com";
  const fbSdk = u.hostname === "www.gstatic.com" && u.pathname.startsWith("/firebasejs/10.14.1/");
  const cdn = u.hostname === "cdnjs.cloudflare.com" && (
    u.pathname.startsWith("/ajax/libs/pdf.js/3.11.174/") ||
    u.pathname.startsWith("/ajax/libs/KaTeX/0.16.9/")
  );
  if (!same && !fonts && !fbSdk && !cdn) return;
  const put = (res) => {
    if (res.ok || res.type === "opaque") {
      const cp = res.clone();
      caches.open(V).then((c) => c.put(r, cp));
    }
    return res;
  };
  if (fonts || fbSdk || cdn || /\.(png|jpg|woff2?)$/.test(u.pathname)) {
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then(put)));
    return;
  }
  e.respondWith(
    fetch(r, { cache: "no-cache" })
      .then(put)
      .catch(() => caches.match(r, { ignoreSearch: r.mode === "navigate" }).then((m) => m || (r.mode === "navigate" ? navFallback(u.pathname) : Response.error())))
  );
});
