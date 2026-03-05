'use client';

import { useEffect } from 'react';

import type { LayoutProps } from '../types';
import { MinimalHeader } from './MinimalHeader';
import { MinimalProgress } from './MinimalProgress';
import { applyMinimalTheme } from './theme';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MinimalLayoutProps extends LayoutProps {
  /** Header title — displayed centred in the header bar. */
  title?: string;
  /** Show the back button in the header. Defaults to true. */
  showBack?: boolean;
  /**
   * Back-button callback. If omitted the header calls `router.back()`.
   * Pass `() => {}` to disable navigation while keeping the button visible.
   */
  onBack?: () => void;
  /** Accessible label for the back button. Defaults to "Go back". */
  backLabel?: string;
  /** Current step (1-based). Enables the progress bar when totalSteps ≥ 2. */
  step?: number;
  /** Total number of steps. Progress bar renders when totalSteps ≥ 2. */
  totalSteps?: number;
  /** Optional label for each step rendered beneath the progress track. */
  stepLabels?: string[];
}

// ─── MinimalLayout ────────────────────────────────────────────────────────────

/**
 * Minimal Layout Shell
 *
 * Structure:
 *   <header>   ← back button + centred title only (no nav, no sidebar)
 *   [progress] ← segmented step indicator (only when totalSteps ≥ 2)
 *   <main>     ← narrow centred content well (max-width: --tos-min-content-max-width)
 *
 * Keyboard:
 *   Escape        → fires onBack (unless the focused element is a text input)
 *   Alt+ArrowLeft → same (browser-native back gesture)
 *
 * Use cases: checkout, onboarding wizards, account setup, config wizards.
 */
export function MinimalLayout({
  children,
  title,
  showBack = true,
  onBack,
  backLabel,
  step,
  totalSteps,
  stepLabels,
}: MinimalLayoutProps) {
  const showProgress =
    typeof step === 'number' &&
    typeof totalSteps === 'number' &&
    totalSteps >= 2;

  // Apply minimal CSS tokens once on mount
  useEffect(() => {
    applyMinimalTheme();
  }, []);

  // Escape + Alt+← → go back (skip when typing)
  useEffect(() => {
    if (!showBack || !onBack) return;

    const handler = (e: globalThis.KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) return;

      const isEscape   = e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.metaKey;
      const isAltLeft  = e.key === 'ArrowLeft' && e.altKey && !e.ctrlKey && !e.metaKey;

      if (isEscape || isAltLeft) {
        e.preventDefault();
        onBack();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showBack, onBack]);

  return (
    <div
      className="tos-min-layout"
      data-layout="minimal"
      data-testid="minimal-layout"
    >
      <MinimalHeader
        title={title}
        showBack={showBack}
        onBack={onBack}
        backLabel={backLabel}
      />

      {showProgress && (
        <MinimalProgress
          step={step!}
          totalSteps={totalSteps!}
          labels={stepLabels}
          data-testid="minimal-progress"
        />
      )}

      <main
        id="minimal-main"
        className="tos-min-content"
        tabIndex={-1}
        aria-label={title ?? 'Main content'}
        data-testid="minimal-main"
      >
        {children}
      </main>
    </div>
  );
}
