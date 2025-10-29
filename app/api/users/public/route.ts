import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { ensureUserProfileColumns, ensureFollowsTable } from '@/lib/migrations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureUserProfileColumns();
  await ensureFollowsTable();

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('userId') || searchParams.get('id');
  const userId = Number(idParam || 0);
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const rows = await query<{ id: number; username: string; class: string | null; bio: string | null; avatar_url: string | null; banner_url: string | null; role: 'user' | 'moderator' | 'admin' }[]>(
    'SELECT id, username, class, bio, avatar_url, banner_url, role FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
  const user = rows[0] || null;
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // follower/following counts and follow state for current user
  const followerRows = await query<{ c: number }[]>
    ('SELECT COUNT(*) AS c FROM user_follows WHERE following_id = ?', [userId]);
  const followingRows = await query<{ c: number }[]>
    ('SELECT COUNT(*) AS c FROM user_follows WHERE follower_id = ?', [userId]);
  const meFollowRows = await query<{ c: number }[]>
    ('SELECT COUNT(*) AS c FROM user_follows WHERE follower_id = ? AND following_id = ? LIMIT 1', [session.userId, userId]);

  // like/dislike totals across this user's submissions
  const likeRows = await query<{ upvotes: number; downvotes: number }[]>(
    `SELECT 
       COALESCE(SUM(CASE WHEN sv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS upvotes,
       COALESCE(SUM(CASE WHEN sv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) AS downvotes
     FROM submissions s
     LEFT JOIN submission_votes sv ON sv.submission_id = s.id
     WHERE s.user_id = ? AND s.status IN ('approved','pending')`,
    [userId]
  );
  const totals: { upvotes: number; downvotes: number } = likeRows[0] || { upvotes: 0, downvotes: 0 };

  return NextResponse.json({ 
    user,
    stats: {
      follower_count: followerRows[0]?.c ?? 0,
      following_count: followingRows[0]?.c ?? 0,
      is_following: (meFollowRows[0]?.c ?? 0) > 0,
      is_me: session.userId === userId,
      likes: Number(totals.upvotes || 0),
      dislikes: Number(totals.downvotes || 0),
    }
  }, { headers: { 'Cache-Control': 'no-store' } });
}
