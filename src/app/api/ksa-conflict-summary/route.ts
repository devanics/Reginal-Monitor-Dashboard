export const revalidate = 300; // 5 minutes

export async function GET() {

    // Fetch news related to conflicts near KSA
    const newsRes = await fetch(
        `https://newsapi.org/v2/everything?q=Saudi Arabia OR Middle East war OR Iran Israel conflict`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEWS_API_KEY}`
            },
            next: { revalidate: 300 }
        }
    );

    const news = await newsRes.json();

    const headlines = news.articles
        .slice(0, 5)
        .map((a: any) => a.title)
        .join("\n");

    // Generate AI summary
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
                    content:
                        "Summarize regional war/conflict situation affecting Saudi Arabia in 5-10 words with stoplight emoji (🔴🟡🟢)"
                },
                {
                    role: "user",
                    content: headlines
                }
            ]
        })
    });

    const ai = await aiRes.json();

    return Response.json({
        summary: ai.choices[0].message.content
    });
}