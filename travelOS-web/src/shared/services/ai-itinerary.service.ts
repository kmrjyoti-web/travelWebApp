import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';

export type AIRequestStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface GenerateAIItineraryParams {
  destinationCountry: string;
  destinationCity?: string;
  travelDates: { from: string; to: string };
  durationDays: number;
  budgetPerPerson: number;
  currency?: string;
  groupSize: number;
  theme?: string;
  specialRequirements?: string;
}

export interface AIRequestStatusResult {
  requestId: string;
  status: AIRequestStatus;
  draftId?: string;
  errorMessage?: string;
  progressPercent?: number;
}

export interface AIDayActivity {
  time: string;
  name: string;
  location: string;
  estimatedCost: number;
  currency: string;
  transportToNext?: string;
  notes?: string;
  category?: string;
}

export interface AIDayAccommodation {
  name: string;
  stars?: number;
  estPricePerNight: number;
  currency: string;
}

export interface AIDayPlanItem {
  day: number;
  title: string;
  weatherNote?: string;
  activities: AIDayActivity[];
  accommodation?: AIDayAccommodation;
}

export interface AIItineraryDraft {
  id: string;
  requestId: string;
  title: string;
  dayPlan: AIDayPlanItem[];
  includes: string[];
  excludes: string[];
  totalEstimatedCost: number;
  currency: string;
  packingSuggestions: string[];
  weatherSummary?: string;
  eventsDuringTrip: string[];
}

export interface EditDraftParams {
  title?: string;
  dayPlan?: AIDayPlanItem[];
  includes?: string[];
  excludes?: string[];
  packingSuggestions?: string[];
}

export interface ConvertDraftResult {
  itineraryId: string;
  forkId: string;
  message: string;
}

export const aiItineraryService = {
  generate: (params: GenerateAIItineraryParams): Promise<ApiResponse<{ requestId: string }>> =>
    api.post('/ai-itinerary/generate', params),

  getStatus: (requestId: string): Promise<ApiResponse<AIRequestStatusResult>> =>
    api.get(`/ai-itinerary/${requestId}/status`),

  getDraft: (draftId: string): Promise<ApiResponse<AIItineraryDraft>> =>
    api.get(`/ai-itinerary/drafts/${draftId}`),

  editDraft: (draftId: string, params: EditDraftParams): Promise<ApiResponse<AIItineraryDraft>> =>
    api.patch(`/ai-itinerary/drafts/${draftId}`, params),

  convertToFork: (draftId: string): Promise<ApiResponse<ConvertDraftResult>> =>
    api.post(`/ai-itinerary/drafts/${draftId}/convert`),
};
