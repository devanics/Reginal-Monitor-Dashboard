import { NextResponse } from 'next/server';

const UCDP_EVENTS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [35.5, 33.0]
      },
      properties: { name: 'Upper Galilee Border Incident', casualties: 2, type: 'ARMED_CONFLICT' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [45.0, 13.0]
      },
      properties: { name: 'Bab-el-Mandeb Drone Interception', casualties: 0, type: 'MILITARY_ENGAGEMENT' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(UCDP_EVENTS);
}
