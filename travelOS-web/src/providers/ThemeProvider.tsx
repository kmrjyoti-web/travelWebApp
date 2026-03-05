'use client';
import React from 'react';
import { useThemeSync } from '@/shared/hooks/useThemeSync';
import { useUIStore } from '@/shared/stores/ui.store';
import { useKeyboardShortcuts } from '@/shared/components/layout/keyboard/useKeyboardShortcuts';
import { KeyboardShortcuts } from '@/shared/components/layout/keyboard/KeyboardShortcuts';

function ThemeSyncInner({ children }: { children: React.ReactNode }) {
  useThemeSync();
  useKeyboardShortcuts();

  const { fontFamily, fontWeight, fontSize, zoom } = useUIStore();

  return (
    <div
      style={{
        fontFamily,
        fontWeight: fontWeight === 'bold' ? 700 : 400,
        fontSize: `${fontSize}px`,
        zoom: `${zoom / 100}`,
        minHeight: '100vh',
      }}
    >
      {children}
      <KeyboardShortcuts />
    </div>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeSyncInner>{children}</ThemeSyncInner>;
}
