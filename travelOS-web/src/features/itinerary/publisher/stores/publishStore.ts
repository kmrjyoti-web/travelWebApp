import { create } from 'zustand';
import type { PublishPackageData, PublishSectionId } from '../types/publish.types';
import { PUBLISH_DEFAULTS } from '../types/publish.types';

interface PublishStoreState {
  packageId: string | null;
  data: PublishPackageData;
  activeSection: PublishSectionId;
  isDirty: boolean;
  isSaving: boolean;

  // Actions
  setPackageId: (id: string | null) => void;
  setData: (data: PublishPackageData) => void;
  updateSection: <K extends keyof PublishPackageData>(key: K, value: PublishPackageData[K]) => void;
  setActiveSection: (section: PublishSectionId) => void;
  setIsDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  reset: () => void;
}

export const usePublishStore = create<PublishStoreState>((set) => ({
  packageId: null,
  data: { ...PUBLISH_DEFAULTS },
  activeSection: 'gallery',
  isDirty: false,
  isSaving: false,

  setPackageId: (id) => set({ packageId: id }),
  setData: (data) => set({ data, isDirty: false }),
  updateSection: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value }, isDirty: true })),
  setActiveSection: (section) => set({ activeSection: section }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  reset: () => set({ packageId: null, data: { ...PUBLISH_DEFAULTS }, activeSection: 'gallery', isDirty: false, isSaving: false }),
}));
