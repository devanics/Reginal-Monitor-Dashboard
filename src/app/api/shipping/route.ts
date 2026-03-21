import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Maritime Shipping API Route (Strategic Waterways & Ports)
// ========================================================================

const STRATEGIC_WATERWAYS = [
  { id: 'taiwan_strait', name: 'TAIWAN STRAIT', lat: 24.0, lon: 119.5, description: 'Critical shipping lane, PLA activity' },
  { id: 'malacca_strait', name: 'MALACCA STRAIT', lat: 2.5, lon: 101.5, description: 'Major oil shipping route' },
  { id: 'hormuz_strait', name: 'STRAIT OF HORMUZ', lat: 26.5, lon: 56.5, description: 'Oil chokepoint, Iran control', status: 'Elevated Monitoring' },
  { id: 'bosphorus', name: 'BOSPHORUS STRAIT', lat: 41.1, lon: 29.0, description: 'Black Sea access, Turkey control' },
  { id: 'suez', name: 'SUEZ CANAL', lat: 30.5, lon: 32.3, description: 'Europe-Asia shipping', status: 'Restricted Throughput' },
  { id: 'panama', name: 'PANAMA CANAL', lat: 9.1, lon: -79.7, description: 'Americas shipping route' },
  { id: 'gibraltar', name: 'STRAIT OF GIBRALTAR', lat: 35.9, lon: -5.6, description: 'Mediterranean access, NATO control' },
  { id: 'bab_el_mandeb', name: 'BAB EL-MANDEB', lat: 12.5, lon: 43.3, description: 'Red Sea chokepoint, Houthi attacks', status: 'High Risk' },
];

const MAJOR_PORTS = [
  { name: 'Shanghai Port', lat: 31.2222, lon: 121.4581, country: 'CN' },
  { name: 'Singapore Port', lat: 1.2902, lon: 103.8519, country: 'SG' },
  { name: 'Jebel Ali Port', lat: 25.0112, lon: 55.0617, country: 'AE' },
  { name: 'Rotterdam Port', lat: 51.9225, lon: 4.4792, country: 'NL' },
  { name: 'Busan Port', lat: 35.1796, lon: 129.0756, country: 'KR' },
  { name: 'Jeddah Islamic Port', lat: 21.4858, lon: 39.1925, country: 'SA' },
];

const FRED_API_BASE = 'https://api.stlouisfed.org/fred';
const SHIPPING_SERIES = [
  { seriesId: 'PCU483111483111', name: 'Deep Sea Freight Producer Price Index', unit: 'index' },
  { seriesId: 'TSIFRGHT', name: 'Freight Transportation Services Index', unit: 'index' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const apiKey = process.env.FRED_API_KEY;

  if (format === 'geojson') {
    const features = [
      ...STRATEGIC_WATERWAYS.map(w => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [w.lon, w.lat] },
        properties: { name: w.name, type: 'CHOKEPOINT', status: w.status || 'Normal', description: w.description }
      })),
      ...MAJOR_PORTS.map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
        properties: { name: p.name, type: 'PORT', status: 'Operational', country: p.country }
      }))
    ];

    return NextResponse.json({ type: 'FeatureCollection', features });
  }

  // Handle FRED data if no format specified
  if (!apiKey) {
    return NextResponse.json({ indices: [] }); // Silently return empty instead of error to not break UI
  }

  try {
    const results = await Promise.all(
      SHIPPING_SERIES.map(async (cfg) => {
        const params = new URLSearchParams({
          series_id: cfg.seriesId,
          api_key: apiKey,
          file_type: 'json',
          frequency: 'm',
          sort_order: 'desc',
          limit: '24',
        });

        const response = await fetch(`${FRED_API_BASE}/series/observations?${params}`, {
          next: { revalidate: 3600 }
        });

        if (!response.ok) return null;

        const data = await response.json();
        const observations = (data.observations || [])
          .map((obs: any) => {
            const value = parseFloat(obs.value);
            if (isNaN(value) || obs.value === '.') return null;
            return { date: obs.date, value };
          })
          .filter((o: any) => o !== null)
          .reverse();

        if (observations.length === 0) return null;

        const currentValue = observations[observations.length - 1].value;
        const previousValue = observations.length > 1 ? observations[observations.length - 2].value : currentValue;
        const changePct = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

        return {
          id: cfg.seriesId,
          name: cfg.name,
          currentValue,
          changePct,
          unit: cfg.unit,
          history: observations.map((o: any) => o.value),
        };
      })
    );

    return NextResponse.json({ indices: results.filter(Boolean) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ indices: [] });
  }
}
