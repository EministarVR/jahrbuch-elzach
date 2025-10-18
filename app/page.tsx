import ParallaxHero from "@/components/ParallaxHero";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { getPhaseSettings } from "@/lib/phases";
import { ensurePhaseSettings } from "@/lib/migrations";
import Link from "next/link";
import {
  Lock,
  Send,
  BookOpen,
  Users,
  ImageIcon,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Wrench,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensurePhaseSettings();
  const phaseSettings = await getPhaseSettings();

  // Dynamische Status für die Phasen
  const phase1 = phaseSettings.find(p => p.phase_key === 'phase-1');
  const phase2 = phaseSettings.find(p => p.phase_key === 'phase-2');
  const phase3 = phaseSettings.find(p => p.phase_key === 'phase-3');

  return (
    <main className="min-h-dvh">
      <ParallaxHero
        eyebrow="Jahrbuch 2025/2026"
        title="Schulzentrum Oberes Elztal"
        subtitle="Gemeinsam schaffen wir etwas Besonderes – ein Jahrbuch voller Erinnerungen, das uns für immer begleiten wird. Teile deine schönsten Momente mit uns."
        cta={
          <>
            <GlowButton
              variant="gradient"
              as="a"
              href="/phase-1"
              iconLeft={<Send className="h-4 w-4" />}
            >
              Jetzt beitragen
            </GlowButton>
            <GlowButton
              as="a"
              href="/login"
              variant="secondary"
              iconLeft={<Lock className="h-4 w-4" />}
            >
              Anmelden
            </GlowButton>
          </>
        }
      />

      {/* Warum mitmachen? */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-4">
            Warum mitmachen?
          </h2>
          <p className="text-lg text-[#6b635a] dark:text-[#b8aea5] max-w-2xl mx-auto">
            Dein Beitrag macht unser Jahrbuch zu etwas ganz Besonderem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="h-7 w-7" />,
              title: "Erinnerungen bewahren",
              text: "Halte die schönsten Momente deiner Schulzeit für immer fest.",
              color: "from-[#d97757] to-[#c96846]",
            },
            {
              icon: <Users className="h-7 w-7" />,
              title: "Gemeinsam gestalten",
              text: "Jeder kann mitmachen und seine persönliche Geschichte teilen.",
              color: "from-[#7a9b88] to-[#6a8b78]",
            },
            {
              icon: <ImageIcon className="h-7 w-7" />,
              title: "Kreativ sein",
              text: "Fotos, Texte, Geschichten – deiner Kreativität sind keine Grenzen gesetzt.",
              color: "from-[#c96846] to-[#b85836]",
            },
          ].map((item, i) => (
            <GlassCard key={item.title} delay={i * 0.1}>
              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                >
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl text-[#2a2520] dark:text-[#f5f1ed]">
                  {item.title}
                </h3>
                <p className="text-[#6b635a] dark:text-[#b8aea5] leading-relaxed">
                  {item.text}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Browse & Abstimmen CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <GlassCard delay={0}>
          <div className="text-center space-y-8 py-8">
            <div className="flex justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7a9b88] to-[#6a8b78] flex items-center justify-center text-white shadow-lg">
                <ThumbsUp className="h-8 w-8" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d97757] to-[#c96846] flex items-center justify-center text-white shadow-lg">
                <MessageSquare className="h-8 w-8" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-4">
                Beiträge bewerten & kommentieren
              </h2>
              <p className="text-lg text-[#6b635a] dark:text-[#b8aea5] max-w-2xl mx-auto leading-relaxed">
                Schau dir die eingereichten Beiträge an, stimme für deine Favoriten ab und teile deine Gedanken in den Kommentaren.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <GlowButton
                as="a"
                href="/browse"
                variant="gradient"
                className="text-lg px-8 py-4"
                iconLeft={<ThumbsUp className="h-5 w-5" />}
              >
                Jetzt Beiträge durchstöbern
                <ArrowRight className="h-5 w-5 ml-1" />
              </GlowButton>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-8">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#7a9b88]/15 flex items-center justify-center text-[#7a9b88] dark:text-[#8faf9d] flex-shrink-0">
                  <ThumbsUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2a2520] dark:text-[#f5f1ed] mb-1">
                    Abstimmen
                  </h3>
                  <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">
                    Unterstütze die besten Beiträge mit deiner Stimme
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#d97757]/15 flex items-center justify-center text-[#d97757] dark:text-[#e89a7a] flex-shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2a2520] dark:text-[#f5f1ed] mb-1">
                    Kommentieren
                  </h3>
                  <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">
                    Hinterlasse Feedback und tausche dich mit anderen aus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Prozess */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-4">
            So entsteht euer Jahrbuch
          </h2>
          <p className="text-lg text-[#6b635a] dark:text-[#b8aea5] max-w-2xl mx-auto">
            In drei einfachen Schritten von der Idee zum fertigen Jahrbuch
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Link href="/phase-1" className="block group">
            <GlassCard delay={0} hover>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97757] to-[#c96846] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Send className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#d97757] dark:text-[#e89a7a] uppercase tracking-wider mb-1">
                      Phase 1
                    </div>
                    <h3 className="text-xl font-bold text-[#2a2520] dark:text-[#f5f1ed]">
                      Einreichen
                    </h3>
                  </div>
                </div>
                <p className="text-[#6b635a] dark:text-[#b8aea5] leading-relaxed">
                  Teile deine schönsten Fotos, Geschichten und Erinnerungen aus
                  diesem Schuljahr mit uns.
                </p>
                {phase1?.status === 'development' ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff9800]/10 dark:bg-[#ffb74d]/10 border border-[#ff9800]/20 dark:border-[#ffb74d]/20">
                    <Wrench className="h-3 w-3 text-[#ff9800] dark:text-[#ffb74d]" />
                    <span className="text-xs font-medium text-[#ff9800] dark:text-[#ffb74d]">
                      In Entwicklung
                    </span>
                  </div>
                ) : phase1?.enabled ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7a9b88]/15 dark:bg-[#8faf9d]/15 border border-[#7a9b88]/20 dark:border-[#8faf9d]/20">
                    <div className="w-2 h-2 bg-[#7a9b88] dark:bg-[#8faf9d] rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-[#7a9b88] dark:text-[#8faf9d]">
                      Jetzt aktiv
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6b635a]/10 dark:bg-[#b8aea5]/10 border border-[#6b635a]/15 dark:border-[#b8aea5]/15">
                    <span className="text-xs font-medium text-[#6b635a] dark:text-[#b8aea5]">
                      Noch nicht verfügbar
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </Link>

          <Link href="/phase-2" className="block group">
            <GlassCard delay={0.1} hover>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#b8957a] to-[#a88568] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#b8957a] dark:text-[#c9a68a] uppercase tracking-wider mb-1">
                      Phase 2
                    </div>
                    <h3 className="text-xl font-bold text-[#2a2520] dark:text-[#f5f1ed]">
                      Abstimmen
                    </h3>
                  </div>
                </div>
                <p className="text-[#6b635a] dark:text-[#b8aea5] leading-relaxed">
                  Stimme über verschiedene Jahrbuch-Themen ab und hilf bei wichtigen Entscheidungen.
                </p>
                {phase2?.status === 'development' ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff9800]/10 dark:bg-[#ffb74d]/10 border border-[#ff9800]/20 dark:border-[#ffb74d]/20">
                    <Wrench className="h-3 w-3 text-[#ff9800] dark:text-[#ffb74d]" />
                    <span className="text-xs font-medium text-[#ff9800] dark:text-[#ffb74d]">
                      In Entwicklung
                    </span>
                  </div>
                ) : phase2?.enabled ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7a9b88]/15 dark:bg-[#8faf9d]/15 border border-[#7a9b88]/20 dark:border-[#8faf9d]/20">
                    <div className="w-2 h-2 bg-[#7a9b88] dark:bg-[#8faf9d] rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-[#7a9b88] dark:text-[#8faf9d]">
                      Jetzt aktiv
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6b635a]/10 dark:bg-[#b8aea5]/10 border border-[#6b635a]/15 dark:border-[#6b635a]/15">
                    <span className="text-xs font-medium text-[#6b635a] dark:text-[#b8aea5]">
                      Bald verfügbar
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </Link>

          <Link href="/phase-3" className="block group">
            <GlassCard delay={0.2} hover>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7a9b88] to-[#6a8b78] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#7a9b88] dark:text-[#8faf9d] uppercase tracking-wider mb-1">
                      Phase 3
                    </div>
                    <h3 className="text-xl font-bold text-[#2a2520] dark:text-[#f5f1ed]">
                      Fertigstellen
                    </h3>
                  </div>
                </div>
                <p className="text-[#6b635a] dark:text-[#b8aea5] leading-relaxed">
                  Das Jahrbuch-Team gestaltet alles liebevoll und bringt eure
                  Erinnerungen zu Papier.
                </p>
                {phase3?.status === 'development' ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff9800]/10 dark:bg-[#ffb74d]/10 border border-[#ff9800]/20 dark:border-[#ffb74d]/20">
                    <Wrench className="h-3 w-3 text-[#ff9800] dark:text-[#ffb74d]" />
                    <span className="text-xs font-medium text-[#ff9800] dark:text-[#ffb74d]">
                      In Entwicklung
                    </span>
                  </div>
                ) : phase3?.enabled ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7a9b88]/15 dark:bg-[#8faf9d]/15 border border-[#7a9b88]/20 dark:border-[#8faf9d]/20">
                    <div className="w-2 h-2 bg-[#7a9b88] dark:bg-[#8faf9d] rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-[#7a9b88] dark:text-[#8faf9d]">
                      Jetzt aktiv
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6b635a]/10 dark:bg-[#b8aea5]/10 border border-[#6b635a]/15 dark:border-[#b8aea5]/15">
                    <span className="text-xs font-medium text-[#6b635a] dark:text-[#b8aea5]">
                      In Planung
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </Link>
        </div>

        <div className="text-center mt-16">
          <GlowButton
            as="a"
            href="/phase-1"
            variant="gradient"
            className="text-lg px-8 py-4"
            iconLeft={<Send className="h-5 w-5" />}
          >
            Jetzt mitmachen
            <ArrowRight className="h-5 w-5 ml-1" />
          </GlowButton>
        </div>
      </section>
    </main>
  );
}
