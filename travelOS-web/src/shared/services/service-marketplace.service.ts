import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';

export type ServiceProviderType = 'visa' | 'guide' | 'photographer' | 'transfer' | 'insurance' | 'religious';
export type ServiceListingStatus = 'draft' | 'published' | 'archived';
export type ServiceBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ServicePaymentStatus = 'pending' | 'paid' | 'refunded';
export type ServicePriceUnit = 'per_person' | 'per_trip' | 'per_hour' | 'per_day' | 'per_application';

export interface ServiceListing {
  id:                      string;
  providerId:              string;
  serviceType:             string;
  title:                   string;
  description?:            string;
  price:                   number;
  currency:                string;
  priceUnit:               ServicePriceUnit;
  durationDescription?:    string;
  includes:                string[];
  excludes:                string[];
  applicableDestinations:  string[];
  applicableThemes:        string[];
  images:                  string[];
  maxPax?:                 number;
  advanceBookingDays:      number;
  isInstantBooking:        boolean;
  avgRating:               number;
  status:                  ServiceListingStatus;
  createdAt:               string;
}

export interface ServiceBooking {
  id:                     string;
  serviceBookingNumber:   string;
  listingId:              string;
  providerId:             string;
  customerUserId:         string;
  paxCount:               number;
  bookingDate:            string;
  serviceDate:            string;
  totalPrice:             number;
  currency:               string;
  platformCommission:     number;
  providerPayout:         number;
  paymentStatus:          ServicePaymentStatus;
  status:                 ServiceBookingStatus;
  specialRequests?:       string;
  createdAt:              string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page:  number;
  limit: number;
}

export interface SearchListingsParams {
  serviceType?: string;
  destination?: string;
  theme?:       string;
  maxPrice?:    number;
  page?:        number;
  limit?:       number;
}

export interface CreateListingParams {
  serviceType:             string;
  title:                   string;
  description?:            string;
  price:                   number;
  currency?:               string;
  priceUnit:               ServicePriceUnit;
  durationDescription?:    string;
  includes?:               string[];
  excludes?:               string[];
  applicableDestinations?: string[];
  applicableThemes?:       string[];
  maxPax?:                 number;
  advanceBookingDays?:     number;
  isInstantBooking?:       boolean;
}

export interface BookServiceParams {
  listingId:        string;
  paxCount:         number;
  serviceDate:      string;
  specialRequests?: string;
}

export const serviceMarketplaceService = {
  searchListings: (params?: SearchListingsParams): Promise<ApiResponse<PaginatedResult<ServiceListing>>> =>
    api.get('/service-marketplace/listings', { params }),

  getListing: (id: string): Promise<ApiResponse<ServiceListing>> =>
    api.get(`/service-marketplace/listings/${id}`),

  createListing: (params: CreateListingParams): Promise<ApiResponse<ServiceListing>> =>
    api.post('/service-marketplace/listings', params),

  publishListing: (id: string): Promise<ApiResponse<ServiceListing>> =>
    api.post(`/service-marketplace/listings/${id}/publish`),

  getBookings: (role: 'provider' | 'customer', page = 1): Promise<ApiResponse<PaginatedResult<ServiceBooking>>> =>
    api.get('/service-marketplace/bookings', { params: { role, page } }),

  bookService: (params: BookServiceParams): Promise<ApiResponse<ServiceBooking>> =>
    api.post('/service-marketplace/bookings', params),

  confirmBooking: (id: string): Promise<ApiResponse<ServiceBooking>> =>
    api.post(`/service-marketplace/bookings/${id}/confirm`),

  cancelBooking: (id: string, reason?: string): Promise<ApiResponse<ServiceBooking>> =>
    api.post(`/service-marketplace/bookings/${id}/cancel`, { reason }),

  submitReview: (bookingId: string, rating: number, comment?: string): Promise<ApiResponse<{ id: string }>> =>
    api.post(`/service-marketplace/bookings/${bookingId}/review`, { rating, comment }),
};
