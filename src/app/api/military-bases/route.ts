import { NextResponse } from 'next/server';

// ========================================================================
// Military Bases API Route (Scatterplot Data)
// ========================================================================

const MILITARY_BASES = [
  // KSA
  { name: 'King Abdulaziz Air Base', lat: 26.2625, lon: 50.1525, type: 'Air Base', country: 'KSA' },
  { name: 'King Khalid Military City', lat: 27.9833, lon: 45.5417, type: 'Military City', country: 'KSA' },
  { name: 'King Faisal Naval Base', lat: 21.3500, lon: 39.1667, type: 'Naval Base', country: 'KSA' },
  { name: 'Prince Sultan Air Base', lat: 24.0667, lon: 47.5667, type: 'Air Base', country: 'KSA' },
  // Regional
  { name: 'Al Udeid Air Base', lat: 25.1167, lon: 51.3167, type: 'Air Base', country: 'Qatar' },
  { name: 'Al Dhafra Air Base', lat: 24.2333, lon: 54.5500, type: 'Air Base', country: 'UAE' },
  { name: 'Camp Arifjan', lat: 28.8750, lon: 48.1583, type: 'Army Base', country: 'Kuwait' },
  { name: 'NSA Bahrain', lat: 26.2167, lon: 50.6000, type: 'Naval Base', country: 'Bahrain' },
  { name: 'Incirlik Air Base', lat: 37.0000, lon: 35.4167, type: 'Air Base', country: 'Turkey' },
  { name: 'Hmeimim Air Base', lat: 35.4000, lon: 35.9333, type: 'Air Base', country: 'Syria' }
];

export async function GET() {
  try {
    return NextResponse.json(MILITARY_BASES);
  } catch (error) {
    console.error('Military Bases API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
