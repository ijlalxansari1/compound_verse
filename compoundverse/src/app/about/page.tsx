import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0d1117] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <Link href="/" className="inline-flex items-center gap-2 text-[#8b949e] hover:text-white mb-8">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-6">About CompoundVerse</h1>

                {/* Philosophy */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#58cc02]">Philosophy</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        CompoundVerse is a <strong className="text-white">human-centered life operating system</strong> built
                        on the principle that small, consistent actions—done imperfectly—compound into meaningful change over time.
                    </p>
                    <p className="text-[#8b949e] leading-relaxed">
                        It blends behavioral psychology, ethical design, spiritual grounding, and gamified structure
                        (without punishment). CompoundVerse is designed for <em>real humans</em>, not ideal ones.
                    </p>
                </section>

                {/* What This IS */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#1cb0f6]">What This IS</h2>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#58cc02]">✓</span>
                            A dignity-preserving consistency system
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#58cc02]">✓</span>
                            A life dashboard, not a productivity whip
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#58cc02]">✓</span>
                            A recovery-aware system, not a perfection machine
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#58cc02]">✓</span>
                            A private space, not a social competition
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#58cc02]">✓</span>
                            A discipline companion, not a motivational speaker
                        </li>
                    </ul>
                </section>

                {/* What This is NOT */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#ff4b4b]">What This is NOT</h2>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#ff4b4b]">✗</span>
                            Not a hustle app
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ff4b4b]">✗</span>
                            Not a habit streak punishment engine
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ff4b4b]">✗</span>
                            Not a dopamine casino
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ff4b4b]">✗</span>
                            Not a social leaderboard
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#ff4b4b]">✗</span>
                            Not a therapy replacement
                        </li>
                    </ul>
                </section>

                {/* Core Principles */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#ffc800]">Core Principles</h2>
                    <div className="grid gap-3">
                        {[
                            { icon: '🛡️', text: 'No shame, ever' },
                            { icon: '🔄', text: 'No streak punishment' },
                            { icon: '🤝', text: 'No social comparison' },
                            { icon: '📈', text: 'Progress over perfection' },
                            { icon: '🌱', text: 'Recovery is part of the system' }
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-3 p-3 bg-[#161b22] rounded-lg">
                                <span className="text-xl">{icon}</span>
                                <span className="text-[#c9d1d9]">{text}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Motto */}
                <section className="text-center py-8 border-t border-[#30363d]">
                    <p className="text-[#6e7681] italic text-lg">
                        "Small wins compound quietly."
                    </p>
                </section>
            </div>
        </main>
    );
}
