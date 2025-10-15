import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';
import { ensureModerationSchema } from '@/lib/migrations';
import { CATEGORIES } from '@/lib/constants';
import FancyHeading from '@/components/ui/FancyHeading';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import MotionFade from '@/components/ui/MotionFade';
import TiltCard from '@/components/ui/TiltCard';
import SubmissionForm from './SubmissionForm';
import type { ResultSetHeader } from 'mysql2';
import { Info, Shield, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function submitAction(formData: FormData) {
  'use server';
  const session = await getSession();
  if (!session) redirect('/login');
  const text = String(formData.get('text') || '').slice(0, 2000);
  const name = String(formData.get('name') || '') || null;
  const phone = String(formData.get('phone') || '') || null;
  let category = String(formData.get('category') || 'Allgemein');
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    category = 'Allgemein';
  }
  if (!text.trim()) return;

  // Ensure schema exists (status columns + submission_audit)
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
  searchParams?: Promise<{ success?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/login');
  const sp = searchParams ? await searchParams : undefined;
  const isSuccess = sp?.success === '1';

  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Ambient background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-400/25 via-indigo-500/15 to-sky-400/25 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25 blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <FancyHeading
          center
          subtitle="Schick uns deinen Beitrag fürs Jahrbuch – persönlich, kreativ oder ganz sachlich. Wir kümmern uns um den Rest."
        >
          Phase 1 – Einsenden
        </FancyHeading>

        {isSuccess && (
          <MotionFade>
            <GlassCard
              fade={false}
              className="mb-8 bg-[linear-gradient(180deg,rgba(22,163,74,0.08),rgba(22,163,74,0.02))]"
              header={
                <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">Danke für deinen Beitrag!</h3>
                </div>
              }
            >
              <p className="text-sm text-base-muted">
                Dein Text wurde gespeichert. Du kannst gerne noch einen weiteren Beitrag einsenden.
              </p>
              <div className="pt-4">
                <GlowButton as="a" href="/" variant="secondary">
                  Zur Startseite
                </GlowButton>
              </div>
            </GlassCard>
          </MotionFade>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formular */}
          <div className="lg:col-span-2">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-base-strong">Dein Beitrag</h3>
                    <p className="text-sm text-base-muted">Max. 2000 Zeichen. Du kannst optional Name und Telefon hinterlassen.</p>
                  </div>
                </div>
              }
              footer={
                <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-base-muted">
                  <div className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-600" />
                    <span>Wir behandeln deine Angaben vertraulich.</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Danke fürs Mitmachen! 💙</span>
                  </div>
                </div>
              }
            >
              {/* Client-Form mit Zeichenzähler & Loading */}
              <SubmissionForm action={submitAction} />
            </GlassCard>
          </div>

          {/* Hinweise / Inspiration */}
          <div className="lg:col-span-1">
            <TiltCard>
              <GlassCard
                className="bg-[linear-gradient(180deg,rgba(99,102,241,0.08),rgba(99,102,241,0.02))]"
                header={
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                      <Info className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-base-strong">Tipps</h3>
                  </div>
                }
                hover
              >
                <ul className="space-y-3 text-sm text-base-muted">
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-indigo-600">•</span>
                    Schreib so, wie du es deinen Freund:innen erzählen würdest.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-indigo-600">•</span>
                    Nenne Namen nur, wenn alle damit einverstanden sind.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-indigo-600">•</span>
                    Kein Stress: Kurze Beiträge sind genauso willkommen!
                  </li>
                </ul>

                <MotionFade delay={0.08} className="mt-6">
                  <div className="rounded-2xl p-4 bg-white/60 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10">
                    <p className="text-sm text-base-strong mb-1">Transparenz</p>
                    <p className="text-sm text-base-muted">
                      Beiträge werden vor der Veröffentlichung kurz gesichtet –
                      nur für Rechtschreibung und Inhalt.
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
