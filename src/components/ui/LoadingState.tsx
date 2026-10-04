import React from 'react';
import { Loader2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Connecting to shipment telemetry...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="relative mb-5 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center animate-pulse">
          <Radio className="w-8 h-8 text-brand-teal animate-pulse" />
        </div>
        <Loader2 className="w-6 h-6 text-brand-cyan animate-spin absolute -top-1 -right-1" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">Connecting to Shipment</h3>
      <p className="text-sm text-slate-400 max-w-sm">{message}</p>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-brand-teal font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-ping" />
        <span>Listening on /shipment/current</span>
      </div>
    </div>
  );
}
