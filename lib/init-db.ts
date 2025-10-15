import { getDbPool } from './db';
import fs from 'fs/promises';
import path from 'path';

let initPromise: Promise<void> | null = null;

function parseSqlFile(sql: string): string[] {
  // Remove BOM, trim
  let content = sql.replace(/^\uFEFF/, '');
  // Remove -- line comments and /* */ block comments
  content = content
    .replace(/\/\*[^]*?\*\//g, '')
    .split(/\r?\n/)
    .map((line) => (line.trim().startsWith('--') ? '' : line))
    .join('\n');
  // Split by semicolons into statements, keeping CREATE/ALTER/INSERT/etc.
  const parts = content
    .split(/;\s*(?:\r?\n|$)/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts;
}

export async function ensureDatabase(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const pool = getDbPool();
    const conn = await pool.getConnection();
    try {
      // Test connection
      await conn.ping();

      // Load and execute schema.sql
      const schemaPath = path.join(process.cwd(), 'schema.sql');
      let file: string | null = null;
      try {
        file = await fs.readFile(schemaPath, 'utf8');
      } catch (e) {
        console.warn('[init-db] schema.sql konnte nicht gelesen werden:', e);
      }
      if (file) {
        const statements = parseSqlFile(file);
        for (const stmt of statements) {
          // Skip empty/defensive checks
          if (!stmt) continue;
          try {
            await conn.query(stmt);
          } catch (err) {
            // If statement fails but others succeed, continue; log error once.
            console.error('[init-db] SQL-Statement fehlgeschlagen:', stmt.slice(0, 80) + '...', err);
          }
        }
      }
    } finally {
      conn.release();
    }
  })();
  return initPromise;
}
