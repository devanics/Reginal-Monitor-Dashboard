import { NextResponse } from 'next/server';

export async function GET() {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (openRouterKey) {
    try {
      const prompt = `
        Provide the current hypothetical or real intelligence status for the Strait of Hormuz. 
        Return ONLY a raw JSON object with the following schema:
        {
          "status": "CLEAR" | "CONGESTED" | "RESTRICTED",
          "risk": number (0 to 100 representing closure risk),
          "description": "A concise 1-2 sentence description of the current maritime situation."
        }
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
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (aiResp.ok) {
        const aiData = await aiResp.json();
        const content = aiData.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return NextResponse.json({
            ...parsed,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Hormuz Open Router Fetch failed:', error);
    }
  }

  // Fallback to mock data
  const statuses = ['CLEAR', 'CONGESTED', 'RESTRICTED'];
  const risks = [5, 15, 25, 40];
  const hour = new Date().getHours();
  const status = statuses[hour % statuses.length];
  const risk = risks[hour % risks.length];

  let description = "";
  if (status === 'CLEAR') description = "Normal maritime traffic flow. No significant naval disruptions detected.";
  else if (status === 'CONGESTED') description = `Increased naval presence causing shipping delays. Risk of closure: ${risk}%`;
  else description = `Elevated military activity. Commercial routing restricted. Risk of closure: ${risk}%`;

  return NextResponse.json({
    status,
    risk,
    description,
    timestamp: new Date().toISOString()
  });
}
