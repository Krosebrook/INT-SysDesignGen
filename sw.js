/**
 * Staff Engineer Architect v4.0 - PWA Service Worker (Workbox Implementation)
 */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  const { registerRoute, setCatchHandler } = workbox.routing;
  const { StaleWhileRevalidate, NetworkFirst, NetworkOnly } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  const { ExpirationPlugin } = workbox.expiration;

  // 1. Security Critical Endpoints: Network Only
  // PRIORITY: Sensitive endpoints like authentication or moderation must be explicitly excluded from caching.
  // Defined first to ensure precedence over other routes.
  registerRoute(
    ({ url }) => url.pathname.includes('/auth') || url.pathname.includes('/moderation'),
    new NetworkOnly()
  );

  // 2. Dynamic API Content: Network-First
  // "Use a 'NetworkFirst' strategy, only caching successful responses."
  registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
      cacheName: 'dynamic-content',
      networkTimeoutSeconds: 3, // Fallback to cache if network takes longer than 3s
      plugins: [
        new CacheableResponsePlugin({
          statuses: [200], // Strictly only cache HTTP 200 OK
        }),
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 Day
        }),
      ],
    })
  );

  // 3. Static Assets: Stale-While-Revalidate
  // Serves from cache for speed, updates in background.
  registerRoute(
    ({ request }) => 
      ['style', 'script', 'worker', 'font', 'image'].includes(request.destination),
    new StaleWhileRevalidate({
      cacheName: 'static-resources',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 4. App Shell / Navigation: Stale-While-Revalidate
  registerRoute(
    ({ request }) => request.mode === 'navigate',
    new StaleWhileRevalidate({
      cacheName: 'pages',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

  // Offline Fallback for Navigation
  setCatchHandler(({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match('/index.html');
    }
    return Response.error();
  });

  console.log('Workbox is loaded');
} else {
  console.log('Workbox failed to load');
}