import { CHROME_UA } from './constants';

const ACLED_API_URL = 'https://acleddata.com/api/acled/read';
const ACLED_TOKEN_URL = 'https://acleddata.com/oauth/token';
const ACLED_CLIENT_ID = 'acled';

export interface AcledRawEvent {
  event_id_cnty?: string;
  event_type?: string;
  sub_event_type?: string;
  country?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  event_date?: string;
  fatalities?: string;
  source?: string;
}

interface FetchAcledOptions {
  eventTypes: string;
  startDate: string;
  endDate: string;
  country?: string;
  limit?: number;
}

interface TokenState {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// In-memory cache for token (L1 cache)
let memCachedToken: TokenState | null = null;

async function exchangeCredentials(): Promise<TokenState> {
  const email = process.env.ACLED_EMAIL?.trim();
  const password = process.env.ACLED_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error('Missing ACLED_EMAIL or ACLED_PASSWORD');
  }

  const body = new URLSearchParams({
    username: email,
    password,
    grant_type: 'password',
    client_id: ACLED_CLIENT_ID,
  });

  const resp = await fetch(ACLED_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': CHROME_UA,
    },
    body,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`ACLED OAuth failed (${resp.status}): ${text.substring(0, 100)}`);
  }

  const data = await resp.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in || 86400) * 1000,
  };
}

async function getAcledAccessToken(): Promise<string | null> {
  // If static token is set, use it.
  if (process.env.ACLED_ACCESS_TOKEN) return process.env.ACLED_ACCESS_TOKEN;

  // Otherwise use OAuth flow.
  if (memCachedToken && Date.now() < memCachedToken.expiresAt - 300000) {
    return memCachedToken.accessToken;
  }

  try {
    memCachedToken = await exchangeCredentials();
    return memCachedToken.accessToken;
  } catch (err) {
    console.error('[ACLED] Auth failed:', err);
    return null;
  }
}

export async function fetchAcled(opts: FetchAcledOptions): Promise<AcledRawEvent[]> {
  const email = process.env.ACLED_EMAIL?.trim();
  const key = (process.env.ACLED_KEY || process.env.ACLED_API_KEY)?.trim();
  const token = await getAcledAccessToken();

  const params = new URLSearchParams({
    event_type: opts.eventTypes,
    event_date: `${opts.startDate}|${opts.endDate}`,
    event_date_where: 'BETWEEN',
    limit: String(opts.limit || 500),
    _format: 'json',
  });
  if (opts.country) params.set('country', opts.country);

  // If Key/Email are present, priority 1 (most reliable for Basic accounts)
  if (key && email) {
    params.set('key', key);
    params.set('email', email);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': CHROME_UA,
    };

    // Use Bearer token only if Key/Email are NOT being used
    if (token && !(key && email)) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const resp = await fetch(`${ACLED_API_URL}?${params}`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!resp.ok) {
      console.error(`[ACLED] Error response (${resp.status}):`, await resp.text().catch(() => 'No body'));
      return [];
    }
    const data = await resp.json();
    console.log(`[ACLED] Success! Fetched ${data.data?.length || 0} events for ${opts.country || 'Global'}`);
    if (data.data && data.data.length > 0) {
      console.log(`[ACLED] Sample event:`, JSON.stringify(data.data[0], null, 2));
    }
    return data.data || [];
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error('[ACLED] Fetch timed out');
    } else {
      console.error('[ACLED] Fetch failed:', err.message);
    }
    return [];
  }
}
