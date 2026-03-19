import { NextResponse } from 'next/server';

const STOCK_SYMBOLS = ['^TASI.SR', 'DFMGI.AE', 'QAT', 'BAX', 'GULF', 'TEDPIX', '^GSPC'];

export async function GET() {
  try {
    const results = await Promise.all(
      STOCK_SYMBOLS.map(async (symbol) => {
        // Special Handling for restricted/missing markets
        if (symbol === 'TEDPIX' || symbol === 'BAX') {
           const mockData: Record<string, any> = {
             'TEDPIX': { name: 'IRAN', price: 2154320.5, change: -1.25, sparkline: [2164320, 2158000, 2155000, 2154320] },
             'BAX': { name: 'BAHRAIN', price: 2015.4, change: 0.05, sparkline: [2010, 2012, 2015, 2015.4] }
           };
           return { symbol, ...mockData[symbol] };
        }

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;
        const resp = await fetch(url, {
          next: { revalidate: 60 }
        });
        const data = await resp.json();

        const result = data.chart?.result?.[0];
        const meta = result?.meta;
        if (!meta) return null;

        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose || price;
        const change = ((price - prevClose) / prevClose) * 100;

        const names: Record<string, string> = {
          '^TASI.SR': 'SAUDI ARABIA',
          'DFMGI.AE': 'UAE',
          'QAT': 'QATAR',
          'GULF': 'KUWAIT',
          '^GSPC': 'USA'
        };

        const closes = result.indicators?.quote?.[0]?.close;
        const sparkline = closes?.filter((v: number | null) => v != null) || [];

        return { 
          symbol, 
          name: names[symbol] || symbol,
          price, 
          change, 
          sparkline 
        };
      })
    );

    return NextResponse.json({ quotes: results.filter(Boolean) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
