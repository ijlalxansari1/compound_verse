import { NextResponse } from 'next/server';
import { generateGreeting, generateWeeklyAnalysis, generateStarterPack } from '@/lib/ai/service';
import { getClientIp, validateAiRequest } from '@/lib/api/validation';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 20;
const requestWindow = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = requestWindow.get(ip);

  if (!current || current.expiresAt <= now) {
    requestWindow.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_REQUESTS) return true;

  current.count += 1;
  requestWindow.set(ip, current);
  return false;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body: unknown = await request.json();
    const validated = validateAiRequest(body);

    if (!validated) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    switch (validated.action) {
      case 'greeting': {
        const greeting = await generateGreeting(
          validated.payload.username,
          validated.payload.timeOfDay,
          validated.payload.currentStreak,
          validated.payload.recentMood
        );

        return NextResponse.json({ greeting });
      }

      case 'starter_pack': {
        const starterPack = await generateStarterPack(validated.payload.identity);
        return NextResponse.json({ starterPack });
      }

      case 'analysis': {
        const analysis = await generateWeeklyAnalysis(validated.payload.entries, validated.payload.username);
        return NextResponse.json(analysis);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
