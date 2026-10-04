'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useShipmentData } from '@/hooks/useShipmentData';
import { useGeolocation } from '@/hooks/useGeolocation';
import { LocationCard } from '@/components/location/LocationCard';
import { Card } from '@/components/ui/Card';
import { MapPin, Navigation, ShieldCheck, Compass, Radio, ExternalLink } from 'lucide-react';
import { buildGoogleMapsUrl } from '@/lib/location';

export default function LocationPage() {
  const { shipment } = useShipmentData();
  const {
    location: browserLocation,
    loading: geoLoading,
    syncingWithFirebase: geoSyncing,
    syncSuccess: geoSyncSuccess,
    error: geoError,
    getCurrentLocation,
  } = useGeolocation();

  const activeLocation = shipment?.location || browserLocation;

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-navy-800 pb-5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-100 uppercase">
              SHIPMENT <span className="text-brand-teal">LOCATION</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-navy-850 border border-brand-cyan/30 text-xs font-mono text-brand-cyan font-bold">
              GPS Service
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geonavigation and transit coordinate tracker for the active shipment container.
          </p>
        </div>

        {/* Location Tracking Card with full details and explanation */}
        <LocationCard
          location={activeLocation}
          onGetLocation={() => getCurrentLocation(true)}
          isLoading={geoLoading}
          isSyncing={geoSyncing}
          syncSuccess={geoSyncSuccess}
          error={geoError}
          showExplanation={true}
        />

        {/* How It Works Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-navy-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center text-brand-teal">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Zero-Cost GPS Resolution</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses the standard W3C Geolocation API from the authorized courier&apos;s device browser without incurring paid Google Maps API billing or key quotas.
            </p>
          </Card>

          <Card className="p-5 border-navy-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Firebase Cloud Synchronization</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coordinates write directly to <code className="text-slate-300 font-mono">/shipment/current/location</code> using rate-limited updates to conserve database bandwidth.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
