import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from './Button';

// ─── Structure ────────────────────────────────────────────────────────────────

describe('Button — structure', () => {
  it('renders a <button> element by default', () => {
    render(<Button>Click</Button>);
    expect(document.querySelector('button')).not.toBeNull();
  });

  it('has type="button" by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it('renders children', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByText('Submit')).toBeDefined();
  });

  it('children are wrapped in tos-btn__label span', () => {
    render(<Button>Save</Button>);
    expect(document.querySelector('.tos-btn__label')).not.toBeNull();
    expect(document.querySelector('.tos-btn__label')?.textContent).toBe('Save');
  });

  it('root element has tos-btn class', () => {
    render(<Button>Click</Button>);
    expect(document.querySelector('.tos-btn')).not.toBeNull();
  });

  it('forwards data-testid to root element', () => {
    render(<Button data-testid="my-btn">Click</Button>);
    expect(screen.getByTestId('my-btn')).toBeDefined();
  });

  it('forwards id to root element', () => {
    render(<Button id="btn-1">Click</Button>);
    expect(document.getElementById('btn-1')).not.toBeNull();
  });

  it('does not render label span when children is null', () => {
    render(<Button>{null}</Button>);
    expect(document.querySelector('.tos-btn__label')).toBeNull();
  });

  it('does not render label span when children is undefined', () => {
    render(<Button />);
    expect(document.querySelector('.tos-btn__label')).toBeNull();
  });
});

// ─── Variants ─────────────────────────────────────────────────────────────────

describe('Button — variants', () => {
  it('defaults to primary variant', () => {
    render(<Button>Click</Button>);
    expect(document.querySelector('.tos-btn--primary')).not.toBeNull();
  });

  it('applies tos-btn--primary', () => {
    render(<Button variant="primary">Click</Button>);
    expect(document.querySelector('.tos-btn--primary')).not.toBeNull();
  });

  it('applies tos-btn--secondary', () => {
    render(<Button variant="secondary">Click</Button>);
    expect(document.querySelector('.tos-btn--secondary')).not.toBeNull();
  });

  it('applies tos-btn--outline', () => {
    render(<Button variant="outline">Click</Button>);
    expect(document.querySelector('.tos-btn--outline')).not.toBeNull();
  });

  it('applies tos-btn--ghost', () => {
    render(<Button variant="ghost">Click</Button>);
    expect(document.querySelector('.tos-btn--ghost')).not.toBeNull();
  });

  it('applies tos-btn--destructive', () => {
    render(<Button variant="destructive">Click</Button>);
    expect(document.querySelector('.tos-btn--destructive')).not.toBeNull();
  });

  it('applies tos-btn--link', () => {
    render(<Button variant="link">Click</Button>);
    expect(document.querySelector('.tos-btn--link')).not.toBeNull();
  });
});

// ─── Sizes ────────────────────────────────────────────────────────────────────

describe('Button — sizes', () => {
  it('defaults to md size', () => {
    render(<Button>Click</Button>);
    expect(document.querySelector('.tos-btn--md')).not.toBeNull();
  });

  it('applies tos-btn--sm for size="sm"', () => {
    render(<Button size="sm">Click</Button>);
    expect(document.querySelector('.tos-btn--sm')).not.toBeNull();
  });

  it('applies tos-btn--lg for size="lg"', () => {
    render(<Button size="lg">Click</Button>);
    expect(document.querySelector('.tos-btn--lg')).not.toBeNull();
  });
});

// ─── Disabled ─────────────────────────────────────────────────────────────────

describe('Button — disabled state', () => {
  it('adds tos-btn--disabled class when disabled', () => {
    render(<Button disabled>Click</Button>);
    expect(document.querySelector('.tos-btn--disabled')).not.toBeNull();
  });

  it('sets native disabled attribute when disabled', () => {
    render(<Button disabled>Click</Button>);
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('sets aria-disabled="true" when disabled', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button').getAttribute('aria-disabled')).toBe('true');
  });

  it('sets tabIndex=-1 when disabled', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button').getAttribute('tabindex')).toBe('-1');
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not have aria-disabled when not disabled', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button').getAttribute('aria-disabled')).toBeNull();
  });
});

