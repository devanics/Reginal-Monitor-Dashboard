import { NextResponse } from 'next/server';

const ECONOMIC_CENTERS = [
  { name: 'Riyadh Financial District', lat: 24.7622, lon: 46.6425, type: 'FINANCIAL_HUB' },
  { name: 'Dubai IFC', lat: 25.2128, lon: 55.2801, type: 'GLOBAL_TRADE' },
  { name: 'Abu Dhabi Global Market', lat: 24.5000, lon: 54.3833, type: 'INVESTMENT_CENTER' },
  { name: 'Doha West Bay', lat: 25.3186, lon: 51.5310, type: 'ENERGY_COMMERCE' }
];

export async function GET() {
  return NextResponse.json(ECONOMIC_CENTERS);
}
