'use client';
/**
 * /register/type — Step 2: User type selection.
 * Guards: redirects to /register if Step 1 is not complete (no email).
 * On Next: if fields returned → /register/details; else → submit directly.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundStage } from '@/features/auth/components/BackgroundStage';
import { LoginThemeSwitcher } from '@/features/auth/components/LoginThemeSwitcher';
import { RegistrationStep2 } from '@/features/auth/components/RegistrationStep2';
import { useLoginTheme, THEME_CONFIG } from '@/features/auth/hooks/useLoginTheme';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useRegistrationStore } from '@/features/auth/stores/registration.store';
import { authService } from '@/shared/services/auth.service';
import type { UserTypeFieldSchema } from '@/features/auth/types/user-type.types';

export default function RegisterTypePage() {
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { setUser, setTokens } = useAuthStore();
  const { mode } = useLoginTheme();
  const config = THEME_CONFIG[mode];

  const {
    email, name, phone, isdCode, password,
    userTypeCode, userTypeDisplayName, setUserTypeCode, profileData,
  } = useRegistrationStore();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
    // Guard: step 1 must be complete
    if (hydrated && !isAuthenticated && !email) {
      router.replace('/register');
    }
  }, [hydrated, isAuthenticated, email, router]);

  if (!hydrated || isAuthenticated || !email) return null;

  // ── Submit registration directly (no step 3 fields) ───────────────────────
  const submitRegistration = async (code: string, displayName: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await authService.registerWithType({
        name, email, phone, isdCode, password,
        userTypeCode: code,
        profileData,
      }) as unknown as {
        data: {
          approvalStatus: string;
          userTypeCode: string;
          userTypeDisplayName: string;
          accessToken?: string;
          refreshToken?: string;
          userId?: string;
        };
      };

      const respData = res.data;

      if (respData.approvalStatus === 'approved' && respData.accessToken) {
        setUser({
          id: respData.userId ?? 'unknown',
          email,
          name,
          role: 'agent',
          tenantId: 'default',
          productId: 'travel-os',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setTokens(respData.accessToken, respData.refreshToken ?? '');
        router.push('/dashboard');
      } else {
        const params = new URLSearchParams({
          type: respData.userTypeCode ?? code,
          name: respData.userTypeDisplayName ?? displayName,
        });
        router.push(`/pending-approval?${params.toString()}`);
      }
    } catch {
      if (process.env.NODE_ENV === 'development') {
        // Dev fallback: treat as pending approval
        const params = new URLSearchParams({ type: code, name: displayName });
        router.push(`/pending-approval?${params.toString()}`);
        return;
      }
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = (fields: UserTypeFieldSchema[]) => {
    if (fields.length === 0) {
      // Skip step 3 — submit directly
      void submitRegistration(userTypeCode, userTypeDisplayName);
    } else {
      // Store field schemas in session state via URL state or store — navigate to step 3
      // We pass fields via sessionStorage (step 3 page reads them)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tos-reg-fields', JSON.stringify(fields));
      }
      router.push('/register/details');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <BackgroundStage />
      <LoginThemeSwitcher />

      <div
        style={{
          position: 'absolute',
          top: 'var(--tos-spacing-lg)',
          left: 'var(--tos-spacing-lg)',
          zIndex: 20,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          {config.emoji} {config.greeting}
        </div>
        <div style={{ fontSize: 11, opacity: 0.5 }}>{config.description}</div>
      </div>

      <div className="tos-login-container">
        <div className="tos-login-card">
          {submitError && (
            <div
              style={{
                padding: '10px 14px', background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--tos-border-radius)',
                color: '#fca5a5', fontSize: 13, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              role="alert"
            >
              {submitError}
            </div>
          )}
          {isSubmitting ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.7)' }}>
              Creating your account…
            </div>
          ) : (
            <RegistrationStep2
              onNext={handleNext}
              onBack={() => {
                setUserTypeCode('', '', false);
                router.push('/register');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
