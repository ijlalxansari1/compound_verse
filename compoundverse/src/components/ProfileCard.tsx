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
    // Format large numbers for mobile
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return (
        <motion.div
            className="glass-card p-6 mb-8 rounded-3xl relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Background Glows */}
            <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-6 mb-8 relative z-10">
                {/* Avatar */}
                <div className="avatar-ring shrink-0 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
                    <motion.div
                        className="avatar w-20 h-20 text-4xl relative bg-[#0d1117] border-2 border-white/10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {avatar}
                    </motion.div>
                    {/* Online Status Dot */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#0d1117] rounded-full shadow-lg shadow-green-500/20" />
                </div>

                {/* Name & Level */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black truncate bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        {username}
                    </h2>
                    <p className="text-[#8b949e] text-sm font-medium tracking-wide">Level {level} Champion</p>
                </div>

                {/* Level Crown */}
                <motion.div
                    className="flex flex-col items-center shrink-0 p-3 rounded-2xl bg-[#161b22]/80 border border-white/5 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.05, rotate: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                    <span className="text-3xl drop-shadow-md">👑</span>
                    <span className="text-xs font-bold text-duo-green mt-1">LVL {level}</span>
                </motion.div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                <div className="stat-badge text-center p-4 rounded-2xl bg-[#161b22]/50 hover:bg-[#161b22] border border-white/5 transition-colors group">
                    <div className="text-2xl font-black text-duo-orange flex items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                        <span className={currentStreak > 0 ? 'animate-wiggle' : ''}>🔥</span>
                        {currentStreak}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#6e7681] uppercase tracking-wider mt-1">Day Streak</div>
                </div>

                <div className="stat-badge text-center p-4 rounded-2xl bg-[#161b22]/50 hover:bg-[#161b22] border border-white/5 transition-colors group">
                    <div className="text-2xl font-black text-duo-gold text-glow-sm group-hover:scale-110 transition-transform">
                        {perfectDays}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#6e7681] uppercase tracking-wider mt-1">Perfect Days</div>
                </div>

                <div className="stat-badge text-center p-4 rounded-2xl bg-[#161b22]/50 hover:bg-[#161b22] border border-white/5 transition-colors group">
                    <div className="text-2xl font-black text-duo-green group-hover:scale-110 transition-transform">
                        {activeDays}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#6e7681] uppercase tracking-wider mt-1">Active Days</div>
                </div>

                <div className="stat-badge text-center p-4 rounded-2xl bg-[#161b22]/50 hover:bg-[#161b22] border border-white/5 transition-colors group">
                    <div className="text-2xl font-black text-duo-blue group-hover:scale-110 transition-transform">
                        {formatNumber(totalXP)}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#6e7681] uppercase tracking-wider mt-1">Total XP</div>
                </div>
            </div>
        </motion.div>
    );
}
