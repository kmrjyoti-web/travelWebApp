import type { AxiosInstance } from 'axios';
import { STORAGE_KEYS } from '@/features/auth/types';

// ─── Token refresh state ──────────────────────────────────────────────────────

/** Ensures only one refresh call is in-flight at a time across concurrent requests. */
let refreshPromise: Promise<string | null> | null = null;

/**
 * Attach request + response interceptors to the given Axios instance.
 * Called once from client.ts after the instance is created, avoiding the
 * circular-import TDZ crash that occurs when interceptors.ts imports apiClient.
 */
export function setupInterceptors(client: AxiosInstance): void {
  async function getNewAccessToken(): Promise<string | null> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
            : null;

        if (!refreshToken) return null;

        // POST /auth/refresh — custom header prevents recursive refresh on 401.
        const res = await client.post<
          never,
          { accessToken: string; refreshToken: string; expiresAt: number }
        >('/auth/refresh', { refreshToken }, {
          headers: { 'x-skip-auth-refresh': 'true' },
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
        }

        return res.accessToken;
      } catch {
        // Refresh failed — wipe credentials and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
          const callbackUrl = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?callbackUrl=${callbackUrl}`;
        }
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  // ─── Request interceptor — attach auth token + tenant ──────────────────────

  client.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const tenantId = localStorage.getItem(STORAGE_KEYS.TENANT_ID);
      if (token) config.headers.Authorization = `Bearer ${token}`;
      if (tenantId) config.headers['x-tenant-id'] = tenantId;
    }
    return config;
  });

  // ─── Response interceptor — unwrap envelope + handle 401 ───────────────────

  client.interceptors.response.use(
    (res) => res.data,
    async (err) => {
      const original = err.config;

      const isRefreshEndpoint = original?.url?.includes('/auth/refresh');
      const skipRefresh = original?.headers?.['x-skip-auth-refresh'] === 'true';
      const alreadyRetried = Boolean(original?._retried);

      if (
        err.response?.status === 401 &&
        !isRefreshEndpoint &&
        !skipRefresh &&
        !alreadyRetried
      ) {
        original._retried = true;
        const newToken = await getNewAccessToken();
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        }
      }

      return Promise.reject(err);
    },
  );
}
