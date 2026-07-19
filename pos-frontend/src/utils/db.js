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
