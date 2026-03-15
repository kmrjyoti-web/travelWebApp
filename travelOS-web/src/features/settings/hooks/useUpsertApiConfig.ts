/**
 * useUpsertApiConfig — create or update an API config entry.
 * Invalidates the list query on success so all cards refresh.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiConfigService } from '@/shared/services/api-config.service';
import { API_CONFIG_QUERY_KEY } from './useApiConfigs';
import type { ApiConfigSummary, UpsertApiConfigPayload } from '../types/api-config.types';

interface UseUpsertApiConfigOptions {
  onSuccess?: (data: ApiConfigSummary) => void;
  onError?: (error: Error) => void;
}

/**
 * Mutation hook for upserting an API config.
 * Automatically invalidates ['api-config'] queries on success.
 *
 * @example
 * const { mutate, isPending } = useUpsertApiConfig({ onSuccess: () => showToast('Saved') });
 * mutate({ provider: 'cloudinary', displayName: 'Cloudinary', credentials: { ... } });
 */
export function useUpsertApiConfig(options?: UseUpsertApiConfigOptions) {
  const queryClient = useQueryClient();

  return useMutation<ApiConfigSummary, Error, UpsertApiConfigPayload>({
    mutationFn: async (payload) => {
      const res = await apiConfigService.upsert(payload);
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate the list so all consumers re-fetch
      void queryClient.invalidateQueries({ queryKey: API_CONFIG_QUERY_KEY });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
