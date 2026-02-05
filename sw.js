/**
 * Staff Engineer Architect v4.0 - PWA Service Worker (Workbox Implementation)
 */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  const { registerRoute, setCatchHandler } = workbox.routing;
  const { StaleWhileRevalidate, NetworkFirst, NetworkOnly } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  const { ExpirationPlugin } = workbox.expiration;

  // Cache static assets with Stale-While-Revalidate
  registerRoute(
    ({ request }) => 
      request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'worker' ||
      request.destination === 'font' ||
      request.destination === 'image',
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

  // App Shell / Navigation: Stale-While-Revalidate for fast loading
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

  // Dynamic Content: Network-First
  // Only cache successful API responses. Exclude Auth/Moderation actions.
  registerRoute(
    ({ url }) => url.pathname.startsWith('/api/v1/content'),
    new NetworkFirst({
      cacheName: 'dynamic-content',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [200],
        }),
        new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 1 Day
        }),
      ],
    })
  );

  // Auth and Moderation endpoints: Network Only (Security requirement)
  registerRoute(
    ({ url }) => url.pathname.includes('/auth') || url.pathname.includes('/moderation'),
    new NetworkOnly()
  );

  // Offline Fallback
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