import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, renderHook, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { KeyboardShortcutProvider } from './KeyboardShortcutProvider';
import { useKeyboardShortcutContext } from '@/contexts/KeyboardShortcutContext';
import { TOS_SEARCH_OPEN, TOS_HELP_OPEN, TOS_SHORTCUT_USED } from '@/config/keyboard-shortcuts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Wrapper({ children }: { children: React.ReactNode }) {
  return <KeyboardShortcutProvider>{children}</KeyboardShortcutProvider>;
}

function fireKey(
  key: string,
  opts: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean; metaKey?: boolean } = {},
  target: EventTarget = document,
) {
  fireEvent.keyDown(target as Element, { key, ...opts });
}

// ─── Register / unregister ────────────────────────────────────────────────────

describe('KeyboardShortcutProvider — register/unregister', () => {
  it('registers a shortcut and stores it in the map', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:one',
        key:         'k',
        modifiers:   ['ctrl'],
        description: 'Test',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    expect(result.current.shortcuts.has('test:one')).toBe(true);
  });

  it('deregister removes the shortcut', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    let deregister!: () => void;
    act(() => {
      deregister = result.current.register({
        id:          'test:two',
        key:         'j',
        modifiers:   [],
        description: 'Test two',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { deregister(); });
    expect(result.current.shortcuts.has('test:two')).toBe(false);
  });

  it('unregister(id) also removes a shortcut', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:three',
        key:         'q',
        modifiers:   [],
        description: 'Test',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { result.current.unregister('test:three'); });
    expect(result.current.shortcuts.has('test:three')).toBe(false);
  });
});

// ─── Help overlay ─────────────────────────────────────────────────────────────

describe('KeyboardShortcutProvider — help overlay', () => {
  it('isHelpOpen is false by default', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });
    expect(result.current.isHelpOpen).toBe(false);
  });

  it('openHelp sets isHelpOpen=true', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });
    act(() => { result.current.openHelp(); });
    expect(result.current.isHelpOpen).toBe(true);
  });

  it('closeHelp sets isHelpOpen=false', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });
    act(() => { result.current.openHelp(); });
    act(() => { result.current.closeHelp(); });
    expect(result.current.isHelpOpen).toBe(false);
  });

  it('toggleHelp flips isHelpOpen', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });
    act(() => { result.current.toggleHelp(); });
    expect(result.current.isHelpOpen).toBe(true);
    act(() => { result.current.toggleHelp(); });
    expect(result.current.isHelpOpen).toBe(false);
  });
});

// ─── Scope ────────────────────────────────────────────────────────────────────

describe('KeyboardShortcutProvider — scope', () => {
  it('default scope is "global"', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });
    expect(result.current.scope).toBe('global');
  });

  it('setScope updates scope', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });
    act(() => { result.current.setScope('default'); });
    expect(result.current.scope).toBe('default');
  });
});

// ─── Keydown handling ─────────────────────────────────────────────────────────

describe('KeyboardShortcutProvider — keydown handling', () => {
  it('fires action for matching shortcut', async () => {
    const action = vi.fn();
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:action',
        key:         'k',
        modifiers:   ['ctrl'],
        description: 'Test',
        scope:       'global',
        action,
      });
    });

    act(() => { fireKey('k', { ctrlKey: true }); });
    expect(action).toHaveBeenCalledOnce();
  });

  it('does NOT fire action for wrong modifiers', () => {
    const action = vi.fn();
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:mod',
        key:         'k',
        modifiers:   ['ctrl'],
        description: 'Test',
        scope:       'global',
        action,
      });
    });

    act(() => { fireKey('k'); }); // no ctrl
    expect(action).not.toHaveBeenCalled();
  });

  it('does NOT fire action when scope mismatches', () => {
    const action = vi.fn();
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:scope',
        key:         'z',
        modifiers:   [],
        description: 'Test',
        scope:       'default',  // not 'global'
        action,
      });
    });

    // scope is 'global', shortcut is 'default' — should NOT fire
    act(() => { fireKey('z'); });
    expect(action).not.toHaveBeenCalled();
  });

  it('fires default-scope action when scope=default is set', () => {
    const action = vi.fn();
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.setScope('default');
      result.current.register({
        id:          'test:default-scope',
        key:         'z',
        modifiers:   [],
        description: 'Test',
        scope:       'default',
        action,
      });
    });

    act(() => { fireKey('z'); });
    expect(action).toHaveBeenCalled();
  });

  it('suppresses keydown events from input elements', () => {
    const action = vi.fn();
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:input-guard',
        key:         'k',
        modifiers:   ['ctrl'],
        description: 'Test',
        scope:       'global',
        action,
      });
    });

    // Simulate keydown from an INPUT element
    const input = document.createElement('input');
    document.body.appendChild(input);
    act(() => { fireKey('k', { ctrlKey: true }, input); });
    document.body.removeChild(input);

    expect(action).not.toHaveBeenCalled();
  });

  it('allows Escape through even from input elements', () => {
    const action = vi.fn();
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:escape',
        key:         'Escape',
        modifiers:   [],
        description: 'Close',
        scope:       'global',
        action,
      });
    });

    const input = document.createElement('input');
    document.body.appendChild(input);
    act(() => { fireKey('Escape', {}, input); });
    document.body.removeChild(input);

    expect(action).toHaveBeenCalledOnce();
  });
});

