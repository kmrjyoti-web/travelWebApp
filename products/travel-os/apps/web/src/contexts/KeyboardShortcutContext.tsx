'use client';

/**
 * @file src/contexts/KeyboardShortcutContext.tsx
 *
 * React context for the keyboard shortcut system.
 *
 * useKeyboardShortcutContext() returns:
 *   shortcuts       — all currently registered shortcuts (Map<id, RegisteredShortcut>)
 *   register()      — add a shortcut; returns a deregister function
 *   unregister()    — remove a shortcut by id
 *   isHelpOpen      — whether the shortcuts help overlay is visible
 *   toggleHelp()    — toggle the help overlay
 *   openHelp()      — open the help overlay
 *   closeHelp()     — close the help overlay
 *   activeChord     — the currently pending chord leader key (or null)
 *   scope           — the current layout scope (controls which shortcuts fire)
 *   setScope()      — update the current scope (called by layout providers)
 */

import { createContext, useContext } from 'react';
import type { RegisteredShortcut } from '@/config/keyboard-shortcuts';
import type { LayoutName } from '@/layouts/types';

// ─── Context value shape ──────────────────────────────────────────────────────

export interface KeyboardShortcutContextValue {
  /** All currently registered shortcuts, keyed by id. */
  shortcuts: Map<string, RegisteredShortcut>;

  /**
   * Register a shortcut.  Returns a cleanup function that unregisters it.
   * Logs a warning in dev when a conflicting trigger already exists.
   */
  register(shortcut: RegisteredShortcut): () => void;

  /** Remove a shortcut by its id. No-ops if not found. */
  unregister(id: string): void;

  /** Whether the help overlay is currently open. */
  isHelpOpen: boolean;
  toggleHelp(): void;
  openHelp(): void;
  closeHelp(): void;

  /**
   * Current pending chord leader key (e.g. 'g' while waiting for 'h' or 's').
   * null when no chord sequence is in progress.
   */
  activeChord: string | null;

  /** Active layout scope — shortcuts whose scope matches (or is 'global') fire. */
  scope: LayoutName | 'global';
  setScope(scope: LayoutName | 'global'): void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const KeyboardShortcutContext =
  createContext<KeyboardShortcutContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the keyboard shortcut context.
 * Must be rendered inside <KeyboardShortcutProvider>.
 */
export function useKeyboardShortcutContext(): KeyboardShortcutContextValue {
  const ctx = useContext(KeyboardShortcutContext);
  if (!ctx) {
    throw new Error(
      'useKeyboardShortcutContext must be used inside <KeyboardShortcutProvider>',
    );
  }
  return ctx;
}
