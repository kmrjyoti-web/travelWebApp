import { useApiMutation, useApiQuery } from './useApiQuery';
import { useQueryClient } from '@tanstack/react-query';
import { itineraryService } from '@/shared/services/itinerary.service';
import { queryKeys } from '@/shared/utils/queryKeys';
import type { FullItineraryFormData } from '@/features/itinerary/types/editor.types';

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

/** Create itinerary mutation — invalidates list on success */
export function useCreateItinerary() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (data: FullItineraryFormData) => itineraryService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.itinerary.all() });
      },
    },
  );
}

/** Update itinerary mutation — invalidates list + detail on success */
export function useUpdateItinerary(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation(
    (data: FullItineraryFormData) => itineraryService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.itinerary.all() });
      },
    },
  );
}

/** Delete itinerary mutation */
export function useDeleteItinerary() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (id: string) => itineraryService.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.itinerary.all() });
      },
    },
  );
}
