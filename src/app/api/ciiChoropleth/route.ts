import { NextResponse } from 'next/server';

const CII_POINTS = [
  { name: 'Saudi Arabia', lat: 24.7136, lon: 46.6753, value: 0.2, status: 'Stable' },
  { name: 'Yemen', lat: 15.3694, lon: 44.1910, value: 0.8, status: 'Critical' },
  { name: 'Iraq', lat: 33.3152, lon: 44.3661, value: 0.6, status: 'Warning' },
  { name: 'Syria', lat: 33.5138, lon: 36.2765, value: 0.9, status: 'Critical' },
  { name: 'Iran', lat: 32.4279, lon: 53.6880, value: 0.5, status: 'Caution' },
  { name: 'Israel', lat: 31.0461, lon: 34.8516, value: 0.7, status: 'Warning' }
];

export async function GET() {
  return NextResponse.json(CII_POINTS);
}
