import { NextResponse } from 'next/server';

export async function GET() {
  const openAIKey = process.env.OPENAI_API_KEY;

  if (openAIKey) {
    try {
      const prompt = `
        Provide the current hypothetical or real operational status for these 5 major Middle East airports: DXB (Dubai), DOH (Doha), TLV (Tel Aviv), AMM (Amman), and BEY (Beirut).
        Return ONLY a raw JSON object with the following schema:
        {
          "airports": [
            { "code": "string", "name": "string", "status": "OPERATIONAL" | "DELAYS" | "RESTRICTED" | "CLOSED" }
          ]
        }
      `;

      const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
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
          return NextResponse.json(parsed);
        }
      }
    } catch (error) {
      console.error('Airports OpenAI Fetch failed:', error);
    }
  }

  // Fallback to mock
  const airports = [
    { code: 'DXB', name: 'Dubai', status: 'OPERATIONAL' },
    { code: 'DOH', name: 'Doha', status: 'OPERATIONAL' },
    { code: 'TLV', name: 'Tel Aviv', status: 'DELAYS' },
    { code: 'AMM', name: 'Amman', status: 'OPERATIONAL' },
    { code: 'BEY', name: 'Beirut', status: 'RESTRICTED' }
  ];

  return NextResponse.json({ airports });
}
