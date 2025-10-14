import { NextResponse } from 'next/server';
import { findUserByUsername, verifyPassword } from '@/lib/auth';
import { setSession } from '@/lib/session';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = body?.username as string | undefined;
  const password = body?.password as string | undefined;
  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
  }

  const user = await findUserByUsername(username);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }

  await setSession(user.id, user.role);
  return NextResponse.json({ success: true });
}


