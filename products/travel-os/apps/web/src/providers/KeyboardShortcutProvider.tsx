'use client';

/**
 * @file src/providers/KeyboardShortcutProvider.tsx
 *
 * Global keyboard shortcut provider for TravelOS.
 *
 * Responsibilities:
 *   1. Attach a single keydown listener on document.
 *   2. Skip events originating from input / textarea / select /
 *      contenteditable elements — except Escape (always fires).
 *   3. Run a chord finite-state machine: pressing a chord leader key (e.g. 'g')
 *      starts a CHORD_TIMEOUT_MS window; a matching second key completes the chord.
 *   4. Match the event against registered shortcuts filtered by current scope.
 *   5. Execute the matched shortcut's action.
 *   6. Fire TOS_SHORTCUT_USED CustomEvent on document for analytics.
 *   7. For built-in global shortcuts (search, help) also fire TOS_SEARCH_OPEN /
 *      TOS_HELP_OPEN so layout-specific consumers can react without needing the
 *      context directly.
 *   8. Manage a shortcut registry (Map) and expose register/unregister via context.
 *   9. Manage isHelpOpen state and toggleHelp/openHelp/closeHelp actions.
 *
 * Props:
 *   children       — React subtree
 *   initialScope   — starting scope; defaults to 'global'
 *   analyticsEnabled — fire TOS_SHORTCUT_USED; defaults to true
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  KeyboardShortcutContext,
  type KeyboardShortcutContextValue,
} from '@/contexts/KeyboardShortcutContext';
import {
  CHORD_TIMEOUT_MS,
  TOS_SEARCH_OPEN,
  TOS_HELP_OPEN,
  TOS_SHORTCUT_USED,
  shortcutKey,
  type RegisteredShortcut,
  type ShortcutUsedDetail,
} from '@/config/keyboard-shortcuts';
import type { LayoutName } from '@/layouts/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when the event target is an interactive text input
 * where regular keystrokes should NOT be intercepted.
 */
function isInputTarget(e: KeyboardEvent): boolean {
  const t = e.target;
  if (!t || !(t instanceof Element)) return false;
  const tag = t.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (t.getAttribute('contenteditable') === 'true') return true;
  return false;
}

function dispatchDom(name: string, detail?: unknown): void {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new CustomEvent(name, { detail, bubbles: false }));
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface KeyboardShortcutProviderProps {
  children: ReactNode;
  initialScope?: LayoutName | 'global';
  analyticsEnabled?: boolean;
}

