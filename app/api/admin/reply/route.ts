import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAuthenticatedAdmin, isRoleAllowed, isSameOriginRequest, consumeRateLimit, rateLimitResponse } from '@/lib/adminSecurity';
import { recordAdminAudit } from '@/lib/adminAudit';
import { getResendSender } from '@/lib/emailSender';
import { sanitizePlainText } from '@/lib/inputSecurity';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const MAX_REPLY_LENGTH = 10_000;
type InquiryStatus = 'PENDING' | 'RESPONDED' | 'CLOSED';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isInquiryStatus(value: unknown): value is InquiryStatus {
  return value === 'PENDING' || value === 'RESPONDED' || value === 'CLOSED';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderReplyEmail(fullName: string, message: string): string {
  const safeName = escapeHtml(fullName);
  const paragraphs = message
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (line) =>
        `<p dir="auto" style="margin:0 0 15px;color:#E0E0E0;font-size:15px;line-height:1.8;text-align:left;">${escapeHtml(line)}</p>`
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Reply from Nilorigen Botanicals</title>
  </head>
  <body style="margin:0;padding:0;background:#073B2A;font-family:Arial,Helvetica,sans-serif;color:#fff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#073B2A">
      <tr><td align="center" style="padding:32px 14px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#0A3F2E" style="width:100%;max-width:600px;background:#0A3F2E;border:1px solid #285441;border-radius:12px;">
          <tr><td align="center" style="padding:34px 28px 25px;">
            <img src="https://nilorigen.com/logo.png" width="120" alt="Nilorigen Botanicals" style="display:block;width:120px;max-width:100%;height:auto;margin:0 auto;border:0;">
            <p style="margin:12px 0 0;color:#D4AF37;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:bold;letter-spacing:2px;">NILORIGEN BOTANICALS</p>
            <p style="margin:7px 0 0;color:#E0E0E0;font-size:10px;letter-spacing:1.6px;">EGYPTIAN BOTANICALS &bull; GLOBAL REACH</p>
          </td></tr>
          <tr><td style="padding:0 30px;"><div style="height:1px;background:#D4AF37;font-size:0;line-height:0;">&nbsp;</div></td></tr>
          <tr><td style="padding:30px;">
            <h1 dir="auto" style="margin:0 0 18px;color:#fff;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;line-height:1.4;">Dear ${safeName},</h1>
            <div style="padding:20px 20px 5px;background:#0D4935;border:1px solid #D4AF37;border-radius:8px;">
              ${paragraphs}
            </div>
            <p style="margin:24px 0 0;color:#E0E0E0;font-size:14px;line-height:1.8;">Kind regards,<br><strong style="color:#D4AF37;">Nilorigen Botanicals Export Desk</strong></p>
            <p style="margin:8px 0 0;font-size:13px;"><a href="mailto:export@nilorigen.com" style="color:#D4AF37;">export@nilorigen.com</a></p>
          </td></tr>
          <tr><td align="center" style="padding:0 24px 25px;color:#A9B8B0;font-size:11px;line-height:1.6;">Headquarters: Cairo, Egypt &bull; Nilorigen Botanicals</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
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
  const rateLimit = await consumeRateLimit(request, 'reply', 20, 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (
    !isRecord(body) ||
    typeof body.inquiryId !== 'number' ||
    !Number.isSafeInteger(body.inquiryId) ||
    body.inquiryId < 1 ||
    typeof body.message !== 'string' ||
    body.message.length > MAX_REPLY_LENGTH
  ) {
    return NextResponse.json(
      { success: false, error: 'Provide a valid inquiry ID and a reply up to 10,000 characters.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sender = getResendSender();
  if (!apiKey || !sender) {
    return NextResponse.json({ success: false, error: 'Email service or sender is not configured.' }, { status: 503 });
  }

  const inquiryId = body.inquiryId;
  const message = sanitizePlainText(body.message, true);
  if (!message) {
    return NextResponse.json({ success: false, error: 'Reply message cannot be empty.' }, { status: 400 });
  }
  let inquiry;
  try {
    inquiry = await prisma.contactInquiry.findUnique({
      where: { id: inquiryId },
      select: { id: true, fullName: true, company: true, email: true },
    });
  } catch (error) {
    console.error('Failed to load contact inquiry for reply', { inquiryId, error });
    return NextResponse.json({ success: false, error: 'Unable to load this inquiry.' }, { status: 500 });
  }

  if (!inquiry) {
    return NextResponse.json({ success: false, error: 'Inquiry not found.' }, { status: 404 });
  }

  const senderEmail = sender.email;

  let savedReply;
  try {
    savedReply = await prisma.$transaction(async (transaction) => {
      const reply = await transaction.inquiryReply.create({
        data: { inquiryId, message, senderEmail },
        select: { id: true },
      });
      await recordAdminAudit(admin, {
        action: 'INQUIRY_REPLY_CREATED',
        targetType: 'contact-inquiry',
        targetId: inquiryId,
        details: `replyId=${reply.id}`,
      }, transaction);
      return reply;
    });
  } catch (error) {
    console.error('Failed to record contact inquiry reply', { inquiryId, error });
    return NextResponse.json({ success: false, error: 'Unable to save the reply.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: sender.from,
      to: [inquiry.email],
      replyTo: senderEmail,
      subject: 'Reply regarding your export inquiry with Nilorigen Botanicals',
      html: renderReplyEmail(inquiry.fullName, message),
      text: `Dear ${inquiry.fullName},\n\n${message}\n\nKind regards,\nNilorigen Botanicals Export Desk\n${senderEmail}`,
    });

    if (error) {
      await prisma.$transaction(async (transaction) => {
        await transaction.inquiryReply.update({
          where: { id: savedReply.id },
          data: { status: 'FAILED' },
        });
        await recordAdminAudit(admin, {
          action: 'INQUIRY_REPLY_SEND_FAILED',
          targetType: 'contact-inquiry',
          targetId: inquiryId,
          details: `replyId=${savedReply.id}`,
        }, transaction);
      });
      console.error('Failed to send inquiry reply email', {
        inquiryId,
        replyId: savedReply.id,
        error: error.message,
      });
      return NextResponse.json(
        { success: false, error: 'Reply could not be sent. The draft is saved in the conversation history.' },
        { status: 502 }
      );
    }
  } catch (error) {
    await prisma.$transaction(async (transaction) => {
      await transaction.inquiryReply.update({
        where: { id: savedReply.id },
        data: { status: 'FAILED' },
      });
      await recordAdminAudit(admin, {
        action: 'INQUIRY_REPLY_SEND_FAILED',
        targetType: 'contact-inquiry',
        targetId: inquiryId,
        details: `replyId=${savedReply.id}`,
      }, transaction);
    });
    console.error('Failed to send inquiry reply email', { inquiryId, replyId: savedReply.id, error });
    return NextResponse.json(
      { success: false, error: 'Reply could not be sent. The draft is saved in the conversation history.' },
      { status: 502 }
    );
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.inquiryReply.update({
        where: { id: savedReply.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
      await transaction.contactInquiry.update({
        where: { id: inquiryId },
        data: { status: 'RESPONDED' },
      });
      await recordAdminAudit(admin, {
        action: 'INQUIRY_REPLY_SENT',
        targetType: 'contact-inquiry',
        targetId: inquiryId,
        details: `replyId=${savedReply.id}`,
      }, transaction);
    });
  } catch (error) {
    console.error('Reply email sent but inquiry status update failed', {
      inquiryId,
      replyId: savedReply.id,
      error,
    });
    return NextResponse.json(
      {
        success: true,
        statusSaved: false,
        message: 'Reply sent, but the inquiry status could not be updated.',
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: true, message: 'Reply sent and recorded successfully' },
    { status: 201 }
  );
}

export async function PATCH(request: NextRequest) {
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
  const rateLimit = await consumeRateLimit(request, 'inquiry-status', 30, 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (
    !isRecord(body) ||
    typeof body.inquiryId !== 'number' ||
    !Number.isSafeInteger(body.inquiryId) ||
    body.inquiryId < 1 ||
    !isInquiryStatus(body.status)
  ) {
    return NextResponse.json({ success: false, error: 'Provide a valid inquiry ID and status.' }, { status: 400 });
  }

  const inquiryId = body.inquiryId;
  const status = body.status;
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.contactInquiry.update({
        where: { id: inquiryId },
        data: { status },
      });
      await recordAdminAudit(admin, {
        action: 'INQUIRY_STATUS_CHANGED',
        targetType: 'contact-inquiry',
        targetId: inquiryId,
        details: `status=${status}`,
      }, transaction);
    });
  } catch (error) {
    if (isRecord(error) && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Inquiry not found.' }, { status: 404 });
    }
    console.error('Failed to update contact inquiry status', {
      inquiryId,
      status,
      error,
    });
    return NextResponse.json({ success: false, error: 'Unable to update inquiry status.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Inquiry status updated successfully.' });
}

export async function DELETE(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (admin.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
  }

  const rateLimit = await consumeRateLimit(request, 'inquiry-delete', 10, 60);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
  if (
    !isRecord(body) ||
    typeof body.inquiryId !== 'number' ||
    !Number.isSafeInteger(body.inquiryId) ||
    body.inquiryId < 1
  ) {
    return NextResponse.json({ success: false, error: 'Provide a valid inquiry ID.' }, { status: 400 });
  }

  const inquiryId = body.inquiryId;
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.contactInquiry.delete({ where: { id: inquiryId } });
      await recordAdminAudit(admin, {
        action: 'INQUIRY_DELETED',
        targetType: 'contact-inquiry',
        targetId: inquiryId,
      }, transaction);
    });
  } catch (error) {
    if (isRecord(error) && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Inquiry not found.' }, { status: 404 });
    }
    console.error('Failed to delete contact inquiry', { inquiryId, error });
    return NextResponse.json({ success: false, error: 'Unable to delete inquiry.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
