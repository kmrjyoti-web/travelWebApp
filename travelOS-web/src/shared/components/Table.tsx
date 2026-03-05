'use client';
import React from 'react';
import { CTable, CTableHead, CTableBody, CTableFoot, CTableRow, CTableHeaderCell, CTableDataCell, CTableCaption } from '@coreui/react';
import type { ComponentProps } from 'react';

export type TableProps = ComponentProps<typeof CTable>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => <CTable ref={ref} hover responsive {...props} />);
Table.displayName = 'Table';

export const TableHead = (props: ComponentProps<typeof CTableHead>) => <CTableHead {...props} />;
TableHead.displayName = 'TableHead';

export const TableBody = (props: ComponentProps<typeof CTableBody>) => <CTableBody {...props} />;
TableBody.displayName = 'TableBody';

export const TableFoot = (props: ComponentProps<typeof CTableFoot>) => <CTableFoot {...props} />;
TableFoot.displayName = 'TableFoot';

export const TableRow = (props: ComponentProps<typeof CTableRow>) => <CTableRow {...props} />;
TableRow.displayName = 'TableRow';

export const TableHeaderCell = (props: ComponentProps<typeof CTableHeaderCell>) => <CTableHeaderCell {...props} />;
TableHeaderCell.displayName = 'TableHeaderCell';

export const TableDataCell = (props: ComponentProps<typeof CTableDataCell>) => <CTableDataCell {...props} />;
TableDataCell.displayName = 'TableDataCell';

export const TableCaption = CTableCaption;
