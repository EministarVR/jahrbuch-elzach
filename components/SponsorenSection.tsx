"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { Heart, Mail, ArrowRight, Building2 } from "lucide-react";

export default function SponsorenSection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#e89a7a]/10 border border-[#e89a7a]/20">
            <Heart className="h-4 w-4 text-[#e89a7a]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#e89a7a]">
              Unterstützer
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f1ed] mb-4">
            Unsere Sponsoren
          </h2>
          <p className="text-lg text-[#b8aea5] max-w-2xl mx-auto">
            Mit der Unterstützung lokaler Partner machen wir unser Jahrbuch möglich.
          </p>
        </div>

        <GlassCard hover={false}>
          <div className="text-center py-12">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8faf9d]/10 mb-4">
              <Building2 className="h-8 w-8 text-[#8faf9d]" />
            </div>
            <h3 className="text-xl font-bold text-[#f5f1ed] mb-3">
              Noch keine Sponsoren :/
            </h3>
            <p className="text-[#b8aea5] mb-6 max-w-md mx-auto">
              Wir suchen noch Unterstützer für unser Jahrbuch-Projekt!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-sm text-[#b8aea5]">Bei Interesse:</p>
              <a
                href="mailto:sekretariat@schulzentrumoe.de"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#d97757] to-[#c96846] text-white font-medium hover:from-[#e89a7a] hover:to-[#d97757] transition-all shadow-lg shadow-[#d97757]/20 text-sm"
              >
                <Mail className="h-4 w-4" />
                sekretariat@schulzentrumoe.de
              </a>
            </div>
            <div className="mt-6">
              <Link
                href="/sponsoring/info"
                className="inline-flex items-center gap-2 text-sm text-[#e89a7a] hover:text-[#e89a7a]/80 transition-colors"
              >
                Mehr über Sponsoring erfahren
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

