'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { useGasThreshold, DEFAULT_GAS_THRESHOLD } from '@/hooks/useGasThreshold';
import { useAuth } from '@/context/AuthContext';
import {
  Sliders,
  Flame,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Info,
  Cpu,
  Radio,
  Sparkles,
} from 'lucide-react';
import { formatNumber, parseNumber, cn } from '@/lib/utils';

interface GasThresholdCardProps {
  currentGasAnalog?: number | null;
  hardwareGasStatus?: string;
  isGasDigitalDetected?: boolean;
}

export function GasThresholdCard({
  currentGasAnalog,
  hardwareGasStatus = 'SAFE',
  isGasDigitalDetected = false,
}: GasThresholdCardProps) {
  const { user } = useAuth();
  const {
    gasThreshold,
    rawThreshold,
    loading: thresholdLoading,
    error: thresholdError,
    isSaving,
    saveSuccess,
    updateGasThreshold,
  } = useGasThreshold();

  const [inputVal, setInputVal] = useState<number>(gasThreshold);
  const [localError, setLocalError] = useState<string | null>(null);

  // Synchronize local input state whenever the remote Firebase threshold updates (e.g. changed by another user or initial load)
  useEffect(() => {
    setInputVal(gasThreshold);
  }, [gasThreshold]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInputVal(val);
    setLocalError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setInputVal(0);
      return;
    }
    const val = Number(raw);
    if (!isNaN(val)) {
      setInputVal(Math.min(4095, Math.max(0, val)));
      setLocalError(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (inputVal < 0 || inputVal > 4095) {
      setLocalError('Threshold must be between 0 and 4095 ADC.');
      return;
    }

    const res = await updateGasThreshold(inputVal);
    if (!res.success && res.error) {
      setLocalError(res.error);
    }
  };

  const adcVal = parseNumber(currentGasAnalog);

  // Frontend dynamic visual calculation based on user requirements:
  // SAFE: gasAnalog < gasThreshold * 0.70
  // WARNING: gasAnalog >= gasThreshold * 0.70 AND gasAnalog < gasThreshold
  // GAS DETECTED: gasAnalog >= gasThreshold
  let visualStatus: 'SAFE' | 'WARNING' | 'GAS DETECTED' = 'SAFE';
  let visualVariant: 'safe' | 'warning' | 'critical' = 'safe';

  if (adcVal !== null) {
    if (adcVal >= gasThreshold) {
      visualStatus = 'GAS DETECTED';
      visualVariant = 'critical';
    } else if (adcVal >= gasThreshold * 0.7) {
      visualStatus = 'WARNING';
      visualVariant = 'warning';
    } else {
      visualStatus = 'SAFE';
      visualVariant = 'safe';
    }
  }

  // Calculate percentage positions for the progress track (0 - 4095 range)
  const currentPercent = adcVal !== null ? Math.min(100, Math.max(0, (adcVal / 4095) * 100)) : 0;
  const thresholdPercent = Math.min(100, Math.max(0, (gasThreshold / 4095) * 100));
  const isModified = inputVal !== gasThreshold;

  return (
    <Card className="p-6 border-navy-700/90 bg-gradient-to-br from-navy-900/90 via-navy-900/80 to-navy-950/90 shadow-xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base text-slate-100 flex items-center gap-2 font-bold tracking-wide">
              <Sliders className="w-5 h-5 text-brand-teal" />
              <span>GAS DETECTION SETTINGS</span>
            </CardTitle>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-navy-800 border border-navy-700 text-brand-cyan">
              MQ-2 Analog
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure dynamic ESP32 gas alert threshold stored at <code className="text-brand-teal font-mono">/shipment/settings/gasThreshold</code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-navy-950/80 px-3 py-1.5 rounded-xl border border-navy-800">
          <Radio className="w-3.5 h-3.5 text-brand-teal animate-pulse" />
          <span>Sync: RTDB Remote</span>
        </div>
      </CardHeader>

      <div className="space-y-6">
        {/* Metric Overview: Current ADC vs Configured Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Realtime Current Gas Level */}
          <div className="p-4 rounded-xl bg-navy-950/90 border border-navy-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Gas Level</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-100">
                  {adcVal !== null ? formatNumber(adcVal, 0) : 'N/A'}
                </span>
                <span className="text-xs font-mono text-slate-400">ADC</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">Source: /shipment/current/gasAnalog</p>
          </div>

          {/* 2. Configured Gas Alert Threshold */}
          <div className="p-4 rounded-xl bg-navy-950/90 border border-navy-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gas Alert Threshold</span>
                {rawThreshold === null && (
                  <span className="text-[9px] font-mono text-slate-500 bg-navy-900 px-1.5 py-0.5 rounded border border-navy-800">
                    Default (200)
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-brand-teal">
                  {gasThreshold}
                </span>
                <span className="text-xs font-mono text-slate-400">ADC</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">Path: /shipment/settings/gasThreshold</p>
          </div>

          {/* 3. Visual Gas Status */}
          <div
            className={cn(
              'p-4 rounded-xl border flex flex-col justify-between transition-all',
              visualVariant === 'critical'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                : visualVariant === 'warning'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            )}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Threshold Comparison</span>
              <div className="flex items-center gap-2 mt-1">
                {visualVariant === 'critical' ? (
                  <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
                ) : visualVariant === 'warning' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-brand-emerald" />
                )}
                <span className="text-lg sm:text-xl font-black font-mono uppercase tracking-tight">
                  {visualStatus}
                </span>
              </div>
            </div>
            <p className="text-[10px] opacity-75 font-mono mt-2">
              HW Status: {hardwareGasStatus} {isGasDigitalDetected ? '(Digital DO Triggered)' : ''}
            </p>
          </div>
        </div>

        {/* Dynamic Visual Progress Bar with Threshold Marker */}
        <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              <span>Current Level: <strong className="text-slate-200">{adcVal ?? 0} ADC</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-teal" />
              <span>Configured Threshold: <strong className="text-brand-teal">{gasThreshold} ADC</strong></span>
            </span>
          </div>

          {/* Bar track */}
          <div className="relative h-6 w-full rounded-full bg-navy-900 border border-navy-700/80 overflow-visible my-3">
            {/* Active level fill */}
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                visualVariant === 'critical'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : visualVariant === 'warning'
                  ? 'bg-gradient-to-r from-brand-teal to-amber-400'
                  : 'bg-gradient-to-r from-brand-teal/80 to-brand-cyan'
              )}
              style={{ width: `${Math.max(1, currentPercent)}%` }}
            />

            {/* Threshold Vertical Marker Line & Pin */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-rose-400 shadow-md shadow-rose-500/50 z-10 transition-all duration-200"
              style={{ left: `${thresholdPercent}%` }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] font-bold shadow-sm whitespace-nowrap">
                LIMIT {gasThreshold}
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>0 ADC (Clean Air)</span>
            <span>2048 ADC (Mid)</span>
            <span>4095 ADC (Max Saturation)</span>
          </div>
        </div>

        {/* Manual Threshold Control Form */}
        <form onSubmit={handleSave} className="p-4 rounded-xl bg-navy-950/90 border border-navy-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-850 pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-teal" />
                <span>Adjust Detection Threshold (0 – 4095)</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Slide or type a custom threshold value. Click &quot;Save Threshold&quot; to publish to Firebase.
              </p>
            </div>

            {/* Number Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Value:</span>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={4095}
                  value={inputVal}
                  onChange={handleInputChange}
                  disabled={!user || isSaving}
                  className="w-28 px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-slate-100 font-mono font-bold text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all disabled:opacity-60"
                />
              </div>
              <span className="text-xs font-mono text-slate-400">ADC</span>
            </div>
          </div>

          {/* Synchronized Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>0 ADC</span>
              <span className="text-brand-teal font-bold">{inputVal} ADC</span>
              <span>4095 ADC</span>
            </div>
            <input
              type="range"
              min={0}
              max={4095}
              step={5}
              value={inputVal}
              onChange={handleSliderChange}
              disabled={!user || isSaving}
              className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-brand-teal disabled:cursor-not-allowed"
            />
          </div>

          {/* Inline Feedback Alerts */}
          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">Gas threshold updated successfully in Firebase Realtime Database.</span>
            </div>
          )}

          {(localError || thresholdError) && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{localError || thresholdError || 'Failed to update gas threshold'}</span>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Info className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
              <span>ESP32 listens to <code className="text-slate-300">/shipment/settings/gasThreshold</code> on next upload cycle.</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {isModified && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal(gasThreshold);
                    setLocalError(null);
                  }}
                  disabled={isSaving}
                  className="px-3 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-xs font-medium text-slate-300 transition-all cursor-pointer"
                >
                  Reset
                </button>
              )}

              <button
                type="submit"
                disabled={!user || isSaving || thresholdLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-navy-950 font-bold text-xs hover:bg-brand-teal/90 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all shadow-md shadow-brand-teal/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Threshold</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}
