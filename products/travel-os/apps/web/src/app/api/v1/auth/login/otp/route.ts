/**
 * DEV-ONLY mock: POST /api/v1/auth/login/otp
 *
 * Accepts any OTP code and returns a fake AuthResponse.
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
      name: 'Dev Admin',
      role: 'admin',
      tenantId: 'dev-tenant',
      productId: 'travel-os',
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(now - 86_400_000).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
    tokens: {
      accessToken: `dev-access-${now}`,
      refreshToken: `dev-refresh-${now}`,
      expiresAt: now + 3_600_000,
    },
  });
}
