require('dotenv').config({path: '.env.local'});

(async () => {
    try {
        const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
        console.log('Key exists:', !!NEWSDATA_API_KEY);
        
        const url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&country=sa&q=saudi OR riyadh OR jeddah OR conflict OR unrest OR clashes`;
        console.log('Calling URL:', url.replace(NEWSDATA_API_KEY, 'HIDDEN'));
        
        const response = await fetch(url);
        if(!response.ok) {
            console.log('Error:', response.status);
            console.log(await response.text());
            return;
        }
        
        const data = await response.json();
        console.log('Status:', data.status);
        console.log('Results count:', data.results?.length);
        
        if(data.results?.[0]) {
            console.log('Sample title 1:', data.results[0].title);
        }
        if(data.results?.[1]) {
            console.log('Sample title 2:', data.results[1].title);
        }
        
        const articles = (data.results || [])
            .filter((a) => {
                const searchStr = `${a.title} ${a.description} ${a.content}`.toLowerCase();
                return searchStr.includes('saudi') || searchStr.includes('ksa') || searchStr.includes('riyadh');
            })
            .slice(0, 8);
            
        console.log('Filtered articles count (client-side matching saudi/ksa/riyadh):', articles.length);
        
        if (articles.length === 0) {
            console.log("No articles left. Exiting.");
            return;
        }

        const headlines = articles.map((a) => a.title).join("\n");
        console.log("Passing these to AI:");
        console.log(headlines);
        
        // NOW check AI
        const openaiKey = process.env.OPENAI_API_KEY;
        console.log('OpenAI Key exists:', !!openaiKey);
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
            console.log("OpenAI Error:", aiRes.status);
            console.log(await aiRes.text());
            return;
        }

        const ai = await aiRes.json();
        const aiData = JSON.parse(ai.choices?.[0]?.message?.content || "{}");
        console.log("AI parsed data:", aiData);

    } catch(err) {
        console.error("Caught exception:", err);
    }
})();
