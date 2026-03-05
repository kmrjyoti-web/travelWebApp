/**
 * Typed wrapper around useQuery for TravelOS API calls.
 * Handles the standard { success, data, error } response shape.
 *
 * Usage:
 *   const { data, isLoading, error } = useApiQuery(
 *     queryKeys.itinerary.list({ page: 1 }),
 *     () => itineraryService.list({ page: 1 })
 *   );
 */
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiResponse } from '@/shared/types/api.types';

export function useApiQuery<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: Omit<UseQueryOptions<ApiResponse<TData>, Error, TData>, 'queryKey' | 'queryFn' | 'select'>
) {
  return useQuery<ApiResponse<TData>, Error, TData>({
    queryKey,
    queryFn,
    // Unwrap .data from standard API response shape
    select: (res) => res.data,
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'>
) {
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn,
    ...options,
  });
}
