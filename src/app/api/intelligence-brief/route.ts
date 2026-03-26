import { NextRequest, NextResponse } from 'next/server';
import { computeCIIScores } from '@/lib/intelligence/scoring';

/**
 * Country Instability Index (CII) API
 * Provides a high-fidelity intelligence-blended score for countries.
 * Ported from worldmonitor_open_source reference.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const countryCode = searchParams.get('country')?.toUpperCase();
    const list = searchParams.get('list') === 'true';

    try {
        if (list) {
            // Return list of all tier-1 countries with their current scores
            const scores = await computeCIIScores();
            return NextResponse.json({ countries: scores });
        }

        if (countryCode) {
            // Return detailed view for a specific country
            const scores = await computeCIIScores(countryCode);
            if (scores.length === 0) {
                return NextResponse.json({ error: 'Country not found' }, { status: 404 });
            }
            
            const detailed = scores[0];
            const stats = detailed.stats;

            // Optional: AI Brief integration (matches previous implementation pattern)
            let brief = "";
            const openaiKey = process.env.OPENAI_API_KEY;

            if (openaiKey) {
                try {
                    const prompt = `
                        Provide a concise intelligence brief for ${detailed.name} based on these metrics:
                        Unrest ${stats.unrest}, Conflict ${stats.conflict}, Security ${stats.security}.
                        Current Stability Index: ${stats.index}/100 (${detailed.level}).
                        Maintain a professional, analytic tone. Keep it under 150 words.
                    `;

                    const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${openaiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o-mini',
                            messages: [{ role: 'user', content: prompt }],
                            temperature: 0.3
                        })
                    });

                    if (aiResp.ok) {
                        const aiData = await aiResp.json();
                        brief = aiData.choices[0]?.message?.content || "";
                    }
                } catch (aiErr) {
                    console.error('[AI Brief] failed:', aiErr);
                }
            }

            if (!brief) {
                const isStable = detailed.level === 'low' || detailed.level === 'normal';
                brief = `## Intelligence Brief: ${detailed.name} — ${new Date().toISOString().split('T')[0]}\n\n${detailed.name} is currently showing a Country Instability Index of ${stats.index}/100. ${isStable ? 'The situation remains largely stable with localized monitoring in effect.' : 'Heightened vigilance is recommended due to increasing signals of unrest or regional tension.'} Dynamic monitoring indicates ${stats.conflict > 40 ? 'elevated conflict' : 'normal state'} markers.`;
            }

            return NextResponse.json({ 
                stats, 
                brief,
                metadata: {
                    lastUpdated: detailed.lastUpdated,
                    source: 'GEO-INTELLIGENCE'
                }
            });
        }

        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    } catch (err: any) {
        console.error('[CII API] Error:', err);
        return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
    }
}
