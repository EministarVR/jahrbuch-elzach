import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { SearchX, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714] flex items-center justify-center">
      {/* Subtile Hintergrundeffekte */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-[#8faf9d]/5 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e89a7a]/10 text-[#e89a7a] mb-6">
            <SearchX className="h-10 w-10" />
          </div>
          <h1 className="text-6xl font-bold text-[#f5f1ed] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#f5f1ed] mb-3">
            Seite nicht gefunden
          </h2>
          <p className="text-lg text-[#b8aea5]">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
        </div>

        <GlassCard hover>
          <div className="py-6 space-y-6">
            <p className="text-[#b8aea5]">
              Vielleicht wurde die Adresse falsch eingegeben oder die Seite wurde
              entfernt.
            </p>
            <GlowButton
              as="a"
              href="/"
              variant="gradient"
              iconLeft={<Home className="h-4 w-4" />}
            >
              Zurück zur Startseite
            </GlowButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
