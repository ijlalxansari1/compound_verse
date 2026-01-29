/**
 * Weekly Reflections - Pattern Analysis and Gentle Insights
 * 
 * Provides AI-like pattern observation without AI:
 * - No predictions
 * - No moral judgments
 * - Observational, not prescriptive
 */

import { HabitData, Entry } from './storage';
import { calculateMomentum, MomentumResult } from './momentum';
import { getPanicDays } from './panic';

export interface WeeklyReflection {
    weekStart: string;
    weekEnd: string;
    daysLogged: number;
    activeDays: number;
    strongDays: number;
    perfectDays: number;
    protectedDays: number;
    dominantDomain: string | null;
    weakestDomain: string | null;
    momentum: MomentumResult;
    narrative: string;
    observation: string;
    gentlePrompt: string | null;
}

/**
 * Get entries from the last 7 days
 */
function getLastWeekEntries(data: HabitData): Entry[] {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    return data.entries
        .filter(e => e.date >= weekAgoStr)
        .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Analyze domain engagement
 */
function analyzeDomains(entries: Entry[]): { dominant: string | null; weakest: string | null } {
    if (entries.length === 0) return { dominant: null, weakest: null };

    const totals = {
        health: entries.reduce((sum, e) => sum + e.health, 0),
        faith: entries.reduce((sum, e) => sum + e.faith, 0),
        career: entries.reduce((sum, e) => sum + e.career, 0)
    };

    const domains = Object.entries(totals).sort((a, b) => b[1] - a[1]);

    return {
        dominant: domains[0][1] > 0 ? domains[0][0] : null,
        weakest: domains[2][1] < domains[0][1] ? domains[2][0] : null
    };
}

/**
 * Generate narrative summary (observational, not judgmental)
 */
function generateNarrative(
    daysLogged: number,
    activeDays: number,
    protectedDays: number,
    momentum: MomentumResult
): string {
    if (daysLogged === 0) {
        return "This week is a fresh start.";
    }

    const parts: string[] = [];

    // Days logged observation
    if (daysLogged === 7) {
        parts.push("You showed up every day this week.");
    } else if (daysLogged >= 5) {
        parts.push(`You checked in ${daysLogged} of 7 days.`);
    } else if (daysLogged >= 3) {
        parts.push(`You checked in ${daysLogged} days this week.`);
    } else {
        parts.push(`${daysLogged} check-in${daysLogged === 1 ? '' : 's'} this week.`);
    }

    // Protected days observation (no judgment)
    if (protectedDays > 0) {
        parts.push(`${protectedDays} day${protectedDays === 1 ? ' was' : 's were'} protected.`);
    }

    // Momentum observation
    if (momentum.trend === 'rising') {
        parts.push("Momentum is building.");
    } else if (momentum.trend === 'stable') {
        parts.push("Momentum is steady.");
    } else if (momentum.trend === 'falling' && momentum.score > 50) {
        parts.push("Momentum dipped slightly.");
    }

    return parts.join(' ');
}

/**
 * Generate pattern observation (without advice)
 */
function generateObservation(
    entries: Entry[],
    dominant: string | null,
    weakest: string | null
): string {
    if (entries.length < 3) {
        return "Not enough data for patterns yet.";
    }

    const observations: string[] = [];

    // Domain balance observation
    if (dominant && weakest && dominant !== weakest) {
        const domainNames: Record<string, string> = {
            health: 'Health',
            faith: 'Faith',
            career: 'Career'
        };
        observations.push(`${domainNames[dominant]} had the most activity. ${domainNames[weakest]} had the least.`);
    }

    // Perfect day observation
    const perfectCount = entries.filter(e => e.perfectDay).length;
    if (perfectCount >= 3) {
        observations.push(`${perfectCount} perfect days.`);
    } else if (perfectCount > 0) {
        observations.push(`${perfectCount} perfect day${perfectCount === 1 ? '' : 's'}.`);
    }

    // Consistency observation
    const activeRate = entries.filter(e => e.activeDay).length / entries.length;
    if (activeRate >= 0.8) {
        observations.push("High consistency this week.");
    } else if (activeRate >= 0.5) {
        observations.push("Moderate consistency.");
    }

    return observations.length > 0 ? observations.join(' ') : "Patterns are still forming.";
}

/**
 * Generate gentle prompt (optional, never preachy)
 */
function generateGentlePrompt(
    entries: Entry[],
    protectedDays: number,
    momentum: MomentumResult
): string | null {
    // Silence is valid - don't always give a prompt
    const rand = Math.random();
    if (rand < 0.3) return null;

    // After protected days, be extra gentle
    if (protectedDays > 2) {
        const gentlePrompts = [
            "Rest is part of the process.",
            "You're still here. That counts.",
            null
        ];
        return gentlePrompts[Math.floor(Math.random() * gentlePrompts.length)];
    }

    // High momentum - acknowledge without hype
    if (momentum.score >= 80) {
        const highPrompts = [
            "Steady progress.",
            "The work is adding up.",
            null
        ];
        return highPrompts[Math.floor(Math.random() * highPrompts.length)];
    }

    // Lower momentum - gentle, no shame
    if (momentum.score < 40 && entries.length > 3) {
        const lowPrompts = [
            "One small action is enough.",
            "Start where you are.",
            null
        ];
        return lowPrompts[Math.floor(Math.random() * lowPrompts.length)];
    }

    // Default - sometimes silence
    const defaultPrompts = [
        "Consistency compounds quietly.",
        "You showed up.",
        null,
        null
    ];
    return defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
}

/**
 * Generate weekly reflection
 */
export function generateWeeklyReflection(data: HabitData): WeeklyReflection {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const entries = getLastWeekEntries(data);
    const panicDays = getPanicDays();
    const momentum = calculateMomentum(data, panicDays);

    const daysLogged = entries.length;
    const activeDays = entries.filter(e => e.activeDay).length;
    const strongDays = entries.filter(e => e.strongDay).length;
    const perfectDays = entries.filter(e => e.perfectDay).length;

    // Count protected days in the last week
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const protectedDays = panicDays.filter(d => d >= weekAgoStr).length;

    const { dominant, weakest } = analyzeDomains(entries);

    return {
        weekStart: weekAgo.toISOString().split('T')[0],
        weekEnd: today.toISOString().split('T')[0],
        daysLogged,
        activeDays,
        strongDays,
        perfectDays,
        protectedDays,
        dominantDomain: dominant,
        weakestDomain: weakest,
        momentum,
        narrative: generateNarrative(daysLogged, activeDays, protectedDays, momentum),
        observation: generateObservation(entries, dominant, weakest),
        gentlePrompt: generateGentlePrompt(entries, protectedDays, momentum)
    };
}

/**
 * Get all weekly reflections (historical)
 */
export function getReflectionHistory(): WeeklyReflection[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('compoundverse_reflections');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return [];
        }
    }
    return [];
}

/**
 * Save weekly reflection
 */
export function saveReflection(reflection: WeeklyReflection): void {
    if (typeof window === 'undefined') return;
    const history = getReflectionHistory();

    // Avoid duplicates for same week
    const existingIndex = history.findIndex(r => r.weekEnd === reflection.weekEnd);
    if (existingIndex >= 0) {
        history[existingIndex] = reflection;
    } else {
        history.push(reflection);
    }

    // Keep last 12 weeks max
    const trimmed = history.slice(-12);
    localStorage.setItem('compoundverse_reflections', JSON.stringify(trimmed));
}
