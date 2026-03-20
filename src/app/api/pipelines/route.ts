import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Pipelines API Route (Energy Infrastructure)
// ========================================================================

const PIPELINES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[54.3, 24.4], [50.6, 26.2]]
      },
      properties: { id: 'adcop', name: 'Abu Dhabi Crude Oil Pipeline', status: 'OPERATIONAL', capacity: '1.5M bpd' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[50.1, 26.3], [38.2, 24.1]]
      },
      properties: { id: 'ewp', name: 'East-West Pipeline', status: 'OPERATIONAL', capacity: '5.0M bpd' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[49.6, 25.9], [37.8, 24.0]]
      },
      properties: { id: 'petroline', name: 'Petroline (Abqaiq-Yanbu)', status: 'OPERATIONAL', capacity: '4.8M bpd' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[52.1, 23.9], [25.1, 25.1]]
      },
      properties: { id: 'dolphin', name: 'Dolphin Gas Pipeline', status: 'OPERATIONAL', capacity: '2.0B cfpd' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[35.0, 31.0], [33.0, 32.5]]
      },
      properties: { id: 'emg', name: 'East Mediterranean Gas (EMG)', status: 'OPERATIONAL' }
    }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (format === 'geojson') {
    return NextResponse.json(PIPELINES);
  }

  // Legacy flat format fallback
  return NextResponse.json(PIPELINES.features.map(f => ({
    id: f.properties.id,
    name: f.properties.name,
    status: f.properties.status,
    coords: f.geometry.coordinates
  })));
}
