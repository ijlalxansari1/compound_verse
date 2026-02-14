// ========================================
// Compoundverse - Data Storage & Types
// Hybrid: LocalStorage + Supabase Cloud Sync
// ========================================

import { supabase } from './supabase';

export interface Entry {
    date: string;
    // Mapping of domainId -> 1 (checked) or 0 (unchecked)
    domains: Record<string, number>;
    reflection: string;
    dailyScore: number;
    activeDay: number;
    strongDay: number;
    perfectDay: number;
    xpEarned: number;
    // Legacy support (optional)
    health?: number;
    faith?: number;
    career?: number;
}

export interface Stats {
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    perfectDays: number;
    activeDays: number;
    strongDays: number;
    badges: string[];
}

export interface HabitData {
    entries: Entry[];
    stats: Stats;
}

const STORAGE_KEY_PREFIX = 'compoundverse_data_';
const GUEST_STORAGE_KEY = 'compoundverse_data'; // Legacy/Guest key

const DEFAULT_DATA: HabitData = {
    entries: [],
    stats: {
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        perfectDays: 0,
        activeDays: 0,
        strongDays: 0,
        badges: []
    }
};

// ========================================
// Local Storage Functions (fast, offline-first)
// ========================================

// ========================================
// Legacy Storage Functions (Deprecated/Removed)
// ========================================
// Data is now managed via Supabase hooks (useHabits.ts)
// LocalStorage is only used for:
// 1. Guest/Onboarding temporary state
// 2. Domain definitions (lib/domains.ts)
// 3. UI preferences (theme, etc)

// ========================================
// Migration & Utility Functions
// ========================================

/**
 * Migrates data from the guest/anonymous key to a specific user key.
 */
export function migrateGuestData(userId: string): void {
    if (typeof window === 'undefined') return;

    const guestData = localStorage.getItem(GUEST_STORAGE_KEY);
    if (guestData) {
        const userKey = `${STORAGE_KEY_PREFIX}${userId}`;
        const existingUserData = localStorage.getItem(userKey);

        // Only migrate if the user doesn't already have data
        if (!existingUserData) {
            localStorage.setItem(userKey, guestData);
            // Also sync to cloud
            const data = JSON.parse(guestData) as HabitData;
            syncToCloud(data, userId).catch(console.error);
        }
    }
}

export function getToday(): string {
    return new Date().toISOString().slice(0, 10);
}

export function getYesterday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

export function hasTodayEntry(data: HabitData): boolean {
    const today = getToday();
    return data.entries.some(e => e.date === today);
}

export function getTodayEntry(data: HabitData): Entry | undefined {
    const today = getToday();
    return data.entries.find(e => e.date === today);
}
