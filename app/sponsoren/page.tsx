import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { Heart, Mail, ArrowRight, Sparkles, Building2, Users, Award } from "lucide-react";

export const metadata = {
  title: "Sponsoren - Jahrbuch Elzach",
  description: "Unsere Sponsoren und Partner unterstützen unser Jahrbuch-Projekt",
};

export default function SponsorenPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-[420px] w-[420px] rounded-full bg-[#d97757]/4 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#e89a7a]/10 border border-[#e89a7a]/20">
            <Heart className="h-4 w-4 text-[#e89a7a]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#e89a7a]">
              Unterstützer & Partner
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#f5f1ed] mb-6">
            Unsere Sponsoren
          </h1>
          <p className="text-lg text-[#b8aea5] max-w-2xl mx-auto leading-relaxed">
            Mit der Unterstützung lokaler Unternehmen und Partner machen wir unser Jahrbuch-Projekt erst möglich.
          </p>
        </div>

        {/* Current Status */}
        <GlassCard className="mb-12">
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#8faf9d]/10 mb-6">
              <Building2 className="h-10 w-10 text-[#8faf9d]" />
            </div>
            <h2 className="text-2xl font-bold text-[#f5f1ed] mb-3">
              Noch keine Sponsoren :/
            </h2>
            <p className="text-[#b8aea5] mb-6 max-w-md mx-auto">
              Wir suchen noch Unterstützer für unser Jahrbuch-Projekt! Möchten Sie Teil unserer Geschichte werden?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:sekretariat@schulzentrumoe.de"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#d97757] to-[#c96846] text-white font-medium hover:from-[#e89a7a] hover:to-[#d97757] transition-all shadow-lg shadow-[#d97757]/20"
              >
                <Mail className="h-4 w-4" />
                sekretariat@schulzentrumoe.de
              </a>
              <Link
                href="/sponsoring/info"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e89a7a]/15 bg-[#2a2520]/60 text-[#f5f1ed] font-medium hover:border-[#e89a7a]/30 hover:bg-[#2a2520]/80 transition-all"
              >
                Mehr erfahren
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </GlassCard>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <GlassCard hover={true}>
            <div className="text-center py-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e89a7a]/10 mb-4">
                <Award className="h-7 w-7 text-[#e89a7a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#f5f1ed] mb-2">
                Sichtbarkeit
              </h3>
              <p className="text-sm text-[#b8aea5] leading-relaxed">
                Ihr Logo im gedruckten Jahrbuch und auf der Website
              </p>
            </div>
          </GlassCard>

          <GlassCard hover={true}>
            <div className="text-center py-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8faf9d]/10 mb-4">
                <Users className="h-7 w-7 text-[#8faf9d]" />
              </div>
              <h3 className="text-lg font-semibold text-[#f5f1ed] mb-2">
                Reichweite
              </h3>
              <p className="text-sm text-[#b8aea5] leading-relaxed">
                Erreichen Sie Schüler, Eltern und die lokale Gemeinschaft
              </p>
            </div>
          </GlassCard>

          <GlassCard hover={true}>
            <div className="text-center py-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d97757]/10 mb-4">
                <Sparkles className="h-7 w-7 text-[#d97757]" />
              </div>
              <h3 className="text-lg font-semibold text-[#f5f1ed] mb-2">
                Unterstützung
              </h3>
              <p className="text-sm text-[#b8aea5] leading-relaxed">
                Helfen Sie, unvergessliche Erinnerungen zu schaffen
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Call to Action */}
        <GlassCard className="bg-gradient-to-br from-[#2a2520]/95 to-[#38302b]/90">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-[#f5f1ed] mb-3">
              Werden Sie Sponsor
            </h2>
            <p className="text-[#b8aea5] mb-6 max-w-lg mx-auto">
              Interessiert an einer Partnerschaft? Kontaktieren Sie uns für weitere Informationen über unsere Sponsoring-Möglichkeiten.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sponsoring/info"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#d97757] to-[#c96846] text-white font-medium hover:from-[#e89a7a] hover:to-[#d97757] transition-all shadow-lg shadow-[#d97757]/20"
              >
                Informationen ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

