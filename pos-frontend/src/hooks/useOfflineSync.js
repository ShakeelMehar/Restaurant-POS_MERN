import { useEffect, useRef } from 'react';
import { db } from '../utils/db';
import { addOrder } from '../https';

export const useOfflineSync = () => {
  const isSyncing = useRef(false);

  useEffect(() => {
    const syncOfflineOrders = async () => {
      // Prevent concurrent syncs
      if (isSyncing.current) return;
      if (!navigator.onLine) return;

      isSyncing.current = true;
      try {
        // Fetch all pending orders sorted by creation time
        const pendingOrders = await db.ordersQueue
          .where('status')
          .equals('pending')
          .sortBy('createdAt');

        for (const orderRecord of pendingOrders) {
          try {
            // Remove local ID before sending to backend
            const { _id, ...payloadToSend } = orderRecord.payload;
            
            await addOrder(payloadToSend);
            
            // On success, delete from local queue
            await db.ordersQueue.delete(orderRecord.id);
          } catch (error) {
            // If it's a validation error (4xx), mark as failed
            if (error.response && error.response.status >= 400 && error.response.status < 500) {
              await db.ordersQueue.update(orderRecord.id, {
                status: 'failed',
                errorReason: error.response.data?.message || 'Validation error',
              });
            } else {
              // If it's a 5xx or network error, break the loop to avoid cascading timeouts
              break;
            }
          }
        }
      } catch (err) {
        console.error('Error in offline sync:', err);
      } finally {
        isSyncing.current = false;
      }
    };

    // Listen to online events
    window.addEventListener('online', syncOfflineOrders);

    // Also set an interval to check periodically (e.g., every 30 seconds)
    // in case the 'online' event fires before the connection is fully stable
    const intervalId = setInterval(syncOfflineOrders, 30000);

    // Initial check on mount
    syncOfflineOrders();

    return () => {
      window.removeEventListener('online', syncOfflineOrders);
      clearInterval(intervalId);
    };
  }, []);
};
