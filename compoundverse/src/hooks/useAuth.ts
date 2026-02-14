import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    session: Session | null
    isLoading: boolean
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    setIsLoading: (isLoading: boolean) => void
    signOut: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setIsLoading: (isLoading) => set({ isLoading }),
    signOut: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        set({ user: null, session: null })
    },
}))

// Auth listener to initialize state
export const initializeAuthListener = () => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
        useAuth.getState().setSession(session)
        useAuth.getState().setUser(session?.user ?? null)
        useAuth.getState().setIsLoading(false)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event: string, session: Session | null) => {
            useAuth.getState().setSession(session)
            useAuth.getState().setUser(session?.user ?? null)
            useAuth.getState().setIsLoading(false)
        }
    )

    return subscription
}
