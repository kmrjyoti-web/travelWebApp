import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import { apiClient } from '@/lib/api/client';

// ─── Mock apiClient ───────────────────────────────────────────────────────────

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockPost = vi.mocked(apiClient.post);

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
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
  expiresAt: Date.now() + 3600_000,
};

const MOCK_AUTH_RESPONSE = {
  user: MOCK_USER,
  tokens: MOCK_TOKENS,
};

// ─── login() ─────────────────────────────────────────────────────────────────

describe('authService.login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/login with identifier + password', async () => {
    mockPost.mockResolvedValue(MOCK_AUTH_RESPONSE);
    const result = await authService.login({
      identifier: 'alice@example.com',
      password: 'Passw0rd!',
    });
    expect(mockPost).toHaveBeenCalledWith('/auth/login', {
      identifier: 'alice@example.com',
      password: 'Passw0rd!',
    });
    expect(result).toEqual(MOCK_AUTH_RESPONSE);
  });

  it('includes rememberMe in payload when provided', async () => {
    mockPost.mockResolvedValue(MOCK_AUTH_RESPONSE);
    await authService.login({
      identifier: 'alice@example.com',
      password: 'Passw0rd!',
      rememberMe: true,
    });
    expect(mockPost).toHaveBeenCalledWith('/auth/login', {
      identifier: 'alice@example.com',
      password: 'Passw0rd!',
      rememberMe: true,
    });
  });

  it('propagates API errors', async () => {
    mockPost.mockRejectedValue(new Error('Invalid credentials'));
    await expect(
      authService.login({ identifier: 'bad@example.com', password: 'wrong' }),
    ).rejects.toThrow('Invalid credentials');
  });
});

// ─── loginWithOTP() ───────────────────────────────────────────────────────────

describe('authService.loginWithOTP', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/login/otp with identifier + otp', async () => {
    mockPost.mockResolvedValue(MOCK_AUTH_RESPONSE);
    await authService.loginWithOTP({ identifier: '+447911123456', otp: '123456' });
    expect(mockPost).toHaveBeenCalledWith('/auth/login/otp', {
      identifier: '+447911123456',
      otp: '123456',
    });
  });

  it('returns AuthResponse on success', async () => {
    mockPost.mockResolvedValue(MOCK_AUTH_RESPONSE);
    const result = await authService.loginWithOTP({
      identifier: 'alice@example.com',
      otp: '654321',
    });
    expect(result.user.id).toBe('user-1');
    expect(result.tokens.accessToken).toBe('access-token-abc');
  });

  it('propagates API errors', async () => {
    mockPost.mockRejectedValue(new Error('OTP expired'));
    await expect(
      authService.loginWithOTP({ identifier: 'x@x.com', otp: '000000' }),
    ).rejects.toThrow('OTP expired');
  });
});

// ─── loginWithGoogle() ────────────────────────────────────────────────────────

describe('authService.loginWithGoogle', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/login/social with provider=google', async () => {
    mockPost.mockResolvedValue(MOCK_AUTH_RESPONSE);
    await authService.loginWithGoogle('google-id-token');
    expect(mockPost).toHaveBeenCalledWith('/auth/login/social', {
      idToken: 'google-id-token',
      provider: 'google',
    });
  });

  it('returns AuthResponse on success', async () => {
    mockPost.mockResolvedValue(MOCK_AUTH_RESPONSE);
    const result = await authService.loginWithGoogle('google-id-token');
    expect(result).toEqual(MOCK_AUTH_RESPONSE);
  });
});

// ─── loginWithApple() ─────────────────────────────────────────────────────────

describe('authService.loginWithApple', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/login/social with provider=apple', async () => {
    mockPost.mockResolvedValue(MOCK_AUTH_RESPONSE);
    await authService.loginWithApple('apple-id-token');
    expect(mockPost).toHaveBeenCalledWith('/auth/login/social', {
      idToken: 'apple-id-token',
      provider: 'apple',
    });
  });
});

// ─── logout() ────────────────────────────────────────────────────────────────

describe('authService.logout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/logout', async () => {
    mockPost.mockResolvedValue(undefined);
    await authService.logout();
    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
  });

  it('resolves with void on success', async () => {
    mockPost.mockResolvedValue(undefined);
    const result = await authService.logout();
    expect(result).toBeUndefined();
  });

  it('propagates errors gracefully', async () => {
    mockPost.mockRejectedValue(new Error('Session not found'));
    await expect(authService.logout()).rejects.toThrow('Session not found');
  });
});

// ─── refreshToken() ──────────────────────────────────────────────────────────

describe('authService.refreshToken', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/refresh with the refresh token', async () => {
    mockPost.mockResolvedValue(MOCK_TOKENS);
    await authService.refreshToken('refresh-token-xyz');
    expect(mockPost).toHaveBeenCalledWith('/auth/refresh', {
      refreshToken: 'refresh-token-xyz',
    });
  });

  it('returns new AuthTokens on success', async () => {
    const newTokens = { ...MOCK_TOKENS, accessToken: 'new-access' };
    mockPost.mockResolvedValue(newTokens);
    const result = await authService.refreshToken('refresh-token-xyz');
    expect(result.accessToken).toBe('new-access');
  });

  it('propagates token-expired errors', async () => {
    mockPost.mockRejectedValue(new Error('Refresh token expired'));
    await expect(
      authService.refreshToken('expired-refresh'),
    ).rejects.toThrow('Refresh token expired');
  });
});

// ─── forgotPassword() ────────────────────────────────────────────────────────

describe('authService.forgotPassword', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/forgot-password with identifier', async () => {
    mockPost.mockResolvedValue(undefined);
    await authService.forgotPassword('alice@example.com');
    expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', {
      identifier: 'alice@example.com',
    });
  });

  it('resolves with void on success', async () => {
    mockPost.mockResolvedValue(undefined);
    const result = await authService.forgotPassword('alice@example.com');
    expect(result).toBeUndefined();
  });
});

// ─── requestOTP() ─────────────────────────────────────────────────────────────

describe('authService.requestOTP', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls POST /auth/otp/request with identifier', async () => {
    const otpResponse = { expiresIn: 300, maskedTarget: 'j***@example.com' };
    mockPost.mockResolvedValue(otpResponse);
    await authService.requestOTP('joe@example.com');
    expect(mockPost).toHaveBeenCalledWith('/auth/otp/request', {
      identifier: 'joe@example.com',
    });
  });

  it('returns OTPRequestResponse on success', async () => {
    const otpResponse = { expiresIn: 300, maskedTarget: '+44*****6789' };
    mockPost.mockResolvedValue(otpResponse);
    const result = await authService.requestOTP('+447911123456');
    expect(result.expiresIn).toBe(300);
    expect(result.maskedTarget).toBe('+44*****6789');
  });

  it('propagates rate-limit errors', async () => {
    mockPost.mockRejectedValue(new Error('Too many OTP requests'));
    await expect(
      authService.requestOTP('spam@example.com'),
    ).rejects.toThrow('Too many OTP requests');
  });
});
