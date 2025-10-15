import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import { ShieldCheck, FileText, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const impressumUrl = "https://www.schulzentrum-oberes-elztal.de/verschiedenes/impressum.html";

  return (
    <footer className="relative mt-12">
      {/* Top gradient divider */}
      <div className="hidden md:block pointer-events-none absolute -top-10 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5" />

      <div className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-3xl ring-1 ring-slate-200/90 dark:ring-slate-700/90 md:ring-black/5 md:dark:ring-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,247,255,0.92))] dark:bg-[linear-gradient(145deg,rgba(36,45,63,0.95),rgba(28,36,52,0.85))] md:bg-white/60 md:dark:bg-slate-900/50 md:backdrop-blur-sm overflow-hidden">
          {/* Decorative strip */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-fuchsia-500" />

          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-base-muted">Jahrbuch – Schulzentrum Oberes Elztal</p>
              <h3 className="text-lg font-semibold text-base-strong">Gemeinsam Erinnerungen festhalten</h3>
              <p className="text-sm text-base-muted">
                Diese Seite wird vom Jahrbuch‑Team der SMV betrieben. Danke an alle, die mitmachen!
              </p>
              <p className="text-sm text-base-muted">
                Fragen, Fehler oder Login geht nicht? Melde dich bei den Schulsprecher:innen (SMV).
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-base-strong mb-3">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/datenschutz" className="text-indigo-600 dark:text-indigo-300 hover:underline inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <a
                    href={impressumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-300 hover:underline inline-flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Impressum
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-base-strong">Schnellzugriff</h4>
              <div className="flex flex-wrap gap-2">
                <GlowButton as="a" href="/login" variant="secondary" className="h-9 px-3 text-sm">
                  Login
                </GlowButton>
                <GlowButton as="a" href="/phase-1" variant="primary" className="h-9 px-3 text-sm">
                  Einsenden
                </GlowButton>
              </div>
              <p className="text-xs text-base-muted">
                © {year} Schulzentrum Oberes Elztal – Jahrbuch. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
