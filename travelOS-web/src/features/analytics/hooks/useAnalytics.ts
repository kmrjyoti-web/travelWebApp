import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { analyticsService } from '@/shared/services/analytics.service';
import type { DateRangeParams } from '@/shared/services/analytics.service';

const KEY = (scope: string, params?: object) => ['analytics', scope, params] as const;

export function useAgentDashboard(params?: DateRangeParams) {
  return useApiQuery(
    KEY('agent-dashboard', params),
    () => analyticsService.getAgentDashboard(params),
  );
}

export function useAgentRevenue(params?: DateRangeParams) {
  return useApiQuery(
    KEY('agent-revenue', params),
    () => analyticsService.getAgentRevenue(params),
  );
}

export function useConversionFunnel(funnelName: string, params?: DateRangeParams) {
  return useApiQuery(
    KEY('funnel', { funnelName, ...params }),
    () => analyticsService.getConversionFunnel(funnelName, params),
    { enabled: Boolean(funnelName) },
  );
}
