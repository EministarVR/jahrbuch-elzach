'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createUser, deleteUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getDbPool } from '@/lib/db';
import { ensureModerationSchema } from '@/lib/migrations';

export async function createUserAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');
  
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
  if (!session || session.role !== 'admin') redirect('/login');
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
  if (!session || session.role !== 'admin') redirect('/login');
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
  if (!session || session.role !== 'admin') redirect('/login');
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
