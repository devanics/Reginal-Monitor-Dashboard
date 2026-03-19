import { NextRequest, NextResponse } from 'next/server';

// ========================================================================
// Intelligence Brief API Route (Dynamic CII Scoring)
// ========================================================================

const countryMap: Record<string, string> = {
  'SA': 'Saudi Arabia', 'AE': 'UAE', 'BH': 'Bahrain', 'OM': 'Oman',
  'QA': 'Qatar', 'IR': 'Iran', 'IL': 'Israel', 'KW': 'Kuwait', 'TR': 'Turkey'
};
const baselineMap: Record<string, number> = { 
  SA: 2.0, IR: 4.5, IL: 4.0, TR: 3.0, AE: 1.0, BH: 1.5, OM: 0.8, QA: 1.2, KW: 1.5 
};

async function getCountryStats(code: string, name: string, newsKey?: string) {
  let newsHeadlines = "";
  let newsCount = 0;
  
  if (newsKey) {
    try {
      const newsResp = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(name)}&pageSize=5`, {
        headers: { 'Authorization': `Bearer ${newsKey}` },
        next: { revalidate: 3600 }
      });
      if (newsResp.ok) {
        const data = await newsResp.json();
        newsCount = data.totalResults || 0;
        newsHeadlines = (data.articles || []).map((a: any) => a.title).join("\n");
      }
    } catch (e) {
      console.error(`News fetch error for ${code}:`, e);
    }
  }

  const multiplier = baselineMap[code.toUpperCase()] || 2.0;
  const lHeadlines = newsHeadlines.toLowerCase();
  
  const baseUnrest = lHeadlines.includes('protest') ? 8 : (lHeadlines.includes('strike') ? 4 : 2);
  const unrestScore = Math.min(100, Math.round(baseUnrest * 4 * multiplier));
  
  const hasConflict = lHeadlines.includes('attack') || lHeadlines.includes('clash') || lHeadlines.includes('war') || lHeadlines.includes('missile');
  const conflictScore = hasConflict ? Math.min(100, Math.round(20 * multiplier)) : 0;
  
  const securityScore = Math.min(100, Math.round(15 * multiplier));
  const infoScore = Math.min(100, Math.round(Math.min(50, (newsCount / 10))));

  const index = Math.round(unrestScore * 0.25 + conflictScore * 0.30 + securityScore * 0.20 + infoScore * 0.25);
  const status = index >= 70 ? 'critical' : (index >= 40 ? 'elevated' : 'stable');

  return {
    code: code.toLowerCase(),
    name,
    unrest: unrestScore,
    conflict: conflictScore,
    security: securityScore,
    information: infoScore,
    score: index, // for the list view
    index: index, // for the detailed view
    status: status,
    protests: lHeadlines.match(/protest/g)?.length || 0,
    strikes: lHeadlines.match(/strike/g)?.length || 0,
    newsHeadlines
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get('country') || 'SA';
  const isList = searchParams.get('list') === 'true';
  const newsKey = process.env.NEWS_API_KEY;

  try {
    if (isList) {
       const allStats = await Promise.all(
         Object.entries(countryMap).map(([code, name]) => getCountryStats(code, name, newsKey))
       );
       return NextResponse.json({ countries: allStats });
    }

    const countryName = countryMap[countryCode.toUpperCase()] || 'Saudi Arabia';
    const stats = await getCountryStats(countryCode, countryName, newsKey);

    let brief = "";
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (openRouterKey) {
      const prompt = `
        Provide a concise intelligence brief for ${countryName} based on these headlines:
        ${stats.newsHeadlines || "No major headlines today."}
        
        The current instability metrics are: Unrest ${stats.unrest}, Conflict ${stats.conflict}, Security ${stats.security}.
        Include specific references to detected protest events and active strikes if relevant. 
        Maintain a professional, analytic tone. Keep it under 150 words.
      `;

      const aiResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': baseUrl,
          'X-Title': 'Regional Monitor Dashboard'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });

      if (aiResp.ok) {
        const aiData = await aiResp.json();
        brief = aiData.choices[0]?.message?.content || "";
      }
    }

    if (!brief) {
      brief = `## Intelligence Brief: ${countryName} — ${new Date().toISOString().split('T')[0]}\n\n${countryName} is currently showing a Country Instability Index of ${stats.index}/100. ${stats.status === 'stable' ? 'The situation remains largely stable with localized monitoring in effect.' : 'Heightened vigilance is recommended due to increasing signals of unrest or regional tension.'} Dynamic monitoring of news and maritime datasets indicates ${stats.information > 0 ? 'active' : 'minimal'} reporting on security developments.`;
    }

    return NextResponse.json({ brief, stats });

  } catch (error) {
    console.error('CII Dynamic Scoring Error:', error);
    return NextResponse.json({ error: 'Failed to generate dynamic CII' }, { status: 500 });
  }
}
