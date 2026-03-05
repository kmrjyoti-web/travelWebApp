import axios from 'axios';
import type { ApiResponse } from '@/shared/types/api.types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

// Request interceptor: attach auth headers (Rule 5 — all API logic in services)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tos-access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Multi-tenant headers required by backend (CLAUDE.md backend API)
    config.headers['x-product-id'] = 'travel-os';
    const tenantId = localStorage.getItem('tos-tenant-id');
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
    }
  }
  return config;
});

// Response interceptor: normalize + handle 401
api.interceptors.response.use(
  (response): any => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tos-access-token');
        localStorage.removeItem('tos-refresh-token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data ?? error);
  }
);
