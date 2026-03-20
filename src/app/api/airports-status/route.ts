import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';



export async function GET() {
  const now = Date.now();


  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  const airports = [
    { code: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', lat: 25.2532, lon: 55.3657 },
    { code: 'DOH', icao: 'OTHH', name: 'Hamad International Airport', lat: 25.2731, lon: 51.6081 },
    { code: 'TLV', icao: 'LLBG', name: 'Ben Gurion Airport', lat: 31.9985, lon: 34.8883 },
    { code: 'AMM', icao: 'OJAI', name: 'Queen Alia International Airport', lat: 31.7225, lon: 35.9932 },
    { code: 'BEY', icao: 'OLBA', name: 'Beirut Rafic Hariri International Airport', lat: 33.8209, lon: 35.4884 }
  ];

  if (!apiKey) {
    console.warn('[Regional Airports] AVIATIONSTACK_API_KEY missing');
    return NextResponse.json(airports.map(a => ({ ...a, status: 'UNKNOWN', activity: 0 })));
  }

  try {
    const results = await Promise.all(airports.map(async (apt) => {
      try {
        const resp = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&arr_icao=${apt.icao}&limit=5`, {
          next: { revalidate: 0 }
        });

        if (resp.ok) {
          const data = await resp.json();
          const flights = data.data || [];
          let status = 'OPERATIONAL';
          const delayed = flights.filter((f: any) => f.arrival?.delay && f.arrival.delay > 15).length;
          if (delayed > 2) status = 'DELAYS';
          else if (flights.length === 0) status = 'LOW_TRAFFIC';
          return { ...apt, status, activity: flights.length };
        }
      } catch (e) {
        console.error(`Error fetching ${apt.code}:`, e);
      }
      return { ...apt, status: 'OPERATIONAL', activity: 0 };
    }));

    return NextResponse.json(results);

  } catch (error) {
    console.error('Regional Airports Critical Failure:', error);
    return NextResponse.json(airports.map(a => ({ ...a, status: 'UNKNOWN', activity: 0 })));
  }
}

