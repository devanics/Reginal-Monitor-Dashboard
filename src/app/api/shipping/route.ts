import { NextRequest, NextResponse } from 'next/server';

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
    const vessels = [
      { name: 'Maersk Hangzhou', lat: 12.5, lon: 43.5, type: 'Container' },
      { name: 'MV Cheshire', lat: 14.2, lon: 42.1, type: 'Bulk Carrier' },
      { name: 'Stoll Neptune', lat: 25.4, lon: 54.2, type: 'Tanker' },
      { name: 'Hyundai Pride', lat: 26.8, lon: 51.5, type: 'Container' },
      { name: 'Cosco Shipping Rose', lat: 20.5, lon: 39.2, type: 'Container' }
    ];

    return NextResponse.json({
      type: 'FeatureCollection',
      features: vessels.map(v => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [v.lon, v.lat]
        },
        properties: {
          name: v.name,
          type: v.type,
          status: 'In Transit'
        }
      }))
    });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'FRED_API_KEY not configured' }, { status: 500 });
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
    return NextResponse.json({ error: 'Failed to fetch shipping rates' }, { status: 500 });
  }
}
