import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import { ensureModerationSchema } from '@/lib/migrations';
import type { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureModerationSchema();

    const url = new URL(req.url);
    const sortBy = url.searchParams.get('sort') || 'recent';
    const filterCategory = url.searchParams.get('category') || 'all';

    let query = `
      SELECT 
        s.id,
        s.user_id,
        s.text,
        s.category,
        s.name,
        s.phone,
        s.created_at,
        s.status,
        u.username AS author,
        u.class AS author_class,
        COALESCE(SUM(CASE WHEN sv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN sv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) AS downvotes,
        uv.vote_type AS user_vote
      FROM submissions s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN submission_votes sv ON s.id = sv.submission_id
      LEFT JOIN submission_votes uv ON s.id = uv.submission_id AND uv.user_id = ?
      WHERE s.status IN ('approved', 'pending')
    `;

    const params: (number | string)[] = [session.userId];

    if (filterCategory !== 'all') {
      query += ' AND s.category = ?';
      params.push(filterCategory);
    }

    query += ' GROUP BY s.id, s.user_id, s.text, s.category, s.name, s.phone, s.created_at, s.status, u.username, u.class, uv.vote_type';

    switch (sortBy) {
      case 'upvotes':
        query += ' ORDER BY upvotes DESC, s.created_at DESC';
        break;
      case 'downvotes':
        query += ' ORDER BY downvotes DESC, s.created_at DESC';
        break;
      case 'controversial':
        query += ' ORDER BY (upvotes + downvotes) DESC, ABS(upvotes - downvotes) ASC, s.created_at DESC';
        break;
      case 'oldest':
        query += ' ORDER BY s.created_at ASC';
        break;
      case 'recent':
      default:
        query += ' ORDER BY s.created_at DESC';
        break;
    }

    const conn = await getDbPool().getConnection();
    try {
      const [rows] = await conn.execute<RowDataPacket[]>(query, params);
      return NextResponse.json({ submissions: rows }, {
        headers: {
          // Avoid caching to ensure live updates
          'Cache-Control': 'no-store',
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('List submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
