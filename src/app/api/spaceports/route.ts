import { NextResponse } from 'next/server';

// ========================================================================
// Spaceports API Route (Global Space Centers)
// ========================================================================

const SPACEPORTS = [
  { id: 'ksc', name: 'Kennedy Space Center', lat: 28.57, lon: -80.64, country: 'USA', status: 'ACTIVE' },
  { id: 'vandenberg', name: 'Vandenberg SFB', lat: 34.74, lon: -120.57, country: 'USA', status: 'ACTIVE' },
  { id: 'boca_chica', name: 'Starbase (SpaceX)', lat: 25.99, lon: -97.15, country: 'USA', status: 'ACTIVE' },
  { id: 'baikonur', name: 'Baikonur Cosmodrome', lat: 45.96, lon: 63.30, country: 'KAZ', status: 'ACTIVE' },
  { id: 'plesetsk', name: 'Plesetsk Cosmodrome', lat: 62.92, lon: 40.57, country: 'RUS', status: 'ACTIVE' },
  { id: 'jiuquan', name: 'Jiuquan SLC', lat: 40.96, lon: 100.29, country: 'CHN', status: 'ACTIVE' },
  { id: 'kourou', name: 'Guiana Space Centre', lat: 5.23, lon: -52.76, country: 'FRA', status: 'ACTIVE' },
  { id: 'sriharikota', name: 'Satish Dhawan SC', lat: 13.72, lon: 80.23, country: 'IND', status: 'ACTIVE' },
  // Middle East Focus
  { id: 'semnan', name: 'Semnan Space Center', lat: 35.2346, lon: 53.9210, country: 'IRN', status: 'ACTIVE' },
  { id: 'imam_khomeini', name: 'Imam Khomeini Space Center', lat: 35.2500, lon: 53.8833, country: 'IRN', status: 'ACTIVE' },
  { id: 'mbrsc', name: 'Mohammed bin Rashid Space Centre', lat: 25.1542, lon: 55.4517, country: 'UAE', status: 'ACTIVE' }
];

export async function GET() {
  try {
    return NextResponse.json(SPACEPORTS);
  } catch (error) {
    console.error('Spaceports API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
