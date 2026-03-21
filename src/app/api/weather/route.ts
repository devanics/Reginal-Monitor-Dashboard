import { NextResponse } from 'next/server';

// ========================================================================
// Weather Alerts API Route (NWS + GDACS Real-Time Feed)
// ========================================================================

const NWS_API = 'https://api.weather.gov/alerts/active';
const GDACS_API = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/geojson?eventtypes=TC,FL,ST'; // TC=Cyclone, FL=Flood, ST=Storm

export async function GET() {
  try {
    const results = await Promise.allSettled([
      fetch(NWS_API, { headers: { 'User-Agent': 'WorldMonitorDashboard/1.0' }, next: { revalidate: 900 } }),
      fetch(GDACS_API, { next: { revalidate: 900 } })
    ]);

    const weatherAlerts: any[] = [];

    // Process NWS (US)
    if (results[0].status === 'fulfilled' && results[0].value.ok) {
      const data = await results[0].value.json();
      const features = data.features || [];
      features.slice(0, 30).forEach((f: any) => {
        const p = f.properties;
        const coords = f.geometry?.coordinates;
        if (coords) {
          // Geometry can be complex (Polygon), we just want a point for the scatterplot
          let lat = 0, lon = 0;
          if (f.geometry.type === 'Point') {
            [lon, lat] = coords;
          } else if (f.geometry.type === 'Polygon') {
            // Simple centroid approximation
            const ring = coords[0];
            lon = ring.reduce((sum: number, c: number[]) => sum + c[0], 0) / ring.length;
            lat = ring.reduce((sum: number, c: number[]) => sum + c[1], 0) / ring.length;
          }
          
          if (lat && lon) {
            weatherAlerts.push({
              id: f.id,
              name: p.event,
              description: p.headline,
              lat,
              lon,
              type: p.severity,
              severity: p.severity,
              source: 'NWS'
            });
          }
        }
      });
    }

    // Process GDACS (Global Storms/Floods)
    if (results[1].status === 'fulfilled' && results[1].value.ok) {
      const data = await results[1].value.json();
      const features = data.features || [];
      features.forEach((f: any) => {
        const p = f.properties;
        const [lon, lat] = f.geometry.coordinates;
        weatherAlerts.push({
          id: `gdacs-${p.eventid}`,
          name: p.eventname,
          description: p.description,
          lat,
          lon,
          type: p.eventtype,
          severity: p.severitylevel,
          source: 'GDACS'
        });
      });
    }

    // Map fallbacks if empty (though usually GDACS has something)
    if (weatherAlerts.length === 0) {
      weatherAlerts.push({ name: 'Active Regional Monitoring (No Alerts)', lat: 24.7136, lon: 46.6753, type: 'status' });
    }

    return NextResponse.json(weatherAlerts);
  } catch (error) {
    console.error('Weather Alerts API Error:', error);
    return NextResponse.json([
      { name: 'Weather Monitoring Service (Offline)', lat: 24.7136, lon: 46.6753, type: 'error' }
    ]);
  }
}
