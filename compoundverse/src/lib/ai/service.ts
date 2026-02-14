import { openai } from './client';
import { Entry } from '@/hooks/useHabits';

export async function generateStarterPack(identity: string) {
    if (!openai) return null;

    try {
        const prompt = `
        The user wants to become: "${identity}".
        Generate a "Starter Pack" of 3 atomic habits (one for Health, one for Faith/Mindset, one for Career/Growth) that would help them embody this identity.
        
        Format as JSON:
        [
            { "domain": "health", "title": "Habit Title", "intention": "1-sentence why" },
            { "domain": "faith", "title": "Habit Title", "intention": "1-sentence why" },
            { "domain": "career", "title": "Habit Title", "intention": "1-sentence why" }
        ]
        Keep titles under 6 words. Intentions under 12 words.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a habit architect." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content || '{"habits": []}';
        const result = JSON.parse(content);
        return result.habits || result; // Handle potential wrapping
    } catch (error) {
        console.error('AI Starter Pack Error:', error);
        return [
            { domain: "health", title: "Drink water", intention: "Hydration fuels focus." },
            { domain: "faith", title: "Gratitude log", intention: "Shift perspective to abundance." },
            { domain: "career", title: "Read 1 page", intention: "Small inputs lead to big outputs." }
        ];
    }
}

export async function generateGreeting(
    username: string,
    timeOfDay: string,
    currentStreak: number,
    recentMood?: string
): Promise<string> {
    if (!openai) return `Good ${timeOfDay}, ${username}.`;

    try {
        const prompt = `
        You are a supportive, stoic - but - warm habit coach.
        User: ${username}
    Time: ${timeOfDay}
    Streak: ${currentStreak} days
    Mood: ${recentMood || 'Neutral'}

        Generate a ONE - SENTENCE greeting(max 15 words) that acknowledges their streak and time of day. 
        Be inspiring but grounded.No exclamation marks unless streak > 10.
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: prompt }],
            max_tokens: 50,
            temperature: 0.7,
        });

        return response.choices[0].message.content || 'Welcome back to CompoundVerse.';
    } catch (error) {
        console.error('AI Greeting Error:', error);
        return `Good ${timeOfDay}, ${username}. Ready to build ? `;
    }
}

export async function generateWeeklyAnalysis(
    entries: Entry[],
    username: string
): Promise<{ narrative: string; tips: string[] }> {
    if (!openai) return {
        narrative: "AI Coach is currently offline.",
        tips: ["Focus on consistency."]
    };

    try {
        const activityLog = entries.slice(0, 14).map(e => ({
            date: e.date,
            score: e.dailyScore,
            domains: e.domains
        }));

        const prompt = `
        Analyze this habit data for ${username}.
        Data(last 14 days): ${JSON.stringify(activityLog)}

    1. Write a short paragraph(2 - 3 sentences) analyzing their consistency and balance(Health / Faith / Career).
        2. Provide 3 bullet - point actionable tips to improve.
        
        Return JSON format: { "narrative": "...", "tips": ["...", "...", "..."] }
        Keep tone professional yet encouraging.
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = JSON.parse(response.choices[0].message.content || '{}');
        return {
            narrative: content.narrative || "Keep consistent to see insights.",
            tips: content.tips || ["Focus on daily consistency."]
        };
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            narrative: "AI services are currently unavailable, but your data is safe.",
            tips: ["Review your daily habits manually today."]
        };
    }
}
