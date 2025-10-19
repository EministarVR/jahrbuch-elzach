import bcrypt from 'bcrypt';
import { query } from './db';

export type DbUser = {
  id: number;
  username: string;
  password_hash: string;
  role: 'user' | 'moderator' | 'admin';
};

export async function findUserByUsername(username: string): Promise<DbUser | null> {
  const rows = await query<DbUser[]>(
    'SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] ?? null;
}

export async function createUser(username: string, password: string, role: 'user' | 'moderator' | 'admin' = 'user', klass?: string | null) {
  const password_hash = await bcrypt.hash(password, 10);
  try {
    await query('INSERT INTO users (username, password_hash, password_plain, role, class) VALUES (?, ?, ?, ?, ?)', [
      username,
      password_hash,
      password,
      role,
      klass ?? null,
    ]);
  } catch (e: unknown) {
    // Fallback if class column doesn't exist (ältere DBs)
    if (typeof e === 'object' && e !== null) {
      const err = e as { code?: string; errno?: number };
      if (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054) {
        await query('INSERT INTO users (username, password_hash, password_plain, role) VALUES (?, ?, ?, ?)', [
          username,
          password_hash,
          password,
          role,
        ]);
        return;
      }
    }
    throw e;
  }
}

export async function deleteUser(userId: number) {
  await query('DELETE FROM users WHERE id = ?', [userId]);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function updateUserPassword(userId: number, newPassword: string) {
  const password_hash = await bcrypt.hash(newPassword, 10);
  await query('UPDATE users SET password_hash = ?, password_plain = ? WHERE id = ?', [password_hash, newPassword, userId]);
}

export async function updateUserRole(userId: number, role: 'user' | 'moderator' | 'admin') {
  await query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
}