// ─── Chord handling ───────────────────────────────────────────────────────────

describe('KeyboardShortcutProvider — chord handling', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('fires chord shortcut on g then h', async () => {
    const action = vi.fn();
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:chord-home',
        key:         'h',
        modifiers:   [],
        chord:       'g',
        description: 'Go home',
        scope:       'global',
        action,
      });
    });

    act(() => { fireKey('g'); });       // chord leader
    act(() => { fireKey('h'); });       // chord key
    expect(action).toHaveBeenCalledOnce();
  });

  it('sets activeChord to "g" after pressing g', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:chord-s',
        key:         's',
        modifiers:   [],
        chord:       'g',
        description: 'Go settings',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { fireKey('g'); });
    expect(result.current.activeChord).toBe('g');
  });

  it('clears activeChord after chord completes', () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:chord-clear',
        key:         's',
        modifiers:   [],
        chord:       'g',
        description: 'Test',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { fireKey('g'); });
    act(() => { fireKey('s'); });
    expect(result.current.activeChord).toBeNull();
  });

  it('clears activeChord after CHORD_TIMEOUT_MS', async () => {
    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:chord-timeout',
        key:         'h',
        modifiers:   [],
        chord:       'g',
        description: 'Test',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { fireKey('g'); });
    expect(result.current.activeChord).toBe('g');

    act(() => { vi.advanceTimersByTime(2500); });
    expect(result.current.activeChord).toBeNull();
  });
});

// ─── Analytics events ─────────────────────────────────────────────────────────

describe('KeyboardShortcutProvider — analytics DOM events', () => {
  it('dispatches TOS_SHORTCUT_USED on action fire', () => {
    const listener = vi.fn();
    document.addEventListener(TOS_SHORTCUT_USED, listener);

    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'test:analytics',
        key:         'x',
        modifiers:   ['ctrl'],
        description: 'Test',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { fireKey('x', { ctrlKey: true }); });
    expect(listener).toHaveBeenCalledOnce();

    document.removeEventListener(TOS_SHORTCUT_USED, listener);
  });

  it('dispatches TOS_SEARCH_OPEN for Ctrl+K via built-in action', () => {
    const listener = vi.fn();
    document.addEventListener(TOS_SEARCH_OPEN, listener);

    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'global:search',
        key:         'k',
        modifiers:   ['ctrl'],
        description: 'Open search',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { fireKey('k', { ctrlKey: true }); });
    expect(listener).toHaveBeenCalledOnce();

    document.removeEventListener(TOS_SEARCH_OPEN, listener);
  });

  it('dispatches TOS_HELP_OPEN for Ctrl+/ built-in action', () => {
    const listener = vi.fn();
    document.addEventListener(TOS_HELP_OPEN, listener);

    const { result } = renderHook(() => useKeyboardShortcutContext(), { wrapper: Wrapper });

    act(() => {
      result.current.register({
        id:          'global:help-slash',
        key:         '/',
        modifiers:   ['ctrl'],
        description: 'Open help',
        scope:       'global',
        action:      vi.fn(),
      });
    });

    act(() => { fireKey('/', { ctrlKey: true }); });
    expect(listener).toHaveBeenCalledOnce();

    document.removeEventListener(TOS_HELP_OPEN, listener);
  });
});
