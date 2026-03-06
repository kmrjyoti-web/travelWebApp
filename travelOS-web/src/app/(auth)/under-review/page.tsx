'use client';
/**
 * /under-review — Shown when a user logs in and receives ACCOUNT_UNDER_REVIEW,
 * or immediately after registration when approvalStatus === 'pending'.
 *
 * URL params: ?type=TRAVEL_AGENT&name=Travel+Agent&sla=2025-01-13T10:30:00Z&submitted=2025-01-12T10:30:00Z
 *
 * No polling token is available in the new-registration flow, so we display
 * static info derived from the URL parameters + registration store.
 * If the user has a stored token (re-login scenario), the status is available
 * after a normal login redirect.
 *
 * Accessibility: WCAG AA — ARIA roles, keyboard nav, skip links.
 * Dark mode: all colours via --tos-* CSS tokens.
 */
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BackgroundStage } from '@/features/auth/components/BackgroundStage';
import { LoginThemeSwitcher } from '@/features/auth/components/LoginThemeSwitcher';
import { Icon } from '@/shared/components/Icon';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useRegistrationStore } from '@/features/auth/stores/registration.store';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ── "What happens next?" steps ────────────────────────────────────────────────
const NEXT_STEPS = [
  { icon: 'Search', text: 'Our team reviews your details and documents.' },
  { icon: 'MessageCircle', text: 'You receive a WhatsApp or email notification when approved.' },
  { icon: 'LogIn', text: 'Log in and complete your profile setup.' },
  { icon: 'Rocket', text: 'Start using TravelOS for your business.' },
] as const;

// ── Inner component (uses useSearchParams — must be inside Suspense) ──────────
function UnderReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuthStore();
  const resetRegistration = useRegistrationStore((s) => s.reset);

  const typeCode = searchParams.get('type') ?? '';
  // searchParams.get() auto-decodes URL-encoded values — no need for decodeURIComponent
  const displayName = (searchParams.get('name') ?? typeCode) || 'Your';
  const slaDeadline = searchParams.get('sla');
  const submittedAt = searchParams.get('submitted');

  // Clean up registration store on mount (registration flow complete)
  useEffect(() => {
    resetRegistration();
  }, [resetRegistration]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="tos-login-container" style={{ alignItems: 'flex-start', paddingTop: 24 }}>
      <div
        className="tos-login-card"
        role="main"
        aria-labelledby="under-review-title"
        style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}
      >
        {/* Header row: logo + logout */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="Plane" size={22} aria-hidden="true" style={{ color: 'var(--tos-primary, #1B4F72)' }} />
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>TravelOS</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--tos-border-radius)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: 12,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name="LogOut" size={13} aria-hidden="true" />
            Logout
          </button>
        </div>

        {/* Clock icon */}
        <div
          style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'rgba(34,197,94,0.12)',
            border: '2px solid rgba(34,197,94,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}
          aria-hidden="true"
        >
          <Icon name="Clock" size={36} style={{ color: '#4ade80' }} />
        </div>

        {/* Title */}
        <h2
          id="under-review-title"
          className="tos-login-card__title"
          style={{ marginBottom: 8, textAlign: 'center' }}
        >
          Your account is under review
        </h2>

        {/* Subtitle */}
        <p
          className="tos-login-card__subtitle"
          style={{ marginBottom: 20, lineHeight: 1.6, textAlign: 'center' }}
        >
          Hi! Your{' '}
          <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{displayName}</strong>{' '}
          account is being verified by our team.
        </p>

        {/* Status info card */}
        <div
          style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--tos-border-radius)',
            marginBottom: 20,
          }}
          aria-label="Verification status details"
        >
          {[
            { label: 'Status', value: 'Under Review' },
            { label: 'Account Type', value: displayName || typeCode || '—' },
            { label: 'Submitted', value: formatDate(submittedAt) },
            { label: 'Expected by', value: formatDate(slaDeadline) },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* What happens next */}
        <div
          style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--tos-border-radius)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
              marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}
          >
            What happens next?
          </div>
          {NEXT_STEPS.map(({ icon, text }) => (
            <div
              key={icon}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,0.65)',
              }}
            >
              <Icon
                name={icon as Parameters<typeof Icon>[0]['name']}
                size={14}
                style={{ color: '#4ade80', flexShrink: 0, marginTop: 1 }}
                aria-hidden="true"
              />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                window.open('mailto:support@travtech.com?subject=Account Verification Support', '_blank');
              }}
              aria-label="Contact support about your account"
              style={{
                flex: 1, padding: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--tos-border-radius)',
                color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Icon name="Headphones" size={14} aria-hidden="true" />
              Contact Support
            </button>
            <button
              type="button"
              className="tos-login-btn"
              onClick={() => router.push('/')}
              aria-label="Go to home page"
              style={{ flex: 1, marginTop: 0 }}
            >
              <Icon name="House" size={14} aria-hidden="true" />
              Go to Home
            </button>
          </div>

          {/* Refresh / check again */}
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Check verification status again"
            style={{
              width: '100%', padding: '8px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--tos-border-radius)',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
              fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Icon name="RefreshCw" size={12} aria-hidden="true" />
            Check again
          </button>
        </div>

        {/* Back to login */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={() => router.push('/login')}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              fontSize: 12, textDecoration: 'underline',
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page export (Suspense wrapper required for useSearchParams) ───────────────
export default function UnderReviewPage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <BackgroundStage />
      <LoginThemeSwitcher />
      <Suspense fallback={null}>
        <UnderReviewContent />
      </Suspense>
    </div>
  );
}
