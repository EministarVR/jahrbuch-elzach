import FancyHeading from "@/components/ui/FancyHeading";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AccessDeniedPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50 to-white md:from-indigo-50/70 dark:from-slate-950 dark:to-slate-900">
      {/* Ambient background */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-400/25 via-indigo-500/15 to-sky-400/25 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25 blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/30" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <FancyHeading center subtitle="Du hast keine Berechtigung, diese Seite zu öffnen.">
          Zugriff verweigert
        </FancyHeading>

        <div className="mt-8">
          <GlassCard hover>
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <div className="text-base text-base-muted text-center max-w-prose">
                <p>
                  Falls du Moderator bist: Manche Bereiche sind nur für Admins sichtbar (z. B. die Benutzerverwaltung).
                </p>
                <p className="mt-2">
                  Falls du ein normaler User bist: Das Admin-Dashboard ist nur für Moderatoren, Admins und Schülersprecher freigeschaltet.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <GlowButton as="a" href="/admin" variant="primary" className="h-11 px-5">Zum Admin</GlowButton>
                <GlowButton as="a" href="/" variant="secondary" className="h-11 px-5">Zur Startseite</GlowButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

