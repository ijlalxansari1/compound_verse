'use client';

import { motion } from 'framer-motion';
import { MomentumResult, getTrendIcon } from '@/lib/momentum';

interface MomentumRingProps {
    momentum: MomentumResult;
    size?: 'sm' | 'md' | 'lg';
}

export default function MomentumRing({ momentum, size = 'md' }: MomentumRingProps) {
    const { score, trend, message, activeDays, totalDays, isProtected } = momentum;

    // Size configurations
    const sizes = {
        sm: { ring: 80, stroke: 6, text: 'text-lg', label: 'text-xs' },
        md: { ring: 120, stroke: 8, text: 'text-2xl', label: 'text-sm' },
        lg: { ring: 160, stroke: 10, text: 'text-3xl', label: 'text-base' }
    };

    const config = sizes[size];
    const radius = (config.ring - config.stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Color based on score (calm palette)
    const getColor = () => {
        if (isProtected) return '#8b5cf6'; // Purple for protected
        if (score >= 70) return '#58cc02'; // Green
        if (score >= 40) return '#1cb0f6'; // Blue
        return '#6e7681'; // Muted gray
    };

    const ringColor = getColor();

    return (
        <div className="flex flex-col items-center">
            {/* Momentum Ring */}
            <div className="relative" style={{ width: config.ring, height: config.ring }}>
                <svg
                    className="transform -rotate-90"
                    width={config.ring}
                    height={config.ring}
                >
                    {/* Background ring */}
                    <circle
                        cx={config.ring / 2}
                        cy={config.ring / 2}
                        r={radius}
                        fill="none"
                        stroke="#21262d"
                        strokeWidth={config.stroke}
                    />

                    {/* Progress ring */}
                    <motion.circle
                        cx={config.ring / 2}
                        cy={config.ring / 2}
                        r={radius}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth={config.stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            filter: `drop-shadow(0 0 8px ${ringColor}40)`
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className={`${config.text} font-bold`}
                        style={{ color: ringColor }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {score}%
                    </motion.span>
                    <span className={`${config.label} text-[#6e7681] flex items-center gap-1`}>
                        {getTrendIcon(trend)} {activeDays}/{totalDays}
                    </span>
                </div>
            </div>

            {/* Message */}
            <motion.p
                className="text-sm text-[#8b949e] mt-3 text-center max-w-[200px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {message}
            </motion.p>

            {/* Protected badge */}
            {isProtected && (
                <motion.div
                    className="mt-2 px-3 py-1 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    🛡️ Protected Day
                </motion.div>
            )}
        </div>
    );
}
