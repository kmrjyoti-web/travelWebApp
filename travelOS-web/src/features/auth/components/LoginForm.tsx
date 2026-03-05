'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { authService } from '@/shared/services/auth.service';
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
      const res = (await authService.login(data)) as unknown as { data: { user: Parameters<typeof setUser>[0]; accessToken: string; refreshToken: string } };
      setUser(res.data.user);
      setTokens(res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setApiError(error?.message || 'Login failed. Please try again.');
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
            <Icon name="CircleAlert" size={14} />
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
          <div className="tos-login-field__error">{errors.email.message}</div>
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
          <div className="tos-login-field__error">{errors.password.message}</div>
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
      <button type="submit" className="tos-login-btn" disabled={isSubmitting}>
        {isSubmitting ? <LoadingBars /> : <Icon name="LogIn" size={16} />}
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      {/* Divider */}
      <div className="tos-login-divider">or continue with</div>

      {/* Google OAuth */}
      <button
        type="button"
        className="tos-google-btn"
        onClick={() => {
          // Google OAuth flow — hook into Google Identity Services
          window.dispatchEvent(new CustomEvent('tos:google-auth'));
        }}
      >
        <Icon name="Chrome" size={16} />
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
    </form>
  );
}
