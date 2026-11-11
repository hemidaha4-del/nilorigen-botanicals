import type { AdminRole, AdminUser } from '@prisma/client';

const SESSION_COOKIE_NAME = 'nilorigen_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/',
};
const encoder = new TextEncoder();

export interface AdminSessionClaims {
  userId: number;
  username: string;
  role: AdminRole;
  sessionVersion: number;
  expiresAt: number;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getSigningKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function isSessionClaims(value: unknown): value is AdminSessionClaims {
  if (typeof value !== 'object' || value === null) return false;
  const claims = value as Record<string, unknown>;
  return (
    Number.isSafeInteger(claims.userId) &&
    (claims.userId as number) > 0 &&
    typeof claims.username === 'string' &&
    (claims.role === 'ADMIN' || claims.role === 'STAFF') &&
    Number.isSafeInteger(claims.sessionVersion) &&
    Number.isSafeInteger(claims.expiresAt) &&
    (claims.expiresAt as number) > Date.now()
  );
}

export async function createAdminSession(user: Pick<AdminUser, 'id' | 'username' | 'role' | 'sessionVersion'>): Promise<string | null> {
  const key = await getSigningKey();
  if (!key) return null;

  const claims: AdminSessionClaims = {
    userId: user.id,
    username: user.username,
    role: user.role,
    sessionVersion: user.sessionVersion,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };
  const payload = encodeBase64Url(encoder.encode(JSON.stringify(claims)));
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));

  return `${payload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function readAdminSession(token: string | undefined): Promise<AdminSessionClaims | null> {
  if (!token) return null;

  const [payload, encodedSignature, ...extraParts] = token.split('.');
  if (!payload || !encodedSignature || extraParts.length > 0) return null;

  try {
    const key = await getSigningKey();
    if (!key) return null;

    const validSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64Url(encodedSignature),
      encoder.encode(payload)
    );
    if (!validSignature) return null;

    const claims: unknown = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    return isSessionClaims(claims) ? claims : null;
  } catch {
    return null;
  }
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  return (await readAdminSession(token)) !== null;
}

export { ADMIN_SESSION_COOKIE_OPTIONS, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS };
