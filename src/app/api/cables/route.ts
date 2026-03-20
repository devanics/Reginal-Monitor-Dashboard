import { NextResponse } from 'next/server';

const CABLES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[34.4, 28.0], [39.0, 21.0], [43.0, 12.0]]
      },
      properties: { name: 'SEA-ME-WE 5', status: 'operational' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[56.0, 26.0], [52.0, 24.0], [50.0, 26.0]]
      },
      properties: { name: 'EIG (Europe India Gateway)', status: 'maintenance' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(CABLES);
}
