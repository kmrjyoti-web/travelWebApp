import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '../services/authService';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    loginWithOTP: vi.fn(),
    loginWithGoogle: vi.fn(),
    loginWithApple: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
    requestOTP: vi.fn(),
    forgotPassword: vi.fn(),
  },
}));

// localStorage mock
const storageMock: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((k: string) => storageMock[k] ?? null),
  setItem: vi.fn((k: string, v: string) => { storageMock[k] = v; }),
  removeItem: vi.fn((k: string) => { delete storageMock[k]; }),
  clear: vi.fn(() => Object.keys(storageMock).forEach(k => delete storageMock[k])),
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 'user-1',
  email: 'alice@example.com',
  name: 'Alice',
  role: 'admin' as const,
  tenantId: 'tenant-1',
  productId: 'travel-os',
  emailVerified: true,
  phoneVerified: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const MOCK_TOKENS = {
  accessToken: 'access-abc',
  refreshToken: 'refresh-xyz',
  expiresAt: Date.now() + 3600_000,
};

const MOCK_AUTH_RESPONSE = { user: MOCK_USER, tokens: MOCK_TOKENS };

const mockLogin = vi.mocked(authService.login);
const mockLoginOTP = vi.mocked(authService.loginWithOTP);
const mockLoginGoogle = vi.mocked(authService.loginWithGoogle);
const mockLoginApple = vi.mocked(authService.loginWithApple);
const mockLogout = vi.mocked(authService.logout);
const mockRefresh = vi.mocked(authService.refreshToken);
const mockRequestOTP = vi.mocked(authService.requestOTP);
const mockForgotPassword = vi.mocked(authService.forgotPassword);

function resetStore() {
  useAuthStore.setState({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    loginAttempts: 0,
    lockedUntil: null,
  });
  vi.clearAllMocks();
}

// ─── Initial state ────────────────────────────────────────────────────────────

describe('useAuth — initial state', () => {
  beforeEach(resetStore);

  it('returns not authenticated by default', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('returns isLoading=false by default', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(false);
  });

  it('returns no error by default', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.error).toBeNull();
  });

  it('exposes login, logout, loginWithOTP functions', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.loginWithOTP).toBe('function');
  });
});

// ─── login() ─────────────────────────────────────────────────────────────────

describe('useAuth.login', () => {
  beforeEach(resetStore);

  it('sets isLoading during request', async () => {
    let resolveLogin!: (v: typeof MOCK_AUTH_RESPONSE) => void;
    mockLogin.mockReturnValue(new Promise((res) => { resolveLogin = res; }));

    const { result } = renderHook(() => useAuth());
    act(() => { void result.current.login({ identifier: 'a@a.com', password: 'P@ss0rd!' }); });
    expect(result.current.isLoading).toBe(true);

    await act(async () => { resolveLogin(MOCK_AUTH_RESPONSE); });
    expect(result.current.isLoading).toBe(false);
  });

  it('sets user and tokens on success', async () => {
    mockLogin.mockResolvedValue(MOCK_AUTH_RESPONSE);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ identifier: 'alice@example.com', password: 'P@ss0rd!' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(MOCK_USER);
  });

  it('sets error and increments attempts on failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ identifier: 'x@x.com', password: 'wrong' });
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loginAttempts).toBe(1);
    expect(result.current.error).toContain('Invalid credentials');
  });

  it('resets login attempts on successful login', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Bad creds'));
    mockLogin.mockResolvedValueOnce(MOCK_AUTH_RESPONSE);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ identifier: 'a@a.com', password: 'bad' });
    });
    expect(result.current.loginAttempts).toBe(1);

    await act(async () => {
      await result.current.login({ identifier: 'a@a.com', password: 'P@ss0rd!' });
    });
    expect(result.current.loginAttempts).toBe(0);
  });

  it('blocks login when account is locked', async () => {
    // Force lockout
    useAuthStore.setState({ lockedUntil: Date.now() + 30_000, loginAttempts: 5 });
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ identifier: 'a@a.com', password: 'P@ss0rd!' });
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.error).toContain('Too many failed attempts');
  });

  it('clears error before each attempt', async () => {
    mockLogin.mockRejectedValueOnce(new Error('fail 1'));
    mockLogin.mockResolvedValueOnce(MOCK_AUTH_RESPONSE);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ identifier: 'a@a.com', password: 'bad' });
    });
    expect(result.current.error).not.toBeNull();

    await act(async () => {
      await result.current.login({ identifier: 'a@a.com', password: 'P@ss0rd!' });
    });
    expect(result.current.error).toBeNull();
  });
});

// ─── loginWithOTP() ───────────────────────────────────────────────────────────

