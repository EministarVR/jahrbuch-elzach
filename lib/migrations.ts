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
        console.error('Failed to alter submissions table:', e);
      }
    }

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

    return ok;
  } finally {
    conn.release();
  }
}
