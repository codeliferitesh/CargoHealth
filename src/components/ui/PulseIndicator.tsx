import React from 'react';
import { cn } from '@/lib/utils';

interface PulseIndicatorProps {
  status: 'ONLINE' | 'DELAYED' | 'OFFLINE' | 'UNKNOWN';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function PulseIndicator({ status, size = 'md', className, showText = false }: PulseIndicatorProps) {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  const ringSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const colors = {
    ONLINE: {
      dot: 'bg-brand-emerald',
      ring: 'bg-emerald-400',
      text: 'text-emerald-400',
      label: 'ONLINE',
    },
    DELAYED: {
      dot: 'bg-brand-amber',
      ring: 'bg-amber-400',
      text: 'text-amber-400',
      label: 'DELAYED',
    },
    OFFLINE: {
      dot: 'bg-slate-500',
      ring: 'bg-transparent',
      text: 'text-slate-400',
      label: 'OFFLINE',
    },
    UNKNOWN: {
      dot: 'bg-slate-500',
      ring: 'bg-transparent',
      text: 'text-slate-400',
      label: 'UNKNOWN',
    },
  };

  const current = colors[status] || colors.UNKNOWN;

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="relative flex items-center justify-center">
        {status === 'ONLINE' && (
          <span className={cn('absolute rounded-full opacity-75 animate-ping', ringSizeMap[size], current.ring)} />
        )}
        <span className={cn('relative rounded-full', sizeMap[size], current.dot)} />
      </div>
      {showText && <span className={cn('text-xs font-semibold tracking-wider uppercase', current.text)}>{current.label}</span>}
    </div>
  );
}
