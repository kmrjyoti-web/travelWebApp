import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';

const BASE = '/b2b';

// ── Types ──────────────────────────────────────────────────────────────────────
export type ListingStatus     = 'draft' | 'published' | 'archived';
export type ListingVisibility = 'public' | 'private' | 'corporate_only';
export type B2BOrderStatus    = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentTerms      = 'immediate' | 'net_30' | 'net_60';
export type RFQStatus         = 'open' | 'bidding' | 'awarded' | 'cancelled' | 'expired';

export interface BulkDiscount {
  minSeats:        number;
  discountPercent: number;
}

export interface B2BListingRecord {
  id:                 string;
  forkId:             string;
  sellerAgentId:      string;
  title:              string;
  slug:               string;
  destinationCountry: string;
  destinationCity?:   string;
  tierName:           string;
  unitPrice:          number;
  currency:           string;
  bulkDiscounts:      BulkDiscount[];
  visibility:         ListingVisibility;
  whiteLabel:         boolean;
  status:             ListingStatus;
  publishedAt?:       string;
  createdAt:          string;
  updatedAt:          string;
}

export interface B2BOrderRecord {
  id:                    string;
  orderNumber:           string;
  listingId:             string;
  buyerAgentId:          string;
  sellerAgentId:         string;
  boardingPointId:       string;
  seatsRequested:        number;
  unitPrice:             number;
  bulkDiscountPercent:   number;
  bulkDiscountAmount:    number;
  subtotal:              number;
  cgstAmount:            number;
  sgstAmount:            number;
  igstAmount:            number;
  totalTax:              number;
  totalAmount:           number;
  currency:              string;
  paymentTerms:          PaymentTerms;
  paymentDueDate?:       string;
  paymentOrderId?:       string;
  paymentTransactionId?: string;
  whiteLabel:            boolean;
  status:                B2BOrderStatus;
  confirmedAt?:          string;
  cancelledAt?:          string;
  cancellationReason?:   string;
  notes?:                string;
  createdAt:             string;
  updatedAt:             string;
}

export interface RFQRecord {
  id:                  string;
  requesterUserId:     string;
  title:               string;
  destinationCountry:  string;
  destinationCity?:    string;
  travelDatesStart:    string;
  travelDatesEnd:      string;
  paxCount:            number;
  budgetMin?:          number;
  budgetMax?:          number;
  requirements?:       string;
  deadline:            string;
  awardedBidId?:       string;
  status:              RFQStatus;
  createdAt:           string;
  updatedAt:           string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page:  number;
  limit: number;
}

export interface ListingListParams {
  page?:               number;
  limit?:              number;
  destinationCountry?: string;
  status?:             string;
}

export interface OrderListParams {
  page?:  number;
  limit?: number;
  status?: string;
}

export interface RFQListParams {
  page?:  number;
  limit?: number;
  status?: string;
}

// ── Service ───────────────────────────────────────────────────────────────────
const b2bService = {
  // Listings
  getListings: (params?: ListingListParams): Promise<ApiResponse<PaginatedResult<B2BListingRecord>>> =>
    api.get(`${BASE}/listings`, { params }),

  // Orders
  getOrders: (params?: OrderListParams): Promise<ApiResponse<PaginatedResult<B2BOrderRecord>>> =>
    api.get(`${BASE}/orders`, { params }),

  confirmOrder: (id: string): Promise<ApiResponse<B2BOrderRecord>> =>
    api.post(`${BASE}/orders/${encodeURIComponent(id)}/confirm`),

  // RFQs
  getRFQs: (params?: RFQListParams): Promise<ApiResponse<PaginatedResult<RFQRecord>>> =>
    api.get(`${BASE}/rfqs`, { params }),

  createRFQ: (data: Omit<RFQRecord, 'id' | 'requesterUserId' | 'awardedBidId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<RFQRecord>> =>
    api.post(`${BASE}/rfqs`, data),
};

export { b2bService };
