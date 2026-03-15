'use client';
import React, { useCallback } from 'react';
import { PageToolbar } from '@/shared/components';
import { useSidePanelStore } from '@/shared/components/SidePanel';
import { ItineraryListPanel } from '../components';
import { ItineraryPublisherHub } from '../publisher';
import { usePublishStore } from '../publisher/stores/publishStore';

const PUBLISHER_PANEL_ID = 'itinerary-publisher';

export function ItineraryHub() {
  const reset         = usePublishStore((s) => s.reset);
  const openPanel     = useSidePanelStore((s) => s.openPanel);
  const setPanelState = useSidePanelStore((s) => s.setPanelState);

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
      <PageToolbar
        title="Itinerary"
        actionLabel="Add Itinerary:"
        actions={[
          { label: 'Self',               icon: 'User',     variant: 'primary', onClick: openCreate },
          { label: 'Search Marketplace', icon: 'Store',    variant: 'success', onClick: openCreate },
          { label: 'Create With AI',     icon: 'Sparkles', variant: 'purple',  onClick: openCreate },
        ]}
      />

      <ItineraryListPanel onEdit={openEdit} onCreate={openCreate} />
    </>
  );
}
