import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export interface Entry {
    date: string;
    domains: Record<string, number>;
    reflection: string;
    dailyScore: number;
    activeDay: number;
    strongDay: number;
    perfectDay: number;
    xpEarned: number;
}

const supabase = createClient()

export const useHabits = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    // Query: Fetch entries
    const { data: entries, isLoading, error } = useQuery({
        queryKey: ['entries', user?.id],
        queryFn: async () => {
            if (!user) return []
            const { data, error } = await supabase
                .from('entries')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })

            if (error) throw error

            // Transform snake_case to camelCase
            return (data || []).map((e: any) => ({
                date: e.date,
                domains: e.domains,
                reflection: e.reflection,
                dailyScore: e.daily_score,
                activeDay: e.active_day,
                strongDay: e.strong_day,
                perfectDay: e.perfect_day,
                xpEarned: e.xp_earned
            })) as Entry[]
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    })

    // Mutation: Upsert Entry
    const mutation = useMutation({
        mutationFn: async (entry: Partial<Entry> & { date: string }) => {
            if (!user) throw new Error('User not logged in')

            // Transform camelCase to snake_case for DB
            const dbEntry = {
                user_id: user.id,
                date: entry.date,
                domains: entry.domains,
                reflection: entry.reflection,
                daily_score: entry.dailyScore,
                active_day: entry.activeDay,
                strong_day: entry.strongDay,
                perfect_day: entry.perfectDay,
                xp_earned: entry.xpEarned
            }

            const { data, error } = await supabase
                .from('entries')
                .upsert(dbEntry)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entries'] })
            queryClient.invalidateQueries({ queryKey: ['stats'] })
        }
    })

    return {
        entries,
        isLoading,
        error,
        saveEntry: mutation.mutate,
        isSaving: mutation.isPending
    }
}
