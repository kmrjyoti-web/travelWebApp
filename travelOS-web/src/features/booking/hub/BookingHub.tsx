'use client';
import React, { useCallback } from 'react';
import { PageHeader } from '@/shared/components';
import { useSidePanelStore } from '@/shared/components/SidePanel';
import { BookingListPanel, BookingDetailPanel } from '../components';

const PANEL_ID = 'booking-detail';

export function BookingHub() {
  const openPanel  = useSidePanelStore((s) => s.openPanel);
  const closePanel = useSidePanelStore((s) => s.closePanel);

  const openDetail = useCallback((id: string) => {
    const close = () => closePanel(PANEL_ID);
    openPanel({
      id:    PANEL_ID,
      title: 'Booking Details',
      width: 560,
      content: <BookingDetailPanel bookingId={id} onClose={close} />,
    });
  }, [openPanel, closePanel]);

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader title="Bookings" className="mb-4" />
      <BookingListPanel onView={openDetail} />
    </main>
  );
}
