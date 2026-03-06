'use client';

/**
 * Onboarding page — shown immediately after a successful registration for
 * user types that are auto-approved (approvalStatus === 'approved').
 *
 * Reads the logged-in user's type from `/api/v1/user-types/me` and walks the
 * user through a fixed set of onboarding steps.  Each step can be marked as
 * done; progress is persisted in component state (a full persistence layer
 * would be handled by the backend profile API in a later sprint).
 *
 * Styling: --tos-* CSS custom properties only. No Tailwind. No hardcoded colours.
 * Accessibility: WCAG AA — all interactive elements have ARIA labels, keyboard nav.
 * Dark mode: uses [data-coreui-theme='dark'] token overrides automatically via --tos-*.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface OnboardingStep {
  key: string;
  label: string;
  description: string;
  icon: string;
}

interface UserTypeMeResponse {
  success: boolean;
  data: {
    userTypeCode: string;
    displayName: string;
    approvalStatus: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    key: 'profile',
    label: 'Complete Your Profile',
    description: 'Add your name, photo, and contact details.',
    icon: '👤',
  },
  {
    key: 'business_details',
    label: 'Business Details',
    description: 'Tell us about your company or agency.',
    icon: '🏢',
  },
  {
    key: 'website_setup',
    label: 'Website Setup',
    description: 'Configure your white-label travel website.',
    icon: '🌐',
  },
  {
    key: 'kyc_documents',
    label: 'KYC Documents',
    description: 'Upload your identity and business documents.',
    icon: '📄',
  },
  {
    key: 'destinations',
    label: 'Your Destinations',
    description: 'Select the destinations you specialise in.',
    icon: '✈️',
  },
  {
    key: 'social_connect',
    label: 'Social Connect',
    description: 'Link your social media profiles.',
    icon: '📱',
  },
  {
    key: 'bank_details',
    label: 'Bank Details',
    description: 'Add payout account for commissions.',
    icon: '🏦',
  },
  {
    key: 'go_live',
    label: 'Go Live!',
    description: 'Review everything and activate your account.',
    icon: '🚀',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Metadata (cannot be dynamic in a 'use client' file; exported from a separate
// server component normally — left here as a comment for reference)
// export const metadata: Metadata = { title: 'Onboarding | TravelOS' };
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function OnboardingPage(): JSX.Element {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [userTypeLabel, setUserTypeLabel] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch the logged-in user's current user type label
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tos-access-token') : null;
    if (!token) return;
    const fetchUserType = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? ''}/user-types/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'x-product-id': 'travel-os',
            },
          },
        );
        if (!res.ok) return;
        const json = (await res.json()) as UserTypeMeResponse;
        if (json.success) {
          setUserTypeLabel(json.data.displayName);
        }
      } catch {
        // Non-blocking — page works without the label
        setLoadError('Could not load user type. Please refresh.');
      }
    };
    void fetchUserType();
  }, []);

  const toggleStep = useCallback((key: string): void => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const completedCount = completedSteps.size;
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <main
      role="main"
      aria-label="Onboarding wizard"
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'var(--tos-spacing-lg, 2rem)',
        color: 'var(--tos-text-primary, var(--cui-body-color))',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header style={{ marginBottom: 'var(--tos-spacing-lg, 2rem)' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--tos-primary, #1B4F72)',
            marginBottom: '0.25rem',
          }}
        >
          Welcome to TravelOS
          {userTypeLabel ? ` — ${userTypeLabel}` : ''}
        </h1>
        <p style={{ color: 'var(--tos-text-secondary, var(--cui-secondary-color))', margin: 0 }}>
          Complete the steps below to get your account fully set up.
        </p>
        {loadError !== null && (
          <p
            role="alert"
            style={{ color: 'var(--tos-danger, var(--cui-danger))', marginTop: '0.5rem', fontSize: '0.875rem' }}
          >
            {loadError}
          </p>
        )}
      </header>

      {/* ── Progress bar ────────────────────────────────────────────── */}
      <section
        aria-label="Overall progress"
        style={{ marginBottom: 'var(--tos-spacing-lg, 2rem)' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
          }}
        >
          <span>{completedCount} of {totalSteps} steps completed</span>
          <span>{progressPercent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Onboarding progress"
          style={{
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'var(--tos-surface-alt, var(--cui-tertiary-bg))',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--tos-primary, #1B4F72)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </section>

      {/* ── Steps list ──────────────────────────────────────────────── */}
      <ol
        aria-label="Onboarding steps"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--tos-spacing-sm, 0.75rem)',
        }}
      >
        {ONBOARDING_STEPS.map((step, index) => {
          const isDone = completedSteps.has(step.key);
          return (
            <li key={step.key}>
              <article
                aria-label={`Step ${index + 1}: ${step.label}${isDone ? ' — completed' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--tos-radius-md, 8px)',
                  border: `1px solid ${isDone ? 'var(--tos-success, var(--cui-success))' : 'var(--tos-border, var(--cui-border-color))'}`,
                  backgroundColor: isDone
                    ? 'var(--tos-success-subtle, rgba(25,135,84,0.08))'
                    : 'var(--tos-surface, var(--cui-body-bg))',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
              >
                {/* Icon */}
                <span
                  aria-hidden="true"
                  style={{ fontSize: '1.5rem', flexShrink: 0, lineHeight: 1 }}
                >
                  {step.icon}
                </span>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      color: isDone
                        ? 'var(--tos-success, var(--cui-success))'
                        : 'var(--tos-text-primary, var(--cui-body-color))',
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    style={{
                      margin: '0.125rem 0 0',
                      fontSize: '0.8125rem',
                      color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Done button */}
                <button
                  type="button"
                  onClick={() => toggleStep(step.key)}
                  aria-pressed={isDone}
                  aria-label={isDone ? `Mark "${step.label}" as not done` : `Mark "${step.label}" as done`}
                  style={{
                    flexShrink: 0,
                    padding: '0.375rem 0.875rem',
                    border: `1px solid ${isDone ? 'var(--tos-success, var(--cui-success))' : 'var(--tos-border, var(--cui-border-color))'}`,
                    borderRadius: 'var(--tos-radius-sm, 4px)',
                    backgroundColor: isDone ? 'var(--tos-success, var(--cui-success))' : 'transparent',
                    color: isDone ? '#ffffff' : 'var(--tos-text-secondary, var(--cui-secondary-color))',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
                    minWidth: '80px',
                  }}
                >
                  {isDone ? '✓ Done' : 'Mark Done'}
                </button>
              </article>
            </li>
          );
        })}
      </ol>

      {/* ── Footer actions ──────────────────────────────────────────── */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'var(--tos-spacing-lg, 2rem)',
          paddingTop: 'var(--tos-spacing-md, 1rem)',
          borderTop: '1px solid var(--tos-border, var(--cui-border-color))',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <Link
          href="/dashboard"
          style={{
            fontSize: '0.875rem',
            color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
            textDecoration: 'none',
          }}
          aria-label="Skip onboarding and go to dashboard"
        >
          Skip for now →
        </Link>

        {completedCount === totalSteps && (
          <Link
            href="/dashboard"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'var(--tos-primary, #1B4F72)',
              color: '#ffffff',
              borderRadius: 'var(--tos-radius-sm, 4px)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
            }}
            aria-label="All steps complete — go to dashboard"
          >
            Go to Dashboard
          </Link>
        )}
      </footer>
    </main>
  );
}
