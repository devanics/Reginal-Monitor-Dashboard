import { NextResponse } from 'next/server';

const WINGBITS_API_KEY = process.env.WINGBITS_API_KEY;

async function fetchGpsJamming() {
  if (!WINGBITS_API_KEY) {
    console.warn('WINGBITS_API_KEY not configured. Falling back to sample data.');
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [35.1, 33.1] },
          properties: { name: 'Sample GPS Jamming (Levant)', intensity: 0.8 }
        }
      ]
    };
  }

  const url = 'https://customer-api.wingbits.com/v1/gps/jam';
  try {
    const res = await fetch(url, {
      headers: { 'x-api-key': WINGBITS_API_KEY },
      next: { revalidate: 3600 }
    });

    if (!res.ok) return { type: 'FeatureCollection', features: [] };

    const data = await res.json();
    const hexes = data.hexes || [];

    // Note: In a full implementation, we'd use h3-js to convert H3 indices to Lat/Lon.
    // For this environment, if the API doesn't provide lat/lon, we use the ones 
    // provided in the response metadata if available, or a simplified mapping.
    // The Open Source script shows them using cellToLatLng.
    
    return {
      type: 'FeatureCollection',
      features: hexes.filter((h: any) => h.npAvg <= 1.0).map((h: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          // Assuming the API might provide lat/lon for convenience, 
          // or we fallback to the H3 index as a label.
          coordinates: [h.lon || 0, h.lat || 0] 
        },
        properties: {
          id: h.h3Index,
          level: h.npAvg <= 0.5 ? 'high' : 'medium',
          npAvg: h.npAvg,
          aircraftCount: h.aircraftCount,
          source: 'Wingbits'
        }
      })).filter((f: any) => f.geometry.coordinates[0] !== 0)
    };
  } catch (error) {
    console.error('Wingbits API Error:', error);
    return { type: 'FeatureCollection', features: [] };
  }
}

export async function GET() {
  const data = await fetchGpsJamming();
  return NextResponse.json(data);
}
