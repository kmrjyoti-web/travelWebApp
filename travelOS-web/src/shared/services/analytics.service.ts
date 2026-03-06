import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';

const BASE = '/analytics';

// ── Response types ─────────────────────────────────────────────────────────────
export interface AgentDashboardResult {
  agentUserId:       string;
  period:            { from: string; to: string };
  totalBookings:     number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue:      number;
  totalCommission:   number;
  avgBookingValue:   number;
  conversionRate:    number;
  dailySnapshots:    Array<{ date: string; metrics: Record<string, unknown> }>;
}

export interface RevenueEntry {
  date:       string;
  revenue:    number;
  commission: number;
  bookings:   number;
}

export interface AgentRevenueResult {
  agentUserId:     string;
  period:          { from: string; to: string };
  entries:         RevenueEntry[];
  totalRevenue:    number;
  totalCommission: number;
}

export interface FunnelStep {
  stepName:       string;
  stepOrder:      number;
  totalCount:     number;
  conversionRate: number;
}

export interface ConversionFunnelResult {
  funnelName:            string;
  period:                { from: string; to: string };
  steps:                 FunnelStep[];
  overallConversionRate: number;
}

export interface DateRangeParams {
  fromDate?: string;
  toDate?:   string;
}

// ── Service ────────────────────────────────────────────────────────────────────
const analyticsService = {
  getAgentDashboard: (params?: DateRangeParams): Promise<ApiResponse<AgentDashboardResult>> =>
    api.get(`${BASE}/agent/dashboard`, { params }),

  getAgentRevenue: (params?: DateRangeParams): Promise<ApiResponse<AgentRevenueResult>> =>
    api.get(`${BASE}/agent/revenue`, { params }),

  getConversionFunnel: (funnelName: string, params?: DateRangeParams): Promise<ApiResponse<ConversionFunnelResult>> =>
    api.get(`${BASE}/funnel`, { params: { funnelName, ...params } }),
};

export { analyticsService };
