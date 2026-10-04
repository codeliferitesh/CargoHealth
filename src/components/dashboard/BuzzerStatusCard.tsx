'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Bell, BellOff, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuzzerStatusCardProps {
  buzzerState?: string | boolean | number;
  gasStatus?: string;
  isGasDetected?: boolean;
}

export function BuzzerStatusCard({ buzzerState, gasStatus, isGasDetected }: BuzzerStatusCardProps) {
  // Normalize buzzer value strictly from Firebase
  const buzzerStr = typeof buzzerState === 'string' ? buzzerState.toUpperCase() : '';
  const isBuzzerActive =
    buzzerStr === 'ON' ||
    buzzerState === true ||
    buzzerState === 1 ||
    buzzerStr === 'ACTIVE';

  const buzzerDisplay = isBuzzerActive ? 'ON' : 'OFF';

  return (
    <Card
      className={cn(
        'p-5 transition-all duration-300',
        isBuzzerActive
          ? 'border-rose-500/60 bg-gradient-to-br from-rose-950/40 via-navy-850 to-navy-850 shadow-lg shadow-rose-500/10'
          : 'border-navy-700/70 bg-navy-900/60'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Device Buzzer Status */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-xl border flex items-center justify-center transition-all shrink-0',
              isBuzzerActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-navy-800 text-slate-400 border-navy-700'
            )}
          >
            {isBuzzerActive ? <Bell className="w-6 h-6 text-rose-400 animate-pulse" /> : <BellOff className="w-6 h-6 text-slate-500" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">HARDWARE BUZZER</h4>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border',
                  isBuzzerActive
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                    : 'bg-navy-800 text-slate-400 border-navy-700'
                )}
              >
                ● {buzzerDisplay}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              {isBuzzerActive ? (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs sm:text-sm font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Hardware siren is ON (Triggered by active alert condition)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-emerald shrink-0" />
                  <span>Hardware buzzer is OFF (Standby status: Safe)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Technical detail pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-navy-950/80 px-3 py-1.5 rounded-lg border border-navy-800">
          <span>Active Buzzer Pin:</span>
          <span className={isBuzzerActive ? 'text-rose-400 font-bold' : 'text-brand-emerald font-bold'}>
            {isBuzzerActive ? 'HIGH (ALERT)' : 'LOW (IDLE)'}
          </span>
        </div>
      </div>
    </Card>
  );
}
