'use client';

import React from 'react';
import { ShipmentLocation } from '@/types/shipment';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { MapPin, Navigation, ExternalLink, RefreshCw, CheckCircle, AlertCircle, Compass } from 'lucide-react';
import { buildGoogleMapsUrl } from '@/lib/location';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface LocationCardProps {
  location?: ShipmentLocation | null;
  onGetLocation?: () => void;
  isLoading?: boolean;
  isSyncing?: boolean;
  syncSuccess?: boolean;
  error?: string | null;
  className?: string;
  showExplanation?: boolean;
}

export function LocationCard({
  location,
  onGetLocation,
  isLoading = false,
  isSyncing = false,
  syncSuccess = false,
  error = null,
  className,
  showExplanation = false,
}: LocationCardProps) {
  const hasCoordinates =
    location &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number';

  const mapsUrl = hasCoordinates
    ? buildGoogleMapsUrl(location.latitude, location.longitude)
    : 'https://maps.google.com';

  return (
    <Card className={cn('p-6', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <CardTitle className="text-base text-slate-100 flex items-center gap-2 font-bold tracking-wide">
            <MapPin className="w-5 h-5 text-brand-cyan" />
            <span>SHIPMENT GEOLOCATION</span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            {hasCoordinates ? '📍 GPS Location Available' : 'Location coordinates awaiting sync'}
          </p>
        </div>

        {onGetLocation && (
          <button
            type="button"
            onClick={onGetLocation}
            disabled={isLoading || isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 active:scale-95 border border-navy-600 text-xs font-semibold text-brand-teal transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', (isLoading || isSyncing) && 'animate-spin')} />
            <span>{isLoading ? 'Acquiring GPS...' : isSyncing ? 'Syncing RTDB...' : 'GET CURRENT LOCATION'}</span>
          </button>
        )}
      </CardHeader>

      {/* Main Coordinate Grid */}
      {hasCoordinates ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Latitude */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-750">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Latitude</span>
              <p className="text-lg font-mono font-bold text-slate-100 mt-1">{location.latitude?.toFixed(6)}° N</p>
            </div>

            {/* Longitude */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-750">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Longitude</span>
              <p className="text-lg font-mono font-bold text-slate-100 mt-1">{location.longitude?.toFixed(6)}° E</p>
            </div>

            {/* Accuracy */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-750">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GPS Precision</span>
              <p className="text-lg font-mono font-bold text-brand-cyan mt-1">
                ±{location.accuracy ?? 15} <span className="text-xs font-normal text-slate-400">meters</span>
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Compass className="w-4 h-4 text-brand-teal" />
              <span>Updated: {formatRelativeTime(location.updatedAt)}</span>
              {syncSuccess && (
                <span className="text-brand-emerald flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Synced to Firebase
                </span>
              )}
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-teal/15 hover:bg-brand-teal/25 border border-brand-teal/40 text-xs font-bold text-brand-teal transition-all shadow-sm group"
            >
              <Navigation className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>OPEN IN GOOGLE MAPS</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      ) : (
        <div className="py-8 px-4 rounded-xl border border-dashed border-navy-700 bg-navy-900/40 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-400 mb-3">
            <MapPin className="w-6 h-6 text-slate-500" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200 mb-1">LOCATION NOT AVAILABLE</h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
            No GPS fix recorded for this shipment. Click below to capture position from device browser GPS and synchronize with Firebase.
          </p>
          {onGetLocation && (
            <button
              type="button"
              onClick={onGetLocation}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 text-xs font-bold text-slate-100 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-brand-teal" />
              <span>Get Location from Device</span>
            </button>
          )}
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 19 explanation if enabled */}
      {showExplanation && (
        <div className="mt-4 pt-4 border-t border-navy-800 text-xs text-slate-400 leading-relaxed">
          <p>
            ℹ Location is obtained from the authorized tracking device&apos;s browser GPS/location service and securely synchronized to{' '}
            <code className="px-1 py-0.5 rounded bg-navy-800 text-slate-300 font-mono">/shipment/current/location</code> in Firebase Realtime Database.
          </p>
        </div>
      )}
    </Card>
  );
}
