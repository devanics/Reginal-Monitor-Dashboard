import { CURATED_COUNTRIES, TIER1_COUNTRIES_LIST, DEFAULT_BASELINE_RISK, DEFAULT_EVENT_MULTIPLIER } from './constants';
import { fetchAcled } from './acled';
import { fetchUcdp } from './ucdp';
import { fetchFirms } from './firms';

export interface ComponentScores {
  unrest: number;
  conflict: number;
  security: number;
  information: number;
}

export interface CiiScore {
  code: string;
  name: string;
  score: number;
  level: 'low' | 'normal' | 'elevated' | 'high' | 'critical';
  trend: 'rising' | 'stable' | 'falling';
  change24h: number;
  components: ComponentScores;
  lastUpdated: string;
  stats: any; // For detailed view compatibility
}

export async function computeCIIScores(targetCountry?: string): Promise<CiiScore[]> {
  const codes = targetCountry ? [targetCountry] : Object.keys(TIER1_COUNTRIES_LIST);
  
  // 1. Fetch data for all required sources
  // For a truly exact port, we'd fetch globally and then map, 
  // but for on-demand we'll fetch per country or use a shared cache if implemented.
  
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const todayStr = now.toISOString().split('T')[0];

  const scores: CiiScore[] = [];

  for (const code of codes) {
    const config = CURATED_COUNTRIES[code] || {
      name: TIER1_COUNTRIES_LIST[code] || code,
      baselineRisk: DEFAULT_BASELINE_RISK,
      eventMultiplier: DEFAULT_EVENT_MULTIPLIER,
      scoringKeywords: [code.toLowerCase()],
      searchAliases: [code.toLowerCase()],
    };

    // Parallel fetch for the specific country
    const [acledEvents, ucdpEvents, fires] = await Promise.all([
      fetchAcled({
        eventTypes: 'Protests|Riots|Battles|Explosions/Remote violence|Violence against civilians',
        startDate: sevenDaysAgo,
        endDate: todayStr,
        country: config.name,
      }),
      fetchUcdp(config.name),
      // For FIRMS we need a BBOX. I'll use a simplified mapping or skip if bbox not found.
      Promise.resolve([]), 
    ]);

    // 2. Component Logic (Ported from get-risk-scores.ts)
    
    // Component A: Unrest (Protests/Riots)
    const protestCount = acledEvents.filter(e => e.event_type === 'Protests' || e.event_type === 'Riots').length;
    let unrest = Math.min(100, (protestCount * 5 * config.eventMultiplier));
    
    // Component B: Conflict (Violence/Battles/War)
    const violenceCount = acledEvents.filter(e => e.event_type !== 'Protests' && e.event_type !== 'Riots').length;
    const ucdpIntensity = ucdpEvents.length; // Simplified proxy for intensity
    let conflict = Math.min(100, (violenceCount * 10 * config.eventMultiplier) + (ucdpIntensity * 5));

    // Component C: Security (Fires/Cyber/Flights)
    // Placeholder for cyber/flights which require existing API hooks
    let security = Math.min(100, (fires.length * 2) + 10); // Standard baseline + signals

    // Component D: Information (News)
    // We'll leave this at a baseline or integrate NewsAPI if available in the route
    let information = 15;

    // 3. Blending Formula
    // score = (baseline * 0.4) + (weightedEvents * 0.6)
    const eventScore = (unrest * 0.25) + (conflict * 0.4) + (security * 0.2) + (information * 0.15);
    let combinedScore = Math.floor((config.baselineRisk * 0.4) + (eventScore * 0.6));

    // 4. Intensity Floors
    if (conflict > 70 || ucdpIntensity > 20) combinedScore = Math.max(combinedScore, 75); // War floor
    if (unrest > 80) combinedScore = Math.max(combinedScore, 65); // Civil unrest floor

    // Cap at 100
    combinedScore = Math.min(100, combinedScore);

    const result = {
      code,
      name: config.name,
      score: combinedScore,
      level: getLevel(combinedScore),
      trend: 'stable' as const, 
      change24h: 0,
      components: {
        unrest: Math.floor(unrest),
        conflict: Math.floor(conflict),
        security: Math.floor(security),
        information: Math.floor(information),
      },
      lastUpdated: now.toISOString(),
      stats: {
        index: combinedScore,
        status: getLevel(combinedScore),
        unrest: Math.floor(unrest),
        conflict: Math.floor(conflict),
        security: Math.floor(security),
        information: Math.floor(information),
        protests: protestCount,
        strikes: violenceCount,
      }
    };

    console.log(`[CII] ${code}: Score=${combinedScore} (U:${result.components.unrest} C:${result.components.conflict} S:${result.components.security} I:${result.components.information})`);
    scores.push(result);
  }

  return scores;
}

function getLevel(score: number): 'low' | 'normal' | 'elevated' | 'high' | 'critical' {
  if (score >= 70) return 'critical';
  if (score >= 55) return 'high';
  if (score >= 40) return 'elevated';
  if (score >= 25) return 'normal';
  return 'low';
}
