import { NextResponse } from 'next/server';

// ========================================================================
// Nuclear Sites API Route (Scatterplot Data)
// ========================================================================

const NUCLEAR_SITES = [
  // Middle East & Intel Targets
  { id: 'bushehr', name: 'Bushehr Nuclear Power Plant', lat: 28.83, lon: 50.89, type: 'Power Plant', status: 'active', country: 'Iran' },
  { id: 'natanz', name: 'Natanz Enrichment Complex', lat: 33.72, lon: 51.73, type: 'Enrichment', status: 'active', country: 'Iran' },
  { id: 'fordow', name: 'Fordow Fuel Enrichment Plant', lat: 34.88, lon: 51.0, type: 'Enrichment', status: 'active', country: 'Iran' },
  { id: 'dimona', name: 'Dimona Research Center (Negev)', lat: 31.0, lon: 35.15, type: 'Research/Weapons', status: 'active', country: 'Israel' },
  { id: 'barakah', name: 'Barakah Nuclear Power Plant', lat: 23.95, lon: 52.19, type: 'Power Plant', status: 'active', country: 'UAE' },
  { id: 'yongbyon', name: 'Yongbyon Nuclear Scientific Research Center', lat: 39.8, lon: 125.75, type: 'Research/Weapons', status: 'active', country: 'North Korea' },
  { id: 'kahuta', name: 'Khan Research Laboratories (Kahuta)', lat: 33.59, lon: 73.40, type: 'Enrichment', status: 'active', country: 'Pakistan' },

  // Global Major Stations
  { id: 'zaporizhzhia', name: 'Zaporizhzhia NPP (Largest in Europe)', lat: 47.51, lon: 34.58, type: 'Power Plant', status: 'contested', country: 'Ukraine' },
  { id: 'gravelines', name: 'Gravelines Nuclear Power Station', lat: 51.01, lon: 2.14, type: 'Power Plant', status: 'active', country: 'France' },
  { id: 'palo_verde', name: 'Palo Verde Generating Station', lat: 33.39, lon: -112.86, type: 'Power Plant', status: 'active', country: 'USA' },
  { id: 'kori', name: 'Kori Nuclear Power Plant', lat: 35.32, lon: 129.29, type: 'Power Plant', status: 'active', country: 'South Korea' },
  { id: 'daya_bay', name: 'Daya Bay Nuclear Power Plant', lat: 22.60, lon: 114.54, type: 'Power Plant', status: 'active', country: 'China' },
  { id: 'kursk', name: 'Kursk Nuclear Power Plant', lat: 51.67, lon: 35.61, type: 'Power Plant', status: 'active', country: 'Russia' },
  { id: 'fukushima_daini', name: 'Fukushima Daini (Decommissioning)', lat: 37.32, lon: 141.03, type: 'Power Plant', status: 'inactive', country: 'Japan' },
  
  // Research & Enrichment
  { id: 'los_alamos', name: 'Los Alamos National Laboratory', lat: 35.88, lon: -106.31, type: 'Research/Weapons', status: 'active', country: 'USA' },
  { id: 'sellafield', name: 'Sellafield Nuclear Site', lat: 54.42, lon: -3.50, type: 'Enrichment/Processing', status: 'active', country: 'UK' },
  { id: 'mayak', name: 'Mayak Production Association', lat: 55.71, lon: 60.80, type: 'Enrichment/Processing', status: 'active', country: 'Russia' },
  { id: 'chernobyl', name: 'Chernobyl Exclusion Zone', lat: 51.39, lon: 30.10, type: 'Power Plant', status: 'inactive', country: 'Ukraine' }
];

export async function GET() {
  try {
    return NextResponse.json(NUCLEAR_SITES);
  } catch (error) {
    console.error('Nuclear Sites API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
