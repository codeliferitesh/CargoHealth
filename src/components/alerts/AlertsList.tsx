import React from 'react';
import { AlertItem } from '@/types/shipment';
import { Card } from '../ui/Card';
import { CheckCircle2, AlertTriangle, Flame, Thermometer, WifiOff, BellRing, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AlertsListProps {
  alerts: AlertItem[];
  className?: string;
}

export function AlertsList({ alerts, className }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <Card className={cn('p-8 text-center border-emerald-500/30 bg-emerald-950/10', className)}>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-100 mb-1">All Systems Normal</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No environmental hazards or communication anomalies detected. All sensors report nominal parameters.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'critical';
        const isWarning = alert.severity === 'warning';

        const Icon = () => {
          if (alert.type === 'GAS') return <Flame className="w-5 h-5 text-rose-400 animate-pulse" />;
          if (alert.type === 'TEMPERATURE') return <Thermometer className="w-5 h-5 text-rose-400" />;
          if (alert.type === 'CONNECTIVITY') return <WifiOff className="w-5 h-5 text-slate-400" />;
          return <AlertTriangle className="w-5 h-5 text-amber-400" />;
        };

        return (
          <div
            key={alert.id}
            className={cn(
              'p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3',
              isCritical
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200 shadow-sm shadow-rose-500/10'
                : isWarning
                ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                : 'bg-navy-850 border-navy-700 text-slate-300'
            )}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  'w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 sm:mt-0',
                  isCritical
                    ? 'bg-rose-500/20 border-rose-500/40'
                    : isWarning
                    ? 'bg-amber-500/20 border-amber-500/40'
                    : 'bg-navy-800 border-navy-700'
                )}
              >
                <Icon />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider',
                      isCritical ? 'bg-rose-500/30 text-rose-300' : 'bg-amber-500/30 text-amber-300'
                    )}
                  >
                    {alert.severity}
                  </span>
                  <h5 className="text-sm font-bold text-slate-100">{alert.title}</h5>
                </div>
                <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">{alert.message}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 font-mono text-[11px] text-slate-400 shrink-0 border-t sm:border-t-0 border-navy-800/80 pt-2 sm:pt-0">
              {alert.value && <span className="font-bold text-slate-200">{alert.value}</span>}
              <div className="flex items-center gap-1 text-[10px]">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(alert.timestamp)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
