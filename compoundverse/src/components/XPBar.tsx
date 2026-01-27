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
        <div className="glass-card p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <motion.span
                        className="text-xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                        ⚡
                    </motion.span>
                    <span className="font-bold text-sm text-[#8b949e] uppercase tracking-wide">Experience</span>
                </div>
                <span className="font-bold text-duo-gold">
                    {xpInLevel} / 30 XP
                </span>
            </div>

            <div className="xp-track">
                <motion.div
                    className="xp-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>

            <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-[#6e7681] flex items-center gap-1">
                    <span>👑</span> Level {level}
                </span>
                <span className="text-[#6e7681]">
                    {xpToNextLevel} XP to next level
                </span>
            </div>
        </div>
    );
}
