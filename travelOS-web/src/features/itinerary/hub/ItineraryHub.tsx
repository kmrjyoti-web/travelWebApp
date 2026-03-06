'use client';
import React, { useCallback, useState } from 'react';
import { Tabs, TabItem, TabLink } from '@/shared/components';
import ItineraryHeader from '@/features/dashboard/components/ItineraryHeader';
import ItineraryDashboard from '@/features/dashboard/components/ItineraryDashboard';
import { ItineraryListPanel, ItineraryEditorForm } from '../components';
import { useSidePanelStore } from '@/shared/components/SidePanel';
import type { EditorMode, FullItineraryFormData } from '../types/editor.types';

const PANEL_ID = 'itinerary-editor';

const PANEL_TITLE: Record<EditorMode, string> = {
  manual: 'Create Itinerary',
  ai:     'AI-Generated Itinerary',
  edit:   'Edit Itinerary',
};

type HubTab = 'dashboard' | 'list';

export function ItineraryHub() {
  const [activeTab, setActiveTab] = useState<HubTab>('dashboard');
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
  const openEdit   = useCallback((id: string) => openEditor('edit', id), [openEditor]);

  return (
    <>
      <ItineraryHeader onSelfClick={openManual} onAiClick={openAi} />

      <Tabs className="mb-4">
        <TabItem>
          <TabLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={activeTab === 'list'} onClick={() => setActiveTab('list')}>
            My Itineraries
          </TabLink>
        </TabItem>
      </Tabs>

      {activeTab === 'dashboard'
        ? <ItineraryDashboard showAiPrompt={false} />
        : <ItineraryListPanel onEdit={openEdit} onCreate={openManual} />
      }
    </>
  );
}
