import { CHROME_UA } from './constants';

const UCDP_API_URL = 'https://ucdpapi.pcr.uu.se/api/gedevents';
const UCDP_PAGE_SIZE = 1000;

export interface UcdpRawEvent {
  id?: string;
  date_start?: string;
  date_end?: string;
  latitude?: string;
  longitude?: string;
  country?: string;
  side_a?: string;
  side_b?: string;
  best?: string;
  low?: string;
  high?: string;
  type_of_violence?: number;
}

export async function fetchUcdp(country?: string): Promise<UcdpRawEvent[]> {
  const token = (process.env.UCDP_ACCESS_TOKEN || process.env.UC_DP_KEY || '').trim();
  const year = new Date().getFullYear() - 2000;
  const version = `${year}.1`; // Try latest version

  const headers: Record<string, string> = { Accept: 'application/json', 'User-Agent': CHROME_UA };
  if (token) headers['x-ucdp-access-token'] = token;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `${UCDP_API_URL}/${version}?pagesize=${UCDP_PAGE_SIZE}&page=0`;
    // Note: In a real environment, we'd iterate pages, but for on-demand scoring we limit to the latest 1000 events.
    const resp = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!resp.ok) return [];
    const data = await resp.json();
    let events = data.Result || [];

    if (country) {
      events = events.filter((e: any) => e.country === country);
    }

    return events;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error('[UCDP] Fetch timed out');
    } else {
      console.error('[UCDP] Fetch failed:', err.message);
    }
    return [];
  }
}
