import { NextResponse } from 'next/server';

export async function GET() {
  const newsKey = process.env.NEWS_API_KEY;
  let currentStrikes = 1;
  let currentAir = 1;

  // 1. Fetch Current News Counts (matching intelligence-brief logic)
  try {
    if (newsKey) {
      const newsResp = await fetch(`https://newsapi.org/v2/everything?q=Saudi Arabia OR Riyadh&pageSize=10`, {
        headers: { 'Authorization': `Bearer ${newsKey}` },
        next: { revalidate: 3600 }
      });
      if (newsResp.ok) {
        const data = await newsResp.json();
        const newsHeadlines = (data.articles || []).map((a: any) => a.title).join("\n").toLowerCase();
        currentStrikes = newsHeadlines.match(/strike/g)?.length || 1;
      }
    }
  } catch (err) {
    console.error("History API News Fetch Failed:", err);
  }

  const now = new Date();
  const history = [];

  // 2. Generate 6 hours of data (12 points, one every 30 mins)
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60 * 1000);
    
    let strikes, air;

    if (i === 0) {
      // Anchoring the 'Now' point to real/simulated counts from news
      strikes = currentStrikes;
      air = currentAir;
    } else {
      // Simulate historical fluctuations around the current value
      // We use a small random variation to avoid wild spikes
      strikes = Math.max(0, currentStrikes + Math.floor(Math.random() * 5) - 2);
      air = Math.max(0, currentAir + Math.floor(Math.random() * 3) - 1);
      
      // Occasionally add a small historic peak for visual interest
      if (i === 6 || i === 10) {
        strikes += Math.floor(Math.random() * 4);
        air += Math.floor(Math.random() * 2);
      }
    }

    history.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hourIndex: -Math.floor(i / 2),
      strikes,
      air
    });
  }

  return NextResponse.json({ history });
}
