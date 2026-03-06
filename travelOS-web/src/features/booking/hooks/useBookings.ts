import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { queryKeys } from '@/shared/utils/queryKeys';
import { bookingService } from '@/shared/services/booking.service';
import type { BookingRecord, BookingListParams } from '@/shared/services/booking.service';

// ── List ──────────────────────────────────────────────────────────────────────
export function useBookings(params: BookingListParams = {}) {
  return useApiQuery(
    queryKeys.booking.list(params as Record<string, unknown>),
    () => bookingService.list(params),
  );
}

// ── Single ────────────────────────────────────────────────────────────────────
export function useBooking(id: string) {
  return useApiQuery(
    queryKeys.booking.detail(id),
    () => bookingService.getById(id),
    { enabled: Boolean(id) },
  );
}

// ── Cancel ────────────────────────────────────────────────────────────────────
export function useCancelBooking(options?: { onSuccess?: (b: BookingRecord) => void }) {
  const qc = useQueryClient();
  return useApiMutation<BookingRecord, { id: string; reason: string }>(
    ({ id, reason }) => bookingService.cancel(id, reason),
    {
      onSuccess: (res) => {
        void qc.invalidateQueries({ queryKey: queryKeys.booking.all() });
        void qc.invalidateQueries({ queryKey: queryKeys.booking.detail(res.data.id) });
        options?.onSuccess?.(res.data);
      },
    },
  );
}
