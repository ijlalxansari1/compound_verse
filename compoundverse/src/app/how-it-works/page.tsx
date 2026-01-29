import Link from 'next/link';

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-[#0d1117] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <Link href="/" className="inline-flex items-center gap-2 text-[#8b949e] hover:text-white mb-8">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-2">How It Works</h1>
                <p className="text-[#8b949e] mb-8">A calm, ethical system for consistent growth</p>

                {/* Domains */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#58cc02]">🎯 Domains</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        Life areas you want to track. Start with 3, max 5 active at once.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: '💪', name: 'Health' },
                            { icon: '✨', name: 'Faith' },
                            { icon: '🧠', name: 'Career' },
                            { icon: '💕', name: 'Relationships' },
                            { icon: '🎨', name: 'Creativity' }
                        ].map(({ icon, name }) => (
                            <div key={name} className="p-3 bg-[#161b22] rounded-lg text-center">
                                <div className="text-2xl mb-1">{icon}</div>
                                <div className="text-xs text-[#8b949e]">{name}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Momentum */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#1cb0f6]">🔄 Momentum (Not Streaks)</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        Traditional streaks are fragile—miss one day and you "lose" everything.
                        CompoundVerse uses <strong className="text-white">Momentum</strong> instead:
                    </p>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#1cb0f6]">•</span>
                            Rolling 7-14 day window
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#1cb0f6]">•</span>
                            Gradual decay, not instant reset
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#1cb0f6]">•</span>
                            Protected days don't count against you
                        </li>
                    </ul>
                </section>

                {/* Ground Mode */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#8b5cf6]">🌊 Ground Mode</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        When you're struggling, tap the calm button. Ground Mode:
                    </p>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Freezes momentum decay
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Shows calming breathing exercise
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Displays grounding verse or quote
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            No judgment, no guilt
                        </li>
                    </ul>
                </section>

                {/* XP */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#ffc800]">⭐ XP System</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        XP is proof of presence, not worth:
                    </p>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#ffc800]">+</span>
                            You earn XP for showing up
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ffc800]">+</span>
                            Perfect days give bonus XP
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#58cc02]">✓</span>
                            No XP loss ever
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#58cc02]">✓</span>
                            No negative points
                        </li>
                    </ul>
                </section>

                {/* AI Coach */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#ce82ff]">🤖 AI Coach</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        A calm presence, not a motivational speaker:
                    </p>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#ce82ff]">•</span>
                            Pattern observation, not prediction
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ce82ff]">•</span>
                            Silence is a valid output
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ce82ff]">•</span>
                            No moral judgments
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ce82ff]">•</span>
                            Respects Ground Mode
                        </li>
                    </ul>
                </section>

                {/* Minimum Viable Day */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#ff9600]">📏 Minimum Viable Day</h2>
                    <p className="text-[#8b949e] leading-relaxed">
                        The smallest unit of success. On hard days, doing just one small action counts.
                        The system adapts to your energy, not the other way around.
                    </p>
                </section>

                {/* Footer */}
                <section className="text-center py-8 border-t border-[#30363d]">
                    <p className="text-[#6e7681] italic">
                        "Consistency compounds quietly."
                    </p>
                </section>
            </div>
        </main>
    );
}
