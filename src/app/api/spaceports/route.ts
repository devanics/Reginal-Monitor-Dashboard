import { NextResponse } from 'next/server';

// ========================================================================
// Spaceports API Route (Scatterplot Data)
// ========================================================================

const SPACEPORTS = [
  { name: 'Semnan Space Center', lat: 35.2346, lon: 53.9210, country: 'Iran' },
  { name: 'Shahrud Missile Test Range', lat: 36.4250, lon: 55.0167, country: 'Iran' },
  { name: 'Imam Khomeini Space Center', lat: 35.2500, lon: 53.8833, country: 'Iran' },
  { name: 'Palmachim Airbase', lat: 31.8847, lon: 34.6803, country: 'Israel' },
  { name: 'Mohammed bin Rashid Space Centre', lat: 25.1542, lon: 55.4517, country: 'UAE' }
];

export async function GET() {
  try {
    return NextResponse.json(SPACEPORTS);
  } catch (error) {
    console.error('Spaceports API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
