/**
 * DEV-ONLY mock: POST /api/v1/auth/refresh
 *
 * Returns a fresh token pair. The interceptor reads accessToken directly
 * from the response (not wrapped in an envelope).
 */
import { NextResponse } from 'next/server';

export async function POST() {
  const now = Date.now();

  return NextResponse.json({
    accessToken: `dev-access-${now}`,
    refreshToken: `dev-refresh-${now}`,
    expiresAt: now + 3_600_000,
  });
}
