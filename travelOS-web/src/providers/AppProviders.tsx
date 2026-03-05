'use client';
import React from 'react';
import { QueryProvider } from './QueryProvider';
import { UIKitThemeProvider } from '@/features/theme/ThemeProvider';
import ThemeSettings from '@/features/theme/ThemeSettings';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <UIKitThemeProvider>
        {children}
        <ThemeSettings />
      </UIKitThemeProvider>
    </QueryProvider>
  );
}
