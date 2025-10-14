import bcrypt from 'bcrypt';
import { query } from './db';

export type DbUser = {
  id: number;
  username: string;
  password_hash: string;
  role: 'user' | 'admin';
};

export async function findUserByUsername(username: string): Promise<DbUser | null> {
  const rows = await query<DbUser[]>(
    'SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] ?? null;
}

export async function createUser(username: string, password: string, role: 'user' | 'admin' = 'user') {
  const password_hash = await bcrypt.hash(password, 10);
  await query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [
    username,
    password_hash,
    role,
  ]);
}

export async function deleteUser(userId: number) {
  await query('DELETE FROM users WHERE id = ?', [userId]);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}



