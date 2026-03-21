import { NextResponse } from 'next/server';

const TRADE_ROUTES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[43.5, 12.5], [39.0, 20.0], [32.5, 29.9]]
      },
      properties: { name: 'Main Red Sea Route', volume: 'HIGH' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[56.0, 26.5], [54.0, 25.0], [50.5, 26.3]]
      },
      properties: { name: 'Gulf Energy Route', volume: 'V.HIGH' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(TRADE_ROUTES);
}
