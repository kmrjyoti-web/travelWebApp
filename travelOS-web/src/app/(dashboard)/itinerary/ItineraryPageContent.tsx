'use client';
import { useCallback } from 'react';
import { PageToolbar } from '@/shared/components';
import { useSidePanelStore } from '@/shared/components/SidePanel';
import ItineraryDashboard from '@/features/dashboard/components/ItineraryDashboard';
import { ItineraryPublisherHub } from '@/features/itinerary/publisher';
import { usePublishStore } from '@/features/itinerary/publisher/stores/publishStore';

const PUBLISHER_PANEL_ID = 'itinerary-publisher-dashboard';

export default function ItineraryPageContent() {
  const reset         = usePublishStore((s) => s.reset);
  const openPanel     = useSidePanelStore((s) => s.openPanel);
  const setPanelState = useSidePanelStore((s) => s.setPanelState);

  const openCreate = useCallback(() => {
    reset();
    openPanel({
      id:        PUBLISHER_PANEL_ID,
      title:     'Create Itinerary',
      noPadding: true,
      newTabUrl: '/itinerary/publish',
      content:   <ItineraryPublisherHub panelId={PUBLISHER_PANEL_ID} />,
    });
    setPanelState(PUBLISHER_PANEL_ID, 'fullscreen');
  }, [reset, openPanel, setPanelState]);

  return (
    <>
      <PageToolbar
        title="Itinerary"
        actionLabel="Add Itinerary:"
        actions={[
          { label: 'Self',             icon: 'User',     variant: 'primary',   onClick: openCreate },
          { label: 'Upload Self',      icon: 'Upload',   variant: 'secondary', onClick: openCreate },
          'divider',
          { label: 'Find Marketplace', icon: 'Store',    variant: 'success',   onClick: openCreate },
          { label: 'Generate With AI', icon: 'Sparkles', variant: 'purple',    onClick: openCreate },
        ]}
      />

      <ItineraryDashboard showAiPrompt={false} />
    </>
  );
}
