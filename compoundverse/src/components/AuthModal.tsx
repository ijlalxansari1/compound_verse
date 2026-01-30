'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register, loginAsGuest } from '@/lib/auth';

interface AuthModalProps {
    onComplete: () => void;
}

export default function AuthModal({ onComplete }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register' | 'landing'>('landing');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (mode === 'register') {
                result = await register(email, password, username);
            } else {
                result = await login(email, password);
            }

            if (result.error) {
                setError(result.error);
            } else {
                onComplete();
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d1117]/95 backdrop-blur-2xl">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card rounded-[32px] p-8 shadow-2xl border-white/10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-br from-[#58cc02] to-[#1cb0f6] rounded-[24px] mx-auto mb-4 flex items-center justify-center shadow-lg"
                    >
                        <span className="text-4xl">🌱</span>
                    </motion.div>
                    <h2 className="text-3xl font-black gradient-text tracking-tighter mb-2">CompoundVerse</h2>
                    <p className="text-[#8b949e] font-medium uppercase tracking-[0.2em] text-[10px]">Small wins compound quietly</p>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'landing' && (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => setMode('register')}
                                className="w-full btn-duo flex items-center justify-center gap-2 group"
                            >
                                🚀 GET STARTED
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button
                                onClick={() => setMode('login')}
                                className="w-full py-4 rounded-2xl border-2 border-[#30363d] font-bold text-[#8b949e] hover:border-white/20 hover:text-white transition-all uppercase tracking-wider text-sm"
                            >
                                I ALREADY HAVE AN ACCOUNT
                            </button>

                            <div className="pt-4 flex items-center gap-4 text-[#30363d]">
                                <div className="h-[1px] flex-1 bg-current" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Or</span>
                                <div className="h-[1px] flex-1 bg-current" />
                            </div>

                            <button
                                onClick={() => loginAsGuest()}
                                className="w-full py-4 text-xs font-bold text-[#6e7681] hover:text-[#58cc02] transition-colors uppercase tracking-widest"
                            >
                                Continue as Guest (Local Only)
                            </button>
                        </motion.div>
                    )}

                    {mode !== 'landing' && (
                        <motion.form
                            key="auth-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {mode === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                        placeholder="Pick a name"
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-duo mt-2 flex items-center justify-center gap-2"
                            >
                                {loading ? 'AUTHENTICATING...' : mode === 'register' ? 'CREATE ACCOUNT' : 'LOG IN'}
                            </button>

                            <p className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                                    className="text-[10px] font-bold text-[#6e7681] hover:text-[#1cb0f6] transition-colors uppercase tracking-widest"
                                >
                                    {mode === 'register' ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                                </button>
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
