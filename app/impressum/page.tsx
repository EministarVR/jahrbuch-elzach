import FancyHeading from "@/components/ui/FancyHeading";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import TiltCard from "@/components/ui/TiltCard";
import { FileText, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const IMPRESSUM_URL = "https://www.schulzentrum-oberes-elztal.de/verschiedenes/impressum.html";

export default function ImpressumPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50 to-white md:from-indigo-50/70 dark:from-slate-950 dark:to-slate-900">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-400/25 via-indigo-500/15 to-sky-400/25 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25 blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <FancyHeading center subtitle="Rechtliche Angaben zum Schulzentrum Oberes Elztal.">
          Impressum
        </FancyHeading>

        <TiltCard>
          <GlassCard
            header={
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-base-strong">Impressum der Schule</h3>
                  <p className="text-sm text-base-muted">Die vollständigen Angaben finden Sie auf der offiziellen Schul‑Website.</p>
                </div>
              </div>
            }
            footer={
              <div className="flex items-center justify-between flex-wrap gap-3">
                <GlowButton as="a" href={IMPRESSUM_URL} target="_blank" rel="noopener noreferrer" variant="primary" className="h-11">
                  Zur Impressum‑Seite
                  <ExternalLink className="ml-2 h-4 w-4" />
                </GlowButton>
                <p className="text-xs text-base-muted">Öffnet in einem neuen Tab</p>
              </div>
            }
          >
            <div className="space-y-4 text-sm text-base-muted">
              <p>
                Für das Jahrbuch‑Projekt verweisen wir auf das offizielle Impressum des
                Schulzentrums Oberes Elztal. Dort finden Sie alle Pflichtangaben und Kontakt‑Informationen.
              </p>
              <p>
                Diese Website ist ein Projekt des Jahrbuch‑Teams der SMV und nutzt die in der Schule
                bereitgestellten rechtlichen Rahmenangaben.
              </p>
            </div>
          </GlassCard>
        </TiltCard>
      </div>
    </div>
  );
}
