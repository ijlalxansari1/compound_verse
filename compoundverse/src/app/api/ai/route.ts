
import { NextResponse } from 'next/server';
import { generateGreeting, generateWeeklyAnalysis, generateStarterPack } from '@/lib/ai/service';

export async function POST(request: Request) {
    try {
        const { action, payload } = await request.json();

        switch (action) {
            case 'greeting':
                const greeting = await generateGreeting(
                    payload.username,
                    payload.timeOfDay,
                    payload.currentStreak,
                    payload.recentMood
                );
                return NextResponse.json({ greeting });

            case 'starter_pack':
                const starterPack = await generateStarterPack(payload.identity);
                return NextResponse.json({ starterPack });

            case 'analysis':
                const analysis = await generateWeeklyAnalysis(
                    payload.entries,
                    payload.username
                );
                return NextResponse.json(analysis);

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
