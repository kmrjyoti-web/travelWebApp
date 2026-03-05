/**
 * @file src/features/auth/services/authService.ts
 *
 * TravelOS authentication service.
 * All calls go through the shared apiClient which:
 *   - Injects Bearer token + x-tenant-id headers
 *   - Unwraps { success, data } response envelopes
 *   - Handles 401 → token refresh
 *
 * Endpoints follow /api/v1/auth/* convention.
 */

import { apiClient } from '@/lib/api/client';
import type {
  AuthResponse,
  AuthTokens,
  ForgotPasswordRequest,
  LoginRequest,
  OTPLoginRequest,
  OTPRequestResponse,
  RefreshTokenRequest,
  SocialLoginRequest,
} from '../types';

// ─── Endpoint paths ───────────────────────────────────────────────────────────

const AUTH_BASE = '/auth';

const ENDPOINTS = {
  login:          `${AUTH_BASE}/login`,
  loginOTP:       `${AUTH_BASE}/login/otp`,
  loginSocial:    `${AUTH_BASE}/login/social`,
  logout:         `${AUTH_BASE}/logout`,
  refresh:        `${AUTH_BASE}/refresh`,
  forgotPassword: `${AUTH_BASE}/forgot-password`,
  requestOTP:     `${AUTH_BASE}/otp/request`,
} as const;

// ─── Auth service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Log in with email/phone + password.
   * Returns user profile and access/refresh tokens.
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<never, AuthResponse>(ENDPOINTS.login, data);
  },

  /**
   * Log in with a one-time passcode.
   * The OTP must first be requested via `requestOTP()`.
   */
  async loginWithOTP(data: OTPLoginRequest): Promise<AuthResponse> {
    return apiClient.post<never, AuthResponse>(ENDPOINTS.loginOTP, data);
  },

  /**
   * Log in via Google ID token (obtained from Google Sign-In popup/redirect).
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const payload: SocialLoginRequest = { idToken, provider: 'google' };
    return apiClient.post<never, AuthResponse>(ENDPOINTS.loginSocial, payload);
  },

  /**
   * Log in via Apple ID token.
   */
  async loginWithApple(idToken: string): Promise<AuthResponse> {
    const payload: SocialLoginRequest = { idToken, provider: 'apple' };
    return apiClient.post<never, AuthResponse>(ENDPOINTS.loginSocial, payload);
  },

  /**
   * Invalidate the current session on the server.
   * The caller is responsible for clearing local storage.
   */
  async logout(): Promise<void> {
    return apiClient.post<never, void>(ENDPOINTS.logout);
  },

  /**
   * Exchange a refresh token for a new access token + refresh token pair.
   * Called automatically by the Axios 401 interceptor.
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const payload: RefreshTokenRequest = { refreshToken };
    return apiClient.post<never, AuthTokens>(ENDPOINTS.refresh, payload);
  },

  /**
   * Send a password-reset link / OTP to the provided email or phone.
   */
  async forgotPassword(identifier: string): Promise<void> {
    const payload: ForgotPasswordRequest = { identifier };
    return apiClient.post<never, void>(ENDPOINTS.forgotPassword, payload);
  },

  /**
   * Request a one-time passcode be sent to the provided identifier.
   * Returns the expiry duration and a masked version of the target for display.
   */
  async requestOTP(identifier: string): Promise<OTPRequestResponse> {
    return apiClient.post<never, OTPRequestResponse>(ENDPOINTS.requestOTP, {
      identifier,
    });
  },
} as const;

export type AuthService = typeof authService;
