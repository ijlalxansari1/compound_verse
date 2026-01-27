// ========================================
// Compoundverse - Data Storage & Types
// Uses LocalStorage for persistence
// ========================================

export interface Entry {
    date: string;
    health: number;
    faith: number;
    career: number;
    reflection: string;
    dailyScore: number;
    activeDay: number;
    strongDay: number;
    perfectDay: number;
    xpEarned: number;
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

const STORAGE_KEY = 'compoundverse_data';

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

export function getData(): HabitData {
    if (typeof window === 'undefined') return DEFAULT_DATA;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

export function saveData(data: HabitData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
