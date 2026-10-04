import React from 'react';
import { ShipmentData } from '@/types/shipment';
import { SensorCard } from '../sensors/SensorCard';
import { Thermometer, Droplets, Sun, Wind, ShieldAlert } from 'lucide-react';
import { SENSOR_THRESHOLDS } from '@/lib/thresholds';
import { formatNumber, parseNumber } from '@/lib/utils';
import { StatusVariant } from '../ui/StatusBadge';

interface SensorGridProps {
  shipment: ShipmentData | null;
  gasThreshold?: number;
}

export function SensorGrid({ shipment, gasThreshold = 200 }: SensorGridProps) {
  // 1. TEMPERATURE (DHT11)
  const tempVal = parseNumber(shipment?.temperature);
  let tempStatusText = 'NORMAL';
  let tempVariant: StatusVariant = 'healthy';
  let isTempAlert = false;
  let tempPercent = 0;

  if (tempVal !== null) {
    tempPercent = Math.min(100, Math.max(0, (tempVal / 50) * 100));
    if (tempVal >= SENSOR_THRESHOLDS.temperature.warningMax) {
      tempStatusText = 'TEMPERATURE ALERT';
      tempVariant = 'critical';
      isTempAlert = true;
    } else if (tempVal >= SENSOR_THRESHOLDS.temperature.safeMax) {
      tempStatusText = 'WARNING';
      tempVariant = 'warning';
    } else {
      tempStatusText = 'NORMAL';
      tempVariant = 'healthy';
    }
  } else {
    tempStatusText = 'NO DATA';
    tempVariant = 'neutral';
  }

  // 2. HUMIDITY (DHT11)
  const humVal = parseNumber(shipment?.humidity);
  let humStatusText = 'NORMAL';
  let humVariant: StatusVariant = 'healthy';
  let isHumAlert = false;
  let humPercent = 0;

  if (humVal !== null) {
    humPercent = Math.min(100, Math.max(0, humVal));
    if (humVal > SENSOR_THRESHOLDS.humidity.warningMax) {
      humStatusText = 'HIGH HUMIDITY';
      humVariant = 'warning';
    } else if (humVal < SENSOR_THRESHOLDS.humidity.safeMin) {
      humStatusText = 'LOW HUMIDITY';
      humVariant = 'warning';
    } else {
      humStatusText = 'NORMAL';
      humVariant = 'healthy';
    }
  } else {
    humStatusText = 'NO DATA';
    humVariant = 'neutral';
  }

  // 3. LIGHT INTENSITY (BH1750)
  const lightVal = parseNumber(shipment?.light);
  let lightStatusText = 'NORMAL';
  let lightVariant: StatusVariant = 'healthy';
  let isLightAlert = false;
  let lightPercent = 0;

  if (lightVal !== null) {
    lightPercent = Math.min(100, Math.max(0, (lightVal / 1000) * 100));
    if (lightVal >= SENSOR_THRESHOLDS.light.criticalThreshold) {
      lightStatusText = 'HIGH EXPOSURE';
      lightVariant = 'critical';
      isLightAlert = true;
    } else if (lightVal >= SENSOR_THRESHOLDS.light.warningThreshold) {
      lightStatusText = 'ELEVATED';
      lightVariant = 'warning';
    } else {
      lightStatusText = 'NORMAL';
      lightVariant = 'healthy';
    }
  } else {
    lightStatusText = 'NO DATA';
    lightVariant = 'neutral';
  }

  // 4. GAS DETECTION (MQ-2)
  const gasAnalogVal = parseNumber(shipment?.gasAnalog);
  const isGasDetected =
    shipment?.gasDigital === 1 ||
    shipment?.gasDigital === true ||
    (typeof shipment?.gasStatus === 'string' && shipment?.gasStatus.toUpperCase().includes('DETECT'));

  let gasStatusText = 'SAFE';
  let gasVariant: StatusVariant = 'healthy';
  let isGasAlert = false;
  let gasPercent = 0;

  if (gasAnalogVal !== null) {
    // 0 - 4095 mapping
    gasPercent = Math.min(100, Math.max(0, (gasAnalogVal / 4095) * 100));
  }

  if (isGasDetected) {
    gasStatusText = 'GAS DETECTED';
    gasVariant = 'critical';
    isGasAlert = true;
  } else if (gasAnalogVal !== null && gasAnalogVal >= gasThreshold) {
    gasStatusText = 'GAS DETECTED';
    gasVariant = 'critical';
    isGasAlert = true;
  } else if (gasAnalogVal !== null && gasAnalogVal >= gasThreshold * 0.7) {
    gasStatusText = 'WARNING';
    gasVariant = 'warning';
  } else if (gasAnalogVal === null && !shipment?.gasStatus) {
    gasStatusText = 'NO DATA';
    gasVariant = 'neutral';
  } else {
    gasStatusText = shipment?.gasStatus || 'SAFE';
    gasVariant = 'healthy';
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. TEMPERATURE CARD */}
      <SensorCard
        title="Temperature"
        subtitle="DHT11 Sensor"
        value={formatNumber(tempVal, 1)}
        unit="°C"
        statusText={tempStatusText}
        statusVariant={tempVariant}
        icon={Thermometer}
        metricPercent={tempPercent}
        isAlert={isTempAlert}
        extraDetails={
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Safe Ceiling</span>
            <span className="font-mono text-slate-300">&lt; {SENSOR_THRESHOLDS.temperature.warningMax}°C</span>
          </div>
        }
      />

      {/* 2. HUMIDITY CARD */}
      <SensorCard
        title="Humidity"
        subtitle="DHT11 Sensor"
        value={formatNumber(humVal, 1)}
        unit="%"
        statusText={humStatusText}
        statusVariant={humVariant}
        icon={Droplets}
        metricPercent={humPercent}
        isAlert={isHumAlert}
        extraDetails={
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Target Range</span>
            <span className="font-mono text-slate-300">
              {SENSOR_THRESHOLDS.humidity.safeMin}% - {SENSOR_THRESHOLDS.humidity.safeMax}%
            </span>
          </div>
        }
      />

      {/* 3. LIGHT INTENSITY CARD */}
      <SensorCard
        title="Light Exposure"
        subtitle="BH1750 Sensor"
        value={lightVal !== null ? formatNumber(lightVal, 0) : 'N/A'}
        unit="lux"
        statusText={lightStatusText}
        statusVariant={lightVariant}
        icon={Sun}
        metricPercent={lightPercent}
        isAlert={isLightAlert}
        extraDetails={
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Container Seal</span>
            <span className="font-mono text-slate-300">
              {lightVal !== null && lightVal < SENSOR_THRESHOLDS.light.warningThreshold ? 'Enclosed / Dark' : 'Exposed'}
            </span>
          </div>
        }
      />

      {/* 4. GAS DETECTOR CARD */}
      <SensorCard
        title="Gas / Smoke"
        subtitle="MQ-2 Sensor"
        value={gasAnalogVal !== null ? formatNumber(gasAnalogVal, 0) : (isGasDetected ? 'TRIGGERED' : 'SAFE')}
        unit={gasAnalogVal !== null ? 'ADC' : undefined}
        statusText={gasStatusText}
        statusVariant={gasVariant}
        icon={isGasDetected ? ShieldAlert : Wind}
        metricPercent={gasPercent}
        isAlert={isGasAlert}
        extraDetails={
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Config Threshold</span>
            <span className="font-mono text-brand-teal font-bold">&lt; {gasThreshold} ADC</span>
          </div>
        }
      />
    </div>
  );
}
