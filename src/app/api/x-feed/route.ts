import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    // Return mock data if no token is provided
    return NextResponse.json({
      tweets: [
        {
          id: '1',
          text: 'عاجل | مراسل العربية: سقوط قذائف في العاصمة الأوكرانية كييف وسماع دوي انفجارات ضخمة #العربية',
          created_at: new Date().toISOString(),
          user: { name: 'Al Arabiya', username: 'AlArabiya' }
        },
        {
          id: '2',
          text: 'وزير الخارجية السعودي: ملتزمون بدعم الاستقرار في المنطقة وتعزيز التعاون الدولي #السعودية',
          created_at: new Date(Date.now() - 600000).toISOString(),
          user: { name: 'Al Arabiya', username: 'AlArabiya' }
        },
        {
          id: '3',
          text: 'أسواق النفط العالمية تشهد تقلبات حادة وسط توترات جيوسياسية جديدة في منطقة الشرق الأوسط #اقتصاد',
          created_at: new Date(Date.now() - 1200000).toISOString(),
          user: { name: 'Al Arabiya', username: 'AlArabiya' }
        }
      ]
    });
  }

  try {
    // 1. Get User ID for AlArabiya (if needed, but we'll use a known ID or fetch it)
    // AlArabiya handle: AlArabiya
    const userResp = await fetch('https://api.twitter.com/2/users/by/username/AlArabiya', {
      headers: { Authorization: `Bearer ${bearerToken}` }
    });
    
    if (!userResp.ok) throw new Error('Failed to fetch user ID');
    const userData = await userResp.json();
    const userId = userData.data.id;

    // 2. Fetch timeline
    const timelineResp = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at,author_id&max_results=10`, {
      headers: { Authorization: `Bearer ${bearerToken}` }
    });

    if (!timelineResp.ok) throw new Error('Failed to fetch timeline');
    const timelineData = await timelineResp.json();

    return NextResponse.json({
      tweets: (timelineData.data || []).map((t: any) => ({
        id: t.id,
        text: t.text,
        created_at: t.created_at,
        user: { name: 'Al Arabiya', username: 'AlArabiya' }
      }))
    });

  } catch (error) {
    console.error('X API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch X feed' }, { status: 500 });
  }
}
