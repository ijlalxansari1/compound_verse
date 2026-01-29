// ========================================
// Compoundverse - Analytics System
// Track engagement, momentum trends, and panic usage
// ========================================

import { HabitData, getData } from './storage';
import { calculateMomentum, MomentumResult } from './momentum';
import { getPanicStats, getPanicDays } from './panic';
import { getActiveDomains, Domain } from './domains';

export interface EngagementStats {
    // Overall engagement
    totalDays: number;
    activeDays: number;
    engagementRate: number;

    // Streak metrics (legacy)
    currentStreak: number;
    longestStreak: number;

    // Momentum metrics (new)
    currentMomentum: number;
    momentumTrend: 'rising' | 'stable' | 'falling';
    averageMomentum7Days: number;
    averageMomentum30Days: number;
}

export interface DomainStats {
    domainId: string;
    domainName: string;
    domainIcon: string;
    totalActiveDays: number;
    activeDaysLast7: number;
    activeDaysLast30: number;
    completionRate: number;
}

export interface PanicAnalytics {
    totalPanicActivations: number;
    panicDaysLast7: number;
    panicDaysLast30: number;
    averagePanicsPerMonth: number;
    protectedDays: string[];
}

export interface MomentumTrend {
    date: string;
    score: number;
    trend: 'rising' | 'stable' | 'falling';
}

export interface AnalyticsDashboard {
    engagement: EngagementStats;
    domains: DomainStats[];
    panic: PanicAnalytics;
    momentumHistory: MomentumTrend[];
    lastUpdated: string;
}

/**
 * Calculate engagement statistics
 */
export function calculateEngagementStats(data: HabitData, userId?: string): EngagementStats {
    const totalDays = data.entries.length;
    const activeDays = data.entries.filter(e => e.activeDay).length;
    const engagementRate = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

    const panicDays = getPanicDays(userId);
    const momentum = calculateMomentum(data, panicDays);

    // Calculate 7-day and 30-day momentum averages
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const entries7Days = data.entries.filter(e => new Date(e.date) >= sevenDaysAgo);
    const entries30Days = data.entries.filter(e => new Date(e.date) >= thirtyDaysAgo);

    const active7 = entries7Days.filter(e => e.activeDay).length;
    const active30 = entries30Days.filter(e => e.activeDay).length;

    return {
        totalDays,
        activeDays,
        engagementRate,
        currentStreak: data.stats.currentStreak,
        longestStreak: data.stats.longestStreak,
        currentMomentum: momentum.score,
        momentumTrend: momentum.trend,
        averageMomentum7Days: active7 > 0 ? Math.round((active7 / 7) * 100) : 0,
        averageMomentum30Days: active30 > 0 ? Math.round((active30 / 30) * 100) : 0
    };
}

/**
 * Calculate domain usage statistics
 */
export function calculateDomainStats(data: HabitData, userId?: string): DomainStats[] {
    const domains = getActiveDomains(userId);
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const entries7Days = data.entries.filter(e => new Date(e.date) >= sevenDaysAgo);
    const entries30Days = data.entries.filter(e => new Date(e.date) >= thirtyDaysAgo);

    // Core domain mapping
    const domainStats: DomainStats[] = [];

    // Health
    const healthDomain = domains.find(d => d.id === 'health');
    if (healthDomain) {
        domainStats.push({
            domainId: 'health',
            domainName: healthDomain.name,
            domainIcon: healthDomain.icon,
            totalActiveDays: data.entries.filter(e => e.health === 1).length,
            activeDaysLast7: entries7Days.filter(e => e.health === 1).length,
            activeDaysLast30: entries30Days.filter(e => e.health === 1).length,
            completionRate: data.entries.length > 0
                ? Math.round((data.entries.filter(e => e.health === 1).length / data.entries.length) * 100)
                : 0
        });
    }

    // Faith
    const faithDomain = domains.find(d => d.id === 'faith');
    if (faithDomain) {
        domainStats.push({
            domainId: 'faith',
            domainName: faithDomain.name,
            domainIcon: faithDomain.icon,
            totalActiveDays: data.entries.filter(e => e.faith === 1).length,
            activeDaysLast7: entries7Days.filter(e => e.faith === 1).length,
            activeDaysLast30: entries30Days.filter(e => e.faith === 1).length,
            completionRate: data.entries.length > 0
                ? Math.round((data.entries.filter(e => e.faith === 1).length / data.entries.length) * 100)
                : 0
        });
    }

    // Career
    const careerDomain = domains.find(d => d.id === 'career');
    if (careerDomain) {
        domainStats.push({
            domainId: 'career',
            domainName: careerDomain.name,
            domainIcon: careerDomain.icon,
            totalActiveDays: data.entries.filter(e => e.career === 1).length,
            activeDaysLast7: entries7Days.filter(e => e.career === 1).length,
            activeDaysLast30: entries30Days.filter(e => e.career === 1).length,
            completionRate: data.entries.length > 0
                ? Math.round((data.entries.filter(e => e.career === 1).length / data.entries.length) * 100)
                : 0
        });
    }

    return domainStats;
}

/**
 * Get panic button analytics
 */
export function getPanicAnalytics(userId?: string): PanicAnalytics {
    const stats = getPanicStats(userId);
    const panicDays = getPanicDays(userId);

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const panicDaysLast7 = panicDays.filter(d => new Date(d) >= sevenDaysAgo).length;
    const panicDaysLast30 = panicDays.filter(d => new Date(d) >= thirtyDaysAgo).length;

    // Average panics per month (based on available data)
    const firstPanicDate = panicDays.length > 0 ? new Date(panicDays[0]) : today;
    const daysSinceFirst = Math.max(1, Math.ceil((today.getTime() - firstPanicDate.getTime()) / (1000 * 60 * 60 * 24)));
    const monthsFraction = daysSinceFirst / 30;
    const averagePanicsPerMonth = monthsFraction > 0
        ? Math.round((panicDays.length / monthsFraction) * 10) / 10
        : 0;

    return {
        totalPanicActivations: stats.totalActivations,
        panicDaysLast7,
        panicDaysLast30,
        averagePanicsPerMonth,
        protectedDays: panicDays
    };
}

/**
 * Calculate momentum history for the last N days
 */
export function getMomentumHistory(data: HabitData, userId?: string, days: number = 14): MomentumTrend[] {
    const history: MomentumTrend[] = [];
    const panicDays = getPanicDays(userId);

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().slice(0, 10);

        // Calculate momentum as of that date
        const entriesUpToDate = data.entries.filter(e => e.date <= dateStr);
        const mockData = { ...data, entries: entriesUpToDate };
        const momentum = calculateMomentum(mockData, panicDays.filter(d => d <= dateStr));

        history.push({
            date: dateStr,
            score: momentum.score,
            trend: momentum.trend
        });
    }

    return history;
}

/**
 * Get full analytics dashboard
 */
export function getAnalyticsDashboard(userId?: string): AnalyticsDashboard {
    const data = getData(userId);

    return {
        engagement: calculateEngagementStats(data, userId),
        domains: calculateDomainStats(data, userId),
        panic: getPanicAnalytics(userId),
        momentumHistory: getMomentumHistory(data, userId, 14),
        lastUpdated: new Date().toISOString()
    };
}
