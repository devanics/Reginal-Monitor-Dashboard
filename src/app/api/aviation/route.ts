import { NextResponse } from 'next/server';

/**
 * OpenSky Network API for live flight positions
 * Note: Public access (no auth) allows fetching with a 10s wait between requests.
 * We use a bounding box for the Middle East / North Africa region to reduce payload.
 */
const OPENSKY_API = 'https://opensky-network.org/api/states/all';
const BOX = {
  lamin: 10.0,
  lomin: 20.0,
  lamax: 45.0,
  lomax: 60.0
};

async function fetchAviation() {
  const url = `${OPENSKY_API}?lamin=${BOX.lamin}&lomin=${BOX.lomin}&lamax=${BOX.lamax}&lomax=${BOX.lomax}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 60 } }); // 60s cache
    if (!res.ok) return { type: 'FeatureCollection', features: [] };

    const data = await res.json();
    const states = data.states || [];

    return {
      type: 'FeatureCollection',
      features: states.map((s: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [s[5], s[6]] // [lon, lat]
        },
        properties: {
          icao24: s[0],
          callsign: s[1]?.trim() || 'N/A',
          origin_country: s[2],
          velocity: s[9],
          altitude: s[13] || s[7],
          on_ground: s[8],
          status: s[8] ? 'On Ground' : 'In Flight',
          source: 'OpenSky'
        }
      })).filter((f: any) => f.geometry.coordinates[0] !== null)
    };
  } catch (error) {
    console.error('OpenSky API Error:', error);
    return { type: 'FeatureCollection', features: [] };
  }
}

export async function GET() {
  const data = await fetchAviation();
  return NextResponse.json(data);
}
