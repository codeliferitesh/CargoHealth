'use client';

import { useState, useCallback } from 'react';
import { ShipmentLocation } from '@/types/shipment';
import { updateShipmentLocation } from '@/lib/location';

export interface UseGeolocationReturn {
  location: ShipmentLocation | null;
  loading: boolean;
  error: string | null;
  syncingWithFirebase: boolean;
  syncSuccess: boolean;
  getCurrentLocation: (syncToFirebase?: boolean) => Promise<ShipmentLocation | null>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<ShipmentLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [syncingWithFirebase, setSyncingWithFirebase] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  const getCurrentLocation = useCallback(async (syncToFirebase: boolean = true): Promise<ShipmentLocation | null> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation API is not supported by your browser');
      return null;
    }

    setLoading(true);
    setError(null);
    setSyncSuccess(false);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc: ShipmentLocation = {
            latitude: Number(position.coords.latitude.toFixed(6)),
            longitude: Number(position.coords.longitude.toFixed(6)),
            accuracy: Math.round(position.coords.accuracy),
            updatedAt: Date.now(),
          };

          setLocation(loc);
          setLoading(false);

          if (syncToFirebase) {
            setSyncingWithFirebase(true);
            const res = await updateShipmentLocation(loc);
            setSyncingWithFirebase(false);
            if (res.success) {
              setSyncSuccess(true);
              setTimeout(() => setSyncSuccess(false), 4000);
            } else if (res.error) {
              setError(`Location obtained, but Firebase update failed: ${res.error}`);
            }
          }

          resolve(loc);
        },
        (err) => {
          setLoading(false);
          let errMsg = 'Failed to get location';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errMsg = 'Location access was denied. Please allow location permissions in your browser settings.';
              break;
            case err.POSITION_UNAVAILABLE:
              errMsg = 'Location information is currently unavailable from your device GPS.';
              break;
            case err.TIMEOUT:
              errMsg = 'Device location request timed out. Please try again.';
              break;
          }
          setError(errMsg);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }, []);

  return {
    location,
    loading,
    error,
    syncingWithFirebase,
    syncSuccess,
    getCurrentLocation,
  };
}
