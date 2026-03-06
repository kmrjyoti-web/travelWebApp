import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { queryKeys } from '@/shared/utils/queryKeys';
import { b2bService } from '@/shared/services/b2b.service';
import type {
  B2BListingRecord, B2BOrderRecord, RFQRecord,
  ListingListParams, OrderListParams, RFQListParams,
} from '@/shared/services/b2b.service';

// ── Listings ──────────────────────────────────────────────────────────────────
export function useB2BListings(params: ListingListParams = {}) {
  return useApiQuery(
    queryKeys.b2b.listings(params as Record<string, unknown>),
    () => b2bService.getListings(params),
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────
export function useB2BOrders(params: OrderListParams = {}) {
  return useApiQuery(
    queryKeys.b2b.orders(params as Record<string, unknown>),
    () => b2bService.getOrders(params),
  );
}

export function useConfirmB2BOrder(options?: { onSuccess?: (o: B2BOrderRecord) => void }) {
  const qc = useQueryClient();
  return useApiMutation<B2BOrderRecord, string>(
    (id) => b2bService.confirmOrder(id),
    {
      onSuccess: (res) => {
        void qc.invalidateQueries({ queryKey: queryKeys.b2b.all() });
        options?.onSuccess?.(res.data);
      },
    },
  );
}

// ── RFQs ──────────────────────────────────────────────────────────────────────
export function useRFQs(params: RFQListParams = {}) {
  return useApiQuery(
    queryKeys.b2b.rfqs(params as Record<string, unknown>),
    () => b2bService.getRFQs(params),
  );
}

export function useCreateRFQ(options?: { onSuccess?: (r: RFQRecord) => void }) {
  const qc = useQueryClient();
  return useApiMutation<RFQRecord, Parameters<typeof b2bService.createRFQ>[0]>(
    (data) => b2bService.createRFQ(data),
    {
      onSuccess: (res) => {
        void qc.invalidateQueries({ queryKey: queryKeys.b2b.rfqs() });
        options?.onSuccess?.(res.data);
      },
    },
  );
}
