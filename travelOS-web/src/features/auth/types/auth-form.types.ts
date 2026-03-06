import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must be numeric'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const SLUG_REGEX = /^[a-z0-9_-]+$/i;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    userType: z.enum(['customer', 'influencer', 'company'], {
      required_error: 'Please select an account type',
    }),
    profileCode: z.string().optional(),
    companyCode: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (d) =>
      d.userType !== 'influencer' ||
      (!!d.profileCode && d.profileCode.length >= 8 && SLUG_REGEX.test(d.profileCode)),
    { message: 'Profile code must be at least 8 alphanumeric characters', path: ['profileCode'] }
  )
  .refine(
    (d) =>
      d.userType !== 'company' ||
      (!!d.companyCode && d.companyCode.length >= 6 && SLUG_REGEX.test(d.companyCode)),
    { message: 'Company code must be at least 6 alphanumeric characters', path: ['companyCode'] }
  );

export type UserType = 'customer' | 'influencer' | 'company';
export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
