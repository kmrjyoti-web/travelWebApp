'use client';
import React, { useCallback } from 'react';
import ItineraryHeader from '@/features/dashboard/components/ItineraryHeader';
import ItineraryDashboard from '@/features/dashboard/components/ItineraryDashboard';
import { useSidePanelStore } from '@/shared/components/SidePanel';
import { ItineraryEditorForm } from '../components';
import type { EditorMode, FullItineraryFormData } from '../types/editor.types';

const PANEL_ID = 'itinerary-editor';

const PANEL_TITLE: Record<EditorMode, string> = {
  manual: 'Create Itinerary',
  ai:     'AI-Generated Itinerary',
  edit:   'Edit Itinerary',
};

export function ItineraryHub() {
  const openPanel  = useSidePanelStore((s) => s.openPanel);
  const closePanel = useSidePanelStore((s) => s.closePanel);

  const openEditor = useCallback(
    (mode: EditorMode, editId?: string, initialData?: Partial<FullItineraryFormData>) => {
      const close = () => closePanel(PANEL_ID);
      openPanel({
        id:        PANEL_ID,
        title:     PANEL_TITLE[mode],
        width:     880,
        noPadding: true,
        content: (
          <ItineraryEditorForm
            mode={mode}
            editId={editId}
            initialData={initialData}
            onSuccess={close}
            onCancel={close}
          />
        ),
      });
    },
    [openPanel, closePanel],
  );

  const openManual = useCallback(() => openEditor('manual'), [openEditor]);
  const openAi     = useCallback(() => openEditor('ai'),     [openEditor]);

  return (
    <>
      <ItineraryHeader onSelfClick={openManual} onAiClick={openAi} />
      <ItineraryDashboard showAiPrompt={false} />
    </>
  );
}
