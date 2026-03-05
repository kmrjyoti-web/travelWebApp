import React from 'react';
import { describe, it, expect, vi, beforeEach, act } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

// ─── Mock useAuth ─────────────────────────────────────────────────────────────

vi.mock('@/features/auth/hooks/useAuth');

const mockLogin = vi.fn();
const mockLoginOTP = vi.fn();
const mockLoginGoogle = vi.fn();
const mockLoginApple = vi.fn();
const mockRequestOTP = vi.fn();

function makeAuthReturn(overrides: Partial<ReturnType<typeof useAuth>> = {}): ReturnType<typeof useAuth> {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isLocked: false,
    secondsUntilUnlock: 0,
    loginAttempts: 0,
    lockedUntil: null,
    login: mockLogin,
    loginWithOTP: mockLoginOTP,
    loginWithGoogle: mockLoginGoogle,
    loginWithApple: mockLoginApple,
    requestOTP: mockRequestOTP,
    logout: vi.fn(),
    forgotPassword: vi.fn(),
    ...overrides,
  };
}

function resetMocks(overrides: Partial<ReturnType<typeof useAuth>> = {}) {
  vi.mocked(useAuth).mockReturnValue(makeAuthReturn(overrides));
  mockLogin.mockReset();
  mockLoginOTP.mockReset();
  mockLoginGoogle.mockReset();
  mockLoginApple.mockReset();
  mockRequestOTP.mockReset();
}

// ─── Structure ────────────────────────────────────────────────────────────────

describe('LoginForm — structure', () => {
  beforeEach(() => resetMocks());

  it('renders the form wrapper', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('renders heading "Sign in to TravelOS"', () => {
    render(<LoginForm />);
    expect(screen.getByRole('heading', { name: /sign in to travelOS/i })).toBeInTheDocument();
  });

  it('renders identifier field', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('input-identifier')).toBeInTheDocument();
  });

  it('renders password field', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
  });

  it('renders remember-me checkbox', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('checkbox-remember-me')).toBeInTheDocument();
  });

  it('renders forgot-password link', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('link-forgot-password')).toBeInTheDocument();
  });

  it('renders Google sign-in button', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('btn-google')).toBeInTheDocument();
  });

  it('renders Apple sign-in button', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('btn-apple')).toBeInTheDocument();
  });

  it('renders switch-to-OTP button in password mode', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('btn-switch-to-otp')).toBeInTheDocument();
  });

  it('applies custom data-testid', () => {
    render(<LoginForm data-testid="custom-form" />);
    expect(screen.getByTestId('custom-form')).toBeInTheDocument();
  });

  it('pre-fills identifier from defaultIdentifier prop', () => {
    render(<LoginForm defaultIdentifier="alice@example.com" />);
    expect(screen.getByTestId('input-identifier')).toHaveValue('alice@example.com');
  });

  it('starts in OTP mode when defaultMode="otp"', () => {
    render(<LoginForm defaultMode="otp" />);
    expect(screen.getByTestId('otp-identifier-form')).toBeInTheDocument();
  });

  it('starts in password mode by default', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('password-form')).toBeInTheDocument();
  });
});

// ─── Password toggle ──────────────────────────────────────────────────────────

describe('LoginForm — password toggle', () => {
  beforeEach(() => resetMocks());

  it('password field starts as type=password', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('input-password')).toHaveAttribute('type', 'password');
  });

  it('clicking toggle shows password (type=text)', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-toggle-password'));
    expect(screen.getByTestId('input-password')).toHaveAttribute('type', 'text');
  });

  it('toggle button label is "Show password" when hidden', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('btn-toggle-password')).toHaveAttribute(
      'aria-label', 'Show password',
    );
  });

  it('toggle button label becomes "Hide password" when visible', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-toggle-password'));
    expect(screen.getByTestId('btn-toggle-password')).toHaveAttribute(
      'aria-label', 'Hide password',
    );
  });

  it('toggle button aria-pressed reflects visibility', () => {
    render(<LoginForm />);
    const btn = screen.getByTestId('btn-toggle-password');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicking toggle twice hides password again', () => {
    render(<LoginForm />);
    const btn = screen.getByTestId('btn-toggle-password');
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.getByTestId('input-password')).toHaveAttribute('type', 'password');
  });
});

