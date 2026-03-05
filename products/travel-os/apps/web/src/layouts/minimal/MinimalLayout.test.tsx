import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('./theme', () => ({
  applyMinimalTheme: vi.fn(),
}));
vi.mock('./MinimalHeader', () => ({
  MinimalHeader: ({ title, showBack, onBack, backLabel }: {
    title?: string; showBack?: boolean; onBack?: () => void; backLabel?: string;
  }) => (
    <header data-testid="mock-minimal-header">
      {showBack !== false && (
        <button
          data-testid="mock-back-btn"
          aria-label={backLabel ?? 'Go back'}
          onClick={onBack}
        >
          Back
        </button>
      )}
      {title && <h1 data-testid="mock-minimal-title">{title}</h1>}
    </header>
  ),
}));
vi.mock('./MinimalProgress', () => ({
  MinimalProgress: ({ step, totalSteps }: { step: number; totalSteps: number }) => (
    <div
      data-testid="mock-minimal-progress"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemax={totalSteps}
    />
  ),
}));

import { MinimalLayout } from './MinimalLayout';
import { applyMinimalTheme } from './theme';

// ─── MinimalLayout — structure ────────────────────────────────────────────────

describe('MinimalLayout — structure', () => {
  it('renders wrapper with data-layout=minimal', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(document.querySelector('[data-layout="minimal"]')).toBeDefined();
  });

  it('has data-testid=minimal-layout', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.getByTestId('minimal-layout')).toBeDefined();
  });

  it('wrapper has tos-min-layout class', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(document.querySelector('.tos-min-layout')).toBeDefined();
  });

  it('renders MinimalHeader', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.getByTestId('mock-minimal-header')).toBeDefined();
  });

  it('renders main element', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.getByRole('main')).toBeDefined();
  });

  it('main has id=minimal-main', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(document.getElementById('minimal-main')).toBeDefined();
  });

  it('main has data-testid=minimal-main', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.getByTestId('minimal-main')).toBeDefined();
  });

  it('main has tabIndex=-1 for skip-link focus', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.getByRole('main').getAttribute('tabindex')).toBe('-1');
  });

  it('main has tos-min-content class', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(document.querySelector('.tos-min-content')).toBeDefined();
  });

  it('renders children inside main', () => {
    render(<MinimalLayout><span data-testid="child">hello</span></MinimalLayout>);
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('does not render a sidebar', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});

// ─── MinimalLayout — main aria-label ─────────────────────────────────────────

describe('MinimalLayout — main aria-label', () => {
  it('uses title as main aria-label when provided', () => {
    render(<MinimalLayout title="Payment Details">content</MinimalLayout>);
    expect(screen.getByRole('main').getAttribute('aria-label')).toBe('Payment Details');
  });

  it('falls back to "Main content" when no title', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.getByRole('main').getAttribute('aria-label')).toBe('Main content');
  });
});

// ─── MinimalLayout — theme ────────────────────────────────────────────────────

describe('MinimalLayout — theme', () => {
  it('calls applyMinimalTheme on mount', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(applyMinimalTheme).toHaveBeenCalledOnce();
  });

  it('does not call applyMinimalTheme on re-render', () => {
    const { rerender } = render(<MinimalLayout>content</MinimalLayout>);
    (applyMinimalTheme as ReturnType<typeof vi.fn>).mockClear();
    rerender(<MinimalLayout>updated</MinimalLayout>);
    expect(applyMinimalTheme).not.toHaveBeenCalled();
  });
});

// ─── MinimalLayout — progress bar ────────────────────────────────────────────

