import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';

const BASE = '/bookings';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';

export interface BookingRecord {
  id:                    string;
  bookingNumber:         string;
  forkId:                string;
  boardingPointId:       string;
  agentUserId:           string;
  customerName:          string;
  customerEmail:         string;
  customerPhone:         string;
  tierName:              string;
  paxCount:              number;
  unitPrice:             number;
  ancillaryTotal:        number;
  discountAmount:        number;
  taxAmount:             number;
  totalAmount:           number;
  currency:              string;
  status:                BookingStatus;
  paymentOrderId?:       string;
  paymentTransactionId?: string;
  promoCode?:            string;
  notes?:                string;
  confirmedAt?:          string;
  cancelledAt?:          string;
  cancellationReason?:   string;
  createdAt:             string;
  updatedAt:             string;
}

export interface PaginatedBookings {
  items: BookingRecord[];
  total: number;
  page:  number;
  limit: number;
}

export interface BookingListParams {
  page?:     number;
  limit?:    number;
  status?:   string;
  fromDate?: string;
  toDate?:   string;
}

const bookingService = {
  /** List agent's own bookings (paginated + filterable) */
  list: (params?: BookingListParams): Promise<ApiResponse<PaginatedBookings>> =>
    api.get(`${BASE}/agent`, { params }),

  /** Get single booking by ID */
  getById: (id: string): Promise<ApiResponse<BookingRecord>> =>
    api.get(`${BASE}/${encodeURIComponent(id)}`),

  /** Cancel a booking */
  cancel: (id: string, reason: string): Promise<ApiResponse<BookingRecord>> =>
    api.post(`${BASE}/${encodeURIComponent(id)}/cancel`, { reason }),
};

export { bookingService };
