import { NextResponse } from 'next/server';

const MINERAL_SITES = [
  { name: 'KSA Gold Belt (Mahad Ad Dahab)', lat: 23.49, lon: 40.86, type: 'GOLD' },
  { name: 'Phosphate Hub (Waad Al Shimal)', lat: 31.5, lon: 39.0, type: 'PHOSPHATE' },
  { name: 'Al Ruwayyah Copper Mines', lat: 22.0, lon: 44.0, type: 'COPPER' },
  { name: 'Sudan Nubian Shield Extract', lat: 18.5, lon: 34.0, type: 'GOLD' }
];

export async function GET() {
  return NextResponse.json(MINERAL_SITES);
}
