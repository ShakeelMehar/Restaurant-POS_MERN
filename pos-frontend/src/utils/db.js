import Dexie from 'dexie';

export const db = new Dexie('RestaurantPOS');

// Declare tables, IDs and indexes
db.version(2).stores({
  menu: 'id', // Store menu items by id
  ordersQueue: '++id, status, createdAt', // auto-increment id, status and createdAt are indexed
});

db.version(3).stores({
  menu: 'id',
  ordersQueue: '++id, status, createdAt',
  meta: 'key', // small key/value store: which tenant this cache belongs to, etc.
});

// v4: backfill an idempotencyKey onto any queue record that predates keys, so no
// record is ever key-less by the time a drainer (in-app hook OR service worker)
// runs. Without this, two drainers racing on the same key-less record would each
// assign a DIFFERENT key and the server would insert duplicate orders.
db.version(4).stores({
  menu: 'id',
  ordersQueue: '++id, status, createdAt',
  meta: 'key',
}).upgrade((tx) =>
  tx.table('ordersQueue').toCollection().modify((record) => {
    if (record.payload && !record.payload.idempotencyKey) {
      record.payload.idempotencyKey = crypto.randomUUID();
    }
  })
);

/**
 * Atomically ensure a queue record carries an idempotencyKey, returning the
 * definitive key. Runs inside a single rw transaction: IndexedDB serializes
 * overlapping rw transactions across connections (page and service worker), so
 * if both drainers hit the same key-less record, the second one reads back the
 * key the first committed rather than generating a divergent one.
 * @returns the record's idempotencyKey, or null if the record no longer exists.
 */
export const ensureQueueIdempotencyKey = (id) =>
  db.transaction('rw', db.ordersQueue, async () => {
    const record = await db.ordersQueue.get(id);
    if (!record) return null;
    if (!record.payload.idempotencyKey) {
      record.payload.idempotencyKey = crypto.randomUUID();
      await db.ordersQueue.put(record);
    }
    return record.payload.idempotencyKey;
  });

/**
 * Tenant cache guard (docs/v3 05_Offline_Sync §3).
 * Call on every successful login. If the cache on this device belongs to a
 * different restaurant, purge it entirely — otherwise the new user could see the
 * previous tenant's menu, and worse, replay their queued orders under the new
 * tenant's auth (the server stamps restaurantId from the JWT context, so those
 * orders would be silently mis-assigned to the wrong restaurant).
 */
export const ensureTenantCache = async (restaurantId) => {
  const incoming = String(restaurantId ?? '');
  try {
    const stored = await db.meta.get('restaurantId');
    if (stored && stored.value !== incoming) {
      await Promise.all([db.menu.clear(), db.ordersQueue.clear()]);
    }
    await db.meta.put({ key: 'restaurantId', value: incoming });
  } catch (error) {
    console.error('Tenant cache check failed:', error);
  }
};