describe('useAuth.loginWithOTP', () => {
  beforeEach(resetStore);

  it('sets authenticated on success', async () => {
    mockLoginOTP.mockResolvedValue(MOCK_AUTH_RESPONSE);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginWithOTP({ identifier: 'a@a.com', otp: '123456' });
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('sets error on failure', async () => {
    mockLoginOTP.mockRejectedValue(new Error('OTP expired'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginWithOTP({ identifier: 'a@a.com', otp: '000000' });
    });

    expect(result.current.error).toContain('OTP expired');
  });
});

// ─── loginWithGoogle() ────────────────────────────────────────────────────────

describe('useAuth.loginWithGoogle', () => {
  beforeEach(resetStore);

  it('authenticates on success', async () => {
    mockLoginGoogle.mockResolvedValue(MOCK_AUTH_RESPONSE);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginWithGoogle('google-token');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockLoginGoogle).toHaveBeenCalledWith('google-token');
  });

  it('sets error on failure', async () => {
    mockLoginGoogle.mockRejectedValue(new Error('Google auth failed'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginWithGoogle('bad-token');
    });

    expect(result.current.error).toContain('Google auth failed');
  });
});

// ─── loginWithApple() ─────────────────────────────────────────────────────────

describe('useAuth.loginWithApple', () => {
  beforeEach(resetStore);

  it('authenticates on success', async () => {
    mockLoginApple.mockResolvedValue(MOCK_AUTH_RESPONSE);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginWithApple('apple-token');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});

// ─── logout() ────────────────────────────────────────────────────────────────

describe('useAuth.logout', () => {
  beforeEach(resetStore);

  it('clears user and tokens', async () => {
    useAuthStore.setState({ user: MOCK_USER, tokens: MOCK_TOKENS, isAuthenticated: true });
    mockLogout.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('clears state even when server logout fails', async () => {
    useAuthStore.setState({ user: MOCK_USER, tokens: MOCK_TOKENS, isAuthenticated: true });
    mockLogout.mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});

// ─── requestOTP() ─────────────────────────────────────────────────────────────

describe('useAuth.requestOTP', () => {
  beforeEach(resetStore);

  it('delegates to authService.requestOTP', async () => {
    const otpResponse = { expiresIn: 300, maskedTarget: 'j***@example.com' };
    mockRequestOTP.mockResolvedValue(otpResponse);
    const { result } = renderHook(() => useAuth());

    let res: typeof otpResponse | undefined;
    await act(async () => {
      res = await result.current.requestOTP('joe@example.com');
    });

    expect(mockRequestOTP).toHaveBeenCalledWith('joe@example.com');
    expect(res).toEqual(otpResponse);
  });
});

// ─── forgotPassword() ────────────────────────────────────────────────────────

describe('useAuth.forgotPassword', () => {
  beforeEach(resetStore);

  it('calls authService.forgotPassword', async () => {
    mockForgotPassword.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.forgotPassword('alice@example.com');
    });

    expect(mockForgotPassword).toHaveBeenCalledWith('alice@example.com');
  });

  it('sets error on failure', async () => {
    mockForgotPassword.mockRejectedValue(new Error('User not found'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.forgotPassword('nobody@example.com');
    });

    expect(result.current.error).toContain('User not found');
  });
});

// ─── token auto-refresh ───────────────────────────────────────────────────────

describe('useAuth — token auto-refresh', () => {
  beforeEach(() => {
    resetStore();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('refreshes token before expiry', async () => {
    const newTokens = { ...MOCK_TOKENS, accessToken: 'new-access', expiresAt: Date.now() + 7200_000 };
    mockRefresh.mockResolvedValue(newTokens);

    // Set tokens expiring in 10 minutes (10 * 60 * 1000)
    const expiresAt = Date.now() + 10 * 60 * 1000;
    useAuthStore.setState({ tokens: { ...MOCK_TOKENS, expiresAt }, isAuthenticated: true });

    renderHook(() => useAuth());

    // Advance past REFRESH_BUFFER_MS (2 min) from expiry = 8 min from now
    await act(async () => {
      vi.advanceTimersByTime(8 * 60 * 1000 + 100);
    });

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledWith(MOCK_TOKENS.refreshToken);
    });
  });

  it('clears session when refresh fails', async () => {
    mockRefresh.mockRejectedValue(new Error('Refresh token expired'));

    const expiresAt = Date.now() + 3 * 60 * 1000;
    useAuthStore.setState({
      user: MOCK_USER,
      tokens: { ...MOCK_TOKENS, expiresAt },
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      vi.advanceTimersByTime(2 * 60 * 1000);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
