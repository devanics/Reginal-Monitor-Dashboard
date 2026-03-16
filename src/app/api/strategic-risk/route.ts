import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Strategic Risk API Route
// ========================================================================

const BASELINE_RISK: Record<string, number> = {
  US: 5, RU: 35, CN: 25, UA: 50, IR: 40, IL: 45, TW: 30, KP: 45,
  SA: 20, TR: 25, PL: 10, DE: 5, FR: 10, GB: 5, IN: 20, PK: 35,
  SY: 50, YE: 50, MM: 45, VE: 40, CU: 45, MX: 35, BR: 15, AE: 10,
};

const EVENT_MULTIPLIER: Record<string, number> = {
  US: 0.3, RU: 2.0, CN: 2.5, UA: 0.8, IR: 2.0, IL: 0.7, TW: 1.5, KP: 3.0,
  SA: 2.0, TR: 1.2, PL: 0.8, DE: 0.5, FR: 0.6, GB: 0.5, IN: 0.8, PK: 1.5,
  SY: 0.7, YE: 0.7, MM: 1.8, VE: 1.8, CU: 2.0, MX: 1.0, BR: 0.6, AE: 1.5,
};

export async function GET() {
  const acledToken = process.env.ACLED_ACCESS_TOKEN;

  if (!acledToken) {
    // Fallback to "educated" mock data if no token
    const mockScores = Object.entries(BASELINE_RISK).map(([code, baseline]) => {
      const dynamic = Math.floor(Math.random() * 20) - 5; // -5 to +15
      const score = Math.min(100, Math.max(0, baseline + dynamic));
      return {
        region: code,
        score,
        level: score >= 70 ? 'CRITICAL' : (score >= 40 ? 'ELEVATED' : 'NORMAL'),
        trend: 'Stable'
      };
    }).sort((a, b) => b.score - a.score);

    const top5 = mockScores.slice(0, 5);
    const globalScore = Math.round(top5.reduce((sum, s) => sum + s.score, 0) / top5.length);

    return NextResponse.json({
      global: {
        score: globalScore,
        level: globalScore >= 60 ? 'CRITICAL' : (globalScore >= 40 ? 'ELEVATED' : 'NORMAL'),
        trend: 'Stable'
      },
      regional: mockScores
    });
  }

  try {
    // Real ACLED Fetch (Simplified for Demo/Implementation)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const acledUrl = `https://api.acleddata.com/acled/read?key=${acledToken}&email=${process.env.ACLED_EMAIL}&start_date=${startDate}&end_date=${endDate}&limit=500`;
    
    const resp = await fetch(acledUrl);
    const data = await resp.json();
    
    // Process ACLED events into scores...
    // (Simplified logic for now, using baseline + acled density)
    const eventCounts: Record<string, number> = {};
    (data.data || []).forEach((ev: any) => {
      const code = ev.iso2; // ACLED provides iso codes
      if (code) {
        eventCounts[code] = (eventCounts[code] || 0) + 1;
      }
    });

    const regional = Object.entries(BASELINE_RISK).map(([code, baseline]) => {
      const events = eventCounts[code] || 0;
      const multiplier = EVENT_MULTIPLIER[code] || 1.0;
      const dynamic = Math.min(40, Math.round(Math.sqrt(events) * 5 * multiplier));
      const score = Math.min(100, baseline + dynamic);
      
      return {
        region: code,
        score,
        level: score >= 70 ? 'CRITICAL' : (score >= 40 ? 'ELEVATED' : 'NORMAL'),
        trend: dynamic > 10 ? 'Rising' : 'Stable'
      };
    }).sort((a, b) => b.score - a.score);

    const top5 = regional.slice(0, 5);
    const globalScore = Math.round(top5.reduce((sum, s) => sum + s.score, 0) / top5.length);

    return NextResponse.json({
      global: {
        score: globalScore,
        level: globalScore >= 60 ? 'CRITICAL' : (globalScore >= 40 ? 'ELEVATED' : 'NORMAL'),
        trend: 'Stable'
      },
      regional
    });

  } catch (error) {
    console.error('ACLED Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch real-time risk data' }, { status: 500 });
  }
}
