// ========================================
// Compoundverse - Badge System
// ========================================

import { Stats, Entry } from './storage';
import { countDomain } from './scoring';

export interface Badge {
    id: string;
    icon: string;
    name: string;
    description: string;
    condition: (stats: Stats, entries: Entry[]) => boolean;
}

export const BADGES: Badge[] = [
    {
        id: 'first_flame',
        icon: '🔥',
        name: 'First Flame',
        description: 'Complete your first active day',
        condition: (stats) => stats.activeDays >= 1
    },
    {
        id: 'perfect_day',
        icon: '⭐',
        name: 'Perfect Day',
        description: 'Complete all 3 domains in one day',
        condition: (stats) => stats.perfectDays >= 1
    },
    {
        id: 'week_warrior',
        icon: '🎯',
        name: 'Week Warrior',
        description: 'Achieve a 7-day streak',
        condition: (stats) => stats.longestStreak >= 7
    },
    {
        id: 'consistency',
        icon: '💎',
        name: 'Consistency King',
        description: 'Achieve a 30-day streak',
        condition: (stats) => stats.longestStreak >= 30
    },
    {
        id: 'health_hero',
        icon: '💪',
        name: 'Health Hero',
        description: 'Complete 10 health check-ins',
        condition: (_, entries) => countDomain(entries, 'health') >= 10
    },
    {
        id: 'zen_master',
        icon: '✨',
        name: 'Zen Master',
        description: 'Complete 10 faith check-ins',
        condition: (_, entries) => countDomain(entries, 'faith') >= 10
    },
    {
        id: 'mind_sharp',
        icon: '🧠',
        name: 'Mind Sharpener',
        description: 'Complete 10 career check-ins',
        condition: (_, entries) => countDomain(entries, 'career') >= 10
    }
];

export function checkBadges(stats: Stats, entries: Entry[]): string[] {
    const newBadges: string[] = [];

    BADGES.forEach(badge => {
        if (!stats.badges.includes(badge.id)) {
            if (badge.condition(stats, entries)) {
                newBadges.push(badge.id);
            }
        }
    });

    return newBadges;
}
