'use client';

/**
 * @file src/components/common/Pagination/Pagination.tsx
 *
 * TravelOS Pagination component.
 *
 * Features:
 *   • Ellipsis-based page range (first + last always visible, siblingCount around current)
 *   • First / Prev / Next / Last navigation buttons
 *   • Per-page <select> with total item count display
 *   • Full ARIA: role=navigation, aria-label, aria-current="page", aria-disabled
 *
 * Class anatomy: tos-pagination  tos-pagination__list  tos-pagination__item
 *   tos-pagination__btn  tos-pagination__btn--{first|prev|next|last|page|active}
 *   tos-pagination__dots  tos-pagination__per-page  tos-pagination__total
 */

import React from 'react';

import { cls } from '../utils';
import type { PaginationProps } from './types';

const BLOCK = 'tos-pagination';

/** Produces an inclusive range [start..end]. */
function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Returns the pages to show, inserting '...' where there are gaps.
 * First and last pages are always included.
 */
function getPageRange(
  current: number,
  total: number,
  siblings: number,
): Array<number | '...'> {
  const totalVisible = siblings * 2 + 5; // siblings*2 + current + first + last + 2 dots
  if (total <= totalVisible) return range(1, total);

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeftDots = leftSibling > 3;
  const showRightDots = rightSibling < total - 2;

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + 2 * siblings), '...', total];
  }
  if (showLeftDots && !showRightDots) {
    return [1, '...', ...range(total - (3 + 2 * siblings) + 1, total)];
  }
  return [1, '...', ...range(leftSibling, rightSibling), '...', total];
}

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  siblingCount = 1,
  perPage,
  perPageOptions,
  onPerPageChange,
  total,
  className,
  id,
  'data-testid': testId,
  'aria-label': ariaLabel = 'Pagination',
}: PaginationProps) {
  const pages = getPageRange(currentPage, totalPages, siblingCount);
  const atFirst = currentPage === 1;
  const atLast = currentPage === totalPages;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onChange(page);
  };

  return (
    <nav
      className={cls(BLOCK, className)}
      id={id}
      data-testid={testId}
      aria-label={ariaLabel}
    >
      <ul className={`${BLOCK}__list`} role="list">
        {/* First */}
        <li className={`${BLOCK}__item`}>
          <button
            type="button"
            className={cls(`${BLOCK}__btn`, `${BLOCK}__btn--first`)}
            onClick={() => goTo(1)}
            disabled={atFirst}
            aria-label="First page"
            data-testid={testId ? `${testId}-first` : undefined}
          >
            «
          </button>
        </li>

        {/* Prev */}
        <li className={`${BLOCK}__item`}>
          <button
            type="button"
            className={cls(`${BLOCK}__btn`, `${BLOCK}__btn--prev`)}
            onClick={() => goTo(currentPage - 1)}
            disabled={atFirst}
            aria-label="Previous page"
            data-testid={testId ? `${testId}-prev` : undefined}
          >
            ‹
          </button>
        </li>

        {/* Page numbers + ellipsis */}
        {pages.map((page, idx) =>
          page === '...' ? (
            <li key={`dots-${idx}`} className={`${BLOCK}__item`}>
              <span className={`${BLOCK}__dots`} aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={page} className={`${BLOCK}__item`}>
              <button
                type="button"
                className={cls(
                  `${BLOCK}__btn`,
                  `${BLOCK}__btn--page`,
                  page === currentPage && `${BLOCK}__btn--active`,
                )}
                onClick={() => goTo(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                data-testid={testId ? `${testId}-page-${page}` : undefined}
              >
                {page}
              </button>
            </li>
          ),
        )}

        {/* Next */}
        <li className={`${BLOCK}__item`}>
          <button
            type="button"
            className={cls(`${BLOCK}__btn`, `${BLOCK}__btn--next`)}
            onClick={() => goTo(currentPage + 1)}
            disabled={atLast}
            aria-label="Next page"
            data-testid={testId ? `${testId}-next` : undefined}
          >
            ›
          </button>
        </li>

        {/* Last */}
        <li className={`${BLOCK}__item`}>
          <button
            type="button"
            className={cls(`${BLOCK}__btn`, `${BLOCK}__btn--last`)}
            onClick={() => goTo(totalPages)}
            disabled={atLast}
            aria-label="Last page"
            data-testid={testId ? `${testId}-last` : undefined}
          >
            »
          </button>
        </li>
      </ul>

      {/* Per-page selector */}
      {perPageOptions && perPageOptions.length > 0 && onPerPageChange && (
        <div className={`${BLOCK}__per-page`}>
          {total != null && (
            <span className={`${BLOCK}__total`} aria-live="polite">
              {total} items
            </span>
          )}
          <label
            className={`${BLOCK}__per-page-label`}
            htmlFor={id ? `${id}-per-page` : undefined}
          >
            Rows per page
          </label>
          <select
            id={id ? `${id}-per-page` : undefined}
            className={`${BLOCK}__per-page-select`}
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            aria-label="Rows per page"
            data-testid={testId ? `${testId}-per-page` : undefined}
          >
            {perPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}
