import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readNewsletterUnsubscribeToken } from '@/lib/newsletterUnsubscribe';

export const runtime = 'nodejs';

function getToken(request: NextRequest): string {
  return request.nextUrl.searchParams.get('token') ?? '';
}

export async function GET(request: NextRequest) {
  let subscriberId: number | null;
  try {
    subscriberId = readNewsletterUnsubscribeToken(getToken(request));
  } catch (error) {
    console.error('Newsletter unsubscribe signing is unavailable', error);
    return new NextResponse('Unsubscribe is temporarily unavailable.', { status: 503 });
  }
  if (!subscriberId) return new NextResponse('Invalid unsubscribe link.', { status: 400 });

  return new NextResponse(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title><body><main><h1>Unsubscribe</h1><p>Confirm that you no longer want to receive Nilorigen Botanicals updates.</p><form method="post"><input type="hidden" name="List-Unsubscribe" value="One-Click"><button type="submit">Unsubscribe</button></form></main></body></html>',
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'none'; form-action 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  let subscriberId: number | null;
  try {
    subscriberId = readNewsletterUnsubscribeToken(getToken(request));
  } catch (error) {
    console.error('Newsletter unsubscribe signing is unavailable', error);
    return NextResponse.json({ success: false, error: 'Unsubscribe is temporarily unavailable.' }, { status: 503 });
  }
  if (!subscriberId) {
    return NextResponse.json({ success: false, error: 'Invalid unsubscribe link.' }, { status: 400 });
  }

  // The per-subscriber HMAC token is the CSRF credential for RFC 8058 mail-client POSTs.
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid unsubscribe request.' }, { status: 400 });
  }
  if (form.get('List-Unsubscribe') !== 'One-Click') {
    return NextResponse.json({ success: false, error: 'Invalid unsubscribe request.' }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.subscriber.deleteMany({ where: { id: subscriberId } }),
      prisma.adminAuditLog.create({
        data: {
          actorId: null,
          actorUsername: 'newsletter-recipient',
          action: 'NEWSLETTER_UNSUBSCRIBED',
          targetType: 'subscriber',
          targetId: String(subscriberId),
        },
      }),
    ]);
  } catch (error) {
    console.error('Failed to unsubscribe newsletter recipient', { subscriberId, error });
    return NextResponse.json({ success: false, error: 'Unable to update subscription.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, unsubscribed: true });
}
