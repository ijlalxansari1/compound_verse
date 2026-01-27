'use client';

import { motion } from 'framer-motion';
import { HabitData } from '@/lib/storage';

interface StatsDashboardProps {
    data: HabitData;
}

export default function StatsDashboard({ data }: StatsDashboardProps) {
    const { stats, entries } = data;

    // Calculate weekly stats
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyEntries = entries.filter(e => new Date(e.date) >= weekAgo);
    const weeklyXP = weeklyEntries.reduce((sum, e) => sum + e.xpEarned, 0);
    const weeklyActive = weeklyEntries.filter(e => e.activeDay).length;
    const weeklyPerfect = weeklyEntries.filter(e => e.perfectDay).length;

    // Domain stats
    const healthCount = entries.filter(e => e.health === 1).length;
    const faithCount = entries.filter(e => e.faith === 1).length;
    const careerCount = entries.filter(e => e.career === 1).length;
    const totalDays = entries.length || 1;

    const QUOTES = [
        "Small daily improvements are the key to staggering long-term results.",
        "Success is the sum of small efforts repeated day in and day out.",
        "The secret of your future is hidden in your daily routine.",
        "Motivation is what gets you started. Habit is what keeps you going.",
        "Champions keep playing until they get it right."
    ];

    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { label: 'Total XP', value: stats.totalXP, icon: '⚡', color: '#1cb0f6' },
                    { label: 'Level', value: stats.level, icon: '👑', color: '#ffc800' },
                    { label: 'Active Days', value: stats.activeDays, icon: '📈', color: '#58cc02' },
                    { label: 'Perfect Days', value: stats.perfectDays, icon: '⭐', color: '#ff9600' },
                    { label: 'Current Streak', value: stats.currentStreak, icon: '🔥', color: '#ff4b4b' },
                    { label: 'Best Streak', value: stats.longestStreak, icon: '🏆', color: '#ce82ff' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card rounded-2xl p-4 text-center"
                    >
                        <span className="text-2xl block mb-1">{stat.icon}</span>
                        <div className="text-2xl font-extrabold" style={{ color: stat.color }}>
                            {stat.value}
                        </div>
                        <div className="text-xs text-[#6e7681] uppercase tracking-wide mt-1">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Weekly Summary */}
            <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    📊 This Week
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-3xl font-extrabold text-duo-blue">{weeklyXP}</div>
                        <div className="text-xs text-[#6e7681]">XP Earned</div>
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold text-duo-green">{weeklyActive}/7</div>
                        <div className="text-xs text-[#6e7681]">Active Days</div>
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold text-duo-gold">{weeklyPerfect}</div>
                        <div className="text-xs text-[#6e7681]">Perfect Days</div>
                    </div>
                </div>
            </div>

            {/* Domain Breakdown */}
            <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    🎯 Domain Breakdown
                </h3>
                <div className="space-y-4">
                    {[
                        { name: 'Health', count: healthCount, color: '#58cc02', icon: '💪' },
                        { name: 'Faith', count: faithCount, color: '#ffc800', icon: '✨' },
                        { name: 'Career', count: careerCount, color: '#1cb0f6', icon: '🧠' },
                    ].map((domain) => (
                        <div key={domain.name}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="flex items-center gap-2">
                                    <span>{domain.icon}</span> {domain.name}
                                </span>
                                <span className="font-bold" style={{ color: domain.color }}>
                                    {domain.count} days
                                </span>
                            </div>
                            <div className="h-3 bg-[#161b22] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: domain.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(domain.count / totalDays) * 100}%` }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Quote */}
            <motion.div
                className="glass-card rounded-2xl p-5 text-center border-2 border-[#ce82ff]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span className="text-4xl mb-3 block">💭</span>
                <p className="text-lg italic text-[#8b949e] leading-relaxed">
                    "{randomQuote}"
                </p>
            </motion.div>
        </motion.div>
    );
}
