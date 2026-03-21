import { NextResponse } from 'next/server';

const DATACENTERS = [
  { name: 'Riyadh Core-1', lat: 24.7136, lon: 46.6753, type: 'TIER-4' },
  { name: 'Jeddah Coastal Hub', lat: 21.4858, lon: 39.1925, type: 'TIER-3' },
  { name: 'NEOM Edge Node', lat: 28.33, lon: 34.83, type: 'TIER-4' },
  { name: 'Dubai Internet City', lat: 25.10, lon: 55.15, type: 'TIER-4' }
];

export async function GET() {
  return NextResponse.json(DATACENTERS);
}
