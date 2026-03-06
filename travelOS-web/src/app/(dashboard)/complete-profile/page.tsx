'use client';
/**
 * /complete-profile — Shown after login when profileCompleted === false.
 *
 * Presents a checklist of profile setup tasks the user should complete.
 * Each item can be ticked; the "Finish" button is only enabled when all
 * items are checked.
 *
 * On "Finish" → POST /api/v1/profile/complete → redirect to /dashboard.
 *
 * Authentication guard: redirects to /login if no token found.
 * Styling: --tos-* CSS custom properties only. No Tailwind. WCAG AA.
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/auth.store';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ChecklistItem {
  key: string;
  label: string;
  description: string;
}

// ── Checklist definition ────────────────────────────────────────────────────────
const CHECKLIST: ChecklistItem[] = [
  {
    key: 'photo_bio',
    label: 'Update your profile photo and bio',
    description: 'Upload a professional photo and write a short bio to introduce yourself.',
  },
  {
    key: 'business_details',
    label: 'Add your business details',
    description: 'Enter your company name, registration number, and business address.',
  },
  {
    key: 'notifications',
    label: 'Connect your preferred notification method',
    description: 'Set up WhatsApp or email alerts so you never miss a booking update.',
  },
  {
    key: 'settings',
    label: 'Review your TravelOS settings',
    description: 'Configure your currency, language, and commission preferences.',
  },
  {
    key: 'ready',
    label: "You're ready to start!",
    description: 'Check this box to confirm you have reviewed all the steps above.',
  },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function CompleteProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Auth guard — after hydration
  useEffect(() => {
    if (!hydrated) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('tos-access-token') : null;
    if (!token && !isAuthenticated) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  const toggleItem = useCallback((key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleFinish = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tos-access-token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/profile/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-product-id': 'travel-os',
        },
      });
      router.push('/dashboard');
    } catch {
      setError('Could not complete profile. Please try again.');
      setSubmitting(false);
    }
  };

  if (!hydrated) return null;

  const totalCount = CHECKLIST.length;
  const checkedCount = checked.size;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);
  const allChecked = checkedCount === totalCount;

  return (
    <main
      role="main"
      aria-label="Complete your profile"
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: 'var(--tos-spacing-lg, 2rem)',
        color: 'var(--tos-text-primary, var(--cui-body-color))',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ marginBottom: 'var(--tos-spacing-lg, 2rem)' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--tos-primary, #1B4F72)',
            marginBottom: '0.375rem',
          }}
        >
          Complete Your Profile
        </h1>
        <p
          style={{
            color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
            margin: 0,
            fontSize: '0.9375rem',
          }}
        >
          A few quick steps to get your TravelOS account fully set up.
        </p>
      </header>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      <section
        aria-label="Setup progress"
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
          <span>{checkedCount} of {totalCount} steps completed</span>
          <span aria-live="polite">{progressPercent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile completion progress"
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'var(--tos-surface-alt, var(--cui-tertiary-bg))',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: allChecked
                ? 'var(--tos-success, var(--cui-success))'
                : 'var(--tos-primary, #1B4F72)',
              borderRadius: 4,
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        </div>
      </section>

      {/* ── Error message ──────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            background: 'var(--tos-danger-subtle, rgba(220,53,69,0.08))',
            border: '1px solid var(--tos-danger, var(--cui-danger))',
            borderRadius: 'var(--tos-radius-md, 8px)',
            color: 'var(--tos-danger, var(--cui-danger))',
            fontSize: '0.875rem',
            marginBottom: 'var(--tos-spacing-md, 1rem)',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Checklist ──────────────────────────────────────────────────────── */}
      <ul
        aria-label="Profile setup checklist"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--tos-spacing-sm, 0.75rem)',
        }}
      >
        {CHECKLIST.map((item) => {
          const isDone = checked.has(item.key);
          return (
            <li key={item.key}>
              <label
                htmlFor={`cp-${item.key}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--tos-radius-md, 8px)',
                  border: `1px solid ${
                    isDone
                      ? 'var(--tos-success, var(--cui-success))'
                      : 'var(--tos-border, var(--cui-border-color))'
                  }`,
                  backgroundColor: isDone
                    ? 'var(--tos-success-subtle, rgba(25,135,84,0.08))'
                    : 'var(--tos-surface, var(--cui-body-bg))',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  userSelect: 'none',
                }}
              >
                {/* Checkbox */}
                <input
                  id={`cp-${item.key}`}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleItem(item.key)}
                  aria-label={item.label}
                  style={{
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    accentColor: 'var(--tos-success, var(--cui-success))',
                    cursor: 'pointer',
                  }}
                />

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
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      margin: '0.125rem 0 0',
                      fontSize: '0.8125rem',
                      color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Done indicator */}
                {isDone && (
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--tos-success, var(--cui-success))',
                    }}
                  >
                    ✓
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
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
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          aria-label="Skip profile completion and go to dashboard"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: 0,
          }}
        >
          Skip for now →
        </button>

        <button
          type="button"
          onClick={() => void handleFinish()}
          disabled={!allChecked || submitting}
          aria-disabled={!allChecked || submitting}
          aria-busy={submitting}
          aria-label={
            allChecked
              ? 'Finish profile setup and go to dashboard'
              : 'Complete all items before finishing'
          }
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor:
              allChecked && !submitting
                ? 'var(--tos-primary, #1B4F72)'
                : 'var(--tos-surface-alt, var(--cui-tertiary-bg))',
            color: allChecked && !submitting
              ? '#ffffff'
              : 'var(--tos-text-secondary, var(--cui-secondary-color))',
            border: 'none',
            borderRadius: 'var(--tos-radius-sm, 4px)',
            fontWeight: 600,
            fontSize: '0.9375rem',
            cursor: allChecked && !submitting ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          {submitting ? 'Finishing…' : 'Finish & Go to Dashboard'}
        </button>
      </footer>
    </main>
  );
}
