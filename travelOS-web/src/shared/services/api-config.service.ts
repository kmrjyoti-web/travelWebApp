/**
 * API Config service — all CRUD + verify calls for /api/v1/api-config
 * Shared service: imported by settings feature hooks ONLY (Rule 5)
 */
import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  ApiConfigSummary,
  UpsertApiConfigPayload,
  VerifyResult,
} from '@/features/settings/types/api-config.types';

const BASE = '/api-config';

export const apiConfigService = {
  /**
   * List all API config summaries for the current tenant.
   */
  list: (): Promise<ApiResponse<ApiConfigSummary[]>> => api.get(BASE),

  /**
   * Get a single config by provider slug.
   */
  getByProvider: (provider: string): Promise<ApiResponse<ApiConfigSummary>> =>
    api.get(`${BASE}/${provider}`),

  /**
   * Create or update an API config (upsert by provider).
   */
  upsert: (payload: UpsertApiConfigPayload): Promise<ApiResponse<ApiConfigSummary>> =>
    api.post(BASE, payload),

  /**
   * Remove an API config by provider slug.
   */
  remove: (provider: string): Promise<ApiResponse<void>> =>
    api.delete(`${BASE}/${provider}`),

  /**
   * Trigger a live verification test against the provider's API.
   */
  verify: (provider: string): Promise<ApiResponse<VerifyResult>> =>
    api.post(`${BASE}/${provider}/verify`),
};
