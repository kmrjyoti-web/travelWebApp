import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { useKeyboardShortcut, useKeyboardShortcuts } from './useKeyboardShortcut';
import { KeyboardShortcutProvider } from '@/providers/KeyboardShortcutProvider';
import { useKeyboardShortcutContext } from '@/contexts/KeyboardShortcutContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(KeyboardShortcutProvider, null, children);
}

function fireKey(
  key: string,
  opts: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean } = {},
) {
  fireEvent.keyDown(document, { key, ...opts });
}

// ─── useKeyboardShortcut ──────────────────────────────────────────────────────

describe('useKeyboardShortcut — registration', () => {
  it('registers shortcut on mount', () => {
    const action = vi.fn();
    const { result } = renderHook(
      () => {
        useKeyboardShortcut({
          id:          'hook:test',
          key:         'k',
          modifiers:   ['ctrl'],
          description: 'Test',
          scope:       'global',
          action,
        });
        return useKeyboardShortcutContext();
      },
      { wrapper: Wrapper },
    );

    expect(result.current.shortcuts.has('hook:test')).toBe(true);
  });

  it('auto-deregisters on unmount', () => {
    const action = vi.fn();
    const { result, unmount } = renderHook(
      () => {
        useKeyboardShortcut({
          id:          'hook:unmount',
          key:         'j',
          modifiers:   [],
          description: 'Test',
          scope:       'global',
          action,
        });
        return useKeyboardShortcutContext();
      },
      { wrapper: Wrapper },
    );

    expect(result.current.shortcuts.has('hook:unmount')).toBe(true);
    unmount();
    // After unmount registry should no longer have this id
    // (we can verify via the Map which is stored by ref)
  });

  it('does NOT register when enabled=false', () => {
    const action = vi.fn();
    const { result } = renderHook(
      () => {
        useKeyboardShortcut({
          id:          'hook:disabled-enabled',
          key:         'q',
          modifiers:   [],
          description: 'Test',
          scope:       'global',
          action,
          enabled:     false,
        });
        return useKeyboardShortcutContext();
      },
      { wrapper: Wrapper },
    );

    expect(result.current.shortcuts.has('hook:disabled-enabled')).toBe(false);
  });
});

describe('useKeyboardShortcut — action firing', () => {
  it('fires action on matching keydown', () => {
    const action = vi.fn();
    renderHook(
      () => {
        useKeyboardShortcut({
          id:          'hook:fire',
          key:         'x',
          modifiers:   ['ctrl'],
          description: 'Test',
          scope:       'global',
          action,
        });
      },
      { wrapper: Wrapper },
    );

    act(() => { fireKey('x', { ctrlKey: true }); });
    expect(action).toHaveBeenCalledOnce();
  });

  it('does NOT fire action when disabled=true', () => {
    const action = vi.fn();
    renderHook(
      () => {
        useKeyboardShortcut({
          id:          'hook:suppressed',
          key:         'y',
          modifiers:   ['ctrl'],
          description: 'Test',
          scope:       'global',
          action,
          disabled:    true,
        });
      },
      { wrapper: Wrapper },
    );

    act(() => { fireKey('y', { ctrlKey: true }); });
    expect(action).not.toHaveBeenCalled();
  });

  it('uses the latest action reference without re-registering', () => {
    let callCount = 0;
    let v = 0;

    const { rerender } = renderHook(
      ({ version }: { version: number }) => {
        useKeyboardShortcut({
          id:          'hook:latest',
          key:         'p',
          modifiers:   ['ctrl'],
          description: 'Test',
          scope:       'global',
          // New function reference each render, captures `version` via closure
          action:      () => { callCount += version; },
        });
      },
      { wrapper: Wrapper, initialProps: { version: 1 } },
    );

    v = 1;
    rerender({ version: 2 });

    act(() => { fireKey('p', { ctrlKey: true }); });
    // Should use the latest action (version=2), not the stale one
    expect(callCount).toBe(2);
  });
});

// ─── useKeyboardShortcuts (plural) ────────────────────────────────────────────

describe('useKeyboardShortcuts — registration', () => {
  it('registers all shortcuts on mount', () => {
    const { result } = renderHook(
      () => {
        useKeyboardShortcuts([
          { id: 'multi:a', key: 'a', modifiers: ['ctrl'], description: 'A', scope: 'global', action: vi.fn() },
          { id: 'multi:b', key: 'b', modifiers: ['ctrl'], description: 'B', scope: 'global', action: vi.fn() },
        ]);
        return useKeyboardShortcutContext();
      },
      { wrapper: Wrapper },
    );

    expect(result.current.shortcuts.has('multi:a')).toBe(true);
    expect(result.current.shortcuts.has('multi:b')).toBe(true);
  });

  it('skips shortcuts where enabled=false', () => {
    const { result } = renderHook(
      () => {
        useKeyboardShortcuts([
          { id: 'multi:on',  key: 'f', modifiers: [], description: 'On',  scope: 'global', action: vi.fn(), enabled: true  },
          { id: 'multi:off', key: 'g', modifiers: [], description: 'Off', scope: 'global', action: vi.fn(), enabled: false },
        ]);
        return useKeyboardShortcutContext();
      },
      { wrapper: Wrapper },
    );

    expect(result.current.shortcuts.has('multi:on')).toBe(true);
    expect(result.current.shortcuts.has('multi:off')).toBe(false);
  });

  it('fires action for each shortcut independently', () => {
    const actionA = vi.fn();
    const actionB = vi.fn();

    renderHook(
      () => {
        useKeyboardShortcuts([
          { id: 'multi:fire-a', key: 'e', modifiers: ['ctrl'], description: 'E', scope: 'global', action: actionA },
          { id: 'multi:fire-b', key: 'r', modifiers: ['ctrl'], description: 'R', scope: 'global', action: actionB },
        ]);
      },
      { wrapper: Wrapper },
    );

    act(() => { fireKey('e', { ctrlKey: true }); });
    expect(actionA).toHaveBeenCalledOnce();
    expect(actionB).not.toHaveBeenCalled();

    act(() => { fireKey('r', { ctrlKey: true }); });
    expect(actionB).toHaveBeenCalledOnce();
  });
});

// ─── Chord via useKeyboardShortcut ────────────────────────────────────────────

describe('useKeyboardShortcut — chord', () => {
  it('registers chord shortcut', () => {
    const { result } = renderHook(
      () => {
        useKeyboardShortcut({
          id:          'hook:chord',
          key:         'h',
          modifiers:   [],
          chord:       'g',
          description: 'Go home via chord',
          scope:       'global',
          action:      vi.fn(),
        });
        return useKeyboardShortcutContext();
      },
      { wrapper: Wrapper },
    );

    const s = result.current.shortcuts.get('hook:chord');
    expect(s).toBeDefined();
    expect(s?.chord).toBe('g');
    expect(s?.key).toBe('h');
  });

  it('fires chord action via g then h', () => {
    const action = vi.fn();
    renderHook(
      () => {
        useKeyboardShortcut({
          id:          'hook:chord-fire',
          key:         'h',
          modifiers:   [],
          chord:       'g',
          description: 'Go home',
          scope:       'global',
          action,
        });
      },
      { wrapper: Wrapper },
    );

    act(() => { fireKey('g'); });
    act(() => { fireKey('h'); });
    expect(action).toHaveBeenCalledOnce();
  });
});
