'use client';
/**
 * RegistrationStep1 — Basic info form (Name, Email, Phone+ISD, Password).
 * Stores validated data in registrationStore and calls onNext().
 * Also maps ISD code → ISO 3166-1 alpha-2 country code and stores it.
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@/shared/components/Icon';
import { TextField, SelectField } from '@/shared/components';
import { useRegistrationStore } from '../stores/registration.store';

// ── ISD → ISO2 mapping ────────────────────────────────────────────────────────
const ISD_TO_ISO2: Record<string, string> = {
  '+91': 'IN', '+971': 'AE', '+44': 'GB', '+1': 'US',
  '+61': 'AU', '+1-CA': 'CA', '+65': 'SG', '+49': 'DE',
  '+33': 'FR', '+66': 'TH', '+60': 'MY', '+64': 'NZ',
  '+27': 'ZA', '+81': 'JP', '+977': 'NP', '+975': 'BT',
  '+960': 'MV', '+94': 'LK',
};

// ── Validation schema ─────────────────────────────────────────────────────────
const step1Schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    isdCode: z.string().min(1, 'Select a country code'),
    phone: z
      .string()
      .min(7, 'Phone must be at least 7 digits')
      .regex(/^\d+$/, 'Phone must contain digits only'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Step1FormData = z.infer<typeof step1Schema>;

// ── Common ISD codes ──────────────────────────────────────────────────────────
const ISD_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+60', label: '🇲🇾 +60' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+81', label: '🇯🇵 +81' },
];

// ── Progress indicator (reused across all steps) ──────────────────────────────
export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === step ? 20 : 8,
            height: 8,
            borderRadius: 4,
            background:
              i + 1 <= step ? 'var(--tos-primary)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  );
}

// ── Loading indicator ─────────────────────────────────────────────────────────
export function LoadingBars() {
  return (
    <span className="tos-loading-bars" aria-hidden="true">
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

// ── Props ─────────────────────────────────────────────────────────────────────
interface RegistrationStep1Props {
  /** Called after successful validation — parent navigates to /register/type */
  onNext: () => void;
  /** Back navigates to login view */
  onBack: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function RegistrationStep1({ onNext, onBack }: RegistrationStep1Props) {
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const { setStep1Data, setCountryIso2, isdCode: storedIsd, name, email, phone } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name,
      email,
      phone,
      isdCode: storedIsd || '+91',
      password: '',
      confirmPassword: '',
    },
  });

  const onValid = (data: Step1FormData) => {
    const iso2 = ISD_TO_ISO2[data.isdCode] ?? 'XX';
    setStep1Data({
      name: data.name,
      email: data.email,
      phone: data.phone,
      isdCode: data.isdCode,
      countryIso2: iso2,
      password: data.password,
    });
    setCountryIso2(iso2);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate aria-label="Step 1: Basic information">
      {/* Header */}
      <div className="tos-login-card__logo">
        <Icon name="Plane" size={28} aria-hidden="true" />
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>TravelOS</span>
      </div>
      <h2 className="tos-login-card__title">Create Account</h2>
      <p className="tos-login-card__subtitle" style={{ marginBottom: 16 }}>
        Enter your details to get started
      </p>

      <StepProgress step={1} total={3} />

      {/* Full Name */}
      <div className="tos-login-field">
        <TextField
          label="Full Name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          variant="outlined"
          size="sm"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
      </div>

      {/* Email */}
      <div className="tos-login-field">
        <TextField
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          variant="outlined"
          size="sm"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Phone with ISD prefix */}
      <div className="tos-login-field">
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 110, flexShrink: 0 }}>
            <SelectField
              id="s1-isd"
              label="Code"
              variant="outlined"
              size="sm"
              error={!!errors.isdCode}
              {...register('isdCode', {
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                  const iso2 = ISD_TO_ISO2[e.target.value] ?? 'XX';
                  setCountryIso2(iso2);
                },
              })}
            >
              {ISD_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </SelectField>
          </div>
          <div style={{ flex: 1 }}>
            <TextField
              label="Phone Number"
              type="text"
              inputMode="numeric"
              placeholder="9876543210"
              autoComplete="tel-national"
              variant="outlined"
              size="sm"
              error={!!errors.phone}
              helperText={errors.phone?.message ?? errors.isdCode?.message}
              {...register('phone')}
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="tos-login-field">
        <TextField
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="Min 8 characters"
          autoComplete="new-password"
          variant="outlined"
          size="sm"
          error={!!errors.password}
          helperText={errors.password?.message}
          endIcon={showPw ? 'EyeOff' : 'Eye'}
          onClickCapture={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.tos-tf__icon--end')) setShowPw((s) => !s);
          }}
          {...register('password')}
        />
      </div>

      {/* Confirm Password */}
      <div className="tos-login-field">
        <TextField
          label="Confirm Password"
          type={showCpw ? 'text' : 'password'}
          placeholder="Re-enter password"
          autoComplete="new-password"
          variant="outlined"
          size="sm"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          endIcon={showCpw ? 'EyeOff' : 'Eye'}
          onClickCapture={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.tos-tf__icon--end')) setShowCpw((s) => !s);
          }}
          {...register('confirmPassword')}
        />
      </div>

      {/* Actions */}
      <button
        type="submit"
        className="tos-login-btn"
        disabled={isSubmitting}
        style={{ marginTop: 8 }}
      >
        {isSubmitting ? (
          <><LoadingBars /> Saving...</>
        ) : (
          <><Icon name="ArrowRight" size={16} aria-hidden="true" /> Next</>
        )}
      </button>

      {/* Back to login */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          Already have an account?{' '}
        </span>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, textDecoration: 'underline', padding: 0,
          }}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
