'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useShipmentData } from '@/hooks/useShipmentData';
import { AlertsList } from '@/components/alerts/AlertsList';
import { Card } from '@/components/ui/Card';
import { SENSOR_THRESHOLDS } from '@/lib/thresholds';
import { AlertTriangle, ShieldCheck, Thermometer, Droplets, Sun, Wind, Bell } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, shipment, connectionState } = useShipmentData();

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-navy-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-100 uppercase">
                ACTIVE <span className="text-brand-amber">ALERTS</span> & NOTIFICATIONS
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-navy-850 border border-brand-amber/30 text-xs font-mono text-brand-amber font-bold">
                {alerts.length} Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deterministic alert generation evaluated against active sensor stream thresholds.
            </p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          <AlertsList alerts={alerts} />
        </div>

        {/* Configured Safety Thresholds Reference Table */}
        <Card className="p-6 border-navy-700">
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck className="w-5 h-5 text-brand-teal" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Configured Hardware Safety Thresholds
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-navy-700 text-slate-400 uppercase text-[11px]">
                  <th className="pb-3 pl-2 font-sans font-semibold">Sensor Parameter</th>
                  <th className="pb-3 px-3 font-sans font-semibold">Normal / Safe Zone</th>
                  <th className="pb-3 px-3 font-sans font-semibold">Warning Level</th>
                  <th className="pb-3 pr-2 text-right font-sans font-semibold">Critical Alarm Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                <tr className="hover:bg-navy-850/50">
                  <td className="py-3 pl-2 flex items-center gap-2 font-sans font-medium text-slate-200">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    <span>Temperature (DHT11)</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400">&lt; {SENSOR_THRESHOLDS.temperature.safeMax}°C</td>
                  <td className="py-3 px-3 text-amber-400">{SENSOR_THRESHOLDS.temperature.safeMax}°C - {SENSOR_THRESHOLDS.temperature.warningMax}°C</td>
                  <td className="py-3 pr-2 text-right text-rose-400 font-bold">&ge; {SENSOR_THRESHOLDS.temperature.warningMax}°C</td>
                </tr>

                <tr className="hover:bg-navy-850/50">
                  <td className="py-3 pl-2 flex items-center gap-2 font-sans font-medium text-slate-200">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>Humidity (DHT11)</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400">{SENSOR_THRESHOLDS.humidity.safeMin}% - {SENSOR_THRESHOLDS.humidity.safeMax}%</td>
                  <td className="py-3 px-3 text-amber-400">&gt; {SENSOR_THRESHOLDS.humidity.warningMax}% or &lt; {SENSOR_THRESHOLDS.humidity.safeMin}%</td>
                  <td className="py-3 pr-2 text-right text-rose-400 font-bold">&gt; 95%</td>
                </tr>

                <tr className="hover:bg-navy-850/50">
                  <td className="py-3 pl-2 flex items-center gap-2 font-sans font-medium text-slate-200">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Exposure (BH1750)</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400">&lt; {SENSOR_THRESHOLDS.light.warningThreshold} lux (Sealed)</td>
                  <td className="py-3 px-3 text-amber-400">&ge; {SENSOR_THRESHOLDS.light.warningThreshold} lux</td>
                  <td className="py-3 pr-2 text-right text-rose-400 font-bold">&ge; {SENSOR_THRESHOLDS.light.criticalThreshold} lux (Breached)</td>
                </tr>

                <tr className="hover:bg-navy-850/50">
                  <td className="py-3 pl-2 flex items-center gap-2 font-sans font-medium text-slate-200">
                    <Wind className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Gas / Smoke (MQ-2)</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400">DO Pin HIGH / &lt; 300 ADC</td>
                  <td className="py-3 px-3 text-amber-400">&ge; 300 ADC</td>
                  <td className="py-3 pr-2 text-right text-rose-400 font-bold">DO Pin LOW (Triggered)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
