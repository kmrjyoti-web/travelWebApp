import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { Badge } from './Badge';

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Badge — rendering', () => {
  it('renders a <span> element with tos-badge class', () => {
    render(<Badge>New</Badge>);
    expect(document.querySelector('span.tos-badge')).not.toBeNull();
  });

  it('renders children inside tos-badge__label span', () => {
    render(<Badge>New</Badge>);
    expect(document.querySelector('.tos-badge__label')?.textContent).toBe('New');
  });

  it('forwards data-testid', () => {
    render(<Badge data-testid="my-badge">New</Badge>);
    expect(screen.getByTestId('my-badge')).toBeDefined();
  });

  it('forwards id', () => {
    render(<Badge id="badge-1">New</Badge>);
    expect(document.getElementById('badge-1')).not.toBeNull();
  });

  it('forwards aria-label', () => {
    render(<Badge aria-label="3 unread" dot />);
    expect(document.querySelector('.tos-badge')?.getAttribute('aria-label')).toBe('3 unread');
  });

  it('appends extra className', () => {
    render(<Badge className="custom">New</Badge>);
    expect(document.querySelector('.tos-badge')?.classList.contains('custom')).toBe(true);
  });
});

// ─── Variants ─────────────────────────────────────────────────────────────────

describe('Badge — variants', () => {
  it('defaults to solid variant', () => {
    render(<Badge>New</Badge>);
    expect(document.querySelector('.tos-badge--solid')).not.toBeNull();
  });

  it('applies tos-badge--solid', () => {
    render(<Badge variant="solid">New</Badge>);
    expect(document.querySelector('.tos-badge--solid')).not.toBeNull();
  });

  it('applies tos-badge--outline', () => {
    render(<Badge variant="outline">New</Badge>);
    expect(document.querySelector('.tos-badge--outline')).not.toBeNull();
  });

  it('applies tos-badge--soft', () => {
    render(<Badge variant="soft">New</Badge>);
    expect(document.querySelector('.tos-badge--soft')).not.toBeNull();
  });
});

// ─── Sizes ────────────────────────────────────────────────────────────────────

describe('Badge — sizes', () => {
  it('defaults to md size', () => {
    render(<Badge>New</Badge>);
    expect(document.querySelector('.tos-badge--md')).not.toBeNull();
  });

  it('applies tos-badge--sm', () => {
    render(<Badge size="sm">New</Badge>);
    expect(document.querySelector('.tos-badge--sm')).not.toBeNull();
  });

  it('applies tos-badge--lg', () => {
    render(<Badge size="lg">New</Badge>);
    expect(document.querySelector('.tos-badge--lg')).not.toBeNull();
  });
});

// ─── Intents ──────────────────────────────────────────────────────────────────

describe('Badge — intents', () => {
  it('has no intent class for default', () => {
    render(<Badge>New</Badge>);
    expect(document.querySelector('.tos-badge--default')).toBeNull();
  });

  it('applies tos-badge--success', () => {
    render(<Badge intent="success">New</Badge>);
    expect(document.querySelector('.tos-badge--success')).not.toBeNull();
  });

  it('applies tos-badge--warning', () => {
    render(<Badge intent="warning">New</Badge>);
    expect(document.querySelector('.tos-badge--warning')).not.toBeNull();
  });

  it('applies tos-badge--error', () => {
    render(<Badge intent="error">New</Badge>);
    expect(document.querySelector('.tos-badge--error')).not.toBeNull();
  });

  it('applies tos-badge--info', () => {
    render(<Badge intent="info">New</Badge>);
    expect(document.querySelector('.tos-badge--info')).not.toBeNull();
  });
});

// ─── Dot ──────────────────────────────────────────────────────────────────────

describe('Badge — dot mode', () => {
  it('adds tos-badge--dot class', () => {
    render(<Badge dot />);
    expect(document.querySelector('.tos-badge--dot')).not.toBeNull();
  });

  it('does not render label span in dot mode', () => {
    render(<Badge dot>Ignored</Badge>);
    expect(document.querySelector('.tos-badge__label')).toBeNull();
  });

  it('does not render remove button in dot mode', () => {
    render(<Badge dot removable onRemove={vi.fn()} />);
    expect(document.querySelector('.tos-badge__remove')).toBeNull();
  });
});

// ─── Count ────────────────────────────────────────────────────────────────────

describe('Badge — count', () => {
  it('renders count number', () => {
    render(<Badge count={5} />);
    expect(document.querySelector('.tos-badge__label')?.textContent).toBe('5');
  });

  it('renders count as-is when equal to maxCount', () => {
    render(<Badge count={99} maxCount={99} />);
    expect(document.querySelector('.tos-badge__label')?.textContent).toBe('99');
  });

  it('renders maxCount+ when count exceeds default maxCount (99)', () => {
    render(<Badge count={100} />);
    expect(document.querySelector('.tos-badge__label')?.textContent).toBe('99+');
  });

  it('respects custom maxCount', () => {
    render(<Badge count={10} maxCount={9} />);
    expect(document.querySelector('.tos-badge__label')?.textContent).toBe('9+');
  });

  it('count takes precedence over children', () => {
    render(<Badge count={3}>Ignored</Badge>);
    expect(document.querySelector('.tos-badge__label')?.textContent).toBe('3');
  });

  it('renders 0 count', () => {
    render(<Badge count={0} />);
    expect(document.querySelector('.tos-badge__label')?.textContent).toBe('0');
  });
});

// ─── Removable ────────────────────────────────────────────────────────────────

describe('Badge — removable', () => {
  it('renders remove button when removable=true', () => {
    render(<Badge removable onRemove={vi.fn()}>Tag</Badge>);
    expect(document.querySelector('.tos-badge__remove')).not.toBeNull();
  });

  it('remove button has default aria-label "Remove"', () => {
    render(<Badge removable onRemove={vi.fn()}>Tag</Badge>);
    expect(document.querySelector('.tos-badge__remove')?.getAttribute('aria-label')).toBe(
      'Remove',
    );
  });

  it('remove button uses custom removeLabel', () => {
    render(
      <Badge removable removeLabel="Delete tag" onRemove={vi.fn()}>
        Tag
      </Badge>,
    );
    expect(document.querySelector('.tos-badge__remove')?.getAttribute('aria-label')).toBe(
      'Delete tag',
    );
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<Badge removable onRemove={onRemove}>Tag</Badge>);
    fireEvent.click(document.querySelector('.tos-badge__remove')!);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('does not render remove button when removable=false', () => {
    render(<Badge>Tag</Badge>);
    expect(document.querySelector('.tos-badge__remove')).toBeNull();
  });

  it('remove button × symbol is aria-hidden', () => {
    render(<Badge removable onRemove={vi.fn()}>Tag</Badge>);
    const inner = document.querySelector('.tos-badge__remove span');
    expect(inner?.getAttribute('aria-hidden')).toBe('true');
  });
});
