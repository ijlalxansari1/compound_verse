import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface DbProfile {
    id: string;
    username: string;
    created_at: string;
}

export interface DbEntry {
    id: string;
    user_id: string;
    date: string;
    domains: Record<string, number>;
    reflection: string;
    daily_score: number;
    active_day: number;
    strong_day: number;
    perfect_day: number;
    xp_earned: number;
    created_at: string;
}

export interface DbUserStats {
    user_id: string;
    total_xp: number;
    level: number;
    current_streak: number;
    longest_streak: number;
    perfect_days: number;
    active_days: number;
    strong_days: number;
    badges: string[];
}
