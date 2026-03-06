'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginView } from '@/features/auth';
import { useAuthStore } from '@/shared/stores/auth.store';

export default function LoginPage() {
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (isAuthenticated) return null;

  return <LoginView />;
}
