import { NextResponse } from 'next/server';

const EONET_API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
const GDACS_API = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP';
const USGS_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';

async function fetchEonet() {
  const url = `${EONET_API_URL}?status=open&days=7`;
  const res = await fetch(url, { next: { revalidate: 1800 } }); // 30 min cache
  if (!res.ok) return [];
  const data = await res.json();
  return (data.events || []).map((e: any) => ({
    id: e.id,
    name: e.title,
    lat: e.geometry[0].coordinates[1],
    lon: e.geometry[0].coordinates[0],
    type: e.categories?.[0]?.title?.toUpperCase().replace(/ /g, '_') || 'NATURAL_EVENT',
    source: 'EONET'
  }));
}

async function fetchGdacs() {
  const res = await fetch(GDACS_API, { next: { revalidate: 1800 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features || []).filter((f: any) => f.properties.alertlevel !== 'Green').map((f: any) => ({
    id: `gdacs-${f.properties.eventid}`,
    name: f.properties.name,
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
    type: f.properties.eventtype,
    source: 'GDACS'
  }));
}

async function fetchUsgs() {
  const res = await fetch(USGS_API, { next: { revalidate: 1800 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features || []).map((f: any) => ({
    id: f.id,
    name: f.properties.title,
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
    type: 'EARTHQUAKE',
    source: 'USGS'
  }));
}

export async function GET() {
  try {
    const [eonet, gdacs, usgs] = await Promise.all([
      fetchEonet(),
      fetchGdacs(),
      fetchUsgs()
    ]);

    return NextResponse.json([...eonet, ...gdacs, ...usgs]);
  } catch (error) {
    console.error('Natural Events API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