// ─── Validation — password mode ───────────────────────────────────────────────

describe('LoginForm — validation (password mode)', () => {
  beforeEach(() => resetMocks());

  it('shows identifier required error when submitted empty', async () => {
    render(<LoginForm />);
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() => expect(screen.getByTestId('err-identifier')).toBeInTheDocument());
    expect(screen.getByTestId('err-identifier')).toHaveTextContent(/required/i);
  });

  it('shows error for invalid email format', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), 'notanemail');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() => expect(screen.getByTestId('err-identifier')).toBeInTheDocument());
  });

  it('rejects phone without country code', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), '07911123456');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() => expect(screen.getByTestId('err-identifier')).toBeInTheDocument());
  });

  it('accepts valid E.164 phone', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), '+447911123456');
    await userEvent.type(screen.getByTestId('input-password'), 'P@ssw0rd!');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() => expect(screen.queryByTestId('err-identifier')).not.toBeInTheDocument());
  });

  it('shows error for password too short (<8 chars)', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), 'a@a.com');
    await userEvent.type(screen.getByTestId('input-password'), 'Ab1!');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() =>
      expect(screen.getByTestId('err-password')).toHaveTextContent(/8 characters/i),
    );
  });

  it('shows error when password missing uppercase', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), 'a@a.com');
    await userEvent.type(screen.getByTestId('input-password'), 'nouppercase1!');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() =>
      expect(screen.getByTestId('err-password')).toHaveTextContent(/uppercase/i),
    );
  });

  it('shows error when password missing number', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), 'a@a.com');
    await userEvent.type(screen.getByTestId('input-password'), 'NoNumber!x');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() =>
      expect(screen.getByTestId('err-password')).toHaveTextContent(/number/i),
    );
  });

  it('shows error when password missing special character', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), 'a@a.com');
    await userEvent.type(screen.getByTestId('input-password'), 'NoSpecial1A');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() =>
      expect(screen.getByTestId('err-password')).toHaveTextContent(/special/i),
    );
  });

  it('identifier input has aria-invalid=true when field has error', async () => {
    render(<LoginForm />);
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() =>
      expect(screen.getByTestId('input-identifier')).toHaveAttribute('aria-invalid', 'true'),
    );
  });
});

// ─── Submit behaviour ─────────────────────────────────────────────────────────

describe('LoginForm — submit', () => {
  beforeEach(() => resetMocks());

  it('calls login() with correct data', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), 'alice@example.com');
    await userEvent.type(screen.getByTestId('input-password'), 'P@ssw0rd!');
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        identifier: 'alice@example.com',
        password: 'P@ssw0rd!',
        rememberMe: false,
      }),
    );
  });

  it('passes rememberMe=true when checkbox checked', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('input-identifier'), 'alice@example.com');
    await userEvent.type(screen.getByTestId('input-password'), 'P@ssw0rd!');
    fireEvent.click(screen.getByTestId('checkbox-remember-me'));
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith(expect.objectContaining({ rememberMe: true })),
    );
  });

  it('shows spinner while isLoading=true', () => {
    resetMocks({ isLoading: true });
    render(<LoginForm />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('disables submit button while loading', () => {
    resetMocks({ isLoading: true });
    render(<LoginForm />);
    expect(screen.getByTestId('btn-submit')).toBeDisabled();
  });

  it('disables submit button while locked', () => {
    resetMocks({ isLocked: true, secondsUntilUnlock: 20 });
    render(<LoginForm />);
    expect(screen.getByTestId('btn-submit')).toBeDisabled();
  });

  it('submit button has aria-busy=true while loading', () => {
    resetMocks({ isLoading: true });
    render(<LoginForm />);
    expect(screen.getByTestId('btn-submit')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call login() on invalid form', async () => {
    render(<LoginForm />);
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() => screen.getByTestId('err-identifier'));
    expect(mockLogin).not.toHaveBeenCalled();
  });
});

// ─── Error banner ─────────────────────────────────────────────────────────────

describe('LoginForm — error banner', () => {
  beforeEach(() => resetMocks());

  it('shows error from useAuth', () => {
    resetMocks({ error: 'Invalid credentials' });
    render(<LoginForm />);
    expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
  });

  it('shows rate-limit message with countdown when isLocked', () => {
    resetMocks({ isLocked: true, secondsUntilUnlock: 28 });
    render(<LoginForm />);
    expect(screen.getByTestId('login-error')).toHaveTextContent(/28s/);
  });

  it('error banner has role=alert', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('login-error')).toHaveAttribute('role', 'alert');
  });

  it('error banner has aria-live=assertive', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('login-error')).toHaveAttribute('aria-live', 'assertive');
  });
});

