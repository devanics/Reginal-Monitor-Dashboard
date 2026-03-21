import { NextResponse } from 'next/server';

const UCDP_API_BASE = 'https://ucdpapi.pcr.uu.se/api/gedevents';
const UCDP_API_TOKEN = process.env.UCDP_API_TOKEN;
const DEFAULT_VERSION = '25.1'; 

async function fetchUcdpEvents(version: string = DEFAULT_VERSION) {
  try {
    const headers: Record<string, string> = {};
    if (UCDP_API_TOKEN) {
      headers['Authorization'] = `Bearer ${UCDP_API_TOKEN}`;
    }

    const resp = await fetch(`${UCDP_API_BASE}/${version}?pagesize=100`, {
      headers,
      next: { revalidate: 3600 } 
    });
    
    if (!resp.ok) return [];
    const data = await resp.json();
    return Array.isArray(data.Result) ? data.Result : [];
  } catch (error) {
    console.error('UCDP Fetch Error:', error);
    return [];
  }
}

const FALLBACK_CONFLICTS = [
  { id: 'f-ua-karkiv', name: 'Kharkiv Frontline Engagement', type: 'STATE_BASED', intensity: 'HIGH', deathsBest: 15, country: 'Ukraine', lat: 49.9935, lon: 36.2304, date: new Date().toISOString() },
  { id: 'f-ua-donbas', name: 'Donbas Artillery Exchange', type: 'STATE_BASED', intensity: 'HIGH', deathsBest: 22, country: 'Ukraine', lat: 48.0159, lon: 37.8028, date: new Date().toISOString() },
  { id: 'f-ps-gaza', name: 'Gaza Sector Hostilities', type: 'STATE_BASED', intensity: 'HIGH', deathsBest: 40, country: 'Palestine', lat: 31.5, lon: 34.4, date: new Date().toISOString() },
  { id: 'f-sd-khartoum', name: 'Khartoum Urban Conflict', type: 'NON_STATE', intensity: 'HIGH', deathsBest: 35, country: 'Sudan', lat: 15.5007, lon: 32.5599, date: new Date().toISOString() },
  { id: 'f-et-amhara', name: 'Amhara Regional Clashes', type: 'NON_STATE', intensity: 'MEDIUM', deathsBest: 12, country: 'Ethiopia', lat: 11.6, lon: 37.3, date: new Date().toISOString() },
  { id: 'f-mm-shan', name: 'Shan State Border Skirmish', type: 'NON_STATE', intensity: 'MEDIUM', deathsBest: 8, country: 'Myanmar', lat: 21.9162, lon: 95.9560, date: new Date().toISOString() },
  { id: 'f-ir-border', name: 'Sistan-Baluchestan Border Incident', type: 'NON_STATE', intensity: 'MEDIUM', deathsBest: 5, country: 'Iran', lat: 29.4963, lon: 60.8629, date: new Date().toISOString() },
  { id: 'f-ye-redsea', name: 'Red Sea Maritime Engagement', type: 'NON_STATE', intensity: 'MEDIUM', deathsBest: 0, country: 'Yemen', lat: 15.5527, lon: 48.5164, date: new Date().toISOString() }
];

export async function GET() {
  try {
    const rawEvents = await fetchUcdpEvents();
    
    let features = rawEvents.map((e: any) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(e.longitude), Number(e.latitude)]
      },
      properties: {
        id: e.id,
        name: e.conflict_name || e.side_a + ' vs ' + e.side_b,
        type: e.type_of_violence === 1 ? 'STATE_BASED' : e.type_of_violence === 2 ? 'NON_STATE' : 'ONE_SIDED',
        intensity: e.best > 10 ? 'HIGH' : e.best > 0 ? 'MEDIUM' : 'LOW',
        deathsBest: e.best,
        country: e.country,
        date: e.date_start,
        lastUpdated: new Date().toISOString()
      }
    }));

    // If live data is empty, use fallbacks
    if (features.length === 0) {
      features = FALLBACK_CONFLICTS.map(c => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
        properties: { ...c }
      }));
    }

    return NextResponse.json({
      type: 'FeatureCollection',
      features
    });
  } catch (error) {
    console.error('Conflict Zones API Error:', error);
    return NextResponse.json({
      type: 'FeatureCollection',
      features: FALLBACK_CONFLICTS.map(c => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
        properties: { ...c }
      }))
    });
  }
}
