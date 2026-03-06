import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';
import type { FullItineraryFormData } from '@/features/itinerary/types/editor.types';
import type { ItineraryActivity, ItineraryDay, ItineraryHotel, ItineraryTransport, ItineraryImage } from '@/features/itinerary/types/editor.types';

const BASE = '/self-itinerary';

export interface ItineraryRecord {
  id: string;
  status: 'draft' | 'confirmed' | 'cancelled';
  source: 'manual' | 'ai' | 'edit';
  title: string | null;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  days: number;
  budget: string;
  accommodationType: string;
  starRating: string;
  food: string;
  interests: string;
  services: string[];
  tripNature: string;
  currency: string;
  adults: number;
  children: number;
  flightDepartureTime: string;
  flightArrivalTime: string;
  trainPreference: string;
  selectedModel: string;
  itineraryDays: ItineraryDay[];
  hotels: ItineraryHotel[];
  transportation: ItineraryTransport[];
  images: ItineraryImage[];
  createdAt: string;
  updatedAt: string;
}

export type { ItineraryActivity, ItineraryDay, ItineraryHotel, ItineraryTransport, ItineraryImage };

const itineraryService = {
  /** Create itinerary */
  create: (data: FullItineraryFormData): Promise<ApiResponse<ItineraryRecord>> =>
    api.post(BASE, data),

  /** Update existing itinerary */
  update: (id: string, data: FullItineraryFormData): Promise<ApiResponse<ItineraryRecord>> =>
    api.put(`${BASE}/${encodeURIComponent(id)}`, data),

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
