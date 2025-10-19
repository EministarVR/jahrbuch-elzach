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

    // 4) Ensure roles enum includes 'moderator' and 'admin' (no automatic demotion of admins)
    try {
      await conn.query(
        `ALTER TABLE users MODIFY COLUMN role ENUM('user','moderator','admin') NOT NULL DEFAULT 'user'`
      );
    } catch (e) {
      // if fails, we still continue but log
      ok = false;
      console.error('Failed to update users.role enum:', e);
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

    // 6) Voting tables
    const hasVotes = await tableExists(conn, 'submission_votes');
    if (!hasVotes) {
      try {
        await conn.query(
          `CREATE TABLE submission_votes (
             id INT AUTO_INCREMENT PRIMARY KEY,
             submission_id INT NOT NULL,
             user_id INT NOT NULL,
             vote_type ENUM('upvote','downvote') NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
             UNIQUE KEY unique_user_submission (user_id, submission_id),
             FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
           )`
        );
      } catch (e) {
        ok = false;
        console.error('Failed to create submission_votes table:', e);
      }
    }

    // 7) Reports table
    const hasReports = await tableExists(conn, 'submission_reports');
    if (!hasReports) {
      try {
        await conn.query(
          `CREATE TABLE submission_reports (
             id INT AUTO_INCREMENT PRIMARY KEY,
             submission_id INT NOT NULL,
             reporter_user_id INT NOT NULL,
             reason TEXT NOT NULL,
             status ENUM('pending','reviewed','dismissed') NOT NULL DEFAULT 'pending',
             reviewed_by INT NULL,
             reviewed_at TIMESTAMP NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
             FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE CASCADE,
             FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
           )`
        );
      } catch (e) {
        ok = false;
        console.error('Failed to create submission_reports table:', e);
      }
    }

    return ok;
  } finally {
    conn.release();
  }
}


export async function ensureUserClassColumn(): Promise<boolean> {
  const conn = await getDbPool().getConnection();
  try {
    const hasClass = await columnExists(conn, 'users', 'class');

    if (!hasClass) {
      await conn.query(
        `ALTER TABLE users ADD COLUMN class VARCHAR(50) NULL AFTER role`
      );
    }
    return true;
  } catch (e) {
    console.error('Failed to ensure users.class column:', e);
    return false;
  } finally {
    conn.release();
  }
}

export async function ensureCommentsSchema(): Promise<boolean> {
  // Comments werden jetzt über schema.sql verwaltet
  // Diese Funktion prüft nur noch, ob die Tabellen existieren
  const conn = await getDbPool().getConnection();
  try {
    const hasComments = await tableExists(conn, 'comments');
    const hasCommentVotes = await tableExists(conn, 'comment_votes');
    const hasCommentReports = await tableExists(conn, 'comment_reports');

    if (!hasComments || !hasCommentVotes || !hasCommentReports) {
      console.warn('Comment tables do not exist. Please run schema.sql');
      return false;
    }

    return true;
  } catch (e) {
    console.error('Failed to check comment tables:', e);
    return false;
  } finally {
    conn.release();
  }
}

export async function ensurePhaseSettings(): Promise<boolean> {
  // Phase settings werden jetzt über schema.sql verwaltet
  // Diese Funktion prüft nur noch, ob die Tabelle existiert
  const conn = await getDbPool().getConnection();
  try {
    const hasTable = await tableExists(conn, 'phase_settings');
    if (!hasTable) {
      console.warn('phase_settings table does not exist. Please run schema.sql');
    }
    return hasTable;
  } catch (e) {
    console.error('Failed to check phase_settings table:', e);
    return false;
  } finally {
    conn.release();
  }
}

export async function ensurePollsTable(): Promise<boolean> {
  // Poll responses werden jetzt über schema.sql verwaltet
  // Diese Funktion prüft nur noch, ob die Tabelle existiert
  const conn = await getDbPool().getConnection();
  try {
    const hasTable = await tableExists(conn, 'poll_responses');
    if (!hasTable) {
      console.warn('poll_responses table does not exist. Please run schema.sql');
    }
    return hasTable;
  } catch (e) {
    console.error('Failed to check poll_responses table:', e);
    return false;
  } finally {
    conn.release();
  }
}

export async function ensurePollSubmissionsTable(): Promise<boolean> {
  const conn = await getDbPool().getConnection();
  try {
    const hasTable = await tableExists(conn, 'poll_submissions');
    if (!hasTable) {
      try {
        await conn.query(
          `CREATE TABLE poll_submissions (
             id INT AUTO_INCREMENT PRIMARY KEY,
             user_id INT NOT NULL,
             submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             UNIQUE KEY unique_user (user_id),
             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
           )`
        );
        return true;
      } catch (e) {
        console.error('Failed to create poll_submissions table:', e);
        return false;
      }
    }
    return true;
  } catch (e) {
    console.error('Failed to check poll_submissions table:', e);
    return false;
  } finally {
    conn.release();
  }
}
