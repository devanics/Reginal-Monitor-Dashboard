import { NextResponse } from 'next/server';

const SATELLITES = [
  { name: 'KSA-SAT 5A', lat: 24.0, lon: 45.0, type: 'OBSERVATION' },
  { name: 'ARABSAT-6A', lat: 0.0, lon: 30.5, type: 'COMMUNICATIONS' },
  { name: 'UAE-Falcon Eye', lat: 25.0, lon: 55.0, type: 'SURVEILLANCE' }
];

export async function GET() {
  return NextResponse.json(SATELLITES);
}
