import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import { ensureFollowsTable } from '@/lib/migrations';
import type { RowDataPacket } from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await ensureFollowsTable();

  let body: { userId?: number } = {};
  try {
    body = (await req.json()) as { userId?: number };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const targetId = Number(body.userId || 0);
  if (!targetId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  if (targetId === session.userId) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });

  const conn = await getDbPool().getConnection();
  try {
    // Ensure target user exists to avoid foreign key errors
    const [userRows] = await conn.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE id = ? LIMIT 1',
      [targetId]
    );
    if (!userRows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [rows] = await conn.query<(RowDataPacket & { cnt: number })[]>(
      'SELECT COUNT(*) as cnt FROM user_follows WHERE follower_id = ? AND following_id = ? LIMIT 1',
      [session.userId, targetId]
    );
    const isFollowing = Number(rows[0]?.cnt ?? 0) > 0;
    if (isFollowing) {
      await conn.query('DELETE FROM user_follows WHERE follower_id = ? AND following_id = ? LIMIT 1', [session.userId, targetId]);
      return NextResponse.json({ success: true, following: false });
    } else {
      try {
        await conn.query('INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)', [session.userId, targetId]);
        return NextResponse.json({ success: true, following: true });
      } catch (err: unknown) {
        // Handle race condition where the follow was inserted after our check
        if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: unknown }).code === 'ER_DUP_ENTRY') {
          return NextResponse.json({ success: true, following: true });
        }
        console.error('Follow toggle insert error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
    }
  } catch (e) {
    console.error('Follow toggle error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
