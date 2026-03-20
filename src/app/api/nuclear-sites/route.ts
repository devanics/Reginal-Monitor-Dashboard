import { NextResponse } from 'next/server';

// ========================================================================
// Nuclear Sites API Route (Scatterplot Data)
// ========================================================================

const NUCLEAR_SITES = [
  { name: 'Bushehr Nuclear Power Plant', lat: 28.8231, lon: 50.8888, country: 'Iran' },
  { name: 'Natanz Enrichment Complex', lat: 33.7231, lon: 51.7231, country: 'Iran' },
  { name: 'Fordo Enrichment Plant', lat: 34.1925, lon: 50.9231, country: 'Iran' },
  { name: 'Arak Heavy Water Plant', lat: 34.0833, lon: 49.6833, country: 'Iran' },
  { name: 'Barakah Nuclear Power Plant', lat: 23.9789, lon: 52.2356, country: 'UAE' },
  { name: 'Dimona Research Center', lat: 31.0000, lon: 35.1500, country: 'Israel' }
];

export async function GET() {
  try {
    return NextResponse.json(NUCLEAR_SITES);
  } catch (error) {
    console.error('Nuclear Sites API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