// ─── Social login ─────────────────────────────────────────────────────────────

describe('LoginForm — social login', () => {
  beforeEach(() => resetMocks());

  it('calls loginWithGoogle when Google button is clicked', async () => {
    mockLoginGoogle.mockResolvedValue(undefined);
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-google'));
    await waitFor(() => expect(mockLoginGoogle).toHaveBeenCalledTimes(1));
  });

  it('calls loginWithApple when Apple button is clicked', async () => {
    mockLoginApple.mockResolvedValue(undefined);
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-apple'));
    await waitFor(() => expect(mockLoginApple).toHaveBeenCalledTimes(1));
  });

  it('disables Google button while loading', () => {
    resetMocks({ isLoading: true });
    render(<LoginForm />);
    expect(screen.getByTestId('btn-google')).toBeDisabled();
  });

  it('disables Apple button while loading', () => {
    resetMocks({ isLoading: true });
    render(<LoginForm />);
    expect(screen.getByTestId('btn-apple')).toBeDisabled();
  });

  it('Google button has aria-label "Sign in with Google"', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('btn-google')).toHaveAttribute('aria-label', 'Sign in with Google');
  });

  it('Apple button has aria-label "Sign in with Apple"', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('btn-apple')).toHaveAttribute('aria-label', 'Sign in with Apple');
  });
});

// ─── OTP mode ─────────────────────────────────────────────────────────────────

