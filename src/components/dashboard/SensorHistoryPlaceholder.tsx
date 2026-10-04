import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { LineChart, History, Info, Database } from 'lucide-react';

export function SensorHistoryPlaceholder() {
  return (
    <Card className="p-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <CardTitle className="text-base text-slate-100 flex items-center gap-2 font-bold tracking-wide">
            <LineChart className="w-5 h-5 text-brand-cyan" />
            <span>SENSOR TELEMETRY HISTORY & TRENDS</span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Historical time-series analytics and trend charts</p>
        </div>
        <span className="px-2.5 py-1 rounded bg-navy-800 text-[11px] font-mono text-slate-400 border border-navy-700">
          Module Standby
        </span>
      </CardHeader>

      <div className="py-12 px-4 rounded-xl border border-dashed border-navy-700 bg-navy-900/40 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-400 mb-3">
          <History className="w-6 h-6 text-brand-cyan" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200 mb-1">Historical Analytics Standby</h4>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
          Historical analytics will appear here once historical sensor data collection is enabled on your Firebase backend at{' '}
          <code className="px-1.5 py-0.5 rounded bg-navy-800 text-brand-teal font-mono">/shipment/history</code>.
        </p>
        <div className="inline-flex items-center gap-2 text-[11px] text-slate-400 bg-navy-800/80 px-3 py-1.5 rounded-lg border border-navy-700">
          <Info className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Real-time live monitoring is actively streaming without mock values.</span>
        </div>
      </div>
    </Card>
  );
}
