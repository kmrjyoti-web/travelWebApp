import { z } from 'zod';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164 format: +[country][number], 8–15 digits total
const PHONE_RE = /^\+[1-9]\d{7,14}$/;

export function isValidEmail(v: string): boolean {
  return EMAIL_RE.test(v);
}

export function isValidPhone(v: string): boolean {
  return PHONE_RE.test(v);
}

export function isEmailOrPhone(v: string): boolean {
  return isValidEmail(v) || isValidPhone(v);
}

// ─── Identifier ───────────────────────────────────────────────────────────────

export const identifierSchema = z
  .string()
  .min(1, 'Email or phone number is required')
  .refine(isEmailOrPhone, {
    message: 'Enter a valid email address or phone number (+country code)',
  });

// ─── Password ─────────────────────────────────────────────────────────────────

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character',
  );

// ─── OTP ──────────────────────────────────────────────────────────────────────

export const otpSchema = z
  .string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only digits');

// ─── Login (password mode) schema ─────────────────────────────────────────────

export const loginSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
  rememberMe: z.boolean().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// ─── OTP login schema ─────────────────────────────────────────────────────────

export const otpLoginSchema = z.object({
  identifier: identifierSchema,
  otp: otpSchema,
});

export type OTPLoginSchema = z.infer<typeof otpLoginSchema>;

// ─── OTP request schema (just identifier) ────────────────────────────────────

export const otpRequestSchema = z.object({
  identifier: identifierSchema,
});

export type OTPRequestSchema = z.infer<typeof otpRequestSchema>;
