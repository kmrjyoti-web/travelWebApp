'use client';
import React from 'react';
import { CPagination, CPaginationItem } from '@coreui/react';
import type { ComponentProps } from 'react';

export type PaginationProps = ComponentProps<typeof CPagination>;

export const Pagination = (props: PaginationProps) => <CPagination {...props} />;
Pagination.displayName = 'Pagination';

export const PaginationItem = (props: ComponentProps<typeof CPaginationItem>) => <CPaginationItem {...props} />;
PaginationItem.displayName = 'PaginationItem';
