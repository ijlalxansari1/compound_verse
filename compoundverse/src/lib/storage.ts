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

export function getData(userId?: string): HabitData {
    if (typeof window === 'undefined') return DEFAULT_DATA;

    const key = userId ? `${STORAGE_KEY_PREFIX}${userId}` : GUEST_STORAGE_KEY;
    const stored = localStorage.getItem(key);

    if (stored) {
        return JSON.parse(stored);
    }

    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

export function saveData(data: HabitData, userId?: string): void {
    if (typeof window === 'undefined') return;
    const key = userId ? `${STORAGE_KEY_PREFIX}${userId}` : GUEST_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(data));

    // Sync to cloud in background (non-blocking)
    if (userId && !userId.startsWith('guest_')) {
        syncToCloud(data, userId).catch(console.error);
    }
}

// ========================================
// Cloud Sync Functions
// ========================================

/**
 * Sync local data to Supabase cloud
 */
export async function syncToCloud(data: HabitData, userId: string): Promise<void> {
    if (!userId || userId.startsWith('guest_')) return;

    try {
        // Sync stats
        await supabase
            .from('user_stats')
            .upsert({
                user_id: userId,
                total_xp: data.stats.totalXP,
                level: data.stats.level,
                current_streak: data.stats.currentStreak,
                longest_streak: data.stats.longestStreak,
                perfect_days: data.stats.perfectDays,
                active_days: data.stats.activeDays,
                strong_days: data.stats.strongDays,
                badges: data.stats.badges
            }, { onConflict: 'user_id' });

        // Sync entries (upsert each entry by user_id + date)
        for (const entry of data.entries) {
            await supabase
                .from('entries')
                .upsert({
                    user_id: userId,
                    date: entry.date,
                    domains: entry.domains,
                    reflection: entry.reflection,
                    daily_score: entry.dailyScore,
                    active_day: entry.activeDay,
                    strong_day: entry.strongDay,
                    perfect_day: entry.perfectDay,
                    xp_earned: entry.xpEarned
                }, {
                    onConflict: 'user_id,date',
                    ignoreDuplicates: false
                });
        }
    } catch (error) {
        console.error('Cloud sync failed:', error);
        // Continue with local data - sync will retry later
    }
}

/**
 * Fetch data from cloud and merge with local
 */
export async function fetchFromCloud(userId: string): Promise<HabitData | null> {
    if (!userId || userId.startsWith('guest_')) return null;

    try {
        // Fetch stats
        const { data: statsData } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        // Fetch entries
        const { data: entriesData } = await supabase
            .from('entries')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (!statsData && !entriesData?.length) {
            return null; // No cloud data
        }

        const cloudData: HabitData = {
            entries: (entriesData || []).map(e => ({
                date: e.date,
                domains: e.domains || {},
                reflection: e.reflection || '',
                dailyScore: e.daily_score,
                activeDay: e.active_day,
                strongDay: e.strong_day,
                perfectDay: e.perfect_day,
                xpEarned: e.xp_earned
            })),
            stats: statsData ? {
                totalXP: statsData.total_xp,
                level: statsData.level,
                currentStreak: statsData.current_streak,
                longestStreak: statsData.longest_streak,
                perfectDays: statsData.perfect_days,
                activeDays: statsData.active_days,
                strongDays: statsData.strong_days,
                badges: statsData.badges || []
            } : DEFAULT_DATA.stats
        };

        return cloudData;
    } catch (error) {
        console.error('Cloud fetch failed:', error);
        return null;
    }
}

/**
 * Get data with cloud sync - prefers local, syncs with cloud
 */
export async function getDataWithSync(userId?: string): Promise<HabitData> {
    const localData = getData(userId);

    if (!userId || userId.startsWith('guest_')) {
        return localData;
    }

    try {
        const cloudData = await fetchFromCloud(userId);

        if (cloudData) {
            // Merge: use cloud data but add any local entries not in cloud
            const mergedEntries = [...cloudData.entries];
            const cloudDates = new Set(cloudData.entries.map(e => e.date));

            for (const entry of localData.entries) {
                if (!cloudDates.has(entry.date)) {
                    mergedEntries.push(entry);
                }
            }

            const mergedData: HabitData = {
                entries: mergedEntries.sort((a, b) => b.date.localeCompare(a.date)),
                stats: {
                    // Use the higher values from cloud or local
                    totalXP: Math.max(cloudData.stats.totalXP, localData.stats.totalXP),
                    level: Math.max(cloudData.stats.level, localData.stats.level),
                    currentStreak: cloudData.stats.currentStreak, // Cloud is authoritative
                    longestStreak: Math.max(cloudData.stats.longestStreak, localData.stats.longestStreak),
                    perfectDays: Math.max(cloudData.stats.perfectDays, localData.stats.perfectDays),
                    activeDays: Math.max(cloudData.stats.activeDays, localData.stats.activeDays),
                    strongDays: Math.max(cloudData.stats.strongDays, localData.stats.strongDays),
                    badges: [...new Set([...cloudData.stats.badges, ...localData.stats.badges])]
                }
            };

            // Update local with merged data
            saveData(mergedData, userId);
            return mergedData;
        }
    } catch (error) {
        console.error('Sync failed, using local data:', error);
    }

    return localData;
}

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
