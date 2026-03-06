'use client';
/**
 * RegistrationForm — in-place 3-step registration inside LoginView card.
 * Step 1: Basic info | Step 2: Dynamic user-type cards | Step 3: Dynamic profile fields
 * Calls POST /api/v1/auth/register-with-type on final submit.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { authService } from '@/shared/services/auth.service';
import { useAuthStore } from '@/shared/stores/auth.store';
import { api } from '@/shared/services/api';
import type { LoginView } from '../hooks/useLoginTheme';
import type { UserTypeDropdownItem, UserTypeFieldSchema } from '../types/user-type.types';
import {
  LoadingBarsInline,
  StepDots,
  TypeCardRF,
  DynamicFieldRF,
  type FieldValue,
} from './RegistrationFormParts';

interface Props { onViewChange: (view: LoginView) => void; }

// ── ISD codes ─────────────────────────────────────────────────────────────────
const ISD_CODES = [
  { code: '+91', label: '🇮🇳 +91' }, { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' }, { code: '+971', label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' }, { code: '+60', label: '🇲🇾 +60' },
];

// ── Step 1 schema ─────────────────────────────────────────────────────────────
const step1Schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    isdCode: z.string().min(1, 'Select a country code'),
    phone: z.string().min(7, 'Phone must be at least 7 digits').regex(/^\d+$/, 'Digits only'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Step1Data = z.infer<typeof step1Schema>;

// ── Mock dev data ─────────────────────────────────────────────────────────────
const MOCK_TYPES: UserTypeDropdownItem[] = [
  { code: 'TRAVELER', displayName: 'Traveler', description: 'Plan & book for yourself', iconName: 'User', colorHex: '#3b82f6', group: 'Individual', selfRegistrationAllowed: true, requiresApproval: false },
  { code: 'INFLUENCER', displayName: 'Influencer', description: 'Share travel content & earn', iconName: 'Star', colorHex: '#a78bfa', group: 'Individual', selfRegistrationAllowed: true, requiresApproval: false },
  { code: 'TRAVEL_AGENT', displayName: 'Travel Agent', description: 'Manage bookings for clients', iconName: 'Briefcase', colorHex: '#34d399', group: 'Business', selfRegistrationAllowed: true, requiresApproval: true },
  { code: 'DMC_PROVIDER', displayName: 'DMC Provider', description: 'Destination management company', iconName: 'Building2', colorHex: '#f59e0b', group: 'Business', selfRegistrationAllowed: true, requiresApproval: true },
];

const MOCK_FIELDS: UserTypeFieldSchema[] = [
  { fieldKey: 'businessName', label: 'Business Name', fieldType: 'text', isRequired: true, placeholder: 'e.g. Axis Travels', sortOrder: 1 },
  { fieldKey: 'gstNumber', label: 'GST Number', fieldType: 'text', isRequired: false, placeholder: 'e.g. 22AAAAA0000A1Z5', helpText: '15-digit GST number', sortOrder: 2 },
];

// ── Main component ────────────────────────────────────────────────────────────
export function RegistrationForm({ onViewChange }: Props) {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [step1, setStep1] = useState<Step1Data | null>(null);

  // Step 2 state
  const [userTypes, setUserTypes] = useState<UserTypeDropdownItem[]>([]);
  const [selectedType, setSelectedType] = useState<UserTypeDropdownItem | null>(null);
  const [typesLoading, setTypesLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(false);

  // Step 3 state
  const [fields, setFields] = useState<UserTypeFieldSchema[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, FieldValue>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { isdCode: '+91' },
  });

  // ── Fetch types on step 2 ─────────────────────────────────────────────────
  const fetchUserTypes = useCallback(async () => {
    setTypesLoading(true);
    try {
      const res = await api.get<unknown, { data: UserTypeDropdownItem[] }>(
        '/user-types/dropdown', { params: { selfOnly: true } }
      ) as { data: UserTypeDropdownItem[] };
      setUserTypes(res.data ?? []);
    } catch {
      if (process.env.NODE_ENV === 'development') {
        setUserTypes(MOCK_TYPES);
      } else {
        setApiError('Failed to load account types.');
      }
    } finally {
      setTypesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (step === 2) void fetchUserTypes();
  }, [step, fetchUserTypes]);

  const onStep1Valid = (data: Step1Data) => {
    setStep1(data);
    setStep(2);
  };

  // ── Final submit ──────────────────────────────────────────────────────────
  const submitRegistration = async (profileData: Record<string, unknown>, type: UserTypeDropdownItem) => {
    if (!step1) return;
    setIsSubmitting(true);
    setApiError(null);
    try {
      const res = await authService.registerWithType({
        name: step1.name, email: step1.email, phone: step1.phone,
        isdCode: step1.isdCode, password: step1.password,
        userTypeCode: type.code, profileData,
      }) as unknown as {
        data: { approvalStatus: string; userTypeCode: string; userTypeDisplayName: string; accessToken?: string; refreshToken?: string; userId?: string; };
      };
      const d = res.data;
      if (d.approvalStatus === 'approved' && d.accessToken) {
        setUser({ id: d.userId ?? 'unknown', email: step1.email, name: step1.name, role: 'agent', tenantId: 'default', productId: 'travel-os', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        setTokens(d.accessToken, d.refreshToken ?? '');
        router.push('/dashboard');
      } else {
        const params = new URLSearchParams({ type: d.userTypeCode ?? type.code, name: d.userTypeDisplayName ?? type.displayName });
        router.push(`/pending-approval?${params.toString()}`);
      }
    } catch {
      if (process.env.NODE_ENV === 'development') {
        router.push(`/pending-approval?type=${type.code}&name=${encodeURIComponent(type.displayName)}`);
        return;
      }
      setApiError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2 Next ───────────────────────────────────────────────────────────
  const goStep2Next = async () => {
    if (!selectedType) { setApiError('Please select an account type.'); return; }
    setApiError(null);
    setFieldsLoading(true);
    try {
      const res = await api.get<unknown, { data: UserTypeFieldSchema[] }>(`/user-types/${selectedType.code}/fields`) as { data: UserTypeFieldSchema[] };
      const fetched = res.data ?? [];
      setFields(fetched);
      const init: Record<string, FieldValue> = {};
      for (const f of fetched) {
        if (f.fieldType === 'boolean') init[f.fieldKey] = false;
        else if (f.fieldType === 'multi_select') init[f.fieldKey] = [];
        else init[f.fieldKey] = '';
      }
      setFieldValues(init);
      if (fetched.length === 0) { await submitRegistration({}, selectedType); }
      else { setStep(3); }
    } catch {
      if (process.env.NODE_ENV === 'development') {
        const BUSI = ['TRAVEL_AGENT', 'DMC_PROVIDER'];
        if (BUSI.includes(selectedType.code)) {
          setFields(MOCK_FIELDS);
          setFieldValues({ businessName: '', gstNumber: '' });
          setStep(3);
        } else {
          await submitRegistration({}, selectedType);
        }
      } else {
        setApiError('Failed to load profile fields.');
      }
    } finally {
      setFieldsLoading(false);
    }
  };

  // ── Step 3 validate + submit ──────────────────────────────────────────────
  const handleStep3Submit = async () => {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      const val = fieldValues[f.fieldKey];
      if (f.isRequired) {
        if (f.fieldType === 'multi_select' && (!Array.isArray(val) || val.length === 0)) errs[f.fieldKey] = `${f.label} is required`;
        else if (f.fieldType !== 'boolean' && (val === '' || val === null || val === undefined)) errs[f.fieldKey] = `${f.label} is required`;
      }
      if (f.validationRegex && typeof val === 'string' && val.length > 0 && !new RegExp(f.validationRegex).test(val))
        errs[f.fieldKey] = f.helpText ? `Invalid: ${f.helpText}` : `Invalid format`;
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0 || !selectedType) return;
    const profileData: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fieldValues)) {
      if (v !== '' && v !== null && v !== undefined) profileData[k] = v;
    }
    await submitRegistration(profileData, selectedType);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="tos-login-card__logo">
        <Icon name="Plane" size={28} />
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>TravelOS</span>
      </div>
      <h2 className="tos-login-card__title">Create Account</h2>
      <p className="tos-login-card__subtitle" style={{ marginBottom: 16 }}>
        {step === 1 && 'Enter your details to get started'}
        {step === 2 && 'What best describes you?'}
        {step === 3 && `Set up your ${selectedType?.displayName ?? 'profile'}`}
      </p>
      <StepDots step={step} total={3} />

      <AnimatePresence>
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--tos-border-radius)', color: '#fca5a5', fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}
            role="alert"
          >
            <Icon name="CircleAlert" size={14} />{apiError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <form onSubmit={handleSubmit(onStep1Valid)} noValidate>
            <div className="tos-login-field">
              <label htmlFor="rf-name">Full Name</label>
              <input id="rf-name" type="text" placeholder="John Doe" autoComplete="name" className={errors.name ? 'tos-error' : ''} {...register('name')} />
              {errors.name && <div className="tos-login-field__error" role="alert">{errors.name.message}</div>}
            </div>
            <div className="tos-login-field">
              <label htmlFor="rf-email">Email Address</label>
              <input id="rf-email" type="email" placeholder="you@company.com" autoComplete="email" className={errors.email ? 'tos-error' : ''} {...register('email')} />
              {errors.email && <div className="tos-login-field__error" role="alert">{errors.email.message}</div>}
            </div>
            <div className="tos-login-field">
              <label htmlFor="rf-phone">Phone Number</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select aria-label="Country code" style={{ width: 110, flexShrink: 0, padding: '10px 8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--tos-border-radius)', color: '#ffffff', fontSize: 13, outline: 'none' }} {...register('isdCode')}>
                  {ISD_CODES.map((c) => <option key={c.code} value={c.code} style={{ background: '#1a2a3a', color: '#ffffff' }}>{c.label}</option>)}
                </select>
                <input id="rf-phone" type="text" inputMode="numeric" placeholder="9876543210" className={errors.phone ? 'tos-error' : ''} style={{ flex: 1 }} {...register('phone')} />
              </div>
              {errors.phone && <div className="tos-login-field__error" role="alert">{errors.phone.message}</div>}
            </div>
            <div className="tos-login-field">
              <label htmlFor="rf-pw">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="rf-pw" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" autoComplete="new-password" style={{ paddingRight: 40 }} className={errors.password ? 'tos-error' : ''} {...register('password')} />
                <button type="button" onClick={() => setShowPw((s) => !s)} aria-label="Toggle password" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name={showPw ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
              {errors.password && <div className="tos-login-field__error" role="alert">{errors.password.message}</div>}
            </div>
            <div className="tos-login-field">
              <label htmlFor="rf-cpw">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input id="rf-cpw" type={showCpw ? 'text' : 'password'} placeholder="Re-enter password" autoComplete="new-password" style={{ paddingRight: 40 }} className={errors.confirmPassword ? 'tos-error' : ''} {...register('confirmPassword')} />
                <button type="button" onClick={() => setShowCpw((s) => !s)} aria-label="Toggle confirm password" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name={showCpw ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
              {errors.confirmPassword && <div className="tos-login-field__error" role="alert">{errors.confirmPassword.message}</div>}
            </div>
            <button type="submit" className="tos-login-btn" style={{ marginTop: 8 }}>
              <Icon name="ArrowRight" size={16} /> Next
            </button>
          </form>
        </motion.div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {typesLoading && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.5)' }}>
              <LoadingBarsInline /><div style={{ marginTop: 8, fontSize: 13 }}>Loading types…</div>
            </div>
          )}
          {!typesLoading && userTypes.map((t) => (
            <TypeCardRF key={t.code} item={t} selected={selectedType?.code === t.code}
              onSelect={() => { setSelectedType(t); setApiError(null); }} />
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--tos-border-radius)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontWeight: 500 }}>Back</button>
            <button type="button" className="tos-login-btn" onClick={() => void goStep2Next()} disabled={!selectedType || fieldsLoading} style={{ flex: 2, marginTop: 0 }} aria-busy={fieldsLoading}>
              {fieldsLoading ? <><LoadingBarsInline /> Loading…</> : <><Icon name="ArrowRight" size={16} /> Next</>}
            </button>
          </div>
        </motion.div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {[...fields].sort((a, b) => a.sortOrder - b.sortOrder).map((field) => (
            <div key={field.fieldKey} className="tos-login-field">
              {field.fieldType !== 'boolean' && (
                <label htmlFor={`rf-${field.fieldKey}`}>
                  {field.label}
                  {field.isRequired && <span aria-hidden="true" style={{ color: '#fca5a5', marginLeft: 2 }}>*</span>}
                </label>
              )}
              <DynamicFieldRF field={field} value={fieldValues[field.fieldKey] ?? ''} error={fieldErrors[field.fieldKey]}
                onChange={(val) => setFieldValues((prev) => ({ ...prev, [field.fieldKey]: val }))} />
              {field.helpText && !fieldErrors[field.fieldKey] && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{field.helpText}</div>
              )}
              {fieldErrors[field.fieldKey] && <div className="tos-login-field__error" role="alert">{fieldErrors[field.fieldKey]}</div>}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--tos-border-radius)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontWeight: 500 }}>Back</button>
            <button type="button" className="tos-login-btn" onClick={() => void handleStep3Submit()} disabled={isSubmitting} style={{ flex: 2, marginTop: 0 }} aria-busy={isSubmitting}>
              {isSubmitting ? <><LoadingBarsInline /> Creating…</> : <><Icon name="UserPlus" size={16} /> Create Account</>}
            </button>
          </div>
        </motion.div>
      )}

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Already have an account? </span>
        <button type="button" onClick={() => onViewChange('login')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 12, fontWeight: 600, textDecoration: 'underline', padding: 0 }}>Sign In</button>
      </div>
    </div>
  );
}
