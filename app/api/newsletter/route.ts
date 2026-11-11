import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { consumeRateLimit, isSameOriginRequest, rateLimitResponse } from '@/lib/adminSecurity';
import { sanitizePlainText } from '@/lib/inputSecurity';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  return `${localPart[0]}***@${domain}`;
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  let rateLimit: Awaited<ReturnType<typeof consumeRateLimit>>;
  try {
    rateLimit = await consumeRateLimit(request, 'public-newsletter', 5, 60 * 60);
  } catch (error) {
    console.error('Unable to apply newsletter subscription rate limit', error);
    return NextResponse.json({ error: 'Newsletter service is temporarily unavailable' }, { status: 503 });
  }
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || !('email' in body)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? sanitizePlainText(body.email).toLowerCase() : '';
  if (typeof body.email === 'string' && body.email.trim() !== sanitizePlainText(body.email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  try {
    await prisma.subscriber.create({ data: { email } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { success: true, alreadySubscribed: true, message: 'Already subscribed' },
        { status: 200 }
      );
    }

    console.error('Failed to store newsletter subscription', {
      email: maskEmail(email),
      error,
    });
    return NextResponse.json({ error: 'Unable to save newsletter subscription' }, { status: 500 });
  }

  return NextResponse.json({ success: true, alreadySubscribed: false }, { status: 201 });
}
