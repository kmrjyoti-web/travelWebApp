import { useCallback } from 'react';
import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { itineraryPublishService } from '@/shared/services/itinerary-publish.service';
import type { PackageSummary, PublishPackageResult } from '@/shared/services/itinerary-publish.service';
import type { PublishPackageData, PublishStatus } from '../types/publish.types';
import { usePublishStore } from '../stores/publishStore';

export function usePackageList(params?: { page?: number; limit?: number; status?: PublishStatus }) {
  return useApiQuery<PackageSummary[]>(
    ['packages', params ?? {}],
    () => itineraryPublishService.list(params),
  );
}

export function usePackageDetail(id: string) {
  const setData = usePublishStore((s) => s.setData);
  const setPackageId = usePublishStore((s) => s.setPackageId);
  const query = useApiQuery<PublishPackageData>(
    ['package', id],
    () => itineraryPublishService.getById(id),
    { enabled: !!id },
  );
  // Sync loaded data into Zustand store when fetch succeeds
  if (query.data && id) {
    setData(query.data);
    setPackageId(id);
  }
  return query;
}

export function useCreatePackage() {
  const setPackageId = usePublishStore((s) => s.setPackageId);
  const setIsDirty = usePublishStore((s) => s.setIsDirty);
  return useApiMutation<PublishPackageResult, PublishPackageData>(
    (data) => itineraryPublishService.create(data),
    {
      onSuccess: (res) => {
        setPackageId(res.data.id);
        setIsDirty(false);
      },
    },
  );
}

export function useSaveDraft() {
  const setIsDirty = usePublishStore((s) => s.setIsDirty);
  return useApiMutation<PublishPackageResult, { id: string; data: PublishPackageData }>(
    ({ id, data }) => itineraryPublishService.saveDraft(id, data),
    {
      onSuccess: () => setIsDirty(false),
    },
  );
}

export function usePublishPackage() {
  return useApiMutation<PublishPackageResult, string>(
    (id) => itineraryPublishService.publish(id),
  );
}

export function useUnpublishPackage() {
  return useApiMutation<PublishPackageResult, string>(
    (id) => itineraryPublishService.unpublish(id),
  );
}

export function useUploadImage() {
  return useApiMutation<{ url: string }, File>(
    (file) => itineraryPublishService.uploadImage(file),
  );
}

/** Convenience: auto-save current store data */
export function useAutoSave() {
  const { packageId, data } = usePublishStore();
  const createMutation = useCreatePackage();
  const saveDraftMutation = useSaveDraft();
  const setIsSaving = usePublishStore((s) => s.setIsSaving);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      if (packageId) {
        await saveDraftMutation.mutateAsync({ id: packageId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } finally {
      setIsSaving(false);
    }
  }, [packageId, data, createMutation, saveDraftMutation, setIsSaving]);

  return {
    save,
    isPending: createMutation.isPending || saveDraftMutation.isPending,
    isError: createMutation.isError || saveDraftMutation.isError,
  };
}
