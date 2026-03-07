'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@/shared/components/Icon';
import { TextField } from '@/shared/components';
import { authService } from '@/shared/services/auth.service';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../types/auth-form.types';
import type { LoginView } from '../hooks/useLoginTheme';

interface ForgotPasswordFormProps {
  onViewChange: (view: LoginView) => void;
}

export function ForgotPasswordForm({ onViewChange }: ForgotPasswordFormProps) {
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiError(null);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setApiError(error?.message || 'Failed to send reset email. Try again.');
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 'var(--tos-spacing-md)' }}>📧</div>
        <h2 className="tos-login-card__title">Check your email</h2>
        <p className="tos-login-card__subtitle">
          We sent a password reset link to{' '}
          <strong style={{ color: '#fff' }}>{getValues('email')}</strong>
        </p>
        <button
          type="button"
          onClick={() => onViewChange('login')}
          className="tos-login-btn"
          style={{ marginTop: 'var(--tos-spacing-lg)' }}
        >
          <Icon name="ArrowLeft" size={16} />
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="tos-login-card__logo">
        <Icon name="Lock" size={28} />
        <span style={{ fontSize: 22, fontWeight: 800 }}>Reset Password</span>
      </div>
      <h2 className="tos-login-card__title">Forgot Password?</h2>
      <p className="tos-login-card__subtitle">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {apiError && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--tos-border-radius)',
            color: '#fca5a5',
            fontSize: 13,
            marginBottom: 'var(--tos-spacing-md)',
          }}
        >
          {apiError}
        </div>
      )}

      <div className="tos-login-field">
        <TextField
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          variant="outlined"
          size="sm"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
      </div>

      <button type="submit" className="tos-login-btn" disabled={isSubmitting}>
        {isSubmitting ? (
          <Icon name="LoaderCircle" size={16} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <Icon name="Send" size={16} />
        )}
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </button>

      <div style={{ textAlign: 'center', marginTop: 'var(--tos-spacing-md)' }}>
        <button
          type="button"
          onClick={() => onViewChange('login')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            margin: '0 auto',
          }}
        >
          <Icon name="ArrowLeft" size={13} />
          Back to login
        </button>
      </div>
    </form>
  );
}
