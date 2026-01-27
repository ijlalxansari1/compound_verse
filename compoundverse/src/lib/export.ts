// CompoundVerse - Export Utilities

import { HabitData, Entry } from './storage';
import { getUserSettings } from './admin';

// Export to JSON
export function exportToJSON(data: HabitData): string {
    const exportData = {
        exportedAt: new Date().toISOString(),
        user: getUserSettings(),
        ...data
    };
    return JSON.stringify(exportData, null, 2);
}

// Export to CSV
export function exportToCSV(entries: Entry[]): string {
    const headers = ['Date', 'Health', 'Faith', 'Career', 'Daily Score', 'XP Earned', 'Active Day', 'Strong Day', 'Perfect Day', 'Reflection'];

    const rows = entries.map(e => [
        e.date,
        e.health,
        e.faith,
        e.career,
        e.dailyScore,
        e.xpEarned,
        e.activeDay,
        e.strongDay,
        e.perfectDay,
        `"${(e.reflection || '').replace(/"/g, '""')}"`
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
}

// Generate Weekly Summary
export function generateWeeklySummary(data: HabitData): string {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyEntries = data.entries.filter(e => new Date(e.date) >= weekAgo);
    const weeklyXP = weeklyEntries.reduce((sum, e) => sum + e.xpEarned, 0);
    const weeklyActive = weeklyEntries.filter(e => e.activeDay).length;
    const weeklyPerfect = weeklyEntries.filter(e => e.perfectDay).length;

    const healthDays = weeklyEntries.filter(e => e.health === 1).length;
    const faithDays = weeklyEntries.filter(e => e.faith === 1).length;
    const careerDays = weeklyEntries.filter(e => e.career === 1).length;

    return `
COMPOUNDVERSE - WEEKLY SUMMARY
Generated: ${today.toLocaleDateString()}
Week: ${weekAgo.toLocaleDateString()} - ${today.toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERVIEW
• XP Earned This Week: ${weeklyXP}
• Active Days: ${weeklyActive}/7
• Perfect Days: ${weeklyPerfect}

DOMAIN BREAKDOWN
• Health: ${healthDays}/7 days
• Faith: ${faithDays}/7 days  
• Career: ${careerDays}/7 days

STREAK STATUS
• Current Streak: ${data.stats.currentStreak} days
• Longest Streak: ${data.stats.longestStreak} days

OVERALL STATS
• Total Level: ${data.stats.level}
• Total XP: ${data.stats.totalXP}
• Total Active Days: ${data.stats.activeDays}
• Total Perfect Days: ${data.stats.perfectDays}
• Badges Unlocked: ${data.stats.badges.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DAILY LOG
${weeklyEntries.map(e => `
${e.date}
  Health: ${e.health ? '✓' : '—'} | Faith: ${e.faith ? '✓' : '—'} | Career: ${e.career ? '✓' : '—'}
  Score: ${e.dailyScore}/3 | XP: +${e.xpEarned}
  ${e.reflection ? `Reflection: "${e.reflection}"` : ''}
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Small wins compound quietly.
CompoundVerse
`.trim();
}

// Download file helper
export function downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export handlers
export function downloadJSON(data: HabitData): void {
    const content = exportToJSON(data);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(content, `compoundverse-export-${date}.json`, 'application/json');
}

export function downloadCSV(entries: Entry[]): void {
    const content = exportToCSV(entries);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(content, `compoundverse-history-${date}.csv`, 'text/csv');
}

export function downloadSummary(data: HabitData): void {
    const content = generateWeeklySummary(data);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(content, `compoundverse-summary-${date}.txt`, 'text/plain');
}
