'use client';
import React from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasTitle, OffcanvasBody } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import { ItineraryEditorForm } from './ItineraryEditorForm';
import type { EditorMode, FullItineraryFormData } from '../types/editor.types';

interface ItineraryEditorDrawerProps {
  visible: boolean;
  mode: EditorMode;
  editId?: string;
  initialData?: Partial<FullItineraryFormData>;
  onClose: () => void;
}

const DRAWER_TITLE: Record<EditorMode, string> = {
  manual: 'Create Self Itinerary',
  ai:     'AI Generated Itinerary',
  edit:   'Edit Itinerary',
};

const DRAWER_ICON: Record<EditorMode, IconName> = {
  manual: 'FileText',
  ai:     'Sparkles',
  edit:   'Pencil',
};

export function ItineraryEditorDrawer({ visible, mode, editId, initialData, onClose }: ItineraryEditorDrawerProps) {
  return (
    <Offcanvas
      placement="end"
      visible={visible}
      onHide={onClose}
      backdrop={false}
      className="tos-itinerary-editor-drawer"
      aria-labelledby="itinerary-editor-title"
    >
      <OffcanvasHeader className="tos-self-itinerary-drawer__header">
        <OffcanvasTitle id="itinerary-editor-title" className="tos-self-itinerary-drawer__title">
          <Icon name={DRAWER_ICON[mode]} size={20} />
          {DRAWER_TITLE[mode]}
        </OffcanvasTitle>
      </OffcanvasHeader>
      <OffcanvasBody className="tos-self-itinerary-drawer__body" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ItineraryEditorForm
          mode={mode}
          editId={editId}
          initialData={initialData}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </OffcanvasBody>
    </Offcanvas>
  );
}
