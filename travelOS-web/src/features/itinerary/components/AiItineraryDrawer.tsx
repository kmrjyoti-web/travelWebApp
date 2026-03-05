'use client';
import React from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasTitle, OffcanvasBody, Icon } from '@/shared/components';
import { AiItineraryForm } from './AiItineraryForm';

interface AiItineraryDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function AiItineraryDrawer({ visible, onClose }: AiItineraryDrawerProps) {
  return (
    <Offcanvas
      placement="end"
      visible={visible}
      onHide={onClose}
      backdrop={false}
      className="tos-self-itinerary-drawer"
      aria-labelledby="ai-itinerary-title"
    >
      <OffcanvasHeader className="tos-self-itinerary-drawer__header">
        <OffcanvasTitle id="ai-itinerary-title" className="tos-self-itinerary-drawer__title">
          <Icon name="Sparkles" size={20} />
          Create With AI
        </OffcanvasTitle>
      </OffcanvasHeader>
      <OffcanvasBody className="tos-self-itinerary-drawer__body">
        <AiItineraryForm onSuccess={onClose} onCancel={onClose} />
      </OffcanvasBody>
    </Offcanvas>
  );
}
