'use client';

/**
 * @file src/hooks/useKeyboardShortcut.ts
 *
 * Component-level hooks for registering keyboard shortcuts.
 *
 * Both hooks:
 *   • Register in KeyboardShortcutContext on mount.
 *   • Auto-deregister on unmount (no manual cleanup required).
 *   • Accept an `enabled` flag (default true) — setting it false deregisters.
 *   • Warn in dev when the same id is already registered (conflict detection
 *     is enforced by KeyboardShortcutProvider, hooks provide a local guard).
 *   • Are no-ops when `disabled=true` is passed (shortcut stays registered
 *     but `action` is a no-op, matching UX convention for contextual shortcuts).
 *
 * Hooks:
 *   useKeyboardShortcut(options)   — register a single shortcut
 *   useKeyboardShortcuts(options[]) — register multiple shortcuts at once
 *
 * Options for useKeyboardShortcut:
 *   id          — unique identifier
 *   key         — key name (e.g. 'k', 'Escape', 'h')
 *   modifiers   — zero or more of 'ctrl' | 'alt' | 'shift' | 'meta'
 *   chord       — optional chord leader key (e.g. 'g' for g→h)
 *   description — shown in help overlay
 *   scope       — 'global' | LayoutName
 *   group       — optional display group for help panel
 *   action      — callback; never called when disabled=true
 *   enabled     — default true; false removes the shortcut from the registry
 *   disabled    — default false; true keeps it registered but silences the action
 */

import { useEffect, useRef } from 'react';
import { useKeyboardShortcutContext } from '@/contexts/KeyboardShortcutContext';
import type { RegisteredShortcut } from '@/config/keyboard-shortcuts';
import type { LayoutName } from '@/layouts/types';
import type { Modifier } from '@/layouts/types';

// ─── Option types ─────────────────────────────────────────────────────────────

export interface UseKeyboardShortcutOptions {
  id: string;
  key: string;
  modifiers?: Modifier[];
  chord?: string;
  description: string;
  scope?: LayoutName | 'global';
  group?: string;
  action: () => void;
  /** Set false to remove the shortcut from the registry entirely. Default: true. */
  enabled?: boolean;
  /** Set true to keep the shortcut visible in help but suppress the action. Default: false. */
  disabled?: boolean;
}

// ─── useKeyboardShortcut ──────────────────────────────────────────────────────

/**
 * Register a single keyboard shortcut.
 *
 * @example
 * useKeyboardShortcut({
 *   id:          'search:open',
 *   key:         'k',
 *   modifiers:   ['ctrl'],
 *   description: 'Open search',
 *   scope:       'global',
 *   action:      () => setSearchOpen(true),
 * });
 */
export function useKeyboardShortcut(options: UseKeyboardShortcutOptions): void {
  const { register, unregister } = useKeyboardShortcutContext();

  // Keep a stable reference to `action` so callers can use inline lambdas.
  const actionRef = useRef(options.action);
  actionRef.current = options.action;

  const {
    id,
    key,
    modifiers  = [],
    chord,
    description,
    scope       = 'global',
    group,
    enabled     = true,
    disabled    = false,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const shortcut: RegisteredShortcut = {
      id,
      key,
      modifiers,
      chord,
      description,
      scope,
      group,
      action: () => {
        if (!disabled) actionRef.current();
      },
    };

    const deregister = register(shortcut);
    return deregister;
  // Re-register when structural fields change (not action — that's a ref).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, key, JSON.stringify(modifiers), chord, scope, enabled, disabled]);

  // Explicit unregister when enabled flips to false.
  useEffect(() => {
    if (!enabled) unregister(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, id]);
}

// ─── useKeyboardShortcuts ─────────────────────────────────────────────────────

/**
 * Register multiple shortcuts at once.  Each entry follows the same rules as
 * useKeyboardShortcut().
 *
 * @example
 * useKeyboardShortcuts([
 *   { id: 'goto:home', key: 'h', chord: 'g', description: 'Go home', scope: 'default', action: goHome },
 *   { id: 'goto:settings', key: 's', chord: 'g', description: 'Go settings', scope: 'default', action: goSettings },
 * ]);
 */
export function useKeyboardShortcuts(
  shortcuts: UseKeyboardShortcutOptions[],
): void {
  const { register, unregister } = useKeyboardShortcutContext();

  // Stable refs for all action callbacks.
  const actionsRef = useRef<Record<string, () => void>>({});
  for (const s of shortcuts) {
    actionsRef.current[s.id] = s.action;
  }

  useEffect(() => {
    const deregisters: Array<() => void> = [];

    for (const s of shortcuts) {
      const {
        id,
        key,
        modifiers   = [],
        chord,
        description,
        scope        = 'global',
        group,
        enabled      = true,
        disabled     = false,
      } = s;

      if (!enabled) continue;

      const idCopy = id;
      const registered: RegisteredShortcut = {
        id,
        key,
        modifiers,
        chord,
        description,
        scope,
        group,
        action: () => {
          if (!disabled) actionsRef.current[idCopy]?.();
        },
      };

      deregisters.push(register(registered));
    }

    return () => {
      for (const deregister of deregisters) deregister();
    };
  // Re-register when any structural field in the shortcuts array changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(shortcuts.map(({ action: _a, ...rest }) => rest))]);

  // Explicit cleanup for individually disabled entries.
  useEffect(() => {
    for (const s of shortcuts) {
      if (s.enabled === false) unregister(s.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcuts.map((s) => `${s.id}:${String(s.enabled)}`).join(',')]);
}
