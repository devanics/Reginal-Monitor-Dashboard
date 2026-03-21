import { NextResponse } from 'next/server';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// Expanded Country Centers for Outage Mapping
const COUNTRY_COORDS: Record<string, [number, number]> = {
  'US': [37.0902, -95.7129], 'CN': [35.8617, 104.1954], 'RU': [61.5240, 105.3188],
  'IR': [32.4279, 53.6880], 'SA': [23.8859, 45.0792], 'UA': [48.3794, 31.1656],
  'BR': [-14.2350, -51.9253], 'IN': [20.5937, 78.9629], 'PK': [30.3753, 69.3451],
  'EG': [26.8206, 30.8025], 'TR': [38.9637, 35.2433], 'SD': [12.8628, 30.2176],
  'CA': [56.1304, -106.3468], 'GB': [55.3781, -3.4360], 'FR': [46.2276, 2.2137],
  'DE': [51.1657, 10.4515], 'JP': [36.2048, 138.2529], 'AU': [-25.2744, 133.7751],
  'SD_NORTH': [19.0, 30.0], 'PS_GAZA': [31.5, 34.4], 'PS_WEST': [32.0, 35.2],
  'ET': [9.145, 40.4896], 'MM': [21.9162, 95.9560], 'NG': [9.0820, 8.6753],
  'CD': [-4.0383, 21.7587], 'AF': [33.9391, 67.7100], 'YE': [15.5527, 48.5164]
};

const SAMPLE_OUTAGES = [
  { id: 'f-outage-sd', name: 'Critical Grid Disruption: Sudan', lat: 15.5007, lon: 32.5599, type: 'NETWORK_OUTAGE', severity: 0.95, source: 'Intel Baseline' },
  { id: 'f-outage-gz', name: 'Infrastructure blackout: Gaza Strip', lat: 31.4, lon: 34.4, type: 'NETWORK_OUTAGE', severity: 0.98, source: 'Intel Baseline' },
  { id: 'f-outage-ua', name: 'Energy Grid Instability: Kharkiv', lat: 49.9935, lon: 36.2304, type: 'NETWORK_OUTAGE', severity: 0.85, source: 'Intel Baseline' },
  { id: 'f-outage-mm', name: 'Regional Blackout: Rakhine State', lat: 20.1500, lon: 93.0000, type: 'NETWORK_OUTAGE', severity: 0.75, source: 'Intel Baseline' }
];

async function fetchOutages() {
  const activeOutages = [...SAMPLE_OUTAGES];

  if (CLOUDFLARE_API_TOKEN) {
    const url = `https://api.cloudflare.com/client/v4/radar/net-outages/top/locations?limit=15&dateRange=24h`;
    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 }
      });
      
      if (res.ok) {
        const data = await res.json();
        const locations = data.result?.locations || [];
        locations.forEach((loc: any) => {
          const coords = COUNTRY_COORDS[loc.clientCountryAlpha2];
          if (coords) {
            activeOutages.push({
              id: `outage-${loc.clientCountryAlpha2}`,
              name: `Cloudflare Radar: ${loc.clientCountryAlpha2}`,
              lat: coords[0],
              lon: coords[1],
              type: 'NETWORK_OUTAGE',
              severity: loc.score || 0.5,
              source: 'Cloudflare Radar'
            });
          }
        });
      }
    } catch (error) {
      console.error('Cloudflare Radar API Error:', error);
    }
  }

  return activeOutages;
}

export async function GET() {
  const outages = await fetchOutages();
  return NextResponse.json(outages);
}
