import { NextResponse } from 'next/server';

// ========================================================================
// Country Instability Index (CII) Scores API
// ========================================================================

const BASE_CII = [
  { code: 'SA', name: 'Saudi Arabia', score: 22, level: 'low', trend: 'stable' },
  { code: 'YE', name: 'Yemen', score: 94, level: 'critical', trend: 'stable' },
  { code: 'IR', name: 'Iran', score: 76, level: 'high', trend: 'rising' },
  { code: 'IL', name: 'Israel', score: 84, level: 'critical', trend: 'rising' },
  { code: 'SY', name: 'Syria', score: 91, level: 'critical', trend: 'stable' },
  { code: 'IQ', name: 'Iraq', score: 62, level: 'elevated', trend: 'falling' },
  { code: 'LB', name: 'Lebanon', score: 87, level: 'critical', trend: 'rising' },
  { code: 'JO', name: 'Jordan', score: 45, level: 'normal', trend: 'stable' },
  { code: 'EG', name: 'Egypt', score: 55, level: 'elevated', trend: 'rising' },
  { code: 'TR', name: 'Turkey', score: 50, level: 'normal', trend: 'stable' },
  { code: 'UA', name: 'Ukraine', score: 98, level: 'critical', trend: 'stable' },
  { code: 'RU', name: 'Russia', score: 74, level: 'high', trend: 'stable' },
  { code: 'PK', name: 'Pakistan', score: 68, level: 'elevated', trend: 'rising' },
  { code: 'AF', name: 'Afghanistan', score: 82, level: 'critical', trend: 'stable' },
  { code: 'SD', name: 'Sudan', score: 96, level: 'critical', trend: 'rising' },
  { code: 'MM', name: 'Myanmar', score: 89, level: 'critical', trend: 'stable' },
  { code: 'VE', name: 'Venezuela', score: 65, level: 'elevated', trend: 'stable' },
  { code: 'MX', name: 'Mexico', score: 58, level: 'elevated', trend: 'rising' },
  { code: 'NG', name: 'Nigeria', score: 71, level: 'high', trend: 'rising' },
  { code: 'SO', name: 'Somalia', score: 92, level: 'critical', trend: 'stable' }
];

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
