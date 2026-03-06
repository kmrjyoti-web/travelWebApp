import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { b2cService } from '@/shared/services/b2c.service';
import type {
  HomepageSections,
  PaginatedResult,
  B2CListing,
  B2CReview,
  WishlistItem,
  SearchListingsParams,
} from '@/shared/services/b2c.service';

export function useB2CHomepage() {
  return useApiQuery<HomepageSections>(
    ['b2c', 'homepage'],
    () => b2cService.getHomepage(),
  );
}

export function useB2CListings(params?: SearchListingsParams) {
  return useApiQuery<PaginatedResult<B2CListing>>(
    ['b2c', 'listings', params],
    () => b2cService.searchListings(params),
  );
}

export function useB2CListing(id: string | null) {
  return useApiQuery<B2CListing>(
    ['b2c', 'listing', id],
    () => b2cService.getListingDetail(id!),
    { enabled: !!id },
  );
}

export function useB2CReviews(listingId: string | null, page = 1) {
  return useApiQuery<PaginatedResult<B2CReview>>(
    ['b2c', 'reviews', listingId, page],
    () => b2cService.getReviews(listingId!, page),
    { enabled: !!listingId },
  );
}

export function useB2CWishlist(page = 1) {
  return useApiQuery<PaginatedResult<WishlistItem>>(
    ['b2c', 'wishlist', page],
    () => b2cService.getWishlist(page),
  );
}

export function useAddToWishlist(options?: { onSuccess?: () => void }) {
  return useApiMutation<WishlistItem, { listingId: string; note?: string }>(
    ({ listingId, note }) => b2cService.addToWishlist(listingId, note),
    { onSuccess: () => options?.onSuccess?.() },
  );
}

export function useRemoveFromWishlist(options?: { onSuccess?: () => void }) {
  return useApiMutation<{ success: boolean }, string>(
    (id) => b2cService.removeFromWishlist(id),
    { onSuccess: () => options?.onSuccess?.() },
  );
}

export function useSubmitReview(options?: { onSuccess?: () => void }) {
  return useApiMutation<{ id: string }, { listingId: string; rating: number; comment?: string }>(
    ({ listingId, rating, comment }) => b2cService.submitReview(listingId, rating, comment),
    { onSuccess: () => options?.onSuccess?.() },
  );
}
