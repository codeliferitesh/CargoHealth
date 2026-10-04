import React from 'react';
import { ShipmentData } from '@/types/shipment';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { StatusBadge, StatusVariant } from '../ui/StatusBadge';
import { Thermometer, Droplets, Sun, Wind, Bell, Cpu, Activity, Clock } from 'lucide-react';
import { formatNumber, parseNumber, formatRelativeTime } from '@/lib/utils';
import { SENSOR_THRESHOLDS } from '@/lib/thresholds';

interface LiveSensorTableProps {
  shipment: ShipmentData | null;
  lastReceivedAt: number | null;
}

export function LiveSensorTable({ shipment, lastReceivedAt }: LiveSensorTableProps) {
  const temp = parseNumber(shipment?.temperature);
  const hum = parseNumber(shipment?.humidity);
  const light = parseNumber(shipment?.light);
  const gasAnalog = parseNumber(shipment?.gasAnalog);
  const isGasDetected =
    shipment?.gasDigital === 1 ||
    shipment?.gasDigital === true ||
    (typeof shipment?.gasStatus === 'string' && shipment?.gasStatus.toUpperCase().includes('DETECT'));

  const tempStatus =
    temp === null
      ? { text: 'NO DATA', variant: 'neutral' as StatusVariant }
      : temp >= SENSOR_THRESHOLDS.temperature.warningMax
      ? { text: 'CRITICAL', variant: 'critical' as StatusVariant }
      : temp >= SENSOR_THRESHOLDS.temperature.safeMax
      ? { text: 'WARNING', variant: 'warning' as StatusVariant }
      : { text: 'NORMAL', variant: 'healthy' as StatusVariant };

  const humStatus =
    hum === null
      ? { text: 'NO DATA', variant: 'neutral' as StatusVariant }
      : hum > SENSOR_THRESHOLDS.humidity.warningMax || hum < SENSOR_THRESHOLDS.humidity.safeMin
      ? { text: 'WARNING', variant: 'warning' as StatusVariant }
      : { text: 'NORMAL', variant: 'healthy' as StatusVariant };

  const lightStatus =
    light === null
      ? { text: 'NO DATA', variant: 'neutral' as StatusVariant }
      : light >= SENSOR_THRESHOLDS.light.criticalThreshold
      ? { text: 'BREACH ALERT', variant: 'critical' as StatusVariant }
      : light >= SENSOR_THRESHOLDS.light.warningThreshold
      ? { text: 'ELEVATED', variant: 'warning' as StatusVariant }
      : { text: 'NORMAL', variant: 'healthy' as StatusVariant };

  const gasStatus = isGasDetected
    ? { text: 'GAS DETECTED', variant: 'critical' as StatusVariant }
    : gasAnalog !== null && gasAnalog >= SENSOR_THRESHOLDS.gas.analogCriticalThreshold
    ? { text: 'CRITICAL', variant: 'critical' as StatusVariant }
    : gasAnalog !== null && gasAnalog >= SENSOR_THRESHOLDS.gas.analogWarningThreshold
    ? { text: 'WARNING', variant: 'warning' as StatusVariant }
    : gasAnalog !== null
    ? { text: 'SAFE', variant: 'healthy' as StatusVariant }
    : { text: shipment?.gasStatus || 'NORMAL', variant: 'healthy' as StatusVariant };

  const buzzerActive = shipment?.buzzer === 'ON' || isGasDetected;

  const rows = [
    {
      sensor: 'Temperature (DHT11)',
      icon: Thermometer,
      iconColor: 'text-rose-400',
      value: temp !== null ? `${formatNumber(temp, 1)} °C` : 'N/A',
      status: tempStatus.text,
      variant: tempStatus.variant,
      pin: 'GPIO 4',
    },
    {
      sensor: 'Relative Humidity (DHT11)',
      icon: Droplets,
      iconColor: 'text-sky-400',
      value: hum !== null ? `${formatNumber(hum, 1)} %` : 'N/A',
      status: humStatus.text,
      variant: humStatus.variant,
      pin: 'GPIO 4',
    },
    {
      sensor: 'Ambient Light (BH1750)',
      icon: Sun,
      iconColor: 'text-amber-400',
      value: light !== null ? `${formatNumber(light, 0)} lux` : 'N/A',
      status: lightStatus.text,
      variant: lightStatus.variant,
      pin: 'I2C (SDA 21/SCL 22)',
    },
    {
      sensor: 'Gas / Smoke (MQ-2 Analog)',
      icon: Wind,
      iconColor: 'text-brand-teal',
      value: gasAnalog !== null ? `${formatNumber(gasAnalog, 0)} ADC` : (isGasDetected ? 'TRIGGERED' : 'SAFE'),
      status: gasStatus.text,
      variant: gasStatus.variant,
      pin: 'ADC1 (GPIO 34/35)',
    },
    {
      sensor: 'Active Audio Siren (Buzzer)',
      icon: Bell,
      iconColor: buzzerActive ? 'text-rose-400' : 'text-slate-400',
      value: buzzerActive ? 'ENGAGED (ON)' : 'QUIET (OFF)',
      status: buzzerActive ? 'ALERT ON' : 'STANDBY',
      variant: buzzerActive ? ('critical' as StatusVariant) : ('healthy' as StatusVariant),
      pin: 'GPIO 18/19',
    },
  ];

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <CardTitle className="text-base text-slate-100 flex items-center gap-2 font-bold tracking-wide">
            <Activity className="w-5 h-5 text-brand-teal" />
            <span>LIVE SENSOR MONITOR</span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Real-time hardware payload streamed from /shipment/current</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-navy-900 px-3 py-1.5 rounded-lg border border-navy-700">
          <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping" />
          <span>LIVE STREAM</span>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-navy-700 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
              <th className="pb-3 pl-2">Sensor Component</th>
              <th className="pb-3 px-3">Telemetry Value</th>
              <th className="pb-3 px-3">Operational Status</th>
              <th className="pb-3 px-3 hidden md:table-cell">Hardware Interface</th>
              <th className="pb-3 pr-2 text-right">Stream State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60 font-mono">
            {rows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <tr key={idx} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center">
                        <Icon className={`w-3.5 h-3.5 ${row.iconColor}`} />
                      </div>
                      <span className="font-sans font-medium text-slate-200">{row.sensor}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-100">{row.value}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge variant={row.variant}>{row.status}</StatusBadge>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 hidden md:table-cell text-xs">{row.pin}</td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs text-brand-teal font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                      LIVE
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
