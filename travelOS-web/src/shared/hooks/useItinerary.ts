import { useApiMutation, useApiQuery } from './useApiQuery';
import { itineraryService } from '@/shared/services/itinerary.service';
import { queryKeys } from '@/shared/utils/queryKeys';
import type { SelfItineraryFormData } from '@/features/itinerary/types/itinerary.types';

/** List all itineraries */
export function useItineraryList(params?: { page?: number; limit?: number }) {
  return useApiQuery(
    queryKeys.itinerary.list(params),
    () => itineraryService.list(params),
  );
}

/** Get single itinerary */
export function useItinerary(id: string) {
  return useApiQuery(
    queryKeys.itinerary.detail(id),
    () => itineraryService.getById(id),
    { enabled: !!id },
  );
}

/** Create itinerary mutation */
export function useCreateItinerary() {
  return useApiMutation((data: SelfItineraryFormData) => itineraryService.create(data));
}
