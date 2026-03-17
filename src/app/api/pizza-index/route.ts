import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resp = await fetch('https://www.pizzint.watch/api/dashboard-data', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      next: { revalidate: 600 } // 10 minutes
    });

    if (!resp.ok) {
      throw new Error(`PizzINT API responded with ${resp.status}`);
    }

    const raw = await resp.json();
    
    if (raw.success && raw.data) {
      const locations = raw.data.map((d: any) => ({
        place_id: d.place_id,
        name: d.name,
        address: d.address,
        current_popularity: d.current_popularity,
        is_closed_now: d.is_closed_now || false,
      }));

      // Calculate DEFCON-like levels for the response
      const openLocations = locations.filter((l: any) => !l.is_closed_now);
      const avgPop = openLocations.length > 0
        ? openLocations.reduce((s: number, l: any) => s + l.current_popularity, 0) / openLocations.length
        : 0;

      let level = 5;
      let label = 'LOWEST READINESS';
      let statusText = 'FADE OUT';
      
      if (avgPop >= 85) { level = 1; label = 'MAXIMUM READINESS'; statusText = 'PIZZA TIME'; }
      else if (avgPop >= 70) { level = 2; label = 'HIGH READINESS'; statusText = 'RUSH ORDER'; }
      else if (avgPop >= 50) { level = 3; label = 'INCREASED READINESS'; statusText = 'STEADY FLOW'; }
      else if (avgPop >= 25) { level = 4; label = 'ABOVE NORMAL'; statusText = 'LATE NIGHT'; }

      return NextResponse.json({
        success: true,
        defcon: level,
        label,
        statusText,
        activity: Math.round(avgPop),
        locations
      });
    }

    throw new Error('Invalid data format from PizzINT');
  } catch (error) {
    console.error('Pizza Index API Error:', error);
    return NextResponse.json({ success: false, error: 'Unavailable' }, { status: 500 });
  }
}
