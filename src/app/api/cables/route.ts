import { NextResponse } from 'next/server';

// ========================================================================
// Undersea Cables API Route (Submarine Connectivity)
// ========================================================================

const CABLES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[-76.1, 36.8], [-72.4, 37.4], [-50.4, 37.9], [-23.4, 44.7], [-9.9, 46.6], [-4.5, 44.7], [-2.9, 43.3]]
      },
      properties: { id: 'marea', name: 'MAREA', owners: ['Meta', 'Microsoft', 'Telxius'], status: 'OPERATIONAL' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[39.2, 21.5], [52.9, 26.6], [53.6, 25.9], [52.7, 15.2], [32.5, 29.6], [43, 14.8], [42.1, 14.8]]
      },
      properties: { id: 'falcon', name: 'FALCON', owners: ['FLAG'], status: 'OPERATIONAL' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[8.8, 43.5], [15.3, 38.5], [9.6, 41], [14.9, 38.7], [34.77, 32.47]]
      },
      properties: { id: 'blue', name: 'BLUE', owners: ['Google', 'Sparkle'], status: 'OPERATIONAL' }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[-74, 40.1], [-50.4, 38.5], [-5.4, 49.1], [-71.1, 40.2], [-39.6, 45], [-8.1, 50.5], [-4.5, 50.8]]
      },
      properties: { id: 'apollo', name: 'APOLLO', owners: ['Vodafone'], status: 'OPERATIONAL' }
    }
  ]
};

export async function GET() {
  return NextResponse.json(CABLES);
}
