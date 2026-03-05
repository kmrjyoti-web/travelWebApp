'use client';

/**
 * @file src/components/common/Table/Table.tsx
 *
 * TravelOS data Table component.
 *
 * Features:
 *   • Column sorting (controlled) — click header to cycle asc → desc → none
 *   • Row selection via checkboxes (controlled)
 *   • Sticky header
 *   • Loading skeleton rows
 *   • Empty state (text or custom slot)
 *   • Responsive horizontal scroll wrapper
 *   • Row click handler
 *   • ARIA: role=table, columnheader sort attributes, aria-checked for selections
 *
 * Class anatomy:
 *   tos-table-wrapper  tos-table-wrapper--sticky-header
 *   tos-table  tos-table--loading  tos-table--selectable
 *   tos-table__caption
 *   tos-table__thead  tos-table__th  tos-table__th--{align}  tos-table__th--sortable
 *     tos-table__th--sort-asc  tos-table__th--sort-desc  tos-table__sort-icon
 *   tos-table__tbody
 *   tos-table__tr  tos-table__tr--selected  tos-table__tr--clickable
 *   tos-table__td  tos-table__td--{align}
 *   tos-table__checkbox-cell  tos-table__skeleton-cell
 *   tos-table__empty  tos-table__empty-cell
 */

import React, { useCallback, useId } from 'react';
import { cls } from '../utils';
import type { SortDirection, SortState, TableColumn, TableProps } from './types';

