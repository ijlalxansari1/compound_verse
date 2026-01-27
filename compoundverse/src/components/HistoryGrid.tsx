'use client';

import { motion } from 'framer-motion';
import { Entry } from '@/lib/storage';

interface HistoryGridProps {
    entries: Entry[];
}

export default function HistoryGrid({ entries }: HistoryGridProps) {
    // Generate last 28 days
    const days: { date: string; entry?: Entry }[] = [];
    const today = new Date();

    for (let i = 27; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const entry = entries.find(e => e.date === dateStr);
        days.push({ date: dateStr, entry });
    }

    const getDayStyle = (entry?: Entry) => {
        if (!entry) return { bg: 'bg-[#161b22]', border: 'border-[#30363d]', text: 'text-[#6e7681]' };
        if (entry.perfectDay) return { bg: 'bg-gradient-to-br from-[#ffc800] to-[#ff9600]', border: 'border-[#ffc800]', text: 'text-[#1a3a00] font-bold' };
        if (entry.strongDay) return { bg: 'bg-[#58cc02]/40', border: 'border-[#58cc02]', text: 'text-white' };
        if (entry.activeDay) return { bg: 'bg-[#1cb0f6]/30', border: 'border-[#1cb0f6]', text: 'text-white' };
        return { bg: 'bg-[#161b22]', border: 'border-[#30363d]', text: 'text-[#6e7681]' };
    };

    return (
        <div className="grid grid-cols-7 gap-2">
            {days.map(({ date, entry }, index) => {
                const dayNum = new Date(date).getDate();
                const style = getDayStyle(entry);
                const isToday = date === today.toISOString().split('T')[0];

                return (
                    <motion.div
                        key={date}
                        className={`aspect-square rounded-xl border-2 flex items-center justify-center text-sm ${style.bg} ${style.border} ${style.text} ${isToday ? 'ring-2 ring-[#ce82ff] ring-offset-2 ring-offset-[#0d1117]' : ''
                            }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.15, zIndex: 10 }}
                        title={`${date}${entry ? ` - Score: ${entry.dailyScore}/3` : ' - No entry'}`}
                    >
                        {dayNum}
                    </motion.div>
                );
            })}
        </div>
    );
}
