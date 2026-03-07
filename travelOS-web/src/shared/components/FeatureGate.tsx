'use client';
import type { ReactNode } from 'react';

interface FeatureGateProps {
  /** Feature flag name — checked against NEXT_PUBLIC_FEATURES env var (comma-separated) */
  feature: string;
  /** Rendered when the feature is disabled — default: nothing */
  fallback?: ReactNode;
  children: ReactNode;
}

function isFeatureEnabled(feature: string): boolean {
  const flags = process.env.NEXT_PUBLIC_FEATURES ?? '';
  return flags.split(',').map((f) => f.trim()).includes(feature);
}

/**
 * Renders children only when the named feature flag is enabled.
 * Set NEXT_PUBLIC_FEATURES="FLAG_A,FLAG_B" in .env.local.
 *
 * @example
 * <FeatureGate feature="WHATSAPP_INTEGRATION">
 *   <WhatsAppButton />
 * </FeatureGate>
 */
export function FeatureGate({ feature, fallback = null, children }: FeatureGateProps) {
  return isFeatureEnabled(feature) ? <>{children}</> : <>{fallback}</>;
}
