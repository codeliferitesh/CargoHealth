import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl border border-rose-500/30 bg-rose-500/5 backdrop-blur-sm', className)}>
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-100 mb-1">Unable to connect to live shipment data</h3>
      <p className="text-sm text-slate-400 max-w-md mb-5 font-mono break-all">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 text-sm font-medium text-slate-100 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-brand-cyan" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
