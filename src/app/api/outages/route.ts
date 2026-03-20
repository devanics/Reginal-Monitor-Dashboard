import { NextResponse } from 'next/server';

const OUTAGES = [
  { name: 'Suez Broadband Latency Spike', lat: 29.9, lon: 32.5, type: 'NETWORK_CONGESTION' },
  { name: 'Muscat Regional DNS Timeout', lat: 23.6, lon: 58.4, type: 'DNS_FAILURE' },
  { name: 'Aden Fiber Cut Alert', lat: 12.8, lon: 45.0, type: 'PHYSICAL_DISRUPTION' }
];

export async function GET() {
  return NextResponse.json(OUTAGES);
}
