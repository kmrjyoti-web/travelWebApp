'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { authService } from '@/shared/services/auth.service';
import { useAuthStore } from '@/shared/stores/auth.store';
import { otpSchema, type OtpFormData } from '../types/auth-form.types';
import type { LoginView } from '../hooks/useLoginTheme';

interface OtpFormProps {
  email: string;
  onViewChange: (view: LoginView) => void;
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export function OtpForm({ email, onViewChange }: OtpFormProps) {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDigitChange = (i: number, value: string) => {
    const d = value.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    if (d && i < OTP_LENGTH - 1) {
      inputRefs.current[i + 1]?.focus();
    }
    // Auto-submit when all filled
    if (next.every(Boolean) && next.join('').length === OTP_LENGTH) {
      handleSubmit(next.join(''));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (otp: string) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const res = (await authService.verifyOtp({ email, otp })) as unknown as { data: { user: Parameters<typeof setUser>[0]; accessToken: string; refreshToken: string } };
      setUser(res.data.user);
      setTokens(res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setApiError(error?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    await authService.sendOtp(email);
    setResendTimer(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div>
      <div className="tos-login-card__logo">
        <Icon name="ShieldCheck" size={28} />
        <span style={{ fontSize: 22, fontWeight: 800 }}>Verify OTP</span>
      </div>
      <h2 className="tos-login-card__title">Enter OTP</h2>
      <p className="tos-login-card__subtitle">
        We sent a 6-digit code to{' '}
        <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{email}</strong>
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

      <div className="tos-otp-row">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="tos-otp-input"
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        type="button"
        className="tos-login-btn"
        disabled={isSubmitting || digits.join('').length < OTP_LENGTH}
        onClick={() => handleSubmit(digits.join(''))}
      >
        {isSubmitting ? (
          <Icon name="LoaderCircle" size={16} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <Icon name="CircleCheck" size={16} />
        )}
        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div style={{ textAlign: 'center', marginTop: 'var(--tos-spacing-md)', fontSize: 13 }}>
        {resendTimer > 0 ? (
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>
            Resend in {resendTimer}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 13,
            }}
          >
            Resend OTP
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--tos-spacing-sm)' }}>
        <button
          type="button"
          onClick={() => onViewChange('login')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
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
    </div>
  );
}
