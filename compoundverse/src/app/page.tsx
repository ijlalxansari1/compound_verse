'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  getData,
  saveData,
  getToday,
  hasTodayEntry,
  getTodayEntry,
  HabitData
} from '@/lib/storage';
import { calculateScore, updateStreak, checkStreakOnLoad } from '@/lib/scoring';
import { checkBadges } from '@/lib/badges';
import { getMessageType, generateFeedback } from '@/lib/coach';
import { isFirstTimeUser, getSystemConfig, getUserSettings } from '@/lib/admin';
import { getHourlyQuote } from '@/lib/quotes';

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

export default function Home() {
  const [data, setData] = useState<HabitData | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('checkin');
  const [healthChecked, setHealthChecked] = useState<string[]>([]);
  const [faithChecked, setFaithChecked] = useState<string[]>([]);
  const [careerChecked, setCareerChecked] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; xpNote: string } | null>(null);
  const [lastSubmission, setLastSubmission] = useState<{ health: number; faith: number; career: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(getHourlyQuote());

  useEffect(() => {
    // Check if first-time user
    if (isFirstTimeUser()) {
      setShowSetup(true);
    }

    const loadedData = getData();
    checkStreakOnLoad(loadedData);
    saveData(loadedData);
    setData(loadedData);

    if (hasTodayEntry(loadedData)) {
      setSubmitted(true);
      const entry = getTodayEntry(loadedData);
      if (entry) {
        setLastSubmission({ health: entry.health, faith: entry.faith, career: entry.career });
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

  const handleToggle = (domain: 'health' | 'faith' | 'career', value: string) => {
    const setters = {
      health: setHealthChecked,
      faith: setFaithChecked,
      career: setCareerChecked
    };
    const current = domain === 'health' ? healthChecked : domain === 'faith' ? faithChecked : careerChecked;

    if (current.includes(value)) {
      setters[domain](current.filter(v => v !== value));
    } else {
      setters[domain]([...current, value]);
    }
  };

  const handleSubmit = () => {
    if (!data || submitted) return;

    const config = getSystemConfig();
    const health = healthChecked.length > 0 ? 1 : 0;
    const faith = faithChecked.length > 0 ? 1 : 0;
    const career = careerChecked.length > 0 ? 1 : 0;

    const score = calculateScore(health, faith, career);
    const today = getToday();

    const entry = {
      date: today,
      health,
      faith,
      career,
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
    setLastSubmission({ health, faith, career });

    const msgType = getMessageType(score.dailyScore, score.perfectDay, score.strongDay, score.activeDay);
    setFeedback(generateFeedback(score.xpEarned, score.perfectDay, msgType));

    if (score.perfectDay && config.features.perfectDayConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    }
  };

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

  const userSettings = getUserSettings();
  const config = getSystemConfig();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Confetti trigger={showConfetti} />

      <main className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-32">
        {/* App Header */}
        <header className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-extrabold gradient-text tracking-tight">
              CompoundVerse
            </h1>
            <p className="text-[#6e7681] text-sm mt-1">Level up your life, one day at a time</p>
          </motion.div>
        </header>

        {/* Daily Quote */}
        {config.coach.enableTips && (
          <motion.div
            className="glass-card rounded-2xl p-4 mb-6 text-center"
            initial={{ opacity: 0 }}
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {submitted && feedback && lastSubmission && (
                <section className="mb-6">
                  <CoachFeedback
                    message={feedback.message}
                    xpNote={feedback.xpNote}
                    health={lastSubmission.health}
                    faith={lastSubmission.faith}
                    career={lastSubmission.career}
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
                  {config.verses.health.enabled && (
                    <DomainCard
                      domain="health"
                      title={config.verses.health.name}
                      quote="I powered up my body"
                      icon={config.verses.health.icon}
                      items={HEALTH_ITEMS}
                      checked={healthChecked}
                      onToggle={(v) => handleToggle('health', v)}
                      disabled={submitted}
                    />
                  )}

                  {config.verses.faith.enabled && (
                    <DomainCard
                      domain="faith"
                      title={config.verses.faith.name}
                      quote="I nurtured my soul"
                      icon={config.verses.faith.icon}
                      items={FAITH_ITEMS}
                      checked={faithChecked}
                      onToggle={(v) => handleToggle('faith', v)}
                      disabled={submitted}
                    />
                  )}

                  {config.verses.career.enabled && (
                    <DomainCard
                      domain="career"
                      title={config.verses.career.name}
                      quote="I leveled up my mind"
                      icon={config.verses.career.icon}
                      items={CAREER_ITEMS}
                      checked={careerChecked}
                      onToggle={(v) => handleToggle('career', v)}
                      disabled={submitted}
                    />
                  )}

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
                    whileTap={submitted ? {} : { scale: 0.98 }}
                  >
                    {submitted ? (
                      <>✓ Completed Today</>
                    ) : (
                      <>
                        Complete Check-In
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <StatsDashboard data={data} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
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

              {/* User Info */}
              <div className="glass-card rounded-2xl p-5 text-center text-sm text-[#6e7681]">
                <p>User: {userSettings.username}</p>
                <p>Timezone: {userSettings.timezone}</p>
                <p>Coach Tone: {userSettings.coachTone}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center text-sm text-[#6e7681] py-8 mt-8">
          Small wins compound quietly. 🌱
        </footer>
      </main>

      {!config.music.enabledByDefault ? null : <MusicPlayer />}
    </>
  );
}
