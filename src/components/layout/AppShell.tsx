'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useShipmentData } from '@/hooks/useShipmentData';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { connectionState, lastReceivedAt, elapsedSeconds, isFirebaseConnected } = useShipmentData();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-brand-teal selection:text-navy-950">
        <Navbar
          connectionState={connectionState}
          lastUpdated={lastReceivedAt}
          elapsedSeconds={elapsedSeconds}
          isFirebaseConnected={isFirebaseConnected}
        />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
