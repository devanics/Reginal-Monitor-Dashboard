import { NextResponse } from 'next/server';

// ========================================================================
// Critical Minerals API Route (Global Strategic Deposits)
// ========================================================================

const CRITICAL_MINERALS = [
  { id: 'greenbushes', name: 'Greenbushes (Lithium)', lat: -33.86, lon: 116.01, mineral: 'LITHIUM', country: 'AUS' },
  { id: 'atacama', name: 'Salar de Atacama (Lithium)', lat: -23.50, lon: -68.33, mineral: 'LITHIUM', country: 'CHL' },
  { id: 'mutanda', name: 'Mutanda (Cobalt)', lat: -10.78, lon: 25.80, mineral: 'COBALT', country: 'DRC' },
  { id: 'bayan_obo', name: 'Bayan Obo (Rare Earths)', lat: 41.76, lon: 109.95, mineral: 'RARE_EARTHS', country: 'CHN' },
  { id: 'mountain_pass', name: 'Mountain Pass (Rare Earths)', lat: 35.47, lon: -115.53, mineral: 'RARE_EARTHS', country: 'USA' },
  { id: 'norilsk', name: 'Norilsk (Nickel/Palladium)', lat: 69.33, lon: 88.21, mineral: 'NICKEL', country: 'RUS' },
  // Regional / Saudi Focus
  { id: 'mahad_dahab', name: 'Mahad Ad Dahab (Gold)', lat: 23.49, lon: 40.86, mineral: 'GOLD', country: 'KSA' },
  { id: 'waad_shimal', name: 'Waad Al Shimal (Phosphate)', lat: 31.5, lon: 39.0, mineral: 'PHOSPHATE', country: 'KSA' }
];

export async function GET() {
  return NextResponse.json(CRITICAL_MINERALS);
}
