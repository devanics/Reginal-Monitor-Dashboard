import { NextResponse } from 'next/server';

const WEATHER_ALERTS = [
  { name: 'Severe Sandstorm Alert - Northern Region', lat: 29.5, lon: 38.0, type: 'SANDSTORM' },
  { name: 'High Temperature Warning - Empty Quarter', lat: 21.0, lon: 48.0, type: 'EXTREME_HEAT' },
  { name: 'Maritime Gale Warning - Gulf of Aqaba', lat: 28.5, lon: 34.8, type: 'HIGH_WINDS' }
];

export async function GET() {
  return NextResponse.json(WEATHER_ALERTS);
}
