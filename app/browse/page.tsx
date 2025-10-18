import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import { ensureModerationSchema, ensureCommentsSchema } from '@/lib/migrations';
import { CATEGORIES } from '@/lib/constants';
import BrowseClient from './BrowseClient';
import type { RowDataPacket } from 'mysql2';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export interface Submission extends RowDataPacket {
  id: number;
  user_id: number;
  text: string;
  category: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote: 'upvote' | 'downvote' | null;
  author: string;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams?: Promise<{ sort?: string; category?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  await ensureModerationSchema();
  await ensureCommentsSchema();

  const sp = searchParams ? await searchParams : undefined;
  const sortBy = sp?.sort || 'recent';
  const filterCategory = sp?.category || 'all';

  const conn = await getDbPool().getConnection();
  try {
    // Submissions mit Vote-Counts abrufen
    let query = `
      SELECT 
        s.id,
        s.user_id,
        s.text,
        s.category,
        s.name,
        s.phone,
        s.created_at,
        s.status,
        u.username AS author,
        COALESCE(SUM(CASE WHEN sv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN sv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) AS downvotes,
        uv.vote_type AS user_vote
      FROM submissions s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN submission_votes sv ON s.id = sv.submission_id
      LEFT JOIN submission_votes uv ON s.id = uv.submission_id AND uv.user_id = ?
      WHERE s.status IN ('approved', 'pending')
    `;

    const params: (number | string)[] = [session.userId];

    if (filterCategory !== 'all') {
      query += ' AND s.category = ?';
      params.push(filterCategory);
    }

    query += ' GROUP BY s.id, s.user_id, s.text, s.category, s.name, s.phone, s.created_at, s.status, u.username, uv.vote_type';

    // Sortierung
    switch (sortBy) {
      case 'upvotes':
        query += ' ORDER BY upvotes DESC, s.created_at DESC';
        break;
      case 'downvotes':
        query += ' ORDER BY downvotes DESC, s.created_at DESC';
        break;
      case 'controversial':
        query += ' ORDER BY (upvotes + downvotes) DESC, ABS(upvotes - downvotes) ASC, s.created_at DESC';
        break;
      case 'oldest':
        query += ' ORDER BY s.created_at ASC';
        break;
      case 'recent':
      default:
        query += ' ORDER BY s.created_at DESC';
        break;
    }

    const [submissions] = await conn.execute<Submission[]>(query, params);

    const isModerator = session.role === 'moderator' || session.role === 'admin';

    return (
      <div className="relative min-h-dvh bg-gradient-to-br from-[#faf8f5] via-[#faf4ed] to-[#f5ede3] dark:from-[#1a1714] dark:via-[#221e1a] dark:to-[#1a1714] overflow-hidden">
        {/* Subtile Hintergrundeffekte */}
        <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#d97757]/8 dark:bg-[#e89a7a]/6 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#7a9b88]/8 dark:bg-[#8faf9d]/6 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 border border-[#7a9b88]/20 dark:border-[#8faf9d]/20 shadow-lg shadow-[#7a9b88]/10 dark:shadow-[#8faf9d]/10">
              <BookOpen className="h-4 w-4 text-[#7a9b88] dark:text-[#8faf9d]" />
              <span className="text-xs font-medium tracking-wide uppercase text-[#7a9b88] dark:text-[#8faf9d]">
                Community
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-4 bg-gradient-to-br from-[#2a2520] to-[#6b635a] dark:from-[#f5f1ed] dark:to-[#b8aea5] bg-clip-text text-transparent">
              Alle Beiträge
            </h1>
            <p className="text-lg text-[#6b635a] dark:text-[#b8aea5] max-w-2xl mx-auto">
              Entdecke die Beiträge der Schüler, vote für deine Favoriten und teile deine Meinung.
            </p>
          </div>

          <BrowseClient
            initialSubmissions={submissions}
            isModerator={isModerator}
            currentUserId={session.userId}
            currentSort={sortBy}
            currentCategory={filterCategory}
            categories={['all', ...CATEGORIES]}
          />
        </div>
      </div>
    );
  } finally {
    conn.release();
  }
}
