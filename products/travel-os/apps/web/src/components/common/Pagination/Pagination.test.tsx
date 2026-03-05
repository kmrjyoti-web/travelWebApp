import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { Pagination } from './Pagination';

// ─── Structure ────────────────────────────────────────────────────────────────

describe('Pagination — structure', () => {
  it('renders a <nav> element', () => {
    render(<Pagination currentPage={1} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByRole('navigation')).toBeDefined();
  });

  it('has default aria-label "Pagination"', () => {
    render(<Pagination currentPage={1} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Pagination');
  });

  it('forwards custom aria-label', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onChange={vi.fn()}
        aria-label="Results navigation"
      />,
    );
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe(
      'Results navigation',
    );
  });

  it('forwards data-testid', () => {
    render(<Pagination currentPage={1} totalPages={5} onChange={vi.fn()} data-testid="pg" />);
    expect(screen.getByTestId('pg')).toBeDefined();
  });

  it('renders First / Prev / Next / Last buttons', () => {
    render(<Pagination currentPage={3} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText('First page')).toBeDefined();
    expect(screen.getByLabelText('Previous page')).toBeDefined();
    expect(screen.getByLabelText('Next page')).toBeDefined();
    expect(screen.getByLabelText('Last page')).toBeDefined();
  });
});

// ─── Page buttons ─────────────────────────────────────────────────────────────

describe('Pagination — page buttons', () => {
  it('renders all pages when totalPages is small', () => {
    render(<Pagination currentPage={1} totalPages={5} onChange={vi.fn()} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByLabelText(`Page ${i}`)).toBeDefined();
    }
  });

  it('marks current page with aria-current="page"', () => {
    render(<Pagination currentPage={3} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Page 3').getAttribute('aria-current')).toBe('page');
  });

  it('applies tos-pagination__btn--active to current page', () => {
    render(<Pagination currentPage={2} totalPages={5} onChange={vi.fn()} data-testid="pg" />);
    expect(screen.getByTestId('pg-page-2').classList.contains('tos-pagination__btn--active')).toBe(
      true,
    );
  });

  it('other pages do not have aria-current', () => {
    render(<Pagination currentPage={2} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Page 1').getAttribute('aria-current')).toBeNull();
  });
});

// ─── Ellipsis ─────────────────────────────────────────────────────────────────

describe('Pagination — ellipsis', () => {
  it('shows ellipsis for large page counts', () => {
    render(<Pagination currentPage={5} totalPages={10} onChange={vi.fn()} />);
    const dots = document.querySelectorAll('.tos-pagination__dots');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('always shows first and last page', () => {
    render(<Pagination currentPage={5} totalPages={10} onChange={vi.fn()} />);
    expect(screen.queryByLabelText('Page 1')).not.toBeNull();
    expect(screen.queryByLabelText('Page 10')).not.toBeNull();
  });

  it('no ellipsis when pages fit in window', () => {
    render(<Pagination currentPage={1} totalPages={5} onChange={vi.fn()} />);
    expect(document.querySelectorAll('.tos-pagination__dots').length).toBe(0);
  });
});

// ─── Navigation callbacks ─────────────────────────────────────────────────────

describe('Pagination — navigation', () => {
  it('calls onChange with correct page when page button clicked', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Page 3'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with next page when Next clicked', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with prev page when Prev clicked', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange with 1 when First clicked', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('First page'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('calls onChange with totalPages when Last clicked', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Last page'));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('does not call onChange when clicking current page', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Page 3'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Disabled states ──────────────────────────────────────────────────────────

describe('Pagination — disabled states', () => {
  it('First and Prev are disabled on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onChange={vi.fn()} />);
    expect((screen.getByLabelText('First page') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText('Previous page') as HTMLButtonElement).disabled).toBe(true);
  });

  it('Next and Last are disabled on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onChange={vi.fn()} />);
    expect((screen.getByLabelText('Next page') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText('Last page') as HTMLButtonElement).disabled).toBe(true);
  });

  it('First and Prev are enabled when not on first page', () => {
    render(<Pagination currentPage={3} totalPages={5} onChange={vi.fn()} />);
    expect((screen.getByLabelText('First page') as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByLabelText('Previous page') as HTMLButtonElement).disabled).toBe(false);
  });
});

// ─── Per-page selector ────────────────────────────────────────────────────────

describe('Pagination — per-page selector', () => {
  it('renders per-page select when perPageOptions and onPerPageChange are provided', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onChange={vi.fn()}
        perPage={10}
        perPageOptions={[10, 25, 50]}
        onPerPageChange={vi.fn()}
        data-testid="pg"
      />,
    );
    expect(screen.getByTestId('pg-per-page')).toBeDefined();
  });

  it('calls onPerPageChange with number value on select change', () => {
    const onPerPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onChange={vi.fn()}
        perPage={10}
        perPageOptions={[10, 25, 50]}
        onPerPageChange={onPerPageChange}
        data-testid="pg"
      />,
    );
    fireEvent.change(screen.getByTestId('pg-per-page'), { target: { value: '25' } });
    expect(onPerPageChange).toHaveBeenCalledWith(25);
  });

  it('shows total items count when total is provided', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onChange={vi.fn()}
        total={120}
        perPageOptions={[10]}
        onPerPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText('120 items')).toBeDefined();
  });

  it('does not render per-page selector when perPageOptions is not provided', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onChange={vi.fn()} data-testid="pg" />,
    );
    expect(screen.queryByTestId('pg-per-page')).toBeNull();
  });
});
