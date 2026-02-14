'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card rounded-[32px] p-8 text-center max-w-md w-full"
                >
                    <div className="text-6xl mb-4">📧</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                    <p className="text-[#8b949e] mb-6">
                        We've sent a password reset link to <strong className="text-white">{email}</strong>.
                    </p>
                    <Link
                        href="/"
                        className="text-[#58cc02] hover:underline text-sm font-bold uppercase tracking-wider"
                    >
                        Back to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="glass-card rounded-[32px] p-8 max-w-md w-full relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#58cc02] to-[#1cb0f6]" />

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-sm text-[#8b949e]">
                        Enter your email to receive a reset link
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl p-4 text-white focus:border-[#1cb0f6] outline-none transition-all placeholder:text-[#30363d]"
                            placeholder="name@example.com"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center bg-red-500/10 py-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary h-14 rounded-2xl text-lg font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="text-[#8b949e] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
