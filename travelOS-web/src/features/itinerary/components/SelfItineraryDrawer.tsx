'use client';
import React from 'react';
import { SmartDrawer } from '@/shared/components';
import { SelfItineraryForm } from './SelfItineraryForm';

interface SelfItineraryDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function SelfItineraryDrawer({ visible, onClose }: SelfItineraryDrawerProps) {
  return (
    <SmartDrawer
      isOpen={visible}
      onClose={onClose}
      title="Create Self Itinerary"
      hideFooter
      size="520px"
    >
      <SelfItineraryForm onSuccess={onClose} onCancel={onClose} />
    </SmartDrawer>
  );
}
