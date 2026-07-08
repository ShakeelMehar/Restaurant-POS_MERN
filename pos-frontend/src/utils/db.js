import Dexie from 'dexie';

export const db = new Dexie('RestaurantPOS');

// Declare tables, IDs and indexes
db.version(2).stores({
  menu: 'id', // Store menu items by id
  tables: 'id', // Store tables by id
  ordersQueue: '++id, status, createdAt', // auto-increment id, status and createdAt are indexed
});
