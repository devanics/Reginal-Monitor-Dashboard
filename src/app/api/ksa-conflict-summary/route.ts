export const revalidate = 300; // 5 minutes

export async function GET() {
    try {
        // Fetch news related to conflicts near KSA
        const newsRes = await fetch(
            `https://newsapi.org/v2/everything?q=%2BSaudi%20%2BArabia&sortBy=publishedAt`,
            {
                headers: {
                    Authorization: `Bearer d71aceb982e14dc69457d39dfbd5ee4d`
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

        // Generate AI summary and FILTER for strictly relevant news using Open Router
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + openRouterKey,
                'HTTP-Referer': baseUrl,
                'X-Title': 'Regional Monitor Dashboard'
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a strict intelligence analyst. Analyze the provided news headlines and respond in JSON format. \n" +
                            "Output schema: { \"summary\": string, \"relevant_titles\": string[] }\n\n" +
                            "Rules:\n" +
                            "1. 'summary': Choose ONLY news where Saudi Arabia (KSA) is the MAIN SUBJECT. Summarize the Saudi-specific situation in 5-10 words with a stoplight emoji (🔴🟡🟢). If no strictly relevant news, summary should be 'No immediate threats detected in KSA. 🟢'.\n" +
                            "2. 'relevant_titles': An array of titles from the provided list that are strictly and primarily about Saudi Arabia's security, economy, or direct impact. Exclude news mostly about other countries or general regional tensions unless KSA is the protagonist."
                    },
                    {
                        role: "user",
                        content: headlines
                    }
                ]
            })
        });

        if (!aiRes.ok) {
            throw new Error(`Open Router API responded with ${aiRes.status}`);
        }

        const ai = await aiRes.json();
        const aiData = JSON.parse(ai.choices?.[0]?.message?.content || "{}");
        const summary = aiData.summary || "KSA conflict summary currently unavailable. 🟡";
        const relevantTitles = aiData.relevant_titles || [];

        // Filter the keyword-filtered articles further by AI's relevance choice
        const filteredArticles = articles.filter((a: any) => 
            relevantTitles.includes(a.title)
        );

        return Response.json({
            summary,
            articles: filteredArticles
        });
    } catch (error) {
        console.error("Error in KSA conflict summary API:", error);
        return Response.json(
            { summary: "KSA conflict summary currently unavailable. 🟡", articles: [] },
            { status: 200 }
        );
    }
}
