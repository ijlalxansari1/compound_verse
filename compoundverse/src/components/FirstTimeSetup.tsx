'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveUserSettings, completeSetup, getUserSettings } from '@/lib/admin';
import OnboardingSlides, { OnboardingSelections } from './OnboardingSlides';

const AVATARS = ['🦁', '🐯', '🦊', '🐻', '🐼', '🦄', '🐲', '🦅', '🐺', '🦋'];

const TIMEZONES = [
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Karachi',
    'Asia/Dubai',
    'Australia/Sydney',
];

interface FirstTimeSetupProps {
    onComplete: () => void;
}

export default function FirstTimeSetup({ onComplete }: FirstTimeSetupProps) {
    const [showSlides, setShowSlides] = useState(true);
    const [onboardingData, setOnboardingData] = useState<OnboardingSelections | null>(null);
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('🦁');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [coachTone, setCoachTone] = useState<'gentle' | 'neutral' | 'direct'>('neutral');

    const handleOnboardingComplete = (selections: OnboardingSelections) => {
        setOnboardingData(selections);
        setShowSlides(false);
    };

    const handleComplete = () => {
        const settings = getUserSettings();
        saveUserSettings({
            ...settings,
            username: username || 'Player',
            avatar,
            timezone,
            coachTone,
            setupComplete: true,
            // Add onboarding preferences to settings
            onboarding: onboardingData
        });
        completeSetup();
        onComplete();
    };

    if (showSlides) {
        return <OnboardingSlides onComplete={handleOnboardingComplete} />;
    }

    const totalSteps = 4;

    return (
        <div className="fixed inset-0 bg-[#0d1117] z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#58cc02]' : 'bg-[#30363d]'
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Welcome */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="text-center"
                        >
                            <motion.div
                                className="text-7xl mb-6"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🎮
                            </motion.div>
                            <h1 className="text-3xl font-bold mb-4 gradient-text">Welcome to CompoundVerse</h1>
                            <p className="text-[#8b949e] mb-8 leading-relaxed">
                                A human-centered life operating system designed to help you compound small,
                                consistent actions across your core life domains.
                            </p>
                            <p className="text-sm text-[#6e7681] mb-8 italic">
                                "Small wins compound quietly."
                            </p>
                            <button
                                onClick={() => setStep(2)}
                                className="btn-duo w-full"
                            >
                                Get Started →
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Username & Avatar */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <h2 className="text-2xl font-bold mb-2">Who are you?</h2>
                            <p className="text-[#8b949e] mb-6">Choose an avatar and enter your name</p>

                            {/* Avatar Selection */}
                            <div className="flex flex-wrap gap-3 justify-center mb-6">
                                {AVATARS.map((a) => (
                                    <motion.button
                                        key={a}
                                        onClick={() => setAvatar(a)}
                                        className={`text-3xl p-3 rounded-xl transition-all ${avatar === a
                                            ? 'bg-[#ffc800] scale-110 shadow-lg'
                                            : 'bg-[#21262d] hover:bg-[#30363d]'
                                            }`}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {a}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Username */}
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 bg-[#161b22] border-2 border-[#30363d] rounded-xl text-lg focus:border-[#58cc02] focus:outline-none transition-colors mb-6"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 bg-[#21262d] rounded-xl font-semibold hover:bg-[#30363d] transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-3 bg-[#58cc02] text-[#1a3a00] rounded-xl font-bold hover:bg-[#4caf00] transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Timezone */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <h2 className="text-2xl font-bold mb-2">🌍 Your Timezone</h2>
                            <p className="text-[#8b949e] mb-6">Select your timezone for accurate daily tracking</p>

                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="w-full px-4 py-3 bg-[#161b22] border-2 border-[#30363d] rounded-xl text-lg focus:border-[#58cc02] focus:outline-none transition-colors mb-6 appearance-none"
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                                ))}
                            </select>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-3 bg-[#21262d] rounded-xl font-semibold hover:bg-[#30363d] transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="flex-1 py-3 bg-[#58cc02] text-[#1a3a00] rounded-xl font-bold hover:bg-[#4caf00] transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Coach Tone */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <h2 className="text-2xl font-bold mb-2">🤖 AI Coach Tone</h2>
                            <p className="text-[#8b949e] mb-6">How should your coach speak to you?</p>

                            <div className="space-y-3 mb-6">
                                {[
                                    { id: 'gentle', emoji: '🌸', title: 'Gentle', desc: 'Soft encouragement, nurturing tone' },
                                    { id: 'neutral', emoji: '⚖️', title: 'Neutral', desc: 'Balanced, informative feedback' },
                                    { id: 'direct', emoji: '🎯', title: 'Direct', desc: 'Straight to the point, no fluff' },
                                ].map(({ id, emoji, title, desc }) => (
                                    <button
                                        key={id}
                                        onClick={() => setCoachTone(id as typeof coachTone)}
                                        className={`w-full p-4 rounded-xl text-left transition-all border-2 ${coachTone === id
                                            ? 'bg-[#58cc02]/20 border-[#58cc02]'
                                            : 'bg-[#161b22] border-[#30363d] hover:border-[#58cc02]/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{emoji}</span>
                                            <div>
                                                <div className="font-bold">{title}</div>
                                                <div className="text-sm text-[#8b949e]">{desc}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-3 bg-[#21262d] rounded-xl font-semibold hover:bg-[#30363d] transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleComplete}
                                    className="flex-1 py-3 bg-[#ffc800] text-[#1a3a00] rounded-xl font-bold hover:bg-[#ff9d00] transition-colors"
                                >
                                    Start Journey ✨
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
