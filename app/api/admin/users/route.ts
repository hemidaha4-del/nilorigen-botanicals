import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import {
  consumeRateLimit,
  getAuthenticatedAdmin,
  isRoleAllowed,
  isSameOriginRequest,
  rateLimitResponse,
} from '@/lib/adminSecurity';
import { recordAdminAudit } from '@/lib/adminAudit';
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

export async function GET(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  const rateLimit = await consumeRateLimit(request, 'admin-user-list', 60, 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  try {
    const users = await prisma.adminUser.findMany({
      select: { id: true, username: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({
      users: users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() })),
    });
  } catch (error) {
    console.error('Failed to load admin users', error);
    return NextResponse.json({ success: false, error: 'Unable to load admin users.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  if (!isRoleAllowed(admin.role, ['ADMIN'])) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  const rateLimit = await consumeRateLimit(request, 'admin-user-create', 5, 60 * 60);
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
    !('username' in body) ||
    !('password' in body) ||
    typeof body.username !== 'string' ||
    typeof body.password !== 'string' ||
    !/^[a-zA-Z0-9._-]{3,64}$/.test(body.username) ||
    !isValidPassword(body.password) ||
    ('role' in body && body.role !== undefined && body.role !== 'STAFF')
  ) {
    return NextResponse.json(
      { success: false, error: 'Use a 3–64 character username and a strong password.' },
      { status: 400 }
    );
  }

  const username = body.username;
  const password = body.password;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.adminUser.create({
        data: {
          username,
          passwordHash,
          role: 'STAFF',
        },
        select: { id: true, username: true, role: true, isActive: true, createdAt: true },
      });
      await recordAdminAudit(admin, {
        action: 'STAFF_ACCOUNT_CREATED',
        targetType: 'admin-user',
        targetId: createdUser.id,
      }, transaction);
      return createdUser;
    });
    return NextResponse.json(
      { success: true, user: { ...user, createdAt: user.createdAt.toISOString() } },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ success: false, error: 'That username is already in use.' }, { status: 409 });
    }
    console.error('Failed to create staff account', error);
    return NextResponse.json({ success: false, error: 'Unable to create staff account.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  const rateLimit = await consumeRateLimit(request, 'admin-user-disable', 10, 60 * 60);
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
    !('userId' in body) ||
    typeof body.userId !== 'number' ||
    !Number.isSafeInteger(body.userId) ||
    body.userId < 1 ||
    body.userId === admin.id
  ) {
    return NextResponse.json({ success: false, error: 'Choose a different valid account.' }, { status: 400 });
  }

  const userId = body.userId;
  try {
    const result = await prisma.$transaction(async (transaction) => {
      const update = await transaction.adminUser.updateMany({
        where: { id: userId, role: 'STAFF' },
        data: { isActive: false, sessionVersion: { increment: 1 } },
      });
      if (update.count > 0) {
        await recordAdminAudit(admin, {
          action: 'STAFF_ACCOUNT_DISABLED',
          targetType: 'admin-user',
          targetId: userId,
        }, transaction);
      }
      return update;
    });
    if (result.count === 0) {
      return NextResponse.json({ success: false, error: 'Staff account not found.' }, { status: 404 });
    }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Admin user not found.' }, { status: 404 });
    }
    console.error('Failed to disable admin account', error);
    return NextResponse.json({ success: false, error: 'Unable to disable admin account.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  const rateLimit = await consumeRateLimit(request, 'admin-user-status', 20, 60);
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
    !('userId' in body) ||
    !('isActive' in body) ||
    typeof body.userId !== 'number' ||
    !Number.isSafeInteger(body.userId) ||
    body.userId < 1 ||
    body.userId === admin.id ||
    typeof body.isActive !== 'boolean'
  ) {
    return NextResponse.json({ success: false, error: 'Choose a valid staff account and status.' }, { status: 400 });
  }

  const userId = body.userId;
  const isActive = body.isActive;
  try {
    const result = await prisma.$transaction(async (transaction) => {
      const update = await transaction.adminUser.updateMany({
        where: { id: userId, role: 'STAFF' },
        data: { isActive, sessionVersion: { increment: 1 } },
      });
      if (update.count > 0) {
        await recordAdminAudit(admin, {
          action: isActive ? 'STAFF_ACCOUNT_ENABLED' : 'STAFF_ACCOUNT_DISABLED',
          targetType: 'admin-user',
          targetId: userId,
        }, transaction);
      }
      return update;
    });
    if (result.count === 0) {
      return NextResponse.json({ success: false, error: 'Staff account not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update staff account status', { userId, error });
    return NextResponse.json({ success: false, error: 'Unable to update staff account.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
