import { getDbPool } from './db';
import type { PoolConnection, RowDataPacket } from 'mysql2/promise';

interface CountRow extends RowDataPacket { c: number }

async function columnExists(conn: PoolConnection, table: string, column: string): Promise<boolean> {
  const [rows] = await conn.query<CountRow[]>(
    `SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return (rows[0]?.c ?? 0) > 0;
}

async function tableExists(conn: PoolConnection, table: string): Promise<boolean> {
  const [rows] = await conn.query<CountRow[]>(
    `SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table]
  );
  return (rows[0]?.c ?? 0) > 0;
}

export async function ensureModerationSchema(): Promise<boolean> {
  const conn = await getDbPool().getConnection();
  try {
    let ok = true;

    // 1) Ensure moderation fields on submissions
    const hasStatus = await columnExists(conn, 'submissions', 'status');
    if (!hasStatus) {
      try {
        await conn.query(
          `ALTER TABLE submissions
             ADD COLUMN status ENUM('pending','approved','deleted') NOT NULL DEFAULT 'pending',
             ADD COLUMN approved_by INT NULL,
             ADD COLUMN approved_at TIMESTAMP NULL,
             ADD COLUMN deleted_by INT NULL,
             ADD COLUMN deleted_at TIMESTAMP NULL`
        );
      } catch (e) {
        ok = false;
        console.error('Failed to alter submissions table (moderation fields):', e);
      }
    }

    // 2) Ensure category column on submissions
    const hasCategory = await columnExists(conn, 'submissions', 'category');
    if (!hasCategory) {
      try {
        await conn.query(
          `ALTER TABLE submissions
             ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'Allgemein' AFTER text`
        );
      } catch (e) {
        ok = false;
        console.error('Failed to alter submissions table (category):', e);
      }
    }

    // 3) Ensure submission_audit table exists
    const hasAudit = await tableExists(conn, 'submission_audit');
    if (!hasAudit) {
      try {
        await conn.query(
          `CREATE TABLE submission_audit (
             id INT AUTO_INCREMENT PRIMARY KEY,
             submission_id INT NOT NULL,
             action ENUM('create','approve','delete','restore') NOT NULL,
             actor_user_id INT NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (submission_id) REFERENCES submissions(id),
             FOREIGN KEY (actor_user_id) REFERENCES users(id)
           )`
        );
      } catch (e) {
        ok = false;
        console.error('Failed to create submission_audit table:', e);
      }
    }

    // 4) Extend roles: add 'moderator' and keep 'admin' for extended admin. Migrate old 'admin' -> 'moderator'.
    try {
      await conn.query(
        `ALTER TABLE users MODIFY COLUMN role ENUM('user','moderator','admin') NOT NULL DEFAULT 'user'`
      );
      // migrate existing entries labelled 'admin' (old admin) to 'moderator'
      await conn.query(`UPDATE users SET role='moderator' WHERE role='admin'`);
    } catch (e) {
      // if fails, we still continue but log
      ok = false;
      console.error('Failed to update users.role enum or migrate roles:', e);
    }

    // 5) Bans tables
    const hasBannedUsers = await tableExists(conn, 'banned_users');
    if (!hasBannedUsers) {
      try {
        await conn.query(
          `CREATE TABLE banned_users (
             id INT AUTO_INCREMENT PRIMARY KEY,
             user_id INT NOT NULL,
             reason VARCHAR(255) NULL,
             expires_at TIMESTAMP NULL,
             created_by INT NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (user_id) REFERENCES users(id),
             FOREIGN KEY (created_by) REFERENCES users(id)
           )`
        );
      } catch (e) {
        ok = false;
        console.error('Failed to create banned_users table:', e);
      }
    }

    const hasBannedIps = await tableExists(conn, 'banned_ips');
    if (!hasBannedIps) {
      try {
        await conn.query(
          `CREATE TABLE banned_ips (
             id INT AUTO_INCREMENT PRIMARY KEY,
             ip VARCHAR(64) NOT NULL,
             reason VARCHAR(255) NULL,
             expires_at TIMESTAMP NULL,
             created_by INT NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             UNIQUE KEY uniq_ip (ip),
             FOREIGN KEY (created_by) REFERENCES users(id)
           )`
        );
      } catch (e) {
        ok = false;
        console.error('Failed to create banned_ips table:', e);
      }
    }

    return ok;
  } finally {
    conn.release();
  }
}
