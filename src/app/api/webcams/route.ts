import { NextResponse } from 'next/server';

const WEBCAMS = [
  { id: 'tehran', name: 'Tehran Live', lat: 35.6892, lon: 51.3890, videoId: '-zGuR1qVKrU', region: 'iran' },
  { id: 'tel-aviv', name: 'Tel Aviv Live', lat: 32.0853, lon: 34.7818, videoId: 'gmtlJ_m2r5A', region: 'iran' },
  { id: 'jerusalem', name: 'Jerusalem Live', lat: 31.7683, lon: 35.2137, videoId: 'fIurYTprwzg', region: 'iran' },
  { id: 'mecca', name: 'Mecca Grand Mosque', lat: 21.4225, lon: 39.8262, videoId: 'Cm1v4bteXbI', region: 'middle-east' },
  { id: 'kyiv', name: 'Kyiv Skyline', lat: 50.4501, lon: 30.5234, videoId: '-Q7FuPINDjA', region: 'europe' },
  { id: 'washington', name: 'Washington DC', lat: 38.9072, lon: -77.0369, videoId: '1wV9lLe14aU', region: 'americas' },
  { id: 'taipei', name: 'Taipei 101', lat: 25.0330, lon: 121.5654, videoId: 'z_fY1pj1VBw', region: 'asia' }
];

export async function GET() {
  return NextResponse.json(WEBCAMS);
}
