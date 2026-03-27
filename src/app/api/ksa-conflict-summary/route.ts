export const revalidate = 300; // 5 minutes

export async function GET() {
    try {
        // Fetch news related to conflicts near KSA using NewsData (newsdata.io)
        const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
        if (!NEWSDATA_API_KEY) {
            throw new Error('NEWSDATA_API_KEY not configured');
        }

        const newsRes = await fetch(
            `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&country=sa&q=saudi+OR+riyadh+OR+jeddah+OR+conflict+OR+unrest+OR+clashes`,
            { next: { revalidate: 900 } }
        );


        if (!newsRes.ok) {
            throw new Error(`NewsData API responded with ${newsRes.status}`);
        }

        const news = await newsRes.json();

        const articles = (news.results || [])
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


        // Generate AI summary and FILTER for strictly relevant news using OpenAI
        const openaiKey = process.env.OPENAI_API_KEY;

        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + openaiKey,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an intelligence reporting analyst. Analyze the provided news headlines and respond in JSON format. \n" +
                            "Output schema: { \"summary\": string, \"relevant_titles\": string[] }\n\n" +
                            "Rules:\n" +
                            "1. 'summary': Summarize the general Saudi-related news situation in 5-10 words with a stoplight emoji (🔴 for severe threats, 🟡 for elevated tensions, 🟢 for normal/stable). If no relevant news, summary should be 'No major KSA events reported. 🟢'.\n" +
                            "2. 'relevant_titles': An array of ALL titles from the provided list that are reasonably related to Saudi Arabia (KSA) in any way (e.g. diplomacy, economy, general news, or security). Do NOT be overly strict. Include articles involving KSA alongside other regional actors."
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
