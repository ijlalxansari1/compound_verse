'use client';

import { motion } from 'framer-motion';
import { activatePanic } from '@/lib/panic';

interface PanicButtonProps {
    onActivate: () => void;
}

export default function PanicButton({ onActivate }: PanicButtonProps) {
    const handleClick = () => {
        // Immediately activate - no confirmation
        activatePanic();
        onActivate();
    };

    return (
        <motion.button
            onClick={handleClick}
            className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-[#21262d] border-2 border-[#30363d] flex items-center justify-center shadow-lg hover:bg-[#30363d] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Panic Button - Take a grounding break"
            aria-label="Panic Button"
        >
            {/* Subtle pulse animation - not alarming */}
            <motion.div
                className="absolute inset-0 rounded-full bg-[#8b5cf6]/20"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* Icon - calm, not alarming */}
            <span className="text-2xl relative z-10">🌊</span>
        </motion.button>
    );
}
