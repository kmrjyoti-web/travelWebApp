'use client';
import React from 'react';
import {
  Table, TableHead, TableBody, TableRow,
  TableHeaderCell, TableDataCell,
  Pagination, PaginationItem,
} from '.';
import { EmptyState }    from './EmptyState';
import { TableSkeleton } from './TableSkeleton';
import { ActionsMenu }   from './ActionsMenu';
import { Checkbox }      from './forms/Checkbox';
import { Icon }          from './Icon';
import type { ActionMenuItem } from './ActionsMenu';

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Custom cell renderer */
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Total record count for server-side pagination */
  totalRecords?: number;
  loading?: boolean;
  /** 1-based current page */
  page?: number;
  pageSize?: number;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onPageChange?: (page: number) => void;
  onSortChange?: (key: string, dir: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  /** Returns ActionsMenu items per row */
  rowActions?: (row: T) => ActionMenuItem[];
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

/**
 * Full-featured data table with sorting, server-side pagination,
 * row selection, and per-row ActionsMenu.
 *
 * @example
 * <DataTable
 *   columns={[{ key: 'name', label: 'Name', sortable: true }]}
 *   data={rows}
 *   totalRecords={total}
 *   page={page}
 *   pageSize={20}
 *   onPageChange={setPage}
 *   onSortChange={(key, dir) => setSort({ key, dir })}
 *   rowActions={(row) => [
 *     { label: 'Edit',   icon: 'Pencil', onClick: () => edit(row) },
 *     { label: 'Delete', icon: 'Trash2', onClick: () => del(row), variant: 'danger' },
 *   ]}
 * />
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  totalRecords,
  loading = false,
  page = 1,
  pageSize = 20,
  sortKey,
  sortDir = 'asc',
  onPageChange,
  onSortChange,
  onRowClick,
  rowActions,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  emptyTitle = 'No results',
  emptyDescription,
  className = '',
}: DataTableProps<T>) {
  const totalPages = totalRecords !== undefined ? Math.ceil(totalRecords / pageSize) : 1;
  const allIds     = data.map((r) => String(r.id ?? ''));
  const allSel     = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someSel    = allIds.some((id) => selectedIds.includes(id)) && !allSel;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange(allSel ? [] : allIds);
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    );
  };

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    onSortChange(key, sortKey === key && sortDir === 'asc' ? 'desc' : 'asc');
  };

  const colCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  if (loading) {
    return <TableSkeleton columns={colCount} className={className} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon="Database"
        title={emptyTitle}
        description={emptyDescription}
        className={`my-4 ${className}`}
      />
    );
  }

  return (
    <div className={`tos-data-table${className ? ` ${className}` : ''}`}>
      <div className="tos-data-table__scroll">
        <Table hover striped responsive className="tos-data-table__table">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableHeaderCell style={{ width: 44 }}>
                  <Checkbox
                    checked={allSel}
                    indeterminate={someSel}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </TableHeaderCell>
              )}
              {columns.map((col) => (
                <TableHeaderCell
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align ?? 'left' }}
                  className={col.sortable ? 'tos-data-table__th--sortable' : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="tos-data-table__th-inner">
                    {col.label}
                    {col.sortable && (
                      <span className="tos-data-table__sort-icon" aria-hidden>
                        {sortKey === col.key
                          ? <Icon name={sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={12} />
                          : <Icon name="ArrowUpDown" size={12} />}
                      </span>
                    )}
                  </span>
                </TableHeaderCell>
              ))}
              {rowActions && <TableHeaderCell style={{ width: 48 }} />}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, rowIdx) => {
              const rowId   = String(row.id ?? rowIdx);
              const isSel   = selectedIds.includes(rowId);
              return (
                <TableRow
                  key={rowId}
                  className={[
                    onRowClick ? 'tos-data-table__row--clickable' : '',
                    isSel      ? 'tos-data-table__row--selected'  : '',
                  ].filter(Boolean).join(' ')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <TableDataCell onClick={(e) => { e.stopPropagation(); toggleRow(rowId); }}>
                      <Checkbox
                        checked={isSel}
                        onChange={() => toggleRow(rowId)}
                        aria-label={`Select row ${rowId}`}
                      />
                    </TableDataCell>
                  )}
                  {columns.map((col) => (
                    <TableDataCell key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] !== undefined && row[col.key] !== null
                            ? String(row[col.key])
                            : '—')}
                    </TableDataCell>
                  ))}
                  {rowActions && (
                    <TableDataCell onClick={(e) => e.stopPropagation()}>
                      <ActionsMenu items={rowActions(row)} />
                    </TableDataCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalRecords !== undefined && totalPages > 1 && onPageChange && (
        <div className="tos-data-table__footer">
          <span className="tos-data-table__count">
            {totalRecords.toLocaleString()} record{totalRecords !== 1 ? 's' : ''}
          </span>
          <Pagination aria-label="Table pagination">
            <PaginationItem disabled={page <= 1}>
              <a className="page-link" role="button" tabIndex={0}
                onClick={() => page > 1 && onPageChange(page - 1)}>‹</a>
            </PaginationItem>
            {buildPages(page, totalPages).map((p, i) =>
              p === '…'
                ? <PaginationItem key={`ellipsis-${i}`} disabled><a className="page-link">…</a></PaginationItem>
                : <PaginationItem key={p} active={p === page}>
                    <a className="page-link" role="button" tabIndex={0}
                      onClick={() => onPageChange(p as number)}>{p}</a>
                  </PaginationItem>,
            )}
            <PaginationItem disabled={page >= totalPages}>
              <a className="page-link" role="button" tabIndex={0}
                onClick={() => page < totalPages && onPageChange(page + 1)}>›</a>
            </PaginationItem>
          </Pagination>
        </div>
      )}
    </div>
  );
}

/** Builds page number array with ellipsis for large page counts */
function buildPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  if (current > 3)          pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2)  pages.push('…');
  pages.push(total);
  return pages;
}
