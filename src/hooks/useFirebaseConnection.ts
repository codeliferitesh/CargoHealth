'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';

export function useFirebaseConnection(): boolean {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    try {
      const connectedRef = ref(database, '.info/connected');
      const unsubscribe = onValue(
        connectedRef,
        (snapshot) => {
          const val = snapshot.val();
          setIsConnected(Boolean(val));
        },
        (error) => {
          console.warn('Firebase .info/connected listener error:', error);
          setIsConnected(false);
        }
      );

      return () => {
        off(connectedRef);
      };
    } catch (err) {
      console.warn('Failed to attach .info/connected listener:', err);
      setIsConnected(false);
    }
  }, []);

  return isConnected;
}
