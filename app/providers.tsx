'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavBar } from '../core/ui/NavBar';
import '../lib/i18n';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}