'use client';

import { motion } from 'framer-motion';

interface CoachFeedbackProps {
    message: string;
    xpNote: string;
    health: number;
    faith: number;
    career: number;
}

export default function CoachFeedback({ message, xpNote, health, faith, career }: CoachFeedbackProps) {
    return (
        <motion.div
            className="glass-card rounded-2xl p-6 border-2 border-[#58cc02] shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ boxShadow: '0 0 30px rgba(88, 204, 2, 0.2)' }}
        >
            {/* Coach Header */}
            <div className="flex items-center gap-4 mb-4">
                <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#58cc02] to-[#4caf00] flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-2xl">🤖</span>
                </motion.div>
                <div>
                    <h3 className="font-bold text-lg text-duo-green">AI Coach</h3>
                    <p className="text-xs text-[#6e7681]">Daily Analysis</p>
                </div>
            </div>

            {/* Message */}
            <motion.p
                className="text-white text-lg leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {message}
            </motion.p>

            {/* XP Note */}
            <motion.div
                className="inline-block px-4 py-2 bg-[#ffc800]/20 rounded-xl text-duo-gold font-bold text-sm mb-4"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.3 }}
            >
                {xpNote}
            </motion.div>

            {/* Domain Scores */}
            <div className="grid grid-cols-3 gap-3">
                <motion.div
                    className="text-center p-3 rounded-xl bg-[#58cc02]/20 border border-[#58cc02]/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="text-2xl font-extrabold text-duo-green">+{health}</span>
                    <p className="text-xs text-[#8b949e] mt-1">Health</p>
                </motion.div>

                <motion.div
                    className="text-center p-3 rounded-xl bg-[#ffc800]/20 border border-[#ffc800]/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-2xl font-extrabold text-duo-gold">+{faith}</span>
                    <p className="text-xs text-[#8b949e] mt-1">Faith</p>
                </motion.div>

                <motion.div
                    className="text-center p-3 rounded-xl bg-[#1cb0f6]/20 border border-[#1cb0f6]/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <span className="text-2xl font-extrabold text-duo-blue">+{career}</span>
                    <p className="text-xs text-[#8b949e] mt-1">Career</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
