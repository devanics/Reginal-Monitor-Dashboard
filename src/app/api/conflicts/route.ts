import { NextResponse } from 'next/server';

// ========================================================================
// Conflict Zones API Route (GeoJSON for Map)
// ========================================================================

const CONFLICT_ZONES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [34.4068, 31.4244]
      },
      properties: {
        name: 'Gaza Strip',
        type: 'ACTIVE_WARZONE',
        intensity: 'HIGH',
        lastUpdated: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [35.5018, 33.8938]
      },
      properties: {
        name: 'Southern Lebanon',
        type: 'CONFLICT_BORDER',
        intensity: 'MEDIUM',
        lastUpdated: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [42.7500, 15.3500]
      },
      properties: {
        name: 'Red Sea - Maritime Security Area',
        type: 'MARITIME_CONFLICT',
        intensity: 'HIGH',
        lastUpdated: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [38.4500, 35.1500]
      },
      properties: {
        name: 'Idlib / Northern Syria',
        type: 'ACTIVE_CONFLICT',
        intensity: 'MEDIUM',
        lastUpdated: new Date().toISOString()
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [44.3614, 33.3152]
      },
      properties: {
        name: 'Baghdad Peripheral Security Zone',
        type: 'STABILITY_RISK',
        intensity: 'LOW',
        lastUpdated: new Date().toISOString()
      }
    }
  ]
};

export async function GET() {
  try {
    return NextResponse.json(CONFLICT_ZONES);
  } catch (error) {
    console.error('Conflict Zones API Error:', error);
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 500 });
  }
}
