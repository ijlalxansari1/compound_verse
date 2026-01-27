'use client';

import { motion } from 'framer-motion';
import { BADGES } from '@/lib/badges';

interface BadgeGridProps {
    unlockedBadges: string[];
}

export default function BadgeGrid({ unlockedBadges }: BadgeGridProps) {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {BADGES.map((badge, index) => {
                const unlocked = unlockedBadges.includes(badge.id);

                return (
                    <motion.div
                        key={badge.id}
                        className={`flex flex-col items-center p-4 rounded-2xl transition-all ${unlocked
                                ? 'bg-gradient-to-br from-[#ffc800]/20 to-[#ff9600]/10 border-2 border-[#ffc800]'
                                : 'bg-[#161b22] border-2 border-[#30363d] opacity-50 grayscale'
                            }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ scale: unlocked ? 1.05 : 1 }}
                        title={badge.description}
                    >
                        <motion.span
                            className="text-3xl mb-2"
                            animate={unlocked ? { rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                            {badge.icon}
                        </motion.span>
                        <span className="text-xs text-center font-semibold text-[#8b949e] leading-tight">
                            {badge.name}
                        </span>
                        {unlocked && (
                            <span className="text-[10px] text-[#58cc02] mt-1 font-bold">UNLOCKED</span>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
