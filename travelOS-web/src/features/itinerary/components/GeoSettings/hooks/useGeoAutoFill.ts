/**
 * React Query mutation hook for triggering AI auto-fill of all GEO fields.
 */
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/shared/hooks/useApiQuery';
import { geoService } from '../geoService';
import type { GeoSettings } from '../types';

interface UseGeoAutoFillResult {
  autoFill: () => Promise<GeoSettings>;
  isAutoFilling: boolean;
}

export function useGeoAutoFill(itineraryId: string): UseGeoAutoFillResult {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isAutoFilling } = useApiMutation<GeoSettings, void>(
    () => geoService.autoFill(itineraryId) as never,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ['geo-settings', itineraryId],
        });
      },
    },
  );

  const autoFill = async (): Promise<GeoSettings> => {
    const result = await mutateAsync(undefined);
    return result.data;
  };

  return { autoFill, isAutoFilling };
}
