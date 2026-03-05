import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, clearStorage, persistTokens } from './authStore';
import {
  LOCKOUT_DURATION_MS,
  MAX_LOGIN_ATTEMPTS,
  STORAGE_KEYS,
} from '@/features/auth/types';

// ─── localStorage mock ────────────────────────────────────────────────────────

const localStorageMock = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

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

// Reset Zustand state between tests
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
  localStorageMock.clear();
  vi.clearAllMocks();
}

// ─── Initial state ────────────────────────────────────────────────────────────

describe('authStore — initial state', () => {
  beforeEach(resetStore);

  it('starts with null user and not authenticated', () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('starts with no tokens', () => {
    expect(useAuthStore.getState().tokens).toBeNull();
  });

  it('starts with isLoading=false', () => {
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('starts with no error', () => {
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('starts with zero loginAttempts and no lockout', () => {
    const { loginAttempts, lockedUntil } = useAuthStore.getState();
    expect(loginAttempts).toBe(0);
    expect(lockedUntil).toBeNull();
  });
});

// ─── setUser ─────────────────────────────────────────────────────────────────

describe('authStore.setUser', () => {
  beforeEach(resetStore);

  it('sets user and marks isAuthenticated=true', () => {
    useAuthStore.getState().setUser(MOCK_USER);
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(MOCK_USER);
    expect(isAuthenticated).toBe(true);
  });

  it('persists user to localStorage', () => {
    useAuthStore.getState().setUser(MOCK_USER);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.USER,
      JSON.stringify(MOCK_USER),
    );
  });

  it('sets tenantId in localStorage', () => {
    useAuthStore.getState().setUser(MOCK_USER);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.TENANT_ID,
      MOCK_USER.tenantId,
    );
  });

  it('setting null clears user and sets isAuthenticated=false', () => {
    useAuthStore.getState().setUser(MOCK_USER);
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('removing user removes it from localStorage', () => {
    useAuthStore.getState().setUser(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
  });
});

// ─── setTokens ────────────────────────────────────────────────────────────────

describe('authStore.setTokens', () => {
  beforeEach(resetStore);

  it('stores tokens in state', () => {
    useAuthStore.getState().setTokens(MOCK_TOKENS);
    expect(useAuthStore.getState().tokens).toEqual(MOCK_TOKENS);
  });

  it('persists accessToken + refreshToken to localStorage', () => {
    useAuthStore.getState().setTokens(MOCK_TOKENS);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.ACCESS_TOKEN,
      MOCK_TOKENS.accessToken,
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.REFRESH_TOKEN,
      MOCK_TOKENS.refreshToken,
    );
  });

  it('setting null clears tokens from state', () => {
    useAuthStore.getState().setTokens(MOCK_TOKENS);
    useAuthStore.getState().setTokens(null);
    expect(useAuthStore.getState().tokens).toBeNull();
  });

  it('setting null removes tokens from localStorage', () => {
    useAuthStore.getState().setTokens(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
  });
});

// ─── setLoading / setError ────────────────────────────────────────────────────

describe('authStore.setLoading + setError', () => {
  beforeEach(resetStore);

  it('setLoading(true) sets isLoading', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('setLoading(false) clears isLoading', () => {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('setError sets the error string', () => {
    useAuthStore.getState().setError('Invalid credentials');
    expect(useAuthStore.getState().error).toBe('Invalid credentials');
  });

  it('setError(null) clears the error', () => {
    useAuthStore.getState().setError('some error');
    useAuthStore.getState().setError(null);
    expect(useAuthStore.getState().error).toBeNull();
  });
});

// ─── Rate limiting ────────────────────────────────────────────────────────────

describe('authStore rate limiting', () => {
  beforeEach(resetStore);

  it('incrementLoginAttempts increments counter', () => {
    useAuthStore.getState().incrementLoginAttempts();
    expect(useAuthStore.getState().loginAttempts).toBe(1);
  });

  it(`locks after ${MAX_LOGIN_ATTEMPTS} attempts`, () => {
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
      useAuthStore.getState().incrementLoginAttempts();
    }
    expect(useAuthStore.getState().lockedUntil).not.toBeNull();
    expect(useAuthStore.getState().lockedUntil).toBeGreaterThan(Date.now());
  });

  it(`lockedUntil is approx ${LOCKOUT_DURATION_MS}ms from now`, () => {
    const before = Date.now();
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
      useAuthStore.getState().incrementLoginAttempts();
    }
    const { lockedUntil } = useAuthStore.getState();
    expect(lockedUntil).toBeGreaterThanOrEqual(before + LOCKOUT_DURATION_MS - 50);
    expect(lockedUntil).toBeLessThanOrEqual(before + LOCKOUT_DURATION_MS + 50);
  });

  it('resetLoginAttempts clears counter and lockout', () => {
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
      useAuthStore.getState().incrementLoginAttempts();
    }
    useAuthStore.getState().resetLoginAttempts();
    expect(useAuthStore.getState().loginAttempts).toBe(0);
    expect(useAuthStore.getState().lockedUntil).toBeNull();
  });

  it('lockLogin sets lockedUntil to now + duration', () => {
    const before = Date.now();
    useAuthStore.getState().lockLogin(5000);
    const { lockedUntil } = useAuthStore.getState();
    expect(lockedUntil).toBeGreaterThanOrEqual(before + 4990);
    expect(lockedUntil).toBeLessThanOrEqual(before + 5010);
  });
});

// ─── hydrate ─────────────────────────────────────────────────────────────────

describe('authStore.hydrate', () => {
  beforeEach(resetStore);

  it('restores user + tokens from localStorage when both exist', () => {
    // Pre-fill localStorage
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEYS.USER) return JSON.stringify(MOCK_USER);
      if (key === STORAGE_KEYS.ACCESS_TOKEN) return MOCK_TOKENS.accessToken;
      if (key === STORAGE_KEYS.REFRESH_TOKEN) return MOCK_TOKENS.refreshToken;
      return null;
    });

    useAuthStore.getState().hydrate();

    const { user, tokens, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(MOCK_USER);
    expect(tokens?.accessToken).toBe(MOCK_TOKENS.accessToken);
    expect(isAuthenticated).toBe(true);
  });

  it('does not set authenticated when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);
    useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('does not authenticate when only user is stored (no tokens)', () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEYS.USER) return JSON.stringify(MOCK_USER);
      return null;
    });
    useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

// ─── clear ────────────────────────────────────────────────────────────────────

describe('authStore.clear', () => {
  beforeEach(resetStore);

  it('resets all state to initial values', () => {
    useAuthStore.getState().setUser(MOCK_USER);
    useAuthStore.getState().setTokens(MOCK_TOKENS);
    useAuthStore.getState().setError('some error');
    useAuthStore.getState().clear();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.tokens).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
    expect(state.loginAttempts).toBe(0);
  });

  it('removes all storage keys', () => {
    useAuthStore.getState().clear();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.TENANT_ID);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
  });
});

// ─── Helper functions ─────────────────────────────────────────────────────────

describe('persistTokens helper', () => {
  beforeEach(resetStore);

  it('writes accessToken and refreshToken to localStorage', () => {
    persistTokens(MOCK_TOKENS);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.ACCESS_TOKEN,
      MOCK_TOKENS.accessToken,
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.REFRESH_TOKEN,
      MOCK_TOKENS.refreshToken,
    );
  });
});

describe('clearStorage helper', () => {
  beforeEach(resetStore);

  it('removes all auth keys', () => {
    clearStorage();
    [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.TENANT_ID,
      STORAGE_KEYS.REMEMBER_ME,
      STORAGE_KEYS.USER,
    ].forEach((key) => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
    });
  });
});
