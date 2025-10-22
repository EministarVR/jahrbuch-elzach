import { getDbPool } from './db';
import { getSession, clearSession, type SessionPayload } from './session';
import { ensureModerationSchema } from './migrations';
import type { RowDataPacket } from 'mysql2/promise';

export type AuthState = {
  session: SessionPayload | null;
  exists: boolean;
  banned: boolean;
  reason?: string | null;
  expires_at?: string | null;
};

export async function getAuthState(): Promise<AuthState> {
  const session = await getSession();
  if (!session) {
    return { session: null, exists: false, banned: false };
  }

  // Ensure moderation schema so banned_users table exists before querying
  await ensureModerationSchema().catch(() => {});

  const conn = await getDbPool().getConnection();
  try {
    type UserIdRow = RowDataPacket & { id: number };
    const [userRows] = await conn.execute<UserIdRow[]>(
      'SELECT id FROM users WHERE id = ? LIMIT 1',
      [session.userId]
    );
    if (userRows.length === 0) {
      // user removed
      return { session, exists: false, banned: false };
    }

    // Check active ban (best-effort: ignore errors if table/query missing)
    try {
      type BanRow = RowDataPacket & { reason: string | null; expires_at: Date | string | null };
      const [banRows] = await conn.execute<BanRow[]>(
        `SELECT reason, expires_at FROM banned_users WHERE user_id = ? AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY id DESC LIMIT 1`,
        [session.userId]
      );
      if (banRows.length > 0) {
        const ban = banRows[0];
        const expiresIso = (() => {
          const v = ban.expires_at;
          if (!v) return null;
          if (v instanceof Date) return v.toISOString();
          const d = new Date(v);
          return isNaN(d.getTime()) ? null : d.toISOString();
        })();
        return {
          session,
          exists: true,
          banned: true,
          reason: ban.reason ?? null,
          expires_at: expiresIso,
        };
      }
    } catch {
      // ignore ban query errors
    }

    return { session, exists: true, banned: false };
  } finally {
    conn.release();
  }
}

export async function ensureNotBanned(): Promise<{ ok: true; session: SessionPayload } | { ok: false; status: 401 | 403; reason: string }> {
  const state = await getAuthState();
  if (!state.session) {
    await clearSession();
    return { ok: false, status: 401, reason: 'Unauthorized' };
  }
  if (!state.exists) {
    await clearSession();
    return { ok: false, status: 401, reason: 'User not found' };
  }
  if (state.banned) return { ok: false, status: 403, reason: 'Banned' };
  return { ok: true, session: state.session };
}
