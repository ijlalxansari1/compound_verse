// ========================================
// Compoundverse - AI Coach Messages
// Calm, grounded, observational tone
// No moralizing, shaming, or hype language
// ========================================

import { getPanicState } from './panic';

const COACH_MESSAGES = {
    perfect: [
        "All three areas touched today. Pattern building.",
        "You covered everything. That's enough.",
        "Complete day. The consistency speaks for itself.",
        "Every domain got attention. Rest now."
    ],
    strong: [
        "Two areas covered. That's a solid day.",
        "You showed up where it mattered.",
        "Two out of three. That counts.",
        "Good effort across the board."
    ],
    active: [
        "You showed up. That's what matters.",
        "One step is still forward motion.",
        "Something beats nothing. Always.",
        "You're still in the game."
    ],
    rest: [
        "One day changes nothing. Pattern changes everything.",
        "Tomorrow is a new page.",
        "Rest is part of the process.",
        "No judgment here. Come back when ready."
    ],
    protected: [
        "Today is protected. No pressure.",
        "You took care of yourself. That counts.",
        "Grounding day. This was the right choice.",
        "Protected day complete. Welcome back."
    ],
    afterPanic: [
        "Welcome back. No rush.",
        "Take your time settling in.",
        "One breath at a time.",
        "You're here now. That's enough."
    ]
};

// Calm messages that rotate hourly - non-preachy
const CALM_OBSERVATIONS = [
    "Small actions, done consistently, change everything.",
    "You're here. That's already something.",
    "The goal is motion, not perfection.",
    "One day at a time is enough.",
    "Showing up matters more than showing off.",
    "Progress hides in the ordinary days.",
    "Consistency is quieter than motivation.",
    "You don't have to feel ready to begin.",
    "The streak isn't the point. The pattern is.",
    "Momentum builds in silence.",
    "Today is enough. Tomorrow will come.",
    "The compound effect works even when you don't see it."
];

export type MessageType = 'perfect' | 'strong' | 'active' | 'rest' | 'protected' | 'afterPanic';

export function getMessageType(dailyScore: number, perfectDay: number, strongDay: number, activeDay: number): MessageType {
    // Check if today is a panic/protected day
    const panicState = getPanicState();
    const today = new Date().toISOString().slice(0, 10);

    if (panicState.panicDays.includes(today)) {
        return 'protected';
    }

    // Check if just exited grounding mode
    if (panicState.activatedAt) {
        const activatedDate = new Date(panicState.activatedAt).toISOString().slice(0, 10);
        if (activatedDate === today && !panicState.isActive) {
            return 'afterPanic';
        }
    }

    if (perfectDay) return 'perfect';
    if (strongDay) return 'strong';
    if (activeDay) return 'active';
    return 'rest';
}

export function getCoachMessage(type: MessageType): string {
    const messages = COACH_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
}

export function generateFeedback(xpEarned: number, perfectDay: number, type: MessageType): { message: string; xpNote: string } {
    const message = getCoachMessage(type);

    // Calm XP note - no exclamation marks
    const xpNote = xpEarned > 0
        ? `+${xpEarned} XP earned`
        : 'Protected day - no XP change';

    return { message, xpNote };
}

/**
 * Get a calm observation for the daily quote
 * Rotates hourly to feel fresh without being overwhelming
 */
export function getCalmObservation(): string {
    const hourIndex = new Date().getHours() % CALM_OBSERVATIONS.length;
    return CALM_OBSERVATIONS[hourIndex];
}

/**
 * Check if AI Coach should be silent
 * During Panic/Grounding mode, coach stays silent
 */
export function shouldCoachBeSilent(): boolean {
    const panicState = getPanicState();
    return panicState.isActive;
}
