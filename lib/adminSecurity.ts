import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import type { AdminRole, AdminUser } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { readAdminSession, SESSION_COOKIE_NAME } from '@/lib/adminSession';
import { prisma } from '@/lib/prisma';

type SafeAdminUser = Pick<AdminUser, 'id' | 'username' | 'role' | 'sessionVersion' | 'isActive'>;

export async function getAuthenticatedAdmin(request: NextRequest): Promise<SafeAdminUser | null> {
  return getAuthenticatedAdminFromToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export async function getAuthenticatedAdminFromToken(token: string | undefined): Promise<SafeAdminUser | null> {
  const claims = await readAdminSession(token);
  if (!claims) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: claims.userId },
    select: { id: true, username: true, role: true, sessionVersion: true, isActive: true },
  });

  if (
    !user ||
    !user.isActive ||
    user.username !== claims.username ||
    user.role !== claims.role ||
    user.sessionVersion !== claims.sessionVersion
  ) {
    return null;
  }
  return user;
}

export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const source = origin ?? referer;
  if (!source) return false;

  try {
    return new URL(source).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export function isRoleAllowed(role: AdminRole, allowedRoles: readonly AdminRole[]): boolean {
  return allowedRoles.includes(role);
}

export function adminRateLimitKey(request: NextRequest, action: string): string {
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const clientIp = [request.headers.get('x-real-ip')?.trim(), forwardedIp]
    .find((candidate): candidate is string => Boolean(candidate && isIP(candidate))) || 'unknown';
  return createHash('sha256').update(`${action}:${clientIp}`).digest('hex');
}

export async function consumeRateLimit(
  request: NextRequest,
  action: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const now = new Date();
  const windowMs = windowSeconds * 1000;
  const bucketStart = Math.floor(now.getTime() / windowMs) * windowMs;
  const bucketEnd = new Date(bucketStart + windowMs);
  const key = createHash('sha256')
    .update(`${adminRateLimitKey(request, action)}:${bucketStart}`)
    .digest('hex');

  const bucket = await prisma.adminRateLimitBucket.upsert({
    where: { id: key },
    create: { id: key, count: 1, expiresAt: bucketEnd },
    update: { count: { increment: 1 } },
    select: { count: true },
  });

  if (bucket.count % 100 === 0) {
    await prisma.adminRateLimitBucket.deleteMany({ where: { expiresAt: { lt: now } } });
  }

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucketEnd.getTime() - now.getTime()) / 1000)),
  };
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
  );
}
