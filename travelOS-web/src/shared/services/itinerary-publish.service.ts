import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';
import type { PublishPackageData, PublishStatus } from '@/features/itinerary/publisher/types/publish.types';

const BASE = '/packages';

export interface PackageSummary {
  id: string;
  title: string;
  status: PublishStatus;
  destinationCountry: string;
  destinationCity: string;
  durationDays: number;
  durationNights: number;
  sellingPrice: number;
  currency: string;
  coverImageUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublishPackageResult {
  id: string;
  status: PublishStatus;
  publishedAt?: string;
  message: string;
}

const itineraryPublishService = {
  /** List all packages (drafts + published) for current tenant */
  list: (params?: { page?: number; limit?: number; status?: PublishStatus }): Promise<ApiResponse<PackageSummary[]>> =>
    api.get(BASE, { params }),

  /** Load a single package for editing */
  getById: (id: string): Promise<ApiResponse<PublishPackageData>> =>
    api.get(`${BASE}/${encodeURIComponent(id)}`),

  /** Create new package (saves as draft) */
  create: (data: PublishPackageData): Promise<ApiResponse<PublishPackageResult>> =>
    api.post(BASE, data),

  /** Save draft (upsert) */
  saveDraft: (id: string, data: PublishPackageData): Promise<ApiResponse<PublishPackageResult>> =>
    api.put(`${BASE}/${encodeURIComponent(id)}/draft`, data),

  /** Submit for review / publish */
  publish: (id: string): Promise<ApiResponse<PublishPackageResult>> =>
    api.post(`${BASE}/${encodeURIComponent(id)}/publish`),

  /** Unpublish */
  unpublish: (id: string): Promise<ApiResponse<PublishPackageResult>> =>
    api.post(`${BASE}/${encodeURIComponent(id)}/unpublish`),

  /** Delete (draft only) */
  remove: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`${BASE}/${encodeURIComponent(id)}`),

  /** Upload image via storage service, returns public URL */
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'itinerary-images');
    const res: ApiResponse<any> = await api.post('/storage/upload-image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    // Storage returns { original: { url, ... }, thumb?, medium?, large? }
    const url = res.data?.original?.url ?? res.data?.url ?? '';
    return { success: res.success, data: { url } };
  },
};

export { itineraryPublishService };
