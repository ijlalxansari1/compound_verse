'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import dynamic from 'next/dynamic'; // Import dynamic
import Link from 'next/link';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useHabits, Entry } from '@/hooks/useHabits';

// Critical Layout Components (Keep Static)
import AuthPage from '@/components/AuthPage';
import LandingPage from '@/components/LandingPage';
import XPBar from '@/components/XPBar';
import ProfileCard from '@/components/ProfileCard'; // Keeping ProfileCard static for LCP
import PanicButton from '@/components/PanicButton';
import MusicPlayer from '@/components/MusicPlayer';
import Confetti from '@/components/Confetti';
import DynamicGreeting from '@/components/DynamicGreeting';

// Lazy Load Heavy/Interactive Components
const DomainCard = dynamic(() => import('@/components/DomainCard'), {
  loading: () => <div className="h-32 mb-4 bg-muted/20 animate-pulse rounded-2xl" />
});
const WeeklyReflectionCard = dynamic(() => import('@/components/WeeklyReflectionCard'), {
  loading: () => <div className="h-64 mb-6 bg-muted/20 animate-pulse rounded-2xl" />
});
const StatsDashboard = dynamic(() => import('@/components/StatsDashboard'), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-2xl" />
});
const HistoryGrid = dynamic(() => import('@/components/HistoryGrid'));
const CoachFeedback = dynamic(() => import('@/components/CoachFeedback'));
const BadgeGrid = dynamic(() => import('@/components/BadgeGrid'));
const FirstTimeSetup = dynamic(() => import('@/components/FirstTimeSetup'));
const ExportPanel = dynamic(() => import('@/components/ExportPanel'));
const GroundingMode = dynamic(() => import('@/components/GroundingMode'));
const DomainManager = dynamic(() => import('@/components/DomainManager'));
const AppearanceSettings = dynamic(() => import('@/components/AppearanceSettings'));

// Libs
import { getToday, getTodayEntry, HabitData } from '@/lib/storage'; // Kept for types/utils
import { calculateScore, updateStreak } from '@/lib/scoring';
import { checkBadges } from '@/lib/badges';
import { getMessageType, generateFeedback } from '@/lib/coach';
import { isFirstTimeUser, getSystemConfig, getUserSettings, UserSettings } from '@/lib/admin';
import { getHourlyQuote } from '@/lib/quotes';
import { calculateMomentum, MomentumResult } from '@/lib/momentum';
import { getPanicState, resetDailyPanicState, getPanicDays } from '@/lib/panic';
import { getActiveDomains, Domain } from '@/lib/domains';

const TABS = [
  { id: 'checkin', label: 'Check-In', icon: '✅' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'history', label: 'History', icon: '📅' },
  { id: 'settings', label: 'More', icon: '⚙️' },
];

