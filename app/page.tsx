import ParallaxHero from "@/components/ParallaxHero";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import TiltCard from "@/components/ui/TiltCard";
import {
  Lock,
  Send,
  BookOpen,
  Users,
  ImageIcon,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Home() {
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
          <TiltCard>
            <GlassCard delay={0}>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97757] to-[#c96846] flex items-center justify-center text-white shadow-lg">
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7a9b88]/15 dark:bg-[#8faf9d]/15 border border-[#7a9b88]/20 dark:border-[#8faf9d]/20">
                  <div className="w-2 h-2 bg-[#7a9b88] dark:bg-[#8faf9d] rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-[#7a9b88] dark:text-[#8faf9d]">
                    Jetzt aktiv
                  </span>
                </div>
              </div>
            </GlassCard>
          </TiltCard>

          <TiltCard>
            <GlassCard delay={0.1}>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#b8957a] to-[#a88568] flex items-center justify-center text-white shadow-lg">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#b8957a] dark:text-[#c9a68a] uppercase tracking-wider mb-1">
                      Phase 2
                    </div>
                    <h3 className="text-xl font-bold text-[#2a2520] dark:text-[#f5f1ed]">
                      Auswählen
                    </h3>
                  </div>
                </div>
                <p className="text-[#6b635a] dark:text-[#b8aea5] leading-relaxed">
                  Gemeinsam entscheiden wir demokratisch, welche Beiträge ins
                  Jahrbuch kommen.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6b635a]/10 dark:bg-[#b8aea5]/10 border border-[#6b635a]/15 dark:border-[#b8aea5]/15">
                  <span className="text-xs font-medium text-[#6b635a] dark:text-[#b8aea5]">
                    Bald verfügbar
                  </span>
                </div>
              </div>
            </GlassCard>
          </TiltCard>

          <TiltCard>
            <GlassCard delay={0.2}>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7a9b88] to-[#6a8b78] flex items-center justify-center text-white shadow-lg">
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6b635a]/10 dark:bg-[#b8aea5]/10 border border-[#6b635a]/15 dark:border-[#b8aea5]/15">
                  <span className="text-xs font-medium text-[#6b635a] dark:text-[#b8aea5]">
                    In Planung
                  </span>
                </div>
              </div>
            </GlassCard>
          </TiltCard>
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