describe('LoginForm — OTP mode', () => {
  beforeEach(() => resetMocks());

  it('clicking "Sign in with a code" shows OTP identifier form', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    expect(screen.getByTestId('otp-identifier-form')).toBeInTheDocument();
  });

  it('shows switch-to-password button in OTP mode', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    expect(screen.getByTestId('btn-switch-to-password')).toBeInTheDocument();
  });

  it('advances to code step after OTP request succeeds', async () => {
    mockRequestOTP.mockResolvedValue({ expiresIn: 300, maskedTarget: 'a***@ex.com' });
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    await userEvent.type(screen.getByTestId('input-identifier'), 'alice@example.com');
    fireEvent.submit(screen.getByTestId('otp-identifier-form'));
    await waitFor(() => expect(screen.getByTestId('otp-code-form')).toBeInTheDocument());
  });

  it('shows masked target in hint text', async () => {
    mockRequestOTP.mockResolvedValue({ expiresIn: 300, maskedTarget: 'a***@ex.com' });
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    await userEvent.type(screen.getByTestId('input-identifier'), 'alice@example.com');
    fireEvent.submit(screen.getByTestId('otp-identifier-form'));
    await waitFor(() =>
      expect(screen.getByTestId('otp-hint')).toHaveTextContent('a***@ex.com'),
    );
  });

  it('calls loginWithOTP on code form submission', async () => {
    mockRequestOTP.mockResolvedValue({ expiresIn: 300, maskedTarget: 'a***@ex.com' });
    mockLoginOTP.mockResolvedValue(undefined);
    render(<LoginForm />);

    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    await userEvent.type(screen.getByTestId('input-identifier'), 'alice@example.com');
    fireEvent.submit(screen.getByTestId('otp-identifier-form'));
    await waitFor(() => screen.getByTestId('otp-code-form'));

    await userEvent.type(screen.getByTestId('input-otp'), '123456');
    fireEvent.submit(screen.getByTestId('otp-code-form'));

    await waitFor(() =>
      expect(mockLoginOTP).toHaveBeenCalledWith({
        identifier: 'alice@example.com',
        otp: '123456',
      }),
    );
  });

  it('shows OTP field error for wrong length', async () => {
    mockRequestOTP.mockResolvedValue({ expiresIn: 300, maskedTarget: 'a***@ex.com' });
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    await userEvent.type(screen.getByTestId('input-identifier'), 'alice@example.com');
    fireEvent.submit(screen.getByTestId('otp-identifier-form'));
    await waitFor(() => screen.getByTestId('otp-code-form'));

    await userEvent.type(screen.getByTestId('input-otp'), '123'); // too short
    fireEvent.submit(screen.getByTestId('otp-code-form'));
    await waitFor(() => expect(screen.getByTestId('err-otp')).toBeInTheDocument());
  });

  it('"Resend code" button returns to identifier step', async () => {
    mockRequestOTP.mockResolvedValue({ expiresIn: 300, maskedTarget: 'a***@ex.com' });
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    await userEvent.type(screen.getByTestId('input-identifier'), 'alice@example.com');
    fireEvent.submit(screen.getByTestId('otp-identifier-form'));
    await waitFor(() => screen.getByTestId('otp-code-form'));

    fireEvent.click(screen.getByTestId('btn-resend-otp'));
    await waitFor(() =>
      expect(screen.getByTestId('otp-identifier-form')).toBeInTheDocument(),
    );
  });

  it('switching back to password shows password form', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-switch-to-otp'));
    fireEvent.click(screen.getByTestId('btn-switch-to-password'));
    expect(screen.getByTestId('password-form')).toBeInTheDocument();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('LoginForm — accessibility', () => {
  beforeEach(() => resetMocks());

  it('identifier input has aria-required=true', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('input-identifier')).toHaveAttribute('aria-required', 'true');
  });

  it('password input has aria-required=true', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('input-password')).toHaveAttribute('aria-required', 'true');
  });

  it('error element has aria-atomic=true', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('login-error')).toHaveAttribute('aria-atomic', 'true');
  });

  it('field error is linked via aria-describedby after submission error', async () => {
    render(<LoginForm />);
    fireEvent.submit(screen.getByTestId('password-form'));
    await waitFor(() => screen.getByTestId('err-identifier'));
    const errId = screen.getByTestId('err-identifier').id;
    expect(screen.getByTestId('input-identifier')).toHaveAttribute(
      'aria-describedby', errId,
    );
  });
});

// ─── Keyboard ─────────────────────────────────────────────────────────────────

describe('LoginForm — keyboard', () => {
  beforeEach(() => resetMocks());

  it('tos:auth-escape event clears the password field', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByTestId('input-password');
    await userEvent.type(passwordInput, 'P@ssw0rd!');
    expect(passwordInput).toHaveValue('P@ssw0rd!');

    await act(async () => {
      document.dispatchEvent(new CustomEvent('tos:auth-escape'));
    });

    await waitFor(() => expect(passwordInput).toHaveValue(''));
  });

  it('tos:auth-escape hides password if it was shown', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByTestId('btn-toggle-password'));
    expect(screen.getByTestId('input-password')).toHaveAttribute('type', 'text');

    await act(async () => {
      document.dispatchEvent(new CustomEvent('tos:auth-escape'));
    });

    await waitFor(() =>
      expect(screen.getByTestId('input-password')).toHaveAttribute('type', 'password'),
    );
  });
});
