import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OTX_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      threatLevel: 'LOW',
      pulses: [],
      message: 'API Key missing'
    });
  }

  try {
    // Search for pulses related to Saudi Arabia
    const resp = await fetch('https://otx.alienvault.com/api/v1/search/pulses?q=Saudi Arabia', {
      headers: {
        'X-OTX-API-KEY': apiKey
      }
    });

    if (resp.ok) {
      const data = await resp.json();
      const pulses = (data.results || []).slice(0, 5).map((p: any) => ({
        name: p.name,
        created: p.created,
        author: p.author_name,
        indicators: p.indicator_count
      }));
      console.log("Pulses",pulses)

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
      pulses: []
    });
  }
}
