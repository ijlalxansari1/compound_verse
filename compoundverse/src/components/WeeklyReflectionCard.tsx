'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HabitData, Entry } from '@/lib/storage'; // Keep types but logic moves to AI
import { generateWeeklyReflection, WeeklyReflection } from '@/lib/reflections';

interface WeeklyReflectionCardProps {
    data: HabitData;
    username: string; // Added prop
}

export default function WeeklyReflectionCard({ data, username }: WeeklyReflectionCardProps) {
    const [aiAnalysis, setAiAnalysis] = useState<{ narrative: string; tips: string[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Standard reflection (client-side calculation)
    useEffect(() => {
        const generated = generateWeeklyReflection(data);
        setReflection(generated);
    }, [data]);

    // AI Analysis (On Demand)
    const handleAnalyze = async () => {
        if (!data.entries.length) return;
        setLoading(true);
        setIsExpanded(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analysis',
                    payload: {
                        entries: data.entries.slice(0, 14), // Send last 2 weeks
                        username
                    }
                })
            });
            const result = await response.json();
            setAiAnalysis(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!reflection) return null;

    return (
        <motion.div
            className="glass-card rounded-2xl p-5 my-6 border border-white/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-base text-[#c9d1d9] flex items-center gap-2">
                        <span>🧠</span>
                        Weekly Insights
                    </h3>
                    <p className="text-xs text-[#6e7681] mt-1">
                        AI-Powered Analysis
                    </p>
                </div>
                {!aiAnalysis && !loading && (
                    <button
                        onClick={handleAnalyze}
                        className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full hover:bg-indigo-500/30 transition-colors"
                    >
                        ✨ Analyze
                    </button>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 bg-[#161b22] rounded-lg">
                    <div className="text-lg font-bold text-[#58cc02]">{reflection.activeDays}</div>
                    <div className="text-xs text-[#6e7681]">Active</div>
                </div>
                <div className="text-center p-2 bg-[#161b22] rounded-lg">
                    <div className="text-lg font-bold text-[#ffc800]">{reflection.perfectDays}</div>
                    <div className="text-xs text-[#6e7681]">Perfect</div>
                </div>
                <div className="text-center p-2 bg-[#161b22] rounded-lg">
                    <div className="text-lg font-bold text-[#8b5cf6]">{reflection.protectedDays}</div>
                    <div className="text-xs text-[#6e7681]">Protected</div>
                </div>
                <div className="text-center p-2 bg-[#161b22] rounded-lg">
                    <div className="text-lg font-bold text-[#1cb0f6]">{reflection.momentum.score}%</div>
                    <div className="text-xs text-[#6e7681]">Momentum</div>
                </div>
            </div>

            {/* AI Content Area */}
            <div className="min-h-[60px]">
                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                ) : aiAnalysis ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <p className="text-sm text-[#8b949e] leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                            "{aiAnalysis.narrative}"
                        </p>

                        <div className="bg-[#161b22]/50 p-3 rounded-lg">
                            <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Coach's Tips</h4>
                            <ul className="space-y-2">
                                {aiAnalysis.tips.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                                        <span className="text-indigo-400">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ) : (
                    <p className="text-sm text-[#6e7681] text-center italic">
                        Tap "Analyze" to unlock deep insights.
                    </p>
                )}
            </div>
        </motion.div>
    );
}
