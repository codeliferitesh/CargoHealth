export interface ShipmentLocation {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  updatedAt?: number | string;
}

export interface ShipmentSettings {
  gasThreshold?: number;
  [key: string]: unknown;
}

export interface ShipmentData {
  // Raw / standard fields
  temperature?: number;
  humidity?: number;
  light?: number;
  gasAnalog?: number;
  gasDigital?: number | boolean;
  gasStatus?: string;
  buzzer?: string | boolean | number;
  health?: string;
  timestamp?: number | string;
  deviceId?: string;
  location?: ShipmentLocation;

  // Potential alternative field aliases used by different ESP32 sketches
  temp?: number;
  hum?: number;
  lux?: number;
  lightIntensity?: number;
  gas?: number;
  gas_analog?: number;
  gas_digital?: number | boolean;
  gas_status?: string;
  buzzerStatus?: string | boolean | number;
  buzzer_state?: string | boolean | number;
  lastUpdate?: number | string;
  ts?: number | string;
  [key: string]: unknown;
}

export type HealthSeverity = 'SAFE' | 'WARNING' | 'TEMPERATURE ALERT' | 'GAS ALERT' | 'CRITICAL' | 'OFFLINE';

export type DeviceConnectionState = 'ONLINE' | 'DELAYED' | 'OFFLINE' | 'UNKNOWN';

export interface AlertItem {
  id: string;
  type: 'GAS' | 'TEMPERATURE' | 'HUMIDITY' | 'LIGHT' | 'CONNECTIVITY' | 'SYSTEM';
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: number | string;
  value?: string | number;
  threshold?: string | number;
}
