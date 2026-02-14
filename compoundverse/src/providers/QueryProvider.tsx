'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState, useEffect } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes fresh
                gcTime: 24 * 60 * 60 * 1000, // 24 hours in garbage collection (aka cache time)
            },
        },
    }));

    const [persister, setPersister] = useState<any>(null);

    useEffect(() => {
        // Only access localStorage on client
        if (typeof window !== 'undefined') {
            const localStoragePersister = createSyncStoragePersister({
                storage: window.localStorage,
            });
            setPersister(localStoragePersister);
        }
    }, []);

    if (!persister) {
        // Return children wrapped in standard provider during SSR/hydration
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
