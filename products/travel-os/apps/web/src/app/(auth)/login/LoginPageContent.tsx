'use client';

/**
 * Client component wrapper for the login page.
 * Handles post-login redirect via useRouter — can't do this in a server component.
 */

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuthStore } from '@/stores/authStore';

export function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Redirect already-authenticated users (e.g. after page refresh with stored session)
  useEffect(() => {
    if (isAuthenticated) {
      const dest = searchParams.get('callbackUrl') ?? '/dashboard';
      router.replace(dest);
    }
  }, [isAuthenticated, router, searchParams]);

  function handleSuccess() {
    const dest = searchParams.get('callbackUrl') ?? '/dashboard';
    router.push(dest);
  }

  return <LoginForm onSuccess={handleSuccess} data-testid="login-page-form" />;
}
