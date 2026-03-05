import { api } from './api';
import type { LoginPayload, OtpPayload, AuthResponse, GoogleAuthPayload } from '@/shared/types/auth.types';
import type { ApiResponse } from '@/shared/types/api.types';

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', {
      ...payload,
      productId: 'travel-os',
      tenantId: payload.tenantId ?? 'default',
    }),

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
};
