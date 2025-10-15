'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createUser, deleteUser, updateUserPassword, updateUserRole } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getDbPool } from '@/lib/db';
import { ensureModerationSchema } from '@/lib/migrations';

export async function createUserAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'moderator')) redirect('/login');
  
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();
  
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  try {
    await createUser(username, password, 'user');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function deleteUserAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  
  const id = Number(formData.get('id'));
  if (!id) {
    throw new Error('User ID is required');
  }
  
  try {
    await deleteUser(id);
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function approveSubmissionAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'moderator')) redirect('/login');
  await ensureModerationSchema();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Submission ID is required');
  const conn = await getDbPool().getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      "UPDATE submissions SET status='approved', approved_by=?, approved_at=NOW(), deleted_by=NULL, deleted_at=NULL WHERE id=?",
      [session.userId, id]
    );
    await conn.execute(
      "INSERT INTO submission_audit (submission_id, action, actor_user_id) VALUES (?, 'approve', ?)",
      [id, session.userId]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  revalidatePath('/admin');
}

export async function deleteSubmissionAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'moderator')) redirect('/login');
  await ensureModerationSchema();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Submission ID is required');
  const conn = await getDbPool().getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      "UPDATE submissions SET status='deleted', deleted_by=?, deleted_at=NOW() WHERE id=?",
      [session.userId, id]
    );
    await conn.execute(
      "INSERT INTO submission_audit (submission_id, action, actor_user_id) VALUES (?, 'delete', ?)",
      [id, session.userId]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  revalidatePath('/admin');
}

export async function restoreSubmissionAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'moderator')) redirect('/login');
  await ensureModerationSchema();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Submission ID is required');
  const conn = await getDbPool().getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      "UPDATE submissions SET status='pending', approved_by=NULL, approved_at=NULL, deleted_by=NULL, deleted_at=NULL WHERE id=?",
      [id]
    );
    await conn.execute(
      "INSERT INTO submission_audit (submission_id, action, actor_user_id) VALUES (?, 'restore', ?)",
      [id, session.userId]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  revalidatePath('/admin');
}


// Admin-only: update user password
export async function updateUserPasswordAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  const id = Number(formData.get('id'));
  const password = String(formData.get('password') || '').trim();
  if (!id || !password) throw new Error('User ID and new password are required');
  await updateUserPassword(id, password);
  revalidatePath('/admin');
}

// Admin-only: update user role
export async function updateUserRoleAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  const id = Number(formData.get('id'));
  const role = String(formData.get('role') || '').trim();
  if (!id || !['user','moderator','admin'].includes(role)) throw new Error('Invalid role update');
  await updateUserRole(id, role as 'user' | 'moderator' | 'admin');
  revalidatePath('/admin');
}

// Admin-only: ban user
export async function banUserAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  const userId = Number(formData.get('user_id'));
  const reason = String(formData.get('reason') || '').trim() || null;
  const expiresRaw = String(formData.get('expires_at') || '').trim();
  let expires_at: string | null = null;
  if (expiresRaw) {
    const d = new Date(expiresRaw);
    if (!isNaN(d.getTime())) {
      expires_at = d.toISOString().slice(0, 19).replace('T', ' ');
    }
  }
  const conn = getDbPool();
  await conn.execute(
    'INSERT INTO banned_users (user_id, reason, expires_at, created_by) VALUES (?, ?, ?, ?)',
    [userId, reason, expires_at, session.userId]
  );
  revalidatePath('/admin');
}

export async function unbanUserAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  const userId = Number(formData.get('user_id'));
  const conn = getDbPool();
  await conn.execute('DELETE FROM banned_users WHERE user_id = ?', [userId]);
  revalidatePath('/admin');
}

// Admin-only: ban IP
export async function banIpAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  const ip = String(formData.get('ip') || '').trim();
  if (!ip) throw new Error('IP is required');
  const reason = String(formData.get('reason') || '').trim() || null;
  const expiresRaw = String(formData.get('expires_at') || '').trim();
  let expires_at: string | null = null;
  if (expiresRaw) {
    const d = new Date(expiresRaw);
    if (!isNaN(d.getTime())) {
      expires_at = d.toISOString().slice(0, 19).replace('T', ' ');
    }
  }
  const conn = getDbPool();
  await conn.execute(
    `INSERT INTO banned_ips (ip, reason, expires_at, created_by) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE reason=VALUES(reason), expires_at=VALUES(expires_at), created_by=VALUES(created_by), created_at=CURRENT_TIMESTAMP`,
    [ip, reason, expires_at, session.userId]
  );
  revalidatePath('/admin');
}

export async function unbanIpAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  const ip = String(formData.get('ip') || '').trim();
  const conn = getDbPool();
  await conn.execute('DELETE FROM banned_ips WHERE ip = ?', [ip]);
  revalidatePath('/admin');
}
