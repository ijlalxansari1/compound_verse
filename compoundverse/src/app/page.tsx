'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import ProfileCard from '@/components/ProfileCard';
import XPBar from '@/components/XPBar';
import StreakCounter from '@/components/StreakCounter';
import DomainCard from '@/components/DomainCard';
import BadgeGrid from '@/components/BadgeGrid';
import CoachFeedback from '@/components/CoachFeedback';
import HistoryGrid from '@/components/HistoryGrid';
import StatsDashboard from '@/components/StatsDashboard';
import MusicPlayer from '@/components/MusicPlayer';
import Confetti from '@/components/Confetti';
import FirstTimeSetup from '@/components/FirstTimeSetup';
import ExportPanel from '@/components/ExportPanel';
import PanicButton from '@/components/PanicButton';
import GroundingMode from '@/components/GroundingMode';
import MomentumRing from '@/components/MomentumRing';
import DomainManager from '@/components/DomainManager';
import AdminDashboard from '@/components/AdminDashboard';
import WeeklyReflectionCard from '@/components/WeeklyReflectionCard';
import AppearanceSettings from '@/components/AppearanceSettings';
import {
  getData,
  saveData,
  getToday,
  hasTodayEntry,
  getTodayEntry,
  HabitData,
  Entry
} from '@/lib/storage';
import { calculateScore, updateStreak, checkStreakOnLoad } from '@/lib/scoring';
import { checkBadges } from '@/lib/badges';
import { getMessageType, generateFeedback } from '@/lib/coach';
import { isFirstTimeUser, getSystemConfig, getUserSettings } from '@/lib/admin';
import { getHourlyQuote } from '@/lib/quotes';
import { calculateMomentum, MomentumResult } from '@/lib/momentum';
import { getPanicState, resetDailyPanicState, getPanicDays } from '@/lib/panic';

const HEALTH_ITEMS = [
  { value: 'pushups', label: 'Push-ups (any amount)' },
  { value: 'walk', label: 'Walk (10+ minutes)' },
  { value: 'norelapse', label: 'No relapse today' }
];

const FAITH_ITEMS = [
  { value: 'tasbih', label: 'Tasbih (any count)' },
  { value: 'reflection', label: 'Quiet reflection' },
  { value: 'gratitude', label: 'Gratitude (1 blessing)' }
];

const CAREER_ITEMS = [
  { value: 'de', label: 'Data Engineering lesson' },
  { value: 'german', label: 'German lesson' },
  { value: 'reading', label: 'Read 10 pages' },
  { value: 'learning', label: 'Learned 1 positive thing' }
];

const TABS = [
  { id: 'checkin', label: 'Check-In', icon: '✅' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'history', label: 'History', icon: '📅' },
  { id: 'settings', label: 'More', icon: '⚙️' },
];

import {
  getDomains,
  getActiveDomains,
  Domain
} from '@/lib/domains';

