// Custom service worker (vite-plugin-pwa injectManifest strategy).
// Responsibilities: precache the app shell + replay the offline order queue in
// the background via the Background Sync API, so orders sync even if the tab is
// closed when connectivity returns.
import { precacheAndRoute } from 'workbox-precaching';
import { replayQueuedOrders } from './utils/orderSync';
import { ORDER_SYNC_TAG } from './utils/backgroundSync';

// Precache the built app shell (list injected at build time)
precacheAndRoute(self.__WB_MANIFEST);

// Full order endpoint — VITE_BACKEND_URL is inlined at build time
const ORDER_ENDPOINT = `${import.meta.env.VITE_BACKEND_URL}/api/order/`;

// Send an order via fetch. The httpOnly accessToken cookie is sent automatically
// with credentials: 'include' — the SW has no access to localStorage, so cookie
// auth is what makes background replay possible.
async function sendOrder(payload) {
  const response = await fetch(ORDER_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Sync error';
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // non-JSON error body — keep the default message
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag !== ORDER_SYNC_TAG) return;
  event.waitUntil(
    (async () => {
      const { interrupted } = await replayQueuedOrders(sendOrder);
      // Throw on transient failure so the browser reschedules this sync with its
      // own backoff. Genuine rejections are already dead-lettered in the queue.
      if (interrupted) {
        throw new Error('Order sync interrupted; browser will retry');
      }
    })()
  );
});

// Let the app trigger an immediate activation after an update
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
