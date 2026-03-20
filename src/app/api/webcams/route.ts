import { NextResponse } from 'next/server';

const WEBCAMS = [
  { name: 'Riyadh Skyline Cam', lat: 24.7136, lon: 46.6753, status: 'LIVE' },
  { name: 'Jeddah Corniche Cam', lat: 21.4858, lon: 39.1925, status: 'LIVE' },
  { name: 'Dubai Marina Overlook', lat: 25.0657, lon: 55.1403, status: 'LIVE' },
  { name: 'Manama Harbour Cam', lat: 26.2333, lon: 50.5833, status: 'LIVE' }
];

export async function GET() {
  return NextResponse.json(WEBCAMS);
}
