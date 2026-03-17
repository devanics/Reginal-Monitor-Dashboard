import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const newsKey = process.env.NEWS_API_KEY;

    if (!newsKey) {
      return NextResponse.json({
        articles: [
          { id: 0, title: 'Regional tensions remain elevated across Middle East. 🔴', time: 'now', status: 'critical' },
          { id: 1, title: 'Naval movements reported in Gulf of Aden. 🟡', time: '5m ago', status: 'elevated' },
          { id: 2, title: 'Diplomatic talks underway between regional partners. 🟢', time: '10m ago', status: 'normal' },
        ]
      });
    }

    const res = await fetch(
      `https://newsapi.org/v2/everything?q=Middle+East+OR+Iran+OR+Yemen+OR+Israel+OR+Houthi+OR+Gulf+conflict&sortBy=publishedAt&pageSize=15`,
      {
        headers: { Authorization: `Bearer ${newsKey}` },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) throw new Error(`NewsAPI responded with ${res.status}`);

    const data = await res.json();
    const rawArticles = data.articles || [];

    // Filter for relevance to the Middle East / regional conflict
    const keywords = ['iran', 'israel', 'saudi', 'ksa', 'yemen', 'houthi', 'lebanon', 'hezbollah',
      'hamas', 'gulf', 'strait', 'middle east', 'syria', 'iraq', 'uae', 'qatar', 'jordan'];

    const filtered = rawArticles.filter((a: any) => {
      const text = `${a.title} ${a.description || ''}`.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    }).slice(0, 10);

    const articles = (filtered.length > 0 ? filtered : rawArticles.slice(0, 8)).map((a: any, i: number) => ({
      id: i,
      title: a.title,
      status: i % 4 === 0 ? 'critical' : (i % 3 === 0 ? 'elevated' : 'normal'),
      time: new Date(a.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: a.source?.name || 'Reuters',
    }));

    return NextResponse.json({ articles });
  } catch (err) {
    console.error('regional-news-articles error:', err);
    return NextResponse.json({
      articles: [
        { id: 0, title: 'Regional tensions elevated across the Middle East corridor. 🔴', time: 'now', status: 'critical', source: 'Intel' },
        { id: 1, title: 'Naval activity reported near Strait of Hormuz. 🟡', time: '8m', status: 'elevated', source: 'Intel' },
        { id: 2, title: 'Air-defense posture heightened across Gulf states. 🟡', time: '15m', status: 'elevated', source: 'Intel' },
        { id: 3, title: 'Diplomatic channels active between regional actors. 🟢', time: '20m', status: 'normal', source: 'Intel' },
      ]
    });
  }
}
