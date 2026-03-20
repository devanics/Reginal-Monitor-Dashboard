import { NextResponse } from 'next/server';

const NATURAL_EVENTS = [
  { name: 'Red Sea Seismic Anomaly', lat: 20.0, lon: 38.5, type: 'EARTHQUAKE' },
  { name: 'Desert Dust Storm - Western Province', lat: 23.0, lon: 40.0, type: 'WEATHER_EXTREME' },
  { name: 'Gulf Flooding Alert', lat: 25.5, lon: 55.0, type: 'FLOOD' }
];

export async function GET() {
  return NextResponse.json(NATURAL_EVENTS);
}
