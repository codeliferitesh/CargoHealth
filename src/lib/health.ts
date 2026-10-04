import { ShipmentData, HealthSeverity, DeviceConnectionState, AlertItem } from '@/types/shipment';
import { SENSOR_THRESHOLDS } from './thresholds';
import { parseNumber } from './utils';

/**
 * Calculates ESP32 device connection status based on browser receipt time
 * millis() from ESP32 is uptime, so browser-side lastReceivedAt is used:
 * - <= 15 seconds: ONLINE
 * - 15 - 60 seconds: DELAYED
 * - > 60 seconds: OFFLINE
 */
export function getDeviceConnectionStatus(
  lastReceivedAt: number | null | undefined,
  isFirebaseConnected: boolean = true
): DeviceConnectionState {
  if (!isFirebaseConnected) {
    return 'UNKNOWN';
  }

  if (!lastReceivedAt || lastReceivedAt <= 0) {
    return 'OFFLINE';
  }

  const diffMs = Date.now() - lastReceivedAt;
  const diffSeconds = diffMs / 1000;

  if (diffSeconds <= SENSOR_THRESHOLDS.heartbeat.onlineMaxSeconds) {
    return 'ONLINE';
  } else if (diffSeconds <= SENSOR_THRESHOLDS.heartbeat.delayedMaxSeconds) {
    return 'DELAYED';
  } else {
    return 'OFFLINE';
  }
}

/**
 * Determines the shipment health status.
 * Priority 1: Use REAL health field from Firebase (/shipment/current/health) if available.
 * Priority 2: Fallback to evaluating real sensor thresholds.
 */
export function calculateHealthStatus(
  data: ShipmentData | null | undefined,
  connectionState: DeviceConnectionState
): HealthSeverity {
  if (!data) return 'OFFLINE';

  if (connectionState === 'OFFLINE') {
    return 'OFFLINE';
  }

  // Priority 1: Respect REAL Firebase health field if present
  if (data.health && typeof data.health === 'string' && data.health.trim() !== '') {
    const rawHealth = data.health.trim().toUpperCase();
    if (['SAFE', 'NORMAL', 'HEALTHY', 'OK'].includes(rawHealth)) return 'SAFE';
    if (rawHealth.includes('GAS')) return 'GAS ALERT';
    if (rawHealth.includes('TEMP')) return 'TEMPERATURE ALERT';
    if (['WARNING', 'CAUTION'].includes(rawHealth)) return 'WARNING';
    if (['CRITICAL', 'DANGER', 'EMERGENCY'].includes(rawHealth)) return 'CRITICAL';
    if (rawHealth.includes('OFFLINE')) return 'OFFLINE';
    return rawHealth as HealthSeverity;
  }

  // Priority 2: Fallback sensor thresholds
  const isGasDetected =
    data.gasDigital === 1 ||
    data.gasDigital === true ||
    (typeof data.gasStatus === 'string' && data.gasStatus.toUpperCase().includes('DETECT')) ||
    (data.gasAnalog !== undefined && data.gasAnalog >= SENSOR_THRESHOLDS.gas.analogWarningThreshold);

  if (isGasDetected || data.buzzer === 'ON') {
    return 'GAS ALERT';
  }

  const temp = parseNumber(data.temperature);
  if (temp !== null && temp >= SENSOR_THRESHOLDS.temperature.warningMax) {
    // >= 35°C
    return 'TEMPERATURE ALERT';
  }

  if (temp !== null && temp >= SENSOR_THRESHOLDS.temperature.safeMax) {
    // 30°C - 34.99°C
    return 'WARNING';
  }

  const light = parseNumber(data.light);
  if (light !== null && light >= SENSOR_THRESHOLDS.light.criticalThreshold) {
    return 'CRITICAL';
  }

  const hum = parseNumber(data.humidity);
  if (hum !== null && (hum < SENSOR_THRESHOLDS.humidity.safeMin || hum > SENSOR_THRESHOLDS.humidity.warningMax)) {
    return 'WARNING';
  }

  return 'SAFE';
}

/**
 * Generates active alert items from REAL current Firebase telemetry
 * Strictly does NOT generate mock or fake alerts.
 */
