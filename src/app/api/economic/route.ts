import { NextResponse } from 'next/server';

// ========================================================================
// Economic Centers API Route (Global Financial Hubs)
// ========================================================================

const ECONOMIC_CENTERS = [
  // Americas
  { id: 'nyse', name: 'NYSE', type: 'EXCHANGE', lat: 40.7069, lon: -74.0089, country: 'USA' },
  { id: 'nasdaq', name: 'NASDAQ', type: 'EXCHANGE', lat: 40.7569, lon: -73.9896, country: 'USA' },
  { id: 'fed', name: 'Federal Reserve', type: 'CENTRAL_BANK', lat: 38.8927, lon: -77.0459, country: 'USA' },
  // Europe
  { id: 'lse', name: 'LSE', type: 'EXCHANGE', lat: 51.5145, lon: -0.0940, country: 'GB' },
  { id: 'ecb', name: 'ECB', type: 'CENTRAL_BANK', lat: 50.1096, lon: 8.6732, country: 'DE' },
  // Asia-Pacific
  { id: 'tse', name: 'Tokyo SE', type: 'EXCHANGE', lat: 35.6830, lon: 139.7744, country: 'JP' },
  { id: 'sse', name: 'Shanghai SE', type: 'EXCHANGE', lat: 31.2304, lon: 121.4737, country: 'CN' },
  { id: 'hkex', name: 'HKEX', type: 'EXCHANGE', lat: 22.2833, lon: 114.1577, country: 'HK' },
  { id: 'sgx', name: 'SGX', type: 'EXCHANGE', lat: 1.2834, lon: 103.8607, country: 'SG' },
  // Middle East
  { id: 'tadawul', name: 'Tadawul', type: 'EXCHANGE', lat: 24.6877, lon: 46.7219, country: 'SA' },
  { id: 'dubai_hub', name: 'DIFC', type: 'FINANCIAL_HUB', lat: 25.2116, lon: 55.2708, country: 'AE' },
  { id: 'tase', name: 'TASE', type: 'EXCHANGE', lat: 32.0853, lon: 34.7818, country: 'IL' }
];

export async function GET() {
  return NextResponse.json(ECONOMIC_CENTERS);
}
