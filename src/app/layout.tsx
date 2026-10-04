import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'SHIPMENT HEALTH | IoT Shipment Monitoring Platform',
  description:
    'Real-Time IoT Shipment Health Tracking and Monitoring Platform powered by ESP32, DHT11, BH1750, MQ-2, Active Buzzer and Firebase Realtime Database.',
  keywords: [
    'Shipment Tracking',
    'IoT Monitoring',
    'ESP32',
    'Firebase Authentication',
    'Firebase Realtime Database',
    'DHT11',
    'MQ-2 Gas Sensor',
    'BH1750 Light Sensor',
  ],
  authors: [{ name: 'IoT Research Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-slate-100 min-h-screen antialiased selection:bg-brand-teal selection:text-navy-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
