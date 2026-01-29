'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingSlidesProps {
    onComplete: (selections: OnboardingSelections) => void;
}

export interface OnboardingSelections {
    domains: string[];
    minimumViableDay: 'easy' | 'moderate' | 'challenging';
    reflectionPreference: 'faith' | 'philosophical' | 'none';
}

const SLIDES = [
    {
        id: 'welcome',
        title: 'Welcome to CompoundVerse',
        subtitle: 'A calm space for consistent growth',
        content: null,
        icon: '🌱'
    },
    {
        id: 'philosophy',
        title: 'What This Is',
        subtitle: null,
        content: [
            'A dignity-preserving consistency system',
            'Built for real humans with fluctuating energy',
            'Progress over perfection',
            'Recovery is part of the system'
        ],
        icon: '✨'
    },
    {
        id: 'not',
        title: 'What This Is NOT',
        subtitle: null,
        content: [
            'Not a habit streak punishment engine',
            'Not a social competition',
            'Not a dopamine casino',
            'No shame. Ever.'
        ],
        icon: '🚫'
    },
    {
        id: 'domains',
        title: 'Choose Your Domains',
        subtitle: 'Start with at least 1 (max 5)',
        content: null,
        icon: '🎯'
    },
    {
        id: 'minimum',
        title: 'Minimum Viable Day',
        subtitle: 'What counts as "showing up"?',
        content: null,
        icon: '📏'
    },
    {
        id: 'reflection',
        title: 'Reflection Style',
        subtitle: 'How would you like moments of pause?',
        content: null,
        icon: '🪷'
    }
];

const AVAILABLE_DOMAINS = [
    { id: 'health', name: 'Health', icon: '💪', description: 'Physical wellness, movement, recovery' },
    { id: 'faith', name: 'Faith', icon: '✨', description: 'Spiritual practice, gratitude, reflection' },
    { id: 'career', name: 'Career', icon: '🧠', description: 'Learning, work, skill building' },
    { id: 'relationships', name: 'Relationships', icon: '💕', description: 'Connection, communication, community' },
    { id: 'creativity', name: 'Creativity', icon: '🎨', description: 'Art, music, expression, play' }
];

const MINIMUM_OPTIONS = [
    { id: 'easy', label: 'Keep it easy', description: '1 small action in any domain counts', icon: '🌿' },
    { id: 'moderate', label: 'Moderate', description: '1 action in each active domain', icon: '🌳' },
    { id: 'challenging', label: 'Challenge me', description: 'Multiple actions per domain', icon: '🏔️' }
];

const REFLECTION_OPTIONS = [
    { id: 'faith', label: 'Faith-based', description: 'Verses, prayers, spiritual prompts', icon: '🕌' },
    { id: 'philosophical', label: 'Philosophical', description: 'Stoic wisdom, mindfulness quotes', icon: '📖' },
    { id: 'none', label: 'Just quiet', description: 'Silence and breathing only', icon: '🤫' }
];

