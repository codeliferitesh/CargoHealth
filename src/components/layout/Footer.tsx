import React from 'react';
import Link from 'next/link';
import { PackageCheck, Cpu, Database, Flame, Wifi } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-navy-800 bg-navy-950 text-slate-400 text-xs py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-navy-850 border border-navy-700 flex items-center justify-center text-brand-teal">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Shipment Health Tracking System</p>
              <p className="text-[11px] text-slate-500">Real-Time IoT Monitoring for Safer Shipments</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-900 border border-navy-800">
              <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
              <span>ESP32 Node</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-900 border border-navy-800">
              <Wifi className="w-3.5 h-3.5 text-brand-emerald" />
              <span>DHT11 + BH1750 + MQ-2</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-900 border border-navy-800">
              <Flame className="w-3.5 h-3.5 text-brand-amber" />
              <span>Firebase RTDB</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
            <Link href="/monitoring" className="hover:text-slate-300 transition-colors">Monitoring</Link>
            <Link href="/location" className="hover:text-slate-300 transition-colors">Location</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
