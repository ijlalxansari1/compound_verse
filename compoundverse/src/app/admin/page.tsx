'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSystemConfig, saveSystemConfig, getAdminLog, clearAdminLog, SystemConfig } from '@/lib/admin';
import { getCurrentUser, User } from '@/lib/auth';
import { QUOTES } from '@/lib/quotes';

const TABS = [
    { id: 'xp', label: 'XP Rules', icon: '⚡' },
    { id: 'verses', label: 'Verses', icon: '📖' },
    { id: 'coach', label: 'AI Coach', icon: '🤖' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'features', label: 'Features', icon: '🚀' },
    { id: 'quotes', label: 'Quotes', icon: '💬' },
    { id: 'logs', label: 'Logs', icon: '📋' },
];

export default function AdminPage() {
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('xp');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        setIsAuthLoading(false);
        setConfig(getSystemConfig());
    }, []);

    const handleSave = () => {
        if (config) {
            saveSystemConfig(config, currentUser?.id);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">⚙️ Loading...</div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white p-6">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-[#8b949e] mb-6">Please login from the main page to access admin settings.</p>
                <a href="/" className="px-6 py-2 bg-[#1cb0f6] rounded-xl font-bold">Back to App</a>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">⚙️ Loading Config...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0d1117] text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span>⚙️</span> Admin Dashboard
                        </h1>
                        <p className="text-[#8b949e] mt-1">System configuration & controls</p>
                    </div>
                    <a
                        href="/"
                        className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] rounded-xl text-sm font-semibold transition-colors"
                    >
                        ← Back to App
                    </a>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-[#1cb0f6] text-white'
                                : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6"
                >
                    {activeTab === 'xp' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">⚡ XP Rules</h2>

                            {(['healthXP', 'faithXP', 'careerXP', 'perfectDayBonus'] as const).map((key) => (
                                <div key={key} className="flex items-center justify-between">
                                    <label className="text-[#8b949e] capitalize">
                                        {key.replace('XP', ' XP').replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={config.xpRules[key]}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            xpRules: { ...config.xpRules, [key]: parseInt(e.target.value) || 0 }
                                        })}
                                        className="w-20 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-center"
                                    />
                                </div>
                            ))}

                            <div className="flex items-center justify-between">
                                <label className="text-[#8b949e]">XP Per Level</label>
                                <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={config.xpRules.xpPerLevel}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        xpRules: { ...config.xpRules, xpPerLevel: parseInt(e.target.value) || 30 }
                                    })}
                                    className="w-20 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-center"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'verses' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">📖 Verse Configuration</h2>

                            {(['health', 'faith', 'career'] as const).map((verse) => (
                                <div key={verse} className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d]">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{config.verses[verse].icon}</span>
                                        <label className="flex items-center gap-2">
                                            <span className="text-sm text-[#8b949e]">Enabled</span>
                                            <input
                                                type="checkbox"
                                                checked={config.verses[verse].enabled}
                                                onChange={(e) => setConfig({
                                                    ...config,
                                                    verses: {
                                                        ...config.verses,
                                                        [verse]: { ...config.verses[verse], enabled: e.target.checked }
                                                    }
                                                })}
                                                className="w-5 h-5 accent-[#58cc02]"
                                            />
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={config.verses[verse].name}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            verses: {
                                                ...config.verses,
                                                [verse]: { ...config.verses[verse], name: e.target.value }
                                            }
                                        })}
                                        className="w-full px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg"
                                        placeholder="Verse name"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'coach' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">🤖 AI Coach Settings</h2>

                            <div>
                                <label className="block text-[#8b949e] mb-2">Default Tone</label>
                                <div className="flex gap-2">
                                    {(['gentle', 'neutral', 'direct'] as const).map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => setConfig({
                                                ...config,
                                                coach: { ...config.coach, tone }
                                            })}
                                            className={`flex-1 py-3 rounded-xl font-semibold capitalize transition-all ${config.coach.tone === tone
                                                ? 'bg-[#58cc02] text-[#1a3a00]'
                                                : 'bg-[#0d1117] text-[#8b949e] hover:bg-[#21262d]'
                                                }`}
                                        >
                                            {tone}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-[#8b949e]">Tip Rotation (hours)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={config.coach.tipRotationHours}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        coach: { ...config.coach, tipRotationHours: parseInt(e.target.value) || 1 }
                                    })}
                                    className="w-20 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-center"
                                />
                            </div>

                            <label className="flex items-center justify-between">
                                <span className="text-[#8b949e]">Enable Tips</span>
                                <input
                                    type="checkbox"
                                    checked={config.coach.enableTips}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        coach: { ...config.coach, enableTips: e.target.checked }
                                    })}
                                    className="w-5 h-5 accent-[#58cc02]"
                                />
                            </label>
                        </div>
                    )}

                    {activeTab === 'music' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">🎵 Music Settings</h2>

                            <label className="flex items-center justify-between">
                                <span className="text-[#8b949e]">Enabled by Default</span>
                                <input
                                    type="checkbox"
                                    checked={config.music.enabledByDefault}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        music: { ...config.music, enabledByDefault: e.target.checked }
                                    })}
                                    className="w-5 h-5 accent-[#58cc02]"
                                />
                            </label>

                            <div>
                                <label className="block text-[#8b949e] mb-2">Default Category</label>
                                <div className="flex gap-2">
                                    {(['classical', 'ambient', 'silence'] as const).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setConfig({
                                                ...config,
                                                music: { ...config.music, defaultCategory: cat }
                                            })}
                                            className={`flex-1 py-3 rounded-xl font-semibold capitalize transition-all ${config.music.defaultCategory === cat
                                                ? 'bg-[#1cb0f6] text-white'
                                                : 'bg-[#0d1117] text-[#8b949e] hover:bg-[#21262d]'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#8b949e] mb-2">Max Volume: {Math.round(config.music.maxVolume * 100)}%</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="0.5"
                                    step="0.1"
                                    value={config.music.maxVolume}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        music: { ...config.music, maxVolume: parseFloat(e.target.value) }
                                    })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold mb-4">🚀 Feature Flags</h2>

                            {Object.entries(config.features).map(([key, value]) => (
                                <label key={key} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-xl">
                                    <span className="text-[#8b949e] capitalize">
                                        {key.replace(/([A-Z])/g, ' $1')}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            features: { ...config.features, [key]: e.target.checked }
                                        })}
                                        className="w-5 h-5 accent-[#58cc02]"
                                    />
                                </label>
                            ))}
                        </div>
                    )}

                    {activeTab === 'quotes' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold mb-4">💬 Quote Library ({QUOTES.length} quotes)</h2>

                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {QUOTES.map((quote, i) => (
                                    <div key={i} className="p-3 bg-[#0d1117] rounded-xl text-sm">
                                        <p className="text-white italic">"{quote.text}"</p>
                                        <p className="text-[#6e7681] mt-1">— {quote.author} • {quote.category}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">📋 Admin Audit Log</h2>
                                <button
                                    onClick={() => {
                                        clearAdminLog(currentUser?.id);
                                        window.location.reload();
                                    }}
                                    className="px-3 py-1 bg-[#ff4b4b]/20 text-[#ff4b4b] rounded-lg text-sm hover:bg-[#ff4b4b]/30"
                                >
                                    Clear Logs
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {getAdminLog(currentUser?.id).reverse().map((log, i) => (
                                    <div key={i} className="p-3 bg-[#0d1117] rounded-xl text-sm">
                                        <p className="text-[#6e7681]">{new Date(log.timestamp).toLocaleString()}</p>
                                        <p className="text-white font-semibold">{log.action}</p>
                                    </div>
                                ))}
                                {getAdminLog(currentUser?.id).length === 0 && (
                                    <p className="text-[#6e7681] text-center py-8">No logs yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Save Button */}
                <motion.button
                    onClick={handleSave}
                    className={`mt-6 w-full py-4 rounded-2xl font-bold text-lg transition-all ${saved
                        ? 'bg-[#58cc02] text-[#1a3a00]'
                        : 'bg-[#1cb0f6] text-white hover:bg-[#0095d4]'
                        }`}
                    whileTap={{ scale: 0.98 }}
                >
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </motion.button>
            </div>
        </main>
    );
}
