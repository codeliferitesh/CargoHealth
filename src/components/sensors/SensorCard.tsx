import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { StatusBadge, StatusVariant } from '../ui/StatusBadge';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  statusText: string;
  statusVariant: StatusVariant;
  icon: LucideIcon;
  subtitle?: string;
  metricPercent?: number; // 0 - 100 for visual bar
  isAlert?: boolean;
  className?: string;
  extraDetails?: React.ReactNode;
}

export function SensorCard({
  title,
  value,
  unit,
  statusText,
  statusVariant,
  icon: Icon,
  subtitle,
  metricPercent,
  isAlert = false,
  className,
  extraDetails,
}: SensorCardProps) {
  // Border and accent styling based on alert status
  const cardBorderClass = isAlert
    ? 'border-rose-500/50 bg-gradient-to-br from-rose-950/30 via-navy-850 to-navy-850 shadow-rose-500/10'
    : statusVariant === 'warning'
    ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-navy-850 to-navy-850'
    : 'border-navy-700/70 hover:border-navy-600';

  const iconBgClass = isAlert
    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
    : statusVariant === 'warning'
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
    : statusVariant === 'healthy'
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : 'bg-navy-800 text-brand-cyan border-navy-700';

  const barColorClass = isAlert
    ? 'bg-rose-500'
    : statusVariant === 'warning'
    ? 'bg-amber-400'
    : 'bg-brand-teal';

  return (
    <Card className={cn('flex flex-col justify-between p-5 transition-all duration-300', cardBorderClass, className)}>
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center transition-transform', iconBgClass)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</h4>
              {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <StatusBadge variant={statusVariant}>{statusText}</StatusBadge>
        </div>

        {/* Primary Value Display */}
        <div className="my-2 flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-100">
            {value}
          </span>
          {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
        </div>

        {/* Progress / Range Bar if percentage supplied */}
        {typeof metricPercent === 'number' && (
          <div className="mt-4 mb-2">
            <div className="w-full h-1.5 rounded-full bg-navy-900 border border-navy-800 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', barColorClass)}
                style={{ width: `${Math.min(100, Math.max(0, metricPercent))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Extra details (e.g. digital sensor flag, gas status, sensor info) */}
      {extraDetails && (
        <div className="mt-3 pt-3 border-t border-navy-800/80 text-xs text-slate-400">
          {extraDetails}
        </div>
      )}
    </Card>
  );
}
