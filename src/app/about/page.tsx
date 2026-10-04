import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import {
  PackageCheck,
  Cpu,
  Database,
  Globe,
  Layers,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Lock,
  MapPin,
  Activity,
  Radio,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-navy-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal/20 via-brand-cyan/15 to-transparent border border-brand-teal/40 flex items-center justify-center text-brand-teal shadow-lg">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">
                SHIPMENT <span className="text-brand-teal">HEALTH</span> TRACKING SYSTEM
              </h1>
              <p className="text-xs sm:text-sm text-brand-cyan font-mono font-medium">
                Real-Time IoT Monitoring for Safer Shipments
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            An enterprise-grade IoT logistics platform engineered to continuously monitor environmental conditions inside cargo shipments during transit. The system provides immediate alert notifications and condition tracking to preserve perishable, chemical, and sensitive consignments.
          </p>
        </div>

        {/* System Architecture Section */}
        <div>
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-teal" />
            <span>System Architecture</span>
          </h2>

          <div className="p-6 rounded-2xl border border-navy-700 bg-navy-900/70 font-mono text-xs shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Node 1 */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                <div className="text-brand-teal font-bold mb-1.5 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>1. Edge Hardware</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• ESP32 Microcontroller</p>
                  <p>• DHT11, BH1750, MQ-2 Sensors</p>
                  <p>• Active Piezo Buzzer</p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                <div className="text-brand-amber font-bold mb-1.5 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>2. Cloud Backend</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• Firebase Realtime Database</p>
                  <p>• Firebase Authentication</p>
                  <p>• /shipment/current node</p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                <div className="text-brand-cyan font-bold mb-1.5 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>3. Logistics Dashboard</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• Next.js 15 &amp; React 19</p>
                  <p>• Real-time reactive stream</p>
                  <p>• GPS Geolocation mapping</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware & Software Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hardware */}
          <Card className="p-6 border-navy-700">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-cyan" />
              <span>Hardware Components</span>
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-brand-cyan shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">ESP32:</span> Dual-core 240 MHz microcontroller with built-in Wi-Fi streaming telemetry directly to Firebase.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">DHT11:</span> Precision temperature and relative humidity sensor for thermal stability monitoring.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">BH1750:</span> 16-bit ambient light sensor operating via I2C for container seal and box breach detection.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-brand-teal shrink-0 mt-0.5">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">MQ-2 Gas Sensor:</span> Detects hazardous gas, LPG, methane, and smoke leakages inside the compartment.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">Active Buzzer:</span> Hardware audible acoustic siren triggered autonomously on critical hazard thresholds.
                </div>
              </li>
            </ul>
          </Card>

          {/* Software Stack */}
          <Card className="p-6 border-navy-700">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-teal" />
              <span>Software &amp; Cloud Stack</span>
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-brand-cyan shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">Next.js &amp; React:</span> Modern React 19 application framework with App Router, SSR, and client telemetry hooks.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">TypeScript:</span> Strict static type safety throughout the data models, telemetry packets, and authentication state.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-brand-amber shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">Firebase Realtime Database:</span> Low-latency NoSQL database powering live push updates from the ESP32 node.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">Firebase Authentication:</span> Secure email/password login, password recovery, and protected route access control.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-brand-teal shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">W3C Geolocation:</span> Browser GPS position resolution and Google Maps coordinates synchronization.
                </div>
              </li>
            </ul>
          </Card>
        </div>

        {/* Features Checklist */}
        <Card className="p-6 border-navy-700">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
            System Features &amp; Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { title: 'Real-time monitoring', desc: 'Instant telemetry stream' },
              { title: 'Temperature monitoring', desc: 'DHT11 °C readings' },
              { title: 'Humidity monitoring', desc: 'Relative humidity %' },
              { title: 'Light monitoring', desc: 'BH1750 lux detection' },
              { title: 'Gas detection', desc: 'MQ-2 hazard sensing' },
              { title: 'Health alerts', desc: 'Automatic severity score' },
              { title: 'Device status', desc: 'Heartbeat stream link' },
              { title: 'Location tracking', desc: 'GPS & Google Maps' },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                  <span className="font-bold text-slate-200">{f.title}</span>
                </div>
                <span className="text-[11px] text-slate-400 pl-6">{f.desc}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
