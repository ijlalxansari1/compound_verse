'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DynamicGreetingProps {
    username: string;
    streak: number;
}

export default function DynamicGreeting({ username, streak }: DynamicGreetingProps) {
    const [greeting, setGreeting] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGreeting = async () => {
            try {
                const hours = new Date().getHours();
                const timeOfDay = hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening';

                const response = await fetch('/api/ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'greeting',
                        payload: {
                            username,
                            timeOfDay,
                            currentStreak: streak
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                if (data.greeting) {
                    setGreeting(data.greeting);
                }
            } catch (error) {
                // Silent fail for user, log for dev
                console.warn('AI Greeting unavailable:', error);
                setGreeting(`Welcome back, ${username}.`);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchGreeting();
        }
    }, [username, streak]);

    if (loading) return <div className="h-6 w-48 bg-gray-800/50 animate-pulse rounded" />;

    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#8b949e] text-sm italic mt-2"
        >
            "{greeting}"
        </motion.p>
    );
}
