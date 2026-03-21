import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Strategic Posture API Route (Military Readiness & Theater Indicators)
// ========================================================================

const THEATER_META = {
  'iran-theater': { name: 'Iran Theater', shortName: 'IRAN', targetNation: 'Iran', centerLat: 31, centerLon: 47.5, bounds: { north: 42, south: 20, east: 65, west: 30 } },
  'taiwan-theater': { name: 'Taiwan Strait', shortName: 'TAIWAN', targetNation: 'Taiwan', centerLat: 24, centerLon: 122.5, bounds: { north: 30, south: 18, east: 130, west: 115 } },
  'baltic-theater': { name: 'Baltic Theater', shortName: 'BALTIC', targetNation: null, centerLat: 58.5, centerLon: 21, bounds: { north: 65, south: 52, east: 32, west: 10 } },
  'blacksea-theater': { name: 'Black Sea', shortName: 'BLACK SEA', targetNation: null, centerLat: 44, centerLon: 34, bounds: { north: 48, south: 40, east: 42, west: 26 } },
  'korea-theater': { name: 'Korean Peninsula', shortName: 'KOREA', targetNation: 'North Korea', centerLat: 38, centerLon: 128, bounds: { north: 43, south: 33, east: 132, west: 124 } },
  'south-china-sea': { name: 'South China Sea', shortName: 'SCS', targetNation: null, centerLat: 15, centerLon: 113, bounds: { north: 25, south: 5, east: 121, west: 105 } },
  'yemen-redsea-theater': { name: 'Yemen/Red Sea', shortName: 'RED SEA', targetNation: 'Yemen', centerLat: 16.5, centerLon: 43, bounds: { north: 22, south: 11, east: 54, west: 32 } },
};

function isMilitary(callsign: string): boolean {
  if (!callsign) return false;
  const militaryPrefixes = ['RCH', 'CNV', 'MC', 'K35R', 'RRR', 'ASY', 'CFC', 'BAF', 'GAF', 'IAM', 'GIP', 'KSA', 'UAE', 'HVK', 'DUKE'];
  return militaryPrefixes.some(p => callsign.startsWith(p));
}

export async function GET() {
  const username = process.env.OPENSKY_CLIENT_ID;
  const password = process.env.OPENSKY_CLIENT_SECRET;
  const auth = username && password ? `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` : null;

  try {
    const resp = await fetch('https://opensky-network.org/api/states/all', {
      headers: auth ? { Authorization: auth } : {},
      next: { revalidate: 300 } 
    });

    const data = await resp.json();
    const states = data.states || [];

    const postures = Object.entries(THEATER_META).map(([id, meta]) => {
      const theaterFlights = states.filter((s: any[]) => {
        const lat = s[6];
        const lon = s[5];
        const callsign = (s[1] || '').trim();
        return (
          lat >= meta.bounds.south && lat <= meta.bounds.north &&
          lon >= meta.bounds.west && lon <= meta.bounds.east &&
          isMilitary(callsign)
        );
      });

      const airCount = theaterFlights.length;
      // Heuristic: If air activity > 10, status Elevated. If > 30, Critical. (Adjusted for OpenSky public feed sparsity)
      const status = airCount > 25 ? 'critical' : (airCount > 5 ? 'elevated' : 'normal');

      return {
        id,
        name: meta.name,
        shortName: meta.shortName,
        status,
        air: airCount,
        naval: Math.floor(airCount * 0.4) + (status === 'critical' ? 5 : 0), // Heuristic naval tie-in
        lastUpdate: new Date().toISOString()
      };
    });

    return NextResponse.json({ postures, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Strategic Posture API Error:', error);
    return NextResponse.json({ postures: [], error: 'Failed to fetch live data' }, { status: 500 });
  }
}