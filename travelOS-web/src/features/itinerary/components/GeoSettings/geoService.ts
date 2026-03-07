/**
 * GeoSettings API service.
 * All calls go through the shared api client — never raw fetch.
 * The axios response interceptor unwraps to `response.data`, so we cast via `unknown`.
 */
import { api } from '@/shared/services/api';
import type { GeoSettings, GeoScoreResult, FaqItem, GeoPreviewResult } from './types';

const BASE = (id: string): string => `/itinerary/${id}/geo`;

export const geoService = {
  /**
   * Fetch existing GEO settings for an itinerary.
   */
  getSettings: (id: string): Promise<GeoSettings> =>
    api.get<GeoSettings>(BASE(id)) as unknown as Promise<GeoSettings>,

  /**
   * Persist updated GEO settings.
   */
  updateSettings: (id: string, data: Partial<GeoSettings>): Promise<GeoSettings> =>
    api.put<GeoSettings>(BASE(id), data) as unknown as Promise<GeoSettings>,

  /**
   * Trigger AI auto-fill for all GEO fields.
   */
  autoFill: (id: string): Promise<GeoSettings> =>
    api.post<GeoSettings>(`${BASE(id)}/auto-fill`) as unknown as Promise<GeoSettings>,

  /**
   * Retrieve the calculated GEO score + breakdown.
   */
  getScore: (id: string): Promise<GeoScoreResult> =>
    api.get<GeoScoreResult>(`${BASE(id)}/score`) as unknown as Promise<GeoScoreResult>,

  /**
   * Fetch JSON-LD + meta tag preview for the current settings.
   */
  getPreview: (id: string): Promise<GeoPreviewResult> =>
    api.get<GeoPreviewResult>(`${BASE(id)}/preview`) as unknown as Promise<GeoPreviewResult>,

  /**
   * Generate AI-suggested FAQs for the itinerary.
   */
  generateFaqs: (id: string): Promise<{ faqs: FaqItem[] }> =>
    api.post<{ faqs: FaqItem[] }>(`${BASE(id)}/faq`) as unknown as Promise<{ faqs: FaqItem[] }>,
};
