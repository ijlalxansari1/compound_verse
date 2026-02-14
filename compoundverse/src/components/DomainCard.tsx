'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface DomainCardProps {
    domain: string;
    title: string;
    quote: string;
    icon: string;
    items: { value: string; label: string }[];
    checked: string[];
    onToggle: (value: string) => void;
    disabled?: boolean;
}

const domainStyles: Record<string, { color: string, border: string, bg: string, ring: string, glow: string }> = {
    health: {
        color: "text-[#58cc02]",
        border: "group-hover:border-[#58cc02]",
        bg: "bg-[#58cc02]",
        ring: "focus:ring-[#58cc02]",
        glow: "shadow-[0_0_15px_-3px_rgba(88,204,2,0.3)]"
    },
    faith: {
        color: "text-[#ffc800]",
        border: "group-hover:border-[#ffc800]",
        bg: "bg-[#ffc800]",
        ring: "focus:ring-[#ffc800]",
        glow: "shadow-[0_0_15px_-3px_rgba(255,200,0,0.3)]"
    },
    career: {
        color: "text-[#1cb0f6]",
        border: "group-hover:border-[#1cb0f6]",
        bg: "bg-[#1cb0f6]",
        ring: "focus:ring-[#1cb0f6]",
        glow: "shadow-[0_0_15px_-3px_rgba(28,176,246,0.3)]"
    },
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
    const checkedCount = checked.length;
    const totalItems = items.length;
    const progress = (checkedCount / totalItems) * 100;

    // Default fallback
    const style = domainStyles[domain] || domainStyles.health;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={disabled ? {} : { translateY: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-white/20">
                <CardHeader className="pb-4 relative">
                    {/* Header Background Gradient */}
                    <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50", style.color)} />

                    <div className="flex justify-between items-start">
                        <div className="flex gap-4 items-center">
                            <div className={cn("text-4xl filter drop-shadow-lg p-2 rounded-xl bg-white/5 border border-white/5", style.glow)}>
                                {icon}
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
                                <p className="text-xs text-[#8b949e] italic mt-1 font-medium">"{quote}"</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={cn("text-3xl font-black tracking-tight", style.color, "text-glow-sm")}>
                                {checkedCount}/{totalItems}
                            </span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-[#161b22] rounded-full mt-5 overflow-hidden border border-white/5">
                        <motion.div
                            className={cn("h-full rounded-full relative", style.bg)}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                        </motion.div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.map((item) => {
                        const isChecked = checked.includes(item.value);
                        return (
                            <motion.div
                                key={item.value}
                                onClick={() => !disabled && onToggle(item.value)}
                                whileTap={!disabled ? { scale: 0.98 } : {}}
                                className={cn(
                                    "group flex items-center gap-4 p-4 rounded-xl border border-transparent cursor-pointer transition-all duration-200 relative overflow-hidden",
                                    isChecked
                                        ? "bg-[#161b22]/80 border-white/5"
                                        : "bg-[#161b22]/40 hover:bg-[#161b22]/60 hover:border-white/10",
                                    disabled && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {/* Selection Indicator Line */}
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                                    isChecked ? style.bg : "bg-transparent group-hover:bg-white/10"
                                )} />

                                <div className={cn(
                                    "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 z-10",
                                    isChecked
                                        ? cn(style.bg, "border-transparent scale-110 shadow-lg")
                                        : "border-[#30363d] bg-[#0d1117] group-hover:border-white/30"
                                )}>
                                    {isChecked && <Check className="h-3.5 w-3.5 text-white font-black stroke-[4]" />}
                                </div>
                                <Label className={cn(
                                    "cursor-pointer font-medium flex-1 text-sm sm:text-base transition-colors z-10",
                                    isChecked ? "text-[#8b949e] line-through decoration-2 decoration-white/20" : "text-white group-hover:text-white"
                                )}>
                                    {item.label}
                                </Label>
                            </motion.div>
                        );
                    })}
                </CardContent>
            </Card>
        </motion.div>
    );
}
