import { NextResponse } from 'next/server';

const CLIMATE = [
  { name: 'Red Sea Temperature Anomaly', lat: 21.0, lon: 38.0, type: 'SEA_SURFACE_HEAT' },
  { name: 'Nile Delta Salinity Shift', lat: 31.2, lon: 31.5, type: 'ENVIRONMENTAL_CHANGE' },
  { name: 'Rub Al Khali Moisture Spike', lat: 20.0, lon: 50.0, type: 'PRECIPITATION_ANOMALY' }
];

export async function GET() {
  return NextResponse.json(CLIMATE);
}
