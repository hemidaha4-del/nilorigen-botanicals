import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE_OPTIONS, SESSION_COOKIE_NAME } from '@/lib/adminSession';
import { isSameOriginRequest } from '@/lib/adminSecurity';

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
