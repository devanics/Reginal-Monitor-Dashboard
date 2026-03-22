import { NextResponse } from 'next/server';


let NEWSDATA_API_KEY= "pub_3bf010deae2144a4839b92d31fe31826"
export async function GET() {
  try {
    // 1. fetch latest news for KSA only
    const news = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&country=sa&q=saudi+OR+riyadh+OR+jeddah+OR+conflict+OR+unrest+OR+clashes`,
      {
        next: { revalidate: 900 } // refresh every 15 minutes
      }
    );

    if (!news.ok) {
      throw new Error(`News API responded with ${news.status}`);
    }

    const data = await news.json();
    
    const articles = (data.results || []).slice(0, 5).map((a: any) => a.title).join("\n");

    if (!articles) {
      return NextResponse.json({ summary: "No recent conflict news found. 🟢" });
    }

    // 2. generate AI summary using Open Router
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const ai = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
        'HTTP-Referer': baseUrl,
        'X-Title': 'Regional Monitor Dashboard'
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Summarize conflict situation in 5-10 words and include emoji stoplight indicator (🔴🟡🟢)"
          },
          {
            role: "user",
            content: articles
          }
        ]
      })
    });

    if (!ai.ok) {
      throw new Error(`Open Router API responded with ${ai.status}`);
    }

    const aiData = await ai.json();
    
    const summary = aiData.choices?.[0]?.message?.content || "Conflict summary currently unavailable. 🟡";

    return NextResponse.json({
      summary
    });
  } catch (error) {
    console.error("Error in regionalNews API:", error);
    return NextResponse.json(
      { summary: "Conflict summary currently unavailable. 🟡" },
      { status: 200 } // Returning 200 with fallback to avoid crashing the dashboard
    );
  }
}
