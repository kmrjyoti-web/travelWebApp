/**
 * useUserType — Zustand store + hook for the authenticated user's type config.
 *
 * Loads from GET /api/v1/user-types/me and exposes:
 *   loadMyUserType()   — fetch and cache in store
 *   canDo(feature)     — appConfig.features[feature] === true
 *   isType(code)       — typeCode === code
 *   isChildOf(parent)  — typeCode path contains parentCode
 */
import { create } from 'zustand';
import { api } from '@/shared/services/api';
import type {
  MenuConfig,
  AppConfig,
  OtherConfig,
  MyUserTypeResponse,
} from '@/features/auth/types/user-type.types';

// ── Store shape ───────────────────────────────────────────────────────────────
interface UserTypeState {
  typeCode: string | null;
  displayName: string | null;
  parentCode: string | null;
  menuConfig: MenuConfig | null;
  appConfig: AppConfig | null;
  otherConfig: OtherConfig | null;
  isLoading: boolean;
  error: string | null;
}

interface UserTypeActions {
  loadMyUserType: () => Promise<void>;
  canDo: (feature: string) => boolean;
  isType: (code: string) => boolean;
  isChildOf: (parentCode: string) => boolean;
  reset: () => void;
}

export type UserTypeStore = UserTypeState & UserTypeActions;

// ── Initial state ─────────────────────────────────────────────────────────────
const INITIAL: UserTypeState = {
  typeCode: null,
  displayName: null,
  parentCode: null,
  menuConfig: null,
  appConfig: null,
  otherConfig: null,
  isLoading: false,
  error: null,
};

// ── Store ─────────────────────────────────────────────────────────────────────
export const useUserTypeStore = create<UserTypeStore>((set, get) => ({
  ...INITIAL,

  loadMyUserType: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = (await api.get<unknown, { data: MyUserTypeResponse }>(
        '/user-types/me'
      )) as { data: MyUserTypeResponse };
      const d = res.data;
      set({
        typeCode: d.typeCode,
        displayName: d.displayName,
        parentCode: d.parentCode ?? null,
        menuConfig: d.menuConfig,
        appConfig: d.appConfig,
        otherConfig: d.otherConfig,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, error: 'Failed to load user type configuration.' });
    }
  },

  canDo: (feature: string): boolean => {
    const { appConfig } = get();
    if (!appConfig) return false;
    return appConfig.features[feature] === true;
  },

  isType: (code: string): boolean => {
    return get().typeCode === code;
  },

  /**
   * isChildOf checks whether the current user's typeCode "belongs under"
   * a given parent code. The simplest convention is that child codes are
   * prefixed with the parent code (e.g. AGENT_CORPORATE is a child of AGENT).
   * Adjust this logic to match whatever hierarchy the backend uses.
   */
  isChildOf: (parentCode: string): boolean => {
    const { typeCode } = get();
    if (!typeCode) return false;
    return typeCode === parentCode || typeCode.startsWith(`${parentCode}_`);
  },

  reset: () => set({ ...INITIAL }),
}));

// ── Convenience hook (alias for ergonomic destructuring) ──────────────────────
export function useUserType(): UserTypeStore {
  return useUserTypeStore();
}
