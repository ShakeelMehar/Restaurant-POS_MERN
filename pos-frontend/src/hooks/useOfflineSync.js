import { useEffect, useRef } from 'react';
import { db } from '../utils/db';
import { addOrder, pingServer } from '../https';

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

        let interrupted = false;

        for (const orderRecord of pendingOrders) {
          try {
            // Remove local ID before sending to backend
            const { _id, ...payloadToSend } = orderRecord.payload;

            // Legacy queue records (written before idempotency keys existed) get a
            // key backfilled and persisted BEFORE the send, so a lost ACK on this
            // very attempt is still safe to replay.
            if (!payloadToSend.idempotencyKey) {
              payloadToSend.idempotencyKey = crypto.randomUUID();
              await db.ordersQueue.update(orderRecord.id, {
                payload: { ...orderRecord.payload, idempotencyKey: payloadToSend.idempotencyKey },
              });
            }

            await addOrder(payloadToSend);

            // On success, delete from local queue
            await db.ordersQueue.delete(orderRecord.id);
          } catch (error) {
            const status = error.response?.status;

            // Diagnostics: how many times this record has been attempted
            await db.ordersQueue.update(orderRecord.id, {
              attempts: (orderRecord.attempts || 0) + 1,
              lastAttemptAt: new Date().toISOString(),
            });

            // Auth expired mid-outage: NOT a permanent failure. Keep the order
            // pending and stop; sync resumes after the session is refreshed.
            if (status === 401 || status === 403) {
              interrupted = true;
              break;
            }

            // Any other 4xx is a genuine rejection (validation etc.) — dead-letter it
            if (status >= 400 && status < 500) {
              await db.ordersQueue.update(orderRecord.id, {
                status: 'failed',
                errorReason: error.response.data?.message || 'Validation error',
              });
            } else {
              // 5xx or network error: break to avoid cascading timeouts
              interrupted = true;
              break;
            }
          }
        }

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
