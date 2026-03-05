import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Table } from './Table';
import type { TableColumn, SortState } from './types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

interface Person {
  id: number;
  name: string;
  role: string;
  age: number;
}

const COLUMNS: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'age', header: 'Age', sortable: true, align: 'right' },
];

const DATA: Person[] = [
  { id: 1, name: 'Alice', role: 'Engineer', age: 30 },
  { id: 2, name: 'Bob', role: 'Designer', age: 25 },
  { id: 3, name: 'Carol', role: 'Manager', age: 35 },
];

const KEY_FN = (row: Person) => String(row.id);

// ─── Structure ────────────────────────────────────────────────────────────────

describe('Table — structure', () => {
  it('renders wrapper and table elements', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByTestId('table-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders a <table> element', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByTestId('table-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('table-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('table-row-2')).toBeInTheDocument();
  });

  it('renders cell data correctly', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByTestId('td-0-name')).toHaveTextContent('Alice');
    expect(screen.getByTestId('td-1-role')).toHaveTextContent('Designer');
    expect(screen.getByTestId('td-2-age')).toHaveTextContent('35');
  });

  it('renders caption when provided', () => {
    render(<Table columns={COLUMNS} data={DATA} caption="User list" />);
    expect(screen.getByText('User list')).toBeInTheDocument();
  });

  it('applies custom data-testid to wrapper', () => {
    render(<Table columns={COLUMNS} data={DATA} data-testid="my-table" />);
    expect(screen.getByTestId('my-table')).toBeInTheDocument();
  });

  it('applies sticky header modifier class', () => {
    render(<Table columns={COLUMNS} data={DATA} stickyHeader />);
    expect(screen.getByTestId('table-wrapper').className).toContain(
      'tos-table-wrapper--sticky-header',
    );
  });

  it('uses custom cell renderer when render is provided', () => {
    const columns: TableColumn<Person>[] = [
      {
        key: 'name',
        header: 'Name',
        render: (row) => <strong data-testid={`strong-${row.id}`}>{row.name}</strong>,
      },
    ];
    render(<Table columns={columns} data={DATA} />);
    expect(screen.getByTestId('strong-1')).toHaveTextContent('Alice');
  });

  it('applies align class to header and cells', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByTestId('th-age').className).toContain('tos-table__th--right');
    expect(screen.getByTestId('td-0-age').className).toContain('tos-table__td--right');
  });
});

// ─── Sorting ──────────────────────────────────────────────────────────────────

describe('Table — sorting', () => {
  it('sortable column header has --sortable class', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByTestId('th-name').className).toContain('tos-table__th--sortable');
  });

  it('non-sortable column header does NOT have --sortable class', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.getByTestId('th-role').className).not.toContain('tos-table__th--sortable');
  });

  it('calls onSortChange with asc when unsorted column header is clicked', () => {
    const onSortChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        onSortChange={onSortChange}
        sortState={{ key: '', direction: 'none' }}
      />,
    );
    fireEvent.click(screen.getByTestId('th-name'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });

  it('calls onSortChange with desc when asc column is clicked', () => {
    const onSortChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        onSortChange={onSortChange}
        sortState={{ key: 'name', direction: 'asc' }}
      />,
    );
    fireEvent.click(screen.getByTestId('th-name'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'desc' });
  });

  it('calls onSortChange with none when desc column is clicked', () => {
    const onSortChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        onSortChange={onSortChange}
        sortState={{ key: 'name', direction: 'desc' }}
      />,
    );
    fireEvent.click(screen.getByTestId('th-name'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'none' });
  });

  it('header shows asc class when sortState matches', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        sortState={{ key: 'name', direction: 'asc' }}
      />,
    );
    expect(screen.getByTestId('th-name').className).toContain('tos-table__th--sort-asc');
  });

  it('header aria-sort=ascending for asc sort', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        sortState={{ key: 'name', direction: 'asc' }}
      />,
    );
    expect(screen.getByTestId('th-name')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('activates sort via Enter key on sortable header', () => {
    const onSortChange = vi.fn();
    render(
      <Table columns={COLUMNS} data={DATA} onSortChange={onSortChange} />,
    );
    fireEvent.keyDown(screen.getByTestId('th-name'), { key: 'Enter' });
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });

  it('does not call onSortChange when non-sortable header is clicked', () => {
    const onSortChange = vi.fn();
    render(<Table columns={COLUMNS} data={DATA} onSortChange={onSortChange} />);
    fireEvent.click(screen.getByTestId('th-role'));
    expect(onSortChange).not.toHaveBeenCalled();
  });
});

// ─── Loading state ────────────────────────────────────────────────────────────

