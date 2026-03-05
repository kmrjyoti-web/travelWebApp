'use client';
import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import type { ComponentProps } from 'react';

export type ModalProps = ComponentProps<typeof CModal>;

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => <CModal ref={ref} {...props} />);
Modal.displayName = 'Modal';

// Re-export polymorphic sub-components directly
export const ModalHeader = CModalHeader;
export const ModalTitle = CModalTitle;
export const ModalBody = CModalBody;
export const ModalFooter = CModalFooter;
