import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('./AuthHeader', () => ({
  AuthHeader: () => (
    <header data-testid="mock-auth-header" role="banner">
      <a href="#auth-main">Skip to form</a>
    </header>
  ),
}));

vi.mock('./AuthFooter', () => ({
  AuthFooter: () => (
    <footer data-testid="mock-auth-footer" role="contentinfo" />
  ),
}));

vi.mock('./theme', () => ({
  applyAuthTheme: vi.fn(),
}));

vi.mock('@/config/constants', () => ({
  APP_NAME: 'TravelOS',
  APP_VERSION: '1.0.0',
}));

import { AuthLayout } from './AuthLayout';
import { applyAuthTheme } from './theme';
import { AUTH_ESCAPE_EVENT } from './keyboard-shortcuts';

// ─── Structure ────────────────────────────────────────────────────────────────

describe('AuthLayout — structure', () => {
  it('renders the auth header', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    expect(screen.getByTestId('mock-auth-header')).toBeDefined();
  });

  it('renders the auth footer', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    expect(screen.getByTestId('mock-auth-footer')).toBeDefined();
  });

  it('renders children inside main', async () => {
    await act(async () => {
      render(<AuthLayout><p>Login form</p></AuthLayout>);
    });
    expect(screen.getByText('Login form')).toBeDefined();
  });

  it('main has id=auth-main for skip link', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    const main = document.getElementById('auth-main');
    expect(main?.tagName.toLowerCase()).toBe('main');
  });

  it('main has tabIndex=-1 for skip link focus', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    const main = screen.getByRole('main');
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('main has aria-label', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    const main = screen.getByRole('main', { name: /auth/i });
    expect(main).toBeDefined();
  });

  it('root div has data-layout=auth', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    const root = document.querySelector('[data-layout="auth"]');
    expect(root).toBeDefined();
  });
});

// ─── Illustration panel ───────────────────────────────────────────────────────

describe('AuthLayout — illustration panel', () => {
  it('renders the illustration panel', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    expect(screen.getByTestId('auth-illustration')).toBeDefined();
  });

  it('illustration is aria-hidden', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    const illus = screen.getByTestId('auth-illustration');
    expect(illus.getAttribute('aria-hidden')).toBe('true');
  });

  it('illustration contains headline text', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    expect(screen.getByText(/your world/i)).toBeDefined();
  });

  it('illustration feature list is present', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    expect(screen.getByText(/AI-powered trip building/)).toBeDefined();
    expect(screen.getByText(/Real-time availability/)).toBeDefined();
    expect(screen.getByText(/Multi-tenant management/)).toBeDefined();
    expect(screen.getByText(/Global DMC network/)).toBeDefined();
  });
});

// ─── Card ─────────────────────────────────────────────────────────────────────

describe('AuthLayout — auth card', () => {
  it('renders the auth card wrapper', async () => {
    await act(async () => {
      render(<AuthLayout><span data-testid="form-child">form</span></AuthLayout>);
    });
    const card = document.querySelector('.tos-auth-card');
    expect(card).toBeDefined();
    // Children are inside the card
    expect(card?.querySelector('[data-testid="form-child"]')).toBeDefined();
  });
});

// ─── Theme ────────────────────────────────────────────────────────────────────

describe('AuthLayout — theme', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls applyAuthTheme on mount', async () => {
    await act(async () => { render(<AuthLayout>content</AuthLayout>); });
    expect(applyAuthTheme).toHaveBeenCalledOnce();
  });
});

// ─── Keyboard: Esc → tos:auth-escape ─────────────────────────────────────────

describe('AuthLayout — Esc dispatches auth-escape event', () => {
  it('dispatches tos:auth-escape when Esc is pressed inside an input', async () => {
    await act(async () => {
      render(
        <AuthLayout>
          <input data-testid="test-input" />
        </AuthLayout>,
      );
    });

    const received: CustomEvent[] = [];
    document.addEventListener(AUTH_ESCAPE_EVENT, (e) => {
      received.push(e as CustomEvent);
    });

    const input = screen.getByTestId('test-input');
    input.focus();
    fireEvent.keyDown(input, { key: 'Escape', target: input });

    // Dispatch is on document keydown, not the element's keydown
    // Fire directly on document with the input as the event target
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    Object.defineProperty(escEvent, 'target', { value: input });
    document.dispatchEvent(escEvent);

    expect(received.length).toBeGreaterThan(0);
    expect(received[0].type).toBe(AUTH_ESCAPE_EVENT);
  });

  it('does NOT dispatch tos:auth-escape when Esc is pressed outside an input', async () => {
    await act(async () => {
      render(<AuthLayout><div data-testid="non-input">content</div></AuthLayout>);
    });

    const received: CustomEvent[] = [];
    document.addEventListener(AUTH_ESCAPE_EVENT, (e) => {
      received.push(e as CustomEvent);
    });

    const div = screen.getByTestId('non-input');
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    Object.defineProperty(escEvent, 'target', { value: div });
    document.dispatchEvent(escEvent);

    expect(received.length).toBe(0);
  });

  it('cleans up the Esc event listener on unmount', async () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    let unmount: () => void;
    await act(async () => {
      const result = render(<AuthLayout>content</AuthLayout>);
      unmount = result.unmount;
    });
    act(() => unmount());
    // Should have removed at least one keydown listener
    expect(
      removeSpy.mock.calls.some((c) => c[0] === 'keydown'),
    ).toBe(true);
  });
});

