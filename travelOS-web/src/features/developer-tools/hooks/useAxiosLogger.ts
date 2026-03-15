'use client';
import { useEffect } from 'react';
import { api } from '@/shared/services/api';
import { useDevToolsStore } from '../stores/devtools.store';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

interface TimedConfig extends InternalAxiosRequestConfig {
  _devToolsStart?: number;
}

export function useAxiosLogger() {
  const addNetworkLog = useDevToolsStore((s) => s.addNetworkLog);

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config: TimedConfig) => {
      config._devToolsStart = performance.now();
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as TimedConfig;
        const duration = config._devToolsStart
          ? Math.round(performance.now() - config._devToolsStart)
          : undefined;
        addNetworkLog({
          method: (config.method ?? 'GET').toUpperCase(),
          url: config.url ?? '?',
          status: response.status,
          duration,
        });
        return response;
      },
      (error) => {
        const config = (error.config ?? {}) as TimedConfig;
        const duration = config._devToolsStart
          ? Math.round(performance.now() - config._devToolsStart)
          : undefined;
        addNetworkLog({
          method: (config.method ?? 'GET').toUpperCase(),
          url: config.url ?? '?',
          status: error.response?.status,
          duration,
          error: error.message ?? 'Network Error',
        });
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [addNetworkLog]);
}
