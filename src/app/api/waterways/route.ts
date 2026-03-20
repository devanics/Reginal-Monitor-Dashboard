import { NextResponse } from 'next/server';

const WATERWAYS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[32.33, 31.22], [32.53, 29.93]]
      },
      properties: { name: 'Suez Canal', status: 'OPEN' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [ [56.24, 26.54], [55.88, 26.65], [55.33, 26.41] ]
      },
      properties: { name: 'Strait of Hormuz', status: 'MONITORED' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[43.5, 12.6], [43.3, 12.8]]
      },
      properties: { name: 'Bab-el-Mandeb', status: 'EXTREME_CAUTION' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(WATERWAYS);
}
