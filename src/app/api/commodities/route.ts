import { NextResponse } from 'next/server';

export async function GET() {
  const symbols = ['^VIX', 'GC=F', 'SI=F', 'NG=F'];
  
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;
        const resp = await fetch(url, {
          next: { revalidate: 60 } // Cache for 60 seconds
        });
        const data = await resp.json();
        
        const result = data.chart?.result?.[0];
        const meta = result?.meta;
        if (!meta) return null;

        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose || price;
        const change = ((price - prevClose) / prevClose) * 100;
        
        let display = symbol;
        if (symbol === '^VIX') display = 'VIX';
        if (symbol === 'GC=F') display = 'GOLD';
        if (symbol === 'SI=F') display = 'SILVER';
        if (symbol === 'NG=F') display = 'NATGAS';

        const closes = result.indicators?.quote?.[0]?.close;
        const sparkline = closes?.filter((v: number | null) => v != null) || [];
        
        return { symbol: display, price, change, sparkline };
      })
    );
    
    return NextResponse.json({ quotes: results.filter(Boolean) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch commodities' }, { status: 500 });
  }
}