export default function Home() {
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const { entries, saveEntry, isLoading: isHabitsLoading } = useHabits();

  const [activeTab, setActiveTab] = useState('checkin');
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>({});
  const [reflectionText, setReflectionText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; xpNote: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeDomains, setActiveDomains] = useState<Domain[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(getUserSettings());
  const [isGrounding, setIsGrounding] = useState(false);
  const [momentum, setMomentum] = useState<MomentumResult | null>(null);

  // Derived state
  const todayEntry = entries?.find(e => e.date === getToday());
  const isSetup = !isFirstTimeUser();

  // Load Initial Data
  useEffect(() => {
    if (!user) return;

    // Reset Panic
    resetDailyPanicState(user.id);
    const panicState = getPanicState(user.id);
    if (panicState.isActive) setIsGrounding(true);

    // Load Settings & Domains
    setUserSettings(getUserSettings(user.id));
    setActiveDomains(getActiveDomains(user.id));

    // Check today's status
    if (todayEntry) {
      setSubmitted(true);
      // Pre-fill unchecked items if needed (optional)
    }
  }, [user, todayEntry]);

  // Handle Grounding
  const handlePanicActivate = useCallback(() => setIsGrounding(true), []);
  const handleGroundingExit = useCallback(() => setIsGrounding(false), []);

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

  const handleSubmit = async () => {
    if (submitted || !user) return;

    const config = getSystemConfig();
    const activeDomainIds = activeDomains.map(d => d.id);

    // Map checked items
    const domainsRecord: Record<string, number> = {};
    activeDomainIds.forEach(id => {
      domainsRecord[id] = (checkedItems[id]?.length > 0) ? 1 : 0;
    });

    const score = calculateScore(domainsRecord, activeDomainIds);
    const today = getToday();

    // Optimistic UI updates could happen here
    setSubmitted(true);

    // Save via Hook (Supabase)
    saveEntry({
      date: today,
      domains: domainsRecord,
      reflection: reflectionText,
      dailyScore: score.dailyScore,
      activeDay: score.activeDay,
      strongDay: score.strongDay,
      perfectDay: score.perfectDay,
      xpEarned: score.xpEarned // Note: TotalXP calculation needs to happen on server or be re-fetched
    });

    // Feedback
    const msgType = getMessageType(score.dailyScore, score.perfectDay, score.strongDay, score.activeDay);
    setFeedback(generateFeedback(score.xpEarned, score.perfectDay, msgType));

    if (score.perfectDay && config.features.perfectDayConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    }
  };

  // Loading State
  if (isAuthLoading || (user && isHabitsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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

  // Auth Guard
  if (!user) {
    return <LandingPage />;
  }

  // Setup Guard
  if (!isSetup) {
    return <FirstTimeSetup onComplete={() => window.location.reload()} />;
  }

  // Grounding Guard
  if (isGrounding) {
    return <GroundingMode onExit={handleGroundingExit} />;
  }

  // Construct Data Object for children (adapter pattern)
  // This constructs a "HabitData" object that legacy components expect
  // We might want to refactor children components later to not need this massive object
  const adapterData: HabitData = {
    entries: entries || [],
    stats: {
      // This creates a derived view of stats from entries. 
      // Ideally we would fetch 'user_stats' table separately
      // For now, simple aggregation or 0s
      totalXP: entries?.reduce((acc, e) => acc + (e.xpEarned || 0), 0) || 0,
      level: 1, // Todo: Calculate level
      currentStreak: 0, // Todo: Calculate streak
      longestStreak: 0,
      perfectDays: entries?.filter(e => e.perfectDay).length || 0,
      activeDays: entries?.filter(e => e.activeDay).length || 0,
      strongDays: entries?.filter(e => e.strongDay).length || 0,
      badges: []
    }
  };


  return (
    <div className={userSettings.theme !== 'midnight' ? `theme-${userSettings.theme}` : ''}>
      <Confetti trigger={showConfetti} />
      <PanicButton onActivate={handlePanicActivate} />

      <main className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              CompoundVerse
            </h1>
            <button
              onClick={() => signOut()}
              className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Profile & XP */}
        <ProfileCard
          level={adapterData.stats.level}
          totalXP={adapterData.stats.totalXP}
          currentStreak={adapterData.stats.currentStreak}
          longestStreak={adapterData.stats.longestStreak}
          activeDays={adapterData.stats.activeDays}
          perfectDays={adapterData.stats.perfectDays}
          username={user.email?.split('@')[0] || 'Player'}
        />

        <section className="mb-6 mt-4">
          <XPBar currentXP={adapterData.stats.totalXP} level={adapterData.stats.level} />
        </section>

        {/* Tab Navigation */}
        <div className="tab-bar flex gap-1 mb-6 bg-secondary/50 p-1 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'checkin' && (
            <motion.div
              key="checkin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Feedback Section */}
              {submitted && feedback && (
                <section className="mb-6">
                  <CoachFeedback
                    message={feedback.message}
                    xpNote={feedback.xpNote}
                    health={todayEntry?.domains['health'] || 0}
                    faith={todayEntry?.domains['faith'] || 0}
                    career={todayEntry?.domains['career'] || 0}
                  />
                </section>
              )}

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
                  />
                ))}

                {/* Action Button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${submitted
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]'
                    }`}
                  whileTap={!submitted ? { scale: 0.98 } : {}}
                >
                  {submitted ? "Checked In for Today ✅" : "Complete Check-In"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Weekly Reflection */}
              <WeeklyReflectionCard
                data={adapterData}
                username={user.email?.split('@')[0] || 'Player'}
              />
              <StatsDashboard data={adapterData} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HistoryGrid entries={adapterData.entries} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <AppearanceSettings
                settings={userSettings}
                onUpdate={(s) => setUserSettings(s)}
                userId={user.id}
              />
              <ExportPanel data={adapterData} />
              <DomainManager userId={user.id} />
            </motion.div>
          )}


        </AnimatePresence>

      </main>
      <MusicPlayer />
    </div>
  )
}
