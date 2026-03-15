/**
 * API Config feature types
 * Matches backend DTOs for /api/v1/api-config
 */

export type ApiConfigProvider =
  | 'cloudinary'
  | 'stripe'
  | 'razorpay'
  | 'twilio'
  | 'sendgrid'
  | 'firebase';

export interface ApiConfigSummary {
  id: string;
  provider: ApiConfigProvider;
  displayName: string;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt: string | null;
  maskedKey: string | null;
  updatedAt: string;
}

export interface UpsertApiConfigPayload {
  provider: ApiConfigProvider;
  displayName: string;
  credentials: Record<string, string>;
}

export interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface VerifyResult {
  success: boolean;
  message: string;
}
