import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';

export type InfluencerTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type LeaderboardPeriod = 'weekly' | 'monthly' | 'yearly' | 'all_time';

export interface InfluencerProfile {
  id:                  string;
  displayName:         string;
  tier:                InfluencerTier;
  isVerified:          boolean;
  followerCount:       number;
  totalBookingsDriven: number;
  totalEarnings:       number;
  pointsBalance:       number;
}

export interface InfluencerEarnings {
  totalEarnings:   number;
  pendingEarnings: number;
  paidEarnings:    number;
  totalBookings:   number;
}

export interface InfluencerDashboardResult {
  profile:      InfluencerProfile;
  earnings:     InfluencerEarnings;
  referralLinks: number;
}

export interface ReferralLink {
  id:           string;
  refCode:      string;
  targetUrl:    string;
  listingId?:   string;
  clickCount:   number;
  bookingCount: number;
  isActive:     boolean;
  createdAt:    string;
}

export interface ReferralLinkStatsResult {
  links:         ReferralLink[];
  totalClicks:   number;
  totalBookings: number;
}

export interface LeaderboardEntry {
  influencerId:  string;
  rank:          number;
  totalBookings: number;
  totalEarnings: number;
}

export interface LeaderboardResult {
  items: LeaderboardEntry[];
  total: number;
  page:  number;
  limit: number;
}

export interface GenerateLinkParams {
  targetUrl: string;
  listingId?: string;
}

export interface RedeemPointsParams {
  points: number;
}

export const influencerService = {
  getDashboard: (influencerId: string): Promise<ApiResponse<InfluencerDashboardResult>> =>
    api.get(`/influencer/${influencerId}/dashboard`),

  getProfile: (): Promise<ApiResponse<InfluencerProfile>> =>
    api.get('/influencer/profile'),

  getReferralLinkStats: (influencerId: string): Promise<ApiResponse<ReferralLinkStatsResult>> =>
    api.get(`/influencer/${influencerId}/referral-links`),

  generateReferralLink: (influencerId: string, params: GenerateLinkParams): Promise<ApiResponse<ReferralLink>> =>
    api.post(`/influencer/${influencerId}/referral-links`, params),

  getLeaderboard: (period: LeaderboardPeriod, periodKey: string, page = 1): Promise<ApiResponse<LeaderboardResult>> =>
    api.get('/influencer/leaderboard', { params: { period, periodKey, page } }),

  redeemPoints: (influencerId: string, params: RedeemPointsParams): Promise<ApiResponse<{ success: boolean; newBalance: number }>> =>
    api.post(`/influencer/${influencerId}/redeem-points`, params),
};
