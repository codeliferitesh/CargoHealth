import { ShipmentData, ShipmentLocation } from '@/types/shipment';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export function formatNumber(value: unknown, decimals: number = 1, fallback: string = 'N/A'): string {
  const num = parseNumber(value);
  if (num === null) return fallback;
  return num.toFixed(decimals);
}

export function formatRelativeTime(timestamp: number | string | undefined | null): string {
  if (!timestamp) return 'Never';

  let dateMs: number;
  if (typeof timestamp === 'number') {
    // If timestamp is in seconds (unix epoch 10 digits), convert to ms
    dateMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  } else if (typeof timestamp === 'string') {
    // Try parsing ISO or numeric string
    const num = Number(timestamp);
    if (!isNaN(num) && num > 0) {
      dateMs = num < 1e11 ? num * 1000 : num;
    } else {
      const parsed = Date.parse(timestamp);
      if (isNaN(parsed)) return 'Invalid date';
      dateMs = parsed;
    }
  } else {
    return 'N/A';
  }

  const diffSeconds = Math.floor((Date.now() - dateMs) / 1000);

  if (diffSeconds < 0) return 'Just now';
  if (diffSeconds < 5) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function formatExactTime(timestamp: number | string | undefined | null): string {
  if (!timestamp) return 'N/A';
  let dateMs: number;
  if (typeof timestamp === 'number') {
    dateMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  } else {
    const num = Number(timestamp);
    if (!isNaN(num) && num > 0) {
      dateMs = num < 1e11 ? num * 1000 : num;
    } else {
      const parsed = Date.parse(timestamp);
      if (isNaN(parsed)) return String(timestamp);
      dateMs = parsed;
    }
  }
  return new Date(dateMs).toLocaleString();
}

/**
 * Normalizes raw Firebase shipment data to guarantee standard fields regardless of naming variants from ESP32
 */
export function normalizeShipmentData(raw: Record<string, unknown> | null | undefined): ShipmentData | null {
  if (!raw || typeof raw !== 'object') return null;

  const temp = parseNumber(raw.temperature ?? raw.temp ?? raw.t);
  const hum = parseNumber(raw.humidity ?? raw.hum ?? raw.h);
  const light = parseNumber(raw.light ?? raw.lux ?? raw.lightIntensity ?? raw.bh1750);
  const gasAnalog = parseNumber(raw.gasAnalog ?? raw.gas_analog ?? raw.gas ?? raw.mq2_analog);

  // Digital gas detection (0 / 1 / true / false / "DETECTED")
  const rawDigital = raw.gasDigital ?? raw.gas_digital ?? raw.mq2_digital ?? raw.gasDetected;
  let gasDigital: number | boolean = false;
  if (typeof rawDigital === 'boolean') {
    gasDigital = rawDigital;
  } else if (typeof rawDigital === 'number') {
    gasDigital = rawDigital === 1;
  } else if (typeof rawDigital === 'string') {
    gasDigital = rawDigital.toUpperCase().includes('DETECT') || rawDigital === '1' || rawDigital === 'true';
  }

  // Gas status string
  let gasStatus = 'SAFE';
  if (raw.gasStatus && typeof raw.gasStatus === 'string') {
    gasStatus = raw.gasStatus.toUpperCase();
  } else if (gasDigital) {
    gasStatus = 'GAS DETECTED';
  } else if (gasAnalog && gasAnalog > 300) {
    gasStatus = 'WARNING';
  }

  // Buzzer status
  const rawBuzzer = raw.buzzer ?? raw.buzzerStatus ?? raw.buzzer_state;
  let buzzer = 'OFF';
  if (typeof rawBuzzer === 'boolean') {
    buzzer = rawBuzzer ? 'ON' : 'OFF';
  } else if (typeof rawBuzzer === 'number') {
    buzzer = rawBuzzer === 1 ? 'ON' : 'OFF';
  } else if (typeof rawBuzzer === 'string') {
    buzzer = rawBuzzer.toUpperCase() === 'ON' || rawBuzzer === '1' || rawBuzzer.toUpperCase() === 'ACTIVE' ? 'ON' : 'OFF';
  }

  // Location normalization
  let location: ShipmentLocation | undefined = undefined;
  if (raw.location && typeof raw.location === 'object') {
    const rawLoc = raw.location as Record<string, unknown>;
    const lat = parseNumber(rawLoc.latitude ?? rawLoc.lat);
    const lng = parseNumber(rawLoc.longitude ?? rawLoc.lng ?? rawLoc.lon);
    const acc = parseNumber(rawLoc.accuracy ?? rawLoc.acc);
    if (lat !== null && lng !== null) {
      location = {
        latitude: lat,
        longitude: lng,
        accuracy: acc ?? undefined,
        updatedAt: (rawLoc.updatedAt as number | string) || Date.now(),
      };
    }
  }

  // Timestamp
  const timestamp = (raw.timestamp ?? raw.time ?? raw.lastUpdate ?? raw.ts ?? Date.now()) as number | string;

  return {
    ...raw,
    temperature: temp !== null ? temp : undefined,
    humidity: hum !== null ? hum : undefined,
    light: light !== null ? light : undefined,
    gasAnalog: gasAnalog !== null ? gasAnalog : undefined,
    gasDigital,
    gasStatus,
    buzzer,
    health: typeof raw.health === 'string' ? raw.health.toUpperCase() : undefined,
    timestamp,
    deviceId: typeof raw.deviceId === 'string' ? raw.deviceId : (typeof raw.device_id === 'string' ? raw.device_id : 'ESP32-SHIP-01'),
    location,
  };
}
