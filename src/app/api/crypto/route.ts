import { NextResponse } from 'next/server';

const CRYPTO_IDS = ['bitcoin', 'ethereum', 'binancecoin'];
const META: Record<string, { symbol: string; name: string }> = {
  bitcoin: { symbol: 'BTC', name: 'Bitcoin' },
  ethereum: { symbol: 'ETH', name: 'Ethereum' },
  binancecoin: { symbol: 'BNB', name: 'BNB' },
};

export async function GET() {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(',')}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;
    const resp = await fetch(url, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!resp.ok) {
      throw new Error(`CoinGecko HTTP ${resp.status}`);
    }

    const data = await resp.json();
    if (!Array.isArray(data)) {
      throw new Error('CoinGecko returned non-array');
    }

    const quotes = data.map((coin: any) => {
      const meta = META[coin.id];
      const prices = coin.sparkline_in_7d?.price;
      const sparkline = prices && prices.length > 24 ? prices.slice(-48) : (prices || []);

      return {
        id: coin.id,
        name: meta?.name || coin.id,
        symbol: meta?.symbol || coin.symbol.toUpperCase(),
        price: coin.current_price ?? 0,
        change: coin.price_change_percentage_24h ?? 0,
        sparkline,
      };
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch crypto quotes' }, { status: 500 });
  }
}
