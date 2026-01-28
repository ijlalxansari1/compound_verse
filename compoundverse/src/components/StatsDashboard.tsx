'use client';

import { motion } from 'framer-motion';
import { HabitData } from '@/lib/storage';
import { calculateMomentum, MomentumResult } from '@/lib/momentum';
import { getPanicDays, getPanicStats } from '@/lib/panic';

interface StatsDashboardProps {
    data: HabitData;
}

/**
 * Generate narrative feedback based on data
 * Focus on trends, not failures - data storytelling
 */
function generateNarrative(
    weeklyActive: number,
    totalActive: number,
    totalDays: number,
    momentum: MomentumResult
): string {
    // Weekly narrative
    if (weeklyActive === 7) {
        return "You showed up every day this week. That's rare.";
    } else if (weeklyActive >= 5) {
        return `You showed up ${weeklyActive} out of 7 days this week. Strong pattern.`;
    } else if (weeklyActive >= 3) {
        return `${weeklyActive} days this week. You're still in motion.`;
    } else if (weeklyActive >= 1) {
        return `${weeklyActive} day${weeklyActive > 1 ? 's' : ''} this week. One step is still forward.`;
    } else {
        return "New week, new page. Ready when you are.";
    }
}

/**
 * Generate momentum narrative
 */
function getMomentumNarrative(momentum: MomentumResult): string {
    if (momentum.trend === 'rising') {
        return "Your momentum is building.";
    } else if (momentum.trend === 'falling') {
        return "Momentum shifting. Pattern matters more than any single day.";
    } else {
        return "Your momentum is stable.";
    }
}

export default function StatsDashboard({ data }: StatsDashboardProps) {
    const { stats, entries } = data;

    // Calculate momentum
    const panicDays = getPanicDays();
    const momentum = calculateMomentum(data, panicDays);
    const panicStats = getPanicStats();

    // Calculate weekly stats
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyEntries = entries.filter(e => new Date(e.date) >= weekAgo);
    const weeklyXP = weeklyEntries.reduce((sum, e) => sum + e.xpEarned, 0);
    const weeklyActive = weeklyEntries.filter(e => e.activeDay).length;

    // Two-week comparison for trend
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const lastTwoWeeksEntries = entries.filter(e => {
        const d = new Date(e.date);
        return d >= twoWeeksAgo;
    });
    const twoWeekActive = lastTwoWeeksEntries.filter(e => e.activeDay).length;

    // Domain stats
    const healthCount = entries.filter(e => e.health === 1).length;
    const faithCount = entries.filter(e => e.faith === 1).length;
    const careerCount = entries.filter(e => e.career === 1).length;
    const totalDays = entries.length || 1;

    // Generate narrative
    const narrative = generateNarrative(weeklyActive, stats.activeDays, totalDays, momentum);
    const momentumNarrative = getMomentumNarrative(momentum);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
        >
            {/* Narrative Summary - Data Storytelling */}
            <div className="glass-card rounded-2xl p-5 text-center">
                <p className="text-lg text-[#8b949e] leading-relaxed">
                    {narrative}
                </p>
                <p className="text-sm text-[#6e7681] mt-2">
                    {momentumNarrative}
                </p>
            </div>

            {/* Stats Cards - Less aggressive, more informative */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { label: 'Total XP', value: stats.totalXP, icon: '⚡', color: '#1cb0f6' },
                    { label: 'Level', value: stats.level, icon: '✦', color: '#ffc800' },
                    { label: 'Active Days', value: stats.activeDays, icon: '→', color: '#58cc02' },
                    { label: 'Momentum', value: `${momentum.score}%`, icon: momentum.trend === 'rising' ? '↗' : momentum.trend === 'falling' ? '↘' : '→', color: momentum.score >= 70 ? '#58cc02' : momentum.score >= 40 ? '#1cb0f6' : '#6e7681' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card rounded-2xl p-4 text-center"
                    >
                        <span className="text-xl block mb-1">{stat.icon}</span>
                        <div className="text-2xl font-bold" style={{ color: stat.color }}>
                            {stat.value}
                        </div>
                        <div className="text-xs text-[#6e7681] mt-1">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Two Week Summary - Trend Focus */}
            <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-base mb-4 text-[#8b949e]">
                    Last 14 Days
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-duo-blue">{twoWeekActive}</div>
                        <div className="text-xs text-[#6e7681]">Active Days</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-duo-green">{Math.round((twoWeekActive / 14) * 100)}%</div>
                        <div className="text-xs text-[#6e7681]">Consistency</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#8b5cf6]">{panicStats.panicDaysCount}</div>
                        <div className="text-xs text-[#6e7681]">Protected Days</div>
                    </div>
                </div>
            </div>

            {/* Domain Breakdown */}
            <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-base mb-4 text-[#8b949e]">
                    Domain Activity
                </h3>
                <div className="space-y-4">
                    {[
                        { name: 'Health', count: healthCount, color: '#58cc02', icon: '💪' },
                        { name: 'Faith', count: faithCount, color: '#ffc800', icon: '✨' },
                        { name: 'Career', count: careerCount, color: '#1cb0f6', icon: '🧠' },
                    ].map((domain) => (
                        <div key={domain.name}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="flex items-center gap-2 text-[#8b949e]">
                                    <span>{domain.icon}</span> {domain.name}
                                </span>
                                <span className="font-medium" style={{ color: domain.color }}>
                                    {domain.count} days
                                </span>
                            </div>
                            <div className="h-2 bg-[#161b22] rounded-full overflow-hidden">
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

            {/* Simple footer message */}
            <div className="text-center text-sm text-[#6e7681] py-4">
                Patterns speak louder than numbers.
            </div>
        </motion.div>
    );
}
