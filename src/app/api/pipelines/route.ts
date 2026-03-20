import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Pipelines API Route (Energy Infrastructure)
// ========================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const eiaKey = process.env.EIA_API_KEY;

  const pipelines = [
    { id: 'adcop', name: 'Abu Dhabi Crude Oil Pipeline', status: 'operational', capacity: '1.5M bpd', flow: '1.3M bpd', coords: [[54.3, 24.4], [50.6, 26.2]] },
    { id: 'ewp', name: 'East-West Pipeline', status: 'operational', capacity: '5.0M bpd', flow: '4.7M bpd', coords: [[50.1, 26.3], [38.2, 24.1]] },
    { id: 'petroline', name: 'Petroline (Abqaiq-Yanbu)', status: 'operational', capacity: '4.8M bpd', flow: '4.5M bpd', coords: [[49.6, 25.9], [37.8, 24.0]] }
  ];

  if (format === 'geojson') {
    return NextResponse.json({
      type: 'FeatureCollection',
      features: pipelines.map(p => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: p.coords
        },
        properties: {
          name: p.name,
          status: p.status,
          capacity: p.capacity,
          flow: p.flow
        }
      }))
    });
  }

  return NextResponse.json({ pipelines });
}
