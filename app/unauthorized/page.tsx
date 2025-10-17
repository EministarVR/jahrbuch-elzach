import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#faf8f5] via-[#faf4ed] to-[#f5ede3] dark:from-[#1a1714] dark:via-[#221e1a] dark:to-[#1a1714] flex items-center justify-center">
      {/* Subtile Hintergrundeffekte */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#d97757]/8 dark:bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-[#7a9b88]/6 dark:bg-[#8faf9d]/5 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#c96846]/10 dark:bg-[#d97757]/10 text-[#c96846] dark:text-[#d97757] mb-6">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-3">
            Zugriff verweigert
          </h1>
          <p className="text-lg text-[#6b635a] dark:text-[#b8aea5]">
            Du hast keine Berechtigung, diese Seite zu öffnen.
          </p>
        </div>

        <GlassCard hover>
          <div className="py-8 space-y-6">
            <div className="space-y-3 text-[#6b635a] dark:text-[#b8aea5]">
              <p>
                <strong className="text-[#2a2520] dark:text-[#f5f1ed]">Falls du Moderator bist:</strong><br />
                Manche Bereiche sind nur für Admins sichtbar (z.B. die Benutzerverwaltung).
              </p>
              <p>
                <strong className="text-[#2a2520] dark:text-[#f5f1ed]">Falls du ein normaler User bist:</strong><br />
                Das Admin-Dashboard ist nur für Moderatoren, Admins und Schülersprecher freigeschaltet.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <GlowButton
                as="a"
                href="/admin"
                variant="primary"
                iconLeft={<ArrowLeft className="h-4 w-4" />}
              >
                Zum Admin
              </GlowButton>
              <GlowButton
                as="a"
                href="/"
                variant="secondary"
                iconLeft={<Home className="h-4 w-4" />}
              >
                Zur Startseite
              </GlowButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
