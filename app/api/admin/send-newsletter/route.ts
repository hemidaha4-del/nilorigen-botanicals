import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAuthenticatedAdmin, isRoleAllowed, isSameOriginRequest, consumeRateLimit, rateLimitResponse } from '@/lib/adminSecurity';
import { recordAdminAudit } from '@/lib/adminAudit';
import { renderNewsletterTemplate, renderNewsletterText } from '@/lib/emailTemplate';
import { getResendSender } from '@/lib/emailSender';
import { sanitizePlainText } from '@/lib/inputSecurity';
import { createNewsletterUnsubscribeToken } from '@/lib/newsletterUnsubscribe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

interface NewsletterRequest {
  subject: string;
  headline: string;
  contentText: string;
}

function isNewsletterRequest(body: unknown): body is NewsletterRequest {
  if (typeof body !== 'object' || body === null) return false;

  const candidate = body as Record<string, unknown>;
  if (
    typeof candidate.subject !== 'string' ||
    typeof candidate.headline !== 'string' ||
    typeof candidate.contentText !== 'string'
  ) {
    return false;
  }

  if (
    sanitizePlainText(candidate.subject).length === 0 ||
    sanitizePlainText(candidate.subject).length > 200 ||
    sanitizePlainText(candidate.headline).length === 0 ||
    sanitizePlainText(candidate.headline).length > 200 ||
    sanitizePlainText(candidate.contentText, true).length === 0 ||
    sanitizePlainText(candidate.contentText, true).length > 20_000
  ) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!isRoleAllowed(admin.role, ['ADMIN', 'STAFF'])) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }
  const rateLimit = await consumeRateLimit(request, 'newsletter-campaign', 5, 60 * 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ success: false, error: 'Email service is not configured' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (!isNewsletterRequest(body)) {
    return NextResponse.json(
      { success: false, error: 'Provide a subject, headline, and contentText' },
      { status: 400 }
    );
  }
  const subject = sanitizePlainText(body.subject);
  const headline = sanitizePlainText(body.headline);
  const contentText = sanitizePlainText(body.contentText, true);

  let subscribers: Array<{ id: number; email: string }>;
  try {
    subscribers = await prisma.subscriber.findMany({
      select: { id: true, email: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Failed to load newsletter subscribers', error);
    return NextResponse.json({ success: false, error: 'Unable to load newsletter subscribers' }, { status: 500 });
  }

  let campaignAuditId: number;
  try {
    const audit = await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        actorUsername: admin.username,
        action: 'NEWSLETTER_CAMPAIGN_STARTED',
        targetType: 'newsletter-campaign',
        details: `recipientCount=${subscribers.length}`,
      },
      select: { id: true },
    });
    campaignAuditId = audit.id;
  } catch (error) {
    console.error('Unable to record newsletter campaign start', error);
    return NextResponse.json({ success: false, error: 'Unable to record campaign activity.' }, { status: 503 });
  }

  const writeCampaignCompletionAudit = async (sentCount: number) => {
    const failedCount = subscribers.length - sentCount;
    try {
      await recordAdminAudit(admin, {
        action: failedCount === 0 ? 'NEWSLETTER_CAMPAIGN_COMPLETED' : 'NEWSLETTER_CAMPAIGN_PARTIALLY_FAILED',
        targetType: 'newsletter-campaign',
        targetId: campaignAuditId,
        details: `recipientCount=${subscribers.length};sentCount=${sentCount};failedCount=${failedCount}`,
      });
      return true;
    } catch (error) {
      console.error('Unable to record newsletter campaign result', { campaignAuditId, error });
      return false;
    }
  };

  if (subscribers.length === 0) {
    const auditRecorded = await writeCampaignCompletionAudit(0);
    return NextResponse.json({
      success: true,
      totalSubscribers: 0,
      totalSent: 0,
      failedCount: 0,
      failures: [],
      ...(!auditRecorded && { auditWarning: 'Campaign result could not be recorded.' }),
    });
  }

  const sender = getResendSender();
  if (!sender) {
    await writeCampaignCompletionAudit(0);
    return NextResponse.json({ success: false, error: 'A valid Nilorigen sender address is not configured.' }, { status: 503 });
  }
  try {
    createNewsletterUnsubscribeToken(subscribers[0].id);
  } catch (error) {
    console.error('Newsletter unsubscribe signing is unavailable', error);
    await writeCampaignCompletionAudit(0);
    return NextResponse.json({ success: false, error: 'Newsletter unsubscribe signing is not configured.' }, { status: 503 });
  }

  const resend = new Resend(resendApiKey);
  const failures: Array<{ index: number; error: string }> = [];
  let totalSent = 0;

  for (let offset = 0; offset < subscribers.length; offset += 100) {
    const batch = subscribers.slice(offset, offset + 100);
    try {
      const { data, error } = await resend.batch.send(
        batch.map(({ id, email }) => {
          const unsubscribeUrl = `https://nilorigen.com/api/newsletter/unsubscribe?token=${createNewsletterUnsubscribeToken(id)}`;
          return {
            from: sender.from,
            to: [email],
            subject,
            html: renderNewsletterTemplate({
              headline,
              contentText,
              ctaText: 'Explore Products',
              ctaLink: 'https://nilorigen.com/products',
              unsubscribeUrl,
            }),
            text: renderNewsletterText({
              headline,
              contentText,
              ctaText: 'Explore Products',
              ctaLink: 'https://nilorigen.com/products',
              unsubscribeUrl,
            }),
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:export@nilorigen.com?subject=Unsubscribe>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          };
        })
      );

      if (error) {
        failures.push({
          index: offset,
          error: error.message,
        });
        continue;
      }

      totalSent += data?.data.length ?? 0;
    } catch (error) {
      failures.push({
        index: offset,
        error: error instanceof Error ? error.message : 'Unknown email service error',
      });
    }
  }

  const auditRecorded = await writeCampaignCompletionAudit(totalSent);
  const successful = failures.length === 0 && totalSent === subscribers.length;
  return NextResponse.json(
    {
      success: successful,
      totalSubscribers: subscribers.length,
      totalSent,
      failedCount: subscribers.length - totalSent,
      failures,
      ...(!auditRecorded && { auditWarning: 'Campaign result could not be recorded.' }),
    },
    { status: successful ? 200 : 502 }
  );
}
