import FancyHeading from "@/components/ui/FancyHeading";
import GlassCard from "@/components/ui/GlassCard";

export const dynamic = "force-dynamic";

export default function Phase2Page() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <FancyHeading center subtitle="Abstimmung startet bald.">
          Phase 2
        </FancyHeading>
        <GlassCard>
          <p className="text-sm text-base-muted">Diese Phase ist in Vorbereitung. Schau später nochmal vorbei.</p>
        </GlassCard>
      </div>
    </div>
  );
}
