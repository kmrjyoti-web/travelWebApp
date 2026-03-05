import type { AuthErrorCode } from '@/features/auth/types';

// ─── Form data shapes ─────────────────────────────────────────────────────────

/** Data produced by the password login form. */
export interface LoginFormData {
  /** Email address or E.164 phone number. */
  identifier: string;
  password: string;
  rememberMe: boolean;
}

/** Data produced by the OTP login form. */
export interface OTPFormData {
  identifier: string;
  /** 6-digit numeric code. */
  otp: string;
}

// ─── Login mode ───────────────────────────────────────────────────────────────

export type LoginMode = 'password' | 'otp';

// ─── Error types ──────────────────────────────────────────────────────────────

export interface LoginError {
  code: AuthErrorCode;
  message: string;
  /** Seconds until the next attempt is allowed (for rate-limiting display). */
  retryAfter?: number;
}

// ─── Component props ──────────────────────────────────────────────────────────

export interface LoginFormProps {
  /** Called after a successful login (redirect handled here). */
  onSuccess?: () => void;
  /** Pre-fill the identifier field (e.g. from query param). */
  defaultIdentifier?: string;
  /** Default mode to show on mount. */
  defaultMode?: LoginMode;
  /** For automated tests. */
  'data-testid'?: string;
}
