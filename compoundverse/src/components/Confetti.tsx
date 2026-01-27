'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#6366f1', '#22c55e', '#fbbf24', '#ec4899', '#f97316', '#a855f7'];

interface ConfettiPiece {
    id: number;
    left: number;
    color: string;
    delay: number;
    size: number;
}

interface ConfettiProps {
    trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (trigger) {
            const newPieces: ConfettiPiece[] = [];
            for (let i = 0; i < 50; i++) {
                newPieces.push({
                    id: i,
                    left: Math.random() * 100,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    delay: Math.random() * 0.5,
                    size: Math.random() * 8 + 6,
                });
            }
            setPieces(newPieces);

            // Clear after animation
            const timer = setTimeout(() => {
                setPieces([]);
            }, 3500);

            return () => clearTimeout(timer);
        }
    }, [trigger]);

    if (pieces.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="confetti"
                    style={{
                        left: `${piece.left}%`,
                        backgroundColor: piece.color,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        animationDelay: `${piece.delay}s`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                />
            ))}
        </div>
    );
}
