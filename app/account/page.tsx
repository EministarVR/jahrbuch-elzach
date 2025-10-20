import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import GlassCard from '@/components/ui/GlassCard';
import AccountFormClient from './AccountFormClient';
import { ensureUserProfileColumns } from '@/lib/migrations';
import { User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await ensureUserProfileColumns();

  const rows = await query<{ id: number; username: string; class: string | null; bio: string | null; avatar_url: string | null }[]>(
    'SELECT id, username, class, bio, avatar_url FROM users WHERE id = ? LIMIT 1',
    [session.userId]
  );
  const me = rows[0];
  if (!me) redirect('/login');

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <GlassCard
          header={
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]">
                <User className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#f5f1ed]">Mein Account</h3>
                <p className="text-sm text-[#b8aea5]">Verwalte deine Bio und dein Profilbild</p>
              </div>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-xl bg-[#2a2520]/50 p-4 border border-[#e89a7a]/10">
              <div className="text-sm text-[#b8aea5]">
                Angemeldet als <span className="text-[#f5f1ed] font-medium">{me.username}</span>
                {me.class ? (
                  <> in Klasse <span className="text-[#f5f1ed] font-medium">{me.class}</span></>
                ) : null}
              </div>
            </div>

            <AccountFormClient initialBio={me.bio} initialAvatarUrl={me.avatar_url} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
