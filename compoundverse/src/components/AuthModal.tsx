'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    login,
    register,
    loginAsGuest,
    resetPassword,
    signInWithMagicLink,
    signInWithGoogle
} from '@/lib/auth';

interface AuthModalProps {
    onComplete: () => void;
}

type AuthMode = 'landing' | 'login' | 'register' | 'forgot' | 'magic-link-sent' | 'reset-sent';

export default function AuthModal({ onComplete }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>('landing');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (mode === 'register') {
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
                result = await register(email, password, username);
            } else if (mode === 'login') {
                result = await login(email, password);
            } else if (mode === 'forgot') {
                const resetResult = await resetPassword(email);
                if (resetResult.error) {
                    setError(resetResult.error);
                } else {
                    setMode('reset-sent');
                }
                setLoading(false);
                return;
            }

            if (result?.error) {
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

    const handleMagicLink = async () => {
        if (!email) {
            setError('Please enter your email first');
            return;
        }
        setLoading(true);
        setError('');

        const result = await signInWithMagicLink(email);
        if (result.error) {
            setError(result.error);
        } else {
            setMode('magic-link-sent');
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error);
            setLoading(false);
        }
        // Redirect happens automatically
    };

    const goBack = () => {
        setError('');
        setSuccessMessage('');
        if (mode === 'forgot' || mode === 'reset-sent') {
            setMode('login');
        } else if (mode === 'magic-link-sent') {
            setMode('landing');
        } else {
            setMode('landing');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#0d1117]/95 backdrop-blur-2xl overflow-y-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-[380px] sm:max-w-md glass-card rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl border-white/10 my-auto"
            >
                {/* Back Button */}
                {mode !== 'landing' && (
                    <button
                        onClick={goBack}
                        className="mb-4 flex items-center gap-2 text-[#6e7681] hover:text-white transition-colors text-sm"
                    >
                        <span>←</span>
                        <span>Back</span>
                    </button>
                )}

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#58cc02] to-[#1cb0f6] rounded-[20px] sm:rounded-[24px] mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg"
                    >
                        <span className="text-3xl sm:text-4xl">🌱</span>
                    </motion.div>
                    <h2 className="text-2xl sm:text-3xl font-black gradient-text tracking-tighter mb-1 sm:mb-2">
                        CompoundVerse
                    </h2>
                    <p className="text-[#8b949e] font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px]">
                        Small wins compound quietly
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {/* Landing Page */}
                    {mode === 'landing' && (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3 sm:space-y-4"
                        >
                            {/* Google Sign In */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full py-3.5 sm:py-4 rounded-2xl border-2 border-[#30363d] font-bold text-white hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>

                            <div className="flex items-center gap-3 text-[#30363d]">
                                <div className="h-[1px] flex-1 bg-current" />
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Or</span>
                                <div className="h-[1px] flex-1 bg-current" />
                            </div>

                            <button
                                onClick={() => setMode('register')}
                                className="w-full btn-duo flex items-center justify-center gap-2 group text-sm sm:text-base py-3.5 sm:py-4"
                            >
                                🚀 GET STARTED
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>

                            <button
                                onClick={() => setMode('login')}
                                className="w-full py-3.5 sm:py-4 rounded-2xl border-2 border-[#30363d] font-bold text-[#8b949e] hover:border-white/20 hover:text-white transition-all uppercase tracking-wider text-xs sm:text-sm"
                            >
                                I ALREADY HAVE AN ACCOUNT
                            </button>

                            <button
                                onClick={() => loginAsGuest()}
                                className="w-full py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-[#6e7681] hover:text-[#58cc02] transition-colors uppercase tracking-widest"
                            >
                                Continue as Guest (Local Only)
                            </button>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    {mode === 'login' && (
                        <motion.form
                            key="login-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-3 sm:space-y-4"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>

                            {/* Forgot Password Link */}
                            <button
                                type="button"
                                onClick={() => setMode('forgot')}
                                className="text-[10px] font-bold text-[#1cb0f6] hover:text-[#58cc02] transition-colors uppercase tracking-widest"
                            >
                                Forgot password?
                            </button>

                            {error && (
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center bg-red-500/10 py-2 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-duo mt-2 flex items-center justify-center gap-2 py-3.5 sm:py-4"
                            >
                                {loading ? 'SIGNING IN...' : 'LOG IN'}
                            </button>

                            {/* Magic Link Option */}
                            <button
                                type="button"
                                onClick={handleMagicLink}
                                disabled={loading}
                                className="w-full py-3 text-[10px] sm:text-xs font-bold text-[#6e7681] hover:text-[#1cb0f6] transition-colors uppercase tracking-widest"
                            >
                                ✨ Sign in with magic link (no password)
                            </button>

                            <p className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    className="text-[10px] font-bold text-[#6e7681] hover:text-[#1cb0f6] transition-colors uppercase tracking-widest"
                                >
                                    Don't have an account? Sign up
                                </button>
                            </p>
                        </motion.form>
                    )}

                    {/* Register Form */}
                    {mode === 'register' && (
                        <motion.form
                            key="register-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-3 sm:space-y-4"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="Pick a name"
                                    autoComplete="username"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="Min 6 characters"
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
                                className="w-full btn-duo mt-2 flex items-center justify-center gap-2 py-3.5 sm:py-4"
                            >
                                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                            </button>

                            <p className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="text-[10px] font-bold text-[#6e7681] hover:text-[#1cb0f6] transition-colors uppercase tracking-widest"
                                >
                                    Already have an account? Log in
                                </button>
                            </p>
                        </motion.form>
                    )}

                    {/* Forgot Password Form */}
                    {mode === 'forgot' && (
                        <motion.form
                            key="forgot-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-3">🔐</div>
                                <h3 className="text-lg font-bold text-white mb-1">Reset Password</h3>
                                <p className="text-sm text-[#6e7681]">
                                    Enter your email and we'll send you a reset link
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#6e7681] uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm focus:border-[#58cc02] outline-none transition-all placeholder:text-[#30363d]"
                                    placeholder="you@example.com"
                                    autoComplete="email"
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
                                className="w-full btn-duo flex items-center justify-center gap-2 py-3.5 sm:py-4"
                            >
                                {loading ? 'SENDING...' : 'SEND RESET LINK'}
                            </button>
                        </motion.form>
                    )}

                    {/* Reset Email Sent */}
                    {mode === 'reset-sent' && (
                        <motion.div
                            key="reset-sent"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="text-6xl mb-4">📧</div>
                            <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
                            <p className="text-sm text-[#8b949e] mb-6">
                                We sent a password reset link to<br />
                                <span className="text-[#1cb0f6] font-semibold">{email}</span>
                            </p>
                            <button
                                onClick={() => setMode('login')}
                                className="btn-duo px-8 py-3"
                            >
                                Back to Login
                            </button>
                        </motion.div>
                    )}

                    {/* Magic Link Sent */}
                    {mode === 'magic-link-sent' && (
                        <motion.div
                            key="magic-link-sent"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="text-6xl mb-4">✨</div>
                            <h3 className="text-xl font-bold text-white mb-2">Magic Link Sent!</h3>
                            <p className="text-sm text-[#8b949e] mb-6">
                                Click the link in your email to sign in<br />
                                <span className="text-[#1cb0f6] font-semibold">{email}</span>
                            </p>
                            <p className="text-xs text-[#6e7681]">
                                Didn't receive it? Check your spam folder
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
