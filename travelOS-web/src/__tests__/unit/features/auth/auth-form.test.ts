import { describe, it, expect } from 'vitest';
import { loginSchema, otpSchema, forgotPasswordSchema } from '@/features/auth/types/auth-form.types';

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: 'password123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('rejects password shorter than 8 chars', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('otpSchema', () => {
  it('accepts a 6-digit numeric OTP', () => {
    const result = otpSchema.safeParse({ otp: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects OTP shorter than 6 digits', () => {
    const result = otpSchema.safeParse({ otp: '12345' });
    expect(result.success).toBe(false);
  });

  it('rejects non-numeric OTP', () => {
    const result = otpSchema.safeParse({ otp: 'abc123' });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'notanemail' }).success).toBe(false);
  });
});
