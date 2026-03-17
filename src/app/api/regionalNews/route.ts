import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // 1. fetch latest news
    const news = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_API_KEY}&country=ir,sa,il&q=war+OR+conflict+OR+clashes+OR+attack+OR+battle+OR+violence+OR+strike+OR+hezbollah+OR+hamas+OR+yemen`,
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

    // 2. generate AI summary using OpenAI
    const ai = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
      throw new Error(`OpenAI API responded with ${ai.status}`);
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
