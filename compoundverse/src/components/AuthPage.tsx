'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setMessage(error.message);
            } else {
                setIsSent(true);
                setMessage('Magic Link Sent!');
            }
        } catch (err) {
            console.error('Auth Error:', err);
            setMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-lg">
                            Compound<br />Verse
                        </h1>
                    </motion.div>
                    <p className="text-[#8b949e] mt-4 text-sm font-medium tracking-wide uppercase">
                        Life Operating System
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                    <AnimatePresence mode="wait">
                        {!isSent ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#c9d1d9] ml-1">
                                        ENTER THE VERSE
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="traveler@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-[#0d1117]/50 border-[#30363d] text-white h-12 rounded-xl focus:ring-green-500/50 focus:border-green-500 transition-all text-lg"
                                    />
                                </div>

                                {message && (
                                    <p className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                        {message}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-white text-black hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl font-bold text-base"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Connecting...
                                        </span>
                                    ) : (
                                        'Continue with Email →'
                                    )}
                                </Button>

                                <p className="text-center text-xs text-[#484f58] mt-4">
                                    No password required. We'll send a magic link.
                                </p>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                        <span className="text-2xl">✨</span>
                                    </div>
                                    <div className="absolute inset-0 border-2 border-green-500/30 rounded-full animate-ping opacity-20" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Check your Inbox</h3>
                                <p className="text-[#8b949e] text-sm mb-6">
                                    We sent a magic link to <strong className="text-green-400">{email}</strong>
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsSent(false)}
                                    className="text-white hover:text-green-400 hover:bg-transparent"
                                >
                                    Entered wrong email?
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-[10px] text-[#484f58] uppercase tracking-widest">
                        Atomic Habits × Gamification
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
