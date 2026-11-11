import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import {
  consumeRateLimit,
  getAuthenticatedAdmin,
  isSameOriginRequest,
  rateLimitResponse,
} from '@/lib/adminSecurity';
import { recordAdminAudit } from '@/lib/adminAudit';
import { ADMIN_SESSION_COOKIE_OPTIONS, SESSION_COOKIE_NAME } from '@/lib/adminSession';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function isValidPassword(value: string): boolean {
  return (
    value.length >= 12 &&
    Buffer.byteLength(value, 'utf8') <= 72 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  const rateLimit = await consumeRateLimit(request, 'admin-password-change', 5, 60 * 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
  if (
    typeof body !== 'object' ||
    body === null ||
    !('currentPassword' in body) ||
    !('newPassword' in body) ||
    typeof body.currentPassword !== 'string' ||
    typeof body.newPassword !== 'string' ||
    Buffer.byteLength(body.currentPassword, 'utf8') > 72 ||
    !isValidPassword(body.newPassword)
  ) {
    return NextResponse.json(
      { success: false, error: 'Password must be at least 12 characters, no more than 72 UTF-8 bytes, and include upper/lowercase, a number, and a symbol.' },
      { status: 400 }
    );
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: admin.id },
    select: { passwordHash: true },
  });
  if (!user || !(await bcrypt.compare(body.currentPassword, user.passwordHash))) {
    return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash(body.newPassword, 12);
  await prisma.$transaction(async (transaction) => {
    await transaction.adminUser.update({
      where: { id: admin.id },
      data: {
        passwordHash,
        sessionVersion: { increment: 1 },
      },
    });
    await recordAdminAudit(admin, {
      action: 'ADMIN_PASSWORD_CHANGED',
      targetType: 'admin-user',
      targetId: admin.id,
    }, transaction);
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
