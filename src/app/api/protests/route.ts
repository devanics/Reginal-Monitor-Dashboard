import { NextResponse } from 'next/server';

// ========================================================================
// Protests API Route (GDELT Real-Time Feed)
// ========================================================================

const GDELT_GKG_URL = 'https://api.gdeltproject.org/api/v1/gkg_geojson';

function classifyGdeltSeverity(count: number, name: string) {
  const lowerName = name.toLowerCase();
  if (count > 100 || lowerName.includes('riot') || lowerName.includes('clash')) return 'high';
  if (count < 25) return 'low';
  return 'medium';
}

function classifyGdeltEventType(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('riot')) return 'riot';
  if (lowerName.includes('strike')) return 'strike';
  if (lowerName.includes('demonstration')) return 'demonstration';
  return 'protest';
}

export async function GET() {
  try {
    const params = new URLSearchParams({
      query: 'protest OR riot OR demonstration OR strike',
      maxrows: '500', // Reduced for performance in a single request
    });

    const resp = await fetch(`${GDELT_GKG_URL}?${params}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!resp.ok) throw new Error(`GDELT API error: ${resp.status}`);

    const data = await resp.json();
    const features = data?.features || [];

    // Aggregate by location
    const locationMap = new Map<string, any>();
    for (const feature of features) {
      const name = feature.properties?.name || '';
      if (!name) continue;

      const coords = feature.geometry?.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) continue;

      const [lon, lat] = coords;
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;

      // Group nearby points
      const key = `${lat.toFixed(1)}:${lon.toFixed(1)}`;
      const existing = locationMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        locationMap.set(key, { name, lat, lon, count: 1 });
      }
    }

    const events = [];
    for (const loc of locationMap.values()) {
      // Only show significant clusters for protests to avoid clutter
      if (loc.count < 3) continue;

      const country = loc.name.split(',').pop()?.trim() || loc.name;
      events.push({
        id: `gdelt-${loc.lat.toFixed(2)}-${loc.lon.toFixed(2)}-${Date.now()}`,
        name: `${loc.name} (${loc.count} reports)`,
        lat: loc.lat,
        lon: loc.lon,
        type: classifyGdeltEventType(loc.name),
        severity: classifyGdeltSeverity(loc.count, loc.name),
        country,
        count: loc.count
      });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Protests API Error:', error);
    // Fallback to minimal static data if API fails to ensure map doesn't break
    return NextResponse.json([
      { name: 'Cairo Square (GDELT Fallback)', lat: 30.0444, lon: 31.2357, type: 'protest', severity: 'medium' }
    ]);
  }
}
