import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';

export type B2CListingStatus = 'draft' | 'published' | 'archived';
export type B2CListingSortBy = 'ai_recommended' | 'price_low' | 'price_high' | 'most_reviewed' | 'highest_rated' | 'newest';

export interface B2CListing {
  id:                 string;
  forkId:             string;
  sellerUserId:       string;
  title:              string;
  subtitle?:          string;
  destinationCountry: string;
  destinationCity?:   string;
  theme?:             string;
  durationDays:       number;
  durationNights:     number;
  minPax:             number;
  maxPax:             number;
  ageGroupTags:       string[];
  highlights:         string[];
  sellingPrice:       number;
  currency:           string;
  wasPrice?:          number;
  offerId?:           string;
  coverImageUrl?:     string;
  galleryUrls:        string[];
  avgRating:          number;
  reviewCount:        number;
  bookingCount:       number;
  isFeatured:         boolean;
  status:             B2CListingStatus;
  seoSlug:            string;
}

export interface HomepageSections {
  recommended:    B2CListing[];
  trending:       B2CListing[];
  recentlyViewed: B2CListing[];
  topRated:       B2CListing[];
  featuredDeals:  B2CListing[];
  byTheme:        Record<string, B2CListing[]>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page:  number;
  limit: number;
}

export interface WishlistItem {
  id:        string;
  listingId: string;
  note?:     string;
  createdAt: string;
}

export interface B2CReview {
  id:          string;
  userId:      string;
  rating:      number;
  comment?:    string;
  isHelpful?:  number;
  createdAt:   string;
}

export interface SearchListingsParams {
  destinationCountry?: string;
  destinationCity?:    string;
  theme?:              string;
  budgetMin?:          number;
  budgetMax?:          number;
  durationMin?:        number;
  durationMax?:        number;
  paxCount?:           number;
  ageGroup?:           string;
  sortBy?:             B2CListingSortBy;
  page?:               number;
  limit?:              number;
}

export const b2cService = {
  getHomepage: (): Promise<ApiResponse<HomepageSections>> =>
    api.get('/b2c/homepage'),

  searchListings: (params?: SearchListingsParams): Promise<ApiResponse<PaginatedResult<B2CListing>>> =>
    api.get('/b2c/listings', { params }),

  getListingDetail: (id: string): Promise<ApiResponse<B2CListing>> =>
    api.get(`/b2c/listings/${id}`),

  getReviews: (listingId: string, page = 1): Promise<ApiResponse<PaginatedResult<B2CReview>>> =>
    api.get(`/b2c/listings/${listingId}/reviews`, { params: { page } }),

  submitReview: (listingId: string, rating: number, comment?: string): Promise<ApiResponse<{ id: string }>> =>
    api.post(`/b2c/listings/${listingId}/reviews`, { rating, comment }),

  voteHelpful: (reviewId: string): Promise<ApiResponse<{ helpful: number }>> =>
    api.post(`/b2c/reviews/${reviewId}/helpful`),

  getWishlist: (page = 1): Promise<ApiResponse<PaginatedResult<WishlistItem>>> =>
    api.get('/b2c/wishlist', { params: { page } }),

  addToWishlist: (listingId: string, note?: string): Promise<ApiResponse<WishlistItem>> =>
    api.post('/b2c/wishlist', { listingId, note }),

  removeFromWishlist: (id: string): Promise<ApiResponse<{ success: boolean }>> =>
    api.delete(`/b2c/wishlist/${id}`),

  getCrossSell: (bookingId: string): Promise<ApiResponse<{ suggestions: Array<{ serviceType: string; title: string; price: number; currency: string }> }>> =>
    api.get(`/b2c/bookings/${bookingId}/cross-sell`),
};
