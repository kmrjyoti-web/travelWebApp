import { api } from './api';
import type { LoginPayload, OtpPayload, AuthResponse, GoogleAuthPayload, User } from '@/shared/types/auth.types';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  RegisterWithTypePayload,
  RegisterWithTypeResponse,
} from '@/features/auth/types/user-type.types';

// ── Login response union ────────────────────────────────────────────────────────
/**
 * Returned when login succeeds and the account is active.
 */
export interface LoginSuccessResult {
  success: true;
  data: {
    userId: string;
    email: string;
    role: string;
    token: string;
    accessToken: string;
    refreshToken: string;
    profileCompleted: boolean;
    accountStatus: string;
    user: User;
  };
}

/**
 * Returned when login is rejected due to account status (e.g. ACCOUNT_UNDER_REVIEW,
 * ACCOUNT_REJECTED, EMAIL_NOT_VERIFIED).
 */
export interface LoginBlockedResult {
  success: false;
  code: string;
  message: string;
  meta?: {
    submittedAt?: string;
    slaDeadline?: string;
    userTypeCode?: string;
  };
}

/** Union of all possible login outcomes. */
export type LoginResponse = LoginSuccessResult | LoginBlockedResult;

export const authService = {
  /**
   * Authenticates a user and returns either a success result with token data
   * or a blocked result with a status code (e.g. ACCOUNT_UNDER_REVIEW).
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', {
      ...payload,
      productId: 'travel-os',
      tenantId: payload.tenantId ?? 'default',
    });
    // api.ts interceptor returns response.data — the full API response object
    return response as unknown as LoginResponse;
  },

  register: (payload: { name: string; email: string; password: string; tenantId?: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', {
      ...payload,
      productId: 'travel-os',
      tenantId: payload.tenantId ?? 'default',
      role: 'agent',
    }),

  sendOtp: (email: string) =>
    api.post<ApiResponse<{ message: string }>>('/auth/otp/send', { email }),

  verifyOtp: (payload: OtpPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/otp/verify', payload),

  googleAuth: (payload: GoogleAuthPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/google', payload),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email }),

  resetPassword: (payload: { token: string; password: string }) =>
    api.post<ApiResponse<{ message: string }>>('/auth/reset-password', payload),

  me: () => api.get<ApiResponse>('/auth/me'),

  refresh: () => api.post<ApiResponse<AuthResponse>>('/auth/refresh'),

  logout: () => api.post<ApiResponse>('/auth/logout'),

  registerWithType: (payload: RegisterWithTypePayload) =>
    api.post<ApiResponse<RegisterWithTypeResponse>>('/auth/register-with-type', {
      ...payload,
      productId: 'travel-os',
      tenantId: 'default',
    }),
};
