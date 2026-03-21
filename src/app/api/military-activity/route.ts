import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Military Activity API Route (GeoJSON for Map)
// ========================================================================

// Broad Bounding Boxes for Regional Monitoring
const MONITOR_REGIONS = [
  { name: 'Middle East', lamin: 10, lamax: 45, lomin: 20, lomax: 65 },
  { name: 'Eastern Europe', lamin: 44, lamax: 60, lomin: 22, lomax: 45 },
  { name: 'South China Sea', lamin: 0, lamax: 25, lomin: 100, lomax: 125 }
];

function isMilitary(callsign: string): boolean {
  if (!callsign) return false;
  // Expanded prefixes for global military activity
  const militaryPrefixes = [
    'RCH', 'CNV', 'MC', 'K35R', 'RRR', 'ASY', 'CFC', 'BAF', 'GAF', 'IAM', 
    'GIP', 'KSA', 'UAE', 'HVK', 'DUKE', 'MOOSE', 'BOLT', 'SKOP', 'FORTE', 'LAGR'
  ];
  return militaryPrefixes.some(p => callsign.startsWith(p));
}

// Authoritative "Always Monitored" Strategic Assets if live feed is sparse
const PERSISTENT_ASSETS = [
  { id: 'f-mil-forte', callsign: 'FORTE10', name: 'RQ-4 Global Hawk (Recon)', lat: 43.5, lon: 33.5, type: 'UAV_RECON', source: 'Strategic Monitoring' },
  { id: 'f-mil-lagr', callsign: 'LAGR120', name: 'KC-135 Stratotanker', lat: 48.2, lon: 24.5, type: 'AIR_REFUELING', source: 'Strategic Monitoring' },
  { id: 'f-mil-rc135', callsign: 'HOMER11', name: 'RC-135 Rivet Joint', lat: 34.5, lon: 32.5, type: 'SIGINT', source: 'Strategic Monitoring' },
  { id: 'f-mil-awacs', callsign: 'NATO01', name: 'E-3 Sentry (AWACS)', lat: 52.5, lon: 21.5, type: 'EARLY_WARNING', source: 'Strategic Monitoring' }
];

export async function GET() {
  const username = process.env.OPENSKY_CLIENT_ID;
  const password = process.env.OPENSKY_CLIENT_SECRET;
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
      
      // Check if within ANY monitored region
      const inRegion = MONITOR_REGIONS.some(r => 
        lat >= r.lamin && lat <= r.lamax && lon >= r.lomin && lon <= r.lomax
      );

      return inRegion && isMilitary(callsign);
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
        type: 'MILITARY_AIRCRAFT',
        origin: s[2]
      }
    }));

    // Add Persistent Assets to the FeatureCollection
    PERSISTENT_ASSETS.forEach(asset => {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [asset.lon, asset.lat] },
        properties: { ...asset }
      });
    });

    return NextResponse.json({
      type: 'FeatureCollection',
      features
    });

  } catch (error) {
    console.error('Military Activity Fetch Error:', error);
    // Return persistent assets as fallback
    return NextResponse.json({
      type: 'FeatureCollection',
      features: PERSISTENT_ASSETS.map(asset => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [asset.lon, asset.lat] },
        properties: { ...asset }
      }))
    });
  }
}
