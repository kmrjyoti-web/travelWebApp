/**
 * React Query hook for fetching and updating GEO settings.
 */
import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { geoService } from '../geoService';
import type { GeoSettings } from '../types';

const GEO_SETTINGS_KEY = (itineraryId: string): readonly unknown[] =>
  ['geo-settings', itineraryId] as const;

interface UseGeoSettingsResult {
  data: GeoSettings | undefined;
  isLoading: boolean;
  error: Error | null;
  updateSettings: (data: Partial<GeoSettings>) => Promise<void>;
  isUpdating: boolean;
}

export function useGeoSettings(itineraryId: string): UseGeoSettingsResult {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useApiQuery<GeoSettings>(
    GEO_SETTINGS_KEY(itineraryId),
    () => geoService.getSettings(itineraryId) as never,
    { enabled: !!itineraryId },
  );

  const { mutateAsync, isPending: isUpdating } = useApiMutation<
    GeoSettings,
    Partial<GeoSettings>
  >(
    (variables) => geoService.updateSettings(itineraryId, variables) as never,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: GEO_SETTINGS_KEY(itineraryId),
        });
      },
    },
  );

  const updateSettings = async (data: Partial<GeoSettings>): Promise<void> => {
    await mutateAsync(data);
  };

  return { data, isLoading, error, updateSettings, isUpdating };
}
