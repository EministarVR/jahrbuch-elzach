import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import { ShieldCheck, FileText, ExternalLink, BookOpen, Mail, HelpCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const impressumUrl = "https://www.schulzentrum-oberes-elztal.de/verschiedenes/impressum.html";

  return (
    <footer className="relative mt-32 mb-8">
      {/* Elegante Trennlinie */}
      <div className="mx-auto max-w-6xl px-6 mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#d97757]/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12 mb-12">
          {/* Hauptbereich */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d97757] to-[#c96846] flex items-center justify-center text-white shadow-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Jahrbuch 2025/26</h3>
                <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">Schulzentrum Oberes Elztal</p>
              </div>
            </div>
            <p className="text-sm text-[#6b635a] dark:text-[#b8aea5] leading-relaxed max-w-sm">
              Ein Projekt der SMV – mit Herz und Leidenschaft erstellt, um eure schönsten Erinnerungen festzuhalten.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-[#2a2520] dark:text-[#f5f1ed] mb-4 uppercase tracking-wider">
              Rechtliches
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-[#6b635a] dark:text-[#b8aea5] hover:text-[#d97757] dark:hover:text-[#e89a7a] transition-colors inline-flex items-center gap-2 group"
                >
                  <HelpCircle className="w-4 h-4" />
                  FAQ & Hilfe
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-sm text-[#6b635a] dark:text-[#b8aea5] hover:text-[#d97757] dark:hover:text-[#e89a7a] transition-colors inline-flex items-center gap-2 group"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Datenschutz
                </Link>
              </li>
              <li>
                <a
                  href={impressumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#6b635a] dark:text-[#b8aea5] hover:text-[#d97757] dark:hover:text-[#e89a7a] transition-colors inline-flex items-center gap-2 group"
                >
                  <FileText className="w-4 h-4" />
                  Impressum
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* CTA Bereich */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold text-[#2a2520] dark:text-[#f5f1ed] mb-4 uppercase tracking-wider">
              Mitmachen
            </h4>
            <p className="text-sm text-[#6b635a] dark:text-[#b8aea5] mb-4 leading-relaxed">
              Teile deine Erinnerungen und werde Teil unseres Jahrbuchs.
            </p>
            <GlowButton
              as="a"
              href="/phase-1"
              variant="gradient"
              className="w-full sm:w-auto"
            >
              Jetzt beitragen
            </GlowButton>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#d97757]/10 dark:border-[#e89a7a]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b635a] dark:text-[#b8aea5]">
            <p>© {year} Jahrbuch-Team SMV · Schulzentrum Oberes Elztal</p>
            <p className="flex items-center gap-2">
              <Mail className="w-3 h-3" />
              Bei Fragen wende dich an die SMV
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
