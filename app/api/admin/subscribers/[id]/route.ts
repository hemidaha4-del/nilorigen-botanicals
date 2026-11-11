import { NextRequest, NextResponse } from 'next/server';
import {
  consumeRateLimit,
  getAuthenticatedAdmin,
  isSameOriginRequest,
  rateLimitResponse,
} from '@/lib/adminSecurity';
import { recordAdminAudit } from '@/lib/adminAudit';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  const rateLimit = await consumeRateLimit(request, 'subscriber-delete', 20, 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const { id } = await params;
  const subscriberId = Number(id);
  if (!Number.isSafeInteger(subscriberId) || subscriberId < 1) {
    return NextResponse.json({ success: false, error: 'Invalid subscriber ID.' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.subscriber.delete({ where: { id: subscriberId } });
      await recordAdminAudit(admin, {
        action: 'SUBSCRIBER_DELETED',
        targetType: 'subscriber',
        targetId: subscriberId,
      }, transaction);
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Subscriber not found.' }, { status: 404 });
    }
    console.error('Failed to delete newsletter subscriber', { subscriberId, error });
    return NextResponse.json({ success: false, error: 'Unable to delete subscriber.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
