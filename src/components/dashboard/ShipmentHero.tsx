'use client';

import React from 'react';
import { ShipmentData, DeviceConnectionState, HealthSeverity } from '@/types/shipment';
import { getHealthTheme } from '@/lib/health';
import { PulseIndicator } from '../ui/PulseIndicator';
import { ShieldCheck, AlertTriangle, Flame, Wifi, Clock, Cpu, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShipmentHeroProps {
  shipment: ShipmentData | null;
  connectionState: DeviceConnectionState;
  healthStatus: HealthSeverity;
  lastReceivedAt: number | null;
  elapsedSeconds?: number;
  isFirebaseConnected?: boolean;
}

export function ShipmentHero({
  shipment,
  connectionState,
  healthStatus,
  lastReceivedAt,
  elapsedSeconds = 0,
  isFirebaseConnected = true,
}: ShipmentHeroProps) {
  const healthTheme = getHealthTheme(healthStatus);
  const deviceId = shipment?.deviceId || (typeof shipment?.device === 'string' ? shipment.device : 'ESP32-SHIP-01');

  // Format browser-side receipt elapsed time
  const formattedTime =
    !lastReceivedAt
      ? 'Waiting for first packet...'
      : elapsedSeconds <= 5
      ? 'Just now (5s cycle)'
      : elapsedSeconds < 60
      ? `${elapsedSeconds} seconds ago`
      : `${Math.floor(elapsedSeconds / 60)} min ago`;

  // Icon based on health status
  const HealthIcon = () => {
    if (healthStatus === 'SAFE') return <ShieldCheck className="w-9 h-9 text-brand-emerald" />;
    if (healthStatus === 'GAS ALERT') return <Flame className="w-9 h-9 text-brand-rose animate-bounce" />;
    if (healthStatus === 'TEMPERATURE ALERT' || healthStatus === 'WARNING' || healthStatus === 'CRITICAL') {
      return <AlertTriangle className="w-9 h-9 text-brand-amber" />;
    }
    return <Wifi className="w-9 h-9 text-slate-400" />;
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-md transition-all duration-300 shadow-2xl',
        healthTheme.bgColor,
        healthTheme.borderColor
      )}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-teal/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-brand-cyan/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side: Shipment Health Status */}
        <div className="space-y-3.5 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-widest uppercase bg-navy-950/80 border border-navy-700 text-slate-300">
              SHIPMENT HEALTH
            </span>
            <span className={cn('px-3.5 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border', healthTheme.badgeBg)}>
              ● {healthTheme.label}
            </span>
            {shipment?.buzzer === 'ON' && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/25 text-rose-200 border border-rose-500/40 animate-pulse">
                ⚠ HARDWARE BUZZER ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-start sm:items-center gap-4">
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-navy-950/80 border border-navy-700 items-center justify-center shadow-inner shrink-0">
              <HealthIcon />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-100 uppercase">
                {healthTheme.label}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {healthTheme.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Triple Status Breakdown Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 min-w-[280px] bg-navy-950/90 rounded-2xl border border-navy-700/90 p-4 text-xs shadow-lg">
          {/* 1. Device Info */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-900/60 border border-navy-800">
            <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-brand-cyan shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-mono text-slate-400">Device Node</p>
              <p className="font-mono font-bold text-slate-100 truncate">{deviceId}</p>
            </div>
          </div>

          {/* 2. ESP32 Connection */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-900/60 border border-navy-800">
            <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
              <PulseIndicator status={connectionState} size="sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-slate-400">ESP32 Status</p>
              <p
                className={cn(
                  'font-mono font-bold',
                  connectionState === 'ONLINE'
                    ? 'text-brand-emerald'
                    : connectionState === 'DELAYED'
                    ? 'text-brand-amber'
                    : 'text-slate-400'
                )}
              >
                ● {connectionState}
              </p>
            </div>
          </div>

          {/* 3. Firebase RTDB Connection */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-900/60 border border-navy-800">
            <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
              <Radio
                className={cn(
                  'w-4 h-4',
                  isFirebaseConnected ? 'text-brand-emerald animate-pulse' : 'text-rose-400'
                )}
              />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-slate-400">Firebase RTDB</p>
              <p
                className={cn(
                  'font-mono font-bold',
                  isFirebaseConnected ? 'text-brand-emerald' : 'text-rose-400'
                )}
              >
                ● {isFirebaseConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </p>
            </div>
          </div>

          {/* 4. Last Data Received */}
          <div className="sm:col-span-3 lg:col-span-1 pt-1 px-1 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-navy-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Last received:</span>
            </span>
            <span className="text-slate-200 font-bold">{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
