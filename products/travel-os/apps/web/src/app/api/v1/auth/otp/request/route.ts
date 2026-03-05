/**
 * DEV-ONLY mock: POST /api/v1/auth/otp/request
 *
 * Returns a fake OTP request response so the OTP mode UI works.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const identifier = String(body.identifier ?? '');

  const masked = identifier.includes('@')
    ? identifier.replace(/^(.)(.*)(@.*)$/, '$1***$3')
    : identifier.replace(/^(\+\d{2})(\d+)(\d{3})$/, '$1***$3');

  return NextResponse.json({
    expiresIn: 300,
    maskedTarget: masked || 'u***@example.com',
  });
}
