'use client';
/**
 * LoginForm — Email + password sign-in.
 *
 * Handles three possible login outcomes:
 *   1. ACCOUNT_UNDER_REVIEW → redirect to /under-review with SLA params
 *   2. profileCompleted === false → redirect to /complete-profile
 *   3. Normal success → redirect to /dashboard
 *
 * Falls back to mock auth in development when the backend is unavailable.
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { authService } from '@/shared/services/auth.service';
import type { LoginSuccessResult, LoginBlockedResult } from '@/shared/services/auth.service';
import { useAuthStore } from '@/shared/stores/auth.store';
import { loginSchema, type LoginFormData } from '../types/auth-form.types';
import type { LoginView } from '../hooks/useLoginTheme';

interface LoginFormProps {
  onViewChange: (view: LoginView) => void;
}

function LoadingBars() {
  return (
    <span className="tos-loading-bars">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="tos-loading-bar"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </span>
  );
}

export function LoginForm({ onViewChange }: LoginFormProps) {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const result = await authService.login(data);

      // ── Blocked / special status ────────────────────────────────────────────
      if (!result.success) {
        const blocked = result as LoginBlockedResult;
        if (blocked.code === 'ACCOUNT_UNDER_REVIEW') {
          const params = new URLSearchParams({
            type: blocked.meta?.userTypeCode ?? '',
            sla: blocked.meta?.slaDeadline ?? '',
            submitted: blocked.meta?.submittedAt ?? '',
          });
          router.push(`/under-review?${params.toString()}`);
          return;
        }
        setApiError(blocked.message ?? 'Login failed. Please try again.');
        return;
      }

      // ── Success ─────────────────────────────────────────────────────────────
      const success = result as LoginSuccessResult;
      const loginData = success.data;

      // Prefer the nested `user` object if present, otherwise build from flat fields
      const userPayload: Parameters<typeof setUser>[0] = loginData.user ?? {
        id: loginData.userId ?? 'unknown',
        email: loginData.email ?? data.email,
        name: loginData.email?.split('@')[0] ?? 'User',
        role: (loginData.role as Parameters<typeof setUser>[0]['role']) ?? 'agent',
        tenantId: 'default',
        productId: 'travel-os',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(userPayload);
      setTokens(
        loginData.accessToken ?? loginData.token ?? '',
        loginData.refreshToken ?? '',
      );

      if (loginData.profileCompleted === false) {
        router.push('/complete-profile');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      // The axios interceptor rejects with error.response?.data (the API body),
      // so err is shaped like: { success: false, error: { code, message } }
      const apiErr = err as { success?: boolean; error?: { code?: string; message?: string } };
      const errCode = apiErr?.error?.code;
      const errMsg = apiErr?.error?.message;

      if (errCode === 'UNAUTHORIZED') {
        setApiError(errMsg ?? 'Invalid email or password.');
        return;
      }
      if (errCode != null) {
        // Other known API error (e.g. ACCOUNT_SUSPENDED coming through as a thrown error)
        setApiError(errMsg ?? 'Login failed. Please try again.');
        return;
      }

      // No API error shape — backend is truly unreachable (network error)
      // Only use mock auth in development AND when backend is down
      if (process.env.NODE_ENV === 'development') {
        const mockUser: Parameters<typeof setUser>[0] = {
          id: 'mock-user-001',
          email: data.email,
          name: data.email.split('@')[0] ?? 'Demo User',
          role: 'agent',
          tenantId: 'default',
          productId: 'travel-os',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(mockUser);
        setTokens('mock-access-token', 'mock-refresh-token');
        router.push('/dashboard');
        return;
      }
      setApiError('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Logo */}
      <div className="tos-login-card__logo">
        <Icon name="Plane" size={28} />
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>TravelOS</span>
      </div>

      <h2 className="tos-login-card__title">Welcome Back</h2>
      <p className="tos-login-card__subtitle">Sign in to your account</p>

      {/* API Error */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="alert"
            style={{
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--tos-border-radius)',
              color: '#fca5a5',
              fontSize: 13,
              marginBottom: 'var(--tos-spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon name="CircleAlert" size={14} aria-hidden="true" />
            {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div className="tos-login-field">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          className={errors.email ? 'tos-error' : ''}
          {...register('email')}
        />
        {errors.email && (
          <div className="tos-login-field__error" role="alert">{errors.email.message}</div>
        )}
      </div>

      {/* Password */}
      <div className="tos-login-field">
        <label htmlFor="password">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className={errors.password ? 'tos-error' : ''}
            style={{ paddingRight: 40 }}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>
        {errors.password && (
          <div className="tos-login-field__error" role="alert">{errors.password.message}</div>
        )}
      </div>

      {/* Remember me + Forgot password */}
      <div className="tos-login-row">
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            {...register('rememberMe')}
            style={{ width: 14, height: 14 }}
          />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => onViewChange('forgot-password')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.75)',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="tos-login-btn"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? <LoadingBars /> : <Icon name="LogIn" size={16} aria-hidden="true" />}
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      {/* Divider */}
      <div className="tos-login-divider">or continue with</div>

      {/* Google OAuth */}
      <button
        type="button"
        className="tos-google-btn"
        aria-label="Sign in with Google"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('tos:google-auth'));
        }}
      >
        <Icon name="Chrome" size={16} aria-hidden="true" />
        Sign in with Google
      </button>

      {/* OTP option */}
      <div style={{ textAlign: 'center', marginTop: 'var(--tos-spacing-md)' }}>
        <button
          type="button"
          onClick={() => onViewChange('otp')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 13,
            textDecoration: 'underline',
          }}
        >
          Sign in with OTP instead
        </button>
      </div>

      {/* Create account */}
      <div style={{ textAlign: 'center', marginTop: 'var(--tos-spacing-sm)' }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
          New to TravelOS?{' '}
        </span>
        <button
          type="button"
          onClick={() => onViewChange('register')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.85)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Create an account
        </button>
      </div>
    </form>
  );
}
