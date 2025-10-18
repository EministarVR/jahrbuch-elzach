import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import TiltCard from "@/components/ui/TiltCard";
import { FileText, ExternalLink, Home } from "lucide-react";

export const dynamic = "force-dynamic";

const IMPRESSUM_URL = "https://www.schulzentrum-oberes-elztal.de/verschiedenes/impressum.html";

export default function ImpressumPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f1ed] mb-4">
            Impressum
          </h1>
          <p className="text-lg text-[#b8aea5] max-w-2xl mx-auto">
            Rechtliche Angaben zum Schulzentrum Oberes Elztal
          </p>
        </div>

        <TiltCard>
          <GlassCard
            header={
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f1ed]">Impressum der Schule</h3>
                  <p className="text-sm text-[#b8aea5]">Die vollständigen Angaben finden Sie auf der offiziellen Schul-Website.</p>
                </div>
              </div>
            }
          >
            <div className="space-y-6 text-sm text-[#b8aea5] leading-relaxed">
              <p>
                Für das Jahrbuch-Projekt verweisen wir auf das offizielle Impressum des
                Schulzentrums Oberes Elztal. Dort finden Sie alle Pflichtangaben und Kontakt-Informationen.
              </p>
              <p>
                Dieses Jahrbuch-Portal wird von der SMV betreut und ist ein schulinternes Projekt.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <GlowButton
                  as="a"
                  href={IMPRESSUM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="gradient"
                  iconLeft={<ExternalLink className="h-4 w-4" />}
                >
                  Zur Impressum-Seite
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
              <p className="text-xs text-[#b8aea5] pt-2">
                Der Link öffnet sich in einem neuen Tab
              </p>
            </div>
          </GlassCard>
        </TiltCard>
      </div>
    </div>
  );
}