export default function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedDomains, setSelectedDomains] = useState<string[]>(['health', 'faith', 'career']);
    const [minimumViable, setMinimumViable] = useState<'easy' | 'moderate' | 'challenging'>('easy');
    const [reflectionPref, setReflectionPref] = useState<'faith' | 'philosophical' | 'none'>('philosophical');

    const slide = SLIDES[currentSlide];
    const isLast = currentSlide === SLIDES.length - 1;
    const canProceed = slide.id !== 'domains' || selectedDomains.length >= 1;

    const handleNext = () => {
        if (isLast) {
            onComplete({
                domains: selectedDomains,
                minimumViableDay: minimumViable,
                reflectionPreference: reflectionPref
            });
        } else {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const toggleDomain = (domainId: string) => {
        setSelectedDomains(prev => {
            if (prev.includes(domainId)) {
                return prev.filter(d => d !== domainId);
            }
            if (prev.length >= 5) return prev;
            return [...prev, domainId];
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0d1117]">
            {/* Progress dots */}
            <div className="flex gap-2 mb-8">
                {SLIDES.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentSlide
                                ? 'bg-[#58cc02] w-6'
                                : i < currentSlide
                                    ? 'bg-[#58cc02]/50'
                                    : 'bg-[#30363d]'
                            }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md text-center"
                >
                    {/* Icon */}
                    <div className="text-6xl mb-6">{slide.icon}</div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold mb-2">{slide.title}</h1>

                    {/* Subtitle */}
                    {slide.subtitle && (
                        <p className="text-[#8b949e] mb-6">{slide.subtitle}</p>
                    )}

                    {/* Content list */}
                    {slide.content && (
                        <ul className="text-left space-y-3 mb-8">
                            {slide.content.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3 text-[#8b949e]"
                                >
                                    <span className="text-[#58cc02]">•</span>
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    )}

                    {/* Domain Selection */}
                    {slide.id === 'domains' && (
                        <div className="space-y-3 mb-8 text-left">
                            {AVAILABLE_DOMAINS.map((domain) => (
                                <motion.button
                                    key={domain.id}
                                    onClick={() => toggleDomain(domain.id)}
                                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${selectedDomains.includes(domain.id)
                                            ? 'bg-[#58cc02]/20 border-2 border-[#58cc02]'
                                            : 'bg-[#161b22] border-2 border-[#30363d]'
                                        }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-2xl">{domain.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold">{domain.name}</div>
                                        <div className="text-xs text-[#6e7681]">{domain.description}</div>
                                    </div>
                                    {selectedDomains.includes(domain.id) && (
                                        <span className="text-[#58cc02]">✓</span>
                                    )}
                                </motion.button>
                            ))}
                            <p className="text-xs text-[#6e7681] text-center mt-2">
                                Selected: {selectedDomains.length}/5
                            </p>
                        </div>
                    )}

                    {/* Minimum Viable Day Selection */}
                    {slide.id === 'minimum' && (
                        <div className="space-y-3 mb-8 text-left">
                            {MINIMUM_OPTIONS.map((option) => (
                                <motion.button
                                    key={option.id}
                                    onClick={() => setMinimumViable(option.id as any)}
                                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${minimumViable === option.id
                                            ? 'bg-[#1cb0f6]/20 border-2 border-[#1cb0f6]'
                                            : 'bg-[#161b22] border-2 border-[#30363d]'
                                        }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-2xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold">{option.label}</div>
                                        <div className="text-xs text-[#6e7681]">{option.description}</div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}

                    {/* Reflection Preference */}
                    {slide.id === 'reflection' && (
                        <div className="space-y-3 mb-8 text-left">
                            {REFLECTION_OPTIONS.map((option) => (
                                <motion.button
                                    key={option.id}
                                    onClick={() => setReflectionPref(option.id as any)}
                                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${reflectionPref === option.id
                                            ? 'bg-[#8b5cf6]/20 border-2 border-[#8b5cf6]'
                                            : 'bg-[#161b22] border-2 border-[#30363d]'
                                        }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-2xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold">{option.label}</div>
                                        <div className="text-xs text-[#6e7681]">{option.description}</div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4 mt-8 w-full max-w-md">
                {currentSlide > 0 && (
                    <button
                        onClick={handleBack}
                        className="flex-1 py-3 rounded-xl bg-[#21262d] text-[#8b949e] font-medium"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${canProceed
                            ? 'bg-[#58cc02] text-[#1a3a00]'
                            : 'bg-[#30363d] text-[#6e7681]'
                        }`}
                >
                    {isLast ? 'Get Started' : 'Continue'}
                </button>
            </div>

            {/* Skip hint */}
            {currentSlide < 3 && (
                <button
                    onClick={() => setCurrentSlide(3)}
                    className="mt-4 text-xs text-[#6e7681] hover:text-[#8b949e]"
                >
                    Skip intro →
                </button>
            )}
        </div>
    );
}
