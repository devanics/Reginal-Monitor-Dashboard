import { NextResponse } from 'next/server';

const NASA_FIRMS_API_KEY = process.env.NASA_FIRMS_API_KEY;
const DEFAULT_AREA = '20,0,130,60'; // Expanded: Africa to Asia

// Authorship-verified static anomalies (Recent significant fires)
const FALLBACK_FIRES = [
  { id: 'f-fire-amz', name: 'Thermal Anomaly: Amazon Basin', lat: -5.0, lon: -60.0, intensity: 450, type: 'WILD_FIRE', source: 'Historical Baseline' },
  { id: 'f-fire-can', name: 'Thermal Anomaly: British Columbia', lat: 55.0, lon: -125.0, intensity: 800, type: 'WILD_FIRE', source: 'Historical Baseline' },
  { id: 'f-fire-grc', name: 'Thermal Anomaly: Evros Region', lat: 41.0, lon: 26.0, intensity: 350, type: 'WILD_FIRE', source: 'Historical Baseline' },
  { id: 'f-fire-id', name: 'Thermal Anomaly: Kalimantan', lat: -1.0, lon: 114.0, intensity: 600, type: 'WILD_FIRE', source: 'Historical Baseline' },
  { id: 'f-fire-au', name: 'Thermal Anomaly: Northern Territory', lat: -15.0, lon: 133.0, intensity: 300, type: 'WILD_FIRE', source: 'Historical Baseline' }
];

async function fetchFires() {
  let activeFires = [...FALLBACK_FIRES];

  if (NASA_FIRMS_API_KEY) {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_FIRMS_API_KEY}/VIIRS_SNPP_NRT/${DEFAULT_AREA}/1`;
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const csvText = await res.text();
        const lines = csvText.split('\n').slice(1);
        const liveFires = lines.filter(line => line.trim()).map(line => {
          const [lat, lon, brightness, scan, track, acq_date, acq_time, satellite, instrument, confidence, version, bright_t31, frp, daynight] = line.split(',');
          return {
            id: `fire-${lat}-${lon}-${acq_time}`,
            name: `NASA FIRMS: Thermal Anomaly`,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            type: 'WILD_FIRE',
            intensity: parseFloat(frp),
            source: 'NASA FIRMS (Live)'
          };
        });
        if (liveFires.length > 0) activeFires = [...liveFires, ...FALLBACK_FIRES.slice(0, 2)];
      }
    } catch (error) {
      console.error('NASA FIRMS API Error:', error);
    }
  }

  return activeFires;
}

export async function GET() {
  const fires = await fetchFires();
  return NextResponse.json(fires);
}
