export const revalidate = 300; // 5 minutes

export async function GET() {
    try {
        // Fetch news related to conflicts near KSA
        const newsRes = await fetch(
            `https://newsapi.org/v2/everything?q=%2BSaudi%20%2BArabia&sortBy=publishedAt`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEWS_API_KEY}`
                },
                next: { revalidate: 300 }
            }
        );

        if (!newsRes.ok) {
            throw new Error(`News API responded with ${newsRes.status}`);
        }

        const news = await newsRes.json();
        const articles = (news.articles || [])
            .filter((a: any) => {
                const searchStr = `${a.title} ${a.description} ${a.content}`.toLowerCase();
                return searchStr.includes('saudi') || searchStr.includes('ksa') || searchStr.includes('riyadh');
            })
            .slice(0, 8);

        const headlines = articles
            .map((a: any) => a.title)
            .join("\n");

        if (articles.length === 0) {
            return Response.json({ summary: "No immediate threats detected in KSA. 🟢" });
        }

        // Generate AI summary and FILTER for strictly relevant news
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a strict filter. From the headlines, choose ONLY those where Saudi Arabia (KSA) is the MAIN SUBJECT of the news. Ignore general Middle East news, Iran/Israel news (unless it direct describes an impact ON Saudi soil/security), or foreign operations. Summarize the Saudi-specific situation in 5-10 words with stoplight emoji (🔴🟡🟢). If no strictly relevant news, respond: 'No immediate threats detected in KSA. 🟢'"
                    },
                    {
                        role: "user",
                        content: headlines
                    }
                ]
            })
        });

        if (!aiRes.ok) {
            throw new Error(`OpenAI API responded with ${aiRes.status}`);
        }

        const ai = await aiRes.json();
        const summary = ai.choices?.[0]?.message?.content || "KSA conflict summary currently unavailable. 🟡";

        return Response.json({
            summary,
            articles: news.articles || []
        });
    } catch (error) {
        console.error("Error in KSA conflict summary API:", error);
        return Response.json(
            { summary: "KSA conflict summary currently unavailable. 🟡" },
            { status: 200 } // Returning 200 with fallback
        );
    }
}