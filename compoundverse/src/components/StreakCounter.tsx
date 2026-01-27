'use client';

import { motion } from 'framer-motion';

interface StreakCounterProps {
    currentStreak: number;
    longestStreak: number;
}

export default function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
    const isActive = currentStreak > 0;

    return (
        <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
            <motion.div
                className="text-6xl streak-fire"
                style={{
                    filter: isActive ? undefined : 'grayscale(1) opacity(0.3)',
                    animation: isActive ? 'fire-pulse 1s infinite' : 'none'
                }}
            >
                🔥
            </motion.div>

            <div className="flex-1">
                <motion.div
                    className="text-5xl font-extrabold text-duo-orange"
                    key={currentStreak}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStreak}
                </motion.div>
                <div className="text-[#8b949e] font-semibold">Day Streak</div>
            </div>

            <div className="text-center px-5 py-3 bg-[#161b22] rounded-2xl border-2 border-[#30363d]">
                <div className="text-xs text-[#6e7681] font-bold uppercase mb-1">Best</div>
                <div className="text-3xl font-extrabold text-duo-gold">{longestStreak}</div>
            </div>
        </div>
    );
}
