'use client';

import { motion } from 'framer-motion';
import { HabitData } from '@/lib/storage';
import { downloadJSON, downloadCSV, downloadSummary } from '@/lib/export';

interface ExportPanelProps {
    data: HabitData;
}

export default function ExportPanel({ data }: ExportPanelProps) {
    const exportOptions = [
        {
            id: 'json',
            icon: '📦',
            title: 'Full Export (JSON)',
            desc: 'Complete data backup',
            action: () => downloadJSON(data),
            color: '#1cb0f6'
        },
        {
            id: 'csv',
            icon: '📊',
            title: 'History (CSV)',
            desc: 'Spreadsheet format',
            action: () => downloadCSV(data.entries),
            color: '#58cc02'
        },
        {
            id: 'summary',
            icon: '📝',
            title: 'Weekly Summary',
            desc: 'Human-readable report',
            action: () => downloadSummary(data),
            color: '#ffc800'
        },
    ];

    return (
        <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                📥 Export Your Data
            </h3>
            <p className="text-sm text-[#8b949e] mb-4">
                Your data belongs to you. Download anytime.
            </p>

            <div className="space-y-3">
                {exportOptions.map((opt) => (
                    <motion.button
                        key={opt.id}
                        onClick={opt.action}
                        className="w-full p-4 bg-[#161b22] hover:bg-[#21262d] rounded-xl text-left transition-all flex items-center gap-4 border-2 border-transparent hover:border-[#30363d]"
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-3xl">{opt.icon}</span>
                        <div className="flex-1">
                            <div className="font-semibold" style={{ color: opt.color }}>{opt.title}</div>
                            <div className="text-sm text-[#6e7681]">{opt.desc}</div>
                        </div>
                        <span className="text-[#6e7681]">→</span>
                    </motion.button>
                ))}
            </div>

            <p className="text-xs text-[#6e7681] mt-4 text-center">
                {data.entries.length} entries • {data.stats.totalXP} XP total
            </p>
        </div>
    );
}
