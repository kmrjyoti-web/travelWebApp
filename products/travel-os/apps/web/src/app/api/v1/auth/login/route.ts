/**
 * DEV-ONLY mock: POST /api/v1/auth/login
 *
 * Accepts any credentials and returns a fake AuthResponse so the app can be
 * used locally without a running backend.
 *
 * The Axios interceptor returns `res.data` directly, so this handler returns
 * the AuthResponse payload (user + tokens) at the top level — no envelope.
 *
 * Remove or gate this behind NODE_ENV before shipping to production.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const identifier = String(body.identifier ?? 'admin@travelos.dev');

  const now = Date.now();

  return NextResponse.json({
    user: {
      id: 'dev-user-1',
      email: identifier.includes('@') ? identifier : 'admin@travelos.dev',
      phone: identifier.startsWith('+') ? identifier : undefined,
      name: 'Dev Admin',
      avatar: undefined,
      role: 'admin',
      tenantId: 'dev-tenant',
      productId: 'travel-os',
      emailVerified: true,
      phoneVerified: false,
      createdAt: new Date(now - 86_400_000).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
    tokens: {
      accessToken: `dev-access-${now}`,
      refreshToken: `dev-refresh-${now}`,
      expiresAt: now + 3_600_000, // 1 hour
    },
  });
}
