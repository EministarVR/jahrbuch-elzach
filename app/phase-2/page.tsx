import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { canAccessPhase } from "@/lib/phases";
import { ensurePollsTable, ensurePollSubmissionsTable } from "@/lib/migrations";
import { query } from "@/lib/db";
import GlassCard from "@/components/ui/GlassCard";
import { BarChart3, Lock, CheckCircle2 } from "lucide-react";
import PollForm from "./PollForm";

export const dynamic = "force-dynamic";

export default async function Phase2Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  await ensurePollsTable();
  await ensurePollSubmissionsTable();

  const canAccess = await canAccessPhase("phase-2", session.role);

  if (!canAccess) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
        <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
          <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <GlassCard>
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e89a7a]/10 text-[#e89a7a] mb-6">
                <Lock className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-[#f5f1ed] mb-4">
                Phase 2 ist noch nicht verfügbar
              </h1>
              <p className="text-lg text-[#b8aea5] mb-8">
                Die Abstimmungsphase wurde noch nicht freigeschaltet. Bitte warte auf weitere Informationen.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#d97757] to-[#c96846] text-white font-medium hover:from-[#e89a7a] hover:to-[#d97757] transition-all"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Prüfe ob User bereits abgestimmt hat
  const hasSubmitted = await query<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM poll_submissions WHERE user_id = ?',
    [session.userId]
  );

  const alreadySubmitted = hasSubmitted[0]?.count > 0;

  if (alreadySubmitted) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
        <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
          <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <GlassCard>
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#66bb6a]/10 text-[#66bb6a] mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-[#f5f1ed] mb-4">
                Du hast bereits abgestimmt
              </h1>
              <p className="text-lg text-[#b8aea5] mb-8">
                Deine Stimme wurde bereits erfolgreich abgegeben. Du kannst nur einmal an der Abstimmung teilnehmen.
              </p>
              <p className="text-sm text-[#b8aea5] mb-8">
                Falls das ein Fehler ist, melde dich bitte bei den Schülersprechern.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#d97757] to-[#c96846] text-white font-medium hover:from-[#e89a7a] hover:to-[#d97757] transition-all"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-12" style={{ minWidth: 0 }}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#66bb6a]/10 border border-[#66bb6a]/20">
            <BarChart3 className="h-4 w-4 text-[#66bb6a]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#66bb6a]">
              Phase 2
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f1ed] mb-4">
            Abstimmungen
          </h1>
          <p className="text-lg text-[#b8aea5] max-w-2xl mx-auto">
            Deine Meinung zählt! Hilf uns, das beste Jahrbuch aller Zeiten zu gestalten.
          </p>
        </div>

        <PollForm userId={session.userId} />
      </div>
    </div>
  );
}
