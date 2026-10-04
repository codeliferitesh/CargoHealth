'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ShipmentHero } from '@/components/dashboard/ShipmentHero';
import { SensorGrid } from '@/components/dashboard/SensorGrid';
import { GasThresholdCard } from '@/components/dashboard/GasThresholdCard';
import { BuzzerStatusCard } from '@/components/dashboard/BuzzerStatusCard';
import { LiveSensorTable } from '@/components/dashboard/LiveSensorTable';
import { LocationCard } from '@/components/location/LocationCard';
import { SensorHistoryPlaceholder } from '@/components/dashboard/SensorHistoryPlaceholder';
import { AlertsList } from '@/components/alerts/AlertsList';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useShipmentData } from '@/hooks/useShipmentData';
import { useGasThreshold } from '@/hooks/useGasThreshold';
import { useGeolocation } from '@/hooks/useGeolocation';
import { AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const {
    shipment,
    loading,
    error,
    connectionState,
    healthStatus,
    alerts,
    lastReceivedAt,
    elapsedSeconds,
    isFirebaseConnected,
    refetch,
  } = useShipmentData();

  const { gasThreshold } = useGasThreshold();

  const {
    location: browserLocation,
    loading: geoLoading,
    syncingWithFirebase: geoSyncing,
    syncSuccess: geoSyncSuccess,
    error: geoError,
    getCurrentLocation,
  } = useGeolocation();

  const activeLocation = shipment?.location || browserLocation;
  const isGasDetected =
    shipment?.gasDigital === 1 ||
    shipment?.gasDigital === true ||
    (typeof shipment?.gasStatus === 'string' &&
      shipment?.gasStatus.toUpperCase().includes('DETECT'));

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Loading View */}
        {loading && !shipment && (
          <LoadingState message="Loading live data from Firebase..." />
        )}

        {/* Error View */}
        {!loading && error && !shipment && (
          <ErrorState error={error} onRetry={refetch} />
        )}

        {/* Empty View (Connected to Firebase, but waiting for ESP32 payload) */}
        {!loading && !error && !shipment && (
          <EmptyState onRetry={refetch} />
        )}

        {/* Active Live Dashboard */}
        {shipment && (
          <>
            {/* 1. HERO STATUS CARD */}
            <ShipmentHero
              shipment={shipment}
              connectionState={connectionState}
              healthStatus={healthStatus}
              lastReceivedAt={lastReceivedAt}
              elapsedSeconds={elapsedSeconds}
              isFirebaseConnected={isFirebaseConnected}
            />

            {/* 2. SENSOR METRIC CARDS */}
            <SensorGrid shipment={shipment} gasThreshold={gasThreshold} />

            {/* 3. GAS DETECTION SETTINGS (Configurable threshold at /shipment/settings/gasThreshold) */}
            <GasThresholdCard
              currentGasAnalog={shipment.gasAnalog}
              hardwareGasStatus={shipment.gasStatus}
              isGasDigitalDetected={isGasDetected}
            />

            {/* 4. BUZZER HARDWARE STATUS */}
            <BuzzerStatusCard
              buzzerState={shipment.buzzer}
              gasStatus={shipment.gasStatus}
              isGasDetected={isGasDetected}
            />

            {/* 5. ACTIVE SYSTEM ALERTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-brand-amber" />
                  <span>ACTIVE SYSTEM ALERTS</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {alerts.length} active notice{alerts.length === 1 ? '' : 's'}
                </span>
              </div>
              <AlertsList alerts={alerts} />
            </div>

            {/* 6. LIVE SENSOR TELEMETRY TABLE */}
            <LiveSensorTable shipment={shipment} lastReceivedAt={lastReceivedAt} />

            {/* 7. GEOLOCATION GPS DISPATCH */}
            <LocationCard
              location={activeLocation}
              onGetLocation={() => getCurrentLocation(true)}
              isLoading={geoLoading}
              isSyncing={geoSyncing}
              syncSuccess={geoSyncSuccess}
              error={geoError}
            />

            {/* 8. SENSOR HISTORY / TELEMETRY ARCHIVE */}
            <SensorHistoryPlaceholder />
          </>
        )}
      </div>
    </AppShell>
  );
}
