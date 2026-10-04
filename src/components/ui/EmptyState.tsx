import React from 'react';
import { PackageOpen, RefreshCw, Cpu, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  onRetry?: () => void;
  className?: string;
}

export function EmptyState({ onRetry, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-navy-700/80 bg-navy-900/60 backdrop-blur-sm', className)}>
      <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-5 text-slate-400">
        <PackageOpen className="w-8 h-8 text-brand-cyan" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-xs font-mono text-slate-300 mb-3">
        <Radio className="w-3.5 h-3.5 text-brand-teal animate-pulse" />
        <span>Target: /shipment/current</span>
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-2 uppercase">Waiting for ESP32 data...</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        Firebase connection is established. Awaiting live sensor packet transmission from your ESP32 hardware node.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-600 text-xs font-bold text-slate-100 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-brand-teal" />
          <span>RETRY LISTENER</span>
        </button>
      )}
    </div>
  );
}
