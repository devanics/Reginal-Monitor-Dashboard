import { NextRequest, NextResponse } from 'next/server';

// This route fetches recent news for Iran, Saudi Arabia (Saudia), and USA,
// then asks OpenRouter/Grok to decide whether each country is "Active" or "Inactive"
// in the last 10 minutes. If OpenRouter is not configured or fails, falls back to
// a simple keyword-based heuristic.

function mapToBoolFromLabel(v: any) {
    if (typeof v === 'boolean') return v;
    if (!v) return false;
    return String(v).toLowerCase().includes('active');
}

function extractJSONFromText(text: string) {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
        return JSON.parse(m[0]);
    } catch (e) {
        return null;
    }
}

async function fetchNewsHeadlinesFor(query: string) {
    const sinceIso = new Date(Date.now() - 10 * 60_000).toISOString();

    try {
        // if (process.env.NEWS_API_KEY) {
        //     const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}`;
        //     const r = await fetch(url, { headers: { Authorization: `Bearer ${process.env.NEWS_API_KEY}` } });

        //     if (!r.ok) return [];
        //     const j = await r.json();

        //     return (j.articles || []).map((a: any) => a.title).filter(Boolean).slice(0, 6);
        // }

        if (process.env.NEXT_PUBLIC_NEWSDATA_API_KEY) {
            const url = `https://newsdata.io/api/1/latest?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_API_KEY}&q=${encodeURIComponent(query)}`;
            const r = await fetch(url);
            if (!r.ok) return [];
            const j = await r.json();
            return (j.results || []).map((a: any) => a.title).filter(Boolean).slice(0, 6);
        }
    } catch (e) {
        console.error('news fetch failed', e);
    }
    return [];
}

