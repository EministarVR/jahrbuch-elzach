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

export async function createUser(username: string, password: string, role: 'user' | 'moderator' | 'admin' = 'user') {
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

export async function updateUserPassword(userId: number, newPassword: string) {
  const password_hash = await bcrypt.hash(newPassword, 10);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, userId]);
}

export async function updateUserRole(userId: number, role: 'user' | 'moderator' | 'admin') {
  await query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
}



