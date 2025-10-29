import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import { ensureFollowsTable } from '@/lib/migrations';
import type { RowDataPacket } from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await ensureFollowsTable();

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('userId') || searchParams.get('id');
  const userId = Number(idParam || 0);
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const conn = await getDbPool().getConnection();
  try {
    const [followerRows] = await conn.query<(RowDataPacket & { c: number })[]>(
      'SELECT COUNT(*) AS c FROM user_follows WHERE following_id = ?',
      [userId]
    );
    const [followingRows] = await conn.query<(RowDataPacket & { c: number })[]>(
      'SELECT COUNT(*) AS c FROM user_follows WHERE follower_id = ?',
      [userId]
    );
    const [meFollowRows] = await conn.query<(RowDataPacket & { c: number })[]>(
      'SELECT COUNT(*) AS c FROM user_follows WHERE follower_id = ? AND following_id = ? LIMIT 1',
      [session.userId, userId]
    );
    const follower = followerRows[0];
    const following = followingRows[0];
    const meFollow = meFollowRows[0];
    return NextResponse.json({
      userId,
      follower_count: Number(follower?.c ?? 0),
      following_count: Number(following?.c ?? 0),
      is_following: Number(meFollow?.c ?? 0) > 0,
      is_me: session.userId === userId,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('Follow stats error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
