'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updatePassword } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await updatePassword(password);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 2000);
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
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Password Updated!</h2>
                    <p className="text-[#8b949e]">Redirecting you to the app...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="glass-card rounded-[32px] p-8 max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#58cc02] to-[#1cb0f6] rounded-[24px] mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
                    <p className="text-sm text-[#8b949e]">
                        Choose a strong password for your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                            placeholder="Min 6 characters"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                            placeholder="Repeat password"
                            autoComplete="new-password"
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
                        className="w-full btn-duo flex items-center justify-center gap-2"
                    >
                        {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
