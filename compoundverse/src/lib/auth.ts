'use client';

import { createClient } from '@/lib/supabase/client';

// CompoundVerse - Authentication with Supabase
// Real authentication with email/password

export interface User {
    id: string;
    email?: string;
    username: string;
    isGuest: boolean;
}

const AUTH_KEY = 'compoundverse_auth';
const GUEST_KEY = 'compoundverse_guest_id';

/**
 * Get current user from Supabase session or localStorage cache
 */
export async function getCurrentUserAsync(): Promise<User | null> {
    const supabase = createClient();
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            const user: User = {
                id: session.user.id,
                email: session.user.email,
                username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
                isGuest: false
            };
            // Cache in localStorage for quick access
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            return user;
        }

        // Check for guest user
        const guestId = localStorage.getItem(GUEST_KEY);
        if (guestId) {
            return {
                id: guestId,
                username: 'Guest Player',
                isGuest: true
            };
        }

        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        // Fallback to cached user
        const cached = localStorage.getItem(AUTH_KEY);
        if (cached) return JSON.parse(cached);
        return null;
    }
}

/**
 * Synchronous version - returns cached user
 */
export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    // First check localStorage cache
    const cached = localStorage.getItem(AUTH_KEY);
    if (cached) {
        return JSON.parse(cached);
    }

    // Check for guest
    const guestId = localStorage.getItem(GUEST_KEY);
    if (guestId) {
        return {
            id: guestId,
            username: 'Guest Player',
            isGuest: true
        };
    }

    return null;
}

/**
 * Login as guest (uses localStorage only)
 */
export function loginAsGuest(): void {
    const existingGuest = localStorage.getItem(GUEST_KEY);
    const guestId = existingGuest || 'guest_' + Math.random().toString(36).substr(2, 9);

    if (!existingGuest) {
        localStorage.setItem(GUEST_KEY, guestId);
    }

    const guestUser: User = {
        id: guestId,
        username: 'Guest Player',
        isGuest: true
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(guestUser));
    window.location.reload();
}

/**
 * Logout - clears session
 */
export async function logout(): Promise<void> {
    const supabase = createClient();
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
    localStorage.removeItem(AUTH_KEY);
    // Don't remove guest ID - preserve guest data
    window.location.reload();
}

/**
 * Register new user with email/password
 */
export async function register(
    email: string,
    password: string,
    username: string
): Promise<{ user: User | null; error: string | null }> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        });

        if (error) {
            return { user: null, error: error.message };
        }

        if (data.user) {
            const user: User = {
                id: data.user.id,
                email: data.user.email,
                username,
                isGuest: false
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            return { user, error: null };
        }

        return { user: null, error: 'Registration failed' };
    } catch (error: any) {
        return { user: null, error: error.message || 'Registration failed' };
    }
}

/**
 * Login with email/password
 */
export async function login(
    email: string,
    password: string
): Promise<{ user: User | null; error: string | null }> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return { user: null, error: error.message };
        }

        if (data.user) {
            const user: User = {
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata?.username || email.split('@')[0],
                isGuest: false
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            return { user, error: null };
        }

        return { user: null, error: 'Login failed' };
    } catch (error: any) {
        return { user: null, error: error.message || 'Login failed' };
    }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
    const supabase = createClient();
    return supabase.auth.onAuthStateChange(async (event: string, session: any) => {
        if (session?.user) {
            const user: User = {
                id: session.user.id,
                email: session.user.email,
                username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
                isGuest: false
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            callback(user);
        } else {
            localStorage.removeItem(AUTH_KEY);
            callback(null);
        }
    });
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = createClient();
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to send reset email' };
    }
}

/**
 * Sign in with magic link (passwordless)
 */
export async function signInWithMagicLink(email: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = createClient();
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}`
            }
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to send magic link' };
    }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<{ success: boolean; error: string | null }> {
    const supabase = createClient();
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`
            }
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message || 'Google sign-in failed' };
    }
}

/**
 * Update password (after reset)
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = createClient();
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update password' };
    }
}
