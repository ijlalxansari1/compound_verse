// ========================================
// Compoundverse - AI Coach Messages
// Template-based motivational messages
// ========================================

const COACH_MESSAGES = {
    perfect: [
        "🏆 PERFECT DAY! All three domains conquered! You're building something unstoppable.",
        "⚡ LEGENDARY! Health, Faith, AND Career — the compound effect is REAL!",
        "🌟 TRIPLE THREAT! This is what consistent excellence looks like.",
        "🔥 UNSTOPPABLE! You showed up everywhere that matters today."
    ],
    strong: [
        "💪 Solid effort! 2 out of 3 domains covered. The momentum is building!",
        "🚀 Great push today! Two pillars strengthened. Keep stacking wins!",
        "✨ Strong showing! You're prioritizing what matters. Tomorrow, aim higher!",
        "🎯 Nice work! Two domains checked. The streak continues!"
    ],
    active: [
        "✅ You showed up! That's the foundation of everything. Small wins compound.",
        "🌱 One step forward beats standing still. You're in the game!",
        "💫 Progress, not perfection. You moved the needle today.",
        "🔑 The hardest part is starting. You did that. Build on it tomorrow."
    ],
    rest: [
        "🔄 System reset. Nothing lost. Tomorrow is a fresh page.",
        "😌 Rest days happen. What matters is you come back. See you tomorrow.",
        "🌅 Not every day is a win day. But every day is a new chance. Reset and return.",
        "💭 Pause ≠ quit. Take what you need, then step back in."
    ]
};

export type MessageType = 'perfect' | 'strong' | 'active' | 'rest';

export function getMessageType(dailyScore: number, perfectDay: number, strongDay: number, activeDay: number): MessageType {
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
    const xpNote = perfectDay
        ? `+${xpEarned} XP earned (includes Perfect Day bonus!)`
        : `+${xpEarned} XP earned today`;

    return { message, xpNote };
}
