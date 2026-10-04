# 📦 SHIPMENT HEALTH TRACKING SYSTEM

> **Real-Time IoT Monitoring for Safer Shipments**

A modern, production-grade IoT shipment monitoring web application built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Firebase Realtime Database**. Designed to monitor environmental cargo conditions (temperature, humidity, ambient light exposure, and hazardous gas/smoke) streamed live from an ESP32 hardware module during transit.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ESP32 HARDWARE NODE                  │
│                                                         │
│  ├── DHT11 Sensor  ──► Temperature & Relative Humidity  │
│  ├── BH1750 Sensor ──► Ambient Light Intensity (Lux)    │
│  ├── MQ-2 Sensor   ──► Gas / Smoke Detection (Analog/DO)│
│  └── Active Buzzer ──► Local Acoustic Gas Siren         │
└────────────────────────────┬────────────────────────────┘
                             │  Wi-Fi (JSON Payload)
                             ▼
┌─────────────────────────────────────────────────────────┐
│             FIREBASE REALTIME DATABASE                  │
│       Path: /shipment/current                           │
│       https://shipment-health-tracking-default-rtdb...  │
└────────────────────────────┬────────────────────────────┘
                             │  WebSockets / onValue() listener
                             ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS REAL-TIME DASHBOARD                │
│                                                         │
│  ├── Live Environmental Gauges & Metrics                │
│  ├── Multi-Parameter Health Calculation Engine          │
│  ├── Automated Alert Generation                         │
│  ├── Browser GPS Geonavigation & Google Maps Sync       │
│  └── Zero Mock Data • 100% Real-Time Telemetry          │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Tech Stack

- **Framework**: Next.js (App Router, Server & Client Components)
- **Language**: TypeScript with strict types
- **Styling**: Vanilla Tailwind CSS with dark navy logistics theme
- **Database**: Firebase Realtime Database (Firebase Web SDK v11)
- **Icons**: Lucide React
- **Geonavigation**: W3C Browser Geolocation API + Google Maps Navigation URL generator
- **Deployment**: Vercel-ready with zero localhost-only dependencies

---

## 🗄️ Firebase Database Schema

The ESP32 uploads live telemetry to `/shipment/current`:

```json
{
  "shipment": {
    "current": {
      "temperature": 35.4,
      "humidity": 48.2,
      "light": 145,
      "gasAnalog": 96,
      "gasDigital": 0,
      "gasStatus": "SAFE",
      "buzzer": "OFF",
      "health": "SAFE",
      "timestamp": 1728035000000,
      "deviceId": "ESP32-SHIP-01",
      "location": {
        "latitude": 23.076512,
        "longitude": 77.012345,
        "accuracy": 12,
        "updatedAt": 1728035000000
      }
    }
  }
}
```

*Note: The frontend includes dynamic field normalization and fallback logic so it works seamlessly even if the ESP32 uses alternative key aliases (e.g. `temp`, `hum`, `lux`, `gas`, `buzzer_state`).*

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCJ_jBQJmg8bIGo3R9O4nr8ZCK24fBRTgs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shipment-health-tracking.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://shipment-health-tracking-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=shipment-health-tracking
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shipment-health-tracking.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build Test
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the project on [Vercel](https://vercel.com).
3. Under **Environment Variables**, add the `NEXT_PUBLIC_FIREBASE_*` variables from `.env.local`.
4. Click **Deploy**.

---

## 📊 Configured Sensor Thresholds

| Sensor | Parameter | Normal | Warning | Critical Alert |
| :--- | :--- | :--- | :--- | :--- |
| **DHT11** | Temperature | `< 30.0 °C` | `30.0 °C - 35.0 °C` | `≥ 35.0 °C` |
| **DHT11** | Humidity | `20.0 % - 70.0 %` | `< 20%` or `> 70%` | `> 95%` |
| **BH1750** | Light Exposure | `< 500 lux` (Dark) | `≥ 500 lux` | `≥ 1000 lux` (Breach) |
| **MQ-2** | Gas / Smoke | DO Pin HIGH | `≥ 300 ADC` | DO Pin LOW / Smoke detected |
| **Heartbeat** | Link Status | `< 15s` (ONLINE) | `15s - 60s` (DELAYED) | `> 60s` (OFFLINE) |

---

## 📍 Geolocation System

- Uses the device's native browser GPS to get accurate latitude, longitude, and accuracy precision.
- Updates coordinates in Firebase at `/shipment/current/location`.
- Generates direct Google Maps route links without requiring paid Google Maps JavaScript API keys.

---

## 🛡️ Security & Privacy

- No Wi-Fi passwords, ESP32 flash keys, or admin credentials are included in the frontend code.
- Read operations are limited to `/shipment/current`.
- Realtime listener properly detaches on component unmount to eliminate memory leaks and unnecessary Firebase bandwidth consumption.
