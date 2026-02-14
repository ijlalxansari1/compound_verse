'use client';

import { motion } from 'framer-motion';

interface XPBarProps {
    currentXP: number;
    level: number;
}

export default function XPBar({ currentXP, level }: XPBarProps) {
    const xpInLevel = currentXP % 30;
    const xpPercent = (xpInLevel / 30) * 100;
    const xpToNextLevel = 30 - xpInLevel;

    return (
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full -z-10 group-hover:bg-yellow-500/10 transition-colors duration-500" />

            <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#8b949e] tracking-widest mb-1">Current Level</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">👑</span>
                        <span className="text-2xl font-black text-white">{level}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#8b949e] tracking-widest mb-1">Progress</span>
                    <div className="text-lg font-bold text-duo-gold text-glow-sm">
                        {xpInLevel} <span className="text-[#484f58] text-sm">/ 30 XP</span>
                    </div>
                </div>
            </div>

            {/* Bar Track */}
            <div className="h-4 w-full bg-[#161b22] rounded-full overflow-hidden border border-white/5 relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-shimmer" />
                </motion.div>
            </div>

            <div className="mt-3 text-center">
                <p className="text-xs text-[#6e7681]">
                    <span className="text-duo-gold font-bold">{xpToNextLevel} XP</span> until Level {level + 1}
                </p>
            </div>
        </div>
    );
}
