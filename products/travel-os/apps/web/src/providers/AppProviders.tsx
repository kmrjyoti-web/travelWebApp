'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { KeyboardShortcutProvider } from './KeyboardShortcutProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <KeyboardShortcutProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </KeyboardShortcutProvider>
    </ThemeProvider>
  );
}
