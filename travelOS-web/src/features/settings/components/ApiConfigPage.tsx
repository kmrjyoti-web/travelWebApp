'use client';
import React from 'react';
import { Icon, Alert } from '@/shared/components';
import { useApiConfigs } from '../hooks/useApiConfigs';
import { CloudinaryConfigCard } from './api-config/CloudinaryConfigCard';
import './api-config-page.css';

/**
 * ApiConfigPage — settings page for managing third-party API integrations.
 *
 * Lists all supported providers. Each card handles its own form state,
 * save and verify mutations via React Query. The page fetches the full
 * config list once and passes the relevant summary to each card.
 *
 * Route: /settings/api-config  (mounted as (dashboard)/settings/api-config/page.tsx)
 */
export function ApiConfigPage() {
  const { data: configs, isLoading, error } = useApiConfigs();

  function getConfig(provider: string) {
    return configs?.find((c) => c.provider === provider);
  }

  return (
    <div className="tos-api-page">
      {/* Page header */}
      <div className="tos-api-page__header">
        <span className="tos-api-page__header-icon" aria-hidden>
          <Icon name="Settings" size={22} />
        </span>
        <div>
          <h1 className="tos-api-page__title">API Integrations</h1>
          <p className="tos-api-page__subtitle">
            Connect external services. Credentials are encrypted at rest and never exposed in responses.
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="tos-api-page__loading" role="status" aria-label="Loading API configurations">
          {[1, 2].map((n) => (
            <div key={n} className="tos-api-page__skeleton" aria-hidden />
          ))}
        </div>
      )}

      {/* Fetch error */}
      {error && !isLoading && (
        <Alert color="danger">
          <Icon name="CircleAlert" size={14} aria-hidden />
          Failed to load API configurations. Please refresh the page.
        </Alert>
      )}

      {/* Provider cards */}
      {!isLoading && !error && (
        <div className="tos-api-page__grid">
          <CloudinaryConfigCard existing={getConfig('cloudinary')} />
          {/* Future cards: StripeConfigCard, RazorpayConfigCard, TwilioConfigCard, etc. */}
        </div>
      )}
    </div>
  );
}
