'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 bg-[#0d1117] flex flex-col items-center justify-center z-50">
            {/* Animated Logo */}
            <motion.div
                className="relative w-24 h-24 mb-6"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Image
                    src="/logo.png"
                    alt="CompoundVerse"
                    fill
                    className="object-contain"
                    priority
                />
            </motion.div>

            {/* Subtle loading dots */}
            <div className="flex gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#58cc02]"
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Message */}
            <motion.p
                className="text-[#6e7681] text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {message}
            </motion.p>
        </div>
    );
}