export default function Home() {
  const [data, setData] = useState<HabitData | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('checkin');

  // Dynamic state for checked items: { domainId: [itemValues] }
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>({});

  const [reflectionText, setReflectionText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; xpNote: string } | null>(null);
  const [lastSubmission, setLastSubmission] = useState<Record<string, number> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(getHourlyQuote());
  const [isGrounding, setIsGrounding] = useState(false);
  const [momentum, setMomentum] = useState<MomentumResult | null>(null);
  const [activeDomains, setActiveDomains] = useState<Domain[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(getUserSettings());

  useEffect(() => {
    // Check if first-time user
    if (isFirstTimeUser()) {
      setShowSetup(true);
    }

    // Reset daily panic state
    resetDailyPanicState();

    // Check if currently in grounding mode
    const panicState = getPanicState();
    if (panicState.isActive) {
      setIsGrounding(true);
    }

    const loadedData = getData();
    checkStreakOnLoad(loadedData);
    saveData(loadedData);
    setData(loadedData);

    // Initial settings load
    const currentSettings = getUserSettings();
    setUserSettings(currentSettings);

    // Load active domains
    const domains = getActiveDomains();
    setActiveDomains(domains);

    // Calculate momentum
    const panicDays = getPanicDays();
    const momentumResult = calculateMomentum(loadedData, panicDays);
    setMomentum(momentumResult);

    if (hasTodayEntry(loadedData)) {
      setSubmitted(true);
      const entry = getTodayEntry(loadedData);
      if (entry) {
        setLastSubmission(entry.domains);
        const msgType = getMessageType(entry.dailyScore, entry.perfectDay, entry.strongDay, entry.activeDay);
        setFeedback(generateFeedback(entry.xpEarned, entry.perfectDay, msgType));
      }
    }
  }, []);

  const handleSetupComplete = () => {
    setShowSetup(false);
    // Reload to apply settings
    window.location.reload();
  };

  const handleToggle = (domainId: string, value: string) => {
    if (submitted) return;

    setCheckedItems(prev => {
      const current = prev[domainId] || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [domainId]: next };
    });
  };

  const handleSubmit = () => {
    if (!data || submitted) return;

    const config = getSystemConfig();
    const activeDomainIds = activeDomains.map(d => d.id);

    // Convert checkedItems (values) to binary domainsRecord (id -> 1/0)
    const domainsRecord: Record<string, number> = {};
    activeDomainIds.forEach(id => {
      domainsRecord[id] = (checkedItems[id]?.length > 0) ? 1 : 0;
    });

    const score = calculateScore(domainsRecord, activeDomainIds);
    const today = getToday();

    const entry: Entry = {
      date: today,
      domains: domainsRecord,
      reflection: reflectionText,
      ...score
    };

    const newData = { ...data };
    newData.entries.push(entry);
    newData.stats.totalXP += score.xpEarned;
    newData.stats.level = Math.floor(newData.stats.totalXP / config.xpRules.xpPerLevel) + 1;
    newData.stats.activeDays += score.activeDay;
    newData.stats.strongDays += score.strongDay;
    newData.stats.perfectDays += score.perfectDay;

    updateStreak(newData, score.activeDay);
    const newBadges = checkBadges(newData.stats, newData.entries);
    newData.stats.badges = [...newData.stats.badges, ...newBadges];

    saveData(newData);
    setData(newData);
    setSubmitted(true);
    setLastSubmission(domainsRecord);

    const msgType = getMessageType(score.dailyScore, score.perfectDay, score.strongDay, score.activeDay);
    setFeedback(generateFeedback(score.xpEarned, score.perfectDay, msgType));

    if (score.perfectDay && config.features.perfectDayConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    }
  };

  // Handle entering grounding mode - MUST be before any conditional returns
  const handlePanicActivate = useCallback(() => {
    setIsGrounding(true);
  }, []);

  // Handle exiting grounding mode - MUST be before any conditional returns
  const handleGroundingExit = useCallback(() => {
    setIsGrounding(false);
    // Recalculate momentum after exiting (day is now protected)
    if (data) {
      const panicDays = getPanicDays();
      const momentumResult = calculateMomentum(data, panicDays);
      setMomentum(momentumResult);
    }
  }, [data]);

  // Show setup wizard for first-time users
  if (showSetup) {
    return <FirstTimeSetup onComplete={handleSetupComplete} />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl"
        >
          ⚡
        </motion.div>
      </div>
    );
  }

  // If in grounding mode, show only the grounding screen
  if (isGrounding) {
    return <GroundingMode onExit={handleGroundingExit} />;
  }

  const config = getSystemConfig();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div className={userSettings.theme !== 'midnight' ? `theme-${userSettings.theme}` : ''}>
        <Confetti trigger={showConfetti} />

        {/* Panic Button - always visible */}
        <PanicButton onActivate={handlePanicActivate} />

        <main className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-32">
          {/* App Header */}
          <header className="text-center mb-8">
            <motion.div
              initial={userSettings.animationIntensity === 'static' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative w-16 h-16 mb-2">
                <NextImage
                  src="/logo.png"
                  alt="CompoundVerse Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-4xl font-black gradient-text tracking-tighter">
                CompoundVerse
              </h1>
              <p className="text-[#6e7681] text-xs font-medium uppercase tracking-widest">
                Life Operating System
              </p>
            </motion.div>
          </header>

          {/* Daily Quote */}
          {config.coach.enableTips && (
            <motion.div
              className="glass-card rounded-2xl p-4 mb-6 text-center"
              initial={userSettings.animationIntensity === 'static' ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm italic text-[#8b949e]">"{dailyQuote.text}"</p>
              <p className="text-xs text-[#6e7681] mt-1">— {dailyQuote.author}</p>
            </motion.div>
          )}

          {/* Profile Card */}
          <ProfileCard
            level={data.stats.level}
            totalXP={data.stats.totalXP}
            currentStreak={data.stats.currentStreak}
            longestStreak={data.stats.longestStreak}
            activeDays={data.stats.activeDays}
            perfectDays={data.stats.perfectDays}
          />

          {/* Momentum Ring - replaces brittle streak focus */}
          {momentum && (
            <section className="mb-6 flex justify-center">
              <MomentumRing momentum={momentum} size="md" />
            </section>
          )}

          {/* XP Bar */}
          <section className="mb-6">
            <XPBar currentXP={data.stats.totalXP} level={data.stats.level} />
          </section>

          {/* Tab Navigation */}
          <div className="tab-bar flex gap-1 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item flex-1 flex items-center justify-center gap-1 ${activeTab === tab.id ? 'active' : 'text-[#6e7681] hover:text-white'
                  }`}
              >
                <span>{tab.icon}</span>
                <span className="font-semibold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'checkin' && (
              <motion.div
                key="checkin"
                initial={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: 20 }}
              >
                {submitted && feedback && lastSubmission && (
                  <section className="mb-6">
                    <CoachFeedback
                      message={feedback.message}
                      xpNote={feedback.xpNote}
                      // Pass the first 3 core domains for backward compatibility in feedback
                      health={lastSubmission['health'] || 0}
                      faith={lastSubmission['faith'] || 0}
                      career={lastSubmission['career'] || 0}
                    />
                  </section>
                )}

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      📝 Daily Check-In
                    </h2>
                    <span className="text-sm text-[#8b949e]">{todayFormatted}</span>
                  </div>

                  <div className="space-y-4">
                    {activeDomains.map((domain) => (
                      <DomainCard
                        key={domain.id}
                        domain={domain.id}
                        title={domain.name}
                        quote={domain.intention}
                        icon={domain.icon}
                        items={domain.items.map(i => ({ value: i.id, label: i.label }))}
                        checked={checkedItems[domain.id] || []}
                        onToggle={(v) => handleToggle(domain.id, v)}
                        disabled={submitted}
                        color={domain.color}
                      />
                    ))}

                    {config.features.reflections && (
                      <div className="glass-card rounded-2xl p-5">
                        <label className="flex items-center gap-2 text-sm text-[#8b949e] mb-3">
                          <span className="text-xl">💭</span>
                          One thing I learned or felt good about today
                        </label>
                        <textarea
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                          placeholder="Today I realized..."
                          disabled={submitted}
                          className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-xl p-4 text-sm resize-y focus:outline-none focus:border-[#58cc02] disabled:opacity-50 transition-all"
                          rows={3}
                        />
                      </div>
                    )}

                    <motion.button
                      onClick={handleSubmit}
                      disabled={submitted}
                      className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 ${submitted
                        ? 'bg-[#21262d] text-[#6e7681] cursor-not-allowed'
                        : 'btn-duo'
                        }`}
                      whileTap={submitted || userSettings.animationIntensity === 'static' ? {} : { scale: 0.98 }}
                    >
                      {submitted ? (
                        <>✓ Completed Today</>
                      ) : (
                        <>
                          Complete Check-In
                          <motion.span
                            animate={userSettings.animationIntensity === 'static' ? {} : { x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🏅 Achievements
                  </h2>
                  <BadgeGrid unlockedBadges={data.stats.badges} />
                </section>
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: 20 }}
              >
                {/* Weekly Reflection */}
                <WeeklyReflectionCard data={data} />
                <StatsDashboard data={data} />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: 20 }}
              >
                {config.features.streakDisplay && (
                  <section className="mb-6">
                    <StreakCounter
                      currentStreak={data.stats.currentStreak}
                      longestStreak={data.stats.longestStreak}
                    />
                  </section>
                )}

                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    📅 Last 28 Days
                  </h2>
                  <div className="glass-card rounded-2xl p-5">
                    <HistoryGrid entries={data.entries} />
                    <div className="flex justify-center gap-4 mt-4 text-xs text-[#6e7681]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-[#ffc800] to-[#ff9600]" />
                        <span>Perfect</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#58cc02]/40" />
                        <span>Strong</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#1cb0f6]/30" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🏅 All Achievements
                  </h2>
                  <BadgeGrid unlockedBadges={data.stats.badges} />
                </section>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={userSettings.animationIntensity === 'static' ? {} : { opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Appearance Settings */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-base mb-4 text-[#8b949e] flex items-center gap-2">
                    🎨 Appearance
                  </h3>
                  <AppearanceSettings
                    settings={userSettings}
                    onUpdate={(s) => setUserSettings(s)}
                  />
                </div>

                {/* Export */}
                <ExportPanel data={data} />

                {/* Admin Link */}
                <a
                  href="/admin"
                  className="block w-full p-4 glass-card rounded-2xl hover:bg-[#21262d] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">⚙️</span>
                    <div>
                      <div className="font-semibold text-[#1cb0f6]">Admin Dashboard</div>
                      <div className="text-sm text-[#6e7681]">Configure system settings</div>
                    </div>
                    <span className="ml-auto text-[#6e7681]">→</span>
                  </div>
                </a>

                {/* Reset Setup */}
                <button
                  onClick={() => {
                    localStorage.removeItem('compoundverse_user_settings');
                    window.location.reload();
                  }}
                  className="w-full p-4 glass-card rounded-2xl hover:bg-[#21262d] transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🔄</span>
                    <div>
                      <div className="font-semibold text-[#ffc800]">Restart Setup</div>
                      <div className="text-sm text-[#6e7681]">Re-run the onboarding wizard</div>
                    </div>
                  </div>
                </button>

                {/* Legal Pages */}
                <div className="glass-card rounded-2xl p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-[#8b949e] mb-3">About CompoundVerse</h4>
                  <a href="/about" className="block p-3 rounded-lg hover:bg-[#21262d] transition-colors">
                    <span className="text-sm">📖 About & Philosophy</span>
                  </a>
                  <a href="/how-it-works" className="block p-3 rounded-lg hover:bg-[#21262d] transition-colors">
                    <span className="text-sm">❓ How It Works</span>
                  </a>
                  <a href="/privacy" className="block p-3 rounded-lg hover:bg-[#21262d] transition-colors">
                    <span className="text-sm">🔒 Privacy & Data Ethics</span>
                  </a>
                </div>

                {/* User Info */}
                <div className="glass-card rounded-2xl p-5 text-center text-sm text-[#6e7681]">
                  <p>User: {userSettings.username}</p>
                  <p>Timezone: {userSettings.timezone}</p>
                  <p>Coach Tone: {userSettings.coachTone}</p>
                </div>

                {/* Domain Manager */}
                <div className="glass-card rounded-2xl p-5">
                  <DomainManager />
                </div>

                {/* Admin Dashboard */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-base mb-4 text-[#8b949e]">
                    📊 Analytics & Settings
                  </h3>
                  <AdminDashboard />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="text-center text-sm text-[#6e7681] py-8 mt-8">
            Small wins compound quietly. 🌱
          </footer>
        </main>

        {/* Music Player - always visible */}
        <MusicPlayer />
      </div>
    </>
  );
}
