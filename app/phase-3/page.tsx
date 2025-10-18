import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { canAccessPhase } from "@/lib/phases";
import GlassCard from "@/components/ui/GlassCard";
import { Palette, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Phase3Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  const canAccess = await canAccessPhase("phase-3", session.role);

  if (!canAccess) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714] flex items-center justify-center">
        <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#8faf9d]/6 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-[#e89a7a]/5 blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <GlassCard>
            <div className="py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e89a7a]/10 text-[#e89a7a] mb-6">
                <Lock className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-[#f5f1ed] mb-4">
                Phase 3 ist noch nicht verfügbar
              </h1>
              <p className="text-lg text-[#b8aea5] mb-8">
                Die Gestaltungsphase wurde noch nicht freigeschaltet. Bitte warte
                auf weitere Informationen.
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
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714] flex items-center justify-center">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#8faf9d]/6 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-[#e89a7a]/5 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#8faf9d]/10 text-[#8faf9d] mb-6">
            <Palette className="h-10 w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f5f1ed] mb-3">
            Phase 3 – Gestalten
          </h1>
          <p className="text-lg text-[#b8aea5]">
            Die Gestaltungsphase startet bald
          </p>
        </div>

        <GlassCard hover>
          <div className="py-8 space-y-4">
            <p className="text-[#b8aea5]">
              Diese Phase ist in Planung. Hier wird das Jahrbuch-Team alle
              ausgewählten Beiträge liebevoll zu einem Jahrbuch zusammenstellen.
            </p>
            <p className="text-sm text-[#b8aea5]">
              Weitere Informationen folgen!
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
