import { timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { consumeRateLimit, isSameOriginRequest, rateLimitResponse } from '@/lib/adminSecurity';
import { recordAdminAudit } from '@/lib/adminAudit';
import {
  createAdminSession,
  ADMIN_SESSION_COOKIE_OPTIONS,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from '@/lib/adminSession';

export const runtime = 'nodejs';

function safeEqual(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(request: NextRequest) {
  const rateLimit = await consumeRateLimit(request, 'login', 5, 15 * 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 });
  }

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('username' in body) ||
    !('password' in body) ||
    typeof body.username !== 'string' ||
    typeof body.password !== 'string' ||
    body.username.length > 200 ||
    body.password.length > 1024 ||
    Buffer.byteLength(body.password, 'utf8') > 72
  ) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  let user = await prisma.adminUser.findUnique({ where: { username: body.username } });

  if (!user) {
    const bootstrapUsername = process.env.ADMIN_USERNAME;
    const bootstrapPassword = process.env.ADMIN_PASSWORD;
    if (
      !bootstrapUsername ||
      !bootstrapPassword ||
      Buffer.byteLength(bootstrapPassword, 'utf8') > 72 ||
      !safeEqual(body.username, bootstrapUsername) ||
      !safeEqual(body.password, bootstrapPassword)
    ) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    try {
      user = await prisma.adminUser.create({
        data: {
          username: bootstrapUsername,
          passwordHash: await bcrypt.hash(bootstrapPassword, 12),
          role: 'ADMIN',
        },
      });
    } catch (error) {
      console.error('Unable to initialize the first admin user', error);
      user = await prisma.adminUser.findUnique({ where: { username: bootstrapUsername } });
      if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
        return NextResponse.json({ error: 'Unable to initialize admin access' }, { status: 500 });
      }
    }
  } else if (!(await bcrypt.compare(body.password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  if (!user.isActive) {
    return NextResponse.json({ error: 'This account has been disabled' }, { status: 403 });
  }

  try {
    await recordAdminAudit(user, {
      action: 'ADMIN_LOGIN',
      targetType: 'admin-user',
      targetId: user.id,
    });
  } catch (error) {
    console.error('Unable to record admin login', { userId: user.id, error });
    return NextResponse.json({ error: 'Unable to record admin access' }, { status: 503 });
  }

  const token = await createAdminSession(user);
  if (!token) {
    return NextResponse.json({ error: 'Admin session is not configured' }, { status: 503 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    maxAge: SESSION_DURATION_SECONDS,
  });
  return response;
}
