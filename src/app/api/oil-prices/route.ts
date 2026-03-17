// Saudi Aramco grade differentials vs Arab Light benchmark ($/bbl, typical market values)
const GRADES = [
  { code: 'ASL', name: 'Arabian Super Light', diff: +3.50, gravity: 50.6 },
  { code: 'AXL', name: 'Arabian Extra Light',  diff: +1.80, gravity: 38.0 },
  { code: 'AL',  name: 'Arabian Light',        diff:  0.00, gravity: 33.4 },
  { code: 'AM',  name: 'Arabian Medium',        diff: -1.50, gravity: 30.4 },
  { code: 'AH',  name: 'Arabian Heavy',         diff: -4.00, gravity: 27.0 },
];

// Deterministic sparkline seeded by price so it stays stable across re-renders
function buildSparkline(price: number, points = 20): number[] {
  const result: number[] = [];
  let v = price * 0.96;
  for (let i = 0; i < points; i++) {
    // pseudo-random walk seeded by price + index (no Math.random)
    const seed = Math.sin(price * 9301 + i * 49297 + 233995) * 0.5 + 0.5;
    v += (seed - 0.48) * 0.6;
    result.push(parseFloat(v.toFixed(2)));
  }
  result.push(price);
  return result;
}

export async function GET() {
  try {
    const res = await fetch('https://api.oilpriceapi.com/v1/prices/latest', {
      headers: {
        Authorization: `Token ${process.env.OIL_PRICE_API_KEY}`,
      },
      next: { revalidate: 300 }, // refresh every 5 minutes
    });

    if (!res.ok) throw new Error(`oilpriceapi responded with ${res.status}`);

    const data = await res.json();
    const basePrice: number = data.data?.price ?? 75;
    const currency: string = data.data?.currency ?? 'USD';

    const grades = GRADES.map((g) => {
      const price = parseFloat((basePrice + g.diff).toFixed(2));
      // Simulate a previous-session close slightly off the current price for % change
      const prevSeed = Math.sin(price * 1234.56) * 0.5 + 0.5; // 0-1
      const prevClose = parseFloat((price * (1 + (prevSeed - 0.5) * 0.04)).toFixed(2));
      const change = parseFloat((((price - prevClose) / prevClose) * 100).toFixed(2));

      return {
        code: g.code,
        name: g.name,
        gravity: g.gravity,
        price,
        change,
        sparkline: buildSparkline(price),
        currency,
      };
    });

    return Response.json({ grades, basePrice, currency });
  } catch (error) {
    console.error('oil-prices API error:', error);
    return Response.json({ error: 'Failed to fetch oil prices' }, { status: 500 });
  }
}
