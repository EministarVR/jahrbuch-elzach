import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import TiltCard from "@/components/ui/TiltCard";
import FancyHeading from "@/components/ui/FancyHeading";
import MotionFade from "@/components/ui/MotionFade";
import {
  Newspaper,
  Rocket,
  Hourglass,
  Lock,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-dvh">
      <ParallaxHero
        eyebrow="Jahrbuch 20XX"
        title="Schulzentrum Oberes Elztal"
        subtitle="Ein hochwertiger Rückblick auf unser Schuljahr – gestaltet vom Jahrbuch‑Team der SMV. Reiche jetzt deine Erinnerungen ein und werde Teil davon."
        cta={
          <>
            <GlowButton
              as="a"
              href="/login"
              iconLeft={<Lock className="h-4 w-4" />}
            >
              Login
            </GlowButton>
            <GlowButton
              variant="gradient"
              as="a"
              href="/phase-1"
              iconLeft={<Send className="h-4 w-4" />}
            >
              Jetzt einsenden
            </GlowButton>
          </>
        }
      />

      <section className="max-w-5xl mx-auto px-5 py-16">
        <FancyHeading subtitle="Warum machen wir das alles? Ein Jahr voller Momente, die nicht verloren gehen sollen.">
          Was ist das Jahrbuch?
        </FancyHeading>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            {
              icon: <Newspaper className="h-6 w-6" />,
              title: "Rückblick",
              text: "Ein kuratiertes Buch mit Highlights, Zitaten und Fotos.",
            },
            {
              icon: <Rocket className="h-6 w-6" />,
              title: "Mitmachen",
              text: "Alle können Inhalte in Phase 1 einreichen.",
            },
            {
              icon: <CheckCircle2 className="h-6 w-6" />,
              title: "Gemeinsam",
              text: "Abstimmung & finale Auswahl in den nächsten Phasen.",
            },
          ].map((f, i) => (
            <GlassCard key={f.title} delay={i * 0.08}>
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 ring-1 ring-indigo-500/30">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-medium text-base-strong mb-1">
                    {f.title}
                  </h3>
                  <p className="text-base-muted text-sm leading-relaxed">
                    {f.text}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <FancyHeading subtitle="Der Weg von der Einreichung bis zur finalen Print-Version.">
          Phasen
        </FancyHeading>
        <div className="grid gap-6 md:grid-cols-3">
          <TiltCard>
            <GlassCard delay={0}>
              <h3 className="text-base-strong font-medium flex items-center gap-2">
                <Send className="h-4 w-4" /> Phase 1 – Aktiv
              </h3>
              <p className="text-base-muted mt-2 text-sm">
                Sende jetzt deinen Text ein.
              </p>
              <GlowButton
                as="a"
                href="/phase-1"
                className="mt-4"
                variant="primary"
                iconLeft={<Send className="h-4 w-4" />}
              >
                Zur Phase 1
              </GlowButton>
            </GlassCard>
          </TiltCard>
          <TiltCard>
            <GlassCard delay={0.1}>
              <h3 className="text-base-strong font-medium flex items-center gap-2">
                <Hourglass className="h-4 w-4" /> Phase 2 – Bald
              </h3>
              <p className="text-base-muted mt-2 text-sm">
                Abstimmung startet bald.
              </p>
              <GlowButton
                as="a"
                href="/phase-2"
                className="mt-4"
                variant="secondary"
              >
                Mehr
              </GlowButton>
            </GlassCard>
          </TiltCard>
          <TiltCard>
            <GlassCard delay={0.2}>
              <h3 className="text-base-strong font-medium flex items-center gap-2">
                <Rocket className="h-4 w-4" /> Phase 3 – Bald
              </h3>
              <p className="text-base-muted mt-2 text-sm">
                Bekanntgaben folgen.
              </p>
              <GlowButton
                as="a"
                href="/phase-3"
                className="mt-4"
                variant="secondary"
              >
                Mehr
              </GlowButton>
            </GlassCard>
          </TiltCard>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-12">
        <FancyHeading subtitle="Kurze Hinweise und später: echte Updates.">
          Neuigkeiten
        </FancyHeading>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} delay={i * 0.1 + 0.05}>
              <div className="text-sm text-base-muted flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> News {i}
              </div>
              <div className="text-base-strong mt-2 text-sm">
                Demnächst mehr...
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

    </main>
  );
}
