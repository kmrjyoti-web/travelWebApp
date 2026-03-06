/**
 * Registration Zustand store — session-only (no persist).
 * Holds multi-step registration state across Step1→Step2→Step3.
 */
import { create } from 'zustand';

// ── Step 1 payload ────────────────────────────────────────────────────────────
export interface Step1Data {
  name: string;
  email: string;
  phone: string;
  isdCode: string;
  /** ISO 3166-1 alpha-2 country code derived from the selected ISD code (e.g. 'IN'). */
  countryIso2?: string;
  password: string;
}

// ── Store shape ───────────────────────────────────────────────────────────────
interface RegistrationState {
  // Step 1
  name: string;
  email: string;
  phone: string;
  isdCode: string;
  /** ISO 3166-1 alpha-2 country code (e.g. 'IN', 'US', 'AE'). Default: 'IN'. */
  countryIso2: string;
  password: string;
  // Step 2
  userTypeCode: string;
  userTypeDisplayName: string;
  hasFields: boolean; // whether step 3 should render
  // Step 3
  profileData: Record<string, unknown>;
  // Navigation
  currentStep: 1 | 2 | 3;
}

interface RegistrationActions {
  setStep1Data: (data: Step1Data) => void;
  setCountryIso2: (iso2: string) => void;
  setUserTypeCode: (code: string, displayName: string, hasFields: boolean) => void;
  setProfileData: (data: Record<string, unknown>) => void;
  setStep: (step: 1 | 2 | 3) => void;
  reset: () => void;
}

export type RegistrationStore = RegistrationState & RegistrationActions;

const INITIAL_STATE: RegistrationState = {
  name: '',
  email: '',
  phone: '',
  isdCode: '+91',
  countryIso2: 'IN',
  password: '',
  userTypeCode: '',
  userTypeDisplayName: '',
  hasFields: false,
  profileData: {},
  currentStep: 1,
};

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  ...INITIAL_STATE,

  setStep1Data: (data) =>
    set({
      name: data.name,
      email: data.email,
      phone: data.phone,
      isdCode: data.isdCode,
      password: data.password,
      ...(data.countryIso2 !== undefined ? { countryIso2: data.countryIso2 } : {}),
    }),

  setCountryIso2: (countryIso2) => set({ countryIso2 }),

  setUserTypeCode: (code, displayName, hasFields) =>
    set({ userTypeCode: code, userTypeDisplayName: displayName, hasFields }),

  setProfileData: (profileData) => set({ profileData }),

  setStep: (currentStep) => set({ currentStep }),

  reset: () => set({ ...INITIAL_STATE }),
}));
