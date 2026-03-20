import { NextResponse } from 'next/server';

const GPS_JAMMING = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [35.0, 32.5]
      },
      properties: { name: 'Cyprus-Israel Jamming Corridor', intensity: 'HIGH' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [44.0, 33.0]
      },
      properties: { name: 'Baghdad GNSS Spoofing Zone', intensity: 'MEDIUM' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(GPS_JAMMING);
}
