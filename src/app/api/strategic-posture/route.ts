import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Strategic Posture API Route (Military Flights)
// ========================================================================

const THEATERS = [
  { id: 'baltic', name: 'Baltic Theater', bounds: { lamin: 52, lamax: 65, lomin: 10, lomax: 32 }, thresholds: { elevated: 50, critical: 150 } },
  { id: 'black-sea', name: 'Black Sea', bounds: { lamin: 40, lamax: 48, lomin: 26, lomax: 42 }, thresholds: { elevated: 2, critical: 5 } },
  { id: 'south-china-sea', name: 'South China Sea', bounds: { lamin: 5, lamax: 25, lomin: 105, lomax: 121 }, thresholds: { elevated: 30, critical: 80 } },
  { id: 'red-sea', name: 'Red Sea', bounds: { lamin: 11, lamax: 22, lomin: 32, lomax: 54 }, thresholds: { elevated: 10, critical: 30 } },
  { id: 'persian-gulf', name: 'Persian Gulf', bounds: { lamin: 24, lamax: 30, lomin: 48, lomax: 56 }, thresholds: { elevated: 15, critical: 40 } },
];

function isMilitary(callsign: string): boolean {
  if (!callsign) return false;
  const militaryPrefixes = ['RCH', 'CNV', 'MC', 'K35R', 'RRR', 'ASY', 'CFC', 'BAF', 'GAF', 'IAM'];
  return militaryPrefixes.some(p => callsign.startsWith(p));
}

export async function GET() {
  const username = process.env.OPENSKY_USERNAME;
  const password = process.env.OPENSKY_PASSWORD;

  // If no auth, we can still try unauthenticated with lower rate limits
  const auth = username && password ? `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` : null;

  try {
    const resp = await fetch('https://opensky-network.org/api/states/all', {
      headers: auth ? { Authorization: auth } : {},
      next: { revalidate: 300 } // Cache for 5 mins
    });

    if (!resp.ok) throw new Error('OpenSky API Error');

    const data = await resp.json();
    const states = data.states || [];

    const postures = THEATERS.map(theater => {
      const theaterFlights = states.filter((s: any[]) => {
        const lat = s[6];
        const lon = s[5];
        const callsign = (s[1] || '').trim();
        return (
          lat >= theater.bounds.lamin && lat <= theater.bounds.lamax &&
          lon >= theater.bounds.lomin && lon <= theater.bounds.lomax &&
          isMilitary(callsign)
        );
      });

      const count = theaterFlights.length;
      const status = count >= theater.thresholds.critical ? 'critical' : (count >= theater.thresholds.elevated ? 'elevated' : 'normal');

      return {
        id: theater.id,
        name: theater.name,
        status,
        air: count,
        naval: Math.floor(count * 0.5) // Mocking naval for now as AIS is harder to aggregate
      };
    });

    return NextResponse.json({ postures, timestamp: new Date().toISOString() });

  } catch (error) {
    console.error('Strategic Posture Fetch Error:', error);
    // Return mock fallback on failure
    const mockPostures = THEATERS.map(t => ({
      ...t,
      status: 'normal',
      air: Math.floor(Math.random() * 10),
      naval: Math.floor(Math.random() * 5)
    }));
    return NextResponse.json({ postures: mockPostures, error: 'Using fallback data', timestamp: new Date().toISOString() });
  }
}
