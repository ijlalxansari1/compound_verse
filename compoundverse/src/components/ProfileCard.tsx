'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProfileCardProps {
    level: number;
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
    perfectDays: number;
}

const AVATARS = ['🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🦄', '🐲', '🦅', '🐺'];

export default function ProfileCard({
    level,
    totalXP,
    currentStreak,
    longestStreak,
    activeDays,
    perfectDays
}: ProfileCardProps) {
    const [username, setUsername] = useState('Player');
    const [avatar, setAvatar] = useState('🦁');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('compoundverse_profile');
        if (saved) {
            const profile = JSON.parse(saved);
            setUsername(profile.username || 'Player');
            setAvatar(profile.avatar || '🦁');
        }
    }, []);

    const saveProfile = () => {
        localStorage.setItem('compoundverse_profile', JSON.stringify({ username, avatar }));
        setIsEditing(false);
    };

    return (
        <motion.div
            className="profile-card p-6 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="avatar-ring">
                    <motion.div
                        className="avatar"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setIsEditing(true)}
                    >
                        {avatar}
                    </motion.div>
                </div>

                {/* Name & Level */}
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent border-b-2 border-[#ffc800] text-xl font-bold outline-none w-full"
                            autoFocus
                            onBlur={saveProfile}
                            onKeyDown={(e) => e.key === 'Enter' && saveProfile()}
                        />
                    ) : (
                        <h2
                            className="text-xl font-bold cursor-pointer hover:text-[#ffc800] transition-colors"
                            onClick={() => setIsEditing(true)}
                        >
                            {username}
                        </h2>
                    )}
                    <p className="text-[#8b949e] text-sm">Level {level} Champion</p>
                </div>

                {/* Level Crown */}
                <motion.div
                    className="level-badge flex flex-col items-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                >
                    <span className="text-2xl">👑</span>
                    <span className="text-sm font-bold text-[#1a3a00]">{level}</span>
                </motion.div>
            </div>

            {/* Avatar Picker */}
            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-3 bg-[#161b22] rounded-xl"
                >
                    <p className="text-xs text-[#8b949e] mb-2">Choose Avatar:</p>
                    <div className="flex flex-wrap gap-2">
                        {AVATARS.map((a) => (
                            <button
                                key={a}
                                onClick={() => {
                                    setAvatar(a);
                                    saveProfile();
                                }}
                                className={`text-2xl p-2 rounded-lg transition-all ${avatar === a ? 'bg-[#ffc800] scale-110' : 'bg-[#21262d] hover:bg-[#30363d]'
                                    }`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-orange flex items-center justify-center gap-1">
                        <span className={currentStreak > 0 ? 'animate-wiggle' : ''}>🔥</span>
                        {currentStreak}
                    </div>
                    <div className="text-[10px] text-[#6e7681] uppercase">Streak</div>
                </div>

                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-gold">⭐ {perfectDays}</div>
                    <div className="text-[10px] text-[#6e7681] uppercase">Perfect</div>
                </div>

                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-green">📈 {activeDays}</div>
                    <div className="text-[10px] text-[#6e7681] uppercase">Active</div>
                </div>

                <div className="stat-badge text-center">
                    <div className="text-xl font-bold text-duo-blue">⚡ {totalXP}</div>
                    <div className="text-[10px] text-[#6e7681] uppercase">XP</div>
                </div>
            </div>
        </motion.div>
    );
}