// ─── keyboard-shortcuts module ────────────────────────────────────────────────

describe('AUTH_KEYBOARD_SHORTCUTS', () => {
  it('exports non-empty shortcuts array', async () => {
    const { AUTH_KEYBOARD_SHORTCUTS } = await import('./keyboard-shortcuts');
    expect(AUTH_KEYBOARD_SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('includes Enter shortcut', async () => {
    const { AUTH_KEYBOARD_SHORTCUTS } = await import('./keyboard-shortcuts');
    const enterShortcut = AUTH_KEYBOARD_SHORTCUTS.find((s) => s.key === 'Enter');
    expect(enterShortcut).toBeDefined();
    expect(enterShortcut?.scope).toBe('auth');
  });

  it('includes Escape shortcut with authClear actionId', async () => {
    const { AUTH_KEYBOARD_SHORTCUTS } = await import('./keyboard-shortcuts');
    const esc = AUTH_KEYBOARD_SHORTCUTS.find((s) => s.key === 'Escape');
    expect(esc).toBeDefined();
    expect(esc?.actionId).toBe('authClear');
  });

  it('includes Tab shortcut', async () => {
    const { AUTH_KEYBOARD_SHORTCUTS } = await import('./keyboard-shortcuts');
    const tab = AUTH_KEYBOARD_SHORTCUTS.find((s) => s.key === 'Tab' && s.modifiers.length === 0);
    expect(tab).toBeDefined();
  });

  it('includes Shift+Tab shortcut', async () => {
    const { AUTH_KEYBOARD_SHORTCUTS } = await import('./keyboard-shortcuts');
    const shiftTab = AUTH_KEYBOARD_SHORTCUTS.find(
      (s) => s.key === 'Tab' && s.modifiers.includes('shift'),
    );
    expect(shiftTab).toBeDefined();
  });
});

describe('formatAuthShortcut', () => {
  it('formats Enter with no modifiers', async () => {
    const { formatAuthShortcut } = await import('./keyboard-shortcuts');
    expect(formatAuthShortcut({ key: 'Enter', modifiers: [] })).toBe('Enter');
  });

  it('formats Shift+Tab', async () => {
    const { formatAuthShortcut } = await import('./keyboard-shortcuts');
    expect(formatAuthShortcut({ key: 'Tab', modifiers: ['shift'] })).toBe('⇧Tab');
  });

  it('uppercases single-character keys', async () => {
    const { formatAuthShortcut } = await import('./keyboard-shortcuts');
    expect(formatAuthShortcut({ key: 'k', modifiers: ['ctrl'] })).toBe('⌃K');
  });
});

// ─── theme module ─────────────────────────────────────────────────────────────

describe('applyAuthTheme', () => {
  it('sets --tos-auth-bg on :root', async () => {
    const { applyAuthTheme: realApply } = await import('./theme');
    realApply();
    expect(
      document.documentElement.style.getPropertyValue('--tos-auth-bg'),
    ).toBeTruthy();
  });

  it('sets --tos-auth-card-radius on :root', async () => {
    const { applyAuthTheme: realApply } = await import('./theme');
    realApply();
    expect(
      document.documentElement.style.getPropertyValue('--tos-auth-card-radius'),
    ).toBeTruthy();
  });

  it('auth font-size-base is 1rem (larger than default)', async () => {
    const { applyAuthTheme: realApply, AUTH_THEME_VALUES } = await import('./theme');
    realApply();
    expect(AUTH_THEME_VALUES['--tos-auth-font-size-base']).toBe('1rem');
  });

  it('AUTH_THEME_VALUES covers all AUTH_THEME_VARS keys', async () => {
    const { AUTH_THEME_VARS, AUTH_THEME_VALUES } = await import('./theme');
    for (const varName of Object.values(AUTH_THEME_VARS)) {
      expect(AUTH_THEME_VALUES).toHaveProperty(varName);
    }
  });
});
