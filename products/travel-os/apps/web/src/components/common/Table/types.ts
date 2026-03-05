import type { ReactNode, CSSProperties } from 'react';
import type { BaseProps } from '../types';

// ─── Sort ─────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortState {
  key: string;
  direction: SortDirection;
}

// ─── Column definition ────────────────────────────────────────────────────────

export interface TableColumn<T = Record<string, unknown>> {
  /** Unique column key — should match a key on the data row (used for sorting). */
  key: string;
  /** Header label text. */
  header: string;
  /** Custom cell renderer.  Falls back to `String(row[key])` if omitted. */
  render?: (row: T, rowIndex: number) => ReactNode;
  /** Whether this column supports sorting. */
  sortable?: boolean;
  /** Fixed column width (px or CSS value). */
  width?: number | string;
  /** Text alignment for cells in this column. Default 'left'. */
  align?: 'left' | 'center' | 'right';
  /** Class applied to <th> and all <td> in this column. */
  className?: string;
}

// ─── Row selection ────────────────────────────────────────────────────────────

export interface TableSelectionProps<T = Record<string, unknown>> {
  /** Currently selected row keys (controlled). */
  selectedKeys?: Set<string>;
  /** Called when selection changes. */
  onSelectionChange?: (keys: Set<string>) => void;
  /** Function to get a stable string key from a row. Default: String(index). */
  getRowKey?: (row: T, index: number) => string;
}

// ─── Table props ──────────────────────────────────────────────────────────────

export interface TableProps<T = Record<string, unknown>> extends BaseProps {
  /** Column definitions. */
  columns: TableColumn<T>[];
  /** Row data. */
  data: T[];
  /** Show a loading skeleton (hides data rows). */
  loading?: boolean;
  /** Message shown when `data` is empty and not loading. */
  emptyMessage?: string;
  /** Content shown in the empty state slot (overrides emptyMessage). */
  emptyContent?: ReactNode;
  /** Make the table header sticky (requires a constrained container height). */
  stickyHeader?: boolean;
  /** Active sort state (controlled). */
  sortState?: SortState;
  /** Called when a sortable column header is clicked. */
  onSortChange?: (sort: SortState) => void;
  /** Row selection config. Pass to enable checkboxes. */
  selection?: TableSelectionProps<T>;
  /** Called when a row is clicked. */
  onRowClick?: (row: T, index: number) => void;
  /** Number of skeleton rows shown during loading. Default 5. */
  loadingRowCount?: number;
  /** Accessible caption for the table (required for a11y). */
  caption?: string;
  /** Additional styles on the scroll wrapper. */
  style?: CSSProperties;
}
