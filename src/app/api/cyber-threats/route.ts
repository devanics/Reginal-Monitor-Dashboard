import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const apiKey = process.env.OTX_API_KEY;

  const mockPulses = [
    { name: 'Riyadh Infrastructure Scan', lat: 24.7136, lon: 46.6753, indicators: 12 },
    { name: 'Jeddah Port SQLi Attempt', lat: 21.4858, lon: 39.1925, indicators: 5 },
    { name: 'Dammam Financial Sector Phishing', lat: 26.4207, lon: 50.0888, indicators: 8 }
  ];

  if (format === 'geojson') {
    return NextResponse.json({
      type: 'FeatureCollection',
      features: mockPulses.map(p => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lon, p.lat]
        },
        properties: {
          name: p.name,
          indicators: p.indicators,
          type: 'CYBER_THREAT'
        }
      }))
    });
  }

  if (!apiKey) {
    return NextResponse.json({ 
      threatLevel: 'LOW',
      pulses: mockPulses,
      message: 'API Key missing'
    });
  }

  try {
    const resp = await fetch('https://otx.alienvault.com/api/v1/search/pulses?q=Saudi Arabia', {
      headers: { 'X-OTX-API-KEY': apiKey }
    });

    if (resp.ok) {
      const data = await resp.json();
      const pulses = (data.results || []).slice(0, 5).map((p: any) => ({
        name: p.name,
        created: p.created,
        author: p.author_name,
        indicators: p.indicator_count
      }));

      return NextResponse.json({
        threatLevel: pulses.length > 0 ? 'MODERATE' : 'LOW',
        pulses: pulses
      });
    }

    throw new Error('AlienVault OTX API failed');

  } catch (error) {
    console.error('Cyber Threats Fetch failed:', error);
    return NextResponse.json({ 
      threatLevel: 'LOW',
      pulses: mockPulses
    });
  }
}
