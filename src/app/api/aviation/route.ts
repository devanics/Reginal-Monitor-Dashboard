import { NextResponse } from 'next/server';

const AVIATION = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [46.7, 24.7]
      },
      properties: { callsign: 'SVA123', aircraft: 'B789', status: 'Inbound Riyadh' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [39.2, 21.5]
      },
      properties: { callsign: 'UAE456', aircraft: 'A388', status: 'Inbound Jeddah' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [55.3, 25.2]
      },
      properties: { callsign: 'KSA789', aircraft: 'B77W', status: 'Outbound Dubai' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(AVIATION);
}
