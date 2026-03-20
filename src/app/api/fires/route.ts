import { NextResponse } from 'next/server';

const FIRES = [
  { name: 'Northern Israel Forest Fire', lat: 32.8, lon: 35.5, type: 'WILD_FIRE' },
  { name: 'KSA Industrial Flare Alert', lat: 26.5, lon: 49.5, type: 'INDUSTRIAL_ANOMALY' },
  { name: 'Red Sea Oil Terminal Heat Signal', lat: 22.5, lon: 39.0, type: 'THERMAL_ABNORMALITY' }
];

export async function GET() {
  return NextResponse.json(FIRES);
}
