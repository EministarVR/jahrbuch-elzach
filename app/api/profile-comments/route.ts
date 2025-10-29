import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import { ensureProfileCommentsTable } from '@/lib/migrations';
import type { RowDataPacket } from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Public endpoint: allow reading comments without authentication
  await ensureProfileCommentsTable();

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('userId') || searchParams.get('profileUserId') || searchParams.get('id');
  const profileUserId = Number(idParam || 0);
  if (!profileUserId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const conn = await getDbPool().getConnection();
  try {
    const [rows] = await conn.query<(RowDataPacket & { id: number; profile_user_id: number; author_user_id: number; text: string; status: 'active' | 'deleted'; created_at: Date | string; author_username: string; author_avatar_url: string | null; })[]>(
      `SELECT pc.id, pc.profile_user_id, pc.author_user_id, pc.text, pc.status, pc.created_at,
             au.username AS author_username, au.avatar_url AS author_avatar_url
        FROM profile_comments pc
        JOIN users au ON au.id = pc.author_user_id
       WHERE pc.profile_user_id = ? AND pc.status = 'active'
       ORDER BY pc.created_at DESC
       LIMIT 200`,
      [profileUserId]
    );
    return NextResponse.json({ comments: rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('Profile comments GET error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await ensureProfileCommentsTable();

  type Body = { profile_user_id?: number; text?: string };
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const profileUserId = Number(body.profile_user_id || 0);
  if (!profileUserId) return NextResponse.json({ error: 'Missing profile_user_id' }, { status: 400 });
  const raw = String(body.text || '').trim();
  const text = raw.slice(0, 1000);
  if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

  const conn = await getDbPool().getConnection();
  try {
    await conn.query(
      'INSERT INTO profile_comments (profile_user_id, author_user_id, text) VALUES (?, ?, ?)',
      [profileUserId, session.userId, text]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Profile comments POST error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
