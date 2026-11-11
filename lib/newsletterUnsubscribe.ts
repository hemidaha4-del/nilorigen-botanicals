import { createHmac, timingSafeEqual } from 'node:crypto';

function getUnsubscribeSecret(): string {
  const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || (
    process.env.NODE_ENV === 'production' ? '' : process.env.ADMIN_SESSION_SECRET
  );
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('Newsletter unsubscribe signing requires a secret of at least 32 bytes');
  }
  return secret;
}

export function createNewsletterUnsubscribeToken(subscriberId: number): string {
  const id = String(subscriberId);
  const signature = createHmac('sha256', getUnsubscribeSecret()).update(id).digest('base64url');
  return `${id}.${signature}`;
}

export function readNewsletterUnsubscribeToken(token: string): number | null {
  const match = /^([1-9]\d*)\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return null;

  const subscriberId = Number(match[1]);
  if (!Number.isSafeInteger(subscriberId)) return null;

  const expected = createHmac('sha256', getUnsubscribeSecret()).update(match[1]).digest();
  const provided = Buffer.from(match[2], 'base64url');
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  return subscriberId;
}
