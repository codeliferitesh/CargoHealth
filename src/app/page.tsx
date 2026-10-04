'use client';

import React from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  Activity,
  ShieldCheck,
  Flame,
  MapPin,
  Wifi,
  Cpu,
  ArrowRight,
  Thermometer,
  Droplets,
  Sun,
  BellRing,
  Radio,
  Lock,
  Database,
  Compass,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-brand-teal selection:text-navy-950 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-navy-800/80 bg-navy-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/20 via-brand-cyan/15 to-transparent border border-brand-teal/40 flex items-center justify-center text-brand-teal shadow-md shadow-brand-teal/10">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-base uppercase text-slate-100">
                SHIPMENT <span className="text-brand-teal">HEALTH</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">IoT Monitoring Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-navy-950 font-bold text-xs hover:bg-brand-teal/90 transition-all shadow-md shadow-brand-teal/10 cursor-pointer"
              >
                <span>OPEN DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-navy-900 border border-transparent hover:border-navy-700 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-navy-950 font-bold text-xs hover:bg-brand-teal/90 transition-all shadow-md shadow-brand-teal/10 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-teal/15 via-brand-cyan/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-850/90 border border-navy-700 text-xs font-mono text-brand-cyan mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping" />
            <span>ESP32 Node &bull; Firebase Realtime Database Sync</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
            SHIPMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-cyan to-sky-300">HEALTH</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-semibold mt-3 max-w-2xl mx-auto">
            Real-Time IoT Monitoring for Safer Shipments
          </p>

          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Continuous real-time surveillance of temperature, relative humidity, light exposure, and combustible gas levels to safeguard high-value and perishable cargo in transit.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-teal text-navy-950 text-sm font-extrabold tracking-wide hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 active:scale-95"
              >
                <span>OPEN DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-teal text-navy-950 text-sm font-extrabold tracking-wide hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-sm font-bold text-slate-200 transition-all shadow-sm active:scale-95"
                >
                  <Lock className="w-4 h-4 text-brand-cyan" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

          {/* Hardware Feature Grid Banner */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-navy-700/80 bg-navy-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Cpu className="w-4 h-4 text-brand-cyan" />
                <span>ESP32-SHIP-01 / TELEMETRY ARCHITECTURE</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-teal">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Firebase RTDB Stream</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-2 text-rose-400 mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-xs font-bold font-sans">DHT11 Temp</span>
                </div>
                <p className="text-[11px] text-slate-400">Thermal integrity monitor</p>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-2 text-sky-400 mb-1">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs font-bold font-sans">DHT11 Humidity</span>
                </div>
                <p className="text-[11px] text-slate-400">Moisture control</p>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Sun className="w-4 h-4" />
                  <span className="text-xs font-bold font-sans">BH1750 Light</span>
                </div>
                <p className="text-[11px] text-slate-400">Container seal security</p>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-2 text-brand-teal mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-bold font-sans">MQ-2 Gas</span>
                </div>
                <p className="text-[11px] text-slate-400">Hazardous gas detection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Pillars Sections */}
      <section className="py-16 bg-navy-900/50 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold tracking-widest text-brand-teal uppercase mb-2">
              COMPREHENSIVE MONITORING
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-100">
              Six Core Pillars of Shipment Safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Real-Time Monitoring */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-750 hover:border-brand-teal/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center text-brand-teal mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Real-Time Monitoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct live push stream from the ESP32 node into Firebase Realtime Database. Telemetry values update in the browser without manual page refresh.
              </p>
            </div>

            {/* 2. Environmental Safety */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-750 hover:border-brand-cyan/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-4">
                <Thermometer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Environmental Safety</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dual temperature and relative humidity tracking calibrated for cold-chain, pharmaceutical, food, and delicate electronics transit.
              </p>
            </div>

            {/* 3. Gas Detection */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-750 hover:border-rose-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Gas Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                MQ-2 electrochemical sensor triggers instant hazard flags for combustible gas, LPG, and smoke accumulations with automatic active buzzer alerting.
              </p>
            </div>

            {/* 4. Shipment Health */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-750 hover:border-amber-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Shipment Health</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates edge health conditions (SAFE, WARNING, TEMPERATURE ALERT, GAS ALERT) to prioritize immediate dispatcher attention.
              </p>
            </div>

            {/* 5. Location Tracking */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-750 hover:border-brand-teal/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center text-brand-teal mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Location Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Device GPS position capture with direct Google Maps navigation coordinates stored securely at /shipment/current/location.
              </p>
            </div>

            {/* 6. Cloud Connectivity */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-750 hover:border-brand-cyan/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Cloud Connectivity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by Google Firebase Realtime Database with Firebase Authentication, sub-second latency, and protected routes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 text-center border-t border-navy-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            Ready to monitor your cargo in real time?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-6">
            Sign in to access live IoT telemetry, threshold alerts, and geonavigation.
          </p>
          <Link
            href={user ? '/dashboard' : '/login'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-teal text-navy-950 font-bold text-sm hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20"
          >
            <span>{user ? 'Open Dashboard' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
