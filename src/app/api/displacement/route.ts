import { NextResponse } from 'next/server';

const DISPLACEMENT = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [36.0, 34.0]
      },
      properties: { name: 'Refugee Settlement - Bekaa', count: 50000, type: 'DISPLACEMENT' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [38.5, 36.5]
      },
      properties: { name: 'Internal Displacement Zone - Aleppo', count: 120000, type: 'IDP' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(DISPLACEMENT);
}
