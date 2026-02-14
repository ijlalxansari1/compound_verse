import { createBrowserClient } from '@supabase/ssr'


let supabasePromise: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
    if (typeof window === 'undefined') {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        return createBrowserClient(url, key)
    }

    if (!supabasePromise) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        supabasePromise = createBrowserClient(url, key)
    }

    return supabasePromise
}
