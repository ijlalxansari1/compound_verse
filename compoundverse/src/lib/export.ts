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

// Generate Weekly Summary with Narrative Storytelling
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

    // Generate narrative based on activity
    let narrative = '';
    if (weeklyActive === 7) {
        narrative = 'You showed up every day this week. That consistency speaks for itself.';
    } else if (weeklyActive >= 5) {
        narrative = `You showed up ${weeklyActive} out of 7 days. Strong pattern forming.`;
    } else if (weeklyActive >= 3) {
        narrative = `${weeklyActive} days this week. You're still in motion.`;
    } else if (weeklyActive >= 1) {
        narrative = `You showed up ${weeklyActive} time${weeklyActive > 1 ? 's' : ''} this week. Something beats nothing.`;
    } else {
        narrative = 'This week was quiet. Ready when you are.';
    }

    // Domain insight
    const strongestDomain = Math.max(healthDays, faithDays, careerDays);
    let domainInsight = '';
    if (strongestDomain > 0) {
        if (healthDays === strongestDomain) domainInsight = 'Health was your strongest domain this week.';
        else if (faithDays === strongestDomain) domainInsight = 'Faith/Inner Life was your focus this week.';
        else domainInsight = 'Career/Learning got the most attention.';
    }

    return `
COMPOUNDVERSE - WEEKLY REFLECTION
Generated: ${today.toLocaleDateString()}
Week: ${weekAgo.toLocaleDateString()} - ${today.toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${narrative}
${domainInsight}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THIS WEEK
• Active Days: ${weeklyActive}/7
• XP Earned: ${weeklyXP}
${weeklyPerfect > 0 ? `• Complete Days: ${weeklyPerfect}` : ''}

DOMAIN ACTIVITY
• Health: ${healthDays}/7 days
• Faith: ${faithDays}/7 days  
• Career: ${careerDays}/7 days

OVERALL JOURNEY
• Level: ${data.stats.level}
• Total XP: ${data.stats.totalXP}
• All-Time Active Days: ${data.stats.activeDays}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DAILY LOG
${weeklyEntries.map(e => `
${e.date}
  ${e.health ? '✓' : '—'} Health | ${e.faith ? '✓' : '—'} Faith | ${e.career ? '✓' : '—'} Career
  ${e.reflection ? `"${e.reflection}"` : ''}
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Patterns speak louder than numbers.
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
