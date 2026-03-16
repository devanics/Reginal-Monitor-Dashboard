import { NextResponse } from 'next/server';

const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TSLA'];

export async function GET() {
  try {
    const results = await Promise.all(
      STOCK_SYMBOLS.map(async (symbol) => {
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
        
        const closes = result.indicators?.quote?.[0]?.close;
        const sparkline = closes?.filter((v: number | null) => v != null) || [];
        
        return { symbol, price, change, sparkline };
      })
    );
    
    return NextResponse.json({ quotes: results.filter(Boolean) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
