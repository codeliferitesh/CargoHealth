export const SENSOR_THRESHOLDS = {
  // Temperature (°C)
  temperature: {
    safeMax: 30.0,
    warningMax: 35.0,
    unit: '°C',
  },
  // Humidity (%)
  humidity: {
    safeMin: 20.0,
    safeMax: 70.0,
    warningMax: 85.0,
    unit: '%',
  },
  // Light (lux) - BH1750
  light: {
    warningThreshold: 500, // Box opening / exposure warning
    criticalThreshold: 1000,
    unit: 'lux',
  },
  // Gas - MQ-2 (Analog 0-4095 or 0-1023 depending on ADC/voltage)
  gas: {
    analogWarningThreshold: 300,
    analogCriticalThreshold: 600,
    unit: 'ppm / ADC',
  },
  // Device heartbeat connection thresholds (in seconds)
  heartbeat: {
    onlineMaxSeconds: 15,
    delayedMaxSeconds: 60,
  },
};
