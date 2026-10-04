'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useShipmentData } from '@/hooks/useShipmentData';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { GasThresholdCard } from '@/components/dashboard/GasThresholdCard';
import {
  Activity,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Bell,
  Cpu,
  Terminal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatNumber, parseNumber, formatExactTime } from '@/lib/utils';
import { SENSOR_THRESHOLDS } from '@/lib/thresholds';

export default function MonitoringPage() {
  const {
    shipment,
    rawSnapshot,
    loading,
    error,
    connectionState,
    healthStatus,
    lastReceivedAt,
    elapsedSeconds,
    refetch,
  } = useShipmentData();

  const [showRawJson, setShowRawJson] = useState(false);

  const temp = parseNumber(shipment?.temperature);
  const hum = parseNumber(shipment?.humidity);
  const light = parseNumber(shipment?.light);
  const gasAnalog = parseNumber(shipment?.gasAnalog);
  const isGasDetected =
    shipment?.gasDigital === 1 ||
    shipment?.gasDigital === true ||
    (typeof shipment?.gasStatus === 'string' && shipment?.gasStatus.toUpperCase().includes('DETECT'));
  const buzzerActive = shipment?.buzzer === 'ON' || isGasDetected;

  const formattedTime =
    !lastReceivedAt
      ? 'Waiting for packet...'
      : elapsedSeconds <= 5
      ? 'Just now'
      : `${elapsedSeconds}s ago`;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-100 uppercase">
                LIVE <span className="text-brand-teal">MONITORING</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-navy-850 border border-brand-teal/30 text-xs font-mono font-bold text-brand-teal">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time hardware sensor stream reading directly from Firebase Realtime Database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-700 text-xs font-mono text-slate-300">
              <Cpu className="w-4 h-4 text-brand-cyan" />
              <span>{shipment?.deviceId || 'ESP32-SHIP-01'}</span>
            </div>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Raw JSON</span>
              {showRawJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Loading / Error / Empty states */}
        {loading && !shipment && <LoadingState message="Loading live data..." />}
        {!loading && error && !shipment && <ErrorState error={error} onRetry={refetch} />}
        {!loading && !error && !shipment && <EmptyState onRetry={refetch} />}

        {/* Live Monitoring Dashboard Content */}
        {shipment && (
          <>
            {/* Raw JSON Inspector Accordion */}
            {showRawJson && (
              <div className="p-4 rounded-xl border border-navy-700 bg-navy-900/90 backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-navy-800 text-xs font-mono text-slate-400">
                  <span>Firebase RTDB Payload (/shipment/current)</span>
                  <span>Received at browser: {formatExactTime(lastReceivedAt)}</span>
                </div>
                <pre className="text-xs font-mono text-brand-teal/90 bg-navy-950 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(rawSnapshot || shipment, null, 2)}
                </pre>
              </div>
            )}

            {/* Deep Sensor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Temperature Diagnostic */}
              <Card className="p-6 border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Temperature Sensor</h3>
                      <span className="text-[11px] text-slate-400 font-mono">DHT11 (GPIO 4)</span>
                    </div>
                  </div>
                  <StatusBadge variant={temp !== null && temp >= SENSOR_THRESHOLDS.temperature.warningMax ? 'critical' : temp !== null && temp >= SENSOR_THRESHOLDS.temperature.safeMax ? 'warning' : 'healthy'}>
                    {temp !== null && temp >= SENSOR_THRESHOLDS.temperature.warningMax ? 'ALERT' : temp !== null && temp >= SENSOR_THRESHOLDS.temperature.safeMax ? 'WARNING' : 'NORMAL'}
                  </StatusBadge>
                </div>
                <div className="my-3">
                  <div className="text-4xl font-black font-mono text-slate-100">
                    {formatNumber(temp, 1)} <span className="text-lg font-normal text-slate-400">°C</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-navy-800 pt-3">
                  <div className="flex justify-between">
                    <span>Safe Ceiling:</span>
                    <span className="text-slate-200">&lt; {SENSOR_THRESHOLDS.temperature.safeMax}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alert Limit:</span>
                    <span className="text-rose-400">&ge; {SENSOR_THRESHOLDS.temperature.warningMax}°C</span>
                  </div>
                </div>
              </Card>

              {/* Humidity Diagnostic */}
              <Card className="p-6 border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Humidity Sensor</h3>
                      <span className="text-[11px] text-slate-400 font-mono">DHT11 (GPIO 4)</span>
                    </div>
                  </div>
                  <StatusBadge variant={hum !== null && (hum > SENSOR_THRESHOLDS.humidity.warningMax || hum < SENSOR_THRESHOLDS.humidity.safeMin) ? 'warning' : 'healthy'}>
                    {hum !== null && (hum > SENSOR_THRESHOLDS.humidity.warningMax || hum < SENSOR_THRESHOLDS.humidity.safeMin) ? 'WARNING' : 'NORMAL'}
                  </StatusBadge>
                </div>
                <div className="my-3">
                  <div className="text-4xl font-black font-mono text-slate-100">
                    {formatNumber(hum, 1)} <span className="text-lg font-normal text-slate-400">%</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-navy-800 pt-3">
                  <div className="flex justify-between">
                    <span>Optimal Zone:</span>
                    <span className="text-slate-200">{SENSOR_THRESHOLDS.humidity.safeMin}% - {SENSOR_THRESHOLDS.humidity.safeMax}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moisture Risk:</span>
                    <span className="text-amber-400">&gt; {SENSOR_THRESHOLDS.humidity.warningMax}%</span>
                  </div>
                </div>
              </Card>

              {/* Light Intensity Diagnostic */}
              <Card className="p-6 border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Light Exposure</h3>
                      <span className="text-[11px] text-slate-400 font-mono">BH1750 (I2C Bus)</span>
                    </div>
                  </div>
                  <StatusBadge variant={light !== null && light >= SENSOR_THRESHOLDS.light.criticalThreshold ? 'critical' : 'healthy'}>
                    {light !== null && light >= SENSOR_THRESHOLDS.light.criticalThreshold ? 'BREACH' : 'NORMAL'}
                  </StatusBadge>
                </div>
                <div className="my-3">
                  <div className="text-4xl font-black font-mono text-slate-100">
                    {light !== null ? formatNumber(light, 0) : 'N/A'} <span className="text-lg font-normal text-slate-400">lux</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-navy-800 pt-3">
                  <div className="flex justify-between">
                    <span>Package Seal:</span>
                    <span className="text-slate-200">{light !== null && light < SENSOR_THRESHOLDS.light.warningThreshold ? 'Sealed (<500 lx)' : 'Exposed (>500 lx)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Exposure:</span>
                    <span className="text-amber-400">&ge; 1000 lux</span>
                  </div>
                </div>
              </Card>

              {/* Gas Sensor Diagnostic */}
              <Card className="p-6 border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center text-brand-teal">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Gas & Smoke Detection</h3>
                      <span className="text-[11px] text-slate-400 font-mono">MQ-2 Electrochemical</span>
                    </div>
                  </div>
                  <StatusBadge variant={isGasDetected ? 'critical' : 'healthy'}>
                    {isGasDetected ? 'GAS DETECTED' : 'SAFE'}
                  </StatusBadge>
                </div>
                <div className="my-3">
                  <div className="text-4xl font-black font-mono text-slate-100">
                    {gasAnalog !== null ? formatNumber(gasAnalog, 0) : (isGasDetected ? 'ALERT' : 'SAFE')}
                    {gasAnalog !== null && <span className="text-lg font-normal text-slate-400"> ADC</span>}
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-navy-800 pt-3">
                  <div className="flex justify-between">
                    <span>Gas Status:</span>
                    <span className="text-slate-200 font-bold">{shipment.gasStatus || (isGasDetected ? 'GAS DETECTED' : 'SAFE')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Digital Pin:</span>
                    <span className={isGasDetected ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {isGasDetected ? 'Active (Low)' : 'Nominal (High)'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Buzzer Siren Diagnostic */}
              <Card className="p-6 border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${buzzerActive ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse' : 'bg-navy-800 border-navy-700 text-slate-400'}`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Active Buzzer State</h3>
                      <span className="text-[11px] text-slate-400 font-mono">Hardware Siren</span>
                    </div>
                  </div>
                  <StatusBadge variant={buzzerActive ? 'critical' : 'healthy'}>
                    {buzzerActive ? 'ON' : 'OFF'}
                  </StatusBadge>
                </div>
                <div className="my-3">
                  <div className="text-3xl font-black font-mono text-slate-100">
                    {buzzerActive ? 'SOUNDING (ON)' : 'QUIET (OFF)'}
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-navy-800 pt-3">
                  <div className="flex justify-between">
                    <span>Hardware Pin:</span>
                    <span className="text-slate-200">GPIO 18 / 19</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Value:</span>
                    <span className="text-slate-200">{shipment.buzzer || (buzzerActive ? 'ON' : 'OFF')}</span>
                  </div>
                </div>
              </Card>

              {/* Node Health Diagnostic */}
              <Card className="p-6 border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Health Status</h3>
                      <span className="text-[11px] text-slate-400 font-mono">Real-time condition</span>
                    </div>
                  </div>
                  <StatusBadge variant={healthStatus === 'SAFE' ? 'healthy' : healthStatus === 'WARNING' ? 'warning' : healthStatus === 'OFFLINE' ? 'offline' : 'critical'}>
                    {healthStatus}
                  </StatusBadge>
                </div>
                <div className="my-3">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-100 truncate">
                    {healthStatus}
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-navy-800 pt-3">
                  <div className="flex justify-between">
                    <span>ESP32 Link:</span>
                    <span className={connectionState === 'ONLINE' ? 'text-brand-emerald font-bold' : 'text-slate-400 font-bold'}>{connectionState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Received:</span>
                    <span className="text-slate-200">{formattedTime}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Gas Detection Settings Control Panel */}
            <GasThresholdCard
              currentGasAnalog={shipment.gasAnalog}
              hardwareGasStatus={shipment.gasStatus}
              isGasDigitalDetected={isGasDetected}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
