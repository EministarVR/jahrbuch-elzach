import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { commentId, reason } = body;

    if (!commentId || !reason?.trim()) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const conn = await getDbPool().getConnection();
    try {
      // Check if already reported by this user
      const [existing] = await conn.query<RowDataPacket[]>(
        `SELECT id FROM comment_reports WHERE comment_id = ? AND reporter_user_id = ? AND status = 'pending'`,
        [commentId, session.userId]
      );

      if (existing.length > 0) {
        return NextResponse.json({ error: 'Already reported' }, { status: 400 });
      }

      await conn.query(
        `INSERT INTO comment_reports (comment_id, reporter_user_id, reason) VALUES (?, ?, ?)`,
        [commentId, session.userId, reason.trim()]
      );

      return NextResponse.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Failed to report comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
