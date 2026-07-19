import { useEffect, useRef } from 'react';
import { db } from '../utils/db';
import { addOrder, pingServer } from '../https';
import { replayQueuedOrders } from '../utils/orderSync';

// Backoff: 30s → 1m → 2m → ... capped at 30min. Reset on success or an 'online' event.
const BASE_BACKOFF_MS = 30 * 1000;
const MAX_BACKOFF_MS = 30 * 60 * 1000;

export const useOfflineSync = () => {
  const isSyncing = useRef(false);
  const consecutiveFailures = useRef(0);
  const backoffUntil = useRef(0);

  useEffect(() => {
    const registerFailure = () => {
      consecutiveFailures.current += 1;
      const delay = Math.min(
        BASE_BACKOFF_MS * 2 ** (consecutiveFailures.current - 1),
        MAX_BACKOFF_MS
      );
      backoffUntil.current = Date.now() + delay;
    };

    const resetBackoff = () => {
      consecutiveFailures.current = 0;
      backoffUntil.current = 0;
    };

    const syncOfflineOrders = async () => {
      // Prevent concurrent syncs
      if (isSyncing.current) return;
      // No network interface at all — definitely offline
      if (!navigator.onLine) return;
      // Still inside a backoff window from previous failed runs
      if (Date.now() < backoffUntil.current) return;

      isSyncing.current = true;
      try {
        // Fetch all pending orders sorted by creation time
        const pendingOrders = await db.ordersQueue
          .where('status')
          .equals('pending')
          .sortBy('createdAt');

        if (pendingOrders.length === 0) {
          resetBackoff();
          return;
        }

        // navigator.onLine can lie (interface up, uplink dead). Confirm the API
        // actually answers before replaying the queue.
        try {
          await pingServer();
        } catch {
          registerFailure();
          return;
        }

        // Per-record replay + error classification lives in the shared core so
        // this hook and the service worker stay in lockstep.
        const { interrupted } = await replayQueuedOrders((payload) => addOrder(payload));

        if (interrupted) {
          registerFailure();
        } else {
          resetBackoff();
        }
      } catch (err) {
        console.error('Error in offline sync:', err);
      } finally {
        isSyncing.current = false;
      }
    };

    // Connectivity change is fresh information — drop any backoff and try now
    const onOnline = () => {
      resetBackoff();
      syncOfflineOrders();
    };

    window.addEventListener('online', onOnline);

    // Steady tick; actual pacing is handled by the backoff window above
    const intervalId = setInterval(syncOfflineOrders, 30000);

    // Initial check on mount
    syncOfflineOrders();

    return () => {
      window.removeEventListener('online', onOnline);
      clearInterval(intervalId);
    };
  }, []);
};
