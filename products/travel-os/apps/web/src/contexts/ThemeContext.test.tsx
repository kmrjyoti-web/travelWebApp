import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeContext, useThemeContext } from './ThemeContext';
import type { ThemeContextValue } from '@/types/theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_VALUE: ThemeContextValue = {
  colorMode:         'light',
  productTheme:      'travel-os',
  resolvedColorMode: 'light',
  isHydrated:        true,
  setColorMode:      () => undefined,
  setProductTheme:   () => undefined,
  toggleColorMode:   () => undefined,
};

function makeWrapper(value: ThemeContextValue) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useThemeContext', () => {
  it('throws when used outside ThemeProvider', () => {
    // renderHook without a wrapper → no context → should throw
    expect(() => {
      renderHook(() => useThemeContext());
    }).toThrow('useThemeContext must be used inside <ThemeProvider>');
  });

  it('returns context value when inside ThemeProvider', () => {
    const { result } = renderHook(() => useThemeContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(result.current.colorMode).toBe('light');
    expect(result.current.productTheme).toBe('travel-os');
    expect(result.current.resolvedColorMode).toBe('light');
    expect(result.current.isHydrated).toBe(true);
  });

  it('exposes setColorMode function', () => {
    const { result } = renderHook(() => useThemeContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(typeof result.current.setColorMode).toBe('function');
  });

  it('exposes setProductTheme function', () => {
    const { result } = renderHook(() => useThemeContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(typeof result.current.setProductTheme).toBe('function');
  });

  it('exposes toggleColorMode function', () => {
    const { result } = renderHook(() => useThemeContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(typeof result.current.toggleColorMode).toBe('function');
  });

  it('reflects dark mode values from context', () => {
    const dark: ThemeContextValue = { ...MOCK_VALUE, colorMode: 'dark', resolvedColorMode: 'dark' };
    const { result } = renderHook(() => useThemeContext(), {
      wrapper: makeWrapper(dark),
    });
    expect(result.current.colorMode).toBe('dark');
    expect(result.current.resolvedColorMode).toBe('dark');
  });

  it('reflects food-os productTheme', () => {
    const food: ThemeContextValue = { ...MOCK_VALUE, productTheme: 'food-os' };
    const { result } = renderHook(() => useThemeContext(), {
      wrapper: makeWrapper(food),
    });
    expect(result.current.productTheme).toBe('food-os');
  });

  it('reflects isHydrated=false when not yet resolved', () => {
    const unhydrated: ThemeContextValue = { ...MOCK_VALUE, isHydrated: false };
    const { result } = renderHook(() => useThemeContext(), {
      wrapper: makeWrapper(unhydrated),
    });
    expect(result.current.isHydrated).toBe(false);
  });
});
