'use client';
/**
 * /register — Step 1: Basic info (name, email, phone, password).
 * Redirects to /dashboard if already authenticated.
 * Uses same backdrop (BackgroundStage) as the login page.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundStage } from '@/features/auth/components/BackgroundStage';
import { LoginThemeSwitcher } from '@/features/auth/components/LoginThemeSwitcher';
import { RegistrationStep1 } from '@/features/auth/components/RegistrationStep1';
import { useLoginTheme, THEME_CONFIG } from '@/features/auth/hooks/useLoginTheme';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useRegistrationStore } from '@/features/auth/stores/registration.store';

export default function RegisterPage() {
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mode } = useLoginTheme();
  const config = THEME_CONFIG[mode];
  const resetStore = useRegistrationStore((s) => s.reset);

  useEffect(() => {
    // Reset any stale registration state when landing on step 1
    resetStore();
    setHydrated(true);
  }, [resetStore]);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || isAuthenticated) return null;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <BackgroundStage />
      <LoginThemeSwitcher />

      {/* Time-of-day greeting */}
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
          <RegistrationStep1
            onNext={() => router.push('/register/type')}
            onBack={() => router.push('/login')}
          />
        </div>
      </div>
    </div>
  );
}
