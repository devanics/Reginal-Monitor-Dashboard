import { NextResponse } from 'next/server';

// ========================================================================
// Iran Attacks API Route (GeoJSON for Map)
// ========================================================================

const IRAN_ATTACKS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [52.0, 27.0]
      },
      properties: {
        name: 'Asaluyeh Facility Security Zone',
        type: 'SECURITY_ALERT',
        date: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [56.2761, 27.1833]
      },
      properties: {
        name: 'Bandar Abbas Naval Proximity',
        type: 'NAVAL_ACTIVITY',
        date: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [50.8400, 28.9231]
      },
      properties: {
        name: 'Bushehr Monitoring Zone',
        type: 'STRATEGIC_SURVEILLANCE',
        date: new Date().toISOString()
      }
    }
  ]
};

export async function GET() {
  try {
    return NextResponse.json(IRAN_ATTACKS);
  } catch (error) {
    console.error('Iran Attacks API Error:', error);
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 500 });
  }
}