describe('Table — loading', () => {
  it('applies --loading class when loading=true', () => {
    render(<Table columns={COLUMNS} data={[]} loading />);
    expect(screen.getByTestId('table').className).toContain('tos-table--loading');
  });

  it('renders skeleton rows when loading', () => {
    render(<Table columns={COLUMNS} data={[]} loading loadingRowCount={3} />);
    const skeletonRows = screen
      .getByRole('table')
      .querySelectorAll('[aria-hidden="true"]');
    expect(skeletonRows.length).toBe(3);
  });

  it('does not render data rows while loading', () => {
    render(<Table columns={COLUMNS} data={DATA} loading />);
    expect(screen.queryByTestId('table-row-0')).not.toBeInTheDocument();
  });

  it('does not show empty state while loading', () => {
    render(<Table columns={COLUMNS} data={[]} loading />);
    expect(screen.queryByTestId('table-empty')).not.toBeInTheDocument();
  });
});

// ─── Empty state ──────────────────────────────────────────────────────────────

describe('Table — empty state', () => {
  it('renders empty cell when data is empty', () => {
    render(<Table columns={COLUMNS} data={[]} />);
    expect(screen.getByTestId('table-empty')).toBeInTheDocument();
  });

  it('shows default empty message', () => {
    render(<Table columns={COLUMNS} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom emptyMessage', () => {
    render(<Table columns={COLUMNS} data={[]} emptyMessage="Nothing here yet" />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('shows custom emptyContent over emptyMessage', () => {
    render(
      <Table
        columns={COLUMNS}
        data={[]}
        emptyContent={<div data-testid="custom-empty">Custom empty</div>}
        emptyMessage="Fallback"
      />,
    );
    expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
  });

  it('empty cell spans all columns', () => {
    render(<Table columns={COLUMNS} data={[]} />);
    const emptyCell = screen.getByTestId('table-empty');
    expect(emptyCell.closest('td')).toHaveAttribute('colspan', String(COLUMNS.length));
  });
});

// ─── Row selection ────────────────────────────────────────────────────────────

describe('Table — row selection', () => {
  it('renders checkboxes when selection config is provided', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        selection={{
          selectedKeys: new Set(),
          onSelectionChange: vi.fn(),
          getRowKey: KEY_FN,
        }}
      />,
    );
    expect(screen.getByTestId('checkbox-select-all')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-row-0')).toBeInTheDocument();
  });

  it('does not render checkboxes when selection is not provided', () => {
    render(<Table columns={COLUMNS} data={DATA} />);
    expect(screen.queryByTestId('checkbox-select-all')).not.toBeInTheDocument();
  });

  it('calls onSelectionChange with all keys when select-all is clicked', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        selection={{
          selectedKeys: new Set(),
          onSelectionChange,
          getRowKey: KEY_FN,
        }}
      />,
    );
    fireEvent.click(screen.getByTestId('checkbox-select-all'));
    const called = onSelectionChange.mock.calls[0][0] as Set<string>;
    expect([...called].sort()).toEqual(['1', '2', '3']);
  });

  it('calls onSelectionChange with empty set when deselect-all is clicked', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        selection={{
          selectedKeys: new Set(['1', '2', '3']),
          onSelectionChange,
          getRowKey: KEY_FN,
        }}
      />,
    );
    fireEvent.click(screen.getByTestId('checkbox-select-all'));
    const called = onSelectionChange.mock.calls[0][0] as Set<string>;
    expect(called.size).toBe(0);
  });

  it('selects individual row on checkbox click', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        selection={{
          selectedKeys: new Set(),
          onSelectionChange,
          getRowKey: KEY_FN,
        }}
      />,
    );
    fireEvent.click(screen.getByTestId('checkbox-row-0'));
    const called = onSelectionChange.mock.calls[0][0] as Set<string>;
    expect(called.has('1')).toBe(true);
  });

  it('deselects individual row on checkbox click when already selected', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        selection={{
          selectedKeys: new Set(['1']),
          onSelectionChange,
          getRowKey: KEY_FN,
        }}
      />,
    );
    fireEvent.click(screen.getByTestId('checkbox-row-0'));
    const called = onSelectionChange.mock.calls[0][0] as Set<string>;
    expect(called.has('1')).toBe(false);
  });

  it('selected row gets --selected class', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        selection={{
          selectedKeys: new Set(['1']),
          onSelectionChange: vi.fn(),
          getRowKey: KEY_FN,
        }}
      />,
    );
    expect(screen.getByTestId('table-row-0').className).toContain(
      'tos-table__tr--selected',
    );
  });

  it('selected row has aria-selected=true', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        selection={{
          selectedKeys: new Set(['2']),
          onSelectionChange: vi.fn(),
          getRowKey: KEY_FN,
        }}
      />,
    );
    expect(screen.getByTestId('table-row-1')).toHaveAttribute('aria-selected', 'true');
  });
});

// ─── Row click ────────────────────────────────────────────────────────────────

describe('Table — row click', () => {
  it('calls onRowClick with the row and index', () => {
    const onRowClick = vi.fn();
    render(<Table columns={COLUMNS} data={DATA} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByTestId('table-row-1'));
    expect(onRowClick).toHaveBeenCalledWith(DATA[1], 1);
  });

  it('row gets --clickable class when onRowClick is provided', () => {
    const onRowClick = vi.fn();
    render(<Table columns={COLUMNS} data={DATA} onRowClick={onRowClick} />);
    expect(screen.getByTestId('table-row-0').className).toContain(
      'tos-table__tr--clickable',
    );
  });
});
