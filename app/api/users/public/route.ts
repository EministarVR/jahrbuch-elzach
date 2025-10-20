import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { ensureUserProfileColumns } from '@/lib/migrations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureUserProfileColumns();

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('userId') || searchParams.get('id');
  const userId = Number(idParam || 0);
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const rows = await query<{ id: number; username: string; class: string | null; bio: string | null; avatar_url: string | null; role: 'user' | 'moderator' | 'admin' }[]>(
    'SELECT id, username, class, bio, avatar_url, role FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
  const user = rows[0] || null;
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
