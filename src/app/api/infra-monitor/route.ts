import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Cache for EIA data (Daily update check is enough)
let cachedInfra: any = null;
let lastInfraFetch = 0;
const INFRA_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  const now = Date.now();
  if (cachedInfra && (now - lastInfraFetch < INFRA_CACHE_DURATION)) {
    return NextResponse.json(cachedInfra);
  }

  const apiKey = process.env.EIA_API_KEY;

  if (!apiKey) {
    console.warn('[Infra Monitor] EIA_API_KEY missing');
    return NextResponse.json({ 
      status: 'STABLE',
      carbonIntensity: 450,
      fossilFuelPercentage: 92,
      lastUpdated: new Date().toISOString(),
      message: 'API Key missing'
    });
  }

  try {
    // EIA International Data V2: Electricity Generation for Saudi Arabia (SAU)
    // Activity 12: Generation, Product 2: Electricity
    const url = `https://api.eia.gov/v2/international/data?api_key=${apiKey}&data[]=value&facets[countryRegionId][]=SAU&facets[activityId][]=12&facets[productId][]=2&frequency=annual&sort[0][column]=period&sort[0][direction]=desc&length=1`;

    
    const resp = await fetch(url, { next: { revalidate: 3600 } });

    if (resp.ok) {
      const { response } = await resp.json();
      console.log("infra",response)
      const latest = response.data[0];
      
      if (!latest) throw new Error('No EIA data returned for KSA');

      const result = {
        status: 'OPERATIONAL',
        generationValue: latest.value,
        unit: latest.unitName || 'billion kilowatthours',
        period: latest.period,
        carbonIntensity: 465, // Saudi baseline avg
        fossilFuelPercentage: 98, // Saudi energy mix is approx 98% fossil/gas
        lastUpdated: new Date().toISOString()
      };

      cachedInfra = result;
      lastInfraFetch = Date.now();
      return NextResponse.json(result);
    }
    
    throw new Error(`EIA API failed with status ${resp.status}`);

  } catch (error) {
    console.error('Infra Monitor Fetch failed:', error);
    return NextResponse.json({ 
      status: 'STABLE',
      carbonIntensity: 480,
      fossilFuelPercentage: 94,
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


