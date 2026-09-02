import type { Guidance } from '@/types';
import { FALLBACK_GUIDANCE } from '@/data/fallbackGuidance';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emergency-guidance`;
const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export const FALLBACK_MESSAGE =
  'AI guidance is unavailable. Call emergency services and follow the dispatcher’s instructions.';

export interface GuidanceResult {
  guidance: Guidance;
  usedFallback: boolean;
  error?: string;
}

function classifyFallback(description: string): Guidance {
  const text = description.toLowerCase();
  const matchers: Array<[string[], keyof typeof FALLBACK_GUIDANCE]> = [
    [['bleed', 'blood', 'cut', 'wound'], 'severe_bleeding'],
    [['breath', 'choking', 'asthma', 'wheez', 'cannot breathe'], 'trouble_breathing'],
    [['unconscious', 'unresponsive', 'not responding', 'passed out', 'fainted'], 'unconscious'],
    [['chest pain', 'heart', 'chest pressure', 'chest tight'], 'chest_pain'],
    [['fire', 'smoke', 'burn', 'flame', 'burning'], 'fire_smoke'],
    [['poison', 'overdose', 'swallowed', 'toxic', 'chemical'], 'poisoning'],
    [['mental health', 'suicide', 'suicidal', 'self-harm', 'self harm', 'hurt myself', 'kill myself', 'end my life', 'crisis', 'depressed', 'hopeless'], 'mental_health_crisis'],
    [['broken', 'fracture', 'injury', 'fell', 'fall', 'sprain'], 'serious_injury'],
    [['unsafe', 'violent', 'attack', 'threat', 'weapon', 'assault', 'fight'], 'unsafe_violent'],
  ];

  for (const [keywords, category] of matchers) {
    if (keywords.some((kw) => text.includes(kw))) {
      return FALLBACK_GUIDANCE[category];
    }
  }
  return FALLBACK_GUIDANCE.other;
}

function validateGuidance(value: unknown): value is Guidance {
  if (typeof value !== 'object' || value === null) return false;
  const g = value as Record<string, unknown>;
  return (
    typeof g.emergencyType === 'string' &&
    ['immediate', 'urgent', 'caution'].includes(g.urgency as string) &&
    typeof g.openingMessage === 'string' &&
    Array.isArray(g.steps) &&
    Array.isArray(g.doNotDo) &&
    typeof g.dispatcherSummary === 'string'
  );
}

export async function fetchGuidance(description: string): Promise<GuidanceResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ description }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Request failed (${res.status}).`);
    }

    const data = await res.json();
    if (!validateGuidance(data)) {
      throw new Error('Received invalid guidance from the server.');
    }

    return {
      guidance: { ...data, source: 'ai' } as Guidance,
      usedFallback: false,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === 'AbortError'
          ? 'The request timed out.'
          : err.message
        : 'Unable to reach the guidance service.';
    return {
      guidance: classifyFallback(description),
      usedFallback: true,
      error: message,
    };
  }
}
