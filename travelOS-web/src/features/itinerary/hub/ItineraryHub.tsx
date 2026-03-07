'use client';
import React, { useCallback, useState } from 'react';
import { Tabs, TabItem, TabLink } from '@/shared/components';
import { useSidePanelStore } from '@/shared/components/SidePanel';
import ItineraryHeader from '@/features/dashboard/components/ItineraryHeader';
import ItineraryDashboard from '@/features/dashboard/components/ItineraryDashboard';
import { ItineraryListPanel } from '../components';
import { ItineraryPublisherHub } from '../publisher';
import { usePublishStore } from '../publisher/stores/publishStore';

const PUBLISHER_PANEL_ID = 'itinerary-publisher';

type HubTab = 'dashboard' | 'list';

export function ItineraryHub() {
  const [activeTab, setActiveTab] = useState<HubTab>('dashboard');

  const reset         = usePublishStore((s) => s.reset);
  const openPanel     = useSidePanelStore((s) => s.openPanel);
  const setPanelState = useSidePanelStore((s) => s.setPanelState);

  /** Open publisher for a brand-new package */
  const openCreate = useCallback(() => {
    reset();
    openPanel({
      id:        PUBLISHER_PANEL_ID,
      title:     'Create Package',
      noPadding: true,
      newTabUrl: '/itinerary/publish',
      content:   <ItineraryPublisherHub panelId={PUBLISHER_PANEL_ID} />,
    });
    setPanelState(PUBLISHER_PANEL_ID, 'fullscreen');
  }, [reset, openPanel, setPanelState]);

  /** Open publisher to edit an existing package */
  const openEdit = useCallback((id: string) => {
    reset();
    openPanel({
      id:        PUBLISHER_PANEL_ID,
      title:     'Edit Package',
      noPadding: true,
      newTabUrl: `/itinerary/publish?id=${encodeURIComponent(id)}`,
      content:   <ItineraryPublisherHub panelId={PUBLISHER_PANEL_ID} editId={id} />,
    });
    setPanelState(PUBLISHER_PANEL_ID, 'fullscreen');
  }, [reset, openPanel, setPanelState]);

  return (
    <>
      <ItineraryHeader onSelfClick={openCreate} onAiClick={openCreate} />

      <Tabs className="mb-4">
        <TabItem>
          <TabLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={activeTab === 'list'} onClick={() => setActiveTab('list')}>
            My Packages
          </TabLink>
        </TabItem>
      </Tabs>

      {activeTab === 'dashboard'
        ? <ItineraryDashboard showAiPrompt={false} />
        : <ItineraryListPanel onEdit={openEdit} onCreate={openCreate} />
      }
    </>
  );
}
