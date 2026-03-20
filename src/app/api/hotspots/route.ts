import { NextResponse } from 'next/server';

// ========================================================================
// Intel Hotspots API Route (Scatterplot Data)
// ========================================================================

const HOTSPOTS = [
  { name: 'Riyadh Diplomatic Quarter Alert', lat: 24.6750, lon: 46.6231, intensity: 0.8 },
  { name: 'Jeddah Port Security Anomaly', lat: 21.4858, lon: 39.1925, intensity: 0.6 },
  { name: 'Dammam Energy Corridor Analysis', lat: 26.4207, lon: 50.0888, intensity: 0.4 },
  { name: 'Neom Construction Perimeter', lat: 28.3300, lon: 34.8300, intensity: 0.3 },
  { name: 'Abha Regional Security Monitoring', lat: 18.2167, lon: 42.5000, intensity: 0.7 },
  { name: 'Jazan Frontier Observation', lat: 16.8892, lon: 42.5511, intensity: 0.9 }
];

export async function GET() {
  try {
    return NextResponse.json(HOTSPOTS);
  } catch (error) {
    console.error('Hotspots API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