export async function GET(req: NextRequest) {
    // Gather headlines for the three countries
    const [iranHeadlines, saudiHeadlines, usaHeadlines] = await Promise.all([
        fetchNewsHeadlinesFor('Iran OR iran attack OR iran strike'),
        fetchNewsHeadlinesFor('Saudi Arabia OR saudi OR riyadh OR jeddah OR saudi attack'),
        fetchNewsHeadlinesFor('USA OR United States OR US military OR us strike'),
    ]);


    const combined = `IRAN:\n${iranHeadlines.join('\n')}\n\nSAUDIA:\n${saudiHeadlines.join('\n')}\n\nUSA:\n${usaHeadlines.join('\n')}`;

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL = process.env.OPENROUTER_MODEL || 'grok-1';
    const OPENROUTER_URL = process.env.OPENROUTER_URL || 'https://api.openrouter.ai/v1/chat/completions';

    // If no OpenRouter key, fall back to a simple keyword heuristic (keeps dev workflow working)
    if (!OPENROUTER_API_KEY) {
        const text = (iranHeadlines.join(' ') + ' ' + saudiHeadlines.join(' ') + ' ' + usaHeadlines.join(' ')).toLowerCase();
        const getStatus = (keywords: string[]) => keywords.some(k => text.includes(k));
        const status = {
            iran: getStatus(['iran strike', 'iran missile', 'iran attack', 'iran launched', 'iran fired']),
            saudia: getStatus(['saudi attack', 'saudi strike', 'saudi airstrike', 'riyadh attack']),
            usa: getStatus(['us strike', 'us military attack', 'u.s. strike', 'us deployed']),
            ts: Date.now(),
            _source: 'news-heuristic',
        };
        return NextResponse.json({ data: status });
    }

    // Build the prompt including headlines (truncate if too large)
    const maxContextChars = 3000;
    let context = combined;
    if (context.length > maxContextChars) context = context.slice(0, maxContextChars) + '\n...';


    const userPrompt = `You are a strict analyst. Given the following recent headlines (last 10 minutes) grouped by country, decide whether each country is currently Active or Inactive in the ongoing war. Reply ONLY with a valid JSON object with keys: \"usa\", \"iran\", \"saudia\" and values must be the strings \"Active\" or \"Inactive\". Do not include any other keys or commentary. Headlines:\n\n${context}`;

    const body = {
        model: MODEL,
        messages: [
            { role: 'system', content: 'You are a concise assistant. Output only valid JSON with the exact keys: usa, iran, saudia.' },
            { role: 'user', content: userPrompt },
        ],
        temperature: 0,
    };

    let resp;
    try {
        // resp = await fetch(OPENROUTER_URL, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        //     },
        //     body: JSON.stringify(body),
        // });



        resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': "http://localhost:3000",
                'X-Title': 'Regional Monitor Dashboard'
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Return ONLY valid JSON. No text, no explanation.'
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ],
                response_format: { type: "json_object" }, // 🔥 IMPORTANT
                temperature: 0
            })
        });


    } catch (fetchErr: any) {
        console.error('OpenRouter fetch failed:', fetchErr?.message || fetchErr);
        // fallback to heuristic if model is unreachable
        const text = (iranHeadlines.join(' ') + ' ' + saudiHeadlines.join(' ') + ' ' + usaHeadlines.join(' ')).toLowerCase();
        const getStatus = (keywords: string[]) => keywords.some(k => text.includes(k));
        const status = {
            iran: getStatus(['iran strike', 'iran missile', 'iran attack', 'iran launched', 'iran fired']),
            saudia: getStatus(['saudi attack', 'saudi strike', 'saudi airstrike', 'riyadh attack']),
            usa: getStatus(['us strike', 'us military attack', 'u.s. strike', 'us deployed']),
            ts: Date.now(),
            _source: 'openrouter_unreachable_fallback',
        };
        return NextResponse.json({ data: status });
    }

    if (!resp.ok) {
        console.error('OpenRouter error', resp.status, await resp.text());
        const text = (iranHeadlines.join(' ') + ' ' + saudiHeadlines.join(' ') + ' ' + usaHeadlines.join(' ')).toLowerCase();
        const getStatus = (keywords: string[]) => keywords.some(k => text.includes(k));
        const status = {
            iran: getStatus(['iran strike', 'iran missile', 'iran attack', 'iran launched', 'iran fired']),
            saudia: getStatus(['saudi attack', 'saudi strike', 'saudi airstrike', 'riyadh attack']),
            usa: getStatus(['us strike', 'us military attack', 'u.s. strike', 'us deployed']),
            ts: Date.now(),
            _source: 'openrouter_error_fallback',
        };
        return NextResponse.json({ data: status });
    }

    const json = await resp.json();

    const candidates: string[] = [];


    if (json?.choices && Array.isArray(json.choices)) {
        for (const c of json.choices) {
            if (c?.message?.content) candidates.push(String(c.message.content));
            if (c?.message?.content?.[0]?.text) candidates.push(String(c.message.content[0].text));
            if (c?.text) candidates.push(String(c.text));
        }
    }
    if (json?.output && Array.isArray(json.output)) {
        for (const o of json.output) {
            if (typeof o === 'string') candidates.push(o);
            if (o?.content) candidates.push(JSON.stringify(o.content));
        }
    }
    candidates.push(JSON.stringify(json));


    let parsed: any = null;
    for (const c of candidates) {
        const p = extractJSONFromText(c);
        if (p && typeof p === 'object') {
            parsed = p;
            break;
        }
    }

    if (!parsed) {
        console.error('Failed to parse JSON from OpenRouter response');
        const text = (iranHeadlines.join(' ') + ' ' + saudiHeadlines.join(' ') + ' ' + usaHeadlines.join(' ')).toLowerCase();
        const getStatus = (keywords: string[]) => keywords.some(k => text.includes(k));
        const status = {
            iran: getStatus(['iran strike', 'iran missile', 'iran attack', 'iran launched', 'iran fired']),
            saudia: getStatus(['saudi attack', 'saudi strike', 'saudi airstrike', 'riyadh attack']),
            usa: getStatus(['us strike', 'us military attack', 'u.s. strike', 'us deployed']),
            ts: Date.now(),
            _source: 'parse_failed_fallback',
        };
        return NextResponse.json({ data: status });
    }

    const result = {
        usa: mapToBoolFromLabel(parsed.usa),
        iran: mapToBoolFromLabel(parsed.iran),
        saudia: mapToBoolFromLabel(parsed.saudia ?? parsed.saudi ?? parsed.saudi_arabia),
        ts: Date.now(),
        _source: 'openrouter',
        _raw: parsed,
    };

    return NextResponse.json({ data: result });
}
