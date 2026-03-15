'use client';
import React from 'react';
import { Icon } from '@/shared/components';

interface ApiConfigStatusBadgeProps {
  /** True when the provider credentials have passed a live verification test. */
  isVerified: boolean;
  /** True when the provider has been saved (but may not be verified). */
  isConfigured: boolean;
  className?: string;
}

/**
 * Renders a small inline status pill for an API provider config.
 *
 * - isVerified                → green "Verified" badge with CircleCheck icon
 * - isConfigured && !isVerified → yellow "Not Verified" badge with CircleAlert icon
 * - !isConfigured             → gray "Not Configured" badge with CircleMinus icon
 *
 * @example
 * <ApiConfigStatusBadge isVerified={true} isConfigured={true} />
 */
export function ApiConfigStatusBadge({
  isVerified,
  isConfigured,
  className = '',
}: ApiConfigStatusBadgeProps) {
  if (isVerified) {
    return (
      <span
        className={`tos-api-badge tos-api-badge--verified ${className}`}
        aria-label="Verified"
        role="status"
      >
        <Icon name="CircleCheck" size={13} aria-hidden />
        Verified
      </span>
    );
  }

  if (isConfigured) {
    return (
      <span
        className={`tos-api-badge tos-api-badge--unverified ${className}`}
        aria-label="Not Verified"
        role="status"
      >
        <Icon name="CircleAlert" size={13} aria-hidden />
        Not Verified
      </span>
    );
  }

  return (
    <span
      className={`tos-api-badge tos-api-badge--unconfigured ${className}`}
      aria-label="Not Configured"
      role="status"
    >
      <Icon name="CircleMinus" size={13} aria-hidden />
      Not Configured
    </span>
  );
}
