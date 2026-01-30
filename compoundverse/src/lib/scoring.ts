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
    // Use recalculateStreak for accuracy - this handles all edge cases
    // including first check-in, gaps, and continuing streaks
    if (activeDay) {
        const streak = recalculateStreak(data.entries);
        data.stats.currentStreak = streak.current;

        // Update longest streak
        if (data.stats.currentStreak > data.stats.longestStreak) {
            data.stats.longestStreak = data.stats.currentStreak;
        }
    } else {
        // Inactive day - recalculate to see if streak is still valid
        const streak = recalculateStreak(data.entries);
        data.stats.currentStreak = streak.current;
    }
}

export function checkStreakOnLoad(data: HabitData): void {
    // Recalculate streak from entries to ensure accuracy
    const streak = recalculateStreak(data.entries);
    data.stats.currentStreak = streak.current;

    // Also update longest streak if current is higher
    if (streak.current > data.stats.longestStreak) {
        data.stats.longestStreak = streak.current;
    }
}

/**
 * Recalculate streak from all entries
 * Counts consecutive active days backward from today/yesterday
 */
export function recalculateStreak(entries: Entry[]): { current: number; longest: number } {
    if (entries.length === 0) {
        return { current: 0, longest: 0 };
    }

    // Sort entries by date descending (most recent first)
    const sortedEntries = [...entries]
        .filter(e => e.activeDay === 1)
        .sort((a, b) => b.date.localeCompare(a.date));

    if (sortedEntries.length === 0) {
        return { current: 0, longest: 0 };
    }

    const today = getToday();
    const yesterday = getYesterday();

    // Check if streak is still active (has entry for today or yesterday)
    const mostRecentDate = sortedEntries[0].date;
    const isStreakActive = mostRecentDate === today || mostRecentDate === yesterday;

    if (!isStreakActive) {
        // Streak is broken - no active day today or yesterday
        return { current: 0, longest: calculateLongestStreak(entries) };
    }

    // Count consecutive days backward
    let currentStreak = 0;
    let checkDate = new Date(mostRecentDate);

    for (const entry of sortedEntries) {
        const entryDate = entry.date;
        const expectedDate = checkDate.toISOString().slice(0, 10);

        if (entryDate === expectedDate) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (entryDate < expectedDate) {
            // Gap in streak
            break;
        }
    }

    return {
        current: currentStreak,
        longest: Math.max(currentStreak, calculateLongestStreak(entries))
    };
}

/**
 * Calculate the longest streak from all entries
 */
function calculateLongestStreak(entries: Entry[]): number {
    if (entries.length === 0) return 0;

    const activeEntries = entries
        .filter(e => e.activeDay === 1)
        .sort((a, b) => a.date.localeCompare(b.date));

    if (activeEntries.length === 0) return 0;

    let longest = 1;
    let current = 1;

    for (let i = 1; i < activeEntries.length; i++) {
        const prevDate = new Date(activeEntries[i - 1].date);
        const currDate = new Date(activeEntries[i].date);

        // Check if dates are consecutive
        prevDate.setDate(prevDate.getDate() + 1);

        if (prevDate.toISOString().slice(0, 10) === currDate.toISOString().slice(0, 10)) {
            current++;
            longest = Math.max(longest, current);
        } else {
            current = 1;
        }
    }

    return longest;
}

export function countDomain(entries: Entry[], domainId: string): number {
    return entries.filter(e => {
        const val = e.domains ? e.domains[domainId] : (e as any)[domainId];
        return val === 1;
    }).length;
}
