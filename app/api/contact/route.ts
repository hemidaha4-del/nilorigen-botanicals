import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { consumeRateLimit, isSameOriginRequest, rateLimitResponse } from '@/lib/adminSecurity';
import { getResendSender } from '@/lib/emailSender';
import { sanitizePlainText } from '@/lib/inputSecurity';

export const runtime = 'nodejs';

interface ContactInquiryRequest {
  fullName: string;
  company: string;
  email: string;
  destinationCountry: string;
  specifications: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_LIMITS = {
  fullName: 200,
  company: 200,
  email: 254,
  destinationCountry: 100,
  specifications: 10_000,
} as const;

function isContactInquiryRequest(body: unknown): body is ContactInquiryRequest {
  if (typeof body !== 'object' || body === null) return false;

  const candidate = body as Record<string, unknown>;
  if (
    typeof candidate.fullName !== 'string' ||
    typeof candidate.company !== 'string' ||
    typeof candidate.email !== 'string' ||
    typeof candidate.destinationCountry !== 'string' ||
    typeof candidate.specifications !== 'string'
  ) return false;

  const fullName = sanitizePlainText(candidate.fullName);
  const company = sanitizePlainText(candidate.company);
  const email = sanitizePlainText(candidate.email).toLowerCase();
  const destinationCountry = sanitizePlainText(candidate.destinationCountry);
  const specifications = sanitizePlainText(candidate.specifications, true);
  return (
    fullName.length > 0 &&
    fullName.length <= FIELD_LIMITS.fullName &&
    company.length > 0 &&
    company.length <= FIELD_LIMITS.company &&
    candidate.email.trim() === sanitizePlainText(candidate.email) &&
    email.length <= FIELD_LIMITS.email &&
    EMAIL_PATTERN.test(email) &&
    destinationCountry.length > 0 &&
    destinationCountry.length <= FIELD_LIMITS.destinationCountry &&
    specifications.length > 0 &&
    specifications.length <= FIELD_LIMITS.specifications
  );
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  let rateLimit: Awaited<ReturnType<typeof consumeRateLimit>>;
  try {
    rateLimit = await consumeRateLimit(request, 'public-contact', 5, 60 * 60);
  } catch (error) {
    console.error('Unable to apply contact inquiry rate limit', error);
    return NextResponse.json({ success: false, error: 'Contact service is temporarily unavailable' }, { status: 503 });
  }
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (!isContactInquiryRequest(body)) {
    return NextResponse.json(
      { success: false, error: 'Provide valid values for all required fields' },
      { status: 400 }
    );
  }

  const inquiry = {
    fullName: sanitizePlainText(body.fullName),
    company: sanitizePlainText(body.company),
    email: sanitizePlainText(body.email).toLowerCase(),
    destinationCountry: sanitizePlainText(body.destinationCountry),
    specifications: sanitizePlainText(body.specifications, true),
  };

  let savedInquiry: { id: number; createdAt: Date };
  try {
    savedInquiry = await prisma.contactInquiry.create({
      data: inquiry,
      select: { id: true, createdAt: true },
    });
  } catch (error) {
    console.error('Failed to save contact inquiry', error);
    return NextResponse.json(
      { success: false, error: 'Unable to save your inquiry. Please try again.' },
      { status: 500 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const sender = getResendSender();
  if (!resendApiKey || !sender) {
    console.error('Contact inquiry saved but email service credentials or sender are not configured', {
      inquiryId: savedInquiry.id,
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        notificationSent: false,
        notificationWarning: 'The inquiry was saved, but the export desk notification is not configured.',
      },
      { status: 201 }
    );
  }

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: sender.from,
      to: ['export@nilorigen.com'],
      replyTo: inquiry.email,
      subject: `New B2B export inquiry: ${inquiry.company}`,
      text: [
        'A new export inquiry was submitted through the Nilorigen Botanicals website.',
        '',
        `Name: ${inquiry.fullName}`,
        `Company: ${inquiry.company}`,
        `Email: ${inquiry.email}`,
        `Destination country: ${inquiry.destinationCountry}`,
        '',
        'Product and order specifications:',
        inquiry.specifications,
        '',
        `Inquiry ID: ${savedInquiry.id}`,
        `Received: ${savedInquiry.createdAt.toISOString()}`,
      ].join('\n'),
    });

    if (error) {
      console.error('Contact inquiry saved but export desk email failed', {
        inquiryId: savedInquiry.id,
        error: error.message,
      });
      return NextResponse.json(
        {
          success: true,
          message: 'Inquiry submitted successfully',
          notificationSent: false,
          notificationWarning: 'The inquiry was saved, but the export desk notification could not be sent.',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Contact inquiry saved but export desk email failed', {
      inquiryId: savedInquiry.id,
      error,
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        notificationSent: false,
        notificationWarning: 'The inquiry was saved, but the export desk notification could not be sent.',
      },
      { status: 201 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Inquiry submitted successfully',
      notificationSent: true,
    },
    { status: 201 }
  );
}
