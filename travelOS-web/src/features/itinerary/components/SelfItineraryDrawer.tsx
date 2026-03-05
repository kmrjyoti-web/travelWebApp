'use client';
import React from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasTitle, OffcanvasBody, Icon } from '@/shared/components';
import { SelfItineraryForm } from './SelfItineraryForm';

interface SelfItineraryDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function SelfItineraryDrawer({ visible, onClose }: SelfItineraryDrawerProps) {
  return (
    <Offcanvas
      placement="end"
      visible={visible}
      onHide={onClose}
      backdrop={false}
      className="tos-self-itinerary-drawer"
      aria-labelledby="self-itinerary-title"
    >
      <OffcanvasHeader className="tos-self-itinerary-drawer__header">
        <OffcanvasTitle id="self-itinerary-title" className="tos-self-itinerary-drawer__title">
          <Icon name="FileText" size={20} />
          Create Self Itinerary
        </OffcanvasTitle>
      </OffcanvasHeader>
      <OffcanvasBody className="tos-self-itinerary-drawer__body">
        <SelfItineraryForm onSuccess={onClose} onCancel={onClose} />
      </OffcanvasBody>
    </Offcanvas>
  );
}
