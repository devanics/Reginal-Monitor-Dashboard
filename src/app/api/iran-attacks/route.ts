import { NextResponse } from 'next/server';

// ========================================================================
// Iran Security API Route (UCDP Real-Time Feed)
// ========================================================================

const UCDP_GED_URL = 'https://ucdpapi.pcr.uu.se/api/gedevents/24.1?pagesize=50&Country=630';

// Strategic Static Points to complement dynamic events
const STRATEGIC_POINTS = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [50.8400, 28.9231] },
    properties: { name: 'Bushehr Nuclear Plant Monitoring', type: 'STRATEGIC_ZONE', date: new Date().toISOString() }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [51.7667, 35.5167] },
    properties: { name: 'Parchin Military Complex', type: 'SECURITY_ZONE', date: new Date().toISOString() }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [51.3134, 35.6892] },
    properties: { name: 'Mehrabad Strategic Node', type: 'INFRASTRUCTURE', date: new Date().toISOString() }
  }
];

export async function GET() {
  try {
    const resp = await fetch(UCDP_GED_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!resp.ok) throw new Error(`UCDP API error: ${resp.status}`);

    const data = await resp.json();
    const gedEvents = data.Result || [];

    const features = gedEvents.map((e: any) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.longitude, e.latitude]
      },
      properties: {
        name: e.short_name || `${e.side_a} vs ${e.side_b}`,
        type: 'CONFLICT_EVENT',
        date: e.date_start,
        deaths: e.deaths_best,
        source: e.source_headline
      }
    }));

    // Combine real events with strategic static monitoring points
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [...features, ...STRATEGIC_POINTS]
    });
  } catch (error) {
    console.error('Iran Security API Error:', error);
    // Fallback to strategic points only if API fails
    return NextResponse.json({
      type: 'FeatureCollection',
      features: STRATEGIC_POINTS
    });
  }
}
