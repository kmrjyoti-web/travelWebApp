import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { queryKeys } from '@/shared/utils/queryKeys';
import { itineraryService } from '@/shared/services/itinerary.service';
import type { ItineraryRecord } from '@/shared/services/itinerary.service';
import type { FullItineraryFormData } from '../types/editor.types';

// ── List ─────────────────────────────────────────────────────────────────────
export interface UseItinerariesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useItineraries(params: UseItinerariesParams = {}) {
  return useApiQuery(
    queryKeys.itinerary.list(params as Record<string, unknown>),
    () => itineraryService.list(params),
  );
}

// ── Single ────────────────────────────────────────────────────────────────────
export function useItinerary(id: string) {
  return useApiQuery(
    queryKeys.itinerary.detail(id),
    () => itineraryService.getById(id),
    { enabled: Boolean(id) },
  );
}

// ── Create ────────────────────────────────────────────────────────────────────
export function useCreateItinerary(options?: {
  onSuccess?: (record: ItineraryRecord) => void;
}) {
  const qc = useQueryClient();
  return useApiMutation<ItineraryRecord, FullItineraryFormData>(
    (data) => itineraryService.create(data),
    {
      onSuccess: (res) => {
        void qc.invalidateQueries({ queryKey: queryKeys.itinerary.all() });
        options?.onSuccess?.(res.data);
      },
    },
  );
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateItinerary(id: string, options?: {
  onSuccess?: (record: ItineraryRecord) => void;
}) {
  const qc = useQueryClient();
  return useApiMutation<ItineraryRecord, FullItineraryFormData>(
    (data) => itineraryService.update(id, data),
    {
      onSuccess: (res) => {
        void qc.invalidateQueries({ queryKey: queryKeys.itinerary.all() });
        void qc.invalidateQueries({ queryKey: queryKeys.itinerary.detail(id) });
        options?.onSuccess?.(res.data);
      },
    },
  );
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteItinerary(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useApiMutation<void, string>(
    (id) => itineraryService.remove(id),
    {
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: queryKeys.itinerary.all() });
        options?.onSuccess?.();
      },
    },
  );
}
