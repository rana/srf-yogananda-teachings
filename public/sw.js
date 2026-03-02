/**
 * Service Worker — M2a-12 (ADR-006 §4).
 *
 * Extended from M1c-14 minimal worker.
 * - Pre-caches all page routes + self-hosted fonts
 * - Network-first for navigations, cache-first for fonts
 * - Offline fallback to cached shell
 */

const CACHE_NAME = "srf-shell-v2";
const FONT_CACHE = "srf-fonts-v1";

const SHELL_URLS = [
  "/",
  "/search",
  "/books",
  "/about",
  "/quiet",
  "/browse",
  "/privacy",
  "/legal",
  "/integrity",
  "/es",
  "/es/search",
  "/es/books",
  "/es/about",
  "/es/quiet",
  "/es/browse",
];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)),
  );
  self.skipWaiting();
});

// Activate: clean old caches (preserve font cache across versions)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== FONT_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch: strategy varies by resource type
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Skip API routes — always network
  if (url.pathname.startsWith("/api/")) return;

  // Fonts: cache-first (immutable, self-hosted)
  if (url.pathname.startsWith("/fonts/")) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
        }),
      ),
    );
    return;
  }

  // Everything else: network-first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("/")),
      ),
  );
});
