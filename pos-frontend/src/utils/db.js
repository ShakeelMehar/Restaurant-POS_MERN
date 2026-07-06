import Dexie from 'dexie';

export const db = new Dexie('RestaurantPOS');

// Declare tables, IDs and indexes
db.version(1).stores({
  menu: 'id, data', // Store menu items by id, with the payload in 'data'
  tables: 'id, data', // Store tables by id, with the payload in 'data'
  ordersQueue: '++id, status, createdAt', // auto-increment id, status and createdAt are indexed
});
