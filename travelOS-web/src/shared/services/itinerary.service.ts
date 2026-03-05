import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';
import type { SelfItineraryFormData } from '@/features/itinerary/types/itinerary.types';

const BASE = '/self-itinerary';

export interface ItineraryRecord {
  id: string;
  status: 'draft' | 'confirmed' | 'cancelled';
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  days: number;
  budget: string;
  createdAt: string;
}

const itineraryService = {
  /** Create a self-planned itinerary */
  create: (data: SelfItineraryFormData): Promise<ApiResponse<ItineraryRecord>> =>
    api.post(BASE, data),

  /** List itineraries with optional pagination */
  list: (params?: { page?: number; limit?: number }): Promise<ApiResponse<ItineraryRecord[]>> =>
    api.get(BASE, { params }),

  /** Get single itinerary by ID */
  getById: (id: string): Promise<ApiResponse<ItineraryRecord>> =>
    api.get(`${BASE}/${encodeURIComponent(id)}`),

  /** Delete an itinerary */
  remove: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`${BASE}/${encodeURIComponent(id)}`),
};

export { itineraryService };
