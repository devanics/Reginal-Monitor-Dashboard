import { NextResponse } from 'next/server';

const DAY_NIGHT_POINTS = [
  { name: 'Sun Zenith Point', lat: 23.4365, lon: 45.0, type: 'Daylight' },
  { name: 'Nadir Point', lat: -23.4365, lon: -135.0, type: 'Night' },
  { name: 'Terminator Point Alpha', lat: 0, lon: -45.0, type: 'Twilight' },
  { name: 'Terminator Point Beta', lat: 0, lon: 135.0, type: 'Twilight' }
];

export async function GET() {
  return NextResponse.json(DAY_NIGHT_POINTS);
}
