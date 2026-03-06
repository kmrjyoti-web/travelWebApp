/**
 * Domain types for user-types API endpoints.
 * Matches backend DTOs for /api/v1/user-types/*
 */

// ── Dropdown item (Step 2 card list) ─────────────────────────────────────────
export interface UserTypeDropdownItem {
  code: string;
  displayName: string;
  description: string;
  iconName: string;
  colorHex: string;
  group: string;
  selfRegistrationAllowed: boolean;
  requiresApproval: boolean;
}

// ── Field schema (Step 3 dynamic form) ───────────────────────────────────────
export type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'phone'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'file_upload'
  | 'date'
  | 'boolean';

export interface FieldOption {
  label: string;
  value: string;
}

export interface UserTypeFieldSchema {
  fieldKey: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  placeholder?: string;
  helpText?: string;
  validationRegex?: string;
  options?: FieldOption[];
  sortOrder: number;
}

// ── /api/v1/user-types/me response ───────────────────────────────────────────
export interface MenuConfigItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuConfigItem[];
  badge?: string;
}

export interface MenuConfig {
  sidebar: MenuConfigItem[];
  topbar: {
    quickActions: MenuConfigItem[];
  };
}

export interface AppConfig {
  features: Record<string, boolean>;
  limits: Record<string, number>;
  onboarding: {
    required: boolean;
    steps: string[];
    completedSteps?: string[];
  };
}

export interface OtherConfig {
  theme?: Record<string, string>;
  notifications?: Record<string, boolean>;
  [key: string]: unknown;
}

export interface MyUserTypeResponse {
  typeCode: string;
  displayName: string;
  parentCode?: string;
  menuConfig: MenuConfig;
  appConfig: AppConfig;
  otherConfig: OtherConfig;
}

// ── Register-with-type payload + response ─────────────────────────────────────
export interface RegisterWithTypePayload {
  name: string;
  email: string;
  phone: string;
  isdCode: string;
  password: string;
  userTypeCode: string;
  profileData: Record<string, unknown>;
  /** ISO 3166-1 alpha-2 country code derived from the ISD selector (e.g. 'IN'). */
  countryIso2?: string;
  /** Country-specific business tax identifier (e.g. GST for IN, VAT for AE). */
  taxIdValue?: string;
}

export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface RegisterWithTypeResponse {
  userId: string;
  email: string;
  name: string;
  userTypeCode: string;
  userTypeDisplayName: string;
  approvalStatus: ApprovalStatus;
  verificationSla?: string;
  accessToken?: string;
  refreshToken?: string;
}
