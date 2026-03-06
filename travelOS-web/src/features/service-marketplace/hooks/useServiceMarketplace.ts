import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { serviceMarketplaceService } from '@/shared/services/service-marketplace.service';
import type {
  ServiceListing,
  ServiceBooking,
  PaginatedResult,
  SearchListingsParams,
  CreateListingParams,
  BookServiceParams,
} from '@/shared/services/service-marketplace.service';

export function useServiceListings(params?: SearchListingsParams) {
  return useApiQuery<PaginatedResult<ServiceListing>>(
    ['service-marketplace', 'listings', params],
    () => serviceMarketplaceService.searchListings(params),
  );
}

export function useServiceListing(id: string | null) {
  return useApiQuery<ServiceListing>(
    ['service-marketplace', 'listing', id],
    () => serviceMarketplaceService.getListing(id!),
    { enabled: !!id },
  );
}

export function useServiceBookings(role: 'provider' | 'customer', page = 1) {
  return useApiQuery<PaginatedResult<ServiceBooking>>(
    ['service-marketplace', 'bookings', role, page],
    () => serviceMarketplaceService.getBookings(role, page),
  );
}

export function useCreateListing(options?: { onSuccess?: (listing: ServiceListing) => void }) {
  return useApiMutation<ServiceListing, CreateListingParams>(
    (params) => serviceMarketplaceService.createListing(params),
    { onSuccess: (res) => options?.onSuccess?.(res.data) },
  );
}

export function usePublishListing(options?: { onSuccess?: () => void }) {
  return useApiMutation<ServiceListing, string>(
    (id) => serviceMarketplaceService.publishListing(id),
    { onSuccess: () => options?.onSuccess?.() },
  );
}

export function useBookService(options?: { onSuccess?: (booking: ServiceBooking) => void }) {
  return useApiMutation<ServiceBooking, BookServiceParams>(
    (params) => serviceMarketplaceService.bookService(params),
    { onSuccess: (res) => options?.onSuccess?.(res.data) },
  );
}

export function useConfirmServiceBooking(options?: { onSuccess?: () => void }) {
  return useApiMutation<ServiceBooking, string>(
    (id) => serviceMarketplaceService.confirmBooking(id),
    { onSuccess: () => options?.onSuccess?.() },
  );
}

export function useCancelServiceBooking(options?: { onSuccess?: () => void }) {
  return useApiMutation<ServiceBooking, { id: string; reason?: string }>(
    ({ id, reason }) => serviceMarketplaceService.cancelBooking(id, reason),
    { onSuccess: () => options?.onSuccess?.() },
  );
}
