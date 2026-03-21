import { NextResponse } from 'next/server';

/**
 * Compute the solar terminator polygon (night side of the Earth).
 * Based on standard astronomical formulas.
 */
function computeNightPolygon(): [number, number][] {
  const now = new Date();
  const JD = now.getTime() / 86400000 + 2440587.5;
  const D = JD - 2451545.0; // Days since J2000.0

  // Solar mean anomaly (radians)
  const g = ((357.529 + 0.98560028 * D) % 360) * Math.PI / 180;

  // Solar ecliptic longitude (degrees)
  const q = (280.459 + 0.98564736 * D) % 360;
  const L = q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  const LRad = L * Math.PI / 180;

  // Obliquity of ecliptic (radians)
  const eRad = (23.439 - 0.00000036 * D) * Math.PI / 180;

  // Solar declination (radians)
  const decl = Math.asin(Math.sin(eRad) * Math.sin(LRad));

  // Solar right ascension (radians)
  const RA = Math.atan2(Math.cos(eRad) * Math.sin(LRad), Math.cos(LRad));

  // Greenwich Mean Sidereal Time (degrees)
  const GMST = ((18.697374558 + 24.06570982441908 * D) % 24) * 15;

  // Sub-solar longitude (degrees, normalized to [-180, 180])
  let sunLng = RA * 180 / Math.PI - GMST;
  sunLng = ((sunLng % 360) + 540) % 360 - 180;

  const tanDecl = Math.tan(decl);
  const points: [number, number][] = [];

  // Near equinox (|tanDecl| ≈ 0), the terminator is nearly a great circle
  if (Math.abs(tanDecl) < 1e-6) {
    for (let lat = -90; lat <= 90; lat += 2) points.push([sunLng + 90, lat]);
    for (let lat = 90; lat >= -90; lat -= 2) points.push([sunLng - 90, lat]);
    return points;
  }

  // Trace terminator line
  for (let lng = -180; lng <= 180; lng += 2) {
    const ha = (lng - sunLng) * Math.PI / 180;
    const lat = Math.atan(-Math.cos(ha) / tanDecl) * 180 / Math.PI;
    points.push([lng, lat]);
  }

  // Close polygon around the dark pole
  const darkPoleLat = decl > 0 ? -90 : 90;
  points.push([180, darkPoleLat]);
  points.push([-180, darkPoleLat]);

  return points;
}

export async function GET() {
  const polygon = computeNightPolygon();
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [polygon]
        },
        properties: {
          name: 'Night Region',
          type: 'ASTRONOMICAL_TERMINATOR',
          timestamp: new Date().toISOString()
        }
      }
    ]
  };

  return NextResponse.json(geojson);
}
