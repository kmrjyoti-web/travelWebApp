import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { influencerService } from '@/shared/services/influencer.service';
import type {
  InfluencerDashboardResult,
  ReferralLinkStatsResult,
  LeaderboardResult,
  LeaderboardPeriod,
  GenerateLinkParams,
  RedeemPointsParams,
  ReferralLink,
} from '@/shared/services/influencer.service';

export function useInfluencerDashboard(influencerId: string | null) {
  return useApiQuery<InfluencerDashboardResult>(
    ['influencer', 'dashboard', influencerId],
    () => influencerService.getDashboard(influencerId!),
    { enabled: !!influencerId },
  );
}

export function useReferralLinkStats(influencerId: string | null) {
  return useApiQuery<ReferralLinkStatsResult>(
    ['influencer', 'referral-links', influencerId],
    () => influencerService.getReferralLinkStats(influencerId!),
    { enabled: !!influencerId },
  );
}

export function useLeaderboard(period: LeaderboardPeriod, periodKey: string, page = 1) {
  return useApiQuery<LeaderboardResult>(
    ['influencer', 'leaderboard', period, periodKey, page],
    () => influencerService.getLeaderboard(period, periodKey, page),
  );
}

export function useGenerateReferralLink(
  influencerId: string,
  options?: { onSuccess?: (link: ReferralLink) => void },
) {
  return useApiMutation<ReferralLink, GenerateLinkParams>(
    (params) => influencerService.generateReferralLink(influencerId, params),
    { onSuccess: (res) => options?.onSuccess?.(res.data) },
  );
}

export function useRedeemPoints(
  influencerId: string,
  options?: { onSuccess?: (newBalance: number) => void },
) {
  return useApiMutation<{ success: boolean; newBalance: number }, RedeemPointsParams>(
    (params) => influencerService.redeemPoints(influencerId, params),
    { onSuccess: (res) => options?.onSuccess?.(res.data.newBalance) },
  );
}