export function KeyboardShortcutProvider({
  children,
  initialScope     = 'global',
  analyticsEnabled = true,
}: KeyboardShortcutProviderProps) {
  // ── Registry ───────────────────────────────────────────────────────────────
  // Use a ref so the keydown handler always sees current registrations without
  // needing to re-attach the event listener on every register/unregister call.
  const registryRef = useRef<Map<string, RegisteredShortcut>>(new Map());
  // Mirror into state so context consumers re-render when shortcuts change.
  const [, forceUpdate] = useState(0);

  // ── Help overlay ───────────────────────────────────────────────────────────
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // ── Chord state machine ────────────────────────────────────────────────────
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const chordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Scope ──────────────────────────────────────────────────────────────────
  const [scope, setScope] = useState<LayoutName | 'global'>(initialScope);

  // ── Registry helpers ───────────────────────────────────────────────────────

  const register = useCallback((shortcut: RegisteredShortcut): (() => void) => {
    const registry = registryRef.current;

    // Conflict detection (dev only)
    if (process.env.NODE_ENV !== 'production') {
      const fingerprint = shortcutKey(shortcut);
      for (const [existingId, existing] of registry) {
        if (existingId !== shortcut.id && shortcutKey(existing) === fingerprint) {
          console.warn(
            `[KeyboardShortcutProvider] Conflict: "${shortcut.id}" and "${existingId}" ` +
            `share the same trigger (${fingerprint}).`,
          );
        }
      }
    }

    registry.set(shortcut.id, shortcut);
    forceUpdate((n) => n + 1);

    return () => {
      registry.delete(shortcut.id);
      forceUpdate((n) => n + 1);
    };
  }, []);

  const unregister = useCallback((id: string): void => {
    if (registryRef.current.delete(id)) {
      forceUpdate((n) => n + 1);
    }
  }, []);

  // ── Help overlay actions ───────────────────────────────────────────────────

  const openHelp   = useCallback(() => setIsHelpOpen(true), []);
  const closeHelp  = useCallback(() => setIsHelpOpen(false), []);
  const toggleHelp = useCallback(() => setIsHelpOpen((v) => !v), []);

  // ── Chord timeout cleanup ──────────────────────────────────────────────────

  function clearChord() {
    if (chordTimerRef.current !== null) {
      clearTimeout(chordTimerRef.current);
      chordTimerRef.current = null;
    }
    setActiveChord(null);
  }

  function startChord(leader: string) {
    clearChord();
    setActiveChord(leader);
    chordTimerRef.current = setTimeout(() => {
      setActiveChord(null);
      chordTimerRef.current = null;
    }, CHORD_TIMEOUT_MS);
  }

  // ── Shortcut matching ──────────────────────────────────────────────────────

  function modifiersMatch(e: KeyboardEvent, modifiers: readonly string[]): boolean {
    const needs = new Set(modifiers);
    if (needs.has('ctrl')  !== e.ctrlKey)  return false;
    if (needs.has('alt')   !== e.altKey)   return false;
    if (needs.has('shift') !== e.shiftKey) return false;
    if (needs.has('meta')  !== e.metaKey)  return false;
    return true;
  }

  function scopeMatches(shortcutScope: string): boolean {
    return shortcutScope === 'global' || shortcutScope === scope;
  }

  // ── Global keydown listener ────────────────────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isInput   = isInputTarget(e);
      const isEscape  = e.key === 'Escape';

      // In input elements only Escape passes through.
      if (isInput && !isEscape) return;

      const registry = registryRef.current;

      // ── Chord completion phase ─────────────────────────────────────────────
      if (activeChord !== null) {
        // Look for a chord shortcut matching (chord=leader, key=pressed).
        let handled = false;
        for (const s of registry.values()) {
          if (
            s.chord === activeChord &&
            s.key   === e.key &&
            modifiersMatch(e, s.modifiers) &&
            scopeMatches(s.scope)
          ) {
            e.preventDefault();
            clearChord();
            fireShortcut(s, e);
            handled = true;
            break;
          }
        }
        if (!handled) {
          // Unrecognised second key — abort chord, fall through to normal check.
          clearChord();
        } else {
          return;
        }
      }

      // ── Normal / chord-leader phase ────────────────────────────────────────
      for (const s of registry.values()) {
        // Skip chord shortcuts — they need the leader first.
        if (s.chord) continue;

        if (
          s.key === e.key &&
          modifiersMatch(e, s.modifiers) &&
          scopeMatches(s.scope)
        ) {
          // Check if this key is a chord leader for any registered shortcut.
          const isLeader = isChordLeader(e.key, registry);

          if (isLeader && s.modifiers.length === 0) {
            // Start chord sequence instead of firing immediately.
            e.preventDefault();
            startChord(e.key);
            return;
          }

          e.preventDefault();
          fireShortcut(s, e);
          return;
        }
      }

      // ── Chord leader detection (no matching non-chord shortcut found) ───────
      if (isChordLeader(e.key, registry) && !isInput && modifiersMatch(e, [])) {
        e.preventDefault();
        startChord(e.key);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, activeChord]);

  // ── Fire shortcut ──────────────────────────────────────────────────────────

  function fireShortcut(s: RegisteredShortcut, _e: KeyboardEvent) {
    s.action();

    // Analytics
    if (analyticsEnabled) {
      const detail: ShortcutUsedDetail = {
        id:        s.id,
        key:       s.key,
        modifiers: s.modifiers,
        chord:     s.chord,
        scope:     s.scope,
      };
      dispatchDom(TOS_SHORTCUT_USED, detail);
    }

    // Well-known global side-effects
    if (s.id === 'global:search') {
      dispatchDom(TOS_SEARCH_OPEN);
    }
    if (s.id === 'global:help-slash' || s.id === 'global:help-question') {
      dispatchDom(TOS_HELP_OPEN);
      openHelp();
    }
    if (s.id === 'global:close') {
      closeHelp();
    }
  }

  // ── Chord leader helper ────────────────────────────────────────────────────

  function isChordLeader(key: string, registry: Map<string, RegisteredShortcut>): boolean {
    for (const s of registry.values()) {
      if (s.chord === key) return true;
    }
    return false;
  }

  // ── Cleanup chord timer on unmount ─────────────────────────────────────────

  useEffect(() => () => { clearChord(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Context value ──────────────────────────────────────────────────────────

  const value: KeyboardShortcutContextValue = {
    shortcuts:   registryRef.current,
    register,
    unregister,
    isHelpOpen,
    toggleHelp,
    openHelp,
    closeHelp,
    activeChord,
    scope,
    setScope,
  };

  return (
    <KeyboardShortcutContext.Provider value={value}>
      {children}
    </KeyboardShortcutContext.Provider>
  );
}
