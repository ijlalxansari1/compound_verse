// ========================================
// Compoundverse - Panic Button System
// Interrupt relapse loops, delay decisions, reduce harm
// ========================================

export interface PanicState {
    isActive: boolean;
    activatedAt: string | null;
    groundingEndTime: string | null;
    streakFrozen: boolean;
    panicDays: string[];           // Days marked as protected
    totalActivations: number;       // Anonymous tracking
    groundingDurationMinutes: number; // User configurable (10-20)
}

const PANIC_STATE_KEY = 'compoundverse_panic';
const DEFAULT_GROUNDING_DURATION = 15; // minutes

const DEFAULT_PANIC_STATE: PanicState = {
    isActive: false,
    activatedAt: null,
    groundingEndTime: null,
    streakFrozen: false,
    panicDays: [],
    totalActivations: 0,
    groundingDurationMinutes: DEFAULT_GROUNDING_DURATION
};

/**
 * Get current panic state from storage
 */
export function getPanicState(): PanicState {
    if (typeof window === 'undefined') return DEFAULT_PANIC_STATE;

    const stored = localStorage.getItem(PANIC_STATE_KEY);
    if (stored) {
        return { ...DEFAULT_PANIC_STATE, ...JSON.parse(stored) };
    }
    return { ...DEFAULT_PANIC_STATE };
}

/**
 * Save panic state to storage
 */
export function savePanicState(state: PanicState): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PANIC_STATE_KEY, JSON.stringify(state));
}

/**
 * Activate Panic Button - immediately enter grounding mode
 * No confirmation dialogs - speed is critical
 */
export function activatePanic(): PanicState {
    const state = getPanicState();
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    // Calculate grounding end time
    const groundingEnd = new Date(now.getTime() + state.groundingDurationMinutes * 60 * 1000);

    const newState: PanicState = {
        ...state,
        isActive: true,
        activatedAt: now.toISOString(),
        groundingEndTime: groundingEnd.toISOString(),
        streakFrozen: true,
        totalActivations: state.totalActivations + 1,
        panicDays: state.panicDays.includes(today)
            ? state.panicDays
            : [...state.panicDays, today]
    };

    savePanicState(newState);
    return newState;
}

/**
 * Exit grounding mode - gentle return
 */
export function exitGroundingMode(): PanicState {
    const state = getPanicState();

    const newState: PanicState = {
        ...state,
        isActive: false,
        groundingEndTime: null,
        // Keep streak frozen for the day
        // Keep today in panicDays
    };

    savePanicState(newState);
    return newState;
}

/**
 * Check if grounding timer has expired
 */
export function isGroundingExpired(): boolean {
    const state = getPanicState();

    if (!state.isActive || !state.groundingEndTime) {
        return true;
    }

    const now = new Date();
    const endTime = new Date(state.groundingEndTime);

    return now >= endTime;
}

/**
 * Get remaining grounding time in seconds
 */
export function getRemainingGroundingTime(): number {
    const state = getPanicState();

    if (!state.isActive || !state.groundingEndTime) {
        return 0;
    }

    const now = new Date();
    const endTime = new Date(state.groundingEndTime);
    const remaining = Math.max(0, endTime.getTime() - now.getTime());

    return Math.ceil(remaining / 1000);
}

/**
 * Check if a specific date is a panic (protected) day
 */
export function isPanicDay(date: string): boolean {
    const state = getPanicState();
    return state.panicDays.includes(date);
}

/**
 * Get all panic days for momentum calculation
 */
export function getPanicDays(): string[] {
    const state = getPanicState();
    return state.panicDays;
}

/**
 * Update grounding duration (user preference)
 */
export function setGroundingDuration(minutes: number): void {
    const state = getPanicState();
    const clampedMinutes = Math.max(5, Math.min(30, minutes)); // 5-30 min range

    savePanicState({
        ...state,
        groundingDurationMinutes: clampedMinutes
    });
}

/**
 * Reset panic state for new day (called on app load)
 * Keeps panic day history but unfreezes streak
 */
export function resetDailyPanicState(): void {
    const state = getPanicState();
    const today = new Date().toISOString().slice(0, 10);
    const lastActivation = state.activatedAt
        ? new Date(state.activatedAt).toISOString().slice(0, 10)
        : null;

    // If last activation was not today, unfreeze streak
    if (lastActivation !== today) {
        savePanicState({
            ...state,
            isActive: false,
            activatedAt: null,
            groundingEndTime: null,
            streakFrozen: false
        });
    }
}

/**
 * Get anonymous activation stats for admin
 */
export function getPanicStats(): { totalActivations: number; panicDaysCount: number } {
    const state = getPanicState();
    return {
        totalActivations: state.totalActivations,
        panicDaysCount: state.panicDays.length
    };
}
