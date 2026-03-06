'use client';
/**
 * /pending-approval — Shown after registration when approvalStatus === 'pending'.
 * URL params: ?type=DMC_PROVIDER&name=DMC+Provider
 */
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BackgroundStage } from '@/features/auth/components/BackgroundStage';
import { LoginThemeSwitcher } from '@/features/auth/components/LoginThemeSwitcher';
import { Icon } from '@/shared/components/Icon';
import { useRegistrationStore } from '@/features/auth/stores/registration.store';

// ── Inner component that uses useSearchParams ─────────────────────────────────
function PendingApprovalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reset = useRegistrationStore((s) => s.reset);

  const typeCode = searchParams.get('type') ?? '';
  const displayName = searchParams.get('name') ?? 'Your';

  // Clean up registration store on mount
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="tos-login-container">
      <div
        className="tos-login-card"
        style={{ textAlign: 'center' }}
        role="main"
        aria-labelledby="pending-title"
      >
        {/* Success icon */}
        <div
          style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: 'rgba(34,197,94,0.15)',
            border: '2px solid rgba(34,197,94,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}
          aria-hidden="true"
        >
          <Icon name="Clock" size={32} style={{ color: '#4ade80' }} />
        </div>

        {/* Title */}
        <h2
          id="pending-title"
          className="tos-login-card__title"
          style={{ marginBottom: 8 }}
        >
          Registration Submitted!
        </h2>

        {/* Message */}
        <p
          className="tos-login-card__subtitle"
          style={{ marginBottom: 20, lineHeight: 1.6 }}
        >
          Your <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{displayName}</strong> account
          is under review. We&apos;ll verify your documents within{' '}
          <strong style={{ color: '#4ade80' }}>3 business days</strong>.
        </p>

        {/* Type badge */}
        {typeCode && (
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 'var(--tos-border-radius-full)',
              fontSize: 12, color: '#93c5fd',
              marginBottom: 24,
            }}
          >
            <Icon name="Tag" size={12} aria-hidden="true" />
            {typeCode}
          </div>
        )}

        {/* Info card */}
        <div
          style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--tos-border-radius)',
            marginBottom: 24,
            textAlign: 'left',
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
          {[
            { icon: 'Mail', text: 'You\'ll receive a confirmation email shortly.' },
            { icon: 'FileText', text: 'Our team will review your submitted documents.' },
            { icon: 'CircleCheckBig', text: 'Once approved, you\'ll get full access to TravelOS.' },
          ].map(({ icon, text }) => (
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
          <button
            type="button"
            className="tos-login-btn"
            onClick={() => router.push('/')}
            style={{ marginTop: 0 }}
          >
            <Icon name="House" size={16} aria-hidden="true" />
            Go to Home
          </button>

          <button
            type="button"
            onClick={() => {
              window.open('mailto:support@travtech.com?subject=Registration Support', '_blank');
            }}
            style={{
              width: '100%', padding: '10px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--tos-border-radius)',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
              fontSize: 14, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Icon name="Headphones" size={15} aria-hidden="true" />
            Contact Support
          </button>
        </div>

        {/* Back to login */}
        <div style={{ marginTop: 20 }}>
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

// ── Page export (wrapped in Suspense for useSearchParams) ─────────────────────
export default function PendingApprovalPage() {
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
        <PendingApprovalContent />
      </Suspense>
    </div>
  );
}
