import type { BaseProps } from '../types';

export interface PaginationProps extends BaseProps {
  /** Current page (1-based). */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called when the user navigates to a new page. */
  onChange: (page: number) => void;
  /**
   * Number of sibling pages shown on each side of the current page.
   * @default 1
   */
  siblingCount?: number;
  /** Current items-per-page value (for the per-page selector). */
  perPage?: number;
  /** Available per-page options. When set, a `<select>` is rendered. */
  perPageOptions?: number[];
  /** Called when the user changes the per-page value. */
  onPerPageChange?: (perPage: number) => void;
  /** Total item count — shown next to the per-page selector. */
  total?: number;
  /** Accessible label for the <nav> element. @default 'Pagination' */
  'aria-label'?: string;
}
