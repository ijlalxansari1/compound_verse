'use client'

import { useEffect } from 'react'
import { initializeAuthListener } from '@/hooks/useAuth'

export default function AuthListener() {
    useEffect(() => {
        const subscription = initializeAuthListener()
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return null
}