// ─── Loading ──────────────────────────────────────────────────────────────────

describe('Button — loading state', () => {
  it('adds tos-btn--loading class when loading', () => {
    render(<Button loading>Click</Button>);
    expect(document.querySelector('.tos-btn--loading')).not.toBeNull();
  });

  it('also adds tos-btn--disabled class when loading', () => {
    render(<Button loading>Click</Button>);
    expect(document.querySelector('.tos-btn--disabled')).not.toBeNull();
  });

  it('sets aria-busy="true" when loading', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true');
  });

  it('renders spinner element when loading', () => {
    render(<Button loading>Click</Button>);
    expect(document.querySelector('.tos-btn__spinner')).not.toBeNull();
  });

  it('spinner is aria-hidden', () => {
    render(<Button loading>Click</Button>);
    expect(
      document.querySelector('.tos-btn__spinner')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('does not call onClick when loading', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not have aria-busy when not loading', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBeNull();
  });

  it('does not render spinner when not loading', () => {
    render(<Button>Click</Button>);
    expect(document.querySelector('.tos-btn__spinner')).toBeNull();
  });
});

// ─── Icons ────────────────────────────────────────────────────────────────────

describe('Button — icons', () => {
  it('renders leftIcon inside tos-btn__icon--left span', () => {
    render(<Button leftIcon={<svg data-testid="left-icon" />}>Click</Button>);
    expect(document.querySelector('.tos-btn__icon--left')).not.toBeNull();
    expect(screen.getByTestId('left-icon')).toBeDefined();
  });

  it('renders rightIcon inside tos-btn__icon--right span', () => {
    render(<Button rightIcon={<svg data-testid="right-icon" />}>Click</Button>);
    expect(document.querySelector('.tos-btn__icon--right')).not.toBeNull();
    expect(screen.getByTestId('right-icon')).toBeDefined();
  });

  it('icon container spans are aria-hidden', () => {
    render(
      <Button leftIcon={<svg />} rightIcon={<svg />}>
        Click
      </Button>,
    );
    const iconSpans = document.querySelectorAll('.tos-btn__icon');
    expect(iconSpans.length).toBe(2);
    iconSpans.forEach((span) => {
      expect(span.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('does not render tos-btn__icon--left when leftIcon is not provided', () => {
    render(<Button>Click</Button>);
    expect(document.querySelector('.tos-btn__icon--left')).toBeNull();
  });

  it('does not render tos-btn__icon--right when rightIcon is not provided', () => {
    render(<Button>Click</Button>);
    expect(document.querySelector('.tos-btn__icon--right')).toBeNull();
  });

  it('renders both icons and label in correct DOM order', () => {
    render(
      <Button
        leftIcon={<span data-testid="left" />}
        rightIcon={<span data-testid="right" />}
      >
        Label
      </Button>,
    );
    const btn = screen.getByRole('button');
    const children = Array.from(btn.children);
    // Expected order: tos-btn__icon--left, tos-btn__label, tos-btn__icon--right
    expect(children[0]?.classList.contains('tos-btn__icon--left')).toBe(true);
    expect(children[1]?.classList.contains('tos-btn__label')).toBe(true);
    expect(children[2]?.classList.contains('tos-btn__icon--right')).toBe(true);
  });
});

// ─── Polymorphic ──────────────────────────────────────────────────────────────

describe('Button — polymorphic (as prop)', () => {
  it('renders an <a> element when as="a"', () => {
    render(
      <Button as="a" href="/path">
        Link
      </Button>,
    );
    expect(document.querySelector('a')).not.toBeNull();
  });

  it('forwards href to anchor element', () => {
    render(
      <Button as="a" href="/dashboard">
        Dashboard
      </Button>,
    );
    expect(document.querySelector('a')?.getAttribute('href')).toBe('/dashboard');
  });

  it('forwards target to anchor element', () => {
    render(
      <Button as="a" href="/path" target="_blank">
        External
      </Button>,
    );
    expect(document.querySelector('a')?.getAttribute('target')).toBe('_blank');
  });

  it('forwards rel to anchor element', () => {
    render(
      <Button as="a" href="/path" rel="noopener noreferrer">
        External
      </Button>,
    );
    expect(document.querySelector('a')?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does NOT add native disabled attribute to anchor', () => {
    render(
      <Button as="a" href="/path" disabled>
        Disabled link
      </Button>,
    );
    // <a> does not support the disabled attribute — we rely on aria-disabled + tabIndex
    expect(document.querySelector('a')?.hasAttribute('disabled')).toBe(false);
  });

  it('still sets aria-disabled on anchor when disabled', () => {
    render(
      <Button as="a" href="/path" disabled>
        Disabled link
      </Button>,
    );
    expect(document.querySelector('a')?.getAttribute('aria-disabled')).toBe('true');
  });

  it('anchor does not get type attribute', () => {
    render(
      <Button as="a" href="/path">
        Link
      </Button>,
    );
    expect(document.querySelector('a')?.hasAttribute('type')).toBe(false);
  });
});

// ─── ARIA and props forwarding ────────────────────────────────────────────────

describe('Button — ARIA and props forwarding', () => {
  it('forwards aria-label', () => {
    render(<Button aria-label="Close dialog">×</Button>);
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Close dialog');
  });

  it('forwards aria-describedby', () => {
    render(<Button aria-describedby="help-text">Click</Button>);
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toBe('help-text');
  });

  it('forwards aria-controls', () => {
    render(<Button aria-controls="my-panel">Toggle</Button>);
    expect(screen.getByRole('button').getAttribute('aria-controls')).toBe('my-panel');
  });

  it('forwards aria-expanded', () => {
    render(<Button aria-expanded={true}>Menu</Button>);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
  });

  it('forwards aria-pressed', () => {
    render(<Button aria-pressed={true}>Bold</Button>);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('forwards tabIndex when not disabled', () => {
    render(<Button tabIndex={3}>Click</Button>);
    expect(screen.getByRole('button').getAttribute('tabindex')).toBe('3');
  });

  it('appends extra className to root class string', () => {
    render(<Button className="my-override">Click</Button>);
    expect(screen.getByRole('button').classList.contains('my-override')).toBe(true);
    // base class still present
    expect(screen.getByRole('button').classList.contains('tos-btn')).toBe(true);
  });

  it('forwards type="submit"', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
  });

  it('forwards type="reset"', () => {
    render(<Button type="reset">Reset</Button>);
    expect(screen.getByRole('button').getAttribute('type')).toBe('reset');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards name attribute', () => {
    render(<Button name="action">Click</Button>);
    expect(screen.getByRole('button').getAttribute('name')).toBe('action');
  });

  it('forwards value attribute', () => {
    render(<Button value="confirm">Click</Button>);
    expect(screen.getByRole('button').getAttribute('value')).toBe('confirm');
  });
});

// ─── Class composition order ──────────────────────────────────────────────────

describe('Button — class composition', () => {
  it('produces correct class order: block size variant disabled loading extra', () => {
    render(
      <Button
        size="lg"
        variant="primary"
        loading={true}
        disabled={true}
        className="custom"
      >
        Click
      </Button>,
    );
    const cls = screen.getByRole('button').className;
    const parts = cls.split(' ');
    expect(parts[0]).toBe('tos-btn');
    expect(parts).toContain('tos-btn--lg');
    expect(parts).toContain('tos-btn--primary');
    expect(parts).toContain('tos-btn--loading');
    expect(parts).toContain('tos-btn--disabled');
    expect(parts[parts.length - 1]).toBe('custom');
  });

  it('has no --disabled class when neither disabled nor loading', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button').classList.contains('tos-btn--disabled')).toBe(false);
  });

  it('has no --loading class when not loading', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button').classList.contains('tos-btn--loading')).toBe(false);
  });
});
