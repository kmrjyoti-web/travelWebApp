import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import {
  KeyboardShortcutContext,
  useKeyboardShortcutContext,
  type KeyboardShortcutContextValue,
} from './KeyboardShortcutContext';
import type { RegisteredShortcut } from '@/config/keyboard-shortcuts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_SHORTCUT: RegisteredShortcut = {
  id:          'test:shortcut',
  key:         'k',
  modifiers:   ['ctrl'],
  description: 'Test shortcut',
  scope:       'global',
  action:      vi.fn(),
};

const MOCK_VALUE: KeyboardShortcutContextValue = {
  shortcuts:   new Map([['test:shortcut', MOCK_SHORTCUT]]),
  register:    vi.fn(() => vi.fn()),
  unregister:  vi.fn(),
  isHelpOpen:  false,
  toggleHelp:  vi.fn(),
  openHelp:    vi.fn(),
  closeHelp:   vi.fn(),
  activeChord: null,
  scope:       'global',
  setScope:    vi.fn(),
};

function makeWrapper(value: KeyboardShortcutContextValue) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <KeyboardShortcutContext.Provider value={value}>
        {children}
      </KeyboardShortcutContext.Provider>
    );
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useKeyboardShortcutContext', () => {
  it('throws when used outside KeyboardShortcutProvider', () => {
    expect(() => renderHook(() => useKeyboardShortcutContext())).toThrow(
      'useKeyboardShortcutContext must be used inside <KeyboardShortcutProvider>',
    );
  });

  it('returns context value when inside provider', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(result.current.shortcuts).toBe(MOCK_VALUE.shortcuts);
    expect(result.current.isHelpOpen).toBe(false);
    expect(result.current.scope).toBe('global');
    expect(result.current.activeChord).toBeNull();
  });

  it('exposes register function', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(typeof result.current.register).toBe('function');
  });

  it('exposes unregister function', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(typeof result.current.unregister).toBe('function');
  });

  it('exposes toggleHelp / openHelp / closeHelp', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(typeof result.current.toggleHelp).toBe('function');
    expect(typeof result.current.openHelp).toBe('function');
    expect(typeof result.current.closeHelp).toBe('function');
  });

  it('exposes setScope function', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(typeof result.current.setScope).toBe('function');
  });

  it('reflects isHelpOpen=true from context', () => {
    const openValue: KeyboardShortcutContextValue = { ...MOCK_VALUE, isHelpOpen: true };
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(openValue),
    });
    expect(result.current.isHelpOpen).toBe(true);
  });

  it('reflects activeChord from context', () => {
    const chordValue: KeyboardShortcutContextValue = { ...MOCK_VALUE, activeChord: 'g' };
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(chordValue),
    });
    expect(result.current.activeChord).toBe('g');
  });

  it('reflects scope=default from context', () => {
    const scopedValue: KeyboardShortcutContextValue = { ...MOCK_VALUE, scope: 'default' };
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(scopedValue),
    });
    expect(result.current.scope).toBe('default');
  });

  it('shortcuts Map contains the registered shortcut', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), {
      wrapper: makeWrapper(MOCK_VALUE),
    });
    expect(result.current.shortcuts.has('test:shortcut')).toBe(true);
  });
});
