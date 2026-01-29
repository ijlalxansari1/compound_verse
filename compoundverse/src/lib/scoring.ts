// ========================================
// Compoundverse - Scoring Logic
// ========================================

import { HabitData, Entry, getToday, getYesterday } from './storage';

export interface ScoreResult {
    dailyScore: number;
    activeDay: number;
    strongDay: number;
    perfectDay: number;
    xpEarned: number;
}

export function calculateScore(
    checkedDomains: Record<string, number>,
    activeDomainIds: string[]
): ScoreResult {
    const dailyScore = Object.values(checkedDomains).reduce((sum, val) => sum + (val || 0), 0);
    const activeDay = dailyScore >= 1 ? 1 : 0;
    const strongDay = dailyScore >= 2 ? 1 : 0;

    // Perfect day = all active domains completed
    const activeCount = activeDomainIds.length;
    const perfectDay = (activeCount > 0 && dailyScore === activeCount) ? 1 : 0;

    const xpEarned = dailyScore + (perfectDay ? 1 : 0); // Bonus XP for perfect day

    return { dailyScore, activeDay, strongDay, perfectDay, xpEarned };
}

export function updateStreak(data: HabitData, activeDay: number): void {
    const today = getToday();
    const yesterday = getYesterday();

    // Find last entry that's not today
    const lastEntry = data.entries
        .filter(e => e.date !== today)
        .sort((a, b) => b.date.localeCompare(a.date))[0];

    const todayExists = data.entries.some(e => e.date === today);

    if (activeDay) {
        if (lastEntry && lastEntry.date === yesterday && lastEntry.activeDay) {
            // Continue streak
            data.stats.currentStreak += 1;
        } else if (!todayExists) {
            // Start new streak
            data.stats.currentStreak = 1;
        }
        // Update longest streak
        if (data.stats.currentStreak > data.stats.longestStreak) {
            data.stats.longestStreak = data.stats.currentStreak;
        }
    } else if (!todayExists) {
        // Reset streak on inactive day
        data.stats.currentStreak = 0;
    }
}

export function checkStreakOnLoad(data: HabitData): void {
    const yesterday = getYesterday();
    const today = getToday();

    const yesterdayEntry = data.entries.find(e => e.date === yesterday);
    const todayEntry = data.entries.find(e => e.date === today);

    // Reset streak if missed yesterday and haven't submitted today
    if (!todayEntry && (!yesterdayEntry || !yesterdayEntry.activeDay)) {
        data.stats.currentStreak = 0;
    }
}

export function countDomain(entries: Entry[], domainId: string): number {
    return entries.filter(e => {
        const val = e.domains ? e.domains[domainId] : (e as any)[domainId];
        return val === 1;
    }).length;
}
