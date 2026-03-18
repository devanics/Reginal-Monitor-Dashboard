import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';



export async function GET() {
  const now = Date.now();


  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  const airports = [
    { code: 'DXB', icao: 'OMDB', name: 'Dubai International Airport' },
{ code: 'DOH', icao: 'OTHH', name: 'Hamad International Airport' },
{ code: 'TLV', icao: 'LLBG', name: 'Ben Gurion Airport' },
{ code: 'AMM', icao: 'OJAI', name: 'Queen Alia International Airport' },
{ code: 'BEY', icao: 'OLBA', name: 'Beirut Rafic Hariri International Airport' }
  ];

  if (!apiKey) {
    console.warn('[Regional Airports] AVIATIONSTACK_API_KEY missing');
    return NextResponse.json({ airports: airports.map(a => ({ ...a, status: 'UNKNOWN', activity: 0 })) });
  }

  try {
    const results = await Promise.all(airports.map(async (apt) => {
      try {
        // Fetching arrivals for the specific KSA airport
        const resp = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&arr_icao=${apt.icao}&limit=5`, {
          next: { revalidate: 0 }
        });

        if (resp.ok) {
          const data = await resp.json();
          const flights = data.data || [];
          console.log(`[Regional Airports] ${apt.code}: ${flights.length} active arrivals`);

          let status = 'OPERATIONAL';
          // Logic: High volume or active delays can trigger status changes
          const delayed = flights.filter((f: any) => f.arrival?.delay && f.arrival.delay > 15).length;

          if (delayed > 2) status = 'DELAYS';
          else if (flights.length === 0) status = 'LOW_TRAFFIC';

          return { ...apt, status, activity: flights.length };
        } else {
          const errorText = await resp.text();
          console.error(`[Regional Airports] ${apt.code} fetch failed: ${resp.status} ${errorText}`);
        }
      } catch (e) {
        console.error(`Error fetching ${apt.code}:`, e);
      }

      return { ...apt, status: 'OPERATIONAL', activity: 0 };
    }));


    return NextResponse.json({ airports: results });

  } catch (error) {
    console.error('Regional Airports Critical Failure:', error);
    return NextResponse.json({
      airports: airports.map(a => ({ ...a, status: 'UNKNOWN', activity: 0 })),
      error: 'Critical failure'
    });
  }
}

