'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HabitData } from '@/lib/storage';
import { generateWeeklyReflection, WeeklyReflection } from '@/lib/reflections';

interface WeeklyReflectionCardProps {
    data: HabitData;
}

export default function WeeklyReflectionCard({ data }: WeeklyReflectionCardProps) {
    const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const generated = generateWeeklyReflection(data);
        setReflection(generated);
    }, [data]);

    if (!reflection) return null;

    const domainIcons: Record<string, string> = {
        health: '💪',
        faith: '✨',
        career: '🧠'
    };

    const domainNames: Record<string, string> = {
        health: 'Health',
        faith: 'Faith',
        career: 'Career'
    };

    return (
        <motion.div
            className="glass-card rounded-2xl p-5 my-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-base text-[#c9d1d9] flex items-center gap-2">
                        <span>📊</span>
                        Weekly Reflection
                    </h3>
                    <p className="text-xs text-[#6e7681] mt-1">
                        {new Date(reflection.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' → '}
                        {new Date(reflection.weekEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-[#1cb0f6] hover:underline"
                >
                    {isExpanded ? 'Less' : 'More'}
                </button>
            </div>

            {/* Narrative */}
            <p className="text-sm text-[#8b949e] mb-4">
                {reflection.narrative}
            </p>

            {/* Quick Stats */}
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

            {/* Expanded Details */}
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4 border-t border-[#30363d]"
                >
                    {/* Observation */}
                    <div>
                        <h4 className="text-xs text-[#6e7681] mb-2">Pattern Observation</h4>
                        <p className="text-sm text-[#8b949e]">{reflection.observation}</p>
                    </div>

                    {/* Domain Balance */}
                    {(reflection.dominantDomain || reflection.weakestDomain) && (
                        <div>
                            <h4 className="text-xs text-[#6e7681] mb-2">Domain Balance</h4>
                            <div className="flex gap-4">
                                {reflection.dominantDomain && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-[#58cc02]">↑</span>
                                        <span>{domainIcons[reflection.dominantDomain]}</span>
                                        <span className="text-[#8b949e]">{domainNames[reflection.dominantDomain]}</span>
                                    </div>
                                )}
                                {reflection.weakestDomain && reflection.weakestDomain !== reflection.dominantDomain && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-[#6e7681]">↓</span>
                                        <span>{domainIcons[reflection.weakestDomain]}</span>
                                        <span className="text-[#6e7681]">{domainNames[reflection.weakestDomain]}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Momentum Trend */}
                    <div>
                        <h4 className="text-xs text-[#6e7681] mb-2">Momentum Trend</h4>
                        <div className="flex items-center gap-2">
                            {reflection.momentum.trend === 'rising' && (
                                <>
                                    <span className="text-[#58cc02]">📈</span>
                                    <span className="text-sm text-[#58cc02]">Rising</span>
                                </>
                            )}
                            {reflection.momentum.trend === 'stable' && (
                                <>
                                    <span className="text-[#1cb0f6]">➡️</span>
                                    <span className="text-sm text-[#1cb0f6]">Stable</span>
                                </>
                            )}
                            {reflection.momentum.trend === 'falling' && (
                                <>
                                    <span className="text-[#8b949e]">📉</span>
                                    <span className="text-sm text-[#8b949e]">Falling</span>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Gentle Prompt (if any) */}
            {reflection.gentlePrompt && (
                <div className="mt-4 pt-4 border-t border-[#30363d]">
                    <p className="text-sm text-[#6e7681] italic text-center">
                        "{reflection.gentlePrompt}"
                    </p>
                </div>
            )}
        </motion.div>
    );
}
