'use client';

import { motion } from 'framer-motion';

interface ProfileCardProps {
    level: number;
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
    perfectDays: number;
    username: string;
    avatar?: string;
}

export default function ProfileCard({
    level,
    totalXP,
    currentStreak,
    longestStreak,
    activeDays,
    perfectDays,
    username,
    avatar = '🦁'
}: ProfileCardProps) {
    return (
        <motion.div
            className="profile-card p-6 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="avatar-ring">
                    <motion.div
                        className="avatar"
                        whileHover={{ scale: 1.1 }}
                    >
                        {avatar}
                    </motion.div>
                </div>

                {/* Name & Level */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold">
                        {username}
                    </h2>
                    <p className="text-[#8b949e] text-sm">Level {level} Champion</p>
                </div>

                {/* Level Crown */}
                <motion.div
                    className="level-badge flex flex-col items-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                >
                    <span className="text-2xl">👑</span>
                    <span className="text-sm font-bold text-[#1a3a00]">{level}</span>
                </motion.div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-orange flex items-center justify-center gap-1">
                        <span className={currentStreak > 0 ? 'animate-wiggle' : ''}>🔥</span>
                        {currentStreak}
                    </div>
                    <div className="text-[10px] text-[#6e7681] uppercase">Streak</div>
                </div>

                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-gold">⭐ {perfectDays}</div>
                    <div className="text-[10px] text-[#6e7681] uppercase">Perfect</div>
                </div>

                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-green">📈 {activeDays}</div>
                    <div className="text-[10px] text-[#6e7681] uppercase">Active</div>
                </div>

                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-blue">⚡ {totalXP}</div>
                    <div className="text-[10px] text-[#6e7681] uppercase">XP</div>
                </div>
            </div>
        </motion.div>
    );
}