describe('MinimalLayout — progress bar', () => {
  it('renders MinimalProgress when step + totalSteps ≥ 2 provided', () => {
    render(<MinimalLayout step={2} totalSteps={4}>content</MinimalLayout>);
    expect(screen.getByTestId('mock-minimal-progress')).toBeDefined();
  });

  it('does not render progress when totalSteps = 1', () => {
    render(<MinimalLayout step={1} totalSteps={1}>content</MinimalLayout>);
    expect(screen.queryByTestId('mock-minimal-progress')).toBeNull();
  });

  it('does not render progress when step/totalSteps not provided', () => {
    render(<MinimalLayout>content</MinimalLayout>);
    expect(screen.queryByTestId('mock-minimal-progress')).toBeNull();
  });

  it('does not render progress when only step is provided without totalSteps', () => {
    render(<MinimalLayout step={2}>content</MinimalLayout>);
    expect(screen.queryByTestId('mock-minimal-progress')).toBeNull();
  });

  it('passes step to MinimalProgress', () => {
    render(<MinimalLayout step={3} totalSteps={5}>content</MinimalLayout>);
    expect(screen.getByTestId('mock-minimal-progress').getAttribute('aria-valuenow')).toBe('3');
  });

  it('passes totalSteps to MinimalProgress', () => {
    render(<MinimalLayout step={3} totalSteps={5}>content</MinimalLayout>);
    expect(screen.getByTestId('mock-minimal-progress').getAttribute('aria-valuemax')).toBe('5');
  });

  it('progress appears between header and main in DOM', () => {
    render(<MinimalLayout step={1} totalSteps={3}>content</MinimalLayout>);
    const header   = screen.getByTestId('mock-minimal-header');
    const progress = screen.getByTestId('mock-minimal-progress');
    const main     = screen.getByRole('main');
    expect(
      header.compareDocumentPosition(progress) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      progress.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

// ─── MinimalLayout — keyboard shortcuts ──────────────────────────────────────

describe('MinimalLayout — Escape shortcut', () => {
  beforeEach(() => vi.clearAllMocks());

  it('Escape calls onBack when showBack=true and onBack provided', () => {
    const onBack = vi.fn();
    render(<MinimalLayout showBack={true} onBack={onBack}>content</MinimalLayout>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('Alt+ArrowLeft calls onBack when showBack=true', () => {
    const onBack = vi.fn();
    render(<MinimalLayout showBack={true} onBack={onBack}>content</MinimalLayout>);
    fireEvent.keyDown(document, { key: 'ArrowLeft', altKey: true });
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('Escape does not fire when onBack not provided', () => {
    const onBack = vi.fn();
    render(<MinimalLayout showBack={true}>content</MinimalLayout>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onBack).not.toHaveBeenCalled();
  });

  it('Escape does not fire when showBack=false', () => {
    const onBack = vi.fn();
    render(<MinimalLayout showBack={false} onBack={onBack}>content</MinimalLayout>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onBack).not.toHaveBeenCalled();
  });

  it('Escape with Ctrl held does not fire', () => {
    const onBack = vi.fn();
    render(<MinimalLayout showBack={true} onBack={onBack}>content</MinimalLayout>);
    fireEvent.keyDown(document, { key: 'Escape', ctrlKey: true });
    expect(onBack).not.toHaveBeenCalled();
  });

  it('Alt+ArrowRight does not trigger goBack', () => {
    const onBack = vi.fn();
    render(<MinimalLayout showBack={true} onBack={onBack}>content</MinimalLayout>);
    fireEvent.keyDown(document, { key: 'ArrowRight', altKey: true });
    expect(onBack).not.toHaveBeenCalled();
  });

  it('removes keydown listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <MinimalLayout showBack={true} onBack={vi.fn()}>content</MinimalLayout>,
    );
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });
});

// ─── MinimalLayout — header props forwarding ─────────────────────────────────

describe('MinimalLayout — props forwarding', () => {
  it('forwards title to MinimalHeader', () => {
    render(<MinimalLayout title="Account Setup">content</MinimalLayout>);
    expect(screen.getByTestId('mock-minimal-title').textContent).toBe('Account Setup');
  });

  it('forwards showBack=false to MinimalHeader (hides button)', () => {
    render(<MinimalLayout showBack={false}>content</MinimalLayout>);
    expect(screen.queryByTestId('mock-back-btn')).toBeNull();
  });

  it('forwards backLabel to MinimalHeader', () => {
    render(<MinimalLayout backLabel="Back to cart" onBack={vi.fn()}>content</MinimalLayout>);
    expect(screen.getByTestId('mock-back-btn').getAttribute('aria-label')).toBe('Back to cart');
  });

  it('forwards onBack — clicking mock back btn calls it', () => {
    const onBack = vi.fn();
    render(<MinimalLayout onBack={onBack}>content</MinimalLayout>);
    fireEvent.click(screen.getByTestId('mock-back-btn'));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
