'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  PackageCheck,
  Activity,
  MapPin,
  AlertTriangle,
  Info,
  Menu,
  X,
  Radio,
  Cpu,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CircleDot,
  Clock,
} from 'lucide-react';
import { PulseIndicator } from '../ui/PulseIndicator';
import { DeviceConnectionState } from '@/types/shipment';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  connectionState?: DeviceConnectionState;
  lastUpdated?: number | string | null;
  elapsedSeconds?: number;
  isFirebaseConnected?: boolean;
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: PackageCheck },
  { href: '/monitoring', label: 'Live Monitoring', icon: Activity },
  { href: '/location', label: 'Location', icon: MapPin },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/about', label: 'About', icon: Info },
];

export function Navbar({
  connectionState = 'OFFLINE',
  elapsedSeconds = 0,
  isFirebaseConnected = false,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setLoggingOut(false);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Operator';
  const email = user?.email || 'user@example.com';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formattedElapsed =
    elapsedSeconds <= 5
      ? 'Just now'
      : elapsedSeconds < 60
      ? `${elapsedSeconds}s ago`
      : `${Math.floor(elapsedSeconds / 60)}m ago`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-700/80 bg-navy-950/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/20 via-brand-cyan/15 to-transparent border border-brand-teal/40 flex items-center justify-center text-brand-teal shadow-md shadow-brand-teal/10 group-hover:border-brand-teal/70 transition-all">
                <PackageCheck className="w-5 h-5 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-wider text-base text-slate-100 uppercase">
                    SHIPMENT <span className="text-brand-teal">HEALTH</span>
                  </span>
                  <span className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-navy-800 border border-navy-700 text-brand-cyan">
                    IoT Telemetry
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                  IoT Shipment Health Tracking System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-navy-850 text-brand-teal border border-navy-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-900/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-teal' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Top Right: Status Badges & User Header */}
          <div className="flex items-center gap-3">
            {/* 1. Firebase Connection Status */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-[11px] font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseConnected ? 'bg-brand-emerald animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-slate-400">Firebase:</span>
              <span className={isFirebaseConnected ? 'text-brand-emerald font-bold' : 'text-rose-400 font-bold'}>
                {isFirebaseConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            {/* 2. ESP32 Device Connection Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900/90 border border-navy-700/80 shadow-inner">
              <PulseIndicator status={connectionState} size="sm" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono">ESP32:</span>
                  <span
                    className={`text-[10px] font-bold tracking-wider font-mono ${
                      connectionState === 'ONLINE'
                        ? 'text-brand-emerald'
                        : connectionState === 'DELAYED'
                        ? 'text-brand-amber'
                        : 'text-slate-400'
                    }`}
                  >
                    {connectionState}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{formattedElapsed}</span>
                </div>
              </div>
            </div>

            {/* 3. User Avatar & Profile Dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-700/80 text-left transition-all focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                  aria-label="User profile menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-teal to-brand-cyan text-navy-950 font-black text-xs flex items-center justify-center shadow-sm">
                    {initials || 'U'}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs font-bold text-slate-200 leading-tight max-w-[110px] truncate">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono leading-tight max-w-[110px] truncate">
                      {email}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-navy-900 border border-navy-700/90 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-navy-800">
                      <p className="text-xs font-semibold text-slate-200">{displayName}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-[10px] font-mono text-brand-emerald">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Authenticated</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-brand-teal hover:bg-navy-800 transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-brand-teal" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/monitoring"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-brand-cyan hover:bg-navy-800 transition-colors"
                      >
                        <Activity className="w-4 h-4 text-brand-cyan" />
                        <span>Live Telemetry</span>
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-navy-800 transition-colors"
                      >
                        <Info className="w-4 h-4 text-slate-400" />
                        <span>System Architecture</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-navy-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl bg-navy-900 border border-navy-700 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-700 bg-navy-900/98 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-2">
          {/* User profile banner in mobile menu */}
          {user && (
            <div className="p-3 mb-3 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-teal to-brand-cyan text-navy-950 font-black text-xs flex items-center justify-center">
                  {initials || 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">{displayName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-navy-900 text-rose-400 hover:bg-rose-500/20"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-navy-800 text-brand-teal border border-navy-600'
                    : 'text-slate-300 hover:bg-navy-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-teal' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Mobile status breakdown */}
          <div className="pt-3 border-t border-navy-800 space-y-1.5 text-xs text-slate-400 font-mono">
            <div className="flex items-center justify-between">
              <span>Firebase RTDB:</span>
              <span className={isFirebaseConnected ? 'text-brand-emerald font-bold' : 'text-rose-400 font-bold'}>
                {isFirebaseConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>ESP32 Telemetry:</span>
              <span
                className={
                  connectionState === 'ONLINE'
                    ? 'text-brand-emerald font-bold'
                    : connectionState === 'DELAYED'
                    ? 'text-brand-amber font-bold'
                    : 'text-slate-400 font-bold'
                }
              >
                {connectionState} ({formattedElapsed})
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
