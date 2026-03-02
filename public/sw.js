/**
 * Minimal Service Worker — M1c-14 (ADR-006 §4).
 *
 * Caches app shell (HTML, CSS, JS) for instant repeat visits.
 * Offline indicator handled by the app. ~50 lines.
 * Milestone 2a-12 extends with enhanced caching strategy.
 */

const CACHE_NAME = "srf-shell-v1";
const SHELL_URLS = ["/", "/search", "/read"];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)),
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch: network-first, fall back to cache
self.addEventListener("fetch", (event) => {
  // Only handle same-origin navigations and static assets
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Skip API routes — always go to network
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        // Offline: serve from cache
        caches.match(event.request).then((cached) => cached || caches.match("/")),
      ),
  );
});
