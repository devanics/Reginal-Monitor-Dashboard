import { NextResponse } from 'next/server';

// ========================================================================
// Satellite Tracking API Route (ISS Live + Orbit Simulation)
// ========================================================================

const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';

// Strategic satellites for simulation (if live data unavailable)
const STRATEGIC_SATS = [
  { id: 'ksasat-5a', name: 'KSA-SAT 5A', type: 'OBSERVATION', inclination: 98, altitude: 600, period: 96 },
  { id: 'arabsat-6a', name: 'ARABSAT-6A', type: 'COMMUNICATIONS', lat: 0, lon: 30.5, static: true }, // Geostationary
  { id: 'uae-falcon', name: 'UAE-Falcon Eye', type: 'SURVEILLANCE', inclination: 98, altitude: 611, period: 97 }
];

export async function GET() {
  try {
    const results = await Promise.allSettled([
      fetch(ISS_API, { next: { revalidate: 10 } }) // Fast revalidate for ISS
    ]);

    const activeSats: any[] = [];

    // Process ISS (Real Live Position)
    if (results[0].status === 'fulfilled' && results[0].value.ok) {
      const e = await results[0].value.json();
      activeSats.push({
        id: 'iss',
        name: 'ISS (Zarya)',
        lat: parseFloat(e.latitude),
        lon: parseFloat(e.longitude),
        type: 'STATION',
        altitude: e.altitude,
        velocity: e.velocity,
        source: 'Live'
      });
    }

    // Process Simulated Satellites (since TLE propagation is complex without lib)
    const now = Date.now() / 1000;
    STRATEGIC_SATS.forEach(sat => {
      if (sat.static) {
        activeSats.push({ ...sat, source: 'Real-World Static' });
        return;
      }

      // Simple Circular Orbit Simulation
      // angular_velocity = 2 * PI / period_minutes
      const angVel = (2 * Math.PI) / (sat.period! * 60);
      const phase = (now % (sat.period! * 60)) * angVel;
      
      const lat = Math.sin(phase) * sat.inclination!; // Not physically perfect but visualizes motion
      const lon = ((phase * 180 / Math.PI) % 360) - 180;

      activeSats.push({
        id: sat.id,
        name: sat.name,
        lat: Number.isFinite(lat) ? lat : 0,
        lon: Number.isFinite(lon) ? lon : 0,
        type: sat.type,
        source: 'Simulated Trajectory'
      });
    });

    return NextResponse.json(activeSats);
  } catch (error) {
    console.error('Satellite Tracking API Error:', error);
    return NextResponse.json(STRATEGIC_SATS.map(s => ({ ...s, source: 'Offline Fallback' })));
  }
}
