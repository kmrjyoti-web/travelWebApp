'use client';

/**
 * @file src/contexts/AuthContext.tsx
 *
 * React context that exposes auth state to the component tree.
 * Wraps the Zustand useAuthStore so components don't import the store directly.
 *
 * Lifecycle:
 *   1. On mount: hydrate() restores session from localStorage.
 *   2. Provides: user, isAuthenticated, isLoading, error + rate-limit state.
 *   3. All login/logout logic lives in useAuth() hook; context holds state only.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/features/auth/types';

// ─── Context value shape ──────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lockedUntil: number | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginAttempts,
    lockedUntil,
    hydrate,
  } = useAuthStore();

  // Restore session once on client mount
  useEffect(() => {
    hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginAttempts,
    lockedUntil,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider');
  return ctx;
}
