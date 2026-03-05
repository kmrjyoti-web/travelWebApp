// TODO: Auth proxy — forward to backend API
import { NextResponse } from 'next/server';

export function POST() {
  return NextResponse.json({ success: false, error: 'Not implemented' }, { status: 501 });
}
