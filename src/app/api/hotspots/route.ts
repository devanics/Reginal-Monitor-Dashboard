import { NextResponse } from 'next/server';

// ========================================================================
// Intel Hotspots API Route (Global Intelligence Hotspots)
// ========================================================================

const INTEL_HOTSPOTS = [
  {
    id: 'sahel',
    name: 'Sahel Region',
    lat: 14.0,
    lon: -1.0,
    intensity: 0.9,
    description: 'Instability, military coups, and Islamist insurgency.',
    status: 'High Tension'
  },
  {
    id: 'horn_africa',
    name: 'Horn of Africa',
    lat: 10.0,
    lon: 49.0,
    intensity: 0.85,
    description: 'Resurgent piracy and Red Sea shipping threats.',
    status: 'Critical'
  },
  {
    id: 'tehran',
    name: 'Tehran Hub',
    lat: 35.7,
    lon: 51.4,
    intensity: 0.8,
    description: 'Strategic command and regional proxy coordination.',
    status: 'Monitoring'
  },
  {
    id: 'riyadh',
    name: 'Riyadh Strategic',
    lat: 24.7136,
    lon: 46.6753,
    intensity: 0.5,
    description: 'Regional economic and political power center.',
    status: 'Stable'
  },
  {
    id: 'pak_afghan',
    name: 'Pak-Afghan Border',
    lat: 31.8,
    lon: 69.0,
    intensity: 0.75,
    description: 'Cross-border militancy and security operations.',
    status: 'Active'
  },
  {
    id: 'kyiv',
    name: 'Kyiv Theater',
    lat: 50.45,
    lon: 30.5,
    intensity: 0.95,
    description: 'High-intensity conventional conflict zone.',
    status: 'War Zone'
  },
  {
    id: 'taipei',
    name: 'Taiwan Strait',
    lat: 25.0322,
    lon: 121.5654,
    intensity: 0.7,
    description: 'Strategic chokepoint and geopolitical flashpoint.',
    status: 'Watchlist'
  },
  {
    id: 'sanaa',
    name: "Sana'a Control",
    lat: 15.3694,
    lon: 44.1910,
    intensity: 0.8,
    description: 'Houthi operations and maritime disruption center.',
    status: 'Active'
  }
];

export async function GET() {
  try {
    return NextResponse.json(INTEL_HOTSPOTS);
  } catch (error) {
    console.error('Hotspots API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
