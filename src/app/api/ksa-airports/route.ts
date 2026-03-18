import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  try {
    const airports = [
      { code: 'RUH', icao: 'OERK', name: 'Riyadh' },
      { code: 'JED', icao: 'OEJN', name: 'Jeddah' },
      { code: 'DMM', icao: 'OEDF', name: 'Dammam' },
      { code: 'MED', icao: 'OEMA', name: 'Medina' }
    ];

    if (!apiKey) {
      console.warn('[KSA Airports] AVIATIONSTACK_API_KEY missing');
      return NextResponse.json({ airports: airports.map(a => ({ ...a, status: 'OPERATIONAL', activity: 0 })) });
    }

    const results = await Promise.all(airports.map(async (apt) => {
      try {
        const resp = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&arr_icao=${apt.icao}&limit=5`, {
          next: { revalidate: 3600 }
        });

        if (resp.ok) {
          const data = await resp.json();
          const flights = data.data || [];
          
          let status = 'OPERATIONAL';
          if (flights.length < 2) status = 'LOW_TRAFFIC';
          else if (flights.length > 20) status = 'HEAVY';
          
          return { ...apt, status, activity: flights.length };
        }
      } catch (e) {
        console.error(`Failed to fetch for KSA ${apt.code}:`, e);
      }
      return { ...apt, status: 'OPERATIONAL', activity: 0 };
    }));

    return NextResponse.json({ airports: results });

  } catch (error) {
    console.error('KSA Airports Fetch failed:', error);
    return NextResponse.json({ airports: [] }, { status: 500 });
  }
}

