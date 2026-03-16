import { NextResponse } from 'next/server';


export async function GET() {

    // 1. fetch latest news
    const news = await fetch(
      `https://newsapi.org/v2/everything?q=war OR conflict OR military`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEWS_API_KEY}`
        },
        next: { revalidate: 900 } // refresh every 15 minutes
      }
    );
  
    const data = await news.json();
  
    const articles = data.articles.slice(0,5).map((a : any) => a.title).join("\n");
  
    // 2. generate AI summary
    const ai = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          {
            role:"system",
            content:"Summarize conflict situation in 5-10 words and include emoji stoplight indicator (🔴🟡🟢)"
          },
          {
            role:"user",
            content:articles
          }
        ]
      })
    });
  
    const aiData = await ai.json();
  
    return NextResponse.json({
      summary: aiData.choices[0].message.content
    });
  }