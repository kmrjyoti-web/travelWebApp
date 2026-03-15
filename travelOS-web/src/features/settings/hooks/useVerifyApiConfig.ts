/**
 * useVerifyApiConfig — triggers a live connectivity test for an API config provider.
 * Invalidates the list query on success so the verified status badge updates.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiConfigService } from '@/shared/services/api-config.service';
import { API_CONFIG_QUERY_KEY } from './useApiConfigs';
import type { VerifyResult } from '../types/api-config.types';

interface UseVerifyApiConfigOptions {
  onSuccess?: (result: VerifyResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Mutation hook for verifying an API config against the live provider API.
 * Automatically invalidates ['api-config'] queries on success.
 *
 * @example
 * const { mutate, isPending } = useVerifyApiConfig({ onSuccess: (r) => console.log(r.message) });
 * mutate('cloudinary');
 */
export function useVerifyApiConfig(options?: UseVerifyApiConfigOptions) {
  const queryClient = useQueryClient();

  return useMutation<VerifyResult, Error, string>({
    mutationFn: async (provider) => {
      const res = await apiConfigService.verify(provider);
      return res.data;
    },
    onSuccess: (result) => {
      // Refresh list so isVerified / verifiedAt badges update
      void queryClient.invalidateQueries({ queryKey: API_CONFIG_QUERY_KEY });
      options?.onSuccess?.(result);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
