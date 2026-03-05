'use client';

import type { MouseEventHandler } from 'react';
import { useRouter } from 'next/navigation';

import { Icon } from '@/components/icons/Icon';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MinimalHeaderProps {
  /** Page / step title displayed centred in the header bar. */
  title?: string;
  /** Show the back button. Defaults to true. */
  showBack?: boolean;
  /**
   * Called when the back button is clicked.
   * If omitted the component calls `router.back()`.
   */
  onBack?: () => void;
  /** Accessible label for the back button. Defaults to "Go back". */
  backLabel?: string;
}

// ─── MinimalHeader ────────────────────────────────────────────────────────────

/**
 * Stripped-back header for focused flows.
 *
 * Layout:
 *   [← Back]        [Page Title]        (empty right cell for symmetry)
 *
 * No navigation links, no notifications, no user menu.
 * Skip link to #minimal-main is always present.
 */
export function MinimalHeader({
  title,
  showBack = true,
  onBack,
  backLabel = 'Go back',
}: MinimalHeaderProps) {
  const router = useRouter();

  const handleBack: MouseEventHandler<HTMLButtonElement> = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className="tos-min-header"
      role="banner"
      aria-label="Minimal layout header"
      data-testid="minimal-header"
    >
      {/* Skip to main */}
      <a
        href="#minimal-main"
        className="tos-min-skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>

      <div className="tos-min-header__inner">

        {/* Left: back button */}
        <div className="tos-min-header__left">
          {showBack && (
            <button
              type="button"
              className="tos-min-header__back-btn"
              aria-label={backLabel}
              data-testid="minimal-back-btn"
              onClick={handleBack}
            >
              <Icon name="ArrowLeft" size={16} aria-hidden />
              <span className="tos-min-header__back-label">Back</span>
            </button>
          )}
        </div>

        {/* Centre: page title */}
        <div className="tos-min-header__centre">
          {title && (
            <h1
              className="tos-min-header__title"
              data-testid="minimal-header-title"
            >
              {title}
            </h1>
          )}
        </div>

        {/* Right: reserved for symmetry */}
        <div className="tos-min-header__right" aria-hidden="true" />
      </div>
    </header>
  );
}
