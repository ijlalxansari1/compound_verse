import type { Entry } from '@/hooks/useHabits';

const MAX_USERNAME_LENGTH = 40;
const MAX_IDENTITY_LENGTH = 120;
const MAX_MOOD_LENGTH = 80;
const MAX_ENTRIES = 60;

interface GreetingPayload {
  username: string;
  timeOfDay: string;
  currentStreak: number;
  recentMood?: string;
}

interface StarterPackPayload {
  identity: string;
}

interface AnalysisPayload {
  username: string;
  entries: Entry[];
}

export type AiRequest =
  | { action: 'greeting'; payload: GreetingPayload }
  | { action: 'starter_pack'; payload: StarterPackPayload }
  | { action: 'analysis'; payload: AnalysisPayload };

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function asTrimmedString(value: unknown, maxLen: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLen) return null;
  return normalized;
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

function asEntries(value: unknown): Entry[] | null {
  if (!Array.isArray(value) || value.length > MAX_ENTRIES) return null;

  const valid = value.every((entry) => {
    if (!isObject(entry)) return false;
    return (
      typeof entry.date === 'string' &&
      isObject(entry.domains) &&
      typeof entry.dailyScore === 'number' &&
      Number.isFinite(entry.dailyScore)
    );
  });

  return valid ? (value as Entry[]) : null;
}

export function validateAiRequest(body: unknown): AiRequest | null {
  if (!isObject(body)) return null;

  const action = body.action;
  const payload = body.payload;

  if (action !== 'greeting' && action !== 'starter_pack' && action !== 'analysis') {
    return null;
  }

  if (!isObject(payload)) return null;

  if (action === 'greeting') {
    const username = asTrimmedString(payload.username, MAX_USERNAME_LENGTH);
    const timeOfDay = asTrimmedString(payload.timeOfDay, 20);
    const currentStreak = asFiniteNumber(payload.currentStreak);
    const recentMoodRaw = payload.recentMood;
    const recentMood =
      recentMoodRaw === undefined ? undefined : asTrimmedString(recentMoodRaw, MAX_MOOD_LENGTH);

    if (!username || !timeOfDay || currentStreak === null) return null;
    if (recentMoodRaw !== undefined && !recentMood) return null;

    return {
      action,
      payload: {
        username,
        timeOfDay,
        currentStreak: Math.max(0, Math.floor(currentStreak)),
        recentMood,
      },
    };
  }

  if (action === 'starter_pack') {
    const identity = asTrimmedString(payload.identity, MAX_IDENTITY_LENGTH);
    if (!identity) return null;

    return { action, payload: { identity } };
  }

  const username = asTrimmedString(payload.username, MAX_USERNAME_LENGTH);
  const entries = asEntries(payload.entries);
  if (!username || !entries) return null;

  return {
    action,
    payload: {
      username,
      entries,
    },
  };
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown';
}
