import { NextResponse } from 'next/server';
import { findUserByUsername, verifyPassword } from '@/lib/auth';
import { setSession } from '@/lib/session';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = body?.username as string | undefined;
  const password = body?.password as string | undefined;
  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
  }

  // Check IP ban first
  const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
  const clientIp = ipHeader.split(',')[0].trim();
  if (clientIp) {
    const ipBanRows = await query<{ c: number }[]>(
      "SELECT COUNT(*) AS c FROM banned_ips WHERE ip = ? AND (expires_at IS NULL OR expires_at > NOW())",
      [clientIp]
    );
    if ((ipBanRows[0]?.c ?? 0) > 0) {
      return NextResponse.json({ success: false, error: 'Diese IP ist gesperrt.' }, { status: 403 });
    }
  }

  const user = await findUserByUsername(username);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }
  // Check user ban
  const userBanRows = await query<{ c: number }[]>(
    "SELECT COUNT(*) AS c FROM banned_users WHERE user_id = ? AND (expires_at IS NULL OR expires_at > NOW())",
    [user.id]
  );
  if ((userBanRows[0]?.c ?? 0) > 0) {
    return NextResponse.json({ success: false, error: 'Dieser Benutzer ist gesperrt.' }, { status: 403 });
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }

  await setSession(user.id, user.role);
  return NextResponse.json({ success: true });
}


