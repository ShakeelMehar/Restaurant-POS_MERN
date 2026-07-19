export const ORDER_SYNC_TAG = 'sync-orders';

/**
 * Ask the service worker to replay the order queue once connectivity returns —
 * even if the app tab is closed by then. Chromium-only; on Safari/Firefox this
 * is a no-op and the in-app interval loop (`useOfflineSync`) remains the path.
 * Best-effort: never throws into the checkout flow.
 */
export async function requestOrderSync() {
  try {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) return false;
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(ORDER_SYNC_TAG);
    return true;
  } catch {
    return false;
  }
}
