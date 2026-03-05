'use client';

/**
 * @file src/features/auth/hooks/useAuth.ts
 *
 * Primary auth hook — composites the Zustand store + authService into one
 * cohesive API that components can import.
 *
 * Returns:
 *   user, isAuthenticated, isLoading, error,
 *   loginAttempts, lockedUntil, secondsUntilUnlock,
 *   login(), loginWithOTP(), loginWithGoogle(), loginWithApple(),
 *   logout(), requestOTP(), forgotPassword()
 *
 * Token auto-refresh:
 *   An effect sets a timeout that fires REFRESH_BUFFER_MS before the access
 *   token expires, calls authService.refreshToken(), and updates the store.
 *   If the refresh fails the session is cleared and the user is signed out.
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '../services/authService';
import {
  LOCKOUT_DURATION_MS,
  MAX_LOGIN_ATTEMPTS,
  REFRESH_BUFFER_MS,
  type LoginRequest,
  type OTPLoginRequest,
} from '../types';

// ─── useAuth ──────────────────────────────────────────────────────────────────

export function useAuth() {
  const store = useAuthStore();

  // ── Seconds until lockout expires (re-computed every second) ──────────────
  const [secondsUntilUnlock, setSecondsUntilUnlock] = useState(0);

  useEffect(() => {
    if (!store.lockedUntil) {
      setSecondsUntilUnlock(0);
      return;
    }
    function tick() {
      const remaining = Math.max(0, Math.ceil((store.lockedUntil! - Date.now()) / 1000));
      setSecondsUntilUnlock(remaining);
      if (remaining === 0) store.resetLoginAttempts();
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [store.lockedUntil]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Token auto-refresh ────────────────────────────────────────────────────
  useEffect(() => {
    const { tokens } = store;
    if (!tokens || tokens.expiresAt === 0) return;

    const delay = tokens.expiresAt - Date.now() - REFRESH_BUFFER_MS;
    if (delay <= 0) {
      // Already close to expiry — refresh immediately
      void refreshAccessToken(tokens.refreshToken);
      return;
    }

    const id = setTimeout(() => {
      void refreshAccessToken(tokens.refreshToken);
    }, delay);

    return () => clearTimeout(id);
  }, [store.tokens?.expiresAt]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refreshAccessToken(refreshToken: string): Promise<void> {
    try {
      const newTokens = await authService.refreshToken(refreshToken);
      store.setTokens(newTokens);
    } catch {
      // Refresh failed — sign the user out silently
      store.clear();
    }
  }

  // ── Rate-limit guard ──────────────────────────────────────────────────────
  function isLocked(): boolean {
    if (!store.lockedUntil) return false;
    return Date.now() < store.lockedUntil;
  }

  // ── login (password) ──────────────────────────────────────────────────────
  const login = useCallback(
    async (data: LoginRequest): Promise<void> => {
      if (isLocked()) {
        store.setError(
          `Too many failed attempts. Please wait ${secondsUntilUnlock}s before trying again.`,
        );
        return;
      }
      store.setLoading(true);
      store.setError(null);
      try {
        const { user, tokens } = await authService.login(data);
        store.setUser(user);
        store.setTokens(tokens);
        store.resetLoginAttempts();
      } catch (err: unknown) {
        const message = extractErrorMessage(err);
        store.setError(message);
        store.incrementLoginAttempts();
        const { loginAttempts, lockedUntil } = useAuthStore.getState();
        if (lockedUntil) {
          store.setError(
            `Account locked for ${Math.ceil(LOCKOUT_DURATION_MS / 1000)}s after ${MAX_LOGIN_ATTEMPTS} failed attempts.`,
          );
        } else {
          const remaining = MAX_LOGIN_ATTEMPTS - loginAttempts;
          store.setError(`${message}. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
        }
      } finally {
        store.setLoading(false);
      }
    },
    [secondsUntilUnlock], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── loginWithOTP ──────────────────────────────────────────────────────────
  const loginWithOTP = useCallback(
    async (data: OTPLoginRequest): Promise<void> => {
      store.setLoading(true);
      store.setError(null);
      try {
        const { user, tokens } = await authService.loginWithOTP(data);
        store.setUser(user);
        store.setTokens(tokens);
        store.resetLoginAttempts();
      } catch (err: unknown) {
        store.setError(extractErrorMessage(err));
      } finally {
        store.setLoading(false);
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── loginWithGoogle ───────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(
    async (idToken: string): Promise<void> => {
      store.setLoading(true);
      store.setError(null);
      try {
        const { user, tokens } = await authService.loginWithGoogle(idToken);
        store.setUser(user);
        store.setTokens(tokens);
        store.resetLoginAttempts();
      } catch (err: unknown) {
        store.setError(extractErrorMessage(err));
      } finally {
        store.setLoading(false);
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── loginWithApple ────────────────────────────────────────────────────────
  const loginWithApple = useCallback(
    async (idToken: string): Promise<void> => {
      store.setLoading(true);
      store.setError(null);
      try {
        const { user, tokens } = await authService.loginWithApple(idToken);
        store.setUser(user);
        store.setTokens(tokens);
        store.resetLoginAttempts();
      } catch (err: unknown) {
        store.setError(extractErrorMessage(err));
      } finally {
        store.setLoading(false);
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Best-effort server logout — always clear locally
    } finally {
      store.clear();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── requestOTP ────────────────────────────────────────────────────────────
  const requestOTP = useCallback(async (identifier: string) => {
    return authService.requestOTP(identifier);
  }, []);

  // ── forgotPassword ────────────────────────────────────────────────────────
  const forgotPassword = useCallback(async (identifier: string): Promise<void> => {
    store.setLoading(true);
    store.setError(null);
    try {
      await authService.forgotPassword(identifier);
    } catch (err: unknown) {
      store.setError(extractErrorMessage(err));
    } finally {
      store.setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    loginAttempts: store.loginAttempts,
    lockedUntil: store.lockedUntil,
    secondsUntilUnlock,
    isLocked: isLocked(),
    // Actions
    login,
    loginWithOTP,
    loginWithGoogle,
    loginWithApple,
    logout,
    requestOTP,
    forgotPassword,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (typeof e.message === 'string') return e.message;
    if (e.response && typeof (e.response as Record<string, unknown>).data === 'object') {
      const data = (e.response as Record<string, unknown>).data as Record<string, unknown>;
      if (typeof data.error === 'string') return data.error;
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
