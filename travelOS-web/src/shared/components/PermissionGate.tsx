'use client';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/shared/stores/auth.store';
import type { UserRole } from '@/shared/types/auth.types';

interface PermissionGateProps {
  /** One or more roles allowed to see the children */
  roles: UserRole | UserRole[];
  /** Rendered when the check fails — default: nothing */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only when the current user's role is in the allowed list.
 *
 * @example
 * <PermissionGate roles={['admin', 'super_admin']}>
 *   <DeleteButton />
 * </PermissionGate>
 */
export function PermissionGate({ roles, fallback = null, children }: PermissionGateProps) {
  const role = useAuthStore((s) => s.user?.role);
  const allowed = Array.isArray(roles) ? roles : [roles];
  return role && allowed.includes(role) ? <>{children}</> : <>{fallback}</>;
}
