// ========================================
// Compoundverse - Momentum System
// Rolling window calculation that replaces brittle streaks
// ========================================

import { Entry, HabitData, getToday } from './storage';

export interface MomentumResult {
    score: number;              // 0-100 percentage
    window: number;             // Days in calculation window (7 or 14)
    activeDays: number;         // Days with any activity in window
    totalDays: number;          // Total days that could have activity
    trend: 'rising' | 'stable' | 'falling';
    message: string;            // Calm, grounded message
    isProtected: boolean;       // If streak is currently frozen
}

export interface PanicDayEntry {
    date: string;
    isPanicDay: boolean;
}

const WINDOW_SHORT = 7;
const WINDOW_LONG = 14;
const ESTABLISHED_USER_THRESHOLD = 14; // Days before using long window

// Calm, grounded messages - no moralizing
const MOMENTUM_MESSAGES = {
    high_rising: "Momentum building quietly.",
    high_stable: "You're in a good rhythm.",
    high_falling: "Still strong. One day changes nothing.",
    medium_rising: "Moving in the right direction.",
    medium_stable: "You're still in motion.",
    medium_falling: "Pattern matters more than any single day.",
    low_rising: "Something is better than nothing.",
    low_stable: "Showing up is what counts.",
    low_falling: "You're here now. That matters.",
    protected: "Protected day. No penalty.",
    zero: "Ready when you are."
};

/**
 * Calculate momentum score based on rolling window
 * Missed days reduce momentum gradually, NEVER reset to zero
 */
export function calculateMomentum(data: HabitData, panicDays: string[] = []): MomentumResult {
    const entries = data.entries;
    const today = getToday();

    // Determine window size based on user history
    const totalEntryDays = entries.length;
    const window = totalEntryDays >= ESTABLISHED_USER_THRESHOLD ? WINDOW_LONG : WINDOW_SHORT;

    // Get dates for the window
    const windowDates = getWindowDates(window);

    // Count active days in window
    const entriesInWindow = entries.filter(e => windowDates.includes(e.date));
    const activeDays = entriesInWindow.filter(e => e.activeDay === 1).length;

    // Count panic days (protected, don't count against user)
    const panicDaysInWindow = panicDays.filter(d => windowDates.includes(d)).length;

    // Effective days = window - panic days (protected days don't count against)
    const effectiveDays = window - panicDaysInWindow;

    // Calculate score (0-100)
    const score = effectiveDays > 0
        ? Math.round((activeDays / effectiveDays) * 100)
        : 0;

    // Calculate trend by comparing recent vs older half
    const trend = calculateTrend(entries, windowDates);

    // Check if currently in protected state
    const isProtected = panicDays.includes(today);

    // Generate appropriate message
    const message = generateMessage(score, trend, isProtected);

    return {
        score,
        window,
        activeDays,
        totalDays: effectiveDays,
        trend,
        message,
        isProtected
    };
}

/**
 * Get array of date strings for the rolling window
 */
function getWindowDates(window: number): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < window; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().slice(0, 10));
    }

    return dates;
}

/**
 * Calculate trend by comparing recent half vs older half of window
 */
function calculateTrend(entries: Entry[], windowDates: string[]): 'rising' | 'stable' | 'falling' {
    const halfWindow = Math.floor(windowDates.length / 2);
    const recentDates = windowDates.slice(0, halfWindow);
    const olderDates = windowDates.slice(halfWindow);

    const recentActive = entries.filter(e =>
        recentDates.includes(e.date) && e.activeDay === 1
    ).length;

    const olderActive = entries.filter(e =>
        olderDates.includes(e.date) && e.activeDay === 1
    ).length;

    // Normalize for window size differences
    const recentRate = recentActive / recentDates.length;
    const olderRate = olderActive / olderDates.length;

    const diff = recentRate - olderRate;

    if (diff > 0.1) return 'rising';
    if (diff < -0.1) return 'falling';
    return 'stable';
}

/**
 * Generate calm, grounded message based on score and trend
 */
function generateMessage(score: number, trend: 'rising' | 'stable' | 'falling', isProtected: boolean): string {
    if (isProtected) {
        return MOMENTUM_MESSAGES.protected;
    }

    if (score === 0) {
        return MOMENTUM_MESSAGES.zero;
    }

    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    const key = `${level}_${trend}` as keyof typeof MOMENTUM_MESSAGES;

    return MOMENTUM_MESSAGES[key] || MOMENTUM_MESSAGES.medium_stable;
}

/**
 * Check if user has enough history for long window
 */
export function shouldUseLongWindow(data: HabitData): boolean {
    return data.entries.length >= ESTABLISHED_USER_THRESHOLD;
}

/**
 * Get momentum trend icon
 */
export function getTrendIcon(trend: 'rising' | 'stable' | 'falling'): string {
    switch (trend) {
        case 'rising': return '↗';
        case 'falling': return '↘';
        default: return '→';
    }
}
