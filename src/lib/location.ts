import { database } from './firebase';
import { ref, update } from 'firebase/database';
import { ShipmentLocation } from '@/types/shipment';

/**
 * Updates the shipment location coordinates in Firebase Realtime Database
 * Path: /shipment/current/location
 */
export async function updateShipmentLocation(location: ShipmentLocation): Promise<{ success: boolean; error?: string }> {
  try {
    const locationRef = ref(database, 'shipment/current/location');
    await update(locationRef, {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy ?? null,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to write location to Firebase';
    console.error('Firebase location update error:', message);
    return { success: false, error: message };
  }
}

export function buildGoogleMapsUrl(latitude?: number | null, longitude?: number | null): string {
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return 'https://maps.google.com';
  }
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
