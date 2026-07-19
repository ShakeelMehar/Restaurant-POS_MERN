import { db } from './db';

/**
 * Drains the pending offline-order queue, oldest first.
 *
 * Shared by the in-app sync hook (`useOfflineSync`, sends via axios) and the
 * service-worker Background Sync handler (`sw.js`, sends via fetch) so the
 * error-classification rules live in exactly one place.
 *
 * @param send  async (payload) => void. Resolves on success. On failure it must
 *              throw an error carrying the HTTP status as `.status` (or a nested
 *              `.response.status` for axios) and a human reason as `.message`
 *              (or `.response.data.message`). A thrown error with no status is
 *              treated as a network failure.
 * @returns {Promise<{interrupted: boolean}>} interrupted=true when a transient
 *          failure (auth expiry, 5xx, network) stopped the drain early — the
 *          caller should back off / let the browser retry.
 */
export async function replayQueuedOrders(send) {
  const pending = await db.ordersQueue.where('status').equals('pending').sortBy('createdAt');

  for (const record of pending) {
    try {
      // Strip the local-only id before sending
      const { _id, ...payload } = record.payload;

      // Backfill idempotency key on legacy records and persist it BEFORE sending,
      // so a lost ACK on this very attempt is still safe to replay.
      if (!payload.idempotencyKey) {
        payload.idempotencyKey = crypto.randomUUID();
        await db.ordersQueue.update(record.id, {
          payload: { ...record.payload, idempotencyKey: payload.idempotencyKey },
        });
      }

      await send(payload);
      await db.ordersQueue.delete(record.id);
    } catch (error) {
      const status = error.status ?? error.response?.status;
      const reason = error.response?.data?.message || error.message || 'Sync error';

      await db.ordersQueue.update(record.id, {
        attempts: (record.attempts || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
      });

      // Auth expired mid-outage — not permanent. Stop and retry once re-authed.
      if (status === 401 || status === 403) {
        return { interrupted: true };
      }
      // Genuine rejection (validation, etc.) — dead-letter and keep draining.
      if (status >= 400 && status < 500) {
        await db.ordersQueue.update(record.id, { status: 'failed', errorReason: reason });
        continue;
      }
      // 5xx or network — stop to avoid cascading timeouts.
      return { interrupted: true };
    }
  }

  return { interrupted: false };
}
