import type { Entry } from '@/hooks/useHabits';

export interface ScoreResult {
  dailyScore: number;
  activeDay: number;
  strongDay: number;
  perfectDay: number;
  xpEarned: number;
}

export function buildDomainRecord(
  activeDomainIds: string[],
  checkedItems: Record<string, string[]>
): Record<string, number> {
  return activeDomainIds.reduce<Record<string, number>>((acc, domainId) => {
    acc[domainId] = checkedItems[domainId]?.length ? 1 : 0;
    return acc;
  }, {});
}

export function buildEntryPayload(
  date: string,
  reflection: string,
  domains: Record<string, number>,
  score: ScoreResult
): Partial<Entry> & { date: string } {
  return {
    date,
    reflection,
    domains,
    dailyScore: score.dailyScore,
    activeDay: score.activeDay,
    strongDay: score.strongDay,
    perfectDay: score.perfectDay,
    xpEarned: score.xpEarned,
  };
}
