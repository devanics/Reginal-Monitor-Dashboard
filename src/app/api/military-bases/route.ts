import { NextResponse } from 'next/server';

// ========================================================================
// Military Bases API Route (Scatterplot Data)
// ========================================================================

const MILITARY_BASES = [
  { id: 'ream_naval_base', name: 'Ream Naval Base (CHINA)', lat: 10.50340, lon: 103.60900, type: 'PLA Navy(Access Right)', country: 'Cambodia' },
  { id: 'chinese_pla_support_base', name: 'Chinese PLA Support Base (CHINA)', lat: 11.59150, lon: 43.06020, type: 'Navy', country: 'Djibouti' },
  { id: 'chinese_naval_intelligence_base', name: 'Chinese Naval Intelligence Base (CHINA)', lat: 14.14630, lon: 93.35880, type: 'Army', country: 'Myanmar' },
  { id: 'military_base_tajikistan', name: 'Military Base (CHINA)', lat: 37.43810, lon: 74.91280, type: 'Army', country: 'Tajikistan' },
  { id: 'unnamed_military_base_spratly', name: 'Unnamed Military Base (CHINA)', lat: 9.54583, lon: 112.88750, type: 'Combined arms', country: 'Disputed' },
  { id: 'ndjamena_air_force_base', name: "N'Djamena Air Force Base (FRANCE)", lat: 12.13361, lon: 15.03389, type: 'Air Force', country: 'Chad' },
  { id: 'naval_base_of_hron', name: 'Naval base of Héron (FRANCE)', lat: 11.55663, lon: 43.14419, type: 'Navy', country: 'Djibouti' },
  { id: 'les_lments_franais_au_gabon', name: 'Les éléments français au Gabon (FRANCE)', lat: 0.42048, lon: 9.43806, type: 'Combined arms', country: 'Gabon' },
  { id: 'abu_dhabi_base', name: 'Abu Dhabi Base (FRANCE)', lat: 24.52151, lon: 54.39611, type: 'Navy, Air Force', country: 'UAE' },
  { id: 'farkhor_air_base', name: 'Farkhor air base (INDIA)', lat: 37.47011, lon: 69.38089, type: 'Combined arms', country: 'Tajikistan' },
  { id: 'ras_al_hadd_listening_post', name: 'Ras al Hadd Listening post (INDIA)', lat: 22.53308, lon: 59.79831, type: 'Listening Post', country: 'Oman' },
  { id: 'russian_102nd_military_base', name: 'Russian 102nd Military Base (RUSSIA)', lat: 40.79000, lon: 43.82500, type: 'Combined arms', country: 'Armenia' },
  { id: 'russian_3624th_airbase', name: 'Russian 3624th Airbase (RUSSIA)', lat: 40.12800, lon: 44.47200, type: 'Air Force', country: 'Armenia' },
  { id: 'kant_air_base', name: 'Kant Air Base (RUSSIA)', lat: 42.85300, lon: 74.84600, type: 'Military Air Base', country: 'Kyrgyzstan' },
  { id: 'khmeimim_air_base', name: 'Khmeimim Air Base (RUSSIA)', lat: 35.41100, lon: 35.94500, type: 'Aerospace Defence Forces', country: 'Syria' },
  { id: 'russian_naval_facility_in_tartus', name: 'Russian naval facility in Tartus (RUSSIA)', lat: 34.91500, lon: 35.87400, type: 'Navy', country: 'Syria' },
  { id: 'hms_jufair', name: 'HMS Jufair (UK)', lat: 26.20500, lon: 50.61500, type: 'Royal Navy', country: 'Bahrain' },
  { id: 'raf_akrotiri', name: 'RAF Akrotiri (UK)', lat: 34.59000, lon: 32.98700, type: 'Royal Air Force', country: 'Cyprus' },
  { id: 'uk_joint_logistics_support_base', name: 'UK Joint Logistics Support Base (UK)', lat: 19.66900, lon: 57.71000, type: 'Logistics Support', country: 'Oman' },
  { id: 'naval_support_activity_bahrain', name: 'Naval Support Activity Bahrain (US-NATO)', lat: 26.20860, lon: 50.60970, type: 'Navy', country: 'Bahrain' },
  { id: 'isa_air_base', name: 'Isa Air Base (US-NATO)', lat: 25.91210, lon: 50.59310, type: 'Air Force', country: 'Bahrain' },
  { id: 'camp_lemonnier', name: 'Camp Lemonnier (US-NATO)', lat: 11.54360, lon: 43.14860, type: 'Navy', country: 'Djibouti' },
  { id: 'ain_assad_air_base', name: 'Ain Assad Air Base (US-NATO)', lat: 33.79860, lon: 42.43910, type: 'Combined arms', country: 'Iraq' },
  { id: 'kadena_air_base', name: 'Kadena Air Base (US-NATO)', lat: 26.35450, lon: 127.76600, type: 'Air Force', country: 'Japan' },
  { id: 'ali_al_salem_air_base', name: 'Ali Al Salem Air Base (US-NATO)', lat: 29.34870, lon: 47.52350, type: 'Air Force', country: 'Kuwait' },
  { id: 'camp_arifjan_us', name: 'Camp Arifjan (US-NATO)', lat: 28.87510, lon: 48.15890, type: 'Combined arms', country: 'Kuwait' },
  { id: 'al_udeid_us', name: 'Al Udeid (US-NATO)', lat: 25.27930, lon: 51.52240, type: 'Air Force', country: 'Qatar' },
  { id: 'prince_sultan_air_base_us', name: 'Prince Sultan Air Base (US-NATO)', lat: 24.07690, lon: 47.56400, type: 'Air Force', country: 'Saudi Arabia' },
  { id: 'al_dhafra_air_base_us', name: 'Al Dhafra Air Base (US-NATO)', lat: 24.24000, lon: 54.55100, type: 'Air Force', country: 'UAE' },
  // Adding KSA Specific ones that were in original but potentially missing or different
  { id: 'king_abdulaziz_air_base', name: 'King Abdulaziz Air Base', lat: 26.2625, lon: 50.1525, type: 'Air Base', country: 'KSA' },
  { id: 'king_khalid_military_city', name: 'King Khalid Military City', lat: 27.9833, lon: 45.5417, type: 'Military City', country: 'KSA' },
  { id: 'king_faisal_naval_base', name: 'King Faisal Naval Base', lat: 21.3500, lon: 39.1667, type: 'Naval Base', country: 'KSA' }
];

export async function GET() {
  try {
    return NextResponse.json(MILITARY_BASES);
  } catch (error) {
    console.error('Military Bases API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
