import GlassCard from "@/components/ui/GlassCard";
import { Hourglass } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Phase2Page() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#faf8f5] via-[#faf4ed] to-[#f5ede3] dark:from-[#1a1714] dark:via-[#221e1a] dark:to-[#1a1714] flex items-center justify-center">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#d97757]/8 dark:bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-[#7a9b88]/6 dark:bg-[#8faf9d]/5 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#b8957a]/10 dark:bg-[#c9a68a]/10 text-[#b8957a] dark:text-[#c9a68a] mb-6">
            <Hourglass className="h-10 w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-3">
            Phase 2 – Auswählen
          </h1>
          <p className="text-lg text-[#6b635a] dark:text-[#b8aea5]">
            Die Abstimmungsphase startet in Kürze
          </p>
        </div>

        <GlassCard hover>
          <div className="py-8 space-y-4">
            <p className="text-[#6b635a] dark:text-[#b8aea5]">
              Diese Phase ist derzeit in Vorbereitung. Bald könnt ihr gemeinsam abstimmen, welche Beiträge ins Jahrbuch kommen.
            </p>
            <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">
              Schaut später nochmal vorbei oder lasst euch von der SMV informieren!
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
