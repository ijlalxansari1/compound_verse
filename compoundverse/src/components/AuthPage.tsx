'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthPageProps {
    initialView?: 'signin' | 'signup';
}

export default function AuthPage({ initialView = 'signup' }: AuthPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [view, setView] = useState<'signin' | 'signup'>(initialView);
    const [shake, setShake] = useState(false);

    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const supabase = createClient();

        try {
            if (view === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage('Account created! Please check your email to confirm.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Router refresh handled by Auth Listener usually, but let's push
                router.refresh();
            }
        } catch (err: any) {
            console.error('Auth Error:', err);
            setMessage(err.message || 'Authentication failed');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-gradient-to-r from-green-500/30 to-emerald-900/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [0, 100, 0],
                        filter: ["hue-rotate(0deg)", "hue-rotate(-90deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-gradient-to-l from-blue-600/30 to-indigo-900/30 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full max-w-sm z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-8 relative">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block"
                    >
                        <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            Compound<br />Verse
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-[#8b949e] mt-2 text-xs font-bold tracking-[0.2em] uppercase"
                    >
                        Architect Your Reality
                    </motion.p>
                </div>

                {/* Card */}
                <motion.div
                    animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    className="glass-card p-1 rounded-3xl border border-white/10 shadow-2xl relative bg-black/40 backdrop-blur-xl"
                >
                    <div className="p-7">
                        {/* Toggle */}
                        <div className="flex gap-2 mb-8 p-1.5 bg-[#0d1117]/80 rounded-2xl border border-white/5 relative">
                            {/* Sliding Background */}
                            <motion.div
                                layoutId="activeTab"
                                className={`absolute top-1.5 bottom-1.5 rounded-xl shadow-lg ${view === 'signup' ? 'left-1.5 right-[50%]' : 'left-[50%] right-1.5'} ${view === 'signup' ? 'bg-[#238636]' : 'bg-[#1f6feb]'}`}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />

                            <button
                                type="button"
                                onClick={() => { setView('signup'); setMessage(''); }}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${view === 'signup' ? 'text-white' : 'text-[#8b949e] hover:text-white'}`}
                            >
                                Create Account
                            </button>
                            <button
                                type="button"
                                onClick={() => { setView('signin'); setMessage(''); }}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${view === 'signin' ? 'text-white' : 'text-[#8b949e] hover:text-white'}`}
                            >
                                Login
                            </button>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={view}
                                    initial={{ opacity: 0, x: view === 'signup' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: view === 'signup' ? 20 : -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-[#8b949e] ml-1 tracking-wider uppercase">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-[#0d1117]/50 border-[#30363d] text-white h-12 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-base px-4"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-[#8b949e] ml-1 tracking-wider uppercase">Password</label>
                                            {view === 'signin' && (
                                                <button
                                                    type="button"
                                                    onClick={() => router.push('/forgot-password')}
                                                    className="text-[10px] font-bold text-[#58a6ff] hover:text-[#79c0ff] tracking-wider uppercase transition-colors"
                                                >
                                                    Forgot Password?
                                                </button>
                                            )}
                                        </div>
                                        <Input
                                            type="password"
                                            placeholder={view === 'signup' ? "Choose a strong password" : "••••••••"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-[#0d1117]/50 border-[#30363d] text-white h-12 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base px-4"
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={`text-sm text-center p-3 rounded-xl border ${message.includes('created') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                >
                                    {message}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className={`w-full h-14 text-white hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl font-bold text-lg shadow-lg mt-2 ${view === 'signup' ? 'bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#238636]' : 'bg-gradient-to-r from-[#1f6feb] to-[#388bfd] hover:from-[#388bfd] hover:to-[#1f6feb]'}`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    view === 'signup' ? 'Join the Verse' : 'Welcome Back'
                                )}
                            </Button>
                        </form>
                    </div>
                </motion.div>

                <p className="text-center text-[#484f58] text-[10px] mt-8 uppercase tracking-widest font-medium opacity-50">
                    Secure Encryption • Standard Auth • 2026
                </p>
            </motion.div>
        </div>
    );
}
