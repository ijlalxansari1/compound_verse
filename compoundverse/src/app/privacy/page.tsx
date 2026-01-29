import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#0d1117] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <Link href="/" className="inline-flex items-center gap-2 text-[#8b949e] hover:text-white mb-8">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-6">Privacy & Data Ethics</h1>

                {/* Our Pledge */}
                <section className="mb-10 p-6 bg-[#161b22] rounded-xl border border-[#30363d]">
                    <h2 className="text-xl font-semibold mb-4 text-[#58cc02]">🛡️ Our Pledge to You</h2>
                    <div className="space-y-4 text-[#8b949e]">
                        <p>CompoundVerse is built on trust. Here's what we promise:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-3">
                                <span className="text-[#58cc02]">✓</span>
                                <strong className="text-white">We do NOT sell your data.</strong> Ever.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#58cc02]">✓</span>
                                <strong className="text-white">We do NOT use social pressure mechanics.</strong>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#58cc02]">✓</span>
                                <strong className="text-white">We do NOT track you for advertising.</strong>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#58cc02]">✓</span>
                                <strong className="text-white">Your progress data stays private.</strong>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Data Storage */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#1cb0f6]">📦 Where Your Data Lives</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        Currently, all your data is stored <strong className="text-white">locally in your browser</strong>
                        using localStorage. This means:
                    </p>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#1cb0f6]">•</span>
                            Your data never leaves your device
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#1cb0f6]">•</span>
                            Clearing browser data will erase your progress
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#1cb0f6]">•</span>
                            You can export your data anytime from Settings
                        </li>
                    </ul>
                </section>

                {/* What We Collect */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#ffc800]">📊 What We Collect</h2>
                    <div className="space-y-4 text-[#8b949e]">
                        <div className="p-4 bg-[#161b22] rounded-lg">
                            <h3 className="font-semibold text-white mb-2">Your Check-ins</h3>
                            <p className="text-sm">Daily health, faith, career progress. Stored locally.</p>
                        </div>
                        <div className="p-4 bg-[#161b22] rounded-lg">
                            <h3 className="font-semibold text-white mb-2">Your Reflections</h3>
                            <p className="text-sm">Optional notes and grounding mode reflections. Stored locally.</p>
                        </div>
                        <div className="p-4 bg-[#161b22] rounded-lg">
                            <h3 className="font-semibold text-white mb-2">Your Settings</h3>
                            <p className="text-sm">Username, avatar, preferences. Stored locally.</p>
                        </div>
                    </div>
                </section>

                {/* Design Ethics */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-[#8b5cf6]">🎨 Design Ethics</h2>
                    <p className="text-[#8b949e] leading-relaxed mb-4">
                        Our design follows strict ethical guidelines:
                    </p>
                    <ul className="space-y-2 text-[#8b949e]">
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Never shame the user
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Never punish honesty
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Never equate value with output
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Never weaponize data
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#8b5cf6]">•</span>
                            Never force engagement
                        </li>
                    </ul>
                </section>

                {/* Contact */}
                <section className="text-center py-8 border-t border-[#30363d]">
                    <p className="text-[#6e7681] mb-4">Questions or concerns?</p>
                    <p className="text-[#8b949e]">
                        Reach out: <span className="text-[#1cb0f6]">feedback@compoundverse.app</span>
                    </p>
                </section>
            </div>
        </main>
    );
}
