'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    getAnalyticsDashboard,
    AnalyticsDashboard,
    MomentumTrend
} from '@/lib/analytics';
import { getSystemConfig, saveSystemConfig, SystemConfig } from '@/lib/admin';

// Simple bar chart component
function MomentumChart({ data }: { data: MomentumTrend[] }) {
    const maxScore = 100;

    return (
        <div className="flex items-end gap-1 h-32">
            {data.map((point, i) => (
                <div key={point.date} className="flex-1 flex flex-col items-center">
                    <motion.div
                        className="w-full rounded-t-sm"
                        style={{
                            backgroundColor: point.score >= 70 ? '#58cc02'
                                : point.score >= 40 ? '#1cb0f6'
                                    : '#6e7681'
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.score / maxScore) * 100}%` }}
                        transition={{ delay: i * 0.05 }}
                    />
                    {i % 3 === 0 && (
                        <span className="text-[8px] text-[#6e7681] mt-1">
                            {point.date.slice(5)}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

// Feature toggle component
function FeatureToggle({
    label,
    description,
    enabled,
    onChange
}: {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}) {
    return (
        <div
            className="flex items-center justify-between p-3 rounded-lg bg-[#161b22] cursor-pointer hover:bg-[#21262d] transition-colors"
            onClick={() => onChange(!enabled)}
        >
            <div>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-[#6e7681]">{description}</div>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${enabled ? 'bg-[#58cc02]' : 'bg-[#30363d]'
                }`}>
                <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow"
                    animate={{ x: enabled ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
        </div>
    );
}

interface AdminDashboardProps {
    onConfigChange?: () => void;
    userId?: string;
}

export default function AdminDashboard({ onConfigChange, userId }: AdminDashboardProps) {
    const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [activeSection, setActiveSection] = useState<'analytics' | 'toggles'>('analytics');

    useEffect(() => {
        loadData();
    }, [userId]);

    const loadData = () => {
        setAnalytics(getAnalyticsDashboard(userId));
        setConfig(getSystemConfig());
    };

    const updateFeature = (key: keyof SystemConfig['features'], value: boolean) => {
        if (!config) return;

        const updatedConfig = {
            ...config,
            features: {
                ...config.features,
                [key]: value
            }
        };

        saveSystemConfig(updatedConfig, userId);
        setConfig(updatedConfig);
        onConfigChange?.();
    };

    if (!analytics || !config) {
        return (
            <div className="flex items-center justify-center py-8">
                <span className="text-[#6e7681]">Loading analytics...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Section Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveSection('analytics')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeSection === 'analytics'
                        ? 'bg-[#1cb0f6] text-white'
                        : 'bg-[#21262d] text-[#8b949e]'
                        }`}
                >
                    📊 Analytics
                </button>
                <button
                    onClick={() => setActiveSection('toggles')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeSection === 'toggles'
                        ? 'bg-[#1cb0f6] text-white'
                        : 'bg-[#21262d] text-[#8b949e]'
                        }`}
                >
                    ⚙️ Features
                </button>
            </div>

            {activeSection === 'analytics' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                >
                    {/* Engagement Overview */}
                    <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-semibold text-base mb-4 text-[#8b949e]">
                            Engagement Overview
                        </h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-[#161b22] rounded-xl p-3">
                                <div className="text-2xl font-bold text-[#58cc02]">
                                    {analytics.engagement.currentMomentum}%
                                </div>
                                <div className="text-xs text-[#6e7681]">Momentum</div>
                            </div>
                            <div className="bg-[#161b22] rounded-xl p-3">
                                <div className="text-2xl font-bold text-[#1cb0f6]">
                                    {analytics.engagement.engagementRate}%
                                </div>
                                <div className="text-xs text-[#6e7681]">Engagement</div>
                            </div>
                            <div className="bg-[#161b22] rounded-xl p-3">
                                <div className="text-2xl font-bold text-[#ffc800]">
                                    {analytics.engagement.activeDays}
                                </div>
                                <div className="text-xs text-[#6e7681]">Active Days</div>
                            </div>
                        </div>
                    </div>

                    {/* Momentum Trend Chart */}
                    <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-semibold text-base mb-4 text-[#8b949e]">
                            Momentum (14 Days)
                        </h3>
                        <MomentumChart data={analytics.momentumHistory} />
                        <div className="flex justify-between mt-3 text-xs text-[#6e7681]">
                            <span>
                                7-day avg: {analytics.engagement.averageMomentum7Days}%
                            </span>
                            <span>
                                Trend: {analytics.engagement.momentumTrend === 'rising' ? '↗ Rising'
                                    : analytics.engagement.momentumTrend === 'falling' ? '↘ Falling'
                                        : '→ Stable'}
                            </span>
                        </div>
                    </div>

                    {/* Domain Usage */}
                    <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-semibold text-base mb-4 text-[#8b949e]">
                            Domain Activity
                        </h3>
                        <div className="space-y-3">
                            {analytics.domains.map((domain) => (
                                <div key={domain.domainId} className="flex items-center gap-3">
                                    <span className="text-xl">{domain.domainIcon}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{domain.domainName}</span>
                                            <span className="text-[#6e7681]">
                                                {domain.completionRate}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-[#161b22] rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#58cc02] rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${domain.completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panic Analytics */}
                    <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-semibold text-base mb-4 text-[#8b949e]">
                            🌊 Grounding Usage
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="bg-[#161b22] rounded-xl p-3">
                                <div className="text-xl font-bold text-[#8b5cf6]">
                                    {analytics.panic.totalPanicActivations}
                                </div>
                                <div className="text-xs text-[#6e7681]">Total Uses</div>
                            </div>
                            <div className="bg-[#161b22] rounded-xl p-3">
                                <div className="text-xl font-bold text-[#8b5cf6]">
                                    {analytics.panic.panicDaysLast7}
                                </div>
                                <div className="text-xs text-[#6e7681]">This Week</div>
                            </div>
                        </div>
                        <p className="text-xs text-[#6e7681] text-center mt-3">
                            Protected days preserve momentum without penalty.
                        </p>
                    </div>
                </motion.div>
            )}

            {activeSection === 'toggles' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                >
                    <FeatureToggle
                        label="Streak Display"
                        description="Show traditional streak counter"
                        enabled={config.features.streakDisplay}
                        onChange={(v) => updateFeature('streakDisplay', v)}
                    />
                    <FeatureToggle
                        label="Perfect Day Confetti"
                        description="Celebrate complete days with confetti"
                        enabled={config.features.perfectDayConfetti}
                        onChange={(v) => updateFeature('perfectDayConfetti', v)}
                    />
                    <FeatureToggle
                        label="Dynamic Verses"
                        description="Custom domain creation"
                        enabled={config.features.dynamicVerses}
                        onChange={(v) => updateFeature('dynamicVerses', v)}
                    />
                    <FeatureToggle
                        label="Reflections"
                        description="Enable daily reflection notes"
                        enabled={config.features.reflections}
                        onChange={(v) => updateFeature('reflections', v)}
                    />
                    <FeatureToggle
                        label="Export PDF"
                        description="Allow PDF exports"
                        enabled={config.features.exportPDF}
                        onChange={(v) => updateFeature('exportPDF', v)}
                    />
                    <FeatureToggle
                        label="Export CSV"
                        description="Allow CSV exports"
                        enabled={config.features.exportCSV}
                        onChange={(v) => updateFeature('exportCSV', v)}
                    />

                    <div className="pt-4">
                        <p className="text-xs text-[#6e7681] text-center">
                            Changes apply immediately.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Last Updated */}
            <div className="text-center text-xs text-[#6e7681]">
                Last updated: {new Date(analytics.lastUpdated).toLocaleTimeString()}
            </div>
        </div>
    );
}
