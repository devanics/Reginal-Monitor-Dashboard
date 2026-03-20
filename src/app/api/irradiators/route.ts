import { NextResponse } from 'next/server';

const IRRADIATORS = [
  { name: 'Riyadh Medical Sterilization Center', lat: 24.7, lon: 46.8, type: 'GAMMA_STERILIZER' },
  { name: 'Jeddah Industrial Irradiation Facility', lat: 21.5, lon: 39.3, type: 'ELECTRON_BEAM' },
  { name: 'Dubai Global Irradiation Hub', lat: 25.1, lon: 55.3, type: 'GAMMA_STERILIZER' }
];

export async function GET() {
  return NextResponse.json(IRRADIATORS);
}
