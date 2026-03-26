import { NextResponse } from 'next/server';

// ========================================================================
// Country Instability Index (CII) Scores API
// ========================================================================

// Baseline Risk Constants (aligned with Intelligence API)
const BASELINE_RISK: Record<string, number> = {
  US: 5, RU: 35, CN: 25, UA: 50, IR: 40, IL: 45, TW: 30, KP: 45,
  SA: 20, TR: 25, PL: 10, DE: 5, FR: 10, GB: 5, IN: 20, PK: 35,
  SY: 50, YE: 50, MM: 45, VE: 40, CU: 45, MX: 35, BR: 15, AE: 10,
  BH: 15, OM: 10, QA: 12, KW: 15
};

const BASE_CII = Object.entries(BASELINE_RISK).map(([code, score]) => {
  let level: 'low' | 'normal' | 'elevated' | 'high' | 'critical' = 'low';
  if (score >= 70) level = 'critical';
  else if (score >= 55) level = 'high';
  else if (score >= 40) level = 'elevated';
  else if (score >= 25) level = 'normal';

  return {
    code,
    name: code === 'SA' ? 'Saudi Arabia' : code, // Expansion logic can be added
    score,
    level,
    trend: 'stable'
  };
});

export async function GET() {
  try {
    // In a real production setup, we'd fetch GDELT/ACLED counts for each country 
    // and blend them with static risk metrics. For this implementation, we 
    // provide the baseline scores which are informed by recent real-world events.
    return NextResponse.json(BASE_CII);
  } catch (error) {
    console.error('CII API Error:', error);
    return NextResponse.json(BASE_CII); // Fallback to baseline
  }
}
