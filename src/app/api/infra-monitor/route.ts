import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Cache for EIA data (Daily update check is enough)
let cachedInfra: any = null;
let lastInfraFetch = 0;
const INFRA_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function fetchNgaCableAnomalies() {
  try {
    const res = await fetch('https://msi.nga.mil/api/publications/broadcast-warn?output=json&status=A', {
      next: { revalidate: 600 }
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const warnings = Array.isArray(data) ? data : (data.warnings || []);
    // Filter for cable related warnings in KSA region
    return warnings.filter((w: any) => {
      const text = (w.text || '').toUpperCase();
      return text.includes('CABLE') && (text.includes('SAUDI') || text.includes('RED SEA') || text.includes('PERSIAN GULF'));
    }).length;
  } catch {
    return 0;
  }
}

async function fetchCloudflareOutages() {
  try {
    // Proxy for Cloudflare Radar / outages - simplified for demo or if token missing
    const res = await fetch('https://api.cloudflare.com/client/v4/radar/annotations/outages?dateRange=7d&limit=10', {
       headers: process.env.CLOUDFLARE_API_TOKEN ? { 'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` } : {},
       next: { revalidate: 1800 }
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const outages = data.result?.annotations || [];
    // Filter for KSA (Saudi Arabia code is SA)
    return outages.filter((o: any) => o.locations?.includes('SA')).length;
  } catch {
    return 0;
  }
}

export async function GET() {
  const now = Date.now();
  if (cachedInfra && (now - lastInfraFetch < INFRA_CACHE_DURATION)) {
    return NextResponse.json(cachedInfra);
  }

  const apiKey = process.env.EIA_API_KEY;

  try {
    const [eiaResp, cableAnomalies, telcomOutages] = await Promise.all([
      apiKey ? fetch(`https://api.eia.gov/v2/international/data?api_key=${apiKey}&data[]=value&facets[countryRegionId][]=SAU&facets[activityId][]=12&facets[productId][]=2&frequency=annual&sort[0][column]=period&sort[0][direction]=desc&length=1`, { next: { revalidate: 3600 } }) : Promise.resolve(null),
      fetchNgaCableAnomalies(),
      fetchCloudflareOutages()
    ]);

    let generationValue = 398; // Fallback
    if (eiaResp && eiaResp.ok) {
      const { response } = await eiaResp.json();
      if (response.data?.[0]) {
        generationValue = response.data[0].value;
      }
    }

    const result = {
      status: 'OPERATIONAL',
      generationValue,
      cableAnomalies,
      telcomOutages,
      lastUpdated: new Date().toISOString()
    };

    cachedInfra = result;
    lastInfraFetch = Date.now();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Infra Monitor Fetch failed:', error);
    return NextResponse.json({ 
      status: 'STABLE',
      generationValue: 395,
      cableAnomalies: 0,
      telcomOutages: 0,
      lastUpdated: new Date().toISOString()
    });
  }
}


