import { CHROME_UA } from './constants';

const FIRMS_SOURCES = ['VIIRS_SNPP_NRT', 'VIIRS_NOAA20_NRT', 'VIIRS_NOAA21_NRT'];

export interface FireDetection {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: string;
  detectedAt: number;
}

function parseCSV(csv: string) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const results: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim());
    if (vals.length < headers.length) continue;
    const row: any = {};
    headers.forEach((h, idx) => { row[h] = vals[idx]; });
    results.push(row);
  }
  return results;
}

export async function fetchFirms(bbox: string): Promise<FireDetection[]> {
  const apiKey = (process.env.NASA_FIRMS_API_KEY || '').trim();
  if (!apiKey) return [];

  const detections: FireDetection[] = [];

  for (const source of FIRMS_SOURCES) {
    try {
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${source}/${bbox}/1`;
      const res = await fetch(url, {
        headers: { Accept: 'text/csv', 'User-Agent': CHROME_UA },
      });
      if (!res.ok) continue;

      const csv = await res.text();
      const rows = parseCSV(csv);
      for (const row of rows) {
        detections.push({
          id: `${row.latitude}-${row.longitude}`,
          latitude: parseFloat(row.latitude) || 0,
          longitude: parseFloat(row.longitude) || 0,
          brightness: parseFloat(row.bright_ti4) || 0,
          confidence: row.confidence || 'n',
          detectedAt: new Date(row.acq_date).getTime(),
        });
      }
    } catch (err) {
      console.error(`[FIRMS] Source ${source} failed:`, err);
    }
  }

  return detections;
}
