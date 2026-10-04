'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from '@/lib/firebase';
import { ShipmentData, DeviceConnectionState, HealthSeverity, AlertItem } from '@/types/shipment';
import { normalizeShipmentData } from '@/lib/utils';
import { calculateHealthStatus, getDeviceConnectionStatus, generateActiveAlerts } from '@/lib/health';
import { useFirebaseConnection } from './useFirebaseConnection';

export interface UseShipmentDataReturn {
  shipment: ShipmentData | null;
  rawSnapshot: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  connectionState: DeviceConnectionState;
  healthStatus: HealthSeverity;
  alerts: AlertItem[];
  lastReceivedAt: number | null;
  elapsedSeconds: number;
  isFirebaseConnected: boolean;
  refetch: () => void;
}

export function useShipmentData(): UseShipmentDataReturn {
  const [data, setData] = useState<ShipmentData | null>(null);
  const [rawSnapshot, setRawSnapshot] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastReceivedAt, setLastReceivedAt] = useState<number | null>(null);
  const [, setTick] = useState<number>(0);

  // RTDB connection monitoring from .info/connected
  const isFirebaseConnected = useFirebaseConnection();

  // Periodically trigger re-render every 1 second to update elapsed time and device online/delayed/offline transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const connectListener = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      const shipmentRef = ref(database, 'shipment/current');

      const unsubscribe = onValue(
        shipmentRef,
        (snapshot: DataSnapshot) => {
          setLoading(false);

          if (snapshot.exists()) {
            const rawVal = snapshot.val();
            setRawSnapshot(rawVal);
            const normalized = normalizeShipmentData(rawVal);
            setData(normalized);
            setLastReceivedAt(Date.now());
            setError(null);
          } else {
            setData(null);
            setRawSnapshot(null);
            // No error, but no data at the node yet
          }
        },
        (err) => {
          console.error('Firebase Realtime Database listener error:', err);
          setLoading(false);
          setError(err.message || 'Firebase connection error');
        }
      );

      return () => {
        off(shipmentRef);
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize database listener';
      setError(message);
      setLoading(false);
      return () => {};
    }
  }, []);

  useEffect(() => {
    const cleanup = connectListener();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connectListener]);

  // Calculate device status dynamically based on browser-side receipt timestamp
  const connectionState = useMemo(() => {
    return getDeviceConnectionStatus(lastReceivedAt, isFirebaseConnected);
  }, [lastReceivedAt, isFirebaseConnected]);

  const isOnline = connectionState === 'ONLINE';

  const elapsedSeconds = useMemo(() => {
    if (!lastReceivedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - lastReceivedAt) / 1000));
  }, [lastReceivedAt]);

  const healthStatus = useMemo(() => {
    return calculateHealthStatus(data, connectionState);
  }, [data, connectionState]);

  const alerts = useMemo(() => {
    return generateActiveAlerts(data, connectionState);
  }, [data, connectionState]);

  return {
    shipment: data,
    rawSnapshot,
    loading,
    error,
    isOnline,
    connectionState,
    healthStatus,
    alerts,
    lastReceivedAt,
    elapsedSeconds,
    isFirebaseConnected,
    refetch: connectListener,
  };
}
