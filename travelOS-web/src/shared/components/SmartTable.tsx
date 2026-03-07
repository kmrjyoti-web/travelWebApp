'use client';
import { CSmartTable, CSmartPagination } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type SmartTableProps = ComponentProps<typeof CSmartTable>;
export type SmartPaginationProps = ComponentProps<typeof CSmartPagination>;

export function SmartTable(props: SmartTableProps) {
  return <CSmartTable {...props} />;
}

export function SmartPagination(props: SmartPaginationProps) {
  return <CSmartPagination {...props} />;
}