export function generateActiveAlerts(
  data: ShipmentData | null | undefined,
  connectionState: DeviceConnectionState
): AlertItem[] {
  const alerts: AlertItem[] = [];

  // Connectivity alerts
  if (connectionState === 'OFFLINE') {
    alerts.push({
      id: 'alert-conn-offline',
      type: 'CONNECTIVITY',
      title: 'ESP32 Device Offline',
      message: 'No live telemetry packet received from ESP32 in the last 60 seconds.',
      severity: 'critical',
      timestamp: Date.now(),
    });
  } else if (connectionState === 'DELAYED') {
    alerts.push({
      id: 'alert-conn-delayed',
      type: 'CONNECTIVITY',
      title: 'Telemetry Stream Delayed',
      message: 'Packet transmission delayed (>15s since last heartbeat).',
      severity: 'warning',
      timestamp: Date.now(),
    });
  }

  if (!data) return alerts;

  const temp = parseNumber(data.temperature);
  const hum = parseNumber(data.humidity);
  const light = parseNumber(data.light);
  const gasAnalog = parseNumber(data.gasAnalog);

  const isGasDetected =
    data.gasDigital === 1 ||
    data.gasDigital === true ||
    (typeof data.gasStatus === 'string' && data.gasStatus.toUpperCase().includes('DETECT')) ||
    (gasAnalog !== null && gasAnalog >= SENSOR_THRESHOLDS.gas.analogWarningThreshold);

  // Gas Alert
  if (isGasDetected) {
    alerts.push({
      id: 'alert-gas',
      type: 'GAS',
      title: 'Gas Hazard Detected',
      message: `MQ-2 sensor triggered: ${data.gasStatus || 'GAS DETECTED'} (Analog: ${gasAnalog ?? 'N/A'})`,
      severity: 'critical',
      timestamp: Date.now(),
      value: gasAnalog ?? undefined,
      threshold: SENSOR_THRESHOLDS.gas.analogWarningThreshold,
    });
  }

  // Temperature Alert
  if (temp !== null && temp >= SENSOR_THRESHOLDS.temperature.warningMax) {
    alerts.push({
      id: 'alert-temp-critical',
      type: 'TEMPERATURE',
      title: 'Critical Temperature Alert',
      message: `Current temperature ${temp.toFixed(1)}°C exceeds critical threshold (${SENSOR_THRESHOLDS.temperature.warningMax}°C).`,
      severity: 'critical',
      timestamp: Date.now(),
      value: `${temp.toFixed(1)}°C`,
      threshold: `${SENSOR_THRESHOLDS.temperature.warningMax}°C`,
    });
  } else if (temp !== null && temp >= SENSOR_THRESHOLDS.temperature.safeMax) {
    alerts.push({
      id: 'alert-temp-warning',
      type: 'TEMPERATURE',
      title: 'High Temperature Warning',
      message: `Temperature ${temp.toFixed(1)}°C is elevated above normal safe range (<30°C).`,
      severity: 'warning',
      timestamp: Date.now(),
      value: `${temp.toFixed(1)}°C`,
      threshold: `${SENSOR_THRESHOLDS.temperature.safeMax}°C`,
    });
  }

  // Light / Seal breach alert
  if (light !== null && light >= SENSOR_THRESHOLDS.light.criticalThreshold) {
    alerts.push({
      id: 'alert-light-critical',
      type: 'LIGHT',
      title: 'Container Seal Breached',
      message: `Intense light exposure (${light} lux) indicates package opening or container breach.`,
      severity: 'critical',
      timestamp: Date.now(),
      value: `${light} lux`,
      threshold: `${SENSOR_THRESHOLDS.light.criticalThreshold} lux`,
    });
  } else if (light !== null && light >= SENSOR_THRESHOLDS.light.warningThreshold) {
    alerts.push({
      id: 'alert-light-warning',
      type: 'LIGHT',
      title: 'Light Exposure Warning',
      message: `Light level (${light} lux) exceeds dark container threshold.`,
      severity: 'warning',
      timestamp: Date.now(),
      value: `${light} lux`,
      threshold: `${SENSOR_THRESHOLDS.light.warningThreshold} lux`,
    });
  }

  // Humidity alert
  if (hum !== null && (hum < SENSOR_THRESHOLDS.humidity.safeMin || hum > SENSOR_THRESHOLDS.humidity.warningMax)) {
    alerts.push({
      id: 'alert-humidity-warning',
      type: 'HUMIDITY',
      title: 'Abnormal Humidity Level',
      message: `Humidity is at ${hum.toFixed(1)}% (Recommended range: 20% – 70%).`,
      severity: 'warning',
      timestamp: Date.now(),
      value: `${hum.toFixed(1)}%`,
    });
  }

  // Buzzer Active alert
  if (data.buzzer === 'ON') {
    alerts.push({
      id: 'alert-buzzer-on',
      type: 'SYSTEM',
      title: 'Active Buzzer Triggered',
      message: 'ESP32 hardware buzzer is active due to threshold violation.',
      severity: 'critical',
      timestamp: Date.now(),
    });
  }

  return alerts;
}

export function getHealthTheme(status: HealthSeverity) {
  switch (status) {
    case 'SAFE':
      return {
        label: 'SAFE',
        color: 'text-brand-emerald',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        dotColor: 'bg-brand-emerald',
        badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        description: 'All shipment parameters are within optimal safe thresholds.',
      };
    case 'WARNING':
      return {
        label: 'WARNING',
        color: 'text-brand-amber',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        dotColor: 'bg-brand-amber',
        badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        description: 'Environmental conditions are elevated. Close monitoring recommended.',
      };
    case 'TEMPERATURE ALERT':
      return {
        label: 'TEMPERATURE ALERT',
        color: 'text-brand-rose',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/40',
        dotColor: 'bg-brand-rose',
        badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        description: 'Critical temperature threshold exceeded! Immediate thermal intervention required.',
      };
    case 'GAS ALERT':
      return {
        label: 'GAS ALERT',
        color: 'text-brand-rose',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/40',
        dotColor: 'bg-brand-rose',
        badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        description: 'Hazardous gas or smoke accumulation detected by MQ-2 sensor.',
      };
    case 'CRITICAL':
      return {
        label: 'CRITICAL',
        color: 'text-brand-rose',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/40',
        dotColor: 'bg-brand-rose',
        badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        description: 'Multiple critical threshold breaches or physical container compromise detected.',
      };
    case 'OFFLINE':
    default:
      return {
        label: 'DEVICE OFFLINE',
        color: 'text-slate-400',
        bgColor: 'bg-slate-800/40',
        borderColor: 'border-slate-700/50',
        dotColor: 'bg-slate-500',
        badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
        description: 'No active telemetry received from ESP32 IoT node.',
      };
  }
}