const BLOCK = 'tos-table';

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <span className={`${BLOCK}__sort-icon`} aria-hidden="true">
      {direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'}
    </span>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow({
  colCount,
  hasSelection,
}: {
  colCount: number;
  hasSelection: boolean;
}) {
  return (
    <tr className={`${BLOCK}__tr ${BLOCK}__tr--skeleton`} aria-hidden="true">
      {hasSelection && (
        <td className={`${BLOCK}__td ${BLOCK}__checkbox-cell`}>
          <span className={`${BLOCK}__skeleton-cell`} />
        </td>
      )}
      {Array.from({ length: colCount }, (_, i) => (
        <td key={i} className={`${BLOCK}__td`}>
          <span className={`${BLOCK}__skeleton-cell`} />
        </td>
      ))}
    </tr>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

export function Table<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  emptyContent,
  stickyHeader = false,
  sortState,
  onSortChange,
  selection,
  onRowClick,
  loadingRowCount = 5,
  caption,
  className,
  id,
  style,
  'data-testid': testId,
}: TableProps<T>) {
  const uid = useId();
  const hasSelection = Boolean(selection);

  // ─── Key helper ─────────────────────────────────────────────────────────
  const getKey = useCallback(
    (row: T, index: number): string => {
      return selection?.getRowKey ? selection.getRowKey(row, index) : String(index);
    },
    [selection],
  );

  // ─── Sort ────────────────────────────────────────────────────────────────
  function handleSortClick(col: TableColumn<T>) {
    if (!col.sortable || !onSortChange) return;
    const current = sortState?.key === col.key ? sortState.direction : 'none';
    let next: SortDirection;
    if (current === 'none') next = 'asc';
    else if (current === 'asc') next = 'desc';
    else next = 'none';
    onSortChange({ key: col.key, direction: next });
  }

  // ─── Selection ───────────────────────────────────────────────────────────
  const isRowSelected = (row: T, index: number): boolean => {
    if (!selection?.selectedKeys) return false;
    return selection.selectedKeys.has(getKey(row, index));
  };

  const allKeys = data.map((row, i) => getKey(row, i));
  const allSelected =
    allKeys.length > 0 &&
    selection?.selectedKeys !== undefined &&
    allKeys.every((k) => selection.selectedKeys!.has(k));
  const someSelected =
    !allSelected &&
    allKeys.some((k) => selection?.selectedKeys?.has(k) ?? false);

  function handleSelectAll() {
    if (!selection?.onSelectionChange) return;
    if (allSelected) {
      selection.onSelectionChange(new Set());
    } else {
      selection.onSelectionChange(new Set(allKeys));
    }
  }

  function handleSelectRow(row: T, index: number) {
    if (!selection?.onSelectionChange) return;
    const key = getKey(row, index);
    const next = new Set(selection.selectedKeys ?? []);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    selection.onSelectionChange(next);
  }

  // ─── Class composition ───────────────────────────────────────────────────
  const wrapperCls = cls(
    `${BLOCK}-wrapper`,
    stickyHeader && `${BLOCK}-wrapper--sticky-header`,
    className,
  );

  const tableCls = cls(
    BLOCK,
    loading && `${BLOCK}--loading`,
    hasSelection && `${BLOCK}--selectable`,
    onRowClick && `${BLOCK}--row-clickable`,
  );

  // ─── Render ──────────────────────────────────────────────────────────────
  const isEmpty = !loading && data.length === 0;

  const colCount = columns.length;
  const totalCols = colCount + (hasSelection ? 1 : 0);

  return (
    <div
      className={wrapperCls}
      id={id}
      style={style}
      data-testid={testId ?? 'table-wrapper'}
    >
      <table className={tableCls} data-testid="table">
        {caption && (
          <caption className={`${BLOCK}__caption`}>{caption}</caption>
        )}

        {/* ── Header ──────────────────────────────────────────────────── */}
        <thead className={`${BLOCK}__thead`}>
          <tr>
            {hasSelection && (
              <th
                scope="col"
                className={`${BLOCK}__th ${BLOCK}__checkbox-cell`}
                data-testid="th-select-all"
              >
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  data-testid="checkbox-select-all"
                />
              </th>
            )}

            {columns.map((col) => {
              const colSortDir =
                sortState?.key === col.key ? sortState.direction : 'none';
              const thCls = cls(
                `${BLOCK}__th`,
                col.align ? `${BLOCK}__th--${col.align}` : null,
                col.sortable && `${BLOCK}__th--sortable`,
                col.sortable && colSortDir === 'asc' && `${BLOCK}__th--sort-asc`,
                col.sortable && colSortDir === 'desc' && `${BLOCK}__th--sort-desc`,
                col.className,
              );

              const ariaSortMap: Record<string, 'ascending' | 'descending' | 'none'> = {
                asc: 'ascending',
                desc: 'descending',
                none: 'none',
              };

              return (
                <th
                  key={col.key}
                  scope="col"
                  className={thCls}
                  style={col.width !== undefined ? { width: col.width } : undefined}
                  aria-sort={col.sortable ? ariaSortMap[colSortDir] : undefined}
                  onClick={col.sortable ? () => handleSortClick(col) : undefined}
                  onKeyDown={
                    col.sortable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSortClick(col);
                          }
                        }
                      : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                  data-testid={`th-${col.key}`}
                >
                  {col.header}
                  {col.sortable && <SortIcon direction={colSortDir} />}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <tbody className={`${BLOCK}__tbody`}>
          {loading ? (
            Array.from({ length: loadingRowCount }, (_, i) => (
              <SkeletonRow key={i} colCount={colCount} hasSelection={hasSelection} />
            ))
          ) : isEmpty ? (
            <tr>
              <td
                colSpan={totalCols}
                className={`${BLOCK}__empty-cell`}
                data-testid="table-empty"
              >
                <div className={`${BLOCK}__empty`}>
                  {emptyContent ?? <span>{emptyMessage}</span>}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = getKey(row, rowIndex);
              const selected = isRowSelected(row, rowIndex);
              const trCls = cls(
                `${BLOCK}__tr`,
                selected && `${BLOCK}__tr--selected`,
                onRowClick && `${BLOCK}__tr--clickable`,
              );

              return (
                <tr
                  key={rowKey}
                  className={trCls}
                  aria-selected={hasSelection ? selected : undefined}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                  data-testid={`table-row-${rowIndex}`}
                >
                  {hasSelection && (
                    <td className={`${BLOCK}__td ${BLOCK}__checkbox-cell`}>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${rowIndex + 1}`}
                        checked={selected}
                        onChange={() => handleSelectRow(row, rowIndex)}
                        data-testid={`checkbox-row-${rowIndex}`}
                      />
                    </td>
                  )}

                  {columns.map((col) => {
                    const tdCls = cls(
                      `${BLOCK}__td`,
                      col.align ? `${BLOCK}__td--${col.align}` : null,
                      col.className,
                    );
                    const cellValue = col.render
                      ? col.render(row, rowIndex)
                      : String((row as Record<string, unknown>)[col.key] ?? '');

                    return (
                      <td
                        key={col.key}
                        className={tdCls}
                        data-testid={`td-${rowIndex}-${col.key}`}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
