import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAuthState } from '@/lib/auth';
import { getDbPool } from '@/lib/db';
import { ensureCommentsSchema } from '@/lib/migrations';
import type { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

interface Comment extends RowDataPacket {
  id: number;
  submission_id: number;
  user_id: number;
  parent_id: number | null;
  text: string;
  status: string;
  created_at: string;
  author: string;
  author_role: string;
  author_class: string | null;
  upvotes: number;
  downvotes: number;
  user_vote: 'upvote' | 'downvote' | null;
  is_author: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCommentsSchema();

    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get('submissionId');

    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
    }

    const conn = await getDbPool().getConnection();
    try {
      const query = `
        SELECT 
          c.id,
          c.submission_id,
          c.user_id,
          c.parent_id,
          c.text,
          c.status,
          c.created_at,
          u.username AS author,
          u.role AS author_role,
          u.class AS author_class,
          s.user_id AS submission_author_id,
          COALESCE(SUM(CASE WHEN cv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS upvotes,
          COALESCE(SUM(CASE WHEN cv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) AS downvotes,
          uv.vote_type AS user_vote
        FROM comments c
        JOIN users u ON u.id = c.user_id
        JOIN submissions s ON s.id = c.submission_id
        LEFT JOIN comment_votes cv ON c.id = cv.comment_id
        LEFT JOIN comment_votes uv ON c.id = uv.comment_id AND uv.user_id = ?
        WHERE c.submission_id = ? AND c.status = 'active'
        GROUP BY c.id, c.submission_id, c.user_id, c.parent_id, c.text, c.status, c.created_at, u.username, u.role, u.class, s.user_id, uv.vote_type
        ORDER BY c.created_at ASC
      `;

      const [comments] = await conn.execute<Comment[]>(query, [session.userId, submissionId]);

      // Add is_author flag
      const commentsWithFlags = comments.map(comment => ({
        ...comment,
        is_author: comment.user_id === comment.submission_author_id
      }));

      return NextResponse.json({ comments: commentsWithFlags }, { headers: { 'Cache-Control': 'no-store' } });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const state = await getAuthState();
    if (!state.session || !state.exists) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }
    if (state.banned) {
      return NextResponse.json({ error: 'Banned' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }

    await ensureCommentsSchema();

    const body = await req.json();
    const { submissionId, text, parentId } = body;

    if (!submissionId || !text?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const conn = await getDbPool().getConnection();
    try {
      await conn.query(
        `INSERT INTO comments (submission_id, user_id, parent_id, text) VALUES (?, ?, ?, ?)`,
        [submissionId, session.userId, parentId || null, text.trim()]
      );

      return NextResponse.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

