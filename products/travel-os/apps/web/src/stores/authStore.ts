/**
 * @file src/stores/authStore.ts
 *
 * Zustand auth store — single source of truth for auth state.
 *
 * Responsibilities:
 *   • Hold user, tokens, isAuthenticated, isLoading, error
 *   • Client-side rate limiting (loginAttempts, lockedUntil)
 *   • Hydrate from localStorage on first mount (via `hydrate()`)
 *   • Clear all state + localStorage on logout (via `clear()`)
 *
 * Token storage:
 *   Both accessToken and refreshToken are written to localStorage so the
 *   Axios interceptor (which reads localStorage.tos_token) picks them up.
 */

import { create } from 'zustand';
import {
  LOCKOUT_DURATION_MS,
  MAX_LOGIN_ATTEMPTS,
  STORAGE_KEYS,
  type AuthStore,
  type AuthStoreState,
  type AuthTokens,
  type User,
} from '@/features/auth/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function safeLocalStorage(): Storage | null {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

export function persistTokens(tokens: AuthTokens): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  ls.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  ls.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

export function clearStorage(): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  ls.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  ls.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  ls.removeItem(STORAGE_KEYS.TENANT_ID);
  ls.removeItem(STORAGE_KEYS.REMEMBER_ME);
  ls.removeItem(STORAGE_KEYS.USER);
}

function readStoredUser(): User | null {
  try {
    const ls = safeLocalStorage();
    const raw = ls?.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function readStoredTokens(): AuthTokens | null {
  try {
    const ls = safeLocalStorage();
    const accessToken = ls?.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = ls?.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!accessToken || !refreshToken) return null;
    // expiresAt is not persisted; set to 0 so useAuth triggers a refresh.
    return { accessToken, refreshToken, expiresAt: 0 };
  } catch {
    return null;
  }
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE: AuthStoreState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lockedUntil: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...INITIAL_STATE,

  // ─── Setters ────────────────────────────────────────────────────────────

  setUser(user: User | null) {
    const isAuthenticated = user !== null;
    set({ user, isAuthenticated });
    const ls = safeLocalStorage();
    if (ls) {
      if (user) {
        ls.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        ls.setItem(STORAGE_KEYS.TENANT_ID, user.tenantId);
      } else {
        ls.removeItem(STORAGE_KEYS.USER);
      }
    }
  },

  setTokens(tokens: AuthTokens | null) {
    set({ tokens });
    if (tokens) {
      persistTokens(tokens);
    } else {
      const ls = safeLocalStorage();
      ls?.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      ls?.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  setLoading(isLoading: boolean) {
    set({ isLoading });
  },

  setError(error: string | null) {
    set({ error });
  },

  // ─── Rate limiting ───────────────────────────────────────────────────────

  incrementLoginAttempts() {
    const next = get().loginAttempts + 1;
    if (next >= MAX_LOGIN_ATTEMPTS) {
      set({ loginAttempts: next, lockedUntil: Date.now() + LOCKOUT_DURATION_MS });
    } else {
      set({ loginAttempts: next });
    }
  },

  resetLoginAttempts() {
    set({ loginAttempts: 0, lockedUntil: null });
  },

  lockLogin(durationMs: number) {
    set({ lockedUntil: Date.now() + durationMs });
  },

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  hydrate() {
    const user = readStoredUser();
    const tokens = readStoredTokens();
    if (user && tokens) {
      set({ user, tokens, isAuthenticated: true });
    }
  },

  clear() {
    clearStorage();
    set({ ...INITIAL_STATE });
  },
}));
