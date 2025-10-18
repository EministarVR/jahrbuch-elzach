import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only moderators and admins can delete comments
    if (session.role !== 'moderator' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { commentId } = body;

    if (!commentId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const conn = await getDbPool().getConnection();
    try {
      await conn.query(
        `UPDATE comments SET status = 'deleted', deleted_by = ?, deleted_at = NOW() WHERE id = ?`,
        [session.userId, commentId]
      );

      return NextResponse.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

