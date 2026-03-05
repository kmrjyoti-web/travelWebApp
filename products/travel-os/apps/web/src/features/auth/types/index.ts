/**
 * @file src/features/auth/types/index.ts
 *
 * Domain types for the TravelOS authentication feature.
 * Shared across authService, authStore, AuthContext, and useAuth.
 */

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'agent' | 'viewer';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: UserRole;
  tenantId: string;
  productId: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Unix timestamp (ms) when the access token expires. */
  expiresAt: number;
}

// ─── Auth responses ───────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface OTPRequestResponse {
  /** Seconds before the OTP expires. */
  expiresIn: number;
  /** Masked delivery target for display (e.g. "j***@example.com"). */
  maskedTarget: string;
}

// ─── Auth requests ────────────────────────────────────────────────────────────

export interface LoginRequest {
  /** Email address or E.164 phone number. */
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface OTPLoginRequest {
  identifier: string;
  otp: string;
}

export interface SocialLoginRequest {
  /** ID token from the social provider (Google / Apple). */
  idToken: string;
  provider: 'google' | 'apple';
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ─── Auth state (Zustand store shape) ────────────────────────────────────────

export interface AuthStoreState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** Count of failed login attempts (reset on success / after lockout expires). */
  loginAttempts: number;
  /** Unix timestamp (ms) until which new login attempts are blocked. */
  lockedUntil: number | null;
}

export interface AuthStoreActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
  /** Lock new login attempts for `durationMs` milliseconds. */
  lockLogin: (durationMs: number) => void;
  hydrate: () => void;
  clear: () => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

// ─── Auth error codes ─────────────────────────────────────────────────────────

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DISABLED'
  | 'EMAIL_NOT_VERIFIED'
  | 'OTP_EXPIRED'
  | 'OTP_INVALID'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  retryAfter?: number; // seconds
}

// ─── Rate limiting constants ───────────────────────────────────────────────────

/** After this many failed attempts, lock out for LOCKOUT_DURATION_MS. */
export const MAX_LOGIN_ATTEMPTS = 5;
/** Lockout period in milliseconds (30 seconds). */
export const LOCKOUT_DURATION_MS = 30_000;
/** How many ms before token expiry to trigger a refresh (2 minutes). */
export const REFRESH_BUFFER_MS = 2 * 60 * 1000;

// ─── Storage keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'tos_token',
  REFRESH_TOKEN: 'tos_refresh_token',
  TENANT_ID: 'tos_tenant',
  REMEMBER_ME: 'tos_remember',
  USER: 'tos_user',
} as const;
