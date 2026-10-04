'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, off, set, DataSnapshot } from 'firebase/database';
import { database } from '@/lib/firebase';
import { parseNumber } from '@/lib/utils';

export const DEFAULT_GAS_THRESHOLD = 200;

export interface UseGasThresholdReturn {
  gasThreshold: number;
  rawThreshold: number | null;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  updateGasThreshold: (newThreshold: number) => Promise<{ success: boolean; error?: string }>;
}

export function useGasThreshold(): UseGasThresholdReturn {
  const [gasThreshold, setGasThreshold] = useState<number>(DEFAULT_GAS_THRESHOLD);
  const [rawThreshold, setRawThreshold] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const thresholdRef = ref(database, 'shipment/settings/gasThreshold');

      const unsubscribe = onValue(
        thresholdRef,
        (snapshot: DataSnapshot) => {
          setLoading(false);
          if (snapshot.exists()) {
            const val = parseNumber(snapshot.val());
            if (val !== null && val >= 0 && val <= 4095) {
              setGasThreshold(val);
              setRawThreshold(val);
            } else {
              setGasThreshold(DEFAULT_GAS_THRESHOLD);
              setRawThreshold(null);
            }
          } else {
            // Path does not exist in Firebase yet - maintain default 200 without auto-overwriting
            setGasThreshold(DEFAULT_GAS_THRESHOLD);
            setRawThreshold(null);
          }
        },
        (err) => {
          console.error('Firebase gas threshold listener error:', err);
          setLoading(false);
          setError(err.message || 'Failed to read gas threshold from Firebase');
        }
      );

      return () => {
        off(thresholdRef);
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Firebase settings';
      setError(message);
      setLoading(false);
    }
  }, []);

  const updateGasThreshold = useCallback(
    async (newThreshold: number): Promise<{ success: boolean; error?: string }> => {
      // Validate bounds (ESP32 12-bit ADC range: 0 - 4095)
      const clamped = Math.min(4095, Math.max(0, Math.round(newThreshold)));

      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);

      try {
        const thresholdRef = ref(database, 'shipment/settings/gasThreshold');
        await set(thresholdRef, clamped);

        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to write gas threshold to Firebase';
        console.error('Firebase gas threshold update error:', err);
        setIsSaving(false);
        setError('Failed to update gas threshold');
        return { success: false, error: message };
      }
    },
    []
  );

  return {
    gasThreshold,
    rawThreshold,
    loading,
    error,
    isSaving,
    saveSuccess,
    updateGasThreshold,
  };
}
