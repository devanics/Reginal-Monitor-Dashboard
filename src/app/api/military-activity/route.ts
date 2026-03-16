import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Military Activity API Route (GeoJSON for Map)
// ========================================================================

const KSA_BOUNDS = { lamin: 16, lamax: 32, lomin: 34, lomax: 56 };

function isMilitary(callsign: string): boolean {
  if (!callsign) return false;
  const militaryPrefixes = ['RCH', 'CNV', 'MC', 'K35R', 'RRR', 'ASY', 'CFC', 'BAF', 'GAF', 'IAM'];
  return militaryPrefixes.some(p => callsign.startsWith(p));
}

export async function GET() {
  const username = process.env.OPENSKY_USERNAME;
  const password = process.env.OPENSKY_PASSWORD;
  const auth = username && password ? `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` : null;

  try {
    const resp = await fetch('https://opensky-network.org/api/states/all', {
      headers: auth ? { Authorization: auth } : {},
      next: { revalidate: 60 }
    });

    if (!resp.ok) throw new Error('OpenSky API Error');

    const data = await resp.json();
    const states = data.states || [];

    const features = states.filter((s: any[]) => {
      const lat = s[6];
      const lon = s[5];
      const callsign = (s[1] || '').trim();
      return (
        lat >= KSA_BOUNDS.lamin && lat <= KSA_BOUNDS.lamax &&
        lon >= KSA_BOUNDS.lomin && lon <= KSA_BOUNDS.lomax &&
        isMilitary(callsign)
      );
    }).map((s: any[]) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [s[5], s[6]]
      },
      properties: {
        callsign: s[1]?.trim() || 'UNKNOWN',
        altitude: s[7],
        velocity: s[9],
        type: 'MILITARY_AIRCRAFT'
      }
    }));

    return NextResponse.json({
      type: 'FeatureCollection',
      features
    });

  } catch (error) {
    console.error('Military Activity Fetch Error:', error);
    // Return empty collection on failure instead of error to keep map stable
    return NextResponse.json({
      type: 'FeatureCollection',
      features: []
    });
  }
}
