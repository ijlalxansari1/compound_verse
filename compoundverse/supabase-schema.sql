-- CompoundVerse Database Schema
-- Run this in Supabase SQL Editor
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Entries table (daily check-ins)
CREATE TABLE IF NOT EXISTS entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    domains JSONB NOT NULL DEFAULT '{}'::jsonb,
    reflection TEXT,
    daily_score INTEGER DEFAULT 0,
    active_day INTEGER DEFAULT 0,
    strong_day INTEGER DEFAULT 0,
    perfect_day INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date) -- One entry per user per day
);
-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at);
-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    perfect_days INTEGER DEFAULT 0,
    active_days INTEGER DEFAULT 0,
    strong_days INTEGER DEFAULT 0,
    badges TEXT [] DEFAULT '{}'
);
-- Row Level Security (RLS) Policies
-- Users can only access their own data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- Entries policies
CREATE POLICY "Users can view own entries" ON entries FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entries" ON entries FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON entries FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entries" ON entries FOR DELETE USING (auth.uid() = user_id);
-- User stats policies
CREATE POLICY "Users can view own stats" ON user_stats FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR
UPDATE USING (auth.uid() = user_id);
-- Trigger to create profile and stats on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, username)
VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            split_part(NEW.email, '@', 1)
        )
    );
INSERT INTO public.user_stats (user_id)
VALUES (NEW.id);
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();