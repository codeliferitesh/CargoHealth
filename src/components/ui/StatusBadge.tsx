import React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant = 'healthy' | 'warning' | 'critical' | 'info' | 'offline' | 'neutral';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ children, variant = 'neutral', className, dot = true }: StatusBadgeProps) {
  const variantStyles = {
    healthy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    critical: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    offline: 'bg-slate-800/80 text-slate-400 border-slate-700',
    neutral: 'bg-navy-800 text-slate-300 border-navy-700',
  };

  const dotStyles = {
    healthy: 'bg-emerald-400 shadow-emerald-500/50',
    warning: 'bg-amber-400 shadow-amber-500/50',
    critical: 'bg-rose-400 shadow-rose-500/50 animate-pulse',
    info: 'bg-sky-400 shadow-sky-500/50',
    offline: 'bg-slate-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide border',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shadow-sm', dotStyles[variant])} />}
      {children}
    </span>
  );
}
