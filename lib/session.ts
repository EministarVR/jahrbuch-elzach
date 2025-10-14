import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'jb_session';
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export type SessionPayload = {
  userId: number;
  role: 'user' | 'admin';
  exp: number; // epoch ms
};

function getSecret(): Buffer {
  const secret = process.env.SESSION_SECRET || '';
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET is missing/too short');
  }
  return Buffer.from(secret, 'utf8');
}

function base64url(input: Buffer) {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function createSignedCookie(payload: SessionPayload) {
  const secret = getSecret();
  const data = Buffer.from(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(data).digest();
  return base64url(data) + '.' + base64url(sig);
}

export function verifySignedCookie(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  const [dataB64, sigB64] = value.split('.');
  if (!dataB64 || !sigB64) return null;
  const secret = getSecret();
  const data = Buffer.from(dataB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const expected = crypto.createHmac('sha256', secret).update(data).digest();
  const actual = Buffer.from(sigB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  if (!crypto.timingSafeEqual(expected, actual)) return null;
  try {
    const parsed = JSON.parse(data.toString('utf8')) as SessionPayload;
    if (typeof parsed.exp !== 'number' || Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  return verifySignedCookie(raw);
}

export async function setSession(userId: number, role: 'user' | 'admin') {
  const store = await cookies();
  const payload: SessionPayload = { userId, role, exp: Date.now() + ONE_DAY_MS * 7 };
  const value = createSignedCookie(payload);
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}


