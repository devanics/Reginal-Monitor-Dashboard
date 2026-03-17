import { NextResponse } from 'next/server';

export async function GET() {
  const symbols = ['AAPL', 'AMZN', 'AVGO', 'MSFT', 'GOOGL', 'NVDA', 'META'];
  
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;
        const resp = await fetch(url, {
          next: { revalidate: 300 } // Cache for 5 minutes
        });
        const data = await resp.json();
        
        const result = data.chart?.result?.[0];
        const meta = result?.meta;
        if (!meta) return null;

        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose || price;
        const change = ((price - prevClose) / prevClose) * 100;
        
        const names: Record<string, string> = {
          'AAPL': 'Apple',
          'AMZN': 'Amazon',
          'AVGO': 'Broadcom',
          'MSFT': 'Microsoft',
          'GOOGL': 'Alphabet',
          'NVDA': 'NVIDIA',
          'META': 'Meta'
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
    console.error('Markets API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
}
