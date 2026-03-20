import { NextResponse } from 'next/server';

const PROTESTS = [
  { name: 'Cairo Square Gathering', lat: 30.0444, lon: 31.2357, type: 'CIVIL_DISOBEDIENCE' },
  { name: 'Amman Reform March', lat: 31.9454, lon: 35.9284, type: 'PEACEFUL_PROTEST' },
  { name: 'Beirut Port Protest', lat: 33.8938, lon: 35.5018, type: 'DEMONSTRATION' }
];

export async function GET() {
  return NextResponse.json(PROTESTS);
}
