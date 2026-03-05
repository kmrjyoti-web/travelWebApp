/**
 * DEV-ONLY mock: POST /api/v1/auth/logout
 *
 * No-op — the client clears localStorage itself; server just acknowledges.
 */
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: true });
}
