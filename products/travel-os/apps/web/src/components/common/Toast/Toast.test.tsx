import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { Toast, ToastProvider, useToast } from './Toast';
import type { ToastItemData } from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeToast(overrides: Partial<ToastItemData> = {}): ToastItemData {
  return { id: 'test-1', title: 'Test Toast', intent: 'default', ...overrides };
}

function Trigger({ fn }: { fn: () => void }) {
  return (
    <button type="button" onClick={fn} data-testid="trigger">
      fire
    </button>
  );
}

function HookTester() {
  const { show, dismiss, dismissAll, toasts } = useToast();
  return (
    <div>
      <button onClick={() => show({ title: 'Hello', intent: 'success' })} data-testid="show">
        show
      </button>
      <button onClick={() => show({ title: 'Persistent', duration: 0 })} data-testid="show-persist">
        persist
      </button>
      <button onClick={() => dismiss('toast-1')} data-testid="dismiss-one">
        dismiss-one
      </button>
      <button onClick={() => dismissAll()} data-testid="dismiss-all">
        dismiss-all
      </button>
      <span data-testid="count">{toasts.length}</span>
    </div>
  );
}

// ─── Toast (single item) ──────────────────────────────────────────────────────

describe('Toast (single item)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders title', () => {
    render(
      <Toast
        toast={makeToast({ title: 'Saved!' })}
        onDismiss={vi.fn()}
      />,
    );
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('renders message when provided', () => {
    render(
      <Toast
        toast={makeToast({ message: 'Your changes were saved.' })}
        onDismiss={vi.fn()}
      />,
    );
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();
  });

  it('does not render message element when omitted', () => {
    render(<Toast toast={makeToast()} onDismiss={vi.fn()} />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('has role=alert and aria-live=assertive', () => {
    render(<Toast toast={makeToast()} onDismiss={vi.fn()} />);
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
    expect(el).toHaveAttribute('aria-atomic', 'true');
  });

  it('applies intent class', () => {
    render(<Toast toast={makeToast({ intent: 'success' })} onDismiss={vi.fn()} />);
    const el = screen.getByRole('alert');
    expect(el.className).toContain('tos-toast--success');
  });

  it('applies default intent class when intent is omitted', () => {
    render(<Toast toast={makeToast({ intent: undefined })} onDismiss={vi.fn()} />);
    const el = screen.getByRole('alert');
    expect(el.className).toContain('tos-toast--default');
  });

  it('renders dismiss button', () => {
    render(<Toast toast={makeToast()} onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<Toast toast={makeToast({ id: 'x' })} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledWith('x');
  });

  it('auto-dismisses after duration', () => {
    const onDismiss = vi.fn();
    render(<Toast toast={makeToast({ id: 'a', duration: 2000 })} onDismiss={onDismiss} />);
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2000));
    expect(onDismiss).toHaveBeenCalledWith('a');
  });

  it('auto-dismisses using DEFAULT_DURATION (4000) when duration is undefined', () => {
    const onDismiss = vi.fn();
    render(<Toast toast={makeToast({ duration: undefined })} onDismiss={onDismiss} />);
    act(() => vi.advanceTimersByTime(3999));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('does NOT auto-dismiss when duration is 0', () => {
    const onDismiss = vi.fn();
    render(<Toast toast={makeToast({ duration: 0 })} onDismiss={onDismiss} />);
    act(() => vi.advanceTimersByTime(60_000));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('clears timer on unmount', () => {
    const onDismiss = vi.fn();
    const { unmount } = render(
      <Toast toast={makeToast({ duration: 2000 })} onDismiss={onDismiss} />,
    );
    unmount();
    act(() => vi.advanceTimersByTime(2000));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('uses data-testid prop', () => {
    render(<Toast toast={makeToast()} onDismiss={vi.fn()} data-testid="my-toast" />);
    expect(screen.getByTestId('my-toast')).toBeInTheDocument();
  });

  it('derives testid from toast.id when data-testid is omitted', () => {
    render(<Toast toast={makeToast({ id: 'abc' })} onDismiss={vi.fn()} />);
    expect(screen.getByTestId('toast-abc')).toBeInTheDocument();
  });

  it('dismiss button testid uses toast.id', () => {
    render(<Toast toast={makeToast({ id: 'abc' })} onDismiss={vi.fn()} />);
    expect(screen.getByTestId('toast-abc-dismiss')).toBeInTheDocument();
  });
});

// ─── Toast action button ───────────────────────────────────────────────────────

describe('Toast action button', () => {
  it('renders action button when action prop is provided', () => {
    const action = { label: 'Undo', onClick: vi.fn() };
    render(<Toast toast={makeToast({ action })} onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });

  it('does not render action button when action is omitted', () => {
    render(<Toast toast={makeToast()} onDismiss={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(1); // only dismiss
  });

  it('calls action.onClick and onDismiss when action button clicked', () => {
    const onClick = vi.fn();
    const onDismiss = vi.fn();
    const action = { label: 'Undo', onClick };
    render(<Toast toast={makeToast({ id: 'q', action })} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith('q');
  });
});

// ─── ToastProvider / useToast ─────────────────────────────────────────────────

describe('ToastProvider + useToast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('provides show/dismiss/dismissAll to children via context', () => {
    render(
      <ToastProvider>
        <HookTester />
      </ToastProvider>,
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('show() adds a toast', () => {
    render(
      <ToastProvider>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('show() returns an id string', () => {
    let returnedId = '';
    function IdCapture() {
      const { show } = useToast();
      return (
        <button onClick={() => { returnedId = show({ title: 'x' }); }} data-testid="btn">go</button>
      );
    }
    render(
      <ToastProvider>
        <IdCapture />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('btn'));
    expect(returnedId).toMatch(/^toast-\d+$/);
  });

  it('dismiss() removes the matching toast', () => {
    render(
      <ToastProvider>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show'));
    fireEvent.click(screen.getByTestId('show'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    // dismiss the first one (id=toast-1)
    fireEvent.click(screen.getByTestId('dismiss-one'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('dismissAll() clears all toasts', () => {
    render(
      <ToastProvider>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show'));
    fireEvent.click(screen.getByTestId('show'));
    fireEvent.click(screen.getByTestId('show'));
    fireEvent.click(screen.getByTestId('dismiss-all'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('respects maxToasts limit (default 5)', () => {
    render(
      <ToastProvider maxToasts={2}>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show'));
    fireEvent.click(screen.getByTestId('show'));
    fireEvent.click(screen.getByTestId('show'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  it('maxToasts=0 means unlimited', () => {
    render(
      <ToastProvider maxToasts={0}>
        <HookTester />
      </ToastProvider>,
    );
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByTestId('show'));
    }
    expect(screen.getByTestId('count')).toHaveTextContent('10');
  });

  it('renders toasts in the portal container', () => {
    render(
      <ToastProvider>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show'));
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('toast-container has correct position class', () => {
    render(
      <ToastProvider position="bottom-left">
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show'));
    expect(screen.getByTestId('toast-container').className).toContain(
      'tos-toast-container--bottom-left',
    );
  });

  it('auto-dismisses toast after its duration', async () => {
    render(
      <ToastProvider>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show')); // success toast
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    act(() => vi.advanceTimersByTime(4000));
    await waitFor(() =>
      expect(screen.getByTestId('count')).toHaveTextContent('0'),
    );
  });

  it('persistent toast (duration=0) is not auto-dismissed', () => {
    render(
      <ToastProvider>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show-persist'));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('stacks multiple toasts', () => {
    render(
      <ToastProvider maxToasts={5}>
        <HookTester />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByTestId('show'));
    fireEvent.click(screen.getByTestId('show'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBe(2);
  });
});

// ─── useToast outside provider ────────────────────────────────────────────────

describe('useToast outside provider', () => {
  it('throws an error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bad() {
      useToast();
      return null;
    }
    expect(() => render(<Bad />)).toThrow('useToast must be used within a ToastProvider');
    consoleError.mockRestore();
  });
});
