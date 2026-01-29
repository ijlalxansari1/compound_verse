// CompoundVerse - Admin Configuration & System Settings

export interface SystemConfig {
    // XP Rules
    xpRules: {
        healthXP: number;
        faithXP: number;
        careerXP: number;
        perfectDayBonus: number;
        xpPerLevel: number;
    };

    // Verse Config
    verses: {
        health: { enabled: boolean; name: string; icon: string };
        faith: { enabled: boolean; name: string; icon: string };
        career: { enabled: boolean; name: string; icon: string };
    };

    // Coach Settings
    coach: {
        tone: 'gentle' | 'neutral' | 'direct';
        tipRotationHours: number;
        enableTips: boolean;
    };

    // Music Config
    music: {
        enabledByDefault: boolean;
        defaultCategory: 'classical' | 'ambient' | 'silence';
        maxVolume: number;
    };

    // Feature Flags
    features: {
        dynamicVerses: boolean;
        reflections: boolean;
        exportPDF: boolean;
        exportCSV: boolean;
        streakDisplay: boolean;
        perfectDayConfetti: boolean;
    };
}

export interface UserSettings {
    username: string;
    avatar: string;
    timezone: string;
    language: string;
    coachTone: 'gentle' | 'neutral' | 'direct';
    musicEnabled: boolean;
    setupComplete: boolean;
    // Onboarding preferences
    onboarding?: any;
    minimumViableDay: 'easy' | 'moderate' | 'challenging';
    reflectionPreference: 'faith' | 'philosophical' | 'none';
    // Appearance
    theme: 'midnight' | 'aurora' | 'solar' | 'monochrome';
    animationIntensity: 'full' | 'reduced' | 'static';
    selectedDomains: string[];
}

const DEFAULT_CONFIG: SystemConfig = {
    xpRules: {
        healthXP: 1,
        faithXP: 1,
        careerXP: 1,
        perfectDayBonus: 1,
        xpPerLevel: 30,
    },
    verses: {
        health: { enabled: true, name: 'Health', icon: '💪' },
        faith: { enabled: true, name: 'Faith', icon: '✨' },
        career: { enabled: true, name: 'Career', icon: '🧠' },
    },
    coach: {
        tone: 'neutral',
        tipRotationHours: 1,
        enableTips: true,
    },
    music: {
        enabledByDefault: false,
        defaultCategory: 'classical',
        maxVolume: 0.3,
    },
    features: {
        dynamicVerses: true,
        reflections: true,
        exportPDF: true,
        exportCSV: true,
        streakDisplay: true,
        perfectDayConfetti: true,
    },
};

const DEFAULT_USER_SETTINGS: UserSettings = {
    username: 'Player',
    avatar: '🦁',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
    coachTone: 'neutral',
    musicEnabled: false,
    setupComplete: false,
    minimumViableDay: 'easy',
    reflectionPreference: 'philosophical',
    selectedDomains: ['health', 'faith', 'career'],
    theme: 'midnight',
    animationIntensity: 'full',
};

const CONFIG_KEY = 'compoundverse_config';
const USER_SETTINGS_KEY = 'compoundverse_user_settings';
const ADMIN_LOG_KEY = 'compoundverse_admin_log';

// System Config Functions
export function getSystemConfig(): SystemConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;

    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
    return { ...DEFAULT_CONFIG };
}

export function saveSystemConfig(config: SystemConfig): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    logAdminChange('config_update', config);
}

// User Settings Functions
export function getUserSettings(): UserSettings {
    if (typeof window === 'undefined') return DEFAULT_USER_SETTINGS;

    const stored = localStorage.getItem(USER_SETTINGS_KEY);
    if (stored) {
        return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(stored) };
    }
    return { ...DEFAULT_USER_SETTINGS };
}

export function saveUserSettings(settings: UserSettings): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
}

export function isFirstTimeUser(): boolean {
    const settings = getUserSettings();
    return !settings.setupComplete;
}

export function completeSetup(): void {
    const settings = getUserSettings();
    settings.setupComplete = true;
    saveUserSettings(settings);
}

// Admin Audit Log
interface AdminLogEntry {
    timestamp: string;
    action: string;
    data: unknown;
}

export function logAdminChange(action: string, data: unknown): void {
    if (typeof window === 'undefined') return;

    const logs = getAdminLog();
    logs.push({
        timestamp: new Date().toISOString(),
        action,
        data,
    });

    // Keep last 100 entries
    if (logs.length > 100) {
        logs.shift();
    }

    localStorage.setItem(ADMIN_LOG_KEY, JSON.stringify(logs));
}

export function getAdminLog(): AdminLogEntry[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(ADMIN_LOG_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

export function clearAdminLog(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ADMIN_LOG_KEY);
}
