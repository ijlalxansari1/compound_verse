'use client';

import { motion } from 'framer-motion';

interface DomainCardProps {
    domain: 'health' | 'faith' | 'career';
    title: string;
    quote: string;
    icon: string;
    items: { value: string; label: string }[];
    checked: string[];
    onToggle: (value: string) => void;
    disabled?: boolean;
}

const domainStyles = {
    health: {
        color: '#58cc02',
        className: 'domain-health'
    },
    faith: {
        color: '#ffc800',
        className: 'domain-faith'
    },
    career: {
        color: '#1cb0f6',
        className: 'domain-career'
    }
};

export default function DomainCard({
    domain,
    title,
    quote,
    icon,
    items,
    checked,
    onToggle,
    disabled = false
}: DomainCardProps) {
    const style = domainStyles[domain];
    const checkedCount = checked.length;
    const totalItems = items.length;
    const progress = (checkedCount / totalItems) * 100;

    return (
        <motion.div
            className={`domain-card p-5 ${style.className} ${disabled ? 'opacity-60' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={disabled ? {} : { scale: 1.01 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <motion.span
                        className="text-4xl"
                        animate={checkedCount > 0 ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        {icon}
                    </motion.span>
                    <div>
                        <h3 className="font-bold text-lg">{title}</h3>
                        <p className="text-xs text-[#6e7681] italic">"{quote}"</p>
                    </div>
                </div>

                {/* Progress Badge */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <div
                        className="text-2xl font-extrabold"
                        style={{ color: style.color }}
                    >
                        {checkedCount}/{totalItems}
                    </div>
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-[#21262d] rounded-full mb-4 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: style.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Items */}
            <div className="space-y-2">
                {items.map((item, index) => (
                    <motion.label
                        key={item.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-3 p-3 bg-[#161b22] rounded-xl cursor-pointer transition-all border-2 ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#21262d]'
                            } ${checked.includes(item.value) ? 'border-[#58cc02]' : 'border-transparent'}`}
                    >
                        <input
                            type="checkbox"
                            checked={checked.includes(item.value)}
                            onChange={() => !disabled && onToggle(item.value)}
                            disabled={disabled}
                            className="checkbox-duo"
                        />
                        <span className={`text-sm flex-1 ${checked.includes(item.value) ? 'text-white font-semibold' : 'text-[#8b949e]'
                            }`}>
                            {item.label}
                        </span>
                        {checked.includes(item.value) && (
                            <motion.span
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="text-lg"
                            >
                                ✅
                            </motion.span>
                        )}
                    </motion.label>
                ))}
            </div>
        </motion.div>
    );
}
