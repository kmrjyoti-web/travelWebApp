import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from './Dropdown';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicDropdown({
  onSelect = vi.fn(),
  closeOnSelect,
  placement,
  open,
  defaultOpen,
  onOpenChange,
}: {
  onSelect?: () => void;
  closeOnSelect?: boolean;
  placement?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  return (
    <Dropdown
      closeOnSelect={closeOnSelect}
      placement={placement as never}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <DropdownTrigger>Open</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={onSelect} data-testid="item-edit">
          Edit
        </DropdownItem>
        <DropdownItem data-testid="item-disabled" disabled>
          Disabled
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem destructive onSelect={onSelect} data-testid="item-delete">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

// ─── Structure ────────────────────────────────────────────────────────────────

describe('Dropdown — structure', () => {
  it('renders root element', () => {
    render(<BasicDropdown />);
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  it('renders trigger', () => {
    render(<BasicDropdown />);
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
  });

  it('menu is not rendered when closed', () => {
    render(<BasicDropdown />);
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('trigger has aria-haspopup and aria-expanded=false when closed', () => {
    render(<BasicDropdown />);
    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies placement class to root', () => {
    render(<BasicDropdown placement="top-end" />);
    expect(screen.getByTestId('dropdown').className).toContain(
      'tos-dropdown--top-end',
    );
  });

  it('custom data-testid is passed to root', () => {
    render(
      <Dropdown data-testid="my-dd">
        <DropdownTrigger>T</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    expect(screen.getByTestId('my-dd')).toBeInTheDocument();
  });
});

// ─── Open / close behaviour ───────────────────────────────────────────────────

describe('Dropdown — open/close', () => {
  it('opens when trigger is clicked', () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('closes when trigger is clicked again', () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('trigger aria-expanded=true when open', () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown-trigger')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('root element gets --open modifier when open', () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown').className).toContain('tos-dropdown--open');
  });

  it('closes on Escape key', () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <BasicDropdown />
        <div data-testid="outside">outside</div>
      </div>,
    );
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('opens with defaultOpen=true', () => {
    render(<BasicDropdown defaultOpen />);
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('calls onOpenChange when toggled', () => {
    const onOpenChange = vi.fn();
    render(<BasicDropdown onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('controlled open prop overrides internal state', () => {
    render(<BasicDropdown open={true} />);
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('controlled open=false keeps menu hidden', () => {
    render(<BasicDropdown open={false} />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });
});

// ─── Item selection ───────────────────────────────────────────────────────────

describe('DropdownItem — selection', () => {
  it('calls onSelect when item is clicked', () => {
    const onSelect = vi.fn();
    render(<BasicDropdown onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    fireEvent.click(screen.getByTestId('item-edit'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes menu after selection by default (closeOnSelect=true)', () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    fireEvent.click(screen.getByTestId('item-edit'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('keeps menu open when closeOnSelect=false', () => {
    render(<BasicDropdown closeOnSelect={false} />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    fireEvent.click(screen.getByTestId('item-edit'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('does not call onSelect for disabled item', () => {
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>T</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled onSelect={onSelect} data-testid="dis">
            Disabled
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'T' }));
    fireEvent.click(screen.getByTestId('dis'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('activates item on Enter key', () => {
    const onSelect = vi.fn();
    render(<BasicDropdown onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    fireEvent.keyDown(screen.getByTestId('item-edit'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('activates item on Space key', () => {
    const onSelect = vi.fn();
    render(<BasicDropdown onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    fireEvent.keyDown(screen.getByTestId('item-edit'), { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

// ─── Item appearance ──────────────────────────────────────────────────────────

describe('DropdownItem — appearance', () => {
  it('renders label text', () => {
    render(<BasicDropdown defaultOpen />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('applies --destructive modifier', () => {
    render(<BasicDropdown defaultOpen />);
    expect(screen.getByTestId('item-delete').className).toContain(
      'tos-dropdown-item--destructive',
    );
  });

  it('applies --disabled modifier', () => {
    render(<BasicDropdown defaultOpen />);
    expect(screen.getByTestId('item-disabled').className).toContain(
      'tos-dropdown-item--disabled',
    );
  });

  it('renders icon slot when icon is provided', () => {
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>T</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem icon={<span data-testid="icon" />}>Action</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders shortcut text when provided', () => {
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>T</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem shortcut="⌘S">Save</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    expect(screen.getByText('⌘S')).toBeInTheDocument();
  });

  it('renders as anchor when href is provided', () => {
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>T</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem href="/dashboard" data-testid="link-item">
            Dashboard
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    const item = screen.getByTestId('link-item');
    expect(item.tagName).toBe('A');
    expect(item).toHaveAttribute('href', '/dashboard');
  });
});

// ─── Sub-components ───────────────────────────────────────────────────────────

describe('DropdownSeparator', () => {
  it('renders a separator', () => {
    render(<BasicDropdown defaultOpen />);
    expect(screen.getByTestId('dropdown-separator')).toBeInTheDocument();
  });

  it('has role=separator', () => {
    render(<BasicDropdown defaultOpen />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});

describe('DropdownLabel', () => {
  it('renders label text', () => {
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>T</DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel data-testid="section-label">Section A</DropdownLabel>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    expect(screen.getByTestId('section-label')).toHaveTextContent('Section A');
  });
});

// ─── Keyboard navigation ──────────────────────────────────────────────────────

describe('Dropdown — keyboard navigation', () => {
  it('ArrowDown on trigger opens the menu', () => {
    render(<BasicDropdown />);
    fireEvent.keyDown(screen.getByTestId('dropdown-trigger'), { key: 'ArrowDown' });
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('ArrowDown moves focus to next item', async () => {
    render(<BasicDropdown defaultOpen />);
    const menu = screen.getByTestId('dropdown-menu');
    const items = screen
      .getAllByTestId(/dropdown-item|item-edit|item-delete/)
      .filter((el) => el.getAttribute('role') === 'menuitem');

    // Focus first item
    items[0].focus();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    // Second enabled item should be focused (skips disabled)
    await waitFor(() => expect(document.activeElement).toBe(items[1]));
  });

  it('Home key focuses the first item', async () => {
    render(<BasicDropdown defaultOpen />);
    const menu = screen.getByTestId('dropdown-menu');
    const items = Array.from(
      menu.querySelectorAll<HTMLElement>(
        '[data-dropdown-item]:not([aria-disabled="true"])',
      ),
    );
    items[items.length - 1].focus();
    fireEvent.keyDown(menu, { key: 'Home' });
    await waitFor(() => expect(document.activeElement).toBe(items[0]));
  });

  it('End key focuses the last item', async () => {
    render(<BasicDropdown defaultOpen />);
    const menu = screen.getByTestId('dropdown-menu');
    const items = Array.from(
      menu.querySelectorAll<HTMLElement>(
        '[data-dropdown-item]:not([aria-disabled="true"])',
      ),
    );
    items[0].focus();
    fireEvent.keyDown(menu, { key: 'End' });
    await waitFor(() =>
      expect(document.activeElement).toBe(items[items.length - 1]),
    );
  });
});

// ─── Error boundary ───────────────────────────────────────────────────────────

describe('Dropdown sub-components outside Dropdown', () => {
  it('DropdownTrigger throws if not inside Dropdown', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DropdownTrigger>T</DropdownTrigger>)).toThrow(
      'DropdownTrigger must be used inside a Dropdown',
    );
    err.mockRestore();
  });

  it('DropdownMenu throws if not inside Dropdown', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<DropdownMenu><DropdownItem>X</DropdownItem></DropdownMenu>),
    ).toThrow('DropdownMenu must be used inside a Dropdown');
    err.mockRestore();
  });
});
