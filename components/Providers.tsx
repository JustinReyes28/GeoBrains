'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { queryClient } from '../src/lib/queryClient';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
