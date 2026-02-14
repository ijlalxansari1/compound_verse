'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthPage from '@/components/AuthPage';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
    const [identity, setIdentity] = useState('');
    const [loading, setLoading] = useState(false);
    const [starterPack, setStarterPack] = useState<any[] | null>(null);
    const [showAuth, setShowAuth] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identity.trim()) return;
        setLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'starter_pack',
                    payload: { identity }
                })
            });
            const data = await res.json();
            if (data.starterPack) {
                setStarterPack(data.starterPack);
            }
        } catch (error) {
            console.error('Failed to generate', error);
        } finally {
            setLoading(false);
        }
    };

    if (showAuth) {
        return <AuthPage />;
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-[#0a0a0f] text-white">
            {/* Aurora Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-green-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            <main className="relative z-10 w-full max-w-2xl text-center">
                <AnimatePresence mode="wait">
                    {!starterPack ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent mb-4">
                                    Compound<br />Verse
                                </h1>
                                <p className="text-lg text-[#8b949e] max-w-md mx-auto">
                                    Small wins compound quietly. Who do you want to become?
                                </p>
                            </div>

                            <form onSubmit={handleGenerate} className="relative max-w-md mx-auto group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative flex gap-2 p-2 bg-[#0d1117] rounded-xl border border-white/10">
                                    <Input
                                        value={identity}
                                        onChange={(e) => setIdentity(e.target.value)}
                                        placeholder="e.g. Stoic Entrepreneur, Fit Mom..."
                                        className="bg-transparent border-none text-lg text-white placeholder:text-gray-600 focus-visible:ring-0 h-12"
                                        autoFocus
                                    />
                                    <Button
                                        type="submit"
                                        disabled={loading || !identity}
                                        className="h-12 px-6 bg-white text-black hover:bg-gray-200 rounded-lg font-bold"
                                    >
                                        {loading ? 'Thinking...' : <ArrowRight />}
                                    </Button>
                                </div>
                            </form>

                            <div className="pt-8 flex justify-center gap-8 text-sm text-[#484f58] font-medium tracking-wide uppercase">
                                <span>Health</span>
                                <span>•</span>
                                <span>Faith</span>
                                <span>•</span>
                                <span>Career</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-left w-full"
                        >
                            <div className="text-center mb-8">
                                <p className="text-[#8b949e] uppercase tracking-widest text-xs font-bold mb-2">Your Starter Pack</p>
                                <h2 className="text-3xl font-bold text-white">The "{identity}" Protocol</h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3 mb-8">
                                {starterPack.map((habit: any, i: number) => (
                                    <motion.div
                                        key={habit.domain}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-4 text-xl">
                                            {habit.domain === 'health' ? '💪' : habit.domain === 'faith' ? '✨' : '🧠'}
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{habit.title}</h3>
                                        <p className="text-sm text-[#8b949e] italic">"{habit.intention}"</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <Button
                                    onClick={() => setShowAuth(true)}
                                    size="lg"
                                    className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 transition-opacity font-bold shadow-lg shadow-blue-500/20"
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Begin This Journey
                                </Button>
                                <button
                                    onClick={() => setStarterPack(null)}
                                    className="text-sm text-[#8b949e] hover:text-white transition-colors"
                                >
                                    Try another identity
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
