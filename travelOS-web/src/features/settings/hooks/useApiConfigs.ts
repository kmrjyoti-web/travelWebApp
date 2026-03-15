/**
 * useApiConfigs — fetches the full list of API config summaries.
 * Uses React Query for caching and background refresh.
 */
import { useQuery } from '@tanstack/react-query';
import { apiConfigService } from '@/shared/services/api-config.service';
import type { ApiConfigSummary } from '../types/api-config.types';

export const API_CONFIG_QUERY_KEY = ['api-config', 'list'] as const;

/**
 * Returns all API config summaries for the current tenant.
 * Data is stale after 60 s (inherited from global QueryProvider config).
 *
 * @example
 * const { data, isLoading, error } = useApiConfigs();
 */
export function useApiConfigs() {
  return useQuery<ApiConfigSummary[], Error>({
    queryKey: API_CONFIG_QUERY_KEY,
    queryFn: async () => {
      const res = await apiConfigService.list();
      return res.data ?? [];
    },
  });
}

/**
 * Convenience helper — looks up a single config from the cached list by provider.
 * Returns undefined when not yet configured.
 *
 * @example
 * const cloudinary = useApiConfigByProvider('cloudinary');
 */
export function useApiConfigByProvider(provider: string): ApiConfigSummary | undefined {
  const { data } = useApiConfigs();
  return data?.find((c) => c.provider === provider);
}
