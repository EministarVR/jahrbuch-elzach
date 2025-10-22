import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import { ensureModerationSchema } from '@/lib/migrations';
import { CATEGORIES } from '@/lib/constants';
import { getAuthState } from '@/lib/auth';
import { canAccessPhase } from '@/lib/phases';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import MotionFade from '@/components/ui/MotionFade';
import TiltCard from '@/components/ui/TiltCard';
import SubmissionForm from './SubmissionForm';
import type { ResultSetHeader } from 'mysql2';
import { Shield, Send, FileText, CheckCircle2, Lightbulb } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function submitAction(formData: FormData) {
  'use server';
  const session = await getSession();
  if (!session) redirect('/login');
  const auth = await getAuthState();
  if (auth.banned) redirect('/phase-1?banned=1');
  const text = String(formData.get('text') || '').slice(0, 2000);
  const name = String(formData.get('name') || '') || null;
  const phone = String(formData.get('phone') || '') || null;
  let category = String(formData.get('category') || 'Allgemein');
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    category = 'Allgemein';
  }
  if (!text.trim()) return;

  await ensureModerationSchema();

  const conn = await getDbPool().getConnection();
  try {
    await conn.beginTransaction();
    const [res] = await conn.execute<ResultSetHeader>(
      'INSERT INTO submissions (user_id, text, category, name, phone) VALUES (?, ?, ?, ?, ?)',
      [session.userId, text, category, name, phone]
    );
    const submissionId = res.insertId;
    if (submissionId) {
      await conn.execute(
        "INSERT INTO submission_audit (submission_id, action, actor_user_id) VALUES (?, 'create', ?)",
        [submissionId, session.userId]
      );
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  redirect('/phase-1?success=1');
}

export default async function Phase1Page({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; banned?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  // Prüfe ob der Benutzer auf diese Phase zugreifen darf
  const canAccess = await canAccessPhase('phase-1', session.role);
  if (!canAccess) {
    redirect('/unauthorized');
  }

  const sp = searchParams ? await searchParams : undefined;
  const isSuccess = sp?.success === '1';
  const isBanned = sp?.banned === '1';

  return (
    <div className="relative min-h-dvh bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714] overflow-hidden">
      {/* Subtile Hintergrundeffekte */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#8faf9d]/10 border border-[#8faf9d]/20">
            <Send className="h-4 w-4 text-[#8faf9d]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#8faf9d]">
              Jetzt aktiv
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f1ed] mb-4">
            Phase 1 – Einsenden
          </h1>
          <p className="text-lg text-[#b8aea5] max-w-2xl mx-auto">
            Schick uns deinen Beitrag fürs Jahrbuch – persönlich, kreativ oder ganz sachlich. Wir kümmern uns um den Rest.
          </p>
        </div>

        {isSuccess && (
          <MotionFade>
            <GlassCard
              fade={false}
              className="mb-8"
              header={
                <div className="flex items-center gap-3 text-[#8faf9d]">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8faf9d]/10">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#f5f1ed]">Danke für deinen Beitrag!</h3>
                </div>
              }
            >
              <p className="text-sm text-[#b8aea5] mb-4">
                Dein Text wurde gespeichert. Du kannst gerne noch einen weiteren Beitrag einsenden.
              </p>
              <GlowButton as="a" href="/" variant="secondary">
                Zur Startseite
              </GlowButton>
            </GlassCard>
          </MotionFade>
        )}

        {isBanned && (
          <MotionFade>
            <GlassCard
              fade={false}
              className="mb-8 border-red-500/30"
              header={
                <div className="flex items-center gap-3 text-red-300">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                    <Shield className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#f5f1ed]">Dein Account ist gesperrt</h3>
                </div>
              }
            >
              <p className="text-sm text-[#b8aea5]">Du kannst aktuell keine Beiträge einsenden. Bitte wende dich an einen Moderator oder Administrator.</p>
            </GlassCard>
          </MotionFade>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formular */}
          <div className="lg:col-span-2">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f1ed]">Dein Beitrag</h3>
                    <p className="text-sm text-[#b8aea5]">Max. 2000 Zeichen. Du kannst optional Name und Telefon hinterlassen.</p>
                  </div>
                </div>
              }
              footer={
                <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-[#b8aea5]">
                  <div className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#8faf9d]" />
                    <span>Deine Angaben werden auf einer Seite zum Voting angezeigt. Wenn du das nicht möchtest, wende dich an Emin (Schulsprecher)</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Send className="h-4 w-4 text-[#e89a7a]" />
                    <span>Danke fürs Mitmachen!</span>
                  </div>
                </div>
              }
            >
              <SubmissionForm action={submitAction} />
            </GlassCard>
          </div>

          {/* Hinweise / Inspiration */}
          <div className="lg:col-span-1">
            <TiltCard>
              <GlassCard
                header={
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8faf9d]/10 text-[#8faf9d]">
                      <Lightbulb className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-[#f5f1ed]">Tipps</h3>
                  </div>
                }
                hover
              >
                <ul className="space-y-3 text-sm text-[#b8aea5]">
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-[#e89a7a]">•</span>
                    Schreib so, wie du es deinen Freund:innen erzählen würdest.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-[#e89a7a]">•</span>
                    Nenne Namen nur, wenn alle damit einverstanden sind.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-[#e89a7a]">•</span>
                    Kein Stress: Kurze Beiträge sind genauso willkommen!
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-[#e89a7a]">•</span>
                    Fragen oder Probleme? Wende dich an die Schulsprecher:innen (SMV).
                  </li>
                </ul>

                <MotionFade delay={0.08} className="mt-6">
                  <div className="rounded-xl p-4 bg-[#8faf9d]/10 border border-[#8faf9d]/20">
                    <p className="text-sm font-semibold text-[#f5f1ed] mb-1">Transparenz</p>
                    <p className="text-sm text-[#b8aea5]">
                      Beiträge werden vor der Veröffentlichung kurz gesichtet – nur für Rechtschreibung und Inhalt.
                    </p>
                  </div>
                </MotionFade>
              </GlassCard>
            </TiltCard>
          </div>
        </div>
      </div>
    </div>
  );
}
