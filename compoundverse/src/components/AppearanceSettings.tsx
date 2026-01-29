'use client';

import { motion } from 'framer-motion';
import { UserSettings, saveUserSettings } from '@/lib/admin';

interface AppearanceSettingsProps {
    settings: UserSettings;
    onUpdate: (newSettings: UserSettings) => void;
}

const THEMES = [
    { id: 'midnight', name: 'Midnight', color: '#58cc02', bg: '#0d1117' },
    { id: 'aurora', name: 'Aurora', color: '#10b981', bg: '#0a1919' },
    { id: 'solar', name: 'Solar', color: '#ffc800', bg: '#1a160d' },
    { id: 'monochrome', name: 'Monochrome', color: '#ffffff', bg: '#000000' },
];

const INTENSITIES = [
    { id: 'full', name: 'Full', label: 'Playful & Bouncy' },
    { id: 'reduced', name: 'Reduced', label: 'Smooth & Calm' },
    { id: 'static', name: 'Static', label: 'Minimal Focus' },
];

export default function AppearanceSettings({ settings, onUpdate }: AppearanceSettingsProps) {
    const handleThemeChange = (themeId: any) => {
        const newSettings = { ...settings, theme: themeId };
        saveUserSettings(newSettings);
        onUpdate(newSettings);
    };

    const handleIntensityChange = (intensityId: any) => {
        const newSettings = { ...settings, animationIntensity: intensityId };
        saveUserSettings(newSettings);
        onUpdate(newSettings);
    };

    return (
        <div className="space-y-6">
            {/* Theme Picker */}
            <div>
                <h3 className="text-sm font-bold text-[#8b949e] uppercase tracking-wider mb-4">
                    Visual Theme
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {THEMES.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={`p-4 rounded-2xl border-2 transition-all text-left ${settings.theme === theme.id
                                    ? 'border-[#58cc02] bg-[#1a1c23]'
                                    : 'border-[#30363d] bg-[#161b22] hover:border-[#6e7681]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full border border-white/10"
                                    style={{ backgroundColor: theme.color }}
                                />
                                <div>
                                    <div className="font-bold text-sm">{theme.name}</div>
                                    <div className="text-[10px] text-[#6e7681]">Base: {theme.bg}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Animation Intensity */}
            <div>
                <h3 className="text-sm font-bold text-[#8b949e] uppercase tracking-wider mb-4">
                    Animation Intensity
                </h3>
                <div className="space-y-2">
                    {INTENSITIES.map((intensity) => (
                        <button
                            key={intensity.id}
                            onClick={() => handleIntensityChange(intensity.id)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${settings.animationIntensity === intensity.id
                                    ? 'border-[#1cb0f6] bg-[#1a1c23]'
                                    : 'border-[#30363d] bg-[#161b22] hover:border-[#6e7681]'
                                }`}
                        >
                            <div className="text-left">
                                <div className="font-bold text-sm">{intensity.name}</div>
                                <div className="text-xs text-[#6e7681]">{intensity.label}</div>
                            </div>
                            {settings.animationIntensity === intensity.id && (
                                <motion.span
                                    layoutId="intensity-check"
                                    className="text-[#1cb0f6]"
                                >
                                    ●
                                </motion.span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
