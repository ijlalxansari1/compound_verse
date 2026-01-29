'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    exitGroundingMode,
    getRemainingGroundingTime,
    getPanicState
} from '@/lib/panic';
import { getUserSettings } from '@/lib/admin';

interface GroundingModeProps {
    onExit: () => void;
}

// Calm, grounding verses/quotes
const FAITH_VERSES = [
    "With hardship comes ease. — Quran 94:6",
    "Allah does not burden a soul beyond that it can bear. — Quran 2:286",
    "Sufficient for us is Allah. — Quran 3:173",
    "Indeed, my Lord is near and responsive. — Quran 11:61"
];

const PHILOSOPHICAL_QUOTES = [
    "This too shall pass.",
    "You have power over your mind, not outside events. — Marcus Aurelius",
    "The obstacle is the way.",
    "Between stimulus and response there is a space. In that space is our power. — Viktor Frankl",
    "What we cannot speak about we must pass over in silence. — Wittgenstein"
];

export default function GroundingMode({ onExit }: GroundingModeProps) {
    const [remainingSeconds, setRemainingSeconds] = useState(getRemainingGroundingTime());
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [showExit, setShowExit] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [selfNote, setSelfNote] = useState('');
    const [currentVerse, setCurrentVerse] = useState('');

    // Get user's reflection preference
    useEffect(() => {
        const settings = getUserSettings();
        const verses = settings.reflectionPreference === 'faith'
            ? FAITH_VERSES
            : settings.reflectionPreference === 'philosophical'
                ? PHILOSOPHICAL_QUOTES
                : [];

        if (verses.length > 0) {
            const randomIndex = Math.floor(Math.random() * verses.length);
            setCurrentVerse(verses[randomIndex]);
        }
    }, []);

    // Format time display
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = getRemainingGroundingTime();
            setRemainingSeconds(remaining);

            if (remaining <= 0) {
                setShowExit(true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Breathing animation cycle (4-7-8 pattern)
    useEffect(() => {
        const breatheCycle = () => {
            // Inhale for 4 seconds
            setBreathPhase('inhale');
            setTimeout(() => {
                // Hold for 7 seconds
                setBreathPhase('hold');
                setTimeout(() => {
                    // Exhale for 8 seconds
                    setBreathPhase('exhale');
                    setTimeout(breatheCycle, 8000);
                }, 7000);
            }, 4000);
        };

        breatheCycle();
    }, []);

    const handleExit = useCallback(() => {
        // Save self-note if entered
        if (selfNote.trim()) {
            const notes = JSON.parse(localStorage.getItem('compoundverse_grounding_notes') || '[]');
            notes.push({
                date: new Date().toISOString(),
                note: selfNote.trim()
            });
            localStorage.setItem('compoundverse_grounding_notes', JSON.stringify(notes));
        }
        exitGroundingMode();
        onExit();
    }, [onExit, selfNote]);

    const getBreathingInstruction = (): string => {
        switch (breathPhase) {
            case 'inhale': return 'Breathe in...';
            case 'hold': return 'Hold...';
            case 'exhale': return 'Breathe out...';
        }
    };

    const getBreathingScale = (): number => {
        switch (breathPhase) {
            case 'inhale': return 1.3;
            case 'hold': return 1.3;
            case 'exhale': return 1;
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col items-center justify-center overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Minimal UI - nearly empty */}
            <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 max-w-md">
                {/* Main message - no advice, no guilt */}
                <motion.p
                    className="text-[#6e7681] text-lg text-center mb-8 max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    You don't need to decide anything right now.
                </motion.p>

                {/* Verse/Quote (if preference is set) */}
                {currentVerse && (
                    <motion.p
                        className="text-[#8b5cf6]/70 text-sm text-center mb-8 max-w-xs italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        "{currentVerse}"
                    </motion.p>
                )}

                {/* Breathing circle */}
                <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8b5cf6]/30 to-[#1cb0f6]/30 flex items-center justify-center"
                    animate={{
                        scale: getBreathingScale(),
                    }}
                    transition={{
                        duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 0 : 8,
                        ease: 'easeInOut'
                    }}
                >
                    <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8b5cf6]/50 to-[#1cb0f6]/50"
                        animate={{
                            scale: getBreathingScale() * 0.9,
                        }}
                        transition={{
                            duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 0 : 8,
                            ease: 'easeInOut'
                        }}
                    />
                </motion.div>

                {/* Breathing instruction */}
                <motion.p
                    key={breathPhase}
                    className="text-[#8b949e] text-sm mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {getBreathingInstruction()}
                </motion.p>

                {/* Timer */}
                <motion.div
                    className="mt-8 text-[#6e7681] text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {remainingSeconds > 0 ? (
                        <span>{formatTime(remainingSeconds)} remaining</span>
                    ) : (
                        <span>Take your time</span>
                    )}
                </motion.div>

                {/* Options toggle */}
                <motion.button
                    onClick={() => setShowOptions(!showOptions)}
                    className="mt-6 text-[#30363d] text-xs hover:text-[#6e7681] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    {showOptions ? '▼ Less options' : '▶ More options'}
                </motion.button>

                {/* Optional actions */}
                <AnimatePresence>
                    {showOptions && (
                        <motion.div
                            className="mt-6 space-y-4 w-full"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {/* Walk prompt */}
                            <button
                                className="w-full p-4 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#8b5cf6]/50 transition-colors"
                            >
                                <span className="text-xl mr-3">🚶</span>
                                <span className="text-[#8b949e] text-sm">Take a short walk</span>
                            </button>

                            {/* Self-note */}
                            <div className="w-full">
                                <textarea
                                    value={selfNote}
                                    onChange={(e) => setSelfNote(e.target.value)}
                                    placeholder="Write a note to yourself (optional)..."
                                    className="w-full p-4 rounded-xl bg-[#161b22] border border-[#30363d] text-sm text-[#8b949e] placeholder-[#6e7681] resize-none focus:border-[#8b5cf6]/50 focus:outline-none"
                                    rows={3}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Exit button - appears after timer or on tap */}
            <AnimatePresence>
                {(showExit || remainingSeconds <= 0) && (
                    <motion.button
                        onClick={handleExit}
                        className="mb-12 px-8 py-3 rounded-full bg-[#21262d] text-[#8b949e] text-sm hover:bg-[#30363d] transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        I'm ready to come back
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Early exit (always available but subtle) */}
            {!showExit && remainingSeconds > 0 && (
                <motion.button
                    onClick={() => setShowExit(true)}
                    className="mb-12 text-[#30363d] text-xs hover:text-[#6e7681] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                >
                    Exit early
                </motion.button>
            )}
        </motion.div>
    );
}
