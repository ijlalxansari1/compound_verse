'use client';

// CompoundVerse - Authentication & Cloud Sync Logic
// Supports Guest mode (LocalStorage) and User mode (Cloud)

export interface User {
    id: string;
    email?: string;
    username: string;
    isGuest: boolean;
}

const AUTH_KEY = 'compoundverse_auth';

export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

export function loginAsGuest(): void {
    const guestUser: User = {
        id: 'guest_' + Math.random().toString(36).substr(2, 9),
        username: 'Guest Player',
        isGuest: true
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(guestUser));
    window.location.reload();
}

export function logout(): void {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
}

// Placeholder for future Supabase integration
export async function register(email: string, password: string, username: string): Promise<{ user: User }> {
    // Simulated cloud registration
    return new Promise((resolve) => {
        setTimeout(() => {
            const user: User = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                email,
                username,
                isGuest: false
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            resolve({ user });
        }, 1000);
    });
}

export async function login(email: string, password: string): Promise<{ user: User }> {
    // Simulated cloud login
    return new Promise((resolve) => {
        setTimeout(() => {
            const user: User = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                email,
                username: email.split('@')[0],
                isGuest: false
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            resolve({ user });
        }, 1000);
    });
}
