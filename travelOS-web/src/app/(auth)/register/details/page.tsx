'use client';
/**
 * /register/details — Step 3: Dynamic profile fields + smart tax ID.
 * Guards: redirects to /register/type if Step 2 is not complete.
 * Reads field schemas from sessionStorage (written by Step 2 page).
 * Fetches tax config for the user's country via GET /api/v1/tax-config/{iso2}.
 * On submit: calls POST /api/v1/auth/register-with-type.
 * If approvalStatus === 'pending' → /under-review; otherwise → /dashboard.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundStage } from '@/features/auth/components/BackgroundStage';
import { LoginThemeSwitcher } from '@/features/auth/components/LoginThemeSwitcher';
import { RegistrationStep3 } from '@/features/auth/components/RegistrationStep3';
import { useLoginTheme, THEME_CONFIG } from '@/features/auth/hooks/useLoginTheme';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useRegistrationStore } from '@/features/auth/stores/registration.store';
import { authService } from '@/shared/services/auth.service';
import type { UserTypeFieldSchema } from '@/features/auth/types/user-type.types';

// ── Tax config type ────────────────────────────────────────────────────────────
interface TaxConfig {
  taxIdType: string;
  taxIdLabel: string;
  taxIdPlaceholder?: string;
  taxIdRegex?: string;
  isRequiredForBusiness: boolean;
  hasTaxSystem: boolean;
  helpText?: string;
}

export default function RegisterDetailsPage() {
  const [hydrated, setHydrated] = useState(false);
  const [fields, setFields] = useState<UserTypeFieldSchema[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tax ID state
  const [taxIdValue, setTaxIdValue] = useState('');
  const [taxIdError, setTaxIdError] = useState<string | null>(null);
  const [taxConfig, setTaxConfig] = useState<TaxConfig | null>(null);

  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { setUser, setTokens } = useAuthStore();
  const { mode } = useLoginTheme();
  const config = THEME_CONFIG[mode];

  const {
    email, name, phone, isdCode, password,
    userTypeCode, userTypeDisplayName, profileData,
    countryIso2,
  } = useRegistrationStore();

  // ── Read fields from sessionStorage ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('tos-reg-fields');
      if (raw) {
        try {
          setFields(JSON.parse(raw) as UserTypeFieldSchema[]);
        } catch {
          setFields([]);
        }
      }
    }
    setHydrated(true);
  }, []);

  // ── Guards ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
    if (hydrated && !isAuthenticated && !userTypeCode) {
      router.replace('/register/type');
    }
    if (hydrated && !isAuthenticated && !email) {
      router.replace('/register');
    }
  }, [hydrated, isAuthenticated, userTypeCode, email, router]);

  // ── Fetch tax config when countryIso2 changes ─────────────────────────────────
  useEffect(() => {
    if (!countryIso2 || countryIso2 === 'XX') {
      setTaxConfig(null);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/tax-config/${countryIso2}`)
      .then((r) => r.json())
      .then((data: { data?: TaxConfig }) => setTaxConfig(data.data ?? null))
      .catch(() => setTaxConfig(null));
  }, [countryIso2]);

  if (!hydrated || isAuthenticated || !userTypeCode || !email) return null;

  // ── Submit handler ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // Validate tax ID
    if (taxConfig && taxConfig.hasTaxSystem && taxConfig.isRequiredForBusiness) {
      if (!taxIdValue.trim()) {
        setTaxIdError(`${taxConfig.taxIdLabel} is required`);
        return;
      }
      if (taxConfig.taxIdRegex) {
        const regex = new RegExp(taxConfig.taxIdRegex);
        if (!regex.test(taxIdValue.trim())) {
          setTaxIdError(`Invalid ${taxConfig.taxIdLabel} format`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await authService.registerWithType({
        name, email, phone, isdCode, password,
        userTypeCode,
        profileData,
        countryIso2,
        taxIdValue: taxIdValue.trim() || undefined,
      }) as unknown as {
        data: {
          approvalStatus: string;
          userTypeCode: string;
          userTypeDisplayName: string;
          accessToken?: string;
          refreshToken?: string;
          userId?: string;
          verificationSla?: string;
        };
      };

      const respData = res.data;

      // Clean up sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('tos-reg-fields');
      }

      if (respData.approvalStatus === 'approved' && respData.accessToken) {
        setUser({
          id: respData.userId ?? 'unknown',
          email,
          name,
          role: 'agent',
          tenantId: 'default',
          productId: 'travel-os',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setTokens(respData.accessToken, respData.refreshToken ?? '');
        router.push('/dashboard');
      } else {
        // approvalStatus === 'pending' → under-review page
        const params = new URLSearchParams({
          type: respData.userTypeCode ?? userTypeCode,
          name: respData.userTypeDisplayName ?? userTypeDisplayName,
          ...(respData.verificationSla ? { sla: respData.verificationSla } : {}),
          submitted: new Date().toISOString(),
        });
        router.push(`/under-review?${params.toString()}`);
      }
    } catch {
      if (process.env.NODE_ENV === 'development') {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('tos-reg-fields');
        }
        const params = new URLSearchParams({
          type: userTypeCode,
          name: userTypeDisplayName,
          submitted: new Date().toISOString(),
        });
        router.push(`/under-review?${params.toString()}`);
        return;
      }
      setSubmitError('Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <BackgroundStage />
      <LoginThemeSwitcher />

      <div
        style={{
          position: 'absolute',
          top: 'var(--tos-spacing-lg)',
          left: 'var(--tos-spacing-lg)',
          zIndex: 20,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          {config.emoji} {config.greeting}
        </div>
        <div style={{ fontSize: 11, opacity: 0.5 }}>{config.description}</div>
      </div>

      <div className="tos-login-container">
        <div className="tos-login-card">
          {submitError && (
            <div
              style={{
                padding: '10px 14px', background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--tos-border-radius)',
                color: '#fca5a5', fontSize: 13, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              role="alert"
            >
              {submitError}
            </div>
          )}

          {isSubmitting ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.7)' }}>
              Creating your account…
            </div>
          ) : (
            <>
              <RegistrationStep3
                fields={fields}
                onSubmit={() => void handleSubmit()}
                onBack={() => router.push('/register/type')}
                extraFields={
                  taxConfig && taxConfig.hasTaxSystem ? (
                    <div className="tos-login-field">
                      <label htmlFor="tax-id">
                        {taxConfig.taxIdLabel}
                        {taxConfig.isRequiredForBusiness && (
                          <span style={{ color: '#fca5a5', marginLeft: 4 }} aria-label="required">*</span>
                        )}
                      </label>
                      <input
                        id="tax-id"
                        type="text"
                        placeholder={taxConfig.taxIdPlaceholder ?? ''}
                        value={taxIdValue}
                        onChange={(e) => {
                          setTaxIdValue(e.target.value);
                          setTaxIdError(null);
                        }}
                        className={taxIdError ? 'tos-error' : ''}
                        aria-describedby={taxConfig.helpText ? 'tax-id-help' : undefined}
                        aria-required={taxConfig.isRequiredForBusiness}
                        aria-invalid={taxIdError !== null}
                      />
                      {taxConfig.helpText && (
                        <div
                          id="tax-id-help"
                          style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}
                        >
                          {taxConfig.helpText}
                        </div>
                      )}
                      {taxIdError && (
                        <div className="tos-login-field__error" role="alert">{taxIdError}</div>
                      )}
                    </div>
                  ) : null
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
